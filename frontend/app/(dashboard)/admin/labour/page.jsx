'use client';

import { useState, useEffect, useContext } from 'react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiTool, FiCreditCard, FiSearch, FiEye } from 'react-icons/fi';
import { AdminContext } from '../layout';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminLabourPage() {
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchLabourers();
  }, []);

  const fetchLabourers = async () => {
    try {
      const res = await fetch('/api/admin/labour');
      const data = await res.json();
      if (data.success) {
        setLabourers(data.labourers || []);
      }
    } catch (error) {
      toast.error('Failed to load labour profiles');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/labour/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Profile ${!currentStatus ? 'approved' : 'unapproved'}`);
        setLabourers(labourers.map(l => l._id === id ? { ...l, isApproved: !currentStatus } : l));
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const deleteLabour = async (id) => {
    if (!confirm('Are you sure you want to delete this labour profile?')) return;
    try {
      const res = await fetch(`/api/admin/labour/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile deleted');
        setLabourers(labourers.filter(l => l._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting profile');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'labourer', ...form })
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Labourer created successfully');
        setForm({ name: '', phone: '', skill: '', dailyRate: '', address: '' });
        fetchLabourers();
      } else {
        toast.error(json.message || 'Failed to create labourer');
      }
    } catch (error) {
      toast.error('Error creating labourer');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Labour Management</h1>
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Aadhaar, Name, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Labourer</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
            <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
            <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Skill (Category)</label>
            <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" value={form.skill} onChange={e => setForm({...form, skill: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Daily Rate (₹)</label>
            <input type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" value={form.dailyRate} onChange={e => setForm({...form, dailyRate: e.target.value})} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Area / Address</label>
            <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <button type="submit" disabled={creating} className="sm:col-span-2 md:col-span-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {creating ? 'Creating...' : 'Create Labourer'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Worker Info</th>
                  <th className="px-6 py-4">Profession & Area</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {labourers.filter(l => 
                  !searchTerm || 
                  l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  (l.aadhaarNumber && l.aadhaarNumber.includes(searchTerm)) ||
                  (l.lwfId && l.lwfId.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map(labour => (
                  <tr key={labour._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-1.5 bg-orange-100 text-orange-600 rounded-md"><FiTool /></span>
                        {labour.name}
                      </div>
                      <div className="text-slate-500 text-xs mt-1">{labour.phone}</div>
                      {labour.aadhaarNumber && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar</span>
                          <span className="text-xs font-mono font-bold">{labour.aadhaarNumber}</span>
                          {labour.aadhaarImage && (
                            <button onClick={() => setSelectedImage(labour.aadhaarImage)} className="text-indigo-600 hover:text-indigo-800 ml-1">
                              <FiEye />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{labour.profession}</div>
                      <div className="text-xs text-slate-500">{labour.location}</div>
                      {labour.experience && <div className="text-xs text-slate-500">Exp: {labour.experience}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {labour.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-100 px-2 py-1 rounded">
                          <FiCheckCircle /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs bg-amber-100 px-2 py-1 rounded">
                          <FiXCircle /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => toggleApproval(labour._id, labour.isApproved)} 
                        className={`px-3 py-1.5 rounded-lg font-semibold text-white transition ${labour.isApproved ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                      >
                        {labour.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                      {labour.status === 'APPROVED' || labour.isApproved ? (
                        <Link href={`/admin/labour/${labour._id}/id-card`} className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition inline-flex items-center gap-1">
                          <FiCreditCard /> ID Card
                        </Link>
                      ) : null}
                      {admin?.role === 'SUPER_ADMIN' && (
                        <button onClick={() => deleteLabour(labour._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                          <FiTrash2 className="text-lg" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {labourers.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No labour profiles found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full bg-white p-2 rounded-2xl shadow-2xl">
            <img src={selectedImage} alt="Verification Document" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white text-slate-900 rounded-full p-2 shadow-lg hover:bg-slate-100 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
