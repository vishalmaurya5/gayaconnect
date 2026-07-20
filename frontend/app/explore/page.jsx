'use client'

import { useState } from "react";
import { FiX, FiArrowRight, FiMapPin, FiGrid, FiArrowLeft, FiMap, FiGlobe } from "react-icons/fi";
import { Landmark, Mountain, Trees, ShoppingBag, GraduationCap, Building2, Map } from "lucide-react";
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

const CategoryIcon = ({ category, className }) => {
  switch (category) {
    case 'temples':
    case 'mosques':
      return <Landmark className={className} />;
    case 'historical':
      return <Building2 className={className} />;
    case 'colleges':
      return <GraduationCap className={className} />;
    case 'hills':
      return <Mountain className={className} />;
    case 'parks':
      return <Trees className={className} />;
    case 'malls':
      return <ShoppingBag className={className} />;
    default:
      return <Map className={className} />;
  }
};

const indiaCities = [
  { id: 'gaya', name: 'Gaya', state: 'Bihar', active: true, desc: 'The land of enlightenment, salvation, and rich cultural heritage.' },
  { id: 'patna', name: 'Patna', state: 'Bihar', active: false, desc: 'The ancient city of Pataliputra, now a bustling metropolis.' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', active: false, desc: 'The spiritual capital of India, situated on the banks of the Ganges.' },
  { id: 'delhi', name: 'New Delhi', state: 'Delhi', active: false, desc: 'The vibrant capital city blending history with modern infrastructure.' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', active: false, desc: 'The city of dreams and the financial powerhouse of India.' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', active: false, desc: 'The Silicon Valley of India, known for its parks and IT.' },
  { id: 'newada', name: 'Nawada', state: 'Bihar', active: false, desc: 'Known for Kakolat Waterfall and rich spiritual history.' }
];

export default function ExplorePage() {
  // null means showing the India City Grid. 'gaya' means showing Gaya UI.
  const [selectedCity, setSelectedCity] = useState(null);
  
  const [activeRegion, setActiveRegion] = useState("gaya");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Select data source based on region (only applicable when selectedCity === 'gaya')
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
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 pt-12 md:pt-20">
        
        {/* =========================================
            VIEW 1: INDIA CITY EXPLORER GRID 
           ========================================= */}
        {!selectedCity && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-4 shadow-sm">
                <FiGlobe className="animate-spin-slow" /> Discover India
              </div>
              <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-[800] text-slate-900 tracking-tight leading-tight mb-6">
                Explore the Beauty of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-indigo-600 to-green-600">Incredible India</span>
              </h1>
              <p className="text-slate-500 text-[16px] md:text-[18px] leading-relaxed">
                Your ultimate digital directory to discover heritage sites, local businesses, and premium services across the greatest cities in India.
              </p>
            </div>

            {/* City Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {indiaCities.map((city) => (
                <div 
                  key={city.id}
                  onClick={() => city.active ? setSelectedCity(city.id) : null}
                  className={`relative p-8 rounded-[32px] border ${city.active ? 'bg-white border-indigo-100 hover:shadow-2xl hover:-translate-y-2 cursor-pointer shadow-xl' : 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'} transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[280px]`}
                >
                  {/* Active Gradient Glow */}
                  {city.active && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>}
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${city.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                        <FiMapPin className="w-6 h-6" />
                      </div>
                      {!city.active && (
                        <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Coming Soon
                        </span>
                      )}
                      {city.active && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                          Active Now
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-sora text-3xl font-[800] text-slate-900 mb-1">{city.name}</h3>
                    <p className="text-indigo-600 font-bold text-[14px] uppercase tracking-wider mb-4">{city.state}</p>
                    <p className="text-slate-500 text-[15px] leading-relaxed line-clamp-3">
                      {city.desc}
                    </p>
                  </div>

                  {city.active && (
                    <div className="mt-8 flex items-center text-indigo-600 font-bold text-[14px] group-hover:gap-2 transition-all">
                      Explore City <FiArrowRight className="ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            VIEW 2: GAYA CITY EXPLORER (Current UI)
           ========================================= */}
        {selectedCity === 'gaya' && (
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-500">
            
            {/* Back Button */}
            <button 
              onClick={() => setSelectedCity(null)}
              className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-[14px] rounded-full shadow-sm transition-all hover:-translate-x-1"
            >
              <FiArrowLeft /> Back to All Cities
            </button>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filteredPlaces.map((place) => (
                  <div 
                    key={place.id} 
                    className="bg-white border border-slate-200 shadow-lg shadow-slate-200/40 rounded-3xl overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col relative group"
                  >
                    {/* Top Section: Image & Category */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img 
                        src={place.image || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"} 
                        alt={place.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {place.category}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      {/* Title & Desc */}
                      <h4 className="text-slate-900 font-extrabold text-lg font-sora leading-tight mb-2">
                        {place.title}
                      </h4>
                      <p className="text-slate-500 text-[13px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        {place.desc}
                      </p>

                      {/* Address & Links Directly on Card */}
                      <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                        
                        {/* Address */}
                        <div className="flex items-start gap-2">
                          <FiMapPin className="text-indigo-500 mt-0.5 shrink-0" size={14} />
                          <span className="text-slate-600 text-[12px] font-medium leading-snug">
                            {place.location}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + place.location)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-2 rounded-lg transition-colors text-[12px]"
                          >
                            <FiMap size={14} /> Maps
                          </a>
                          {place.link && (
                            <a 
                              href={place.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-lg transition-colors text-[12px]"
                            >
                              <FiGlobe size={14} /> Wiki
                            </a>
                          )}
                        </div>

                        {/* Read More Toggle */}
                        <button 
                          onClick={() => setSelectedPlace(place)}
                          className="w-full text-center mt-1 text-slate-500 hover:text-indigo-600 font-bold text-[12px] transition-colors"
                        >
                          Read Historical Details
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 max-w-2xl mx-auto shadow-sm">
                <FiGrid className="mx-auto text-4xl text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No places found</h3>
                <p className="text-slate-500">We are adding more places to this category soon.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Place Details Modal (Clean, Text-Only View) */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPlace(null)}>
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative transform transition-all animate-in fade-in zoom-in duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-6 right-6 z-20 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="p-8 sm:p-12">
              {/* Image in Modal */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-inner">
                <img 
                  src={selectedPlace.image || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"} 
                  alt={selectedPlace.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border border-slate-200">
                    <FiMapPin size={10}/> {selectedPlace.location}
                  </div>
                  <h3 className="text-slate-900 font-extrabold text-3xl sm:text-4xl font-sora leading-tight tracking-tight">
                    {selectedPlace.title}
                  </h3>
                </div>
                
                <div className="flex gap-2">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.title + ' ' + selectedPlace.location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl transition-colors text-[13px]"
                  >
                    <FiMap /> Google Maps
                  </a>
                </div>
              </div>

              <div className="prose prose-slate max-w-none mt-8">
                <p className="text-indigo-600 text-[16px] sm:text-[18px] leading-relaxed font-semibold mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  {selectedPlace.desc}
                </p>
                <div className="w-12 h-1 bg-slate-200 rounded-full mb-6"></div>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mb-8 whitespace-pre-line">
                  {selectedPlace.longDesc}
                </p>
              </div>
              
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button onClick={() => setSelectedPlace(null)} className="w-full sm:w-auto text-slate-700 font-bold text-[14px] px-8 py-3.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
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
