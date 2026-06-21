'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FiActivity, FiBookOpen, FiBriefcase, FiCpu, FiGift, FiHeart, FiHome, FiMap, FiScissors, FiShoppingBag, FiTool, FiTruck, FiArrowUpRight
} from 'react-icons/fi'
import { SERVICE_CATEGORIES, slugifyService } from '@/lib/utils/serviceCategories'

const icons = [FiHome, FiBookOpen, FiScissors, FiHeart, FiGift, FiCpu, FiTruck, FiShoppingBag, FiBriefcase, FiMap, FiTool, FiActivity]
const gradients = [
  'from-blue-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-pink-500 to-rose-400', 
  'from-red-500 to-orange-400', 'from-orange-500 to-yellow-400', 'from-indigo-500 to-purple-400', 
  'from-cyan-600 to-blue-500', 'from-purple-500 to-pink-400'
]

export default function CategoryGrid() {
  const router = useRouter()
  const categories = SERVICE_CATEGORIES.slice(0, 12)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 relative z-10">
      {categories.map((category, index) => {
        const Icon = icons[index % icons.length]
        const gradient = gradients[index % gradients.length]
        
        return (
          <motion.button
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/services/${slugifyService(category.name)}`)}
            className="group relative w-full"
          >
            <div className="h-full bg-white rounded-[24px] p-6 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.15)] hover:border-indigo-100 hover:-translate-y-2 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}"></div>
              <div className={`w-14 h-14 mb-4 rounded-[16px] bg-gradient-to-br ${gradient} p-[2px] shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                  <Icon className="text-xl text-white drop-shadow-sm" />
                </div>
              </div>
              <h3 className="text-[14px] font-[800] text-slate-900 leading-tight mb-1">{category.name}</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{category.subcategories.length} services</p>
              
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 -translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0">
                <FiArrowUpRight className="text-indigo-500 w-3 h-3" />
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
