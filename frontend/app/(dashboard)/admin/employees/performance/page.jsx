'use client';
import { useState } from 'react';
import { Star, TrendingUp, Search, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PerformancePage() {
  const performances = [
    { id: 1, empId: 'EMP-001', name: 'Rajeev Kumar', rating: 4.8, projects: 12, status: 'Excellent' },
    { id: 2, empId: 'EMP-002', name: 'Sneha Sharma', rating: 4.2, projects: 8, status: 'Good' },
    { id: 3, empId: 'EMP-003', name: 'Amit Singh', rating: 3.5, projects: 15, status: 'Average' },
    { id: 4, empId: 'EMP-004', name: 'Priya Desai', rating: 4.9, projects: 22, status: 'Outstanding' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Reviews</h1>
          <p className="text-slate-500 text-sm mt-1">Evaluate employee metrics and KPI ratings.</p>
        </div>
        <button onClick={() => toast.success('New review form opened')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
          <Star className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search employee..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Overall Rating</th>
                <th className="px-6 py-4">Projects Completed</th>
                <th className="px-6 py-4">Review Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {performances.map((perf) => (
                <tr key={perf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{perf.name}</p>
                    <p className="text-xs text-slate-500">{perf.empId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-500" /> {perf.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                    {perf.projects}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${perf.status === 'Outstanding' ? 'bg-purple-100 text-purple-700' : perf.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : perf.status === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {perf.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs">View Metrics</button>
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
