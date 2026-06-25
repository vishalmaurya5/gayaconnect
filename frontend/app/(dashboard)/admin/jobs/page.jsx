'use client';

import { useState, useEffect } from 'react';
import { FiBriefcase, FiTag, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', type: 'job', salaryOrPrice: '', location: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Just re-use the public/vendor api
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Posted successfully');
        setForm({ title: '', description: '', type: 'job', salaryOrPrice: '', location: '' });
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

  const deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this posting?')) return;
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
      toast.error('Error deleting posting');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Manage Jobs & Sales</h1>
      
      {/* Post Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FiPlus /> Post New Job or Sale (As Admin)
        </h2>
        <form onSubmit={handlePost} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-4 flex bg-slate-100 p-1 rounded-lg w-fit">
            <button type="button" onClick={() => setForm({...form, type: 'job'})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${form.type === 'job' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Job</button>
            <button type="button" onClick={() => setForm({...form, type: 'sale'})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${form.type === 'sale' ? 'bg-white shadow-sm text-green-700' : 'text-slate-500 hover:text-slate-700'}`}>Sale</button>
          </div>
          
          <div className="sm:col-span-1 md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Title" />
          </div>

          <div className="sm:col-span-1 md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">{form.type === 'job' ? 'Salary' : 'Price'}</label>
            <input type="text" value={form.salaryOrPrice} onChange={e => setForm({...form, salaryOrPrice: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Optional" />
          </div>

          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Location" />
          </div>

          <div className="sm:col-span-2 md:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea required rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Description"></textarea>
          </div>
          
          <button type="submit" disabled={posting} className="sm:col-span-2 md:col-span-4 mt-2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {posting ? 'Posting...' : 'Post ' + form.type}
          </button>
        </form>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Title & Desc</th>
                  <th className="px-6 py-4">Salary/Price</th>
                  <th className="px-6 py-4">Posted By</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase ${job.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {job.type === 'job' ? <FiBriefcase /> : <FiTag />} {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px] mt-1">{job.description}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {job.salaryOrPrice || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {job.postedByAdmin ? (
                        <span className="text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">Admin</span>
                      ) : (
                        <span className="font-medium text-slate-700">{job.vendorId?.name || 'Vendor'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteJob(job._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No jobs or sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
