'use client';

import { useState, useEffect } from 'react';
import { Shield, UserPlus, MapPin, Trash2, Search, Building2, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [customCity, setCustomCity] = useState('');
  const [isCustomCitySelected, setIsCustomCitySelected] = useState(false);

  const CITIES_LIST = [
    'Gaya',
    'Patna',
    'Muzaffarpur',
    'Bhagalpur',
    'Ranchi',
    'Varanasi',
    'Nawada',
    'Jehanabad',
    'Aurangabad',
    'Arwal',
    'Dhanbad',
    'Kolkata',
    'Delhi',
    'All India (Global)'
  ];

  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    role: 'ADMIN', 
    assignedCity: 'Gaya' 
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/system-admins');
      const json = await res.json();
      if (json.success) setAdmins(json.admins || []);
      else toast.error(json.message || 'Failed to load admins');
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (e) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setIsCustomCitySelected(true);
      setForm(prev => ({ ...prev, assignedCity: customCity }));
    } else {
      setIsCustomCitySelected(false);
      setForm(prev => ({ ...prev, assignedCity: val }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const finalCity = isCustomCitySelected ? customCity.trim() : form.assignedCity;
    if (!finalCity) {
      toast.error('Please select or enter an Assigned City');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        ...form,
        assignedCity: finalCity === 'All India (Global)' ? '' : finalCity
      };

      const res = await fetch('/api/admin/system-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Admin Account Created Successfully');
        setForm({ name: '', email: '', phone: '', password: '', role: 'ADMIN', assignedCity: 'Gaya' });
        setCustomCity('');
        setIsCustomCitySelected(false);
        fetchAdmins();
      } else {
        toast.error(json.message || 'Failed to create admin');
      }
    } catch (err) {
      toast.error('Creation failed');
    } finally {
      setCreating(false);
    }
  };

  const deleteAdmin = async (id, name) => {
    if (!confirm(`Are you sure you want to delete and revoke admin access for "${name}"?`)) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/system-admins/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || 'Admin account deleted');
        fetchAdmins();
      } else {
        toast.error(json.message || 'Failed to delete admin');
      }
    } catch (err) {
      toast.error('Failed to revoke admin access');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Administrators</h1>
          <p className="text-slate-500 text-xs mt-1">Provision, assign permissions, and manage Super Admins and City-Specific Managers.</p>
        </div>

        <button 
          onClick={fetchAdmins}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2 text-xs font-bold"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Registry
        </button>
      </div>

      {/* Grant Admin Access Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <UserPlus className="w-5 h-5" /> 
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Grant Admin Access</h2>
            <p className="text-slate-500 text-xs mt-0.5">Assign administrative roles and geographic city permissions.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Rajesh Sharma"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-medium outline-none focus:border-indigo-500 transition-all dark:text-white" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input 
              required 
              type="email" 
              placeholder="admin@gayaseva.com"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-medium outline-none focus:border-indigo-500 transition-all dark:text-white" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input 
              required 
              type="text" 
              placeholder="9876543210"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-medium outline-none focus:border-indigo-500 transition-all dark:text-white" 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Initial Password *
            </label>
            <input 
              required 
              type="password" 
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-medium outline-none focus:border-indigo-500 transition-all dark:text-white" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Privilege Level *
            </label>
            <select 
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
            >
              <option value="ADMIN">City Admin (Assigned City Operations)</option>
              <option value="SUPER_ADMIN">Master Super Admin (Full Global Access)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Assigned City Permission *
            </label>
            <select 
              value={isCustomCitySelected ? 'CUSTOM' : form.assignedCity}
              onChange={handleCitySelect}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
            >
              {CITIES_LIST.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="CUSTOM">+ Type Other Custom City Name</option>
            </select>

            {isCustomCitySelected && (
              <input 
                type="text" 
                placeholder="Type City Name (e.g. Siwan, Buxar)"
                value={customCity}
                onChange={e => {
                  setCustomCity(e.target.value);
                  setForm(prev => ({ ...prev, assignedCity: e.target.value }));
                }}
                className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-500 px-4 py-2 text-xs font-medium outline-none text-slate-900 dark:text-white"
              />
            )}
          </div>

          <div className="col-span-full mt-2">
            <button 
              type="submit"
              disabled={creating} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {creating ? 'Creating Admin Account...' : 'Create System Admin Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Admins List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-500 flex justify-between items-center">
          <span>Registered System Administrators ({admins.length})</span>
          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">Master Audit Control</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Administrators...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            No system administrators found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Admin Name & Details</th>
                  <th className="px-6 py-4">Role & Privilege Level</th>
                  <th className="px-6 py-4">Assigned City Permission</th>
                  <th className="px-6 py-4 text-right">Delete / Revoke Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {admins.map(admin => (
                  <tr key={admin._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{admin.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{admin.email} • {admin.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {admin.adminRole === 'SUPER_ADMIN' ? (
                        <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" /> Super Admin
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                          <UserPlus className="w-3.5 h-3.5" /> City Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      {admin.assignedCities && admin.assignedCities.length > 0 && admin.assignedCities[0] ? (
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500"/> {admin.assignedCities.join(', ')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg">
                          🌐 All India (Global)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        disabled={deletingId === admin._id}
                        onClick={() => deleteAdmin(admin._id, admin.name)} 
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1.5 ml-auto border border-rose-200 dark:border-rose-900/40 disabled:opacity-50" 
                        title="Delete Admin Account"
                      >
                        {deletingId === admin._id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete Admin
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
