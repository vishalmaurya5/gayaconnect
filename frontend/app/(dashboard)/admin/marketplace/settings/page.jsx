'use client';

import { useContext } from 'react';
import { 
  Settings
} from 'lucide-react';
import { AdminContext } from '../../layout';

export default function SettingsPage() {
  const admin = useContext(AdminContext);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Marketplace Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure rules, commissions, and platform settings.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
          <Settings className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configuration</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Marketplace fees, category toggles, and general preferences.</p>
      </div>
    </div>
  );
}
