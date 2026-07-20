'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiHome, FiBookOpen, FiScissors, FiActivity, FiCoffee,
  FiTool, FiTruck, FiShoppingBag, FiCamera, FiMap,
  FiClock, FiGlobe, FiArrowRight, FiCheckCircle
} from 'react-icons/fi'
import { SERVICE_CATEGORIES, slugifyService } from '@/lib/utils/serviceCategories'

const HOME_CATEGORIES = [
  { name: 'Home Services', count: 120, icon: FiHome, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', shadow: 'hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)]' },
  { name: 'Healthcare', count: 85, icon: FiActivity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', shadow: 'hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)]' },
  { name: 'Education', count: 64, icon: FiBookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', shadow: 'hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)]' },
  { name: 'Technology', count: 150, icon: FiGlobe, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', shadow: 'hover:shadow-[0_8px_30px_rgb(124,58,237,0.12)]' },
  { name: 'Construction', count: 45, icon: FiTool, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', shadow: 'hover:shadow-[0_8px_30px_rgb(234,88,12,0.12)]' },
  { name: 'Automotive', count: 90, icon: FiTruck, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', shadow: 'hover:shadow-[0_8px_30px_rgb(51,65,85,0.12)]' },
  { name: 'Beauty & Wellness', count: 110, icon: FiScissors, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', shadow: 'hover:shadow-[0_8px_30px_rgb(225,29,72,0.12)]' },
  { name: 'Business Services', count: 70, icon: FiShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', shadow: 'hover:shadow-[0_8px_30px_rgb(147,51,234,0.12)]' },
  { name: 'Repair & Maintenance', count: 95, icon: FiTool, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', shadow: 'hover:shadow-[0_8px_30px_rgb(8,145,178,0.12)]' },
  { name: 'Legal', count: 40, icon: FiCheckCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', shadow: 'hover:shadow-[0_8px_30px_rgb(217,119,6,0.12)]' },
  { name: 'Finance', count: 55, icon: FiActivity, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', shadow: 'hover:shadow-[0_8px_30px_rgb(13,148,136,0.12)]' },
  { name: 'Hospitality', count: 130, icon: FiCoffee, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', shadow: 'hover:shadow-[0_8px_30px_rgb(219,39,119,0.12)]' },
]

export default function CategoryGrid() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 relative z-10">
      {HOME_CATEGORIES.map((category, index) => {
        const Icon = category.icon
        const style = { bg: category.bg, border: category.border, shadow: category.shadow, color: category.color };
        
        return (
          <motion.button
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
            onClick={() => router.push(`/services/${slugifyService(category.name)}`)}
            className={`group relative w-full flex flex-col text-left bg-white rounded-[24px] p-6 border border-slate-200/60 hover:border-transparent transition-all duration-300 hover:-translate-y-1.5 ${style.shadow}`}
          >
            {/* Top row: Icon and Arrow */}
            <div className="flex justify-between items-start mb-6 w-full">
              <div className={`w-14 h-14 rounded-[18px] ${style.bg} ${style.border} border border-opacity-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                <Icon className={`text-[22px] ${style.color} drop-shadow-sm`} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 border border-slate-100">
                <FiArrowRight className="text-slate-600 w-4 h-4 group-hover:text-[#0F172A] transition-colors" />
              </div>
            </div>

            {/* Bottom row: Texts */}
            <div className="mt-auto w-full">
              <h3 className="text-[15px] font-[800] text-[#0F172A] leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {category.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${style.bg.replace('bg-', 'bg-').replace('50', '400')}`}></span>
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                  {category.count}+ Providers
                </p>
              </div>
            </div>

            {/* Subtle bottom accent glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-all duration-500 group-hover:w-3/4 opacity-0 group-hover:opacity-100 blur-[2px]"></div>
          </motion.button>
        )
      })}
    </div>
  )
}
