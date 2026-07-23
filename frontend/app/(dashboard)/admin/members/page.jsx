'use client';

import { useState, useEffect } from 'react';
import { Award, Search, RefreshCw, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setMembers(data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.phone?.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Active Members Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Manage verified platform members and premium subscription accounts.</p>
        </div>

        <button 
          onClick={fetchMembers} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table & Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search active members..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Members: <strong className="text-indigo-600 dark:text-indigo-400">{filtered.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Member Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Member Info</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Role / Plan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                      {m.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{m.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">{m.phone}</td>
                    <td className="py-3.5 px-4 uppercase font-bold text-indigo-600 dark:text-indigo-400">{m.role || 'USER'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-black text-[10px]">
                        ● ACTIVE MEMBER
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-400 font-medium">
                      {new Date(m.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
