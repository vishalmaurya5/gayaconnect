'use client';

import { useState, useEffect, useContext } from 'react';
import { 
  CheckCircle, XCircle, Trash2, Edit2, X, CreditCard, 
  Search, Filter, Download, Plus, MapPin, HardHat, Eye, User, Phone, Briefcase, Upload
} from 'lucide-react';
import { AdminContext } from '../layout';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '@/lib/utils/export';

const CATEGORIES = ['Mason (Raj Mistri)', 'Helper', 'Painter', 'Carpenter', 'Welder', 'Driver', 'House Help', 'Farm Labour', 'Plumber', 'Electrician', 'Mechanic', 'Cleaner', 'Other'];

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalContentVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95,
    transition: { duration: 0.2 } 
  }
};

export default function AdminLabourPage() {
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, APPROVED, PENDING
  const [selectedCity, setSelectedCity] = useState('');
  
  const initialFormState = { name: '', phone: '', category: '', customCategory: '', dailyRate: '', address: '', aadhaarNumber: '', bloodGroup: '', state: '', district: '', aadhaarImage: '', photo: '' };
  const [form, setForm] = useState(initialFormState);
  const admin = useContext(AdminContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchLabourers(searchTerm, selectedCity);
  }, [searchTerm, selectedCity]);

  const fetchLabourers = async (s = '', city = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/labour?search=${s}&city=${city}`);
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

  const handleAadhaarImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      toast.error('Only JPG and JPEG images are allowed for Aadhaar Card');
      return;
    }
    if (file.size > 100 * 1024) {
      toast.error('Aadhaar Card image must be under 100 KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, aadhaarImage: reader.result });
    reader.readAsDataURL(file);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      toast.error('Only JPG and JPEG images are allowed');
      return;
    }
    if (file.size > 150 * 1024) {
      toast.error('Image must be under 150 KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(file);
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
        toast.success(`Profile ${!currentStatus ? 'approved' : 'unapproved'} successfully`);
        setLabourers(labourers.map(l => l._id === id ? { ...l, isApproved: !currentStatus } : l));
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const deleteLabour = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this labour profile? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/labour/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile deleted successfully');
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
    const finalCategory = form.category === 'Other' ? form.customCategory : form.category;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'labourer', ...form, skill: finalCategory })
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Labourer created successfully');
        setForm(initialFormState);
        setIsCreateModalOpen(false);
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

  const openEditModal = (labour) => {
    const role = labour.profession || labour.role || labour.category || '';
    const isOther = role && !CATEGORIES.includes(role);
    setForm({
      name: labour.name || '',
      phone: labour.phone || '',
      category: isOther ? 'Other' : (role || ''),
      customCategory: isOther ? role : '',
      dailyRate: labour.dailyRate || '',
      address: labour.area || labour.location || '',
      aadhaarNumber: labour.aadhaarNumber || '',
      bloodGroup: labour.bloodGroup || '',
      state: labour.state || '',
      district: labour.district || '',
      aadhaarImage: labour.aadhaarImage || '',
      photo: labour.photo || ''
    });
    setEditingId(labour._id);
    setIsEditModalOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setCreating(true);
    const finalCategory = form.category === 'Other' ? form.customCategory : form.category;
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        role: finalCategory,
        category: finalCategory,
        area: form.address,
        dailyRate: form.dailyRate,
        aadhaarNumber: form.aadhaarNumber,
        bloodGroup: form.bloodGroup,
        state: form.state,
        district: form.district,
        aadhaarImage: form.aadhaarImage,
        photo: form.photo
      };
      
      const res = await fetch(`/api/admin/labour/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Worker profile updated successfully');
        setForm(initialFormState);
        setIsEditModalOpen(false);
        fetchLabourers();
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setCreating(false);
    }
  };

  const filteredLabourers = labourers.filter(l => {
    if (activeTab === 'APPROVED') return l.isApproved;
    if (activeTab === 'PENDING') return !l.isApproved;
    return true;
  });

  const handleExportCSV = () => {
    const dataToExport = filteredLabourers.map(l => ({
      Labour_ID: l.lwfId || 'N/A',
      Name: l.name,
      Profession: l.profession || 'N/A',
      Phone: l.phone,
      Aadhaar: l.aadhaarNumber || 'N/A',
      Status: l.isApproved ? 'Approved' : 'Pending',
      Location: l.location || 'N/A',
      Experience: l.experience || 'N/A'
    }));
    exportToCSV(dataToExport, `labour_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Labour Workforce</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage blue-collar workers, verifications, and ID cards.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleExportCSV}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </motion.button>
          
          {admin?.role === 'SUPER_ADMIN' && (
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Worker
            </motion.button>
          )}
        </div>
      </div>

      {/* Enterprise Data Table Wrapper */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-max">
            {['ALL', 'APPROVED', 'PENDING'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Workers' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            {admin?.role === 'SUPER_ADMIN' && (
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-700 dark:text-slate-300"
              >
                <option value="">All Cities</option>
                <option value="Gaya">Gaya</option>
                <option value="Patna">Patna</option>
                <option value="Nawada">Nawada</option>
                <option value="Delhi">Delhi</option>
              </select>
            )}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Aadhaar, Name, ID..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>)}
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Worker Identity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profession & Area</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]"
              >
                {filteredLabourers.map(labour => (
                  <motion.tr variants={rowVariants} key={labour._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 border border-orange-100 dark:border-orange-500/20">
                          <HardHat className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {labour.name}
                            {labour.lwfId && (
                              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                {labour.lwfId}
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> {labour.phone}
                          </div>
                          {labour.aadhaarNumber && (
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
                                Aadhaar <span className="font-mono">{labour.aadhaarNumber}</span>
                              </span>
                              {labour.aadhaarImage && (
                                <button onClick={() => setSelectedImage(labour.aadhaarImage)} className="text-indigo-500 hover:text-indigo-700 transition" title="View Document">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" /> {labour.profession || labour.role || labour.category || 'Unspecified Worker'}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {labour.location || labour.address || labour.district || 'Unknown Location'}
                        </span>
                        {labour.experience && (
                          <span className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            Experience: <strong className="text-slate-700 dark:text-slate-300">{labour.experience}</strong>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {labour.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                          <CheckCircle className="w-4 h-4" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                          <XCircle className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        {admin?.role === 'SUPER_ADMIN' && (
                          <button 
                            onClick={() => toggleApproval(labour._id, labour.isApproved)} 
                            className={`p-2 rounded-lg font-semibold transition ${labour.isApproved ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20'}`}
                            title={labour.isApproved ? 'Revoke Approval' : 'Approve Profile'}
                          >
                            {labour.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        )}
                        
                        {(labour.status === 'APPROVED' || labour.isApproved) && (
                          <Link href={`/admin/labour/${labour._id}/id-card`} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition" title="Generate ID Card">
                            <CreditCard className="w-4 h-4" />
                          </Link>
                        )}

                        {admin?.role === 'SUPER_ADMIN' && (
                          <button onClick={() => openEditModal(labour)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition" title="Edit Profile">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {admin?.role === 'SUPER_ADMIN' && (
                          <button onClick={() => deleteLabour(labour._id)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition" title="Delete Permanently">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredLabourers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
                        <HardHat className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Workers Found</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">We couldn't find any labour profiles matching your current filters or search query.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Mockup */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#05080f]/50 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing {filteredLabourers.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* Image Modal for Aadhaar */}
        {selectedImage && (
          <motion.div 
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              variants={modalContentVariants}
              className="relative max-w-4xl w-full bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <img src={selectedImage} alt="Verification Document" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full p-2.5 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Create Labourer Modal */}
        {isCreateModalOpen && (
          <motion.div 
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
          >
            <motion.div 
              variants={modalContentVariants}
              className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] border-t sm:border border-slate-200 dark:border-slate-800"
            >
              {/* Mobile Drag Indicator */}
              <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              </div>

              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Plus className="w-5 h-5"/></div> 
                  Register New Worker
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="createLabourForm" onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-4">
                      {form.photo ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                          <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition">
                          <Upload className="w-4 h-4" /> Choose Image
                          <input type="file" accept="image/jpeg, image/jpg" onChange={handlePhoto} className="hidden" />
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Max size: 150 KB. Only JPG/JPEG allowed.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                    <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category (Profession) *</label>
                    <select required className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all appearance-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {form.category === 'Other' && (
                      <input required type="text" placeholder="Specify profession" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all mt-1" value={form.customCategory} onChange={e => setForm({...form, customCategory: e.target.value})} />
                    )}
                  </div>
                  <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Upload Aadhaar Card *</label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Must be clear, under 100 KB, and in JPG/JPEG format for verification.</p>
                    <div className="flex items-center gap-4">
                      {form.aadhaarImage ? (
                        <div className="h-12 flex items-center px-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                          <CheckCircle className="mr-2 w-4 h-4" /> Uploaded Successfully
                        </div>
                      ) : (
                        <label className="cursor-pointer flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition">
                          <Upload className="text-xl text-slate-400 dark:text-slate-500 mb-1 w-5 h-5" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Select File</span>
                          <input type="file" required accept="image/jpeg, image/jpg" onChange={handleAadhaarImage} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Aadhaar Number</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.aadhaarNumber} onChange={e => setForm({...form, aadhaarNumber: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">State</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">District</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Area / Address</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3 mb-safe pb-8 sm:pb-6">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" form="createLabourForm" disabled={creating} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                  {creating ? 'Registering...' : 'Register Worker'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Labourer Modal */}
        {isEditModalOpen && (
          <motion.div 
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
          >
            <motion.div 
              variants={modalContentVariants}
              className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] border-t sm:border border-slate-200 dark:border-slate-800"
            >
              <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              </div>
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Edit2 className="w-5 h-5"/></div> 
                  Edit Worker Profile
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="editLabourForm" onSubmit={handleEdit} className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-4">
                      {form.photo ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                          <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition">
                          <Upload className="w-4 h-4" /> Choose Image
                          <input type="file" accept="image/jpeg, image/jpg" onChange={handlePhoto} className="hidden" />
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Max size: 150 KB. Only JPG/JPEG allowed.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                    <input required type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category (Profession) *</label>
                    <select required className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all appearance-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {form.category === 'Other' && (
                      <input required type="text" placeholder="Specify profession" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all mt-1" value={form.customCategory} onChange={e => setForm({...form, customCategory: e.target.value})} />
                    )}
                  </div>
                  <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Upload Aadhaar Card *</label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Must be clear, under 100 KB, and in JPG/JPEG format for verification.</p>
                    <div className="flex items-center gap-4">
                      {form.aadhaarImage ? (
                        <div className="h-12 flex items-center px-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                          <CheckCircle className="mr-2 w-4 h-4" /> Uploaded Successfully
                        </div>
                      ) : (
                        <label className="cursor-pointer flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition">
                          <Upload className="text-xl text-slate-400 dark:text-slate-500 mb-1 w-5 h-5" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Select File</span>
                          <input type="file" required accept="image/jpeg, image/jpg" onChange={handleAadhaarImage} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Aadhaar Number</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.aadhaarNumber} onChange={e => setForm({...form, aadhaarNumber: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">State</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">District</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Area / Address</label>
                    <input type="text" className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition-all" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3 mb-safe pb-8 sm:pb-6">
                <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" form="editLabourForm" disabled={creating} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50">
                  {creating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
