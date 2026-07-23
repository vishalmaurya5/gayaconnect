'use client';

import { useState, useEffect, useContext } from 'react';
import { 
  CheckCircle, Search, Filter, Download, HardHat, Phone, MapPin, Eye, Star, CreditCard, ShieldCheck
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { exportToCSV } from '@/lib/utils/export';

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function VerifiedLabourPage() {
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchVerifiedLabourers();
  }, []);

  const fetchVerifiedLabourers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/labour');
      const data = await res.json();
      if (data.success) {
        const approvedOnly = (data.labourers || []).filter(l => l.isApproved || l.status === 'APPROVED');
        setLabourers(approvedOnly);
      }
    } catch (error) {
      toast.error('Failed to load verified labour records');
    } finally {
      setLoading(false);
    }
  };

  const filteredLabourers = labourers.filter(l => {
    const s = searchInput.toLowerCase();
    const matchesSearch = !s || l.name?.toLowerCase().includes(s) || l.phone?.includes(s) || l.lwfId?.toLowerCase().includes(s) || l.district?.toLowerCase().includes(s);
    const matchesCat = !selectedCategory || (l.category === selectedCategory || l.profession === selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleExportCSV = () => {
    const exportData = filteredLabourers.map(l => ({
      LWF_ID: l.lwfId || 'N/A',
      Name: l.name,
      Phone: l.phone,
      Role: l.profession || l.category || l.role || 'Worker',
      District: l.district || l.location || 'Gaya',
      Rating: l.rating || 5.0,
      BloodGroup: l.bloodGroup || 'N/A',
      Status: 'VERIFIED'
    }));
    exportToCSV(exportData, 'Verified_Labourers_GayaSeva');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Verified Labour</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">View, manage, and issue 65x95mm QR ID cards for verified workers.</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Verified CSV
          </motion.button>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, LWF ID, phone..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-72 pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="">All Categories</option>
              <option value="Mason (Raj Mistri)">Mason</option>
              <option value="Helper">Helper</option>
              <option value="Painter">Painter</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
            </select>
          </div>

          <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Total Verified: <span className="text-emerald-600 dark:text-emerald-400">{filteredLabourers.length} Workers</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Worker Identity</th>
                  <th className="px-6 py-4">Profession & Area</th>
                  <th className="px-6 py-4">Active Skills</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]"
              >
                {filteredLabourers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 mb-4 text-emerald-500">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Verified Workers Found</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Workers verified and approved from the main directory will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLabourers.map((labour) => (
                    <motion.tr key={labour._id} variants={rowVariants} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
                            {labour.photo ? (
                              <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
                            ) : (
                              <HardHat className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                              {labour.name}
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {labour.lwfId || 'GS-LWF-VERIFIED'} • {labour.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                          {labour.profession || labour.category || labour.role || 'Worker'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {labour.location || labour.district || 'Gaya, Bihar'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(labour.skills?.length ? labour.skills : [labour.category || labour.profession || 'General Skill']).slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md border border-indigo-200 dark:border-indigo-800">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{labour.rating ? labour.rating.toFixed(1) : '5.0'}</span>
                          <span className="text-xs text-slate-400">({labour.reviewCount || 0})</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/labour/${labour._id}`}
                            target="_blank"
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                            title="View Public Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/admin/labour/${labour._id}/id-card`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition-all"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> 65x95mm ID Card
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
