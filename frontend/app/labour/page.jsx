'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPhone, FiTool, FiMapPin, FiLock, FiCheck } from 'react-icons/fi';
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
    } catch (err) { }
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
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          <div className="flex-1">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition appearance-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
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

        {/* Listing Grid — items-start means each card keeps its own natural
            height instead of being stretched to match the tallest card in
            the row. That's what was creating the internal gap before. */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-start">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-pulse h-[300px]"></div>
            ))}
          </div>
        ) : labourers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-start">
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
  const handleContact = (e, type) => {
    if (!isSubscribed) return;
    e.preventDefault();

    const phoneNum = String(labour.phone || '');
    const cleanPhone = phoneNum.replace(/\D/g, '');

    fetch('/api/calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiverId: labour._id,
        receiverName: labour.name,
        receiverType: 'Labourer',
        receiverPhone: phoneNum,
        actionType: type
      })
    }).catch(() => { });

    if (type === 'WhatsApp') {
      window.location.href = `https://wa.me/91${cleanPhone}?text=Hi, I found your profile on Gaya Connect.`;
    } else {
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  return (
    // No h-full, no flex-1 spacer. The card is a plain flex column that
    // hugs its own content — combined with `items-start` on the grid
    // above, every card ends at exactly the height its content needs.
    <div className="bg-[#262626] rounded-[20px] p-4 flex flex-col text-white border border-[#3a3a3a]">

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-shrink-0">
          <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center text-blue-300 font-semibold text-[15px] overflow-hidden ${labour.photo ? '' : 'bg-[#002855]'}`}>
            {labour.photo ? (
              <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
            ) : (
              labour.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-[15px] h-[15px] rounded-full border-2 border-[#262626] flex items-center justify-center ${labour.availability ? 'bg-[#25D366]' : 'bg-red-500'}`}>
            {labour.availability && <FiCheck size={9} className="text-black stroke-[3]" />}
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-[15px] text-white leading-tight truncate">{labour.name}</h3>
            {labour.rating >= 4.5 && (
              <span className="bg-[#0b2b11] text-[#25D366] px-1.5 py-[1px] rounded-[6px] text-[10px] font-semibold shrink-0">Verified</span>
            )}
          </div>
          <div className="text-[13px] text-gray-400 truncate">{labour.category}</div>
        </div>
        {labour.rating > 0 && (
          <div className="font-bold text-[14px] text-white shrink-0 ml-auto">{labour.rating}</div>
        )}
      </div>

      <div className="h-px w-full bg-white/10 my-3.5"></div>

      {/* Location */}
      <div className="flex items-center gap-2 text-[13px] mb-3">
        <FiMapPin size={14} className="text-gray-400 shrink-0" />
        <span className="text-gray-300">{labour.area}</span>
      </div>

      {/* Skills — only takes up space if present, no reserved slot */}
      {labour.skills && labour.skills.length > 0 && (
        <div className="flex items-start gap-2 mb-3.5">
          <FiTool size={14} className="text-gray-400 shrink-0 mt-1" />
          <div className="flex flex-wrap gap-1.5">
            {labour.skills.map((skill, idx) => (
              <span key={idx} className="bg-[#1e1e1e] text-gray-300 px-2.5 py-[3px] rounded-full text-[12px] border border-white/5">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Daily Rate */}
      <div className="bg-[#1e1e1e] rounded-xl px-3 py-2.5 flex items-center justify-between mb-2.5">
        <span className="text-gray-400 text-[13px]">Daily rate</span>
        <span className="text-[15px] font-bold text-white">
          {labour.dailyRate ? (
            <>₹{labour.dailyRate}<span className="text-[12px] text-gray-400 font-normal">/day</span></>
          ) : 'Negotiable'}
        </span>
      </div>

      {/* Availability */}
      <div className={`text-[12px] font-semibold rounded-xl py-2 flex items-center justify-center gap-2 mb-2.5 ${labour.availability ? 'bg-[#0b2b11] text-[#25D366]' : 'bg-[#3a1313] text-red-500'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${labour.availability ? 'bg-[#25D366]' : 'bg-red-500'}`} />
        {labour.availability ? 'Available today' : 'Currently busy'}
      </div>

      {/* Actions */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-2">
          {isSubscribed ? (
            <>
              <button
                onClick={(e) => handleContact(e, 'Call')}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 text-black py-2.5 rounded-xl font-bold text-[13px] transition-colors"
              >
                <FiPhone size={15} /> Call
              </button>
              <button
                onClick={(e) => handleContact(e, 'WhatsApp')}
                className="flex items-center justify-center gap-1.5 bg-[#1ea826] hover:bg-[#16881c] text-black py-2.5 rounded-xl font-bold text-[13px] transition-colors"
              >
                <FaWhatsapp size={16} /> WhatsApp
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center justify-center gap-1.5 bg-white/10 text-white/50 py-2.5 rounded-xl font-bold text-[13px] cursor-not-allowed border border-white/5">
                <FiLock size={15} /> Locked
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-white/10 text-white/50 py-2.5 rounded-xl font-bold text-[13px] cursor-not-allowed border border-white/5">
                <FiLock size={15} /> Locked
              </button>
            </>
          )}
        </div>

        {!isSubscribed && (
          <div className="absolute inset-0 cursor-pointer" onClick={onSubscribe}></div>
        )}
      </div>
    </div>
  );
}