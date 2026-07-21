'use client';
import { useState, useEffect } from 'react';
import { Activity, Users, Globe, Cpu, Zap, SignalHigh } from 'lucide-react';

export default function LiveStatsPage() {
  const [activeUsers, setActiveUsers] = useState(342);

  // Simulate live data fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live System Statistics</h1>
          </div>
          <p className="text-slate-500 text-sm ml-6">Real-time monitoring of platform health and traffic.</p>
        </div>
        <div className="text-right relative z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Users Right Now</p>
          <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{activeUsers}</p>
        </div>
        {/* Decorative Background */}
        <div className="absolute -right-20 -bottom-20 opacity-5">
          <Activity className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">Normal</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Server Load</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">24.5%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full w-1/4 transition-all"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">Optimal</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">API Response Time</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">124 ms</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[15%] transition-all"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <SignalHigh className="w-6 h-6" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">Connected</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Database Connections</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">89 / 500</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full w-1/5 transition-all"></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-center items-center text-center h-80">
        <Globe className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Traffic Map (Coming Soon)</h3>
        <p className="text-slate-500 max-w-md mt-2">Geospatial visualization of real-time active users across the globe will be integrated here.</p>
      </div>
    </div>
  );
}
