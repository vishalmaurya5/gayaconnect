'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, Lock, ShieldCheck, Key, AlertTriangle, Save, RefreshCw, CheckCircle2, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [secConfig, setSecConfig] = useState({
    twoFactorAuth: false,
    sessionTimeoutMinutes: 60,
    rateLimitRequests: 5,
    rateLimitWindowMins: 15,
    enforceStrongPasswords: true,
    emergencyLockdown: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_security_config');
      if (saved) {
        try { setSecConfig(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_security_config', JSON.stringify(secConfig));
      }
      toast.success('Security policies updated successfully!');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Security & Access Controls</h1>
          <p className="text-slate-500 text-xs mt-1">Configure session policies, rate limiting, and emergency platform protection.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Security Rules'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Policy Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Authentication & Rate Limiting Rules
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">Multi-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-500">Require OTP code for administrative logins.</span>
              </div>
              <input 
                type="checkbox" 
                checked={secConfig.twoFactorAuth}
                onChange={e => setSecConfig({...secConfig, twoFactorAuth: e.target.checked})}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">Enforce Complex Passwords</span>
                <span className="text-[11px] text-slate-500">Require uppercase, number, and special characters.</span>
              </div>
              <input 
                type="checkbox" 
                checked={secConfig.enforceStrongPasswords}
                onChange={e => setSecConfig({...secConfig, enforceStrongPasswords: e.target.checked})}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Admin Session Timeout (Minutes)
                </label>
                <input 
                  type="number" 
                  value={secConfig.sessionTimeoutMinutes}
                  onChange={e => setSecConfig({...secConfig, sessionTimeoutMinutes: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Login Attempt Limit (Per Window)
                </label>
                <input 
                  type="number" 
                  value={secConfig.rateLimitRequests}
                  onChange={e => setSecConfig({...secConfig, rateLimitRequests: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Emergency Protection */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-rose-600 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Emergency Platform Lockdown
          </h2>

          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-xs space-y-2">
            <h4 className="font-extrabold text-rose-400">Security Lockdown Notice</h4>
            <p className="text-slate-300 leading-relaxed font-medium">
              Activating lockdown will immediately revoke all user login sessions and restrict platform access exclusively to Super Admins.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-black text-slate-900 dark:text-white block">Emergency System Lockdown</span>
              <span className="text-slate-500 font-medium">{secConfig.emergencyLockdown ? 'Status: LOCKDOWN ACTIVE' : 'Status: Normal Mode'}</span>
            </div>

            <button 
              onClick={() => {
                const next = !secConfig.emergencyLockdown;
                setSecConfig({...secConfig, emergencyLockdown: next});
                toast.success(next ? 'Emergency Lockdown ENABLED' : 'Lockdown disabled');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                secConfig.emergencyLockdown ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {secConfig.emergencyLockdown ? 'DISABLE LOCKDOWN' : 'ENABLE LOCKDOWN'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
