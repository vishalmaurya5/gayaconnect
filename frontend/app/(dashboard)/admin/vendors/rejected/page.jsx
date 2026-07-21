'use client';
import { Search, Filter, Ban } from 'lucide-react';

export default function RejectedVendorsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Rejected Vendors</h1>
        <p className="text-slate-500 mt-1">View vendor applications that have been denied or blocked.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search rejected vendors..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500" />
          </div>
          <button className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"><Filter className="w-4 h-4" /></button>
        </div>

        <div className="p-12 flex flex-col items-center text-center min-h-[400px] justify-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mb-4">
            <Ban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Rejected Applications</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">There are currently no rejected vendor registrations in the system.</p>
        </div>
      </div>
    </div>
  );
}
