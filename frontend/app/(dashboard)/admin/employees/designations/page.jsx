'use client';
import { useState } from 'react';
import { Briefcase, Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DesignationsPage() {
  const [designations, setDesignations] = useState([
    { id: 1, title: 'Software Engineer', department: 'IT & Engineering', level: 'Mid Level', employees: 8 },
    { id: 2, title: 'HR Manager', department: 'Human Resources', level: 'Senior', employees: 1 },
    { id: 3, title: 'Sales Executive', department: 'Sales & Marketing', level: 'Entry Level', employees: 5 },
    { id: 4, title: 'Customer Support Rep', department: 'Customer Support', level: 'Entry Level', employees: 10 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Designations</h1>
          <p className="text-slate-500 text-sm mt-1">Manage job titles and roles within the company.</p>
        </div>
        <button onClick={() => toast.success('Add Designation modal will open')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> Add Designation
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search designations..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Active Employees</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {designations.map((des) => (
                <tr key={des.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    {des.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{des.department}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium">{des.level}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" /> {des.employees}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
