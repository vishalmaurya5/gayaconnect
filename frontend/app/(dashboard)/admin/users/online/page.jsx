'use client';

import { Activity, Search } from 'lucide-react';

export default function AdminUsersOnlinePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Online Users 
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time view of users currently active on the platform.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4 relative">
            <Activity className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-[#0B0F19]"></div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connecting to WebSocket...</h3>
          <p className="text-slate-500 mt-2 max-w-md">Waiting for live heartbeat signals from active client devices. This dashboard will update automatically.</p>
        </div>
      </div>
    </div>
  );
}
