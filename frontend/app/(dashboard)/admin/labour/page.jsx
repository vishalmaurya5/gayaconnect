'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiTool } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLabourPage() {
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Labour Management</h1>
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
                {labourers.map(labour => (
                  <tr key={labour._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-1.5 bg-orange-100 text-orange-600 rounded-md"><FiTool /></span>
                        {labour.name}
                      </div>
                      <div className="text-slate-500 text-xs mt-1">{labour.phone}</div>
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
                      <button onClick={() => deleteLabour(labour._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                        <FiTrash2 className="text-lg" />
                      </button>
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
    </div>
  );
}
