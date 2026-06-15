// Stub: WhatsApp configuration
// Example: export default { twilioAccountSid, twilioAuthToken }.

import dotenv from 'dotenv';
dotenv.config();

export default {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM || '',
};

