'use client';

import { UserPlus, Save } from 'lucide-react';

export default function CreateEmployeePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Employee</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Onboard a new employee and set up their profile.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Email Address</label>
              <input type="email" placeholder="john@example.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Department</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none">
                <option>Select Department</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Designation</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none">
                <option>Select Designation</option>
                <option>Software Engineer</option>
                <option>Product Manager</option>
                <option>Team Lead</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              <Save className="w-4 h-4" /> Save Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
