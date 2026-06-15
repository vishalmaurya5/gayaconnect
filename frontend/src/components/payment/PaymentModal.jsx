import RazorpayButton from './RazorpayButton';

export default function PaymentModal({ open, onClose, amount, purpose, packageName }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-50">
      <div className="card p-6 w-full max-w-sm">
        <h3 className="font-semibold mb-3">Complete Payment</h3>
        <RazorpayButton amount={amount} purpose={purpose} packageName={packageName} onSuccess={onClose} />
        <button onClick={onClose} className="mt-3 text-sm text-slate-500">Cancel</button>
      </div>
    </div>
  );
}
