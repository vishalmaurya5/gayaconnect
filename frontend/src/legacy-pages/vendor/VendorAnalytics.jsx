import { Bar } from 'react-chartjs-2';

export default function VendorAnalytics() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Profile Views', data: [20, 30, 25, 40, 50, 38, 45], backgroundColor: '#2563eb' },
      { label: 'Clicks', data: [10, 18, 12, 30, 28, 20, 25], backgroundColor: '#22c55e' },
    ]
  };

  return <div className="card p-5"><h1 className="text-2xl font-bold mb-4">Analytics</h1><Bar data={data} /></div>;
}
