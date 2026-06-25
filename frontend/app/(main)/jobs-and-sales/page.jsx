'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBriefcase, FiTag, FiMapPin, FiMessageCircle, FiPhone, FiInfo } from 'react-icons/fi';
import ProtectedRoute from '@/components/common/ProtectedRoute';

const ADMIN_PHONE = '+919117588242'; // From the contact page

export default function JobsAndSalesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/jobs' : `/api/jobs?type=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (type, title) => {
    const text = encodeURIComponent(`Hi, I am interested in the posting: "${title}" on Gaya Connect.`);
    if (type === 'whatsapp') {
      window.open(`https://wa.me/${ADMIN_PHONE.replace(/[^0-9]/g, "")}?text=${text}`, '_blank');
    } else {
      window.location.href = `tel:${ADMIN_PHONE}`;
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Gaya Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Discover the latest job opportunities and exclusive items for sale directly from our verified local vendors.
          </p>
          
          {/* Filters */}
          <div className="inline-flex bg-white rounded-xl shadow-sm p-1.5 border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              All Listings
            </button>
            <button
              onClick={() => setFilter('job')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'job' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Jobs
            </button>
            <button
              onClick={() => setFilter('sale')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'sale' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Sales
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col h-full group">
                <div className={`h-2 w-full ${job.type === 'job' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Badge & Date */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      job.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {job.type === 'job' ? <FiBriefcase /> : <FiTag />}
                      {job.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                    {job.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {job.salaryOrPrice && (
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                        <div className={`p-1.5 rounded-md ${job.type === 'job' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {job.type === 'job' ? <FiBriefcase /> : <FiTag />}
                        </div>
                        {job.type === 'job' ? 'Salary: ' : 'Price: '} 
                        <span className="text-slate-900">{job.salaryOrPrice}</span>
                      </div>
                    )}
                    
                    {job.location && (
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                        <div className="p-1.5 rounded-md bg-slate-200 text-slate-500">
                          <FiMapPin />
                        </div>
                        {job.location}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                      <FiInfo className="text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-amber-800">
                        To ensure security, please contact the Gaya Connect admin to proceed with this listing.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleContact('whatsapp', job.title)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                      >
                        <FiMessageCircle /> WhatsApp
                      </button>
                      <button 
                        onClick={() => handleContact('call', job.title)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                      >
                        <FiPhone /> Call Admin
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBriefcase className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No listings found</h3>
            <p className="text-slate-500 mb-6">
              There are currently no {filter !== 'all' ? filter + 's' : 'jobs or sales'} available. Please check back later!
            </p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              View All Listings
            </button>
          </div>
        )}
      </div>
      </main>
    </ProtectedRoute>
  );
}
