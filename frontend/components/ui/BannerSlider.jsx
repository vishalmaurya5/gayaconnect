'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function BannerSlider({ position = 'home_top' }) {
  const [banners, setBanners] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch(`/api/banners?position=${position}`)
      const data = await res.json()
      if (data.success && data.banners && data.banners.length > 0) {
        setBanners(data.banners)
      } else {
        setBanners([])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([])
    }
  }

  // Re-fetch if position changes
  useEffect(() => {
    fetchBanners()
  }, [position])

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  // Koi approved banner nahi to kuch nahi dikhana
  if (banners.length === 0) {
    return null
  }

  const activeBanner = banners[activeIndex]

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="h-64 md:h-80 bg-cover bg-center rounded-2xl relative transition-all duration-500 cursor-pointer group"
        style={{ backgroundImage: `url(${activeBanner.imageUrl})` }}
        onClick={() => setSelectedImage(activeBanner.imageUrl)}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
          <div className="text-center text-white px-6">
            {activeBanner.vendorId?.name ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                Offer by {activeBanner.vendorId.name}
              </div>
            ) : activeBanner._id !== 'welcome-dummy' ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                Gaya Connect Special
              </div>
            ) : null}
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{activeBanner.title}</h3>
            <p className="text-lg">{activeBanner.description}</p>
            {activeBanner.link && (
              <a
                href={activeBanner.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block mt-4 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </a>
            )}
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner._id || index}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/60'}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal via Portal */}
      {selectedImage && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <img 
            src={selectedImage} 
            alt="Banner Full View" 
            className="max-w-full max-h-full rounded-lg object-contain shadow-[0_0_40px_rgba(255,255,255,0.1)]" 
          />
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}
