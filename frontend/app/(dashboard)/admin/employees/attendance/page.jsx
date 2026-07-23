'use client';

import { useState, useEffect } from 'react';
import { Calendar, Search, CheckCircle2, XCircle, Clock, RefreshCw, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
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
        // Initialize default attendance state
        const initial = {};
        (json.employees || []).forEach(e => {
          initial[e._id] = 'PRESENT';
        });
        setAttendance(initial);
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (empId, status) => {
    setAttendance(prev => ({ ...prev, [empId]: status }));
    toast.success(`Marked as ${status}`);
  };

  const filteredEmployees = employees.filter(emp => {
    const term = search.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.empId?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Employee Attendance Tracker</h1>
          <p className="text-slate-500 text-xs mt-1">Record and manage daily staff attendance logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>
          <button 
            onClick={fetchEmployees}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table & Controls */}
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
          <div className="text-xs text-slate-500 font-semibold">
            Date Selected: <strong className="text-indigo-600 dark:text-indigo-400">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Attendance Database...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Users className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            No registered employees found. Add employees in the registry first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Status Log</th>
                  <th className="py-3.5 px-6 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredEmployees.map((emp) => {
                  const currentStatus = attendance[emp._id] || 'PRESENT';
                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500">
                            {emp.photo ? <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" /> : emp.name?.[0]}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm">{emp.name}</div>
                            <div className="text-[11px] text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-indigo-600 dark:text-indigo-400">
                        {emp.empId}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{emp.department}</span>
                        <span className="text-[11px] text-slate-400">{emp.designation}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {currentStatus === 'PRESENT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Present
                          </span>
                        )}
                        {currentStatus === 'ABSENT' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase tracking-wider">
                            <XCircle className="w-3.5 h-3.5" /> Absent
                          </span>
                        )}
                        {currentStatus === 'HALF_DAY' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" /> Half Day
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => markAttendance(emp._id, 'PRESENT')}
                            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${currentStatus === 'PRESENT' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'}`}
                          >
                            P
                          </button>
                          <button 
                            onClick={() => markAttendance(emp._id, 'ABSENT')}
                            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${currentStatus === 'ABSENT' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50'}`}
                          >
                            A
                          </button>
                          <button 
                            onClick={() => markAttendance(emp._id, 'HALF_DAY')}
                            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${currentStatus === 'HALF_DAY' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50'}`}
                          >
                            Half
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
