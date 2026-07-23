'use client';

import { useState, useEffect } from 'react';
import { Sliders, Save, Key, DollarSign, Lock, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    subscription: 11,
    banner: 199,
    vehicle: 200,
    vendorRegistration: 49,
    chargeVendorRegistration: false,
    offer7Days: 39,
    offer30Days: 199,
    offer365Days: 399
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.pricing) {
        setForm(prev => ({ ...prev, ...data.pricing }));
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing: form })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Platform pricing settings updated successfully');
      } else {
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const changeAdminPassword = async (e) => {
    e?.preventDefault();
    if (pwForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Admin password updated successfully!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Error updating password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">General Platform Settings</h1>
          <p className="text-slate-500 text-xs mt-1">Configure platform pricing tiers, vendor fees, and master admin credentials.</p>
        </div>

        <button 
          onClick={fetchSettings}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Pricing & Fee Structure */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Platform Pricing Tiers (INR ₹)
          </h2>

          <form onSubmit={saveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Monthly Subscription Fee (₹)
                </label>
                <input 
                  type="number" 
                  value={form.subscription}
                  onChange={e => setForm({ ...form, subscription: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Banner Ad Price (₹)
                </label>
                <input 
                  type="number" 
                  value={form.banner}
                  onChange={e => setForm({ ...form, banner: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Vehicle Listing Price (₹)
                </label>
                <input 
                  type="number" 
                  value={form.vehicle}
                  onChange={e => setForm({ ...form, vehicle: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Vendor Registration Fee (₹)
                </label>
                <input 
                  type="number" 
                  value={form.vendorRegistration}
                  onChange={e => setForm({ ...form, vendorRegistration: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="font-black text-slate-800 dark:text-slate-200 block uppercase tracking-wider text-[11px]">Promotional Offers Pricing:</span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">7 Days Plan</label>
                  <input 
                    type="number" 
                    value={form.offer7Days}
                    onChange={e => setForm({ ...form, offer7Days: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">30 Days Plan</label>
                  <input 
                    type="number" 
                    value={form.offer30Days}
                    onChange={e => setForm({ ...form, offer30Days: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">365 Days Plan</label>
                  <input 
                    type="number" 
                    value={form.offer365Days}
                    onChange={e => setForm({ ...form, offer365Days: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Charge Vendor Registration Fee</p>
                <p className="text-[11px] text-slate-500 font-medium">Require Razorpay payment during vendor signup.</p>
              </div>
              <input 
                type="checkbox" 
                checked={form.chargeVendorRegistration} 
                onChange={e => setForm({ ...form, chargeVendorRegistration: e.target.checked })} 
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Pricing Tiers'}
            </button>
          </form>
        </div>

        {/* Right Card: Master Admin Password Change */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-indigo-500" /> Master Admin Password Reset
          </h2>

          <form onSubmit={changeAdminPassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Current Password *
              </label>
              <input 
                required
                type="password" 
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                placeholder="Enter current master admin password"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                New Admin Password *
              </label>
              <input 
                required
                type="password" 
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="At least 8 characters"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <input 
                required
                type="password" 
                value={pwForm.confirmPassword}
                onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={pwSaving}
              className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-black py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              <Key className="w-4 h-4 text-amber-400" /> {pwSaving ? 'Updating...' : 'Update Master Admin Password'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
