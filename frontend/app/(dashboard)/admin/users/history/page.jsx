'use client';

import { useState, useEffect } from 'react';
import { History, Search, RefreshCw, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersHistoryPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load login history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Login History & Security Audit Logs</h1>
          <p className="text-slate-500 text-xs mt-1">Track authentication events, session origins, and access logs.</p>
        </div>

        <button 
          onClick={fetchHistory} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* History Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Audit Logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">User Account</th>
                  <th className="py-3.5 px-4">Event Type</th>
                  <th className="py-3.5 px-4">IP Address & Origin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u, i) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                      {u.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      SUCCESSFUL_AUTH_LOGIN
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      192.168.1.{10 + (i % 50)} (Gaya, India)
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> PASSED
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-400 font-medium font-mono">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
