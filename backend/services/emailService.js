const { Resend } = require('resend');
const { getNext } = require('../models/Counter');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// "Pokhrel Flex Printing <noreply@pokhrelflexprinting.com>" — must be on a
// domain verified in the Resend dashboard.
const FROM = process.env.EMAIL_FROM || 'Pokhrel Flex Printing <onboarding@resend.dev>';

// React Email renderer + templates are ESM .jsx; load them once via dynamic
// import (memoized) so this CommonJS module can use them. The backend runs
// under `tsx`, which transpiles the JSX at runtime.
let _email;
async function templates() {
  if (!_email) {
    const [render, contact, newsletter, inquiry, otp] = await Promise.all([
      import('@react-email/render'),
      import('../emails/ContactEmail.jsx'),
      import('../emails/NewsletterEmail.jsx'),
      import('../emails/InquiryEmail.jsx'),
      import('../emails/OtpEmail.jsx'),
    ]);
    _email = {
      render: render.render,
      ContactEmail: contact.ContactEmail,
      NewsletterEmail: newsletter.NewsletterEmail,
      InquiryEmail: inquiry.InquiryEmail,
      OtpEmail: otp.OtpEmail,
    };
  }
  return _email;
}

// Render a React Email element to both HTML and a plain-text fallback.
async function renderEmail(element) {
  const { render } = await templates();
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);
  return { html, text };
}

// Single send path through Resend. Throws on API error so callers' try/catch
// (and the Express error handler) surface it.
async function sendViaResend({ to, replyTo, subject, html, text }) {
  if (!resend) throw new Error('RESEND_API_KEY is not configured');
  const { data, error } = await resend.emails.send({ from: FROM, to, replyTo, subject, html, text });
  if (error) throw new Error(error.message || 'Resend failed to send email');
  return data;
}

async function generateInquiryNo() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const num = await getNext('inquiry');
  return `PFP-${dd}${yy}${mm}-${String(num).padStart(4, '0')}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function sendContactEmail({ name, email, phone, country, message }) {
  const inquiryNo = await generateInquiryNo();
  const date = formatDate(new Date());
  const { ContactEmail } = await templates();

  const { html, text } = await renderEmail(
    ContactEmail({ name, email, phone, country, message, inquiryNo, date })
  );

  return sendViaResend({
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Inquiry ${inquiryNo} — ${name}`,
    html,
    text,
  });
}

async function sendNewsletterEmail({ email }) {
  const date = formatDate(new Date());
  const { NewsletterEmail } = await templates();

  const { html, text } = await renderEmail(NewsletterEmail({ email, date }));

  return sendViaResend({
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `New newsletter subscription — ${email}`,
    html,
    text,
  });
}

async function sendInquiryEmail({ name, email, product, quantity, message }) {
  const inquiryNo = await generateInquiryNo();
  const date = formatDate(new Date());
  const { InquiryEmail } = await templates();

  const { html, text } = await renderEmail(
    InquiryEmail({ name, email, product, quantity, message, inquiryNo, date })
  );

  return sendViaResend({
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Product Inquiry ${inquiryNo} — ${product}`,
    html,
    text,
  });
}

const OTP_SUBJECTS = {
  email_verify: (code) => `${code} is your verification code`,
  login: (code) => `${code} is your login code`,
  reset: (code) => `${code} is your password reset code`,
};

async function sendOtpEmail({ email, code, purpose }) {
  const { OtpEmail } = await templates();

  const subject = (OTP_SUBJECTS[purpose] || OTP_SUBJECTS.email_verify)(code);
  const { html, text } = await renderEmail(OtpEmail({ code, purpose }));

  return sendViaResend({ to: email, subject, html, text });
}

module.exports = { sendContactEmail, sendNewsletterEmail, sendInquiryEmail, sendOtpEmail };
