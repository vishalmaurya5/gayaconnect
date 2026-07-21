'use client';
import { useState } from 'react';
import { FileText, Download, Filter, Search, ArrowRight, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('All');

  const reportCategories = [
    { name: 'Financial Overview', type: 'Finance', desc: 'Comprehensive revenue and expense reports.', date: 'Last 30 Days' },
    { name: 'User Engagement', type: 'Users', desc: 'Activity metrics for registered users.', date: 'Last 7 Days' },
    { name: 'Vendor Performance', type: 'Marketplace', desc: 'Sales and fulfillment metrics for top vendors.', date: 'YTD' },
    { name: 'Subscription Churn', type: 'Finance', desc: 'Analysis of cancelled subscriptions and reasons.', date: 'Last 90 Days' },
    { name: 'System Errors', type: 'System', desc: 'Log of application crashes and failed API calls.', date: 'Last 24 Hours' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Generate and download comprehensive system reports.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <FileText className="w-4 h-4" /> Generate New Report
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Finance">Finance</option>
              <option value="Users">Users</option>
              <option value="Marketplace">Marketplace</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {reportCategories
            .filter(r => reportType === 'All' || r.type === reportType)
            .map((report, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {report.name} 
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {report.type}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{report.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> {report.date}
                </span>
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
