'use client'

import dynamic from 'next/dynamic'

// Dynamically import MapView to prevent SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/ui/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )
})

export default function MapClientWrapper() {
  return <MapView fullScreen={true} />
}
