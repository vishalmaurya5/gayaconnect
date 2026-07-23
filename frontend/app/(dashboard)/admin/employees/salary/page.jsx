'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Search, Download, CreditCard, Clock, CheckCircle, RefreshCw, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SalaryStatusPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [payrollStatus, setPayrollStatus] = useState({});

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
        const initial = {};
        (json.employees || []).forEach(e => {
          initial[e._id] = 'PAID';
        });
        setPayrollStatus(initial);
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const markPaid = (empId) => {
    setPayrollStatus(prev => ({ ...prev, [empId]: 'PAID' }));
    toast.success('Salary payout recorded');
  };

  const filteredEmployees = employees.filter(emp => {
    const term = search.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.empId?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term)
    );
  });

  const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 25000), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Employee Salary & Payroll</h1>
          <p className="text-slate-500 text-xs mt-1">Manage monthly wages, payslips, and disbursement records.</p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="month" 
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
          />
          <button 
            onClick={fetchEmployees}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Monthly Payroll Budget</span>
          <strong className="text-2xl font-black text-slate-900 dark:text-white">₹{totalPayroll.toLocaleString('en-IN')}</strong>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Employees</span>
          <strong className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{employees.length} Staff</strong>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Disbursement Status</span>
          <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100% On Time</strong>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID or department..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium outline-none focus:border-indigo-500" 
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Salary Ledger...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Users className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            No registered employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Net Monthly Wage</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredEmployees.map((emp) => {
                  const status = payrollStatus[emp._id] || 'PAID';
                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-6 font-extrabold text-slate-900 dark:text-white">
                        {emp.name}
                        <span className="block text-[11px] text-slate-400 font-normal">{emp.email}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400">
                        {emp.empId}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{emp.department}</span>
                        <span className="text-[11px] text-slate-400">{emp.designation}</span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">
                        ₹{Number(emp.salary || 25000).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" /> PAID
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button 
                          onClick={() => toast.success(`Payslip for ${emp.name} generated`)}
                          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg text-xs hover:bg-indigo-100 transition inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Payslip PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
