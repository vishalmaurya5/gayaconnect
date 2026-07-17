'use client';

import { useState, useEffect } from 'react';
import { Shield, UserPlus, MapPin, Trash2, Edit2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'ADMIN', assignedCity: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/system-admins');
      const json = await res.json();
      if (json.success) setAdmins(json.admins || []);
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/system-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Admin created successfully');
        setForm({ name: '', email: '', phone: '', password: '', role: 'ADMIN', assignedCity: '' });
        fetchAdmins();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error('Creation failed');
    } finally {
      setCreating(false);
    }
  };

  const deleteAdmin = async (id) => {
    if(!confirm("Are you sure you want to revoke this admin's access?")) return;
    try {
      const res = await fetch(`/api/admin/system-admins/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if(json.success) {
        toast.success('Admin revoked');
        fetchAdmins();
      } else toast.error(json.message);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Administrators</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage Super Admins and Limited City Admins.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
            <UserPlus className="w-5 h-5" /> 
          </div>
          Grant Admin Access
        </h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
            <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 transition-all dark:text-white" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input required type="email" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 transition-all dark:text-white" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
            <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 transition-all dark:text-white" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Initial Password</label>
            <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 transition-all dark:text-white" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Admin Role</label>
            <select className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 transition-all dark:text-white" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
              <option value="ADMIN">Limited City Admin</option>
              <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            </select>
          </div>
          {form.role === 'ADMIN' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Assigned City</label>
              <input required type="text" placeholder="e.g. Patna" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 transition-all dark:text-white" value={form.assignedCity} onChange={e=>setForm({...form, assignedCity: e.target.value})} />
            </div>
          )}
          <div className="col-span-full mt-2">
            <button disabled={creating} className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50">
              {creating ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Admin Name</th>
              <th className="px-6 py-4">Role & Permissions</th>
              <th className="px-6 py-4">Assigned City</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {admins.map(admin => (
              <tr key={admin._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-white">{admin.name}</div>
                  <div className="text-xs text-slate-500">{admin.email} | {admin.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {admin.adminRole === 'SUPER_ADMIN' ? (
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-md text-xs flex items-center gap-1 w-max">
                      <Shield className="w-4 h-4" /> Super Admin
                    </span>
                  ) : (
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-md text-xs flex items-center gap-1 w-max">
                      <UserPlus className="w-4 h-4" /> City Admin
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">
                  {admin.assignedCities && admin.assignedCities.length > 0 ? (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400"/> {admin.assignedCities.join(', ')}</span>
                  ) : (
                    'All India (Global)'
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteAdmin(admin._id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 rounded-lg transition" title="Revoke Access">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan="4" className="text-center p-8">Loading admins...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
