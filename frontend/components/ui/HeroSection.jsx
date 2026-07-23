"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MapPin, Search, ArrowRight, ShieldCheck, 
  Users, BarChart3, Grid, Star, Wrench, Store, 
  CheckCircle2, TrendingUp, Zap, Sparkles, Compass
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FaWhatsapp } from 'react-icons/fa';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const { openSubscriptionModal } = useAuth();
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('area', location);
    if (category && category !== 'jobs' && category !== 'rentals') params.set('category', category);
    
    let route = '/vendors';
    if (category === 'jobs' || category === 'rentals') {
      route = '/jobs-and-sales';
      if (category === 'jobs') params.set('type', 'job');
      if (category === 'rentals') params.set('type', 'sale');
    } else if (category === 'professionals') {
      route = '/labour';
      params.delete('category');
    }

    router.push(`${route}?${params.toString()}`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFC] flex items-center pt-6 sm:pt-8 lg:pt-10 pb-10 border-b border-slate-200/60 font-inter">
      
      {/* Precision Background Grid & Glows - SaaS Style */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none flex justify-center">
        {/* Fine grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZTJlNThjIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHoiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] mask-image:linear-gradient(to_bottom,white,transparent)" />
        
        {/* Precise structural glows */}
        <div className="absolute -top-[20%] left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[10%] right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-4">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md rounded-full px-4 py-1.5 border border-slate-200/60 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-700 tracking-wide">Premium Global Digital Platform</span>
              </motion.div>

              {/* HIGHLIGHTED COMPACT EXPLORE CITY BUTTON */}
              <motion.div variants={fadeUp}>
                <Link 
                  href="/explore" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 transition-all duration-300 border border-amber-300/80 group"
                >
                  <span className="animate-pulse text-sm">🏞️</span>
                  <span>Explore City & Famous Places</span>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View &rarr;
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Heading */}
            <motion.h1 
              variants={fadeUp}
              className="font-extrabold text-[38px] sm:text-[48px] lg:text-[58px] text-slate-900 leading-[1.05] tracking-tight w-full max-w-3xl font-sora"
            >
              One Platform. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500">
                Unlimited Services.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed font-medium"
            >
              Discover verified businesses, skilled professionals, trusted workforce, jobs and services through one intelligent digital platform built for individuals, businesses and communities.
            </motion.p>

            {/* Advanced Search Bar (SaaS Interface) */}
            <motion.div 
              variants={fadeUp}
              className="mt-6 w-full max-w-[800px] bg-white rounded-2xl border border-slate-200/80 p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex-1 w-full px-4 py-2.5 flex items-center gap-3 bg-slate-50/50 rounded-xl group focus-within:bg-indigo-50/30 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <div className="w-full text-left">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search businesses, jobs, services..."
                    className="w-full text-[15px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-medium bg-transparent"
                  />
                </div>
              </div>

              <div className="w-full md:w-[180px] px-4 py-2.5 flex items-center gap-3 bg-slate-50/50 rounded-xl group focus-within:bg-indigo-50/30 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                <Grid className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <div className="w-full text-left relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-[14px] font-semibold text-slate-900 outline-none bg-transparent cursor-pointer appearance-none"
                  >
                    <option value="">All Categories</option>
                    <option value="businesses">Businesses</option>
                    <option value="professionals">Professionals</option>
                    <option value="jobs">Jobs</option>
                    <option value="rentals">Rentals</option>
                  </select>
                </div>
              </div>
              
              <div className="w-full md:w-[160px] px-4 py-2.5 flex items-center gap-3 bg-slate-50/50 rounded-xl group focus-within:bg-indigo-50/30 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <div className="w-full text-left">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location (Optional)"
                    className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
                  />
                </div>
              </div>

              <button onClick={handleSearch} className="w-full md:w-auto md:px-8 h-12 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">
                Search
              </button>
            </motion.div>

            {/* Trending / Tags */}
            <motion.div 
              variants={fadeUp}
              className="mt-4 w-full max-w-3xl flex flex-wrap justify-center lg:justify-start items-center gap-2"
            >
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:block">Trending</span>
              
              <Link href="/explore" className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-full text-[13px] hover:shadow-md transition-all flex items-center gap-1 border border-amber-300">
                🏞️ Famous Attractions
              </Link>

              {["Electrician", "Plumber", "AC Repair", "Workforce", "Cleaning"].map((item) => (
                <Link href="/services" key={item} className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-[13px] font-medium text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm">
                  {item}
                </Link>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={fadeUp} className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full max-w-full sm:flex-nowrap">
              <Link href="/explore" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-4 sm:px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all text-xs sm:text-sm whitespace-nowrap shrink-0">
                <Compass className="w-4 h-4 text-slate-950 shrink-0" />
                Explore City & Tourism
              </Link>

              <Link href="/services" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-black px-4 sm:px-5 py-3 rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-0.5 transition-all text-xs sm:text-sm whitespace-nowrap shrink-0">
                Explore Services
              </Link>
              
              <Link href="/register-vendor" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 font-black px-4 sm:px-5 py-3 rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-xs sm:text-sm whitespace-nowrap shrink-0">
                Register Business
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-[460px] aspect-[4/4.2] mx-auto">
              
              {/* Premium Image Container */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/10 border border-slate-200/50 bg-white z-20">
                <Image 
                  src="/images/gaya_seva_hero_banner.png" 
                  alt="Gaya Seva Professionals" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                
                {/* Floating UI Element */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">Verified Ecosystem</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">Explore City & Local Services</p>
                    </div>
                    <Link href="/explore" className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition">
                      Explore &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
