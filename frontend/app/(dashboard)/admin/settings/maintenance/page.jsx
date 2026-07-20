'use client';

import { useContext, useState } from 'react';
import { 
  Wrench, AlertTriangle
} from 'lucide-react';
import { AdminContext } from '../../layout';

export default function MaintenanceModePage() {
  const admin = useContext(AdminContext);
  const [isMaintenance, setIsMaintenance] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Maintenance Mode</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Enable or disable platform maintenance mode for all users.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 shrink-0">
            <Wrench className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              System Status
              {isMaintenance && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider ml-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Offline</span>}
              {!isMaintenance && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider ml-2">Online</span>}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Turning on maintenance mode will restrict access for all normal users and display a "System Under Maintenance" page. Super Admins will still have access to the dashboard.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => setIsMaintenance(!isMaintenance)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isMaintenance ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isMaintenance ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isMaintenance ? 'Maintenance Mode is ACTIVE' : 'Toggle to enable Maintenance Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
