'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMapPin, FiCompass, FiArrowRight, FiExternalLink, FiNavigation } from 'react-icons/fi';

export default function ExploreCitySection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbPlaces, setDbPlaces] = useState([]);

  // Default fallback 4 iconic places
  const defaultTop4Places = [
    {
      id: "mahabodhi-temple",
      title: "Mahabodhi Temple",
      category: "temples",
      desc: "UNESCO World Heritage Site where Lord Buddha attained enlightenment under the sacred Bodhi Tree.",
      image: "/images/gaya/mahabodhi.png",
      location: "Bodh Gaya",
      city: "Gaya District"
    },
    {
      id: "kakolat-waterfall",
      title: "Kakolat Waterfall",
      category: "hills",
      desc: "Breathtaking 160-foot natural cascading cold waterfall surrounded by lush green hills.",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      location: "Govindpur, Nawada",
      city: "Nawada District"
    },
    {
      id: "vishnupad-temple",
      title: "Vishnupad Temple",
      category: "temples",
      desc: "Ancient Hindu pilgrimage center on the banks of Falgu River famous for Pitrapaksha Pind Daan.",
      image: "/images/gaya/vishnupad.png",
      location: "Gaya City",
      city: "Gaya District"
    },
    {
      id: "gunawa-jain-temple",
      title: "Gunawa Jain Temple",
      category: "historical",
      desc: "Sacred ancient Jain pilgrimage site where disciple Indrabhuti Gautama attained Kevala Jnana.",
      image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80",
      location: "Gunawa, Nawada",
      city: "Nawada District"
    }
  ];

  useEffect(() => {
    async function loadExploreData() {
      try {
        const res = await fetch('/api/explore/public');
        const data = await res.json();
        if (data.success && data.places && data.places.length > 0) {
          const featured = data.places.filter(p => p.isFeaturedHomepage);
          if (featured.length > 0) {
            setDbPlaces(featured.slice(0, 4));
          } else {
            setDbPlaces(data.places.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load homepage explore places:', err);
      }
    }
    loadExploreData();
  }, []);

  const categories = [
    { id: 'all', label: 'All Famous Spots' },
    { id: 'temples', label: 'Temples & Shrines' },
    { id: 'historical', label: 'Heritage & Tourism' },
    { id: 'hills', label: 'Hills & Waterfalls' },
  ];

  const displayPlaces = dbPlaces.length > 0 ? dbPlaces : defaultTop4Places;

  const featuredPlaces = activeCategory === 'all' 
    ? displayPlaces
    : displayPlaces.filter(p => p.category === activeCategory);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50 relative overflow-hidden font-inter border-y border-slate-200/60">
      
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-800 font-black text-[11px] uppercase tracking-widest rounded-full mb-3">
              <FiCompass className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              Live Managed Tourism CMS
            </div>
            <h2 className="font-sora text-3xl md:text-5xl font-[800] text-slate-900 tracking-tight leading-tight">
              Explore Famous City <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600">
                Attractions & Heritage
              </span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-2 max-w-xl font-medium">
              Discover UNESCO world heritage sites, Kakolat waterfall, ancient temples, and famous tourist spots with live Google Maps navigation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/explore" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm px-6 py-3.5 rounded-full shadow-lg shadow-amber-600/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Full City Directory <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 custom-scrollbar mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Places Card Grid - EXACTLY 4 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlaces.map(place => {
            const googleMapsSearchUrl = place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + place.location)}`;

            return (
              <div 
                key={place._id || place.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative"
              >
                {/* Real Image Banner */}
                <div className="h-56 w-full relative overflow-hidden bg-slate-900">
                  <img 
                    src={place.image} 
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                  
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                    {place.city || place.cityId}
                  </span>

                  <a 
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 px-2.5 py-1 bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-md text-white text-[10px] font-black rounded-full shadow-md flex items-center gap-1 transition"
                    title="View Live Google Maps Photos & Directions"
                  >
                    <FiNavigation className="w-3 h-3 text-amber-300" /> Google Maps
                  </a>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-black font-sora drop-shadow-md leading-tight">{place.title}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold mt-1">
                      <FiMapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{place.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description & Links */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-medium">
                    {place.desc}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={googleMapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100 transition"
                    >
                      <FiExternalLink className="w-3 h-3" /> Live Maps
                    </a>

                    <Link 
                      href="/explore" 
                      className="text-amber-600 hover:text-amber-700 font-black text-[11px] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Full Directory <FiArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Google Maps Banner Card */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2 text-center sm:text-left z-10">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest rounded-full">
              LIVE GOOGLE MAPS DIRECTORY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-sora">Visiting Mahabodhi or Kakolat Waterfall?</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Get live Google Maps satellite photos, temple timing schedules, route directions, waterpark ticket prices, and local travel guides.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Famous+Places+in+Gaya+and+Nawada+Bihar"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm px-6 py-4 rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <FiNavigation className="w-4 h-4 text-amber-300" /> Open Google Maps
            </a>

            <Link 
              href="/explore" 
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-4 rounded-2xl shadow-xl transition-all whitespace-nowrap"
            >
              Explore All Cities &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
