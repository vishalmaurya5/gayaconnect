import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdminDashboard, loadAdminRevenue } from '../../store/slices/adminSlice';
import AdminHeader from './components/AdminHeader';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, revenue } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(loadAdminDashboard()); dispatch(loadAdminRevenue()); }, [dispatch]);

  return (
    <div className="space-y-5">
      <AdminHeader />
      <div className="grid md:grid-cols-4 gap-4">
        <StatsCard label="Users" value={stats?.users || 0} />
        <StatsCard label="Vendors" value={stats?.vendors || 0} color="green" />
        <StatsCard label="Bookings" value={stats?.bookings || 0} color="purple" />
        <StatsCard label="Revenue" value={`?${stats?.revenue || 0}`} color="amber" />
      </div>
      <RevenueChart data={revenue} />
    </div>
  );
}
