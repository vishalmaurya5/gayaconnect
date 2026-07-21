'use client';
import { useState } from 'react';
import { DollarSign, Search, Download, CreditCard, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SalaryStatusPage() {
  const [month, setMonth] = useState('2024-07');

  const salaries = [
    { id: 1, empId: 'EMP-001', name: 'Rajeev Kumar', role: 'Software Engineer', amount: '₹45,000', status: 'Paid', date: '01 Jul 2024' },
    { id: 2, empId: 'EMP-002', name: 'Sneha Sharma', role: 'HR Manager', amount: '₹55,000', status: 'Pending', date: '-' },
    { id: 3, empId: 'EMP-003', name: 'Amit Singh', role: 'Sales Exec', amount: '₹30,000', status: 'Processing', date: '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Salary Status</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and disburse employee payroll.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="month" 
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          />
          <button onClick={() => toast.success('Payroll processing started')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
            <DollarSign className="w-4 h-4" /> Run Payroll
          </button>
        </div>
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
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Net Salary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {salaries.map((sal) => (
                <tr key={sal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{sal.name}</p>
                    <p className="text-xs text-slate-500">{sal.empId}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{sal.role}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{sal.amount}</td>
                  <td className="px-6 py-4">
                    {sal.status === 'Paid' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle className="w-3.5 h-3.5" /> Paid</span>}
                    {sal.status === 'Pending' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                    {sal.status === 'Processing' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700"><CreditCard className="w-3.5 h-3.5" /> Processing</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{sal.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ml-auto">
                      <Download className="w-3 h-3" /> PDF
                    </button>
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
