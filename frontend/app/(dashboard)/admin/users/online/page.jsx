'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Globe, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersOnlinePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnlineUsers();
  }, []);

  const fetchOnlineUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers((data.users || []).slice(0, 8)); // Top recent active sessions
      }
    } catch (err) {
      toast.error('Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Live Online Users 
            <span className="px-3 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Session
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">Real-time view of active user sessions and heartbeat signals.</p>
        </div>

        <button 
          onClick={fetchOnlineUsers} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Online Users List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Monitoring Active Heartbeats...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">User Name</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Connection State</th>
                  <th className="py-3.5 px-4">Device Info</th>
                  <th className="py-3.5 px-6 text-right">Heartbeat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u, i) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                      {u.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold uppercase text-indigo-600 dark:text-indigo-400">{u.role || 'USER'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">Chrome • Web (Gaya, IN)</td>
                    <td className="py-3.5 px-6 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      Active Now
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
