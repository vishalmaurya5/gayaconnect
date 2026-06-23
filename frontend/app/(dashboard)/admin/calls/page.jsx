'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';

export default function AdminCallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.success && data.callLogs) {
        setCalls(data.callLogs);
      }
    } catch (error) {
      toast.error('Failed to load call logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Caller Role', 'Caller Name', 'Receiver Type', 'Receiver Name', 'Date', 'Time'];
    const csvContent = [
      headers.join(','),
      ...calls.map(c => [
        c.callerId?.role || 'Guest',
        c.callerId?.name || 'Unknown',
        c.receiverType,
        c.receiverId?.name || 'Unknown',
        new Date(c.createdAt).toLocaleDateString(),
        new Date(c.createdAt).toLocaleTimeString()
      ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `call_logs_export.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Call Logs</h1>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold transition-colors"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Caller</th>
                  <th className="px-6 py-4">Receiver Type</th>
                  <th className="px-6 py-4">Receiver Name</th>
                  <th className="px-6 py-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {calls.map((call, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{call.callerId?.name || 'Unknown User'}</div>
                      <div className="text-xs text-slate-500 capitalize bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
                        {call.callerId?.role || 'Guest'}
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-700">
                      {call.receiverType}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {call.receiverId?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900">{new Date(call.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(call.createdAt).toLocaleTimeString()}</div>
                    </td>
                  </tr>
                ))}
                {calls.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No calls recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
