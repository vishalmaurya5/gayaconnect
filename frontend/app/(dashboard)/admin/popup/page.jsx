'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiImage, FiUpload } from 'react-icons/fi';

export default function AdminPopupPage() {
  const [isActive, setIsActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/popup')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setIsActive(d.data.isActive);
          setImageUrl(d.data.imageUrl);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      toast.error("Only JPG/JPEG files are allowed.");
      return;
    }
    
    if (file.size > 200 * 1024) {
      toast.error("Image size must be less than 200KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to save popup settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-2xl">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Popup Advertisement</h1>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Enable Popup</h3>
            <p className="text-sm text-slate-500 mt-1">Show this advertisement when users visit the homepage.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-base font-bold text-slate-900 mb-4">Advertisement Image</label>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-64 h-64 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt="Popup Ad" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center p-4 text-center">
                  <FiImage size={40} className="mb-3 text-slate-300" />
                  <span className="text-sm font-medium">No image uploaded</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center h-full pt-4">
              <input type="file" id="popupImage" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="popupImage" className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors">
                <FiUpload className="text-lg" /> Upload New Image
              </label>
              
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Strict Requirements</h4>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-center gap-2"><span>•</span> Only <strong>JPEG / JPG</strong> format allowed.</li>
                  <li className="flex items-center gap-2"><span>•</span> Maximum file size: <strong>200 KB</strong>.</li>
                  <li className="flex items-center gap-2"><span>•</span> Aspect ratio: Vertical recommended.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
