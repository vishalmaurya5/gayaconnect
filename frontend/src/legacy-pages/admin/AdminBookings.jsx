import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { api.get('/bookings/vendor').then((res) => setBookings(res.data)); }, []);

  return (
    <div className="card p-4">
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
      {bookings.map((b) => <div key={b._id} className="border-t py-2">{b.serviceName} - {b.status} - ?{b.servicePrice}</div>)}
    </div>
  );
}
