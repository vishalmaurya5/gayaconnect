'use client';

import { useState, useEffect } from 'react';
import { FiUserPlus, FiShield, FiMapPin, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
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
      if (json.success) setAdmins(json.admins);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Administrators</h1>
        <p className="text-slate-500 mt-1">Manage Super Admins and Limited City Admins.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <FiUserPlus className="text-emerald-500" /> Grant Admin Access
        </h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
            <input required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-2" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
            <input required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-2" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Password</label>
            <input required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-2" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Admin Role</label>
            <select className="w-full rounded-xl border border-slate-300 px-4 py-2" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
              <option value="ADMIN">Limited City Admin</option>
              <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            </select>
          </div>
          {form.role === 'ADMIN' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Assigned City</label>
              <input required type="text" placeholder="e.g. Patna" className="w-full rounded-xl border border-slate-300 px-4 py-2" value={form.assignedCity} onChange={e=>setForm({...form, assignedCity: e.target.value})} />
            </div>
          )}
          <div className="col-span-full mt-2">
            <button disabled={creating} className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition">
              {creating ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Admin Name</th>
              <th className="px-6 py-4">Role & Permissions</th>
              <th className="px-6 py-4">Assigned City</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map(admin => (
              <tr key={admin._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{admin.name}</div>
                  <div className="text-xs">{admin.email} | {admin.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {admin.adminRole === 'SUPER_ADMIN' ? (
                    <span className="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-md text-xs flex items-center gap-1 w-max">
                      <FiShield /> Super Admin
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-md text-xs flex items-center gap-1 w-max">
                      <FiUserPlus /> City Admin
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {admin.assignedCities && admin.assignedCities.length > 0 ? (
                    <span className="flex items-center gap-1"><FiMapPin className="text-slate-400"/> {admin.assignedCities.join(', ')}</span>
                  ) : (
                    'All India (Global)'
                  )}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteAdmin(admin._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Revoke Access">
                    <FiTrash2 />
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
