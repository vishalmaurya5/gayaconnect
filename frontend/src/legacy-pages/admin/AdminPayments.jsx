import { useEffect, useState } from 'react';
import { paymentHistory } from '../../services/paymentService';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { paymentHistory().then(setPayments); }, []);

  return (
    <div className="card p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Payment Transactions</h1>
      <table className="w-full text-sm"><thead><tr><th>Order</th><th>Amount</th><th>Status</th><th>Purpose</th></tr></thead><tbody>
      {payments.map((p) => <tr key={p._id} className="border-t"><td className="py-2">{p.razorpayOrderId}</td><td>?{p.amount}</td><td>{p.status}</td><td>{p.purpose}</td></tr>)}
      </tbody></table>
    </div>
  );
}
