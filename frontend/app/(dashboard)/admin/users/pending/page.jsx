'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, RefreshCw, ShieldCheck, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPendingPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users?filter=pending');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true, verificationStatus: 'APPROVED' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Account verified & approved for ${name}`);
        fetchPendingUsers();
      } else {
        toast.error('Failed to verify user');
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Pending Verification Queue</h1>
          <p className="text-slate-500 text-xs mt-1">Review and approve accounts requiring identity verification.</p>
        </div>

        <button 
          onClick={fetchPendingUsers} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Pending Queue...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Approvals</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm">All user accounts have been verified. There are no accounts awaiting verification in the queue.</p>
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
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full font-black text-[10px]">
                        PENDING
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button 
                        onClick={() => approveUser(u._id, u.name)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition shadow-sm"
                      >
                        Approve & Verify
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
