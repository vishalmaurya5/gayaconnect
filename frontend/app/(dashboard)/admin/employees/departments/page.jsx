'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/employees');
      const json = await res.json();
      if (json.success) {
        setEmployees(json.employees || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const defaultDepts = ['IT', 'HR', 'Sales', 'Support', 'Operations', 'Finance'];

  const getDeptCount = (deptName) => {
    return employees.filter(e => (e.department || '').toLowerCase().includes(deptName.toLowerCase())).length;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Departments Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Manage organizational divisions and employee allocations.</p>
        </div>
        <button 
          onClick={fetchEmployees} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultDepts.map((deptName) => {
          const count = getDeptCount(deptName);
          return (
            <div key={deptName} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full border border-emerald-500/20 uppercase tracking-wider">
                  Active Unit
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{deptName} Division</h3>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span><strong>{count}</strong> Active Employees</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
