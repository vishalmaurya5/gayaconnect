// One-off helper to verify Titan SMTP + send a real password-reset style email.
// Run from the backend folder:   node scripts/test-email.js  [optional-recipient@email.com]
// It tries the port from .env; if that port is blocked/times out, it auto-tries the other one.
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const to = process.argv[2] || process.env.SMTP_USER; // default: send to yourself
const rawToken = crypto.randomBytes(32).toString('hex');
const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

const configured = Number(process.env.SMTP_PORT || 587);
// Try the configured port first, then fall back to the other common Titan port.
const portsToTry = configured === 465 ? [465, 587] : [587, 465];

async function trySend(port) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,        // 465 -> SSL, 587 -> STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15000,    // fail fast instead of hanging
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  console.log(`\n--- Trying ${process.env.SMTP_HOST}:${port} (secure=${port === 465}) ---`);
  await transporter.verify();
  console.log('SMTP connection OK. Sending...');
  const info = await transporter.sendMail({
    from: `Gaya Connect <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: 'Reset password',
    html: `<p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  console.log('SENT ✅  messageId:', info.messageId);
  console.log(`➡  Working port: ${port}  -> set SMTP_PORT=${port} in your .env`);
  console.log('Reset link inside the email:', resetUrl);
}

const _pw = process.env.SMTP_PASS || '';
console.log(`User  : ${process.env.SMTP_USER}`);
console.log(`From  : ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
console.log(`To    : ${to}`);
console.log(`Pass  : loaded ${_pw.length} chars (from .env)`);

let sent = false;
for (const port of portsToTry) {
  try {
    await trySend(port);
    sent = true;
    break;
  } catch (e) {
    console.error(`FAILED on port ${port}:`, e.code || '', e.message);
    if (e.code === 'EAUTH') {
      console.error('⚠  Auth rejected -> SMTP_USER / SMTP_PASS is wrong (this is NOT a port problem).');
      break; // wrong credentials won't be fixed by another port
    }
  }
}

if (!sent) {
  console.error('\n❌ Could not send on any port. If both timed out, your network is blocking outbound SMTP');
  console.error('   (common on ISP/office/college Wi-Fi). Try a different network / mobile hotspot, or a VPN.');
  process.exit(1);
}
