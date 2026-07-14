'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';

export default function JobPreviewSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data.success) {
          // Only show 3 latest approved jobs
          setJobs(data.jobs.filter(job => job.status === 'APPROVED' || job.status === 'OPEN').slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-slate-500 font-medium">New jobs are being posted soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div key={job._id} className="bg-white border border-slate-200 rounded-[20px] p-6 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                <FiBriefcase className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-wider">
                {job.jobType || 'Full Time'}
              </span>
            </div>
            
            <h3 className="font-sora text-[18px] font-bold text-slate-900 mb-2 line-clamp-1">{job.title}</h3>
            
            <div className="space-y-2 mt-4">
              {job.salary && (
                <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <FiDollarSign className="text-emerald-500" /> ₹{job.salary.toLocaleString('en-IN')} / month
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <FiMapPin className="text-slate-400" /> {job.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <FiClock className="text-slate-400" /> Posted Recently
              </div>
            </div>
          </div>
          
          <Link href="/jobs" className="mt-6 w-full text-center bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl transition-colors text-[14px]">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
