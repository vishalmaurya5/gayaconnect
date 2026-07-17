'use client';

import { Users, Search, Plus, Download } from 'lucide-react';

export default function AdminEmployeesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Employees</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage internal staff, agents, and ground personnel.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">
            <Plus className="w-5 h-5" /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <Users className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Employees Yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm text-center">Add your first internal employee or staff member to start managing their payroll and access.</p>
        <button className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800">
          Import from CSV
        </button>
      </div>
    </div>
  );
}
