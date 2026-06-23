'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
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

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing: form })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-2xl">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Platform Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Pricing & Fees (in INR)</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Subscription Price</label>
            <input 
              type="number" 
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
              value={form.subscription} 
              onChange={(e) => setForm({ ...form, subscription: Number(e.target.value) })} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Banner Advertisement Price</label>
            <input 
              type="number" 
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
              value={form.banner} 
              onChange={(e) => setForm({ ...form, banner: Number(e.target.value) })} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Listing Price</label>
            <input 
              type="number" 
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
              value={form.vehicle} 
              onChange={(e) => setForm({ ...form, vehicle: Number(e.target.value) })} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Vendor Registration Fee</label>
            <input 
              type="number" 
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
              value={form.vendorRegistration} 
              onChange={(e) => setForm({ ...form, vendorRegistration: Number(e.target.value) })} 
            />
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-md font-bold text-slate-800 mb-4">Promotional Offer Plans</h3>
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">7 Days Plan</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
                  value={form.offer7Days} 
                  onChange={(e) => setForm({ ...form, offer7Days: Number(e.target.value) })} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">30 Days Plan</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
                  value={form.offer30Days} 
                  onChange={(e) => setForm({ ...form, offer30Days: Number(e.target.value) })} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">365 Days Plan</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition" 
                  value={form.offer365Days} 
                  onChange={(e) => setForm({ ...form, offer365Days: Number(e.target.value) })} 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Charge Vendor Registration Fee</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">If enabled, new vendors will have to pay the registration fee during sign-up via Razorpay.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={form.chargeVendorRegistration} onChange={(e) => setForm({ ...form, chargeVendorRegistration: e.target.checked })} />
              <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <button 
            onClick={saveSettings} 
            disabled={saving}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
