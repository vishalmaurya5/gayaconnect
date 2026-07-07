'use client'

import { useState } from "react";
import { FiX, FiArrowRight, FiMapPin, FiGrid } from "react-icons/fi";
import { gayaPlaces } from "@/lib/data/gayaPlaces";
import { nearbyPlaces } from "@/lib/data/nearbyPlaces";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Places" },
  { id: "temples", label: "Temples" },
  { id: "mosques", label: "Mosques" },
  { id: "historical", label: "Historical & Tourism" },
  { id: "colleges", label: "Colleges & Univ." },
  { id: "hills", label: "Hills & Rivers" },
  { id: "parks", label: "Parks" },
  { id: "malls", label: "Malls & Shopping" },
];

export default function ExploreGayaPage() {
  const [activeRegion, setActiveRegion] = useState("gaya");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Select data source based on region
  const activeData = activeRegion === "gaya" ? gayaPlaces : nearbyPlaces;

  // Filter places based on active category
  const filteredPlaces = activeCategory === "all" 
    ? activeData 
    : activeData.filter(place => place.category === activeCategory);

  return (
    <div className="bg-[#F8F9FC] min-h-screen relative font-inter pb-24">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.2]"></div>
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 pt-12 md:pt-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-4 shadow-sm">
            <FiMapPin /> {activeRegion === "gaya" ? "Gaya District Guide" : "Magadha Region Guide"}
          </div>
          <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-[800] text-slate-900 tracking-tight leading-tight mb-6">
            Explore the Soul of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-600">{activeRegion === "gaya" ? "Gaya Ji" : "Magadha"}</span>
          </h1>
          <p className="text-slate-500 text-[16px] md:text-[18px] leading-relaxed">
            {activeRegion === "gaya" 
              ? "Discover the most famous temples, historical mosques, sacred hills, serene parks, and modern shopping destinations across the holy city and its surroundings."
              : "Discover the ancient ruins, spiritual hotspots, and breathtaking natural wonders in the neighboring districts of Nalanda, Rajgir, and Nawada."}
          </p>
        </div>

        {/* Region Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm inline-flex">
            <button
              onClick={() => { setActiveRegion("gaya"); setActiveCategory("all"); }}
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${
                activeRegion === "gaya"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Explore Gaya Ji
            </button>
            <button
              onClick={() => { setActiveRegion("nearby"); setActiveCategory("all"); }}
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${
                activeRegion === "nearby"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Explore Nearby (Magadha)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-[14px] font-bold transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 hover:text-indigo-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPlaces.map((place) => (
              <div 
                key={place.id} 
                onClick={() => setSelectedPlace(place)}
                className="cursor-pointer bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 group flex flex-col relative"
              >
                <div className="h-56 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"></div>
                  <img 
                    src={place.image} 
                    alt={place.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/gaya/mahabodhi.png'; // Reliable local fallback
                    }}
                  />
                  <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    {place.category}
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 z-20">
                    <h4 className="text-white font-extrabold text-[20px] font-sora drop-shadow-md leading-tight mb-1">{place.title}</h4>
                    <p className="text-slate-300 flex items-center gap-1 text-[12px] font-medium"><FiMapPin size={12}/> {place.location}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-slate-500 text-[14px] leading-relaxed mb-4">
                    {place.desc}
                  </p>
                  <div className="text-indigo-600 font-bold text-[13px] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
                    View full details <FiArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiGrid className="mx-auto text-4xl text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No places found</h3>
            <p className="text-slate-500">We are adding more places to this category soon.</p>
          </div>
        )}
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlace(null)}>
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform transition-all animate-in fade-in zoom-in duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="h-72 sm:h-96 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10"></div>
              <img 
                src={selectedPlace.image} 
                alt={selectedPlace.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/gaya/mahabodhi.png'; // Reliable local fallback
                }}
              />
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/80 backdrop-blur text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
                  <FiMapPin size={12}/> {selectedPlace.location}
                </div>
                <h3 className="text-white font-extrabold text-4xl sm:text-5xl font-sora drop-shadow-md leading-tight">
                  {selectedPlace.title}
                </h3>
              </div>
            </div>
            
            <div className="p-8 sm:p-10 bg-white">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-[16px] sm:text-[18px] leading-relaxed font-medium mb-6">
                  {selectedPlace.desc}
                </p>
                <div className="w-16 h-1 bg-indigo-100 rounded-full mb-6"></div>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mb-8 whitespace-pre-line">
                  {selectedPlace.longDesc}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.title + ' ' + selectedPlace.location)}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-6 py-3.5 rounded-xl transition-colors text-[14px]">
                    <FiMapPin /> View on Map
                  </a>
                  {selectedPlace.link && (
                    <a href={selectedPlace.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-6 py-3.5 rounded-xl transition-colors text-[14px]">
                      Read Wikipedia Article <FiArrowRight />
                    </a>
                  )}
                </div>
                
                <button onClick={() => setSelectedPlace(null)} className="w-full sm:w-auto text-slate-500 hover:text-slate-800 font-bold text-[14px] px-6 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
