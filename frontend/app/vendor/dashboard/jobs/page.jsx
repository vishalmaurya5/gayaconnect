'use client';

import { useEffect, useState } from 'react';
import { FiBriefcase, FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { JOB_SALE_CATEGORIES } from '@/lib/utils/jobSaleCategories';

export default function VendorJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'job',
    category: '',
    salaryOrPrice: '',
    location: '',
    image: ''
  });

  useEffect(() => {
    fetchJobs();
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setVendorDetails(data.vendor))
      .catch(console.error);
  }, []);

  const fetchJobs = async () => {
    try {
      // Get the profile to get the vendor ID
      const profileRes = await fetch('/api/profile');
      const profileData = await profileRes.json();
      const vendorId = profileData?.vendor?._id;

      if (vendorId) {
        const res = await fetch(`/api/jobs?vendorId=${vendorId}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.category) {
      toast.error('Please select a category');
      return;
    }
    setPosting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(form.type === 'job' ? 'Job posted successfully!' : 'Sale posted successfully!');
        setForm({ title: '', description: '', type: 'job', category: '', salaryOrPrice: '', location: '', image: '' });
        fetchJobs();
      } else {
        toast.error(data.message || 'Failed to post');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setPosting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      toast.error('Only JPG/JPEG formats are allowed');
      return;
    }

    if (file.size > 100 * 1024) {
      toast.error('Image must be less than 100KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm({ ...form, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this posting?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Deleted successfully');
        setJobs(jobs.filter(j => j._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiBriefcase className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Jobs & Sales</h1>
            <p className="text-slate-500">Post job openings or items for sale to the public marketplace.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          {/* Post Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FiPlus /> Create New Posting
            </h2>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    type="button" 
                    onClick={() => setForm({...form, type: 'job'})}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition ${form.type === 'job' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Job
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setForm({...form, type: 'sale'})}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition ${form.type === 'sale' ? 'bg-white shadow-sm text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Sale
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder={form.type === 'job' ? "e.g. Need a Plumber" : "e.g. 50% Off Cement"} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="" disabled>Select a category</option>
                  {JOB_SALE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea required rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Provide details..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{form.type === 'job' ? 'Salary Offered (Optional)' : 'Price (Optional)'}</label>
                <input type="text" value={form.salaryOrPrice} onChange={e => setForm({...form, salaryOrPrice: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder={form.type === 'job' ? "e.g. ₹15,000/month" : "e.g. ₹500"} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Location (Optional)</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Gaya City" />
              </div>

              {form.type === 'sale' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Product Image (Optional)</label>
                  <p className="text-xs text-slate-500 mb-2">Max size: 100KB. Formats: .jpg, .jpeg</p>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/jpg" 
                    onChange={handleImageUpload} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                  {form.image && (
                    <div className="mt-3">
                      <img src={form.image} alt="Preview" className="h-32 object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800 font-medium">
                  <strong>Note:</strong> To protect your privacy and ensure secure transactions, all interested parties will be directed to contact the Admin.
                </p>
              </div>

              <button type="submit" disabled={posting} className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2">
                {posting ? 'Posting...' : `Post ${form.type === 'job' ? 'Job' : 'Sale'}`}
              </button>
            </form>
          </div>

          {/* Listings */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Active Postings</h2>
            {loading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between gap-4 transition hover:shadow-md">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${job.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {job.type}
                        </span>
                        {job.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {job.category}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{job.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        {job.salaryOrPrice && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                            <FiTag className="text-slate-400" /> {job.salaryOrPrice}
                          </div>
                        )}
                        {job.location && (
                          <div className="text-xs text-slate-500">📍 {job.location}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      {job.image && (
                        <div className="mb-2">
                          <img src={job.image} alt={job.title} className="h-16 w-16 object-cover rounded-lg border border-slate-200 shadow-sm" />
                        </div>
                      )}
                      <button onClick={() => handleDelete(job._id)} className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                <FiBriefcase className="mx-auto text-4xl text-slate-300" />
                <h3 className="mt-4 font-bold text-slate-900 text-lg">No Postings Yet</h3>
                <p className="mt-1 text-slate-500">Create a job or sale posting using the form.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
