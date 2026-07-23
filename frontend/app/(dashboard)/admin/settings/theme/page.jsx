'use client';

import { useState, useEffect } from 'react';
import { 
  Palette, Sun, Moon, Check, Save, Image as ImageIcon, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThemeSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const [primaryColor, setPrimaryColor] = useState('indigo');
  const [logoUrl, setLogoUrl] = useState('/gaya_seva_app_icon.png');

  const colorOptions = [
    { id: 'indigo', name: 'Indigo Blue', class: 'bg-indigo-600' },
    { id: 'emerald', name: 'Emerald Green', class: 'bg-emerald-600' },
    { id: 'amber', name: 'Amber Gold', class: 'bg-amber-500' },
    { id: 'rose', name: 'Rose Red', class: 'bg-rose-600' },
    { id: 'purple', name: 'Royal Purple', class: 'bg-purple-600' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('gc_theme_config');
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (parsed.themeMode) setThemeMode(parsed.themeMode);
          if (parsed.primaryColor) setPrimaryColor(parsed.primaryColor);
        } catch (e) {}
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_theme_config', JSON.stringify({ themeMode, primaryColor, logoUrl }));
        if (themeMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      toast.success('Theme & Branding preferences saved!');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Theme & Branding Customization</h1>
          <p className="text-slate-500 text-xs mt-1">Customize UI colors, dark/light themes, and enterprise brand logos.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Apply Theme Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Theme Mode & Color Accent */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Palette className="w-4 h-4 text-indigo-500" /> Interface Color Mode
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setThemeMode('light')}
              className={`p-4 rounded-2xl border-2 transition text-left flex flex-col justify-between h-28 ${
                themeMode === 'light' 
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
              }`}
            >
              <div className="flex justify-between items-center">
                <Sun className="w-6 h-6 text-amber-500" />
                {themeMode === 'light' && <Check className="w-4 h-4 text-indigo-600 font-black" />}
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Light Mode</span>
                <span className="text-[10px] text-slate-400">Clean high-contrast theme</span>
              </div>
            </button>

            <button 
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`p-4 rounded-2xl border-2 transition text-left flex flex-col justify-between h-28 ${
                themeMode === 'dark' 
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
              }`}
            >
              <div className="flex justify-between items-center">
                <Moon className="w-6 h-6 text-indigo-400" />
                {themeMode === 'dark' && <Check className="w-4 h-4 text-indigo-400 font-black" />}
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Dark Mode</span>
                <span className="text-[10px] text-slate-400">Sleek enterprise dark UI</span>
              </div>
            </button>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-black text-slate-800 dark:text-slate-200 text-xs block uppercase tracking-wider">Primary Accent Color:</span>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setPrimaryColor(c.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                    primaryColor === c.id 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-slate-900 dark:text-white shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${c.class}`}></span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Logo & Branding Preview */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ImageIcon className="w-4 h-4 text-amber-500" /> Brand Logo & Asset
          </h2>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-white rounded-full p-1 border-2 border-indigo-500 shadow-md flex items-center justify-center flex-shrink-0">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">GayaSeva Enterprise Logo</h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{logoUrl}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                App Logo Image URL *
              </label>
              <input 
                type="text" 
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
