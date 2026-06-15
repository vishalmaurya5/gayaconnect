'use client'

import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default icon path issues
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

export default function MapView() {
  const [vendors, setVendors] = useState([])
  const [userLocation, setUserLocation] = useState([24.792, 85.014]) // Gaya coordinates
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)

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

    // Fetch vendors
    const fetchVendors = async () => {
      try {
        const res = await fetch('/api/vendors?limit=50')
        const data = await res.json()
        setVendors(data.vendors || [])
      } catch (error) {
        console.error('Error fetching vendors:', error)
      }
    }
    
    fetchVendors()
  }, [])

  // Initialize Map Manually (Bypassing all react-leaflet bugs)
  useEffect(() => {
    if (!mapContainerRef.current) return

    // If map is not initialized yet, initialize it
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: userLocation,
        zoom: 13,
        scrollWheelZoom: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      mapRef.current = map
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // Empty dependency array ensures it only mounts once

  // Update Markers when vendors change
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    // Clear existing markers (we iterate through map layers and remove markers)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Add new markers
    vendors.forEach((vendor) => {
      if (vendor.location?.lat && vendor.location?.lng) {
        const marker = L.marker([vendor.location.lat, vendor.location.lng]).addTo(map)
        
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-bold text-lg">${vendor.businessName || vendor.name}</h3>
            <p class="text-sm text-gray-600">${vendor.category?.name || vendor.category || 'Service'}</p>
            <p class="text-xs text-gray-500 mt-1">${vendor.address?.street || vendor.address}</p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${vendor.location.lat},${vendor.location.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
              style="text-decoration: none;"
            >
              Get Directions
            </a>
          </div>
        `
        marker.bindPopup(popupContent)
      }
    })
  }, [vendors])

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', backgroundColor: '#f3f4f6' }}
    />
  )
}