'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Settings, Save, Globe, CheckCircle2, ShieldCheck, Code, Sparkles, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SEOPage() {
  const [loading, setLoading] = useState(false);
  const [seoConfig, setSeoConfig] = useState({
    metaTitle: 'GayaSeva - Zarurat Aapki, Seva Hamari | Local Services & Directory',
    metaDescription: 'Discover and book verified local service providers, electricians, plumbers, shops, vehicles, and daily workforce across Gaya, Bihar.',
    keywords: 'Gaya services, local vendor gaya, electrician in gaya, plumber gaya, GayaSeva, Bihar workforce, vehicle rental gaya',
    googleAnalyticsId: 'G-GS84920011',
    facebookPixelId: '10928492019482',
    canonicalUrl: 'https://www.gayaseva.com',
    ogImage: '/gaya_seva_app_icon.png'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_seo_config');
      if (saved) {
        try { setSeoConfig(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_seo_config', JSON.stringify(seoConfig));
      }
      toast.success('SEO Meta Configuration saved successfully!');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Search Engine Optimization (SEO)</h1>
          <p className="text-slate-500 text-xs mt-1">Configure site meta titles, descriptions, tracking pixels, and sitemaps.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save SEO Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-indigo-500" /> Meta Tags & Open Graph Data
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Global Meta Title Tag *
                </label>
                <input 
                  type="text" 
                  value={seoConfig.metaTitle}
                  onChange={e => setSeoConfig({...seoConfig, metaTitle: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Global Meta Description *
                </label>
                <textarea 
                  rows="3"
                  value={seoConfig.metaDescription}
                  onChange={e => setSeoConfig({...seoConfig, metaDescription: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Focus Keywords (Comma Separated) *
                </label>
                <input 
                  type="text" 
                  value={seoConfig.keywords}
                  onChange={e => setSeoConfig({...seoConfig, keywords: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Google Analytics Tracking ID
                  </label>
                  <input 
                    type="text" 
                    value={seoConfig.googleAnalyticsId}
                    onChange={e => setSeoConfig({...seoConfig, googleAnalyticsId: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Facebook Pixel ID
                  </label>
                  <input 
                    type="text" 
                    value={seoConfig.facebookPixelId}
                    onChange={e => setSeoConfig({...seoConfig, facebookPixelId: e.target.value})}
                    placeholder="Pixel ID"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Google Search Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Search className="w-4 h-4 text-emerald-500" /> Google Search Preview
            </h2>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans space-y-1">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">www.gayaseva.com</span>
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline leading-snug line-clamp-2 cursor-pointer">{seoConfig.metaTitle}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal line-clamp-3">{seoConfig.metaDescription}</p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-900 dark:text-indigo-200">Sitemap XML Status</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase">Active</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">https://www.gayaseva.com/sitemap.xml</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
