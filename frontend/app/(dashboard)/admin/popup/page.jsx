'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Trash2, X, Image as ImageIcon, 
  Search, Plus, UploadCloud, MonitorPlay, ExternalLink
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

export default function AdminPopupPage() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, ACTIVE, INACTIVE
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        toast.success(updates.isActive ? 'Popup Activated' : 'Popup Deactivated');
        setPopups(popups.map(p => p._id === popupId ? data.popup : p));
      } else {
        toast.error(data.message || 'Failed to update popup');
      }
    } catch (error) {
      toast.error('Error updating popup');
    }
  };

  const deletePopup = async (popupId) => {
    if (!window.confirm("Are you sure you want to permanently delete this popup?")) return;
    
    try {
      const res = await fetch(`/api/admin/popups/${popupId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Popup deleted successfully');
        setPopups(popups.filter(p => p._id !== popupId));
      } else {
        toast.error(data.message || 'Failed to delete popup');
      }
    } catch (error) {
      toast.error('Error deleting popup');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png" && file.type !== "image/webp") {
      return toast.error("Only JPG/PNG/WEBP files are allowed.");
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
    if (!imageUrl) return toast.error("Please upload a popup creative image.");
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
        setIsCreateModalOpen(false);
        fetchPopups();
        setActiveTab('ACTIVE');
      } else {
        toast.error(data.message || 'Failed to create popup');
      }
    } catch (err) {
      toast.error('Error creating popup');
    } finally {
      setCreating(false);
    }
  };

  const filteredPopups = popups.filter(popup => {
    const matchesSearch = popup.title.toLowerCase().includes(searchInput.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'ACTIVE') return popup.isActive;
    if (activeTab === 'INACTIVE') return !popup.isActive;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Popup Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Control entry popups and screen overlays for users.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-600/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Post New Popup
          </motion.button>
        </div>
      </div>

      {/* Enterprise Data Table Wrapper */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-max overflow-x-auto">
            {['ALL', 'ACTIVE', 'INACTIVE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Popups' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search popups..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* The Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>)}
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Popup Creative</th>
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
                {filteredPopups.map(popup => (
                  <motion.tr variants={rowVariants} key={popup._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center">
                          {popup.imageUrl ? (
                            <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-slate-300 w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[300px]">{popup.title}</div>
                          {popup.link && (
                            <a href={popup.link} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mt-1 text-xs">
                              Target Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {popup.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                          <CheckCircle className="w-4 h-4" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <XCircle className="w-4 h-4" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePopupStatus(popup._id, { isActive: !popup.isActive })}
                          className={`p-2 rounded-lg transition ${popup.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'}`}
                          title={popup.isActive ? 'Deactivate Popup' : 'Activate Popup'}
                        >
                          {popup.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button onClick={() => deletePopup(popup._id)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredPopups.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
                        <MonitorPlay className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Popups Found</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">You haven't created any popups matching this criteria.</p>
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
              className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] border-t sm:border border-slate-200 dark:border-slate-800"
            >
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center"><Plus className="w-5 h-5"/></div> 
                  Post New Popup
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="createPopupForm" onSubmit={handleCreate} className="grid gap-5">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-40 h-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-shrink-0 items-center justify-center overflow-hidden shadow-sm">
                      {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-4xl text-slate-300 dark:text-slate-600" />}
                    </div>
                    <div className="w-full">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Popup Creative</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upload a high-quality Image (Max 2MB). Usually square (1:1) or portrait (4:5).</p>
                      
                      <input type="file" id="popupImg" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                      <label htmlFor="popupImg" className="cursor-pointer inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-sm">
                        <UploadCloud className="w-4 h-4" /> Select File
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Campaign Title</label>
                    <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:text-white transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target URL (Optional)</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:text-white transition-all" placeholder="https://" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3 mb-safe pb-8 sm:pb-6">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" form="createPopupForm" disabled={creating} className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition shadow-lg shadow-amber-600/20 disabled:opacity-50">
                  {creating ? 'Publishing...' : 'Publish Popup'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
