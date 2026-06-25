'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiPhone, FiLock, FiTruck, FiAlertCircle, FiUser, FiCheckCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  // A user needs to be logged in and have an active subscription
  const isSubscribed = user && user.subscriptionActive && new Date(user.subscriptionExpiry) > new Date()

  useEffect(() => {
    fetch('/api/vehicles')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setVehicles(data.vehicles || [])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[280px] rounded-3xl bg-slate-200 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          receiverName: vehicle.ownerName || "Vehicle Owner",
          receiverType: 'Vehicle',
          receiverPhone: vehicle.phone,
          actionType: actionType
        })
      });
    } catch (err) {}
  };

  return (
    <article className="group relative rounded-[2rem] bg-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col h-full border border-slate-200">
      
      {/* Header - Purple Gradient */}
      <div className={`bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 relative overflow-hidden ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-md border border-white/20 shrink-0">
              <FiTruck className="text-2xl text-white drop-shadow-md" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-lg text-white mb-0.5 line-clamp-1">{vehicle.vehicleName}</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                <p className="text-indigo-100 text-sm font-medium">{vehicle.vehicleModel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
          <FiCheckCircle className="text-emerald-400 text-[13px]" />
          <span className="text-white text-xs font-bold tracking-wide">Verified</span>
        </div>
      </div>

      {/* Body */}
      <div className={`p-6 flex-1 flex flex-col ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
              <FiTruck className="text-sm" /> Vehicle Number
            </div>
            <div className="font-bold text-slate-900">{vehicle.vehicleNumber}</div>
          </div>
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
              <FiUser className="text-sm" /> Owner
            </div>
            <div className="font-bold text-slate-900 line-clamp-1 text-right max-w-[120px]">{vehicle.ownerName}</div>
          </div>

          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
              <FiPhone className="text-sm" /> Contact
            </div>
            <div className="font-bold text-indigo-700">{vehicle.phone}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`px-5 pb-6 mt-auto flex gap-3 ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        <a 
          href={`tel:${vehicle.phone}`} 
          onClick={(e) => handleContact('Call', e)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] active:scale-95 text-sm sm:text-base"
        >
          <FiPhone className="text-lg" /> Call Now
        </a>
        <a 
          href={`https://wa.me/91${vehicle.phone.replace(/\D/g, '')}?text=Hi, I want to rent your ${vehicle.vehicleName} from Gaya Connect.`} 
          onClick={(e) => handleContact('WhatsApp', e)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] active:scale-95 text-sm sm:text-base"
        >
          <FaWhatsapp className="text-lg" /> WhatsApp
        </a>
      </div>

      {!isSubscribed && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[4px] rounded-[2rem]">
          <div className="bg-white p-4 rounded-2xl shadow-xl mb-4">
            <FiLock className="w-8 h-8 text-indigo-600 drop-shadow-sm" />
          </div>
          <h4 className="font-sora font-bold text-xl text-slate-900 mb-2">Subscription Required</h4>
          <p className="text-sm text-slate-600 font-medium mb-6 px-8 text-center leading-relaxed">Unlock owner details and direct contact numbers.</p>
          <Link 
            href="/pricing"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            Subscribe ₹11/mo
          </Link>
        </div>
      )}
    </article>
  )
}
