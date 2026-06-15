'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiPhone, FiStar, FiClock, FiTool } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Mason (Raj Mistri)', 'Helper', 'Painter', 'Carpenter', 'Welder', 'Driver', 'House Help', 'Farm Labour', 'Plumber', 'Electrician', 'Mechanic', 'Cleaner', 'Other'];

export default function LabourListingPage() {
  const router = useRouter();
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    availability: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchLabourers();
  }, [filters]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.user) {
        setUserProfile(data.user);
      }
    } catch (err) {}
  };

  const fetchLabourers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.area) params.append('area', filters.area);
      if (filters.availability) params.append('availability', filters.availability);

      const res = await fetch(`/api/labour?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLabourers(data.labourers || []);
      }
    } catch (error) {
      toast.error('Failed to fetch labour profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  const isSubscribed = userProfile?.subscriptionActive && new Date(userProfile?.subscriptionExpiry) > new Date();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Daily Labour Directory
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find skilled and reliable daily wage workers in Gaya. Directly contact workers for your household and construction needs.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              type="text" 
              placeholder="Search by area or locality..." 
              value={filters.area}
              onChange={(e) => setFilters({...filters, area: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>
          
          <div className="flex-1">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition appearance-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <select 
              value={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition appearance-none"
            >
              <option value="">Any Availability</option>
              <option value="today">Available Today</option>
            </select>
          </div>
        </div>

        {/* Labour Registration Banner */}
        <div className="bg-emerald-600 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
          <div>
            <h3 className="text-2xl font-bold mb-2">Are you a daily wage worker?</h3>
            <p className="text-emerald-100">Register your profile for free and get hired directly by customers in Gaya.</p>
          </div>
          <button 
            onClick={() => router.push('/labour/register')}
            className="mt-6 md:mt-0 px-8 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-sm whitespace-nowrap"
          >
            Register Profile
          </button>
        </div>

        {/* Listing Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-64"></div>
            ))}
          </div>
        ) : labourers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {labourers.map(labour => (
              <LabourCard 
                key={labour._id} 
                labour={labour} 
                isSubscribed={isSubscribed} 
                onSubscribe={handleSubscribe} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <FiTool className="mx-auto text-5xl text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No profiles found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LabourCard({ labour, isSubscribed, onSubscribe }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition relative group flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
          {labour.photo ? (
            <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold bg-slate-200">
              {labour.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 leading-tight">{labour.name}</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
            {labour.category}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-slate-400">📍</span> {labour.area}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {labour.availability ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <FiCheckCircle /> Available Today
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <FiClock /> Busy
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-4">
        {/* Rate & Contact - Blurred if not subscribed */}
        <div className="relative">
          <div className={`${!isSubscribed ? 'filter blur-sm select-none' : ''}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500">Daily Rate:</span>
              <span className="font-bold text-slate-900">₹{labour.dailyRate}/day</span>
            </div>
            
            <a 
              href={isSubscribed ? `tel:${labour.phone}` : '#'}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition"
            >
              <FiPhone /> {isSubscribed ? labour.phone : '+91 XXXXX XXXXX'}
            </a>
          </div>

          {!isSubscribed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="absolute inset-0 bg-white/40 rounded-xl"></div>
              <button 
                onClick={onSubscribe}
                className="relative z-20 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition"
              >
                Subscribe ₹11/mo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
