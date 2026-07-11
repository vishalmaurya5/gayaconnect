import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const host = process.env.SMTP_HOST || 'smtpout.secureserver.net';
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER || 'support@gayaconnect.in';
  const pass = process.env.SMTP_PASS || 'GayaConnect#@7004';

  const transport = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
    logger: true,
    debug: true
  });

  try {
    await transport.verify(); // Test the connection without sending an email
    return NextResponse.json({ success: true, message: "SMTP Connection Successful!" });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      code: error.code, 
      command: error.command 
    }, { status: 500 });
  }
}
