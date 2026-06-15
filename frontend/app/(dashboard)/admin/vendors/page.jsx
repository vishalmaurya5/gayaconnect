'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors || []);
      }
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Vendor ${!currentStatus ? 'approved' : 'unapproved'}`);
        setVendors(vendors.map(v => v._id === id ? { ...v, isApproved: !currentStatus } : v));
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Error updating vendor');
    }
  };

  const deleteVendor = async (id) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Vendor deleted');
        setVendors(vendors.filter(v => v._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting vendor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Vendor Management</h1>
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
                  <th className="px-6 py-4">Business / Category</th>
                  <th className="px-6 py-4">Contact User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{vendor.name}</div>
                      <div className="text-slate-500 text-xs mt-1">{vendor.category} {vendor.subCategory ? `> ${vendor.subCategory}` : ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.userId ? (
                        <>
                          <div className="font-medium text-slate-700">{vendor.userId.name}</div>
                          <div className="text-xs text-slate-500">{vendor.userId.email}</div>
                          <div className="text-xs text-slate-500">{vendor.userId.phone}</div>
                        </>
                      ) : (
                        <span className="text-slate-400">No linked user</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {vendor.isApproved ? (
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
                        onClick={() => toggleApproval(vendor._id, vendor.isApproved)} 
                        className={`px-3 py-1.5 rounded-lg font-semibold text-white transition ${vendor.isApproved ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                      >
                        {vendor.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                      <button onClick={() => deleteVendor(vendor._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
                {vendors.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No vendors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
