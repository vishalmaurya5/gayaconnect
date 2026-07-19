'use client';

import { ShieldCheck, Filter, Search } from 'lucide-react';

export default function VerifiedVendorsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Verified Vendors</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all approved and active business listings.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search verified businesses..." className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" />
            </div>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm shrink-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <select className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-600 dark:text-slate-300 w-full sm:w-auto">
            <option>All Categories</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Services</option>
          </select>
        </div>
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Business Directory</h3>
          <p className="text-slate-500 mt-1">Verified vendor accounts and their details will appear here.</p>
        </div>
      </div>
    </div>
  );
}
