'use client';

import { useState, useEffect } from 'react';
import { Ban, Search, RefreshCw, CheckCircle, Trash2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersBlockedPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users?filter=blocked');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load blocked users');
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: false, isDeleted: false })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Account unblocked for ${name}`);
        fetchBlockedUsers();
      } else {
        toast.error('Failed to unblock account');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Blocked Users & Suspended Accounts</h1>
          <p className="text-slate-500 text-xs mt-1">Review accounts that have been blocked or marked inactive.</p>
        </div>

        <button 
          onClick={fetchBlockedUsers} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Blocked Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Blocked Users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Blocked Accounts</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm">All user accounts are in good standing. There are currently no suspended or blocked accounts in MongoDB.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">User Info</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                      {u.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">{u.phone}</td>
                    <td className="py-3.5 px-4 uppercase font-bold text-slate-500">{u.role || 'user'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-full font-black text-[10px]">
                        BLOCKED
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button 
                        onClick={() => unblockUser(u._id, u.name)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-xs transition"
                      >
                        Unblock Account
                      </button>
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
