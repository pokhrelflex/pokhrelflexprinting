const axios = require('axios');

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

async function sendContactWhatsApp({ name, email, phone, country, message }) {
  if (!process.env.WHATSAPP_PHONE_ID || !process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_RECIPIENT) {
    console.warn('WhatsApp env vars not configured — skipping WhatsApp notification');
    return null;
  }

  const text = [
    `📩 *New Contact Inquiry — Pokhrel Flex Printing*`,
    ``,
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    `*Phone:* ${phone || 'N/A'}`,
    `*Country:* ${country || 'N/A'}`,
    ``,
    `*Message:*`,
    message,
  ].join('\n');

  const response = await axios.post(
    WHATSAPP_API_URL,
    {
      messaging_product: 'whatsapp',
      to: process.env.WHATSAPP_RECIPIENT,
      type: 'text',
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

module.exports = { sendContactWhatsApp };
