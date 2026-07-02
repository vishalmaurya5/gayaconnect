'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiTrash2, FiClock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Category approved');
        setCategories(categories.map(c => c._id === id ? { ...c, approved: true } : c));
      } else {
        toast.error(data.message || 'Failed to approve');
      }
    } catch (e) {
      toast.error('Error approving category');
    }
  };

  const handleDelete = async (id, isDefault) => {
    if (isDefault) {
      toast.error('Cannot delete a default category');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Category deleted');
        setCategories(categories.filter(c => c._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (e) {
      toast.error('Error deleting category');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Category Management</h1>
        <p className="text-slate-500 mt-2">Manage vehicle categories, approve custom additions from users/vendors.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-slate-900">{cat.name}</div>
                  {!cat.is_default && <div className="text-xs text-slate-500 mt-0.5">Created by {cat.created_by_role}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cat.is_default ? (
                    <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">System</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-bold">Custom</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cat.approved ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                      <FiCheckCircle /> Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-orange-500 text-sm font-bold">
                      <FiClock /> Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <div className="flex justify-end gap-3">
                    {!cat.approved && (
                      <button onClick={() => handleApprove(cat._id)} className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold transition">
                        Approve
                      </button>
                    )}
                    {!cat.is_default && (
                      <button onClick={() => handleDelete(cat._id, cat.is_default)} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1">
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  <FiAlertCircle className="mx-auto text-3xl mb-3 text-slate-300" />
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
