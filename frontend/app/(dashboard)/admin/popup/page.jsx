'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiImage, FiUpload, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminPopupPage() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', link: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const res = await fetch('/api/admin/popups');
      const data = await res.json();
      if (data.success) {
        setPopups(data.popups || []);
      }
    } catch (error) {
      toast.error('Failed to load popups');
    } finally {
      setLoading(false);
    }
  };

  const togglePopupStatus = async (popupId, updates) => {
    try {
      const res = await fetch(`/api/admin/popups/${popupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Popup updated successfully');
        setPopups(popups.map(p => p._id === popupId ? data.popup : p));
      } else {
        toast.error(data.message || 'Failed to update popup');
      }
    } catch (error) {
      toast.error('Error updating popup');
    }
  };

  const deletePopup = async (popupId) => {
    if (!window.confirm("Are you sure you want to delete this popup?")) return;
    
    try {
      const res = await fetch(`/api/admin/popups/${popupId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Popup deleted');
        setPopups(popups.filter(p => p._id !== popupId));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting popup');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      return toast.error("Only JPG/JPEG files are allowed.");
    }
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size must be less than 2MB.");
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageUrl) return toast.error("Please upload a popup image");
    setCreating(true);
    try {
      const res = await fetch('/api/admin/popups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Popup published successfully");
        setForm({ title: '', link: '' });
        setImageUrl('');
        fetchPopups();
      } else {
        toast.error(data.message || 'Failed to create popup');
      }
    } catch (err) {
      toast.error('Error creating popup');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Popup Advertisements</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Post New Popup</h2>
        <form onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-2">
          <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 border border-dashed border-slate-300 p-4 rounded-xl bg-slate-50">
            <div className="w-48 h-32 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {imageUrl ? <img src={imageUrl} className="w-full h-full object-contain" /> : <FiImage className="text-3xl text-slate-300" />}
            </div>
            <div>
              <input type="file" id="popupImage" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="popupImage" className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 font-semibold px-4 py-2 rounded-lg transition-colors text-sm shadow-sm">
                <FiUpload /> Upload JPEG (Max 2MB)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Popup Title</label>
            <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" placeholder="e.g. Special Offer" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Link (Optional)</label>
            <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" placeholder="https://" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
          </div>
          <div className="sm:col-span-2 flex justify-end mt-2">
            <button type="submit" disabled={creating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg transition disabled:opacity-70 shadow-sm">
              {creating ? 'Publishing...' : 'Publish Popup'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">All Popups</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading popups...</div>
        ) : popups.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No popups found. Create one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {popups.map(popup => {
                  const isExpired = new Date(popup.endDate) < new Date();
                  return (
                    <tr key={popup._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden">
                          <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{popup.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        {popup.isActive ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => togglePopupStatus(popup._id, { isActive: !popup.isActive })}
                            className={`p-2 rounded-lg font-semibold text-white transition ${popup.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                            title={popup.isActive ? "Deactivate Popup" : "Activate Popup"}
                          >
                            {popup.isActive ? <FiXCircle /> : <FiCheckCircle />}
                          </button>
                          <button 
                            onClick={() => deletePopup(popup._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete Popup"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
