'use client'

import { useState, useEffect } from 'react'

export default function BannerSlider() {
  const [banners, setBanners] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    const welcomeBanner = {
      _id: 'welcome-dummy',
      title: 'Welcome to Gaya Connect!',
      description: 'Thank you for joining us. Whether you are a user or a vendor, we are thrilled to have you here!',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80',
      link: '/register',
    }

    try {
      const res = await fetch('/api/banners')
      const data = await res.json()
      if (data.success && data.banners && data.banners.length > 0) {
        setBanners([welcomeBanner, ...data.banners])
      } else {
        setBanners([welcomeBanner])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([welcomeBanner])
    }
  }

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl h-64 flex items-center justify-center">
        <p className="text-white text-xl">Special Offers Coming Soon!</p>
      </div>
    )
  }

  const activeBanner = banners[activeIndex]

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="h-64 md:h-80 bg-cover bg-center rounded-2xl relative transition-all duration-500"
        style={{ backgroundImage: `url(${activeBanner.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{activeBanner.title}</h3>
            <p className="text-lg">{activeBanner.description}</p>
            {activeBanner.link && (
              <a
                href={activeBanner.link}
                target="_blank"
                rel="noopener noreferrer"
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
    </div>
  )
}
