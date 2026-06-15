import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function VendorDashboard() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { api.get('/bookings/vendor').then((res) => setBookings(res.data)); }, []);

  const completed = bookings.filter((b) => b.status === 'completed').length;
  const revenue = bookings.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + Number(b.servicePrice || 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4"><p className="text-sm">Total Bookings</p><h3 className="text-2xl font-bold">{bookings.length}</h3></div>
        <div className="card p-4"><p className="text-sm">Completed</p><h3 className="text-2xl font-bold">{completed}</h3></div>
        <div className="card p-4"><p className="text-sm">Revenue</p><h3 className="text-2xl font-bold">?{revenue}</h3></div>
      </div>
      <div className="card p-4">
        <h2 className="font-semibold mb-3">Recent Bookings</h2>
        {bookings.slice(0, 5).map((b) => <p key={b._id} className="text-sm py-1">{b.serviceName} - {b.status}</p>)}
      </div>
    </div>
  );
}
