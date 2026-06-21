'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiPhone, FiLock, FiTruck, FiAlertCircle } from 'react-icons/fi'
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
  return (
    <article className="group relative rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full">
      <div className={`p-6 flex-1 flex flex-col ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
          <FiTruck className="text-2xl" />
        </div>
        
        <h3 className="font-sora font-bold text-xl text-slate-900 mb-1 line-clamp-1">{vehicle.vehicleName}</h3>
        <p className="text-indigo-600 font-bold text-[13px] mb-4">{vehicle.vehicleModel}</p>
        
        <div className="space-y-3 mt-auto">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Vehicle Number</p>
            <p className="font-semibold text-slate-800">{vehicle.vehicleNumber}</p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Owner</p>
            <p className="font-semibold text-slate-800 line-clamp-1">{vehicle.ownerName}</p>
          </div>
        </div>
      </div>

      <div className={`p-4 border-t border-slate-100 bg-slate-50/50 mt-auto ${!isSubscribed ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
        <a href={`tel:${vehicle.phone}`} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-indigo-600/20">
          <FiPhone /> {vehicle.phone}
        </a>
      </div>

      {!isSubscribed && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-3xl">
          <FiLock className="w-10 h-10 text-slate-800 mb-3 drop-shadow-md" />
          <h4 className="font-sora font-bold text-lg text-slate-900 mb-1">Subscription Required</h4>
          <p className="text-sm text-slate-600 font-medium mb-5 px-6 text-center leading-snug">Unlock direct contacts & rental details.</p>
          <Link 
            href="/pricing"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/30"
          >
            Subscribe ₹11/mo
          </Link>
        </div>
      )}
    </article>
  )
}
