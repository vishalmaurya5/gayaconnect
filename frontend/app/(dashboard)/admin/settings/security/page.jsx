'use client';

import { useContext } from 'react';
import { 
  ShieldAlert, Lock
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';

export default function SecuritySettingsPage() {
  const admin = useContext(AdminContext);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Security Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure 2FA, password policies, and security logs.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 mb-4 text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Access & Security</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto mb-6">Manage login restrictions, active sessions, and multi-factor authentication requirements.</p>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Lock className="w-4 h-4" /> Review Security Policies
        </motion.button>
      </div>
    </div>
  );
}
