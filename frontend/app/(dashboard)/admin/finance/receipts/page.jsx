'use client';
import { Download, FileText, Search } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Receipts</h1>
          <p className="text-slate-500 text-sm mt-1">Download and share digital receipts with customers.</p>
        </div>
        <Link href="/admin/finance/invoices" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          View Invoices Instead
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm h-64">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Receipts are unified with Invoices</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          In Gaya Seva Enterprise, a Paid Invoice acts as a final receipt. Please navigate to the Invoices section to view, print, or download them.
        </p>
        <Link href="/admin/finance/invoices" className="mt-6 text-indigo-600 font-semibold hover:underline">
          Go to Invoices &rarr;
        </Link>
      </div>
    </div>
  );
}
