'use client';

import { useState, useEffect } from 'react';
import { FiMessageSquare, FiCheck, FiX, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/feedbacks');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      } else {
        toast.error('Failed to load feedbacks');
      }
    } catch (error) {
      toast.error('Error fetching feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Feedback marked as ${status}`);
        setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status } : f));
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Error updating feedback');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Feedback deleted');
        setFeedbacks(feedbacks.filter(f => f._id !== id));
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Error deleting feedback');
    }
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesFilter = filter === 'all' || f.status === filter;
    const matchesSearch = f.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FiMessageSquare className="text-indigo-600" />
            Feedback Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage user feedback for the website and vendors.</p>
        </div>
        <button 
          onClick={fetchFeedbacks}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading feedbacks...</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FiMessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Feedbacks Found</h3>
              <p className="text-slate-500">There are no feedbacks matching your current filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Context</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFeedbacks.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{f.name}</div>
                      <div className="text-xs text-slate-500">{new Date(f.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < f.rating ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 line-clamp-2 max-w-md" title={f.comment}>{f.comment}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {f.type === 'website' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          Website
                        </span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center w-fit gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                            Vendor
                          </span>
                          {f.vendorId && (
                            <span className="text-[11px] text-slate-500 mt-1 max-w-[120px] truncate" title={f.vendorId.name}>
                              {f.vendorId.name}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        f.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        f.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {f.status === 'approved' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                        {f.status === 'rejected' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>}
                        {f.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {f.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(f._id, 'approved')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        {f.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateStatus(f._id, 'rejected')}
                            className="p-1.5 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 hover:text-rose-700 transition-colors"
                            title="Reject"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(f._id)}
                          className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 hover:text-red-600 transition-colors ml-2"
                          title="Delete permanently"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
