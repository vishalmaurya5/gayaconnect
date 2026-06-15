'use client';

import { useEffect, useState } from 'react';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';

export default function CommunityPage() {
  const [needs, setNeeds] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ title: '', description: '', budget: '' });

  const load = async () => {
    try {
      const res = await fetch(`/api/vendors?search=${q}&limit=50`);
      const data = await res.json();
      setNeeds(data.vendors || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { load(); }, [q]);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
      <p className="text-gray-600 mb-8">Connect with local businesses and post your needs</p>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><FiMessageSquare className="text-blue-600" /> Post a Need</h2>
          <div className="space-y-3">
            <input className="input-field" placeholder="What do you need?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="input-field min-h-[100px]" placeholder="Describe..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn-primary w-full">Post Need</button>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Community Needs</h2>
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="space-y-3">
            {needs.length > 0 ? needs.map((need) => (
              <div key={need._id} className="border rounded-lg p-4"><h3 className="font-medium">{need.name}</h3><p className="text-sm text-gray-500">{need.category}</p></div>
            )) : <p className="text-gray-400 text-center py-8">No posts yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
