'use client';

import { CalendarOff, Filter, Search } from 'lucide-react';

export default function LeaveManagementPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Leave Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and approve employee time-off requests.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search requests..." className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" />
            </div>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold cursor-pointer">Pending</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold cursor-pointer">Approved</span>
          </div>
        </div>
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center mb-4">
            <CalendarOff className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Caught Up</h3>
          <p className="text-slate-500 mt-1">There are no pending leave requests to review.</p>
        </div>
      </div>
    </div>
  );
}
