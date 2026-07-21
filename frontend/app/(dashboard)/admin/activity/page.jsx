'use client';
import { useState } from 'react';
import { Activity, UserPlus, ShieldAlert, CreditCard, CheckCircle, Search, Filter } from 'lucide-react';

export default function ActivityPage() {
  const [filter, setFilter] = useState('All');

  const activities = [
    { id: 1, type: 'User', title: 'New User Registered', desc: 'Rahul Kumar created a new account.', time: '2 mins ago', icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 2, type: 'Finance', title: 'Payment Received', desc: 'Subscription payment of ₹999 successful for Vendor #8921.', time: '15 mins ago', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 3, type: 'Security', title: 'Failed Login Attempt', desc: '3 failed attempts from IP 192.168.1.1.', time: '1 hour ago', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 4, type: 'System', title: 'System Backup Completed', desc: 'Automated daily database backup finished successfully.', time: '3 hours ago', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 5, type: 'User', title: 'Profile Updated', desc: 'Vendor #8921 updated their business address.', time: '5 hours ago', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 6, type: 'Finance', title: 'Invoice Generated', desc: 'Invoice #INV-2024-001 created automatically.', time: '6 hours ago', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity Log</h1>
          <p className="text-slate-500 text-sm mt-1">Audit trail of all actions performed across the platform.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search activity logs..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="All">All Activities</option>
              <option value="User">User</option>
              <option value="Finance">Finance</option>
              <option value="Security">Security</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
            {activities
              .filter(a => filter === 'All' || a.type === filter)
              .map((activity, index) => (
              <div key={activity.id} className="relative pl-8">
                {/* Timeline Dot */}
                <div className={`absolute -left-[17px] top-1 p-1.5 rounded-full border-4 border-white dark:border-slate-900 ${activity.bg} ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activity.title}</h3>
                    <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap ml-4 bg-white dark:bg-slate-900 px-2 py-1 rounded-md shadow-sm border border-slate-200 dark:border-slate-800">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
