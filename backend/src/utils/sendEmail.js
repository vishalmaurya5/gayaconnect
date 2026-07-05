import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // Titan: smtp.titan.email
  port,
  secure: port === 465,             // 465 -> SSL (true); 587 -> STARTTLS (false)
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `Gaya Connect <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
