const nodemailer = require('nodemailer');
const { getNext } = require('../models/Counter');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  const mailOptions = {
    from: `"Pokhrel Flex Printing" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Inquiry ${inquiryNo} — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; overflow: hidden;">
        <div style="background-color: #F2F0EC; padding: 24px 28px;">
          <table role="presentation" style="width: 100%;">
            <tr>
              <td style="vertical-align: middle;">
                <strong style="font-size: 16px; color: #1B4F8A;">Pokhrel Flex Printing</strong>
              </td>
              <td style="vertical-align: middle; text-align: right;">
                <p style="margin: 0; font-size: 11px; color: #888;">Inquiry No: <span style="color: #1B4F8A; font-weight: 600;">${inquiryNo}</span></p>
                <p style="margin: 4px 0 0; font-size: 11px; color: #888;">Date: <span style="color: #1A1A1A;">${date}</span></p>
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color: #F2F0EC; padding: 0 28px 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px; width: 110px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 15px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 15px;">
                <a href="mailto:${email}" style="color: #1B4F8A; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 15px;">
                <a href="tel:${phone}" style="color: #1B4F8A; text-decoration: none;">${phone || 'N/A'}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Country</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 15px;">${country || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Message</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 15px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #1B4F8A; padding: 16px; text-align: center;">
          <p style="color: #F2F0EC; margin: 0; font-size: 12px;">
            This message was sent from Pokhrel Flex Printing website.
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendNewsletterEmail({ email }) {
  const date = formatDate(new Date());

  const mailOptions = {
    from: `"Pokhrel Flex Printing" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `New newsletter subscription — ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e0e0e0; overflow: hidden;">
        <div style="background-color: #1B4F8A; padding: 18px 24px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Newsletter Subscription</h2>
        </div>
        <div style="background-color: #F2F0EC; padding: 24px;">
          <p style="margin: 0 0 14px; color: #1A1A1A; font-size: 15px;">Someone subscribed from the Pokhrel Flex Printing website.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px; width: 90px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 15px;">
                <a href="mailto:${email}" style="color: #1B4F8A; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px;">Date</td>
              <td style="padding: 12px 0; color: #1A1A1A; font-size: 15px;">${date}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendInquiryEmail({ name, email, product, quantity, message }) {
  const inquiryNo = await generateInquiryNo();
  const date = formatDate(new Date());

  const mailOptions = {
    from: `"Pokhrel Flex Printing" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Product Inquiry ${inquiryNo} — ${product}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; overflow: hidden;">
        <div style="background-color: #1B4F8A; padding: 18px 24px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Product Inquiry — ${inquiryNo}</h2>
        </div>
        <div style="background-color: #F2F0EC; padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px; width: 110px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 14px; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 14px;"><a href="mailto:${email}" style="color: #1B4F8A;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Product</td><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 14px; font-weight: 600;">${product}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #888; font-size: 13px;">Quantity</td><td style="padding: 10px 0; border-bottom: 1px solid #d4d0c8; color: #1A1A1A; font-size: 14px;">${quantity || 'Not specified'}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px;">Message</td><td style="padding: 10px 0; color: #1A1A1A; font-size: 14px; white-space: pre-wrap;">${message || 'No additional message'}</td></tr>
          </table>
        </div>
        <div style="background-color: #1B4F8A; padding: 16px; text-align: center;">
          <p style="color: #F2F0EC; margin: 0; font-size: 12px;">Sent from Pokhrel Flex Printing website — ${date}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail, sendNewsletterEmail, sendInquiryEmail };
