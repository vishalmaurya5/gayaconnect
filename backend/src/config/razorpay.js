import Razorpay from 'razorpay';
import dotenv from 'dotenv';

// Load environment variables from .env into process.env
// (e.g., RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)
dotenv.config();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error(
    'Razorpay configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.'
  );
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export default razorpay;

