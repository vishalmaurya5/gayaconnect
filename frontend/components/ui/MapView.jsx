'use client'

import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Filter, Store, Tag, HardHat } from 'lucide-react'

// Fix Leaflet's default icon path issues
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

export default function MapView({ fullScreen = false }) {
  const [vendors, setVendors] = useState([])
  const [offers, setOffers] = useState([])
  const [labourers, setLabourers] = useState([])
  
  const [filters, setFilters] = useState({
    vendors: true,
    offers: true,
    labour: true
  })
  
  const [userLocation, setUserLocation] = useState([24.792, 85.014]) // Gaya coordinates
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const markerGroupRef = useRef(null) // Keep track of current markers

  useEffect(() => {
    // Get user location
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          if (mapRef.current) {
            mapRef.current.setView([position.coords.latitude, position.coords.longitude], 13)
          }
        },
        (error) => console.log('Geolocation error:', error)
      )
    }

    // Fetch data
    const fetchData = async () => {
      try {
        const [vendorsRes, offersRes, labourRes] = await Promise.all([
          fetch('/api/vendors?limit=100').then(r => r.json()),
          fetch('/api/offers?limit=100').then(r => r.json()),
          fetch('/api/labourers?limit=100').then(r => r.json())
        ])
        
        if (vendorsRes.vendors) setVendors(vendorsRes.vendors)
        if (offersRes.offers) setOffers(offersRes.offers)
        if (labourRes.data) setLabourers(labourRes.data)
      } catch (error) {
        console.error('Error fetching map data:', error)
      }
    }
    
    fetchData()
  }, [])

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: userLocation,
        zoom: 13,
        scrollWheelZoom: true
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      markerGroupRef.current = L.featureGroup().addTo(map)
      mapRef.current = map
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update Markers when data or filters change
  useEffect(() => {
    if (!mapRef.current || !markerGroupRef.current) return
    const markerGroup = markerGroupRef.current
    markerGroup.clearLayers() // Remove old markers

    // Custom Icon Generators
    const createIcon = (color, svgPath) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 2px solid white;">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      })
    }

    const vendorIcon = createIcon('#4f46e5', '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>')
    const offerIcon = createIcon('#e11d48', '<line x1="16" y1="3" x2="16" y2="21"></line><line x1="8" y1="3" x2="8" y2="21"></line><line x1="3" y1="8" x2="21" y2="8"></line><line x1="3" y1="16" x2="21" y2="16"></line>')
    const labourIcon = createIcon('#16a34a', '<path d="M2 18v3c0 .6.4 1 1 1h4v-3h10v3h4c.6 0 1-.4 1-1v-3M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-11 4h18M12 14v4M8 14v4M16 14v4"/>')

    // Add Vendors
    if (filters.vendors) {
      vendors.forEach((vendor) => {
        if (vendor.location?.lat && vendor.location?.lng) {
          const marker = L.marker([vendor.location.lat, vendor.location.lng], { icon: vendorIcon })
          marker.bindPopup(`
            <div class="p-2 min-w-[200px]">
              <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Vendor</div>
              <h3 class="font-sora font-bold text-lg leading-tight">${vendor.name}</h3>
              <p class="text-sm text-gray-600 font-medium">${vendor.category}</p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${vendor.location.lat},${vendor.location.lng}" target="_blank" class="block mt-3 bg-indigo-600 text-white text-center text-xs font-bold py-2 rounded-lg hover:bg-indigo-700">Get Directions</a>
            </div>
          `)
          markerGroup.addLayer(marker)
        }
      })
    }

    // Add Offers
    if (filters.offers) {
      offers.forEach((offer) => {
        const loc = offer.vendorId?.location
        if (loc?.lat && loc?.lng) {
          const marker = L.marker([loc.lat, loc.lng], { icon: offerIcon })
          marker.bindPopup(`
            <div class="p-2 min-w-[200px]">
              <div class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Local Offer</div>
              <h3 class="font-sora font-bold text-lg leading-tight text-rose-700">${offer.discountText || offer.title}</h3>
              <p class="text-sm font-bold text-gray-800 mt-1">${offer.vendorId?.name}</p>
              <p class="text-xs text-gray-500">${offer.title}</p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" class="block mt-3 bg-rose-600 text-white text-center text-xs font-bold py-2 rounded-lg hover:bg-rose-700">Go to Shop</a>
            </div>
          `)
          markerGroup.addLayer(marker)
        }
      })
    }

    // Add Labourers
    if (filters.labour) {
      labourers.forEach((labour) => {
        const coords = labour.location?.coordinates
        // Mongoose 2dsphere stores as [lng, lat]
        if (coords && coords.length === 2 && coords[0] !== 0) {
          const marker = L.marker([coords[1], coords[0]], { icon: labourIcon })
          marker.bindPopup(`
            <div class="p-2 min-w-[200px]">
              <div class="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Daily Worker</div>
              <h3 class="font-sora font-bold text-lg leading-tight">${labour.name}</h3>
              <p class="text-sm text-gray-600 font-medium">${labour.skill}</p>
              <div class="mt-2 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded inline-block">₹${labour.dailyRate || 500}/day</div>
            </div>
          `)
          markerGroup.addLayer(marker)
        }
      })
    }

  }, [vendors, offers, labourers, filters])

  return (
    <div className={`relative ${fullScreen ? 'h-[calc(100vh-64px)] w-full' : 'h-full w-full rounded-2xl overflow-hidden'}`}>
      
      {/* Map Filter Overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <h4 className="font-sora font-bold text-sm text-slate-800">Map Filters</h4>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Store className="w-3.5 h-3.5" /></div>
              Vendors
            </div>
            <input type="checkbox" checked={filters.vendors} onChange={() => setFilters(f => ({...f, vendors: !f.vendors}))} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-rose-600 transition-colors">
              <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><Tag className="w-3.5 h-3.5" /></div>
              Offers
            </div>
            <input type="checkbox" checked={filters.offers} onChange={() => setFilters(f => ({...f, offers: !f.offers}))} className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300" />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-green-600 transition-colors">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><HardHat className="w-3.5 h-3.5" /></div>
              Labour
            </div>
            <input type="checkbox" checked={filters.labour} onChange={() => setFilters(f => ({...f, labour: !f.labour}))} className="w-4 h-4 rounded text-green-600 focus:ring-green-500 border-gray-300" />
          </label>
        </div>
      </div>

      <div 
        ref={mapContainerRef} 
        style={{ height: '100%', width: '100%', backgroundColor: '#f8fafc', zIndex: 0 }}
      />
      
      {/* Global styles for the custom markers to override leaflet defaults */}
      <style jsx global>{`
        .custom-map-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  )
}