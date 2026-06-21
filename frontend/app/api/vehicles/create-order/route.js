import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';
import User from '@/lib/db/models/User';
import Setting from '@/lib/db/models/Setting';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { ownerId, ownerName, phone, vehicleName, vehicleModel, vehicleNumber, dlNumber, isCommercial, liabilityAccepted } = data;

    if (!ownerId || !vehicleName || !vehicleNumber || !dlNumber || !liabilityAccepted) {
      return NextResponse.json({ error: 'Missing required fields or liability not accepted' }, { status: 400 });
    }

    // Verify User
    const user = await User.findById(ownerId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Platform Fee for Vehicle Posting
    let amount = 200;
    try {
      const setting = await Setting.findOne({ key: 'pricing' });
      if (setting && setting.value && setting.value.vehicle) {
        amount = setting.value.vehicle;
      }
    } catch (e) {
      console.error('Failed to fetch pricing settings', e);
    }

    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `rcpt_veh_${Date.now().toString().substring(0, 10)}`
    };

    const order = await razorpay.orders.create(options);

    // Create Pending Vehicle Record
    const vehicle = await Vehicle.create({
      ownerId,
      ownerName: ownerName || user.name,
      phone: phone || user.phone,
      vehicleName,
      vehicleModel,
      vehicleNumber,
      dlNumber,
      isCommercial,
      liabilityAccepted,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: order.id
    });

    return NextResponse.json({ orderId: order.id, amount: options.amount, vehicleId: vehicle._id });
  } catch (error) {
    console.error('Vehicle Create Order Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
