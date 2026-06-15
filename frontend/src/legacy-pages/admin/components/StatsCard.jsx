export default function StatsCard({ label, value, color = 'blue' }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className={`text-2xl font-bold text-${color}-600`}>{value}</h3>
    </div>
  );
}
