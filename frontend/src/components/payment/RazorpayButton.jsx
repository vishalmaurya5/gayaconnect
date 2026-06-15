import { createOrder, verifyPayment } from '../../services/paymentService';

export default function RazorpayButton({ amount, purpose, packageName, onSuccess }) {
  const openRazorpay = async () => {
    const { order } = await createOrder({ amount, purpose, packageName });
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Gaya Connect',
      description: packageName || 'Platform payment',
      order_id: order.id,
      handler: async (response) => {
        await verifyPayment(response);
        onSuccess?.();
      },
      theme: { color: '#2563eb' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={openRazorpay} className="w-full bg-blue-600 text-white py-2 rounded">Pay ?{amount}</button>;
}
