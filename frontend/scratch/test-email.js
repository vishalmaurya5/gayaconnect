const nodemailer = require('nodemailer');

async function testEmail() {
  const host = 'smtpout.secureserver.net';
  const port = 465;
  const user = 'support@gayaconnect.in';
  const pass = 'GayaConnect#@7004'; // No quotes, just the string

  console.log(`Connecting to ${host}:${port} as ${user}...`);

  const transport = nodemailer.createTransport({
    host,
    port: port,
    secure: true,
    auth: { user, pass },
    logger: true,
    debug: true
  });

  try {
    const info = await transport.sendMail({
      from: user,
      to: 'vishuofficial2021@gmail.com',
      subject: 'Test Email SMTP',
      text: 'This is a test email to verify SMTP connection.',
    });
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send email:');
    console.error(err);
  }
}

testEmail();
