import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import PaymentModal from '../../components/payment/PaymentModal';

export default function BookingPage() {
  const [params] = useSearchParams();
  const vendorId = params.get('vendor');
  const [form, setForm] = useState({ serviceName: '', servicePrice: 500, bookingDate: '', timeSlot: '', notes: '' });
  const [openPay, setOpenPay] = useState(false);
  const [created, setCreated] = useState(false);

  const canSubmit = useMemo(() => form.serviceName && form.bookingDate && form.timeSlot, [form]);

  const createBooking = async () => {
    await api.post('/bookings', { ...form, vendor: vendorId });
    setCreated(true);
    setOpenPay(true);
  };

  return (
    <div className="max-w-2xl mx-auto card p-6 space-y-4">
      <h1 className="text-2xl font-bold">Book Service</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="Service" value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} />
      <div className="grid sm:grid-cols-2 gap-3">
        <input type="date" className="border rounded px-3 py-2" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} />
        <input type="time" className="border rounded px-3 py-2" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} />
      </div>
      <input type="number" className="w-full border rounded px-3 py-2" value={form.servicePrice} onChange={(e) => setForm({ ...form, servicePrice: Number(e.target.value) })} />
      <textarea className="w-full border rounded px-3 py-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button disabled={!canSubmit} onClick={createBooking} className="bg-blue-600 disabled:bg-slate-300 text-white px-4 py-2 rounded">Confirm Booking</button>
      {created && <p className="text-green-600">Booking created. Please pay to confirm.</p>}
      <PaymentModal open={openPay} onClose={() => setOpenPay(false)} amount={form.servicePrice} purpose="booking" packageName="Service Booking" />
    </div>
  );
}
