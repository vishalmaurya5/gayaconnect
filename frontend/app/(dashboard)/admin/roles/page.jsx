'use client';

import { Shield, ShieldAlert, Key, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminRolesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Roles & Permissions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage system roles and access levels for administrators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Super Admin</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Has absolute control over the entire platform, including billing and system settings.</p>
          <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold rounded-xl mt-auto">View Permissions</button>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
            <Key className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">City Admin</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Can manage users, vendors, and jobs but only within their assigned city jurisdiction.</p>
          <button className="w-full py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold rounded-xl mt-auto">View Permissions</button>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Support Agent</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Can only view user profiles and reply to support tickets. No delete access.</p>
          <button className="w-full py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-bold rounded-xl mt-auto">View Permissions</button>
        </div>
      </div>
    </div>
  );
}
