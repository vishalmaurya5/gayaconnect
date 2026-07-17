'use client';

import { useState } from 'react';
import { 
  Activity, Shield, Download, Search, Filter, 
  UserPlus, Edit, Trash2, CheckCircle, XCircle, 
  LogIn, FileText, CreditCard, Clock, MapPin, Smartphone
} from 'lucide-react';

// Mock Data for the Timeline & Logs (To be replaced by actual backend API later)
const MOCK_ACTIVITIES = [
  { id: 'ACT-001', type: 'LOGIN', user: 'Super Admin', email: 'admin@gayaseva.in', action: 'System Login', details: 'Authenticated successfully', timestamp: '10 mins ago', ip: '192.168.1.45', device: 'Windows / Chrome', status: 'success' },
  { id: 'ACT-002', type: 'APPROVE', user: 'System', email: 'system@gayaseva.in', action: 'Vendor Verified', details: 'Approved vendor profile for "Raj Hardware"', timestamp: '1 hour ago', ip: 'System Local', device: 'Server', status: 'success' },
  { id: 'ACT-003', type: 'CERTIFICATE', user: 'Manager', email: 'manager@gayaseva.in', action: 'Certificate Generated', details: 'Generated Labour ID Card for LWF-1029', timestamp: '3 hours ago', ip: '110.224.56.12', device: 'MacOs / Safari', status: 'success' },
  { id: 'ACT-004', type: 'DELETE', user: 'Super Admin', email: 'admin@gayaseva.in', action: 'User Deleted', details: 'Deleted spam user account', timestamp: '5 hours ago', ip: '192.168.1.45', device: 'Windows / Chrome', status: 'danger' },
  { id: 'ACT-005', type: 'PAYMENT', user: 'System', email: 'system@gayaseva.in', action: 'Payment Failed', details: 'Failed webhook for TRX-1026', timestamp: '12 hours ago', ip: 'Stripe Webhook', device: 'API', status: 'danger' },
  { id: 'ACT-006', type: 'UPDATE', user: 'Super Admin', email: 'admin@gayaseva.in', action: 'Settings Updated', details: 'Changed global commission rate to 10%', timestamp: '1 day ago', ip: '192.168.1.45', device: 'Windows / Chrome', status: 'warning' },
  { id: 'ACT-007', type: 'CREATE', user: 'Manager', email: 'manager@gayaseva.in', action: 'Job Posted', details: 'Created new official admin job posting', timestamp: '1 day ago', ip: '110.224.56.12', device: 'MacOs / Safari', status: 'success' },
];

export default function ActivityLogsPage() {
  const [view, setView] = useState('TIMELINE'); // TIMELINE or AUDIT
  const [searchTerm, setSearchTerm] = useState('');

  const getIconForType = (type) => {
    switch(type) {
      case 'LOGIN': return <LogIn className="w-4 h-4 text-blue-600" />;
      case 'APPROVE': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'REJECT': return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'CREATE': return <UserPlus className="w-4 h-4 text-indigo-600" />;
      case 'UPDATE': return <Edit className="w-4 h-4 text-amber-600" />;
      case 'DELETE': return <Trash2 className="w-4 h-4 text-rose-600" />;
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'CERTIFICATE': return <FileText className="w-4 h-4 text-teal-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBgForType = (type) => {
    switch(type) {
      case 'LOGIN': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'APPROVE': return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'REJECT': return 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
      case 'CREATE': return 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800';
      case 'UPDATE': return 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'DELETE': return 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
      case 'PAYMENT': return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      case 'CERTIFICATE': return 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800';
      default: return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const filteredLogs = MOCK_ACTIVITIES.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" /> System Activity & Audit
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor all administrative actions, security logs, and platform events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          
          {/* View Toggles */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-max">
            <button
              onClick={() => setView('TIMELINE')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                view === 'TIMELINE' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" /> Activity Timeline
            </button>
            <button
              onClick={() => setView('AUDIT')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                view === 'AUDIT' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" /> Audit Logs
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          
          {view === 'TIMELINE' && (
            <div className="p-6 lg:p-10 max-w-4xl mx-auto">
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-8 pb-8">
                {filteredLogs.map((log, i) => (
                  <div key={log.id} className="relative pl-8 group">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white dark:border-[#0B0F19] flex items-center justify-center ${getBgForType(log.type)}`}>
                      {getIconForType(log.type)}
                    </div>
                    
                    {/* Content Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200 dark:group-hover:border-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-base">{log.action}</span>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                            log.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                            log.status === 'danger' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' :
                            'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                          }`}>
                            {log.type}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {log.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                        {log.details}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-[9px]">
                            {log.user.charAt(0)}
                          </div>
                          {log.user}
                        </div>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5" /> {log.ip}
                        </div>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Smartphone className="w-3.5 h-3.5" /> {log.device}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="pl-8 text-slate-500">No timeline activities found matching your search.</div>
                )}
              </div>
            </div>
          )}

          {view === 'AUDIT' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-[#05080f]/80 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Log ID & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User / Actor</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Event Action</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors font-mono text-sm">
                      <td className="px-6 py-4">
                        <div className="font-bold text-indigo-600 dark:text-indigo-400">{log.id}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{log.timestamp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white font-sans">{log.user}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{log.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                            log.status === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' :
                            'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                          }`}>
                            {log.type}
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 font-sans">{log.action}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs mt-1 font-sans">{log.details}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                          <div><span className="text-slate-400">IP:</span> {log.ip}</div>
                          <div className="mt-0.5"><span className="text-slate-400">Device:</span> {log.device}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-slate-500 font-sans">
                        No audit logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
