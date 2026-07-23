'use client';

import { useState, useEffect } from 'react';
import { Search, Download, IdCard, Users, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function IdentityCardsDirectoryPage() {
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

  const filteredEmployees = employees.filter(emp => {
    const term = search.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.empId?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term) ||
      emp.designation?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Enterprise Identity Cards</h1>
          <p className="text-slate-500 text-xs mt-1">Generate, print, and download 65x95mm official employee badges.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchEmployees}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <Link 
            href="/admin/employees/create"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition"
          >
            + Create New Employee
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee by name, ID or department..." 
            className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-indigo-500" 
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-indigo-600">{filteredEmployees.length}</strong> Employees
        </div>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Identity Cards...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Identity Cards Found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">Create employees first to generate official GayaSeva 65x95mm badges.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => {
            const cleanAadhar = (emp.aadharNumber || '').replace(/\D/g, '');
            const maskedAadhar = cleanAadhar.length >= 4 ? `XXXX-XXXX-${cleanAadhar.slice(-4)}` : 'N/A';
            return (
              <div 
                key={emp._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border-2 border-indigo-500 flex-shrink-0 flex items-center justify-center">
                    {emp.photo ? (
                      <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">{emp.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{emp.designation || 'Staff'}</p>
                    <p className="text-[11px] text-slate-400 font-semibold truncate">{emp.department} • {emp.empId}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-1 mb-4 font-mono">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Aadhar Card:</span>
                    <strong className="text-slate-900 dark:text-slate-200">{maskedAadhar}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Phone:</span>
                    <strong className="text-slate-900 dark:text-slate-200 font-sans">{emp.phone}</strong>
                  </div>
                </div>

                <Link
                  href={`/admin/employees/${emp._id}/id-card`}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20"
                >
                  <IdCard className="w-4 h-4" /> Open 65x95mm ID Card Badge
                </Link>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
