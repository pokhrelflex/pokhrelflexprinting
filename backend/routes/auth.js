const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const EmailOtp = require('../models/EmailOtp');
const { sendOtpEmail } = require('../services/emailService');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// OTP tuning
const OTP_TTL_MS = 10 * 60 * 1000;      // codes valid for 10 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // min gap between sends to one address
const OTP_MAX_ATTEMPTS = 5;             // wrong guesses before a code is burned
const OTP_PURPOSES = ['email_verify', 'login', 'reset'];

const normalizeEmail = (v) => String(v || '').trim().toLowerCase();
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Public: does an account exist for this email OR username? Used by the login
// form to decide whether to ask for a password or prompt the user to register.
// Returns the resolved email so the client can sign in (Supabase signs in by
// email, not username).
router.post('/check-email', async (req, res) => {
  const identifier = (req.body?.email || req.body?.identifier || '').trim().toLowerCase();
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Email or username is required.' });
  }
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Auth is not configured on the server.' });
  }

  try {
    let matched = null;
    let page = 1;
    // Page through the user list (admin app → few users) until found.
    while (page <= 10) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
      matched = data.users.find((u) => {
        const byEmail = u.email && u.email.toLowerCase() === identifier;
        const username = u.user_metadata?.username;
        const byUsername = username && String(username).toLowerCase() === identifier;
        return byEmail || byUsername;
      });
      if (matched || data.users.length < 1000) break;
      page++;
    }
    return res.json({ success: true, exists: !!matched, email: matched?.email || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Request a one-time code by email. Generates a 6-digit code, stores only its
// bcrypt hash, and emails the plaintext via Resend. Rate-limited per address.
router.post('/request-otp', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const purpose = OTP_PURPOSES.includes(req.body?.purpose) ? req.body.purpose : 'email_verify';

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }
    if (!EmailOtp) {
      return res.status(503).json({ success: false, message: 'OTP storage is unavailable.' });
    }

    // Cooldown: refuse if a code was issued to this address very recently.
    const recent = await EmailOtp.findOne({
      where: { email, purpose },
      order: [['createdAt', 'DESC']],
    });
    if (recent && Date.now() - new Date(recent.createdAt).getTime() < OTP_RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((OTP_RESEND_COOLDOWN_MS - (Date.now() - new Date(recent.createdAt).getTime())) / 1000);
      return res.status(429).json({ success: false, message: `Please wait ${wait}s before requesting another code.` });
    }

    const code = String(require('crypto').randomInt(100000, 1000000));
    const codeHash = await bcrypt.hash(code, 10);

    await EmailOtp.create({
      email,
      codeHash,
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    await sendOtpEmail({ email, code, purpose });

    return res.json({ success: true, message: 'A verification code has been sent to your email.' });
  } catch (err) {
    next(err);
  }
});

// Verify a code. On success, marks it consumed and returns a short-lived JWT
// the client can present to prove the email was verified.
router.post('/verify-otp', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const code = String(req.body?.code || '').trim();
    const purpose = OTP_PURPOSES.includes(req.body?.purpose) ? req.body.purpose : 'email_verify';

    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Email and a 6-digit code are required.' });
    }
    if (!EmailOtp) {
      return res.status(503).json({ success: false, message: 'OTP storage is unavailable.' });
    }

    const otp = await EmailOtp.findOne({
      where: { email, purpose, consumedAt: null },
      order: [['createdAt', 'DESC']],
    });

    if (!otp) {
      return res.status(400).json({ success: false, message: 'No active code. Please request a new one.' });
    }
    if (new Date(otp.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'This code has expired. Please request a new one.' });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new code.' });
    }

    const match = await bcrypt.compare(code, otp.codeHash);
    if (!match) {
      await otp.increment('attempts');
      return res.status(400).json({ success: false, message: 'Incorrect code. Please try again.' });
    }

    otp.consumedAt = new Date();
    await otp.save();

    const secret = process.env.JWT_SECRET || process.env.OTP_SECRET;
    const verificationToken = secret
      ? jwt.sign({ email, purpose, scope: 'email_verified' }, secret, { expiresIn: '15m' })
      : null;

    return res.json({ success: true, verified: true, ...(verificationToken && { verificationToken }) });
  } catch (err) {
    next(err);
  }
});

// Find a Supabase user by email (admin API, pages through the list).
async function findUserByEmail(email) {
  let page = 1;
  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    const user = data.users.find((u) => (u.email || '').toLowerCase() === email);
    if (user) return user;
    if (data.users.length < 1000) return null;
    page++;
  }
  return null;
}

// Complete a password reset. Requires the short-lived JWT returned by
// /verify-otp (purpose 'reset'), proving the caller owns the email. The user
// has no session (forgot password), so we set the password with the admin API.
router.post('/reset-password', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const token = String(req.body?.token || '');
    const password = String(req.body?.password || '');

    if (!isValidEmail(email) || !token || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Email, token, and a valid password are required.' });
    }
    if (!supabase) {
      return res.status(500).json({ success: false, message: 'Auth is not configured on the server.' });
    }

    const secret = process.env.JWT_SECRET || process.env.OTP_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server is missing JWT_SECRET.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      return res.status(401).json({ success: false, message: 'Reset link expired. Please request a new code.' });
    }
    if (payload.scope !== 'email_verified' || payload.purpose !== 'reset' || payload.email !== email) {
      return res.status(401).json({ success: false, message: 'Invalid reset token.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for this email.' });
    }

    const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({ success: true, message: 'Password updated. You can now sign in.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
