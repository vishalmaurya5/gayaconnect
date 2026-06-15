'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiTool, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Mason (Raj Mistri)', 'Helper', 'Painter', 'Carpenter', 'Welder', 'Driver', 'House Help', 'Farm Labour', 'Plumber', 'Electrician', 'Mechanic', 'Cleaner', 'Other'];

export default function LabourRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    category: '',
    area: '',
    dailyRate: '',
    photoStr: '',
    availability: true
  });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Must be an image file');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photoStr: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.category || !form.area) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/labour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-8">
            Your profile has been submitted. Our admin team will review and approve it shortly.
          </p>
          <button 
            onClick={() => router.push('/labour')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
            <FiTool className="text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Register as a Worker</h1>
          <p className="text-slate-600 mt-2">Join the Gaya Connect directory and get hired directly.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="space-y-6">
            
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo (Optional)</label>
              <div className="flex items-center gap-4">
                {form.photoStr ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200">
                    <img src={form.photoStr} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <FiUpload />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition">
                    <FiUpload /> Choose Image
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">Max size: 3MB. Clear photo helps get more jobs.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. Ram Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  title="10 digit mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="10 digit number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category / Profession *</label>
                <select 
                  required
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition appearance-none"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Area / Locality *</label>
                <input 
                  type="text" 
                  required
                  value={form.area}
                  onChange={(e) => setForm({...form, area: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. AP Colony"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Wage (₹/day)</label>
                <input 
                  type="number" 
                  min="0"
                  value={form.dailyRate}
                  onChange={(e) => setForm({...form, dailyRate: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition disabled:opacity-70 mt-4"
            >
              {loading ? 'Submitting...' : 'Submit Profile for Approval'}
            </button>
            <p className="text-center text-sm text-slate-500">By submitting, you agree to Gaya Connect's terms and conditions.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
