'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { register: regCreate, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm({
    defaultValues: { name: '', email: '', phone: '', password: '', businessName: '', category: '', address: '' }
  });

  const { register: regEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm();

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    resetEdit({
      name: vendor.name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      businessName: vendor.businessName || '',
      category: vendor.category || '',
      address: vendor.address || '',
      description: vendor.description || '',
      location: vendor.location || '',
      whatsapp: vendor.whatsapp || ''
    });
  };

  const closeEditModal = () => {
    setEditingVendor(null);
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/vendors/${editingVendor._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success('Vendor updated successfully');
        setVendors(vendors.map(v => v._id === editingVendor._id ? resData.vendor : v));
        closeEditModal();
      } else {
        toast.error(resData.message || 'Failed to update vendor');
      }
    } catch (error) {
      toast.error('Error updating vendor');
    } finally {
      setUpdating(false);
    }
  };

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

  const onCreate = async (data) => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vendor', ...data })
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Vendor created successfully');
        resetCreate();
        fetchVendors();
      } else {
        toast.error(json.message || 'Failed to create vendor');
      }
    } catch (error) {
      toast.error('Error creating vendor');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Vendor Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Vendor</h2>
        <form onSubmit={handleCreateSubmit(onCreate)} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Owner Name</label>
            <input {...regCreate('name', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input {...regCreate('email', { required: true })} type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
            <input {...regCreate('phone', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Temporary Password</label>
            <input {...regCreate('password', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
            <input {...regCreate('businessName', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <input {...regCreate('category', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Business Address</label>
            <input {...regCreate('address', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <button type="submit" disabled={creating} className="sm:col-span-2 md:col-span-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {creating ? 'Creating...' : 'Create Vendor'}
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
                      <button onClick={() => openEditModal(vendor)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition inline-flex items-center gap-1" title="Edit Full Profile">
                        <FiEdit2 /> Edit
                      </button>
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

      {/* Edit Modal */}
      {editingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Edit Vendor Profile</h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600"><FiX className="text-xl" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="editVendorForm" onSubmit={handleEditSubmit(onUpdate)} className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Owner Name</label>
                  <input {...regEdit('name', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
                  <input {...regEdit('businessName', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input {...regEdit('email', { required: true })} type="email" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                  <input {...regEdit('phone', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
                  <input {...regEdit('whatsapp')} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <input {...regEdit('category', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                  <input {...regEdit('location')} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address</label>
                  <input {...regEdit('address')} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea {...regEdit('description')} rows="3" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeEditModal} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition">Cancel</button>
              <button type="submit" form="editVendorForm" disabled={updating} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
