'use client';

import { useContext } from 'react';
import { 
  TrendingUp, Download
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';

export default function RevenuePage() {
  const admin = useContext(AdminContext);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Revenue Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View revenue streams and financial metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-4 text-indigo-500">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Financial Dashboard</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Charts and graphs detailing monthly revenue, commissions, and growth will be displayed here.</p>
      </div>
    </div>
  );
}
