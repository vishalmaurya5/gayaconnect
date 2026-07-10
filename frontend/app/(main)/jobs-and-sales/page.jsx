'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBriefcase, FiTag, FiMapPin, FiMessageCircle, FiPhone, FiInfo, FiX, FiGrid } from 'react-icons/fi';
import { JOB_SALE_CATEGORIES } from '@/lib/utils/jobSaleCategories';

const ADMIN_PHONE = '+919117588242'; // From the contact page

export default function JobsAndSalesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationInput, setLocationInput] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, categoryFilter, locationInput]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/jobs', window.location.origin);
      if (filter !== 'all') url.searchParams.append('type', filter);
      if (categoryFilter !== 'all') url.searchParams.append('category', categoryFilter);
      if (locationInput) url.searchParams.append('location', locationInput);
      
      const res = await fetch(url.toString());
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
    const text = encodeURIComponent(`Hi, I am interested in the posting: "${title}" on Gaya Seva.`);
    if (type === 'whatsapp') {
      window.open(`https://wa.me/${ADMIN_PHONE.replace(/[^0-9]/g, "")}?text=${text}`, '_blank');
    } else {
      window.location.href = `tel:${ADMIN_PHONE}`;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Gaya Seva <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Discover the latest job opportunities and exclusive items for sale directly from our verified local vendors.
          </p>
          
          {/* Filters & Search */}
          <div className="flex flex-col xl:flex-row flex-wrap items-center justify-center gap-4 w-full">
            {/* Tabs */}
            <div className="flex w-full sm:w-auto bg-white rounded-xl shadow-sm p-1.5 border border-slate-200 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                All Listings
              </button>
              <button
                onClick={() => setFilter('job')}
                className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'job' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Jobs
              </button>
              <button
                onClick={() => setFilter('sale')}
                className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'sale' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Sales
              </button>
            </div>

            {/* Inputs Container */}
            <div className="flex flex-col sm:flex-row flex-1 xl:flex-none w-full xl:w-auto gap-4">
              <form onSubmit={(e) => { e.preventDefault(); fetchJobs(); }} className="flex flex-1 xl:w-[320px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
                <div className="px-3 flex items-center text-slate-400 bg-slate-50 border-r border-slate-100">
                  <FiMapPin />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by address or area..." 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-medium text-slate-700 placeholder:text-slate-400 min-w-0"
                />
                <button type="submit" className="px-4 sm:px-5 bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors whitespace-nowrap">
                  Search
                </button>
              </form>

              <div className="flex w-full sm:w-56 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all shrink-0">
                <div className="px-3 flex items-center text-slate-400 bg-slate-50 border-r border-slate-100">
                  <FiGrid />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-medium text-slate-700 bg-white cursor-pointer min-w-0"
                >
                  <option value="all">All Categories</option>
                  {JOB_SALE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
            {jobs.map(job => (
              <div 
                key={job._id} 
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className={`h-2 w-full shrink-0 ${job.type === 'job' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                {job.image && (
                  <div className="w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Badge & Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        job.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {job.type === 'job' ? <FiBriefcase /> : <FiTag />}
                        {job.type}
                      </span>
                      {job.category && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {job.category}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                    {job.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {job.salaryOrPrice && (
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                        <div className={`p-1.5 rounded-md ${job.type === 'job' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {job.type === 'job' ? <FiBriefcase /> : <FiTag />}
                        </div>
                        {job.type === 'job' ? 'Salary: ' : 'Price: '} 
                        <span className="text-slate-900">
                          {/^[₹$£€]/.test(job.salaryOrPrice) || /rs/i.test(job.salaryOrPrice) ? job.salaryOrPrice : `₹ ${job.salaryOrPrice}`}
                        </span>
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
                  
                  <div className="mt-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                      <FiInfo className="text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-amber-800">
                        To ensure security, please contact the Gaya Seva admin to proceed with this listing.
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

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
            >
              <FiX className="text-xl" />
            </button>

            <div className={`h-2 w-full ${selectedJob.type === 'job' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            
            {selectedJob.image && (
              <div className="w-full bg-slate-100 border-b border-slate-100">
                <img src={selectedJob.image} alt={selectedJob.title} className="w-full max-h-96 object-contain" />
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    selectedJob.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {selectedJob.type === 'job' ? <FiBriefcase /> : <FiTag />}
                    {selectedJob.type}
                  </span>
                  {selectedJob.category && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {selectedJob.category}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
                {selectedJob.title}
              </h2>

              <div className="space-y-3 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {selectedJob.salaryOrPrice && (
                  <div className="flex items-center gap-3 text-base font-bold text-slate-800">
                    <div className={`p-2 rounded-lg ${selectedJob.type === 'job' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {selectedJob.type === 'job' ? <FiBriefcase /> : <FiTag />}
                    </div>
                    {selectedJob.type === 'job' ? 'Salary: ' : 'Price: '} 
                    <span className="text-slate-900 text-lg">
                      {/^[₹$£€]/.test(selectedJob.salaryOrPrice) || /rs/i.test(selectedJob.salaryOrPrice) ? selectedJob.salaryOrPrice : `₹ ${selectedJob.salaryOrPrice}`}
                    </span>
                  </div>
                )}
                
                {selectedJob.location && (
                  <div className="flex items-center gap-3 text-base font-semibold text-slate-600">
                    <div className="p-2 rounded-lg bg-slate-200 text-slate-500">
                      <FiMapPin />
                    </div>
                    {selectedJob.location}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Description</h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <FiInfo className="text-amber-600 mt-1 shrink-0 text-lg" />
                <p className="text-sm font-medium text-amber-800 leading-relaxed">
                  To ensure security, please contact the Gaya Seva admin to proceed with this listing.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleContact('whatsapp', selectedJob.title); }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <FiMessageCircle className="text-lg" /> WhatsApp Admin
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleContact('call', selectedJob.title); }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <FiPhone className="text-lg" /> Call Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </main>
  );
}
