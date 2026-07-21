'use client';
import { Download, BarChart2, Calendar, FileText } from 'lucide-react';

export default function PaymentReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Generate and download comprehensive financial analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Monthly Revenue', icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Revenue breakdown by month' },
          { title: 'GST Compliance', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Quarterly GST tax reports' },
          { title: 'Service Performance', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Top selling services' },
        ].map((report, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.bg} ${report.color}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{report.title}</h3>
                <p className="text-xs text-slate-500">{report.desc}</p>
              </div>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-200 dark:border-slate-700">
              <Download className="w-4 h-4" /> Download Excel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
