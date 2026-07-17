'use client';

import { Clock, Search, Filter } from 'lucide-react';

export default function AdminUsersPendingPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pending Verification</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and approve user accounts that require manual KYC or identity verification.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Approvals</h3>
          <p className="text-slate-500 mt-1">All user accounts have been verified. There is no pending verification in the queue right now.</p>
        </div>
      </div>
    </div>
  );
}
