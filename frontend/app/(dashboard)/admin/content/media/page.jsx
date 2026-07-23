'use client';

import { useState } from 'react';
import { 
  Image as ImageIcon, Plus, Search, Copy, Check, Trash2, Filter, Upload, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState([
    { id: 1, title: 'Official GayaSeva App Icon Logo', type: 'Logo', url: '/gaya_seva_app_icon.png', size: '128 KB' },
    { id: 2, title: '65x95mm Verified Staff Badge Header', type: 'Badge', url: '/gaya_seva_app_icon.png', size: '240 KB' },
    { id: 3, title: 'Enterprise QR Standee Watermark Seal', type: 'Certificate', url: '/gaya_seva_app_icon.png', size: '310 KB' },
    { id: 4, title: '₹11/mo Subscription Offer Banner Art', type: 'Banner', url: '/gaya_seva_app_icon.png', size: '520 KB' }
  ]);

  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ title: '', type: 'Image', url: '' });

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!newAsset.title || !newAsset.url) {
      toast.error('Asset Title and Image URL are required');
      return;
    }

    const created = {
      id: Date.now(),
      title: newAsset.title.trim(),
      type: newAsset.type,
      url: newAsset.url.trim(),
      size: '250 KB'
    };

    setMediaList([created, ...mediaList]);
    toast.success('Media asset added to library!');
    setIsModalOpen(false);
    setNewAsset({ title: '', type: 'Image', url: '' });
  };

  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Asset URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = (id) => {
    setMediaList(mediaList.filter(m => m.id !== id));
    toast.success('Media asset removed');
  };

  const filtered = mediaList.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Media Assets Library</h1>
          <p className="text-slate-500 text-xs mt-1">Manage platform images, logos, banners, and digital certificate assets.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Upload New Media
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search media assets..." 
            className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Assets: <strong className="text-indigo-600 dark:text-indigo-400">{filtered.length}</strong>
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(media => (
          <div key={media.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div className="w-full h-36 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center relative group">
              <img src={media.url} alt={media.title} className="max-h-full object-contain" />
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold rounded-full backdrop-blur-sm">
                {media.type}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">{media.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{media.size}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => copyUrl(media.id, media.url)}
                className="flex-1 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1"
              >
                {copiedId === media.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === media.id ? 'Copied!' : 'Copy URL'}
              </button>
              
              <button 
                onClick={() => deleteMedia(media.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                title="Delete Media"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Add New Media Asset</h2>
            
            <form onSubmit={handleAddMedia} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Asset Title *</label>
                <input 
                  required
                  type="text" 
                  value={newAsset.title}
                  onChange={e => setNewAsset({...newAsset, title: e.target.value})}
                  placeholder="e.g. Festival Offer Banner Header"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Asset Type</label>
                <select 
                  value={newAsset.type}
                  onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="Logo">Logo / App Icon</option>
                  <option value="Banner">Banner / Art</option>
                  <option value="Badge">Badge / Seal</option>
                  <option value="Certificate">Certificate Template</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Asset Image URL *</label>
                <input 
                  required
                  type="text" 
                  value={newAsset.url}
                  onChange={e => setNewAsset({...newAsset, url: e.target.value})}
                  placeholder="https://... or /gaya_seva_app_icon.png"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
