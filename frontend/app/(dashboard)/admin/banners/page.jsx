'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiImage, FiExternalLink, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, active, expired
  const [form, setForm] = useState({ title: '', link: '', position: 'home_top', targetCategory: '', endDate: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBannersAndVendors();
  }, []);

  const fetchBannersAndVendors = async () => {
    try {
      const [bannersRes, vendorsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/banners'),
        fetch('/api/admin/vendors'),
        fetch('/api/categories')
      ]);
      const bannersData = await bannersRes.json();
      const vendorsData = await vendorsRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (bannersData.success) setBanners(bannersData.banners || []);
      if (vendorsData.success) setVendors(vendorsData.vendors || []);
      if (categoriesData.success) setCategories(categoriesData.categories || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorBannerStatus = async (vendorId, status) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerStatus: status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Vendor banner access approved!');
        setVendors(vendors.map(v => v._id === vendorId ? { ...v, bannerStatus: status } : v));
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Error updating vendor');
    }
  };

  const toggleBannerStatus = async (bannerId, updates) => {
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Banner updated successfully');
        setBanners(banners.map(b => b._id === bannerId ? data.banner : b));
      } else {
        toast.error(data.message || 'Failed to update banner');
      }
    } catch (error) {
      toast.error('Error updating banner');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      return toast.error("Only JPG/JPEG files are allowed.");
    }
    if (file.size > 200 * 1024) {
      return toast.error("Image size must be less than 200KB.");
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageUrl) return toast.error("Please upload a banner image");
    
    // Prevent submitting without a category if category_top is selected
    if (form.position === 'category_top' && !form.targetCategory) {
      return toast.error("Please select a target category");
    }

    setCreating(true);
    try {
      const payload = { ...form, imageUrl };
      if (form.position !== 'category_top') payload.targetCategory = '';
      
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Banner published successfully");
        setForm({ title: '', link: '', position: 'home_top', targetCategory: '', endDate: '' });
        setImageUrl('');
        fetchBannersAndVendors();
        setFilter('active');
      } else {
        toast.error(data.message || 'Failed to create banner');
      }
    } catch (err) {
      toast.error('Error creating banner');
    } finally {
      setCreating(false);
    }
  };

  const isExpired = (endDate) => new Date(endDate) < new Date();

  const filteredBanners = banners.filter(banner => {
    const expired = isExpired(banner.endDate);
    if (filter === 'expired') return expired;
    if (filter === 'pending') return !expired && !banner.adminApproved;
    if (filter === 'active') return !expired && banner.adminApproved;
    return true;
  });

  const pendingVendors = vendors.filter(v => v.bannerStatus === 'pending');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Banners</h1>
      </div>

      {pendingVendors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-amber-300 p-6 mb-8 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Pending Banner Access Requests</h2>
          <p className="text-sm text-slate-600 mb-4">The following vendors have paid for banner access. Approve their request to allow them to upload.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">RegCode</th>
                  <th className="px-6 py-4">Vendor Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pendingVendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-bold">{vendor.regCode || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{vendor.name}</td>
                    <td className="px-6 py-4">{vendor.category}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleVendorBannerStatus(vendor._id, 'approved')} 
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-lg font-bold shadow-sm flex items-center gap-2"
                      >
                        <FiCheckCircle /> Approve Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Post New Banner</h2>
        <form onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-4 flex flex-col sm:flex-row items-center gap-4 border border-dashed border-slate-300 p-4 rounded-xl bg-slate-50">
            <div className="w-48 h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <FiImage className="text-3xl text-slate-300" />}
            </div>
            <div>
              <input type="file" id="adminBannerImg" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="adminBannerImg" className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                <FiUpload /> Upload JPEG (Max 200KB)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Link (Optional)</label>
            <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" placeholder="https://" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Position</label>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
              <option value="home_top">Home Top</option>
              <option value="home_middle">Home Middle</option>
              <option value="category_top">Category Top</option>
              <option value="community">Community</option>
            </select>
          </div>
          
          {form.position === 'category_top' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Category</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" value={form.targetCategory} onChange={e => setForm({...form, targetCategory: e.target.value})} required>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className={form.position === 'category_top' ? "md:col-span-4" : ""}>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date (Optional)</label>
            <input type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
          </div>
          <button type="submit" disabled={creating} className="sm:col-span-2 md:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {creating ? 'Publishing...' : 'Publish Banner'}
          </button>
        </form>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setFilter('pending')}
          className={`pb-2 px-2 font-semibold ${filter === 'pending' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pending Requests
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`pb-2 px-2 font-semibold ${filter === 'active' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Approved Banners
        </button>
        <button 
          onClick={() => setFilter('expired')}
          className={`pb-2 px-2 font-semibold ${filter === 'expired' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Expired Banners
        </button>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title / Vendor</th>
                  <th className="px-6 py-4">Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBanners.map((banner) => {
                  const expired = isExpired(banner.endDate);
                  return (
                    <tr key={banner._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="h-16 w-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                          ) : (
                            <FiImage className="text-slate-300 text-2xl" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {banner.title}
                        <div className="text-xs text-slate-500 mt-1 font-normal">
                          {banner.vendorId?.name || 'Unknown Vendor'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {banner.linkUrl ? (
                          <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">
                            Link <FiExternalLink />
                          </a>
                        ) : (
                          <span className="text-slate-400">No link</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {expired ? (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <FiClock /> Expired
                          </span>
                        ) : !banner.adminApproved ? (
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <FiClock /> Pending Approval
                          </span>
                        ) : banner.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <FiCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <FiXCircle /> Paused
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {!expired && (
                          <>
                            {!banner.adminApproved ? (
                              <button
                                onClick={() => toggleBannerStatus(banner._id, { adminApproved: true, isActive: true })}
                                className="px-3 py-1.5 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition"
                              >
                                Approve & Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleBannerStatus(banner._id, { isActive: !banner.isActive })}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-white transition ${
                                  banner.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                              >
                                {banner.isActive ? 'Pause' : 'Activate'}
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filteredBanners.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No banners found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

