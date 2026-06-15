"use client";
import { useState } from "react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Gaya City, Bodh Gaya, Manpur…");

  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      {/* Realistic Background Image with Vibrant Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=2069" 
          alt="Professional electrician at work" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-teal-900/80"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-5">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 mb-6 border border-white/20">
          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5.24 2 3 4.24 3 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="white" />
            </svg>
          </div>
          <span className="text-sm text-indigo-200">Serving Gaya &amp; Bodh Gaya district, Bihar</span>
        </div>

        <h1 className="font-sora text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Every local service<br />
          in <span className="text-teal-300">Gaya district</span><br />
          <span className="text-indigo-300">at your fingertips</span>
        </h1>

        <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto mt-4 mb-8">
          Find verified electricians, plumbers, mechanics, hotels, daily workers and more — all in one trusted local platform.
        </p>

        {/* Search bar */}
        <div className="bg-white rounded-xl p-1.5 flex flex-col md:flex-row gap-1 max-w-2xl mx-auto shadow-2xl">
          <div className="flex-1 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2"/></svg>
            <div className="text-left w-full">
              <div className="text-[10px] font-semibold text-gray-400 uppercase">What do you need?</div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Electrician, Plumber, AC repair…"
                className="w-full text-sm outline-none text-slate-900"
              />
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2"/></svg>
            <div className="text-left w-full">
              <div className="text-[10px] font-semibold text-gray-400 uppercase">Area / Locality</div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm outline-none text-slate-900"
              />
            </div>
          </div>
          <button className="bg-indigo-600 text-white font-semibold rounded-lg py-3 px-6 flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2.5"/><path d="m21 21-4.35-4.35" strokeWidth="2.5"/></svg>
            Search
          </button>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {["⚡ Electrician", "🔧 Plumber", "🏍️ Bike repair", "❄️ AC repair", "🏨 Hotels", "🪚 Carpenter", "🎨 Painter", "👷 Daily labour"].map((item) => (
            <span key={item} className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-sm text-gray-200 hover:bg-white/20 cursor-pointer transition">
              {item}
            </span>
          ))}
        </div>
      </div>
      {/* Wave bottom */}
      <svg className="w-full h-12 mt-10" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0 40 C360 70 1080 10 1440 40 L1440 60 L0 60Z" fill="#F8F9FC" />
      </svg>
    </section>
  );
}