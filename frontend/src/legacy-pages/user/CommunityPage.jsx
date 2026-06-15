import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CommunityPage() {
  const [needs, setNeeds] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ title: '', description: '', budget: '' });

  const load = async () => setNeeds(await (await api.get('/community', { params: { q } })).data);

  useEffect(() => { load().catch(console.error); }, [q]);

  const postNeed = async () => {
    await api.post('/community', { ...form, budget: Number(form.budget || 0) });
    setForm({ title: '', description: '', budget: '' });
    load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card p-4 space-y-2">
        <h2 className="font-semibold">Post a Need</h2>
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" className="w-full border rounded px-3 py-2" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
        <button onClick={postNeed} className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
      </div>
      <div className="lg:col-span-2 card p-4">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">Community Needs</h2>
          <input className="border rounded px-3 py-1" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-3">
          {needs.map((need) => (
            <div key={need._id} className="border rounded p-3">
              <h3 className="font-medium">{need.title}</h3>
              <p className="text-sm text-slate-500">{need.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
