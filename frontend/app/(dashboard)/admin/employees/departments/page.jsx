'use client';
import { useState } from 'react';
import { Building2, Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT & Engineering', head: 'Rajeev Kumar', employees: 14, status: 'Active' },
    { id: 2, name: 'Human Resources', head: 'Sneha Sharma', employees: 3, status: 'Active' },
    { id: 3, name: 'Sales & Marketing', head: 'Amit Singh', employees: 8, status: 'Active' },
    { id: 4, name: 'Customer Support', head: 'Priya Desai', employees: 12, status: 'Active' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Departments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage organizational departments and divisions.</p>
        </div>
        <button onClick={() => toast.success('Add Department modal will open')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search departments..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Department Name</th>
                <th className="px-6 py-4">Department Head</th>
                <th className="px-6 py-4">Total Employees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                      <Building2 className="w-4 h-4" />
                    </div>
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{dept.head}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" /> {dept.employees}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">{dept.status}</span>
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
