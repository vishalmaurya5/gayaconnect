'use client';

import { useState, useContext } from 'react';
import { 
  Search, Plus, Image as ImageIcon
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion } from 'framer-motion';

export default function MediaLibraryPage() {
  const [searchInput, setSearchInput] = useState('');
  const admin = useContext(AdminContext);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Media Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Upload and manage images and assets used on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Upload Media
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Media Files</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Your uploaded images, documents, and videos will be securely stored here.</p>
      </div>
    </div>
  );
}
