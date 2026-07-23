'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutTemplate, Save, Eye, RefreshCw, CheckCircle2, Sparkles, Layers, Sliders, Image, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomepageContentPage() {
  const [loading, setLoading] = useState(false);
  const [heroForm, setHeroForm] = useState({
    title: 'GayaSeva - Zarurat Aapki, Seva Hamari',
    subtitle: 'Find trusted local service providers, electricians, plumbers, shops, vehicles, and daily workforce in Gaya.',
    cdaButtonText: 'Explore Local Services',
    bannerOfferText: 'Unlock all vendor contacts & offers for just ₹11/month'
  });

  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero Search & Top Banner', visible: true, type: 'Core Header' },
    { id: 'categories', name: 'Featured Service Categories', visible: true, type: 'Navigation Grid' },
    { id: 'offers', name: 'Special Subscription Offer Banner (₹11/mo)', visible: true, type: 'Promotion' },
    { id: 'vendors', name: 'Verified Vendors & Shops Showcase', visible: true, type: 'Directory' },
    { id: 'workforce', name: 'Daily Workforce & Labour Spotlight', visible: true, type: 'Listings' },
    { id: 'vehicles', name: 'Vehicles & Transport Directory', visible: true, type: 'Listings' },
    { id: 'reviews', name: 'Customer Ratings & Reviews Carousel', visible: true, type: 'Social Proof' },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_homepage_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.heroForm) setHeroForm(parsed.heroForm);
          if (parsed.sections) setSections(parsed.sections);
        } catch (e) {}
      }
    }
  }, []);

  const toggleSection = (id) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    toast.success('Section visibility updated');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_homepage_config', JSON.stringify({ heroForm, sections }));
      }
      toast.success('Homepage configuration saved successfully!');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Homepage Layout Setup</h1>
          <p className="text-slate-500 text-xs mt-1">Configure landing page banners, hero text, and section visibility.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Homepage Setup'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Hero Content Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" /> Main Hero Banner & Text Settings
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Main Headline Title *
                </label>
                <input 
                  type="text" 
                  value={heroForm.title}
                  onChange={e => setHeroForm({...heroForm, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Sub-headline Description *
                </label>
                <textarea 
                  rows="3"
                  value={heroForm.subtitle}
                  onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Primary CTA Button Text
                  </label>
                  <input 
                    type="text" 
                    value={heroForm.cdaButtonText}
                    onChange={e => setHeroForm({...heroForm, cdaButtonText: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Top Notification Banner Text
                  </label>
                  <input 
                    type="text" 
                    value={heroForm.bannerOfferText}
                    onChange={e => setHeroForm({...heroForm, bannerOfferText: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Homepage Section Visibility Toggles */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-indigo-500" /> Section Visibility Control
            </h2>

            <div className="space-y-2.5">
              {sections.map(sec => (
                <div key={sec.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block">{sec.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{sec.type}</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleSection(sec.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition ${
                      sec.visible 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {sec.visible ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
