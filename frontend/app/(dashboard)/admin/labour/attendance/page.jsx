'use client';

import { useState, useEffect, useContext } from 'react';
import { 
  Search, CalendarCheck, Clock, CheckCircle2, XCircle, AlertCircle, HardHat, Calendar, RefreshCw
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LabourAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/labour/attendance?date=${selectedDate}&search=${searchInput}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (error) {
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (labourId, status) => {
    setUpdatingId(labourId);
    try {
      const res = await fetch('/api/admin/labour/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labourId,
          date: selectedDate,
          status
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Marked as ${status}`);
        fetchAttendance();
      } else {
        toast.error(data.message || 'Failed to update attendance');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRecords = records.filter(r => {
    const s = searchInput.toLowerCase();
    return !s || 
      r.labour?.name?.toLowerCase().includes(s) || 
      r.labour?.phone?.includes(s) || 
      r.labour?.lwfId?.toLowerCase().includes(s);
  });

  const presentCount = records.filter(r => r.attendance?.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.attendance?.status === 'ABSENT').length;
  const halfDayCount = records.filter(r => r.attendance?.status === 'HALF_DAY').length;
  const overtimeCount = records.filter(r => r.attendance?.status === 'OVERTIME').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Labour Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track daily check-ins, absences, and shift logs for the active workforce.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>
          <button 
            onClick={fetchAttendance}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:bg-slate-50"
            title="Refresh Attendance"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Listed</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{records.length}</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm text-center">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Present</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{presentCount}</div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/50 shadow-sm text-center">
          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Absent</div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">{absentCount}</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-sm text-center">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Half-Day</div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{halfDayCount}</div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 shadow-sm text-center col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Overtime</div>
          <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">{overtimeCount}</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search worker by name or phone..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="text-sm font-bold text-slate-500">
            Date: <span className="text-indigo-600 font-mono">{selectedDate}</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Worker Identity</th>
                  <th className="px-6 py-4">Role & Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Quick Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 text-blue-500">
                        <CalendarCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Workers Found</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Verify workers in the Labour Directory to log daily attendance.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(({ labour, attendance }) => {
                    const status = attendance?.status || 'UNMARKED';
                    const isUpdating = updatingId === labour._id;

                    return (
                      <tr key={labour._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-indigo-500/30">
                              {labour.photo ? (
                                <img src={labour.photo} alt="worker" className="w-full h-full object-cover" />
                              ) : (
                                <HardHat className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-sm">{labour.name}</div>
                              <div className="text-xs text-slate-500 font-mono">{labour.lwfId || 'GS-LWF'} • {labour.phone}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                            {labour.profession || labour.category || labour.role || 'Worker'}
                          </div>
                          <div className="text-xs text-slate-500">{labour.district || 'Gaya'}</div>
                        </td>

                        <td className="px-6 py-4">
                          {status === 'PRESENT' && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Present
                            </span>
                          )}
                          {status === 'ABSENT' && (
                            <span className="px-3 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-full border border-rose-200 inline-flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Absent
                            </span>
                          )}
                          {status === 'HALF_DAY' && (
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-200 inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Half-Day
                            </span>
                          )}
                          {status === 'OVERTIME' && (
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200 inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Overtime
                            </span>
                          )}
                          {status === 'UNMARKED' && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 font-semibold text-xs rounded-full border border-slate-200">
                              Unmarked
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={isUpdating}
                              onClick={() => markAttendance(labour._id, 'PRESENT')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                                status === 'PRESENT' 
                                  ? 'bg-emerald-600 text-white border-emerald-600' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              P
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => markAttendance(labour._id, 'ABSENT')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                                status === 'ABSENT' 
                                  ? 'bg-rose-600 text-white border-rose-600' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              A
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => markAttendance(labour._id, 'HALF_DAY')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                                status === 'HALF_DAY' 
                                  ? 'bg-amber-500 text-white border-amber-500' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              Half
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => markAttendance(labour._id, 'OVERTIME')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                                status === 'OVERTIME' 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                              }`}
                            >
                              OT
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
