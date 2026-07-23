'use client';

import { useState, useEffect } from 'react';
import { 
  Wrench, AlertTriangle, CheckCircle2, Save, Clock, ShieldCheck, RefreshCw, Power
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MaintenanceModePage() {
  const [loading, setLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    message: 'GayaSeva platform is currently undergoing scheduled maintenance for system upgrades. We will be back shortly!',
    estimatedUptime: '2 Hours',
    allowAdminAccess: true,
    bypassKey: 'GS_MAINT_BYPASS_2026'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_maintenance_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.isMaintenance === 'boolean') setIsMaintenance(parsed.isMaintenance);
          if (parsed.maintenanceForm) setMaintenanceForm(parsed.maintenanceForm);
        } catch (e) {}
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_maintenance_config', JSON.stringify({ isMaintenance, maintenanceForm }));
      }
      toast.success(isMaintenance ? 'Maintenance Mode is ACTIVE' : 'System is ONLINE & Normal');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Platform Maintenance Mode</h1>
          <p className="text-slate-500 text-xs mt-1">Enable or disable system-wide maintenance mode for public users.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Maintenance State'}
        </button>
      </div>

      {/* Main Banner Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
              isMaintenance ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            }`}>
              <Wrench className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Operational Status</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isMaintenance ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                }`}>
                  {isMaintenance ? '● MAINTENANCE MODE ACTIVE' : '● SYSTEM ONLINE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isMaintenance ? 'Normal user access is currently paused. Maintenance page is live.' : 'Platform is fully operational for all visitors, vendors, and workforce.'}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              const next = !isMaintenance;
              setIsMaintenance(next);
              toast.success(next ? 'Toggled Maintenance ON' : 'Toggled System ONLINE');
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-black transition shadow-lg flex items-center gap-2 ${
              isMaintenance 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
            }`}
          >
            <Power className="w-4 h-4" />
            {isMaintenance ? 'TURN PLATFORM ONLINE' : 'ENABLE MAINTENANCE MODE'}
          </button>
        </div>

        {/* Form Settings */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Public Maintenance Notice Message *
            </label>
            <textarea 
              rows="3"
              value={maintenanceForm.message}
              onChange={e => setMaintenanceForm({...maintenanceForm, message: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Estimated Downtime Duration
              </label>
              <input 
                type="text" 
                value={maintenanceForm.estimatedUptime}
                onChange={e => setMaintenanceForm({...maintenanceForm, estimatedUptime: e.target.value})}
                placeholder="e.g. 2 Hours, or Until 5:00 PM"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Super Admin Emergency Bypass Secret Key
              </label>
              <input 
                type="text" 
                value={maintenanceForm.bypassKey}
                onChange={e => setMaintenanceForm({...maintenanceForm, bypassKey: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </form>

      </div>

    </div>
  );
}
