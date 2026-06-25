'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiPhone, FiStar, FiClock, FiTool, FiCheckCircle, FiMapPin, FiLock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
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
            Local Workers & Technicians
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find skilled professionals, technicians, and daily wage workers in Gaya. Directly contact electricians, plumbers, masons, and more for your household or construction needs.
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
            <h3 className="text-2xl font-bold mb-2">Are you a skilled worker or technician?</h3>
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
  const handleContact = async (e, type) => {
    if (!isSubscribed) return;
    e.preventDefault();
    try {
      await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: labour._id,
          receiverName: labour.name,
          receiverType: 'Labourer',
          receiverPhone: labour.phone,
          actionType: type
        })
      });
    } catch (err) {}
    
    if (type === 'WhatsApp') {
      window.open(`https://wa.me/91${labour.phone.replace(/\D/g, '')}?text=Hi, I found your profile on Gaya Connect.`, '_blank');
    } else {
      window.location.href = `tel:${labour.phone}`;
    }
  };

  const getCategoryIcon = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('electrician')) return '⚡';
    if (c.includes('plumber')) return '🔧';
    if (c.includes('cleaner')) return '🧹';
    if (c.includes('carpenter')) return '🔨';
    if (c.includes('mason')) return '🧱';
    if (c.includes('painter')) return '🎨';
    if (c.includes('driver')) return '🚗';
    return '🛠️';
  };

  const getInitialsBg = (name) => {
    const colors = ['bg-indigo-600', 'bg-blue-600', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-slate-400'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-gradient-to-br from-[#f8fdfa] to-[#f1f5f9] rounded-[24px] p-5 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-emerald-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
      
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="relative">
          <div className={`w-14 h-14 rounded-full border-2 border-slate-50 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0 ${labour.photo ? '' : getInitialsBg(labour.name)}`}>
            {labour.photo ? (
              <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
            ) : (
              labour.name.substring(0, 2).toUpperCase()
            )}
          </div>
          {/* Status Dot */}
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${labour.availability ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        </div>

        <div>
          <h3 className="font-bold text-[17px] text-slate-900 leading-tight mb-0.5">{labour.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600 font-medium flex items-center gap-1.5">
              <span>{getCategoryIcon(labour.category)}</span>
              {labour.category}
            </span>
            {labour.rating >= 4.5 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                <FiCheckCircle /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-200/60 mb-4"></div>

      {/* Details */}
      <div className="flex flex-col gap-2.5 mb-5 flex-1">
        <div className="flex items-center gap-2.5 text-sm">
          <FiMapPin className="text-slate-400 shrink-0" />
          <span className="text-slate-400">Location:</span>
          <span className="font-semibold text-slate-800">{labour.area}</span>
        </div>
        
        <div className="flex items-center gap-2.5 text-sm">
          <span className="text-slate-400 font-serif font-bold italic shrink-0 px-0.5">Rs</span>
          <span className="text-slate-400">Daily Rate:</span>
          <span className="font-bold text-indigo-600">
            {labour.dailyRate ? `₹${labour.dailyRate}/day` : 'Negotiable'}
          </span>
        </div>

        {labour.rating > 0 && (
          <div className="flex items-center gap-2.5 text-sm">
            <FiStar className="text-amber-500 fill-amber-500 shrink-0" />
            <span className="text-slate-400">Rating:</span>
            <span className="font-bold text-slate-800">{labour.rating} <span className="font-medium text-slate-400 text-xs">({labour.reviewCount} reviews)</span></span>
          </div>
        )}

        <div className="mt-1">
          {labour.availability ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded-full uppercase tracking-wide">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available Today
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold rounded-full uppercase tracking-wide opacity-50 blur-[1px]">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="relative mt-auto">
        <div className="grid grid-cols-2 gap-3">
          {isSubscribed ? (
            <>
              <button 
                onClick={(e) => handleContact(e, 'Call')}
                className="flex items-center justify-center gap-2 bg-[#00B47D] hover:bg-[#009668] text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                <FiPhone /> Call
              </button>
              <button 
                onClick={(e) => handleContact(e, 'WhatsApp')}
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                <FaWhatsapp className="text-base" /> WhatsApp
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-50/70 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed">
                <FiPhone /> Locked
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-50/70 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed">
                <FaWhatsapp className="text-base" /> Locked
              </button>
            </>
          )}
        </div>

        {!isSubscribed && (
          <div className="absolute inset-0 flex items-center justify-center z-10" onClick={onSubscribe}>
            <div className="absolute inset-0 rounded-xl cursor-pointer"></div>
          </div>
        )}
      </div>
    </div>
  );
}
