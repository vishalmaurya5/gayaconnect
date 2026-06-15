import { Line } from 'react-chartjs-2';

export default function RevenueChart({ data = [] }) {
  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [{ label: 'Revenue', data: data.map((d) => d.revenue), borderColor: '#2563eb', backgroundColor: '#93c5fd' }]
  };

  return <div className="card p-4"><Line data={chartData} /></div>;
}
