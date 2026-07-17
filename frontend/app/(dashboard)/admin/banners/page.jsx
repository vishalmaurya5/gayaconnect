'use client';

import { useState, useEffect, useContext } from 'react';
import { 
  CheckCircle, XCircle, Trash2, Edit2, X, Image as ImageIcon, 
  Search, Filter, Plus, Clock, ExternalLink, UploadCloud, Monitor, LayoutDashboard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, ACTIVE, PENDING, EXPIRED
  const [searchInput, setSearchInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
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

  const deleteBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to permanently delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Banner deleted');
        setBanners(banners.filter(b => b._id !== bannerId));
      } else {
        toast.error(data.message || 'Failed to delete banner');
      }
    } catch (error) {
      toast.error('Error deleting banner');
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
        setIsCreateModalOpen(false);
        fetchBannersAndVendors();
        setActiveTab('ACTIVE');
      } else {
        toast.error(data.message || 'Failed to create banner');
      }
    } catch (err) {
      toast.error('Error creating banner');
    } finally {
      setCreating(false);
    }
  };

  const isExpired = (endDate) => endDate ? new Date(endDate) < new Date() : false;

  const filteredBanners = banners.filter(banner => {
    const expired = isExpired(banner.endDate);
    const matchesSearch = banner.title.toLowerCase().includes(searchInput.toLowerCase()) || 
                          (banner.vendorId?.name || '').toLowerCase().includes(searchInput.toLowerCase());
                          
    if (!matchesSearch) return false;

    if (activeTab === 'EXPIRED') return expired;
    if (activeTab === 'PENDING') return !expired && !banner.adminApproved;
    if (activeTab === 'ACTIVE') return !expired && banner.adminApproved && banner.isActive;
    return true; // ALL
  });

  const pendingVendors = vendors.filter(v => v.bannerStatus === 'pending');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Banner Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Control and organize all website promotional banners.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-600/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Post New Banner
          </motion.button>
        </div>
      </div>

      {pendingVendors.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Banner Access Requests</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">These vendors requested permission to upload their own banners.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-white/50 dark:bg-[#0B0F19]/50 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">RegCode</th>
                  <th className="px-4 py-3">Vendor Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 dark:divide-amber-500/10">
                {pendingVendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-amber-100/50 dark:hover:bg-amber-500/5 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{vendor.regCode || 'N/A'}</td>
                    <td className="px-4 py-3 font-bold">{vendor.name}</td>
                    <td className="px-4 py-3">{vendor.category}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => toggleVendorBannerStatus(vendor._id, 'approved')} 
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 transition text-white rounded-lg font-bold shadow-sm flex items-center gap-2 text-xs"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enterprise Data Table Wrapper */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-max overflow-x-auto">
            {['ALL', 'ACTIVE', 'PENDING', 'EXPIRED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Banners' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search banners..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* The Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>)}
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Banner Creative</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placement</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]"
              >
                {filteredBanners.map(banner => {
                  const expired = isExpired(banner.endDate);
                  return (
                    <motion.tr variants={rowVariants} key={banner._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center">
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="text-slate-300 w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{banner.title}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-col gap-1">
                              <span>By: {banner.vendorId?.name || 'Admin'}</span>
                              {banner.linkUrl && (
                                <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                                  Link <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <LayoutDashboard className="w-3 h-3" /> 
                          {banner.position === 'home_top' ? 'Home Top' : 
                           banner.position === 'home_middle' ? 'Home Middle' : 
                           banner.position === 'community' ? 'Community Area' : 
                           `Category: ${banner.targetCategory}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {expired ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                            <Clock className="w-4 h-4" /> Expired
                          </span>
                        ) : !banner.adminApproved ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                            <Clock className="w-4 h-4" /> Pending
                          </span>
                        ) : banner.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                            <CheckCircle className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-2.5 py-1.5 rounded-lg">
                            <XCircle className="w-4 h-4" /> Paused
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!expired && (
                            <>
                              {!banner.adminApproved ? (
                                <button
                                  onClick={() => toggleBannerStatus(banner._id, { adminApproved: true, isActive: true })}
                                  className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition"
                                  title="Approve & Activate"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleBannerStatus(banner._id, { isActive: !banner.isActive })}
                                  className={`p-2 rounded-lg transition ${banner.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'}`}
                                  title={banner.isActive ? 'Pause Banner' : 'Activate Banner'}
                                >
                                  {banner.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                              )}
                            </>
                          )}
                          <button onClick={() => deleteBanner(banner._id)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
                {filteredBanners.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Banners Found</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">There are no banners matching your current filters or search query.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] border-t sm:border border-slate-200 dark:border-slate-800"
            >
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center"><Plus className="w-5 h-5"/></div> 
                  Post New Banner
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="createBannerForm" onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-full sm:w-64 h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-shrink-0 items-center justify-center overflow-hidden shadow-sm">
                      {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-4xl text-slate-300 dark:text-slate-600" />}
                    </div>
                    <div className="w-full">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Banner Creative</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upload a high-quality JPEG (Max 200KB). Recommended size: 1200x400px.</p>
                      
                      <input type="file" id="bannerImg" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
                      <label htmlFor="bannerImg" className="cursor-pointer inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400 font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-sm">
                        <UploadCloud className="w-4 h-4" /> Select File
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Campaign Title</label>
                    <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target URL (Optional)</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition-all" placeholder="https://" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Display Position</label>
                    <select className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition-all cursor-pointer" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                      <option value="home_top">Home (Top)</option>
                      <option value="home_middle">Home (Middle)</option>
                      <option value="community">Community Area</option>
                      <option value="category_top">Inside a Category</option>
                    </select>
                  </div>
                  
                  {form.position === 'category_top' ? (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Select Target Category</label>
                      <select required className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition-all cursor-pointer" value={form.targetCategory} onChange={e => setForm({...form, targetCategory: e.target.value})}>
                        <option value="">-- Choose Category --</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">End Date (Auto-Expires)</label>
                      <input type="date" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition-all" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
                    </div>
                  )}

                  {form.position === 'category_top' && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">End Date (Auto-Expires)</label>
                      <input type="date" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:text-white transition-all" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
                    </div>
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3 mb-safe pb-8 sm:pb-6">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" form="createBannerForm" disabled={creating} className="px-6 py-2.5 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-600/20 disabled:opacity-50">
                  {creating ? 'Publishing...' : 'Publish Banner'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
