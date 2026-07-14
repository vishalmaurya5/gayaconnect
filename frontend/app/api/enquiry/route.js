import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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

    // Verify environment variables
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      console.error("Missing Google Sheets credentials in .env");
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    // Initialize auth - format private key properly handling escaped newlines
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: formattedPrivateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    // Load document properties and worksheets
    await doc.loadInfo();
    
    // Get the first sheet (index 0)
    const sheet = doc.sheetsByIndex[0];
    
    // Append the row
    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    await sheet.addRow({
      Name: name,
      Phone: phone,
      Email: email || 'N/A',
      Message: message,
      Date: date
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error submitting enquiry to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
