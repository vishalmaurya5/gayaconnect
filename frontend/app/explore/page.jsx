'use client'

import { useState, useEffect, useMemo } from "react";
import { FiX, FiArrowRight, FiMapPin, FiGrid, FiArrowLeft, FiMap, FiGlobe, FiNavigation, FiSearch, FiCompass } from "react-icons/fi";
import { Landmark, Mountain, Trees, ShoppingBag, GraduationCap, Building2, Map } from "lucide-react";
import { gayaPlaces } from "@/lib/data/gayaPlaces";
import { nearbyPlaces } from "@/lib/data/nearbyPlaces";
import { nawadaPlaces } from "@/lib/data/nawadaPlaces";
import { nawadaNearbyPlaces } from "@/lib/data/nawadaNearbyPlaces";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Places" },
  { id: "temples", label: "Temples & Shrines" },
  { id: "historical", label: "Historical & Heritage" },
  { id: "hills", label: "Hills & Waterfalls" },
  { id: "malls", label: "Malls & Bazaars" },
];

const defaultIndiaCities = [
  { id: 'gaya', name: 'Gaya', state: 'Bihar', active: true, desc: 'The land of enlightenment, salvation, and rich cultural heritage.' },
  { id: 'newada', name: 'Nawada (Newada)', state: 'Bihar', active: true, desc: 'Home of the famous Kakolat Waterfall, Gunawa Temple & Rajauli Hills.' },
  { id: 'patna', name: 'Patna', state: 'Bihar', active: false, desc: 'The ancient city of Pataliputra, now a bustling metropolis.' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', active: false, desc: 'The spiritual capital of India, situated on the banks of the Ganges.' },
  { id: 'delhi', name: 'New Delhi', state: 'Delhi', active: false, desc: 'The vibrant capital city blending history with modern infrastructure.' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', active: false, desc: 'The city of dreams and the financial powerhouse of India.' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', active: false, desc: 'The Silicon Valley of India, known for its parks and IT.' }
];

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState('gaya');
  const [activeRegion, setActiveRegion] = useState("city"); 
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Live DB States
  const [dbCities, setDbCities] = useState([]);
  const [dbPlaces, setDbPlaces] = useState([]);

  useEffect(() => {
    async function loadLiveExploreData() {
      try {
        const res = await fetch('/api/explore/public');
        const data = await res.json();
        if (data.success) {
          if (data.cities && data.cities.length > 0) setDbCities(data.cities);
          if (data.places && data.places.length > 0) setDbPlaces(data.places);
        }
      } catch (err) {
        console.error('Error fetching live explore data:', err);
      }
    }
    loadLiveExploreData();
  }, []);

  const citiesList = dbCities.length > 0 
    ? dbCities.map(c => ({ id: c.cityId, name: c.name, state: c.state, active: c.isActive, desc: c.desc }))
    : defaultIndiaCities;

  // Determine active dataset
  const activeData = useMemo(() => {
    if (dbPlaces.length > 0) {
      const cityFiltered = dbPlaces.filter(p => p.cityId === selectedCity && (p.region || 'city') === activeRegion);
      if (cityFiltered.length > 0) return cityFiltered;
    }

    if (selectedCity === 'newada') {
      return activeRegion === "city" ? nawadaPlaces : nawadaNearbyPlaces;
    }
    return activeRegion === "city" ? gayaPlaces : nearbyPlaces;
  }, [selectedCity, activeRegion, dbPlaces]);

  // Counts for tabs
  const cityCount = useMemo(() => {
    if (dbPlaces.length > 0) {
      return dbPlaces.filter(p => p.cityId === selectedCity && (p.region || 'city') === 'city').length;
    }
    return selectedCity === 'newada' ? nawadaPlaces.length : gayaPlaces.length;
  }, [selectedCity, dbPlaces]);

  const nearbyCount = useMemo(() => {
    if (dbPlaces.length > 0) {
      return dbPlaces.filter(p => p.cityId === selectedCity && p.region === 'nearby').length;
    }
    return selectedCity === 'newada' ? nawadaNearbyPlaces.length : nearbyPlaces.length;
  }, [selectedCity, dbPlaces]);

  // Filter places based on active category & search query
  const filteredPlaces = useMemo(() => {
    return activeData.filter(place => {
      const matchesCategory = activeCategory === "all" || place.category === activeCategory;
      const matchesSearch = !searchQuery || 
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeData, activeCategory, searchQuery]);

  return (
    <div className="bg-[#F8F9FC] min-h-screen relative font-inter pb-24">
      {/* Background ambient decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.18]"></div>
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 md:pt-14">
        
        {/* =========================================
            VIEW 1: INDIA CITY EXPLORER GRID
           ========================================= */}
        {!selectedCity && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-200 text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 shadow-sm">
                <FiGlobe className="animate-spin-slow text-amber-500" /> Discover Incredible India
              </div>
              <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-[800] text-slate-900 tracking-tight leading-tight mb-6">
                Explore Famous Cities of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-indigo-600 to-emerald-600">Bihar & India</span>
              </h1>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                Select your city to explore famous places, tourist attractions, heritage sites, and local business hubs with live Google Maps navigation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {citiesList.map((city) => (
                <div 
                  key={city.id}
                  onClick={() => {
                    if (city.active) {
                      setSelectedCity(city.id);
                      setActiveRegion("city");
                      setActiveCategory('all');
                    }
                  }}
                  className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    city.active 
                      ? "bg-white border-indigo-200 shadow-xl shadow-indigo-100/50 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-400 cursor-pointer group" 
                      : "bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {city.active ? (
                    <span className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Directory
                    </span>
                  ) : (
                    <span className="absolute top-6 right-6 px-3 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Coming Soon
                    </span>
                  )}

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                      {city.name.charAt(0)}
                    </div>
                    <h3 className="font-sora text-2xl font-bold text-slate-900 mb-1">{city.name}</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">{city.state}</span>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{city.desc}</p>
                  </div>

                  {city.active && (
                    <div className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      Explore City & Nearby <FiArrowRight className="ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            VIEW 2: CITY EXPLORER UI (DYNAMIC CITIES)
           ========================================= */}
        {selectedCity && (
          <div className="animate-in fade-in duration-300">
            
            {/* Top Navigation Header & City Switcher */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <button 
                onClick={() => setSelectedCity(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition w-full md:w-auto justify-center"
              >
                <FiArrowLeft className="text-slate-500" /> All Cities
              </button>

              {/* Dynamic Active Cities Switcher Buttons */}
              <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 w-full md:w-auto justify-center overflow-x-auto">
                {citiesList.filter(c => c.active).map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCity(c.id); setActiveRegion("city"); setActiveCategory('all'); }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                      selectedCity === c.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>📍 {c.name}</span>
                  </button>
                ))}
              </div>

              {/* Verified Badge */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Google Maps Verified</span>
              </div>
            </div>

            {/* Hero Title Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/10 text-amber-800 border border-amber-500/30 rounded-full text-[11px] font-black uppercase tracking-widest mb-3">
                <FiCompass className="text-amber-600 animate-spin-slow" /> 
                {selectedCity === 'newada' ? 'Nawada (Newada) District Tourism' : 'Gaya Ji Spiritual Heritage'}
              </div>
              <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl font-[800] text-slate-900 tracking-tight leading-tight mb-3">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600">
                  {selectedCity === 'newada' 
                    ? (activeRegion === 'city' ? 'Famous Nawada Attractions' : 'Nearby Attractions Around Nawada') 
                    : (activeRegion === 'city' ? 'Gaya Ji Sacred Heritage' : 'Nearby Magadha Region Attractions')
                  }
                </span>
              </h1>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                {selectedCity === 'newada' 
                  ? 'Explore Kakolat Waterfall, Gunawa Jain Temple, Sekho Devra JP Ashram, Rajauli Hills, Pavapuri Jal Mandir, and Rajgir Glass Bridge.'
                  : 'Discover Mahabodhi Temple, Vishnupad Temple, Dungeshwari Caves, Phalgu River, and cultural spots.'
                }
              </p>
            </div>

            {/* SEGMENTED TAB SWITCHER */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-slate-200/90 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner flex items-center justify-between gap-1.5 border border-slate-300/60">
                
                <button
                  onClick={() => { setActiveRegion("city"); setActiveCategory('all'); }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2.5 ${
                    activeRegion === "city" 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-950/20 scale-[1.02]" 
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/50"
                  }`}
                >
                  <FiMapPin className={activeRegion === "city" ? "text-amber-400" : "text-slate-500"} />
                  <span className="truncate">
                    {selectedCity === 'newada' ? 'Nawada City & District' : 'Gaya City Places'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeRegion === "city" ? 'bg-amber-500 text-slate-950' : 'bg-slate-300 text-slate-700'}`}>
                    {cityCount}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveRegion("nearby"); setActiveCategory('all'); }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2.5 ${
                    activeRegion === "nearby" 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-950/20 scale-[1.02]" 
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/50"
                  }`}
                >
                  <FiCompass className={activeRegion === "nearby" ? "text-teal-400" : "text-slate-500"} />
                  <span className="truncate">
                    {selectedCity === 'newada' ? 'Nearby & Border Spots' : 'Magadha Region'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeRegion === "nearby" ? 'bg-teal-400 text-slate-950' : 'bg-slate-300 text-slate-700'}`}>
                    {nearbyCount}
                  </span>
                </button>

              </div>
            </div>

            {/* Interactive Search Bar & Category Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.g.target.value)}
                  placeholder={`Search ${selectedCity === 'newada' ? 'Nawada' : 'Gaya'} places...`}
                  className="w-full bg-white border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1">
                    <FiX />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? "bg-amber-600 text-white shadow-md"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Places Card Grid */}
            {filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaces.map((place) => {
                  const googleMapsSearchUrl = place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + place.location)}`;

                  return (
                    <div 
                      key={place._id || place.id} 
                      className="bg-white border border-slate-200/80 shadow-md hover:shadow-xl rounded-3xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative group"
                    >
                      {/* Place Image */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                        <img 
                          src={place.image || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"} 
                          alt={place.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                        
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                          {place.category}
                        </span>

                        <a 
                          href={googleMapsSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 transition"
                          title="Open Live Google Maps Location"
                        >
                          <FiNavigation className="w-3 h-3 text-amber-300" /> Google Maps
                        </a>
                      </div>

                      {/* Content Box */}
                      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                        <div>
                          <h4 className="text-slate-900 font-extrabold text-base font-sora leading-tight mb-2">
                            {place.title}
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-medium">
                            {place.desc}
                          </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold">
                            <FiMapPin className="text-amber-600 shrink-0" size={14} />
                            <span className="truncate">{place.location}</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <a 
                              href={googleMapsSearchUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold px-3 py-1.5 rounded-xl transition text-[11px]"
                            >
                              <FiMap size={13} /> Live Maps
                            </a>

                            <button 
                              onClick={() => setSelectedPlace(place)}
                              className="text-amber-700 hover:text-amber-800 font-extrabold text-[11px] transition"
                            >
                              Read Guide &rarr;
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-2xl mx-auto shadow-sm">
                <FiGrid className="mx-auto text-4xl text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No places found</h3>
                <p className="text-slate-500 text-xs">Try clearing your search query or switching categories.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlace(null)}>
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform transition-all animate-in fade-in zoom-in duration-300 font-sans" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="h-64 sm:h-80 w-full relative bg-slate-900">
              <img 
                src={selectedPlace.image || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"} 
                alt={selectedPlace.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-2">
                  {selectedPlace.category}
                </span>
                <h3 className="font-extrabold text-2xl sm:text-3xl font-sora drop-shadow-md">
                  {selectedPlace.title}
                </h3>
                <p className="text-xs text-amber-200 font-bold mt-1 flex items-center gap-1">
                  <FiMapPin /> {selectedPlace.location}
                </p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 bg-white">
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                {selectedPlace.longDesc || selectedPlace.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
                <a 
                  href={selectedPlace.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.title + ' ' + selectedPlace.location)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3 rounded-xl transition text-xs shadow-lg shadow-indigo-600/20"
                >
                  <FiNavigation /> Open Live Google Maps Route
                </a>
                
                <button onClick={() => setSelectedPlace(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs px-4 py-2">
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
