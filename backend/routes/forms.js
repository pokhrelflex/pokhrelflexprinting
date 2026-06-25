const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const { sendContactEmail, sendNewsletterEmail, sendInquiryEmail } = require('../services/emailService');
const { sendContactWhatsApp } = require('../services/whatsappService');

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Forms API is healthy',
    db: FormSubmission ? 'connected' : 'unavailable',
    timestamp: new Date().toISOString()
  });
});

async function saveSubmission(formType, data) {
  if (!FormSubmission) {
    console.warn('⚠️ DB not available — skipping form submission save');
    return null;
  }
  try {
    const submission = await FormSubmission.create({ formType, data });
    return submission.token;
  } catch (err) {
    console.error('⚠️ Failed to save form submission to DB:', err.message);
    return null;
  }
}

// Run notification senders without letting one failed channel reject the
// whole request. Logs each failure and reports whether the primary channel
// (email) actually went out.
async function notify(label, senders) {
  const results = await Promise.allSettled(senders.map((s) => s.fn()));
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`⚠️ ${label} via ${senders[i].name} failed:`, r.reason?.message || r.reason);
    }
  });
  // senders[0] is always the email channel.
  return { emailSent: results[0]?.status === 'fulfilled' };
}

// Submit Contact form
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, phone, country, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    // Persist first so a notification outage never loses the lead.
    const token = await saveSubmission('contact', req.body);

    const { emailSent } = await notify('Contact', [
      { name: 'email', fn: () => sendContactEmail({ name, email, phone, country, message }) },
      { name: 'whatsapp', fn: () => sendContactWhatsApp({ name, email, phone, country, message }) },
    ]);

    if (!token && !emailSent) {
      return res.status(502).json({
        success: false,
        message: 'We could not deliver your message right now. Please email or call us directly.',
      });
    }

    res.json({
      success: true,
      message: 'Message sent successfully',
      ...(token && { token }),
    });
  } catch (error) {
    next(error);
  }
});

// Submit newsletter subscription
router.post('/newsletter', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required',
      });
    }

    const token = await saveSubmission('newsletter', { email });
    const { emailSent } = await notify('Newsletter', [
      { name: 'email', fn: () => sendNewsletterEmail({ email }) },
    ]);

    if (!token && !emailSent) {
      return res.status(502).json({
        success: false,
        message: 'Could not record your subscription right now. Please try again shortly.',
      });
    }

    res.json({
      success: true,
      message: 'Subscription received successfully',
      ...(token && { token }),
    });
  } catch (error) {
    next(error);
  }
});

// Submit product inquiry
router.post('/inquiry', async (req, res, next) => {
  try {
    const { name, email, product, quantity, message } = req.body;

    if (!name || !email || !product) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and product type are required',
      });
    }

    const token = await saveSubmission('inquiry', req.body);
    const { emailSent } = await notify('Inquiry', [
      { name: 'email', fn: () => sendInquiryEmail({ name, email, product, quantity, message }) },
    ]);

    if (!token && !emailSent) {
      return res.status(502).json({
        success: false,
        message: 'We could not submit your inquiry right now. Please try again shortly.',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry submitted successfully',
      ...(token && { token }),
    });
  } catch (error) {
    next(error);
  }
});

// Get submission by token
router.get('/submission/:token', async (req, res, next) => {
  try {
    if (!FormSubmission) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }
    const submission = await FormSubmission.findOne({ where: { token: req.params.token } });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    res.json({ success: true, submission });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
