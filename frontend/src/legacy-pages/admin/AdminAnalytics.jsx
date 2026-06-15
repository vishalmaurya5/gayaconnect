import { useEffect, useState } from 'react';
import { adminRevenue } from '../../services/adminService';
import RevenueChart from './components/RevenueChart';

export default function AdminAnalytics() {
  const [revenue, setRevenue] = useState([]);
  useEffect(() => { adminRevenue().then(setRevenue); }, []);

  const exportCsv = () => {
    const csv = ['month,revenue,count', ...revenue.map((r) => `${r._id},${r.revenue},${r.count}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'analytics-report.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Advanced Analytics</h1>
        <button onClick={exportCsv} className="bg-blue-600 text-white px-4 py-2 rounded">Export</button>
      </div>
      <RevenueChart data={revenue} />
    </div>
  );
}
