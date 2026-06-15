import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function VendorBookings() {
  const [bookings, setBookings] = useState([]);

  const load = async () => setBookings((await api.get('/bookings/vendor')).data);
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    load();
  };

  return (
    <div className="card p-5">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b._id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{b.serviceName}</p>
              <p className="text-sm text-slate-500">{b.bookingDate} {b.timeSlot}</p>
            </div>
            <select value={b.status} onChange={(e) => updateStatus(b._id, e.target.value)} className="border rounded px-2 py-1">
              {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
