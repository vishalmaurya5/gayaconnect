import nodemailer from 'nodemailer'

function mailTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
  })
}

export async function sendVerificationEmail(user, token) {
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const verificationUrl = `${baseUrl}/api/auth/verify-email/${token}`
  const transport = mailTransport()

  if (!transport) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email delivery is not configured')
    }
    console.info(`Email verification URL for ${user.email}: ${verificationUrl}`)
    return
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: 'Verify your Gaya Connect account',
    text: `Welcome to Gaya Connect. Verify your email address by opening this link: ${verificationUrl}. This link expires in 24 hours.`,
    html: `<p>Welcome to Gaya Connect.</p><p><a href="${verificationUrl}">Verify your email address</a></p><p>This link expires in 24 hours.</p>`,
  })
}
