'use client';

import { useContext } from 'react';
import { 
  Palette, Sun, Moon
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';

export default function ThemeSettingsPage() {
  const admin = useContext(AdminContext);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Theme Customization</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Customize colors, logos, and platform UI appearance.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fuchsia-50 dark:bg-fuchsia-500/10 mb-4 text-fuchsia-500">
          <Palette className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Branding & Appearance</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto mb-6">Change the active theme, upload brand logos, and adjust the primary color palette for the entire platform.</p>
        <div className="flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300">
            <Sun className="w-4 h-4" /> Light Mode
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium shadow-md">
            <Moon className="w-4 h-4" /> Dark Mode
          </button>
        </div>
      </div>
    </div>
  );
}
