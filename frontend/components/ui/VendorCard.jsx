'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiStar, FiMapPin, FiPhone, FiHeart, FiUser, FiLock } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function VendorCard({ vendor }) {
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const isSubscriptionActive = user?.isSubscribed
  const phoneNumber = vendor.phone || vendor.userId?.phone || '+910000000000';

  return (
    <div className="relative bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
      <div className={`relative h-56 overflow-hidden ${!isSubscriptionActive ? 'blur-[2px]' : ''}`}>
        <div className="absolute inset-0 bg-slate-900/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
        <img
          src={vendor.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {vendor.isPremium && (
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1">
            <FiStar className="fill-white w-3 h-3" /> PREMIUM
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white shadow-sm transition-all hover:scale-110 active:scale-95"
        >
          <FiHeart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'}`} />
        </button>
      </div>

      {/* Content */}
      <div className={`p-5 ${!isSubscriptionActive ? 'blur-[2px]' : ''}`}>
        <div className="flex justify-between items-start mb-1">
          <Link href={`/vendors/${vendor._id}`} className="flex-1 pr-3">
            <h3 className="font-extrabold text-xl text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {vendor.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-green-50 border border-green-100 px-2 py-1 rounded-lg shrink-0">
            <FiStar className="text-green-500 fill-green-500 text-sm" />
            <span className="text-sm font-bold text-green-700">{vendor.rating || 4.5}</span>
          </div>
        </div>

        <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">{vendor.category}</p>

        <div className="flex items-start gap-2 text-slate-500 text-sm mb-5">
          <FiMapPin className="text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2 font-medium">{vendor.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-100 hover:border-transparent py-2 rounded-xl text-[13px] font-bold transition-all duration-300 shadow-sm"
          >
            <FiPhone /> Call
          </a>
          <a
            href={`https://wa.me/91${phoneNumber.replace(/\D/g, '')}?text=Hi, I found your business on Gaya Connect.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-100 hover:border-transparent py-2 rounded-xl text-[13px] font-bold transition-all duration-300 shadow-sm"
          >
            <FaWhatsapp /> Chat
          </a>
          <Link
            href={`/vendors/${vendor._id}`}
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-transparent py-2 rounded-xl text-[13px] font-bold transition-all duration-300 shadow-sm"
          >
            Details
          </Link>
        </div>
      </div>

      {!isSubscriptionActive && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl">
          <FiLock className="w-8 h-8 text-slate-800 mb-3" />
          <h4 className="font-bold text-lg text-slate-900">Subscription Required</h4>
          <p className="text-sm text-slate-600 mb-4 px-6 text-center">Unlock vendor contact details, offers & local workforce.</p>
          <button 
            onClick={() => router.push('/profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Renew ₹11/month
          </button>
        </div>
      )}
    </div>
  )
}