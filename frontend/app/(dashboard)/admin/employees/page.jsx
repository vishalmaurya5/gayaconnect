'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Download, Trash2, IdCard, ShieldCheck, Mail, Phone, CreditCard, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      } else {
        toast.error('Failed to load employees');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to remove employee ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Employee deleted');
        fetchEmployees();
      } else {
        toast.error(json.message || 'Failed to delete employee');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const term = search.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.empId?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.phone?.includes(term) ||
      emp.aadharNumber?.includes(term) ||
      emp.department?.toLowerCase().includes(term) ||
      emp.designation?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Employee Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Manage staff members, credentials, Aadhar records, and ID badges.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchEmployees}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <Link 
            href="/admin/employees/create" 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Employee
          </Link>
        </div>
      </div>

      {/* EMPLOYEE PORTAL LOGIN LINK BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">Employee Self-Service Portal Login Link</h4>
            <p className="text-slate-300 text-xs mt-0.5">Share this URL with employees to log in, punch attendance, apply for sick leaves, download ID cards & keep notes.</p>
          </div>
        </div>

        <button 
          onClick={() => {
            const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/employee/login`;
            navigator.clipboard.writeText(url);
            toast.success('Employee Login URL copied: ' + url);
          }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-md transition flex-shrink-0"
        >
          📋 Copy Employee Login URL
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, Aadhar, phone..." 
            className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Total Registered: <strong className="text-indigo-600 dark:text-indigo-400">{filteredEmployees.length}</strong>
        </div>
      </div>

      {/* Employees Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Employees Database...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Employees Found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm text-center">Add your first internal staff member to start managing identity cards, payroll, and attendance.</p>
            <Link 
              href="/admin/employees/create"
              className="mt-5 px-6 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-md"
            >
              + Create First Employee
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Employee Info</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Aadhar Card</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredEmployees.map((emp) => {
                  const cleanAadhar = (emp.aadharNumber || '').replace(/\D/g, '');
                  const maskedAadhar = cleanAadhar.length >= 4 ? `XXXX-XXXX-${cleanAadhar.slice(-4)}` : 'N/A';
                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                            {emp.photo ? (
                              <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm">{emp.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400">
                        {emp.empId}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{emp.department}</span>
                        <span className="text-[11px] text-slate-400 font-semibold">{emp.designation}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                          <CreditCard className="w-3 h-3 text-indigo-500" /> {maskedAadhar}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                        {emp.phone}
                      </td>

                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">
                        ₹{Number(emp.salary || 25000).toLocaleString('en-IN')}/mo
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                          emp.status === 'ON_LEAVE' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                          'bg-slate-500/10 text-slate-500'
                        }`}>
                          ● {emp.status || 'ACTIVE'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/employees/${emp._id}/id-card`}
                            className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 rounded-lg text-xs transition border border-indigo-200 dark:border-indigo-800"
                            title="Generate ID Card"
                          >
                            <IdCard className="w-3.5 h-3.5" /> ID Card
                          </Link>
                          
                          <button 
                            onClick={() => handleDelete(emp._id, emp.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
