'use client';
import { useState } from 'react';
import { CalendarRange, Check, X, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeaveManagementPage() {
  const leaves = [
    { id: 1, name: 'Rajeev Kumar', type: 'Sick Leave', duration: '2 Days (10-11 Jul)', reason: 'Viral Fever', status: 'Pending' },
    { id: 2, name: 'Sneha Sharma', type: 'Casual Leave', duration: '1 Day (15 Jul)', reason: 'Personal work', status: 'Approved' },
    { id: 3, name: 'Amit Singh', type: 'Annual Leave', duration: '5 Days (20-25 Jul)', reason: 'Family trip', status: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve employee leave requests.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search requests..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    {leave.name}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{leave.type}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">{leave.duration}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : leave.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {leave.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toast.success('Leave Approved')} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"><Check className="w-4 h-4" /></button>
                        <button onClick={() => toast.success('Leave Rejected')} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
