import { useState } from 'react';
import { REPAIR_COMMISSION_PERCENT } from '../../utils/constants';

export default function AdminSettings() {
  const [commission, setCommission] = useState(REPAIR_COMMISSION_PERCENT);

  return (
    <div className="card p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Platform Settings</h1>
      <label className="block text-sm mb-2">Repair Service Commission (%)</label>
      <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="border rounded px-3 py-2 w-full" />
      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Save Settings</button>
    </div>
  );
}
