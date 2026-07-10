'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiPhone, FiLock, FiTruck, FiAlertCircle, FiUser, FiCheckCircle, FiChevronRight, FiShield, FiTool, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { BsFuelPump } from 'react-icons/bs'
import { useAuth } from '@/contexts/AuthContext'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ categoryId: '', location: '', vehicleName: '', match_mode: 'all' })
  const { user } = useAuth()
  
  // A user needs to be logged in and have an active subscription
  const isSubscribed = user && user.subscriptionActive && new Date(user.subscriptionExpiry) > new Date()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredVehicles(filters)
    }, 400)
    return () => clearTimeout(timer)
  }, [filters.categoryId, filters.location, filters.vehicleName, filters.match_mode])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) setCategories(data.categories)
    } catch (e) { console.error(e) }
  }

  const fetchFilteredVehicles = async (currentFilters = filters) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (currentFilters.categoryId) queryParams.append('categoryId', currentFilters.categoryId)
      if (currentFilters.location) queryParams.append('location', currentFilters.location)
      if (currentFilters.vehicleName) queryParams.append('vehicleName', currentFilters.vehicleName)
      queryParams.append('match_mode', currentFilters.match_mode)

      const res = await fetch(`/api/vehicles?${queryParams.toString()}`)
      const data = await res.json()
      if (data.success) setVehicles(data.vehicles || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleClearFilters = () => {
    const defaultFilters = { categoryId: '', location: '', vehicleName: '', match_mode: 'all' };
    setFilters(defaultFilters);
    fetchFilteredVehicles(defaultFilters);
  }

  return (
    <div className="bg-slate-50 py-12 min-h-screen">
      <div className="container-custom max-w-[1440px] px-5 lg:px-10 mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-3 flex items-center justify-center gap-2">
            <FiTruck /> Commercial Vehicles
          </p>
          <h1 className="text-3xl md:text-5xl font-sora font-bold text-slate-900 mb-4">
            Rent Vehicles Locally
          </h1>
          <p className="text-slate-600 font-medium text-[15px] leading-relaxed">
            Browse our list of verified commercial vehicles available for rent in Gaya. Contact owners directly to negotiate your rental.
          </p>
        </div>

        {/* Subscription Banner for non-subscribed users */}
        {!isSubscribed && (
          <div className="mb-10 rounded-2xl bg-indigo-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-transparent to-transparent"></div>
            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-sora font-bold text-white mb-2">Unlock Direct Contacts</h2>
              <p className="text-indigo-200 text-sm font-medium">Subscribe for ₹11/month to unlock all vehicle owner phone numbers instantly.</p>
            </div>
            <Link href="/pricing" className="relative z-10 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Subscribe Now
            </Link>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select value={filters.categoryId} onChange={e => setFilters({...filters, categoryId: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <input type="text" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} placeholder="City, Area, Address" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vehicle Name</label>
              <input type="text" value={filters.vehicleName} onChange={e => setFilters({...filters, vehicleName: e.target.value})} placeholder="e.g. Swift, Tata Ace" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-slate-700">Match Mode:</span>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium">
                <input type="radio" name="matchMode" className="text-indigo-600 focus:ring-indigo-500" checked={filters.match_mode === 'all'} onChange={() => setFilters({...filters, match_mode: 'all'})} /> All (AND)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium">
                <input type="radio" name="matchMode" className="text-indigo-600 focus:ring-indigo-500" checked={filters.match_mode === 'any'} onChange={() => setFilters({...filters, match_mode: 'any'})} /> Any (OR)
              </label>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={handleClearFilters} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex-1 sm:flex-none">Clear</button>
              <button onClick={() => fetchFilteredVehicles(filters)} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] flex-1 sm:flex-none">Apply Filters</button>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[280px] rounded-3xl bg-slate-200 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {vehicles.map((v) => (
              <VehicleCard key={v._id} vehicle={v} isSubscribed={isSubscribed} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-300 bg-white shadow-sm">
            <FiAlertCircle className="mx-auto text-5xl text-slate-300 mb-4" />
            <h3 className="text-xl font-sora font-bold text-slate-900 mb-2">No vehicles listed yet</h3>
            <p className="text-slate-500 font-medium">Check back soon for new commercial vehicles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function VehicleCard({ vehicle, isSubscribed }) {
  const handleContact = async (actionType, e) => {
    if (!isSubscribed) {
      e.preventDefault();
      return;
    }
    try {
      await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: vehicle._id,
          receiverName: vehicle.ownerId?.name || vehicle.ownerName || "Vehicle Owner",
          receiverType: 'Vehicle',
          receiverPhone: vehicle.ownerId?.phone || vehicle.phone,
          actionType: actionType
        })
      });
    } catch (err) {}
  };

  const isAvailable = !vehicle.availability_status || vehicle.availability_status === 'available';

  return (
    <article className="group relative rounded-[2rem] bg-[#0A0F1C] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full border border-slate-800">
      
      {/* Header Area (Dark) */}
      <div className={`relative px-4 pt-4 pb-5 ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        {/* Background Dot Pattern (Right Side) */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-80 mix-blend-screen pointer-events-none flex justify-end overflow-hidden">
           <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', backgroundSize: '12px 12px', maskImage: 'linear-gradient(to left, black, transparent)' }}></div>
        </div>
        
        {/* Top Badges */}
        <div className="relative flex justify-between items-start z-10 mb-3">
          <div className={`px-2 py-1 xl:px-3 xl:py-1.5 rounded-xl flex flex-col justify-center border shadow-lg ${
            isAvailable 
              ? 'bg-gradient-to-r from-emerald-950/80 to-[#0A0F1C] border-emerald-500/50 shadow-emerald-900/30' 
              : 'bg-gradient-to-r from-red-950/80 to-[#0A0F1C] border-red-500/50 shadow-red-900/30'
          }`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,1)]'}`}></span>
              <span className="text-white text-[9px] xl:text-[10px] font-bold tracking-widest uppercase">{isAvailable ? 'AVAILABLE' : 'BOOKED'}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-[6px] xl:text-[7px] font-bold tracking-widest uppercase ${isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>{isAvailable ? 'READY TO BOOK' : 'IN USE'}</span>
               <div className={`h-[1px] w-4 xl:w-6 ${isAvailable ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-300' : 'bg-gradient-to-r from-red-500/80 to-red-300'} relative rounded-full`}>
                 <span className={`absolute -right-1 -top-0.5 w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-300' : 'bg-red-300'}`}></span>
               </div>
            </div>
          </div>
          
          <div className="bg-[#131B2F] px-2 xl:px-2.5 py-0.5 xl:py-1 rounded-full flex items-center gap-1 border border-slate-700/60 shadow-sm mt-1">
            <FiShield className="text-amber-400 text-[9px] xl:text-[10px]" />
            <span className="text-white text-[7px] xl:text-[8px] font-bold tracking-widest uppercase">VERIFIED</span>
          </div>
        </div>

        {/* Vehicle Icon & Title */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0 transform group-hover:scale-105 transition-transform duration-300">
            <FiTruck className="text-xl xl:text-2xl text-slate-800" />
          </div>
          <div className="flex-1">
            <h3 className="font-sora font-bold text-base xl:text-lg text-white mb-0.5 leading-tight line-clamp-2 tracking-tight">{vehicle.vehicleName}</h3>
            <p className="text-indigo-300 text-[9px] xl:text-[10px] font-semibold tracking-wide uppercase opacity-90">{vehicle.vehicleModel}</p>
          </div>
        </div>
      </div>

      {/* Body Details (White Card) */}
      <div className={`px-3.5 py-3.5 flex-1 flex flex-col bg-white rounded-t-[1.5rem] relative z-20 ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        <div className="space-y-0 mb-3">
          {/* Category */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100 group/item cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[8px] xl:rounded-[10px] bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <FiTruck className="text-sm xl:text-base" />
              </div>
              <span className="text-slate-500 font-bold text-[8px] xl:text-[9px] uppercase tracking-wider">CATEGORY</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-slate-900 text-[11px] xl:text-xs truncate text-right">{vehicle.categoryId?.name || 'Commercial'}</span>
              <FiChevronRight className="text-slate-400 text-sm shrink-0" />
            </div>
          </div>
          
          {/* Number */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100 group/item cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[8px] xl:rounded-[10px] bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <div className="border border-blue-500 rounded px-[3px] text-[7px] xl:text-[8px] font-bold">123</div>
              </div>
              <span className="text-slate-500 font-bold text-[8px] xl:text-[9px] uppercase tracking-wider">NUMBER</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-slate-900 text-[10px] xl:text-[11px] bg-slate-100/80 px-1.5 py-0.5 rounded tracking-wider border border-slate-200/50 truncate text-right">{vehicle.vehicleNumber}</span>
              <FiChevronRight className="text-slate-400 text-sm shrink-0" />
            </div>
          </div>

          {/* Owner */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100 group/item cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[8px] xl:rounded-[10px] bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <FiUser className="text-sm xl:text-base" />
              </div>
              <span className="text-slate-500 font-bold text-[8px] xl:text-[9px] uppercase tracking-wider">OWNER</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end pl-2">
              <span className="font-extrabold text-slate-900 text-[11px] xl:text-xs line-clamp-2 text-right">{vehicle.ownerId?.name || vehicle.ownerName}</span>
              <FiChevronRight className="text-slate-400 text-sm shrink-0" />
            </div>
          </div>
          
          {/* Location */}
          <div className="flex justify-between items-center py-2 group/item cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[8px] xl:rounded-[10px] bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                <FiMapPin className="text-sm xl:text-base" />
              </div>
              <span className="text-slate-500 font-bold text-[8px] xl:text-[9px] uppercase tracking-wider">LOCATION</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end pl-2">
              <span className="font-extrabold text-slate-900 text-[11px] xl:text-xs line-clamp-2 text-right">{vehicle.ownerId?.address || 'Gaya'}</span>
              <FiChevronRight className="text-slate-400 text-sm shrink-0" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-2">
          {/* Call Button */}
          <a 
            href={`tel:${vehicle.ownerId?.phone || vehicle.phone}`} 
            onClick={(e) => handleContact('Call', e)}
            className="w-full flex items-center justify-between bg-[#0B1221] hover:bg-black rounded-[14px] p-1.5 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 xl:gap-3">
               <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-lg bg-[#F0EBE1] flex items-center justify-center shrink-0">
                 <FiPhone className="text-base xl:text-lg text-slate-900" />
               </div>
               <div className="flex flex-col min-w-0">
                 <span className="text-[#CBAA7B] text-[7px] xl:text-[8px] font-bold tracking-widest uppercase mb-0.5 truncate">CALL NOW</span>
                 <span className="text-white text-xs xl:text-sm font-bold tracking-wide leading-none truncate">Contact Owner</span>
               </div>
            </div>
            <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full border border-dashed border-[#CBAA7B]/50 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-[#CBAA7B] flex items-center justify-center">
                 <FiPhone className="text-[10px] xl:text-[12px] text-[#0B1221] fill-current" />
              </div>
            </div>
          </a>

          {/* WhatsApp Button */}
          <a 
            href={`https://wa.me/91${(vehicle.ownerId?.phone || vehicle.phone).replace(/\D/g, '')}?text=Hi, I want to rent your ${vehicle.vehicleName} from Gaya Seva.`} 
            onClick={(e) => handleContact('WhatsApp', e)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between bg-[#E8F5E9] hover:bg-[#dcfce7] rounded-[14px] p-1.5 transition-all duration-300 shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 xl:gap-3">
               <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-lg bg-[#388E3C] flex items-center justify-center shrink-0">
                 <FaWhatsapp className="text-lg xl:text-xl text-white" />
               </div>
               <div className="flex flex-col min-w-0 pr-1">
                 <span className="text-[#2E7D32] text-[11px] xl:text-xs font-extrabold tracking-tight mb-0.5 truncate">WhatsApp</span>
                 <span className="text-[#2E7D32]/80 text-[8px] xl:text-[9px] font-semibold tracking-wide leading-tight line-clamp-1">Chat directly</span>
               </div>
            </div>
            <div className="w-6 h-8 xl:w-8 xl:h-10 rounded-lg bg-[#388E3C] flex items-center justify-center shrink-0">
               <FiChevronRight className="text-base xl:text-lg text-white" />
            </div>
          </a>
        </div>
      </div>

      {!isSubscribed && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0F1C]/80 backdrop-blur-md">
          <div className="bg-white/10 p-5 rounded-2xl shadow-xl mb-5 border border-white/10 transform -translate-y-4">
            <FiLock className="w-8 h-8 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
          </div>
          <h4 className="font-sora font-bold text-2xl text-white mb-2">Subscription Required</h4>
          <p className="text-sm text-slate-300 font-medium mb-8 px-8 text-center leading-relaxed max-w-[300px]">Unlock owner details and direct contact numbers instantly.</p>
          <Link 
            href="/pricing"
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-10 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] active:scale-95"
          >
            Subscribe for ₹11/mo
          </Link>
        </div>
      )}
    </article>
  )
}
