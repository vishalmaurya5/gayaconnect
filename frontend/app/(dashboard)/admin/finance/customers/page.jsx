'use client';
import { Search, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Directory of all customers with transaction history.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm h-64">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Integrated with User Management</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Customer data is centrally managed in the User Directory. You can search for users and view their complete financial footprint there.
        </p>
        <Link href="/admin/users" className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold hover:underline bg-indigo-50 px-4 py-2 rounded-lg">
          Go to User Management <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
