'use client';

import { useState, useContext, useEffect } from 'react';
import { 
  Search, Filter, Download, Plus, Briefcase, Eye, Trash2, Edit2
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';

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

export default function AllJobsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchJobs(searchInput, selectedCity);
  }, [searchInput, selectedCity]);

  const fetchJobs = async (s = '', city = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?search=${s}&location=${city}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to load jobs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">All Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all job postings across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export List
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
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
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
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

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type / Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]"
            >
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col gap-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>)}
                    </div>
                  </td>
                </tr>
              ) : jobs.length > 0 ? (
                jobs.map(job => (
                  <motion.tr variants={rowVariants} key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{job.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">{job.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {job.vendorId ? job.vendorId.name : 'Admin Posting'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600 dark:text-slate-300 text-sm">{job.type.toUpperCase()}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {job.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-400 font-bold text-xs bg-slate-100 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20 px-2.5 py-1.5 rounded-lg">
                          Inactive
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Jobs Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Job postings will appear here.</p>
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#05080f]/50 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing 0 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
