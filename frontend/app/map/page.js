import MapClientWrapper from '@/components/ui/MapClientWrapper'

export const metadata = {
  title: 'Explore Gaya on Map | Gaya Seva',
  description: 'Find nearby vendors, local offers, and daily workers in Gaya, Bihar using our interactive map.',
}

export default function MapPage() {
  return (
    <div className="flex flex-col bg-slate-50">
      
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 relative z-10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-sora font-bold text-slate-900">Explore Nearby</h1>
            <p className="text-sm text-slate-500">Find services, offers, and labour around you.</p>
          </div>
          
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-xs font-medium text-slate-600">Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-600"></div>
              <span className="text-xs font-medium text-slate-600">Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-xs font-medium text-slate-600">Labour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <main className="flex-1 relative z-0">
        <MapClientWrapper />
      </main>

    </div>
  )
}
