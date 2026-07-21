'use client';
import { useState } from 'react';
import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const attendanceRecord = [
    { id: 1, empId: 'EMP-001', name: 'Rajeev Kumar', inTime: '09:05 AM', outTime: '06:10 PM', status: 'Present' },
    { id: 2, empId: 'EMP-002', name: 'Sneha Sharma', inTime: '09:15 AM', outTime: '-', status: 'Present' },
    { id: 3, empId: 'EMP-003', name: 'Amit Singh', inTime: '-', outTime: '-', status: 'Absent' },
    { id: 4, empId: 'EMP-004', name: 'Priya Desai', inTime: '10:30 AM', outTime: '06:00 PM', status: 'Half Day' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Log</h1>
          <p className="text-slate-500 text-sm mt-1">Track employee daily attendance and working hours.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name or ID..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
              />
            </div>
            <button onClick={() => toast.success('Attendance report exported')} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {attendanceRecord.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{record.name}</p>
                    <p className="text-xs text-slate-500">{record.empId}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{record.inTime}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{record.outTime}</td>
                  <td className="px-6 py-4">
                    {record.status === 'Present' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Present</span>}
                    {record.status === 'Absent' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700"><XCircle className="w-3.5 h-3.5" /> Absent</span>}
                    {record.status === 'Half Day' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5" /> Half Day</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs">Edit Time</button>
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
