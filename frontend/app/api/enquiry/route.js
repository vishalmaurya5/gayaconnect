import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and message are required' },
        { status: 400 }
      );
    }

    // Dummy implementation as Google Sheets envs are not set up yet
    console.log('--- ENQUIRY RECEIVED (DUMMY) ---');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || 'N/A'}`);
    console.log(`Message: ${message}`);
    console.log(`Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    console.log('--------------------------------');

    return NextResponse.json({ success: true, message: 'Enquiry received successfully (dummy mode)' });
    
  } catch (error) {
    console.error('Error submitting enquiry to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
