"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MapPin, Search, ArrowRight, ShieldCheck, 
  Users, BarChart3, Grid, Star, Wrench, Store, 
  CheckCircle2, TrendingUp, Zap, Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { FaWhatsapp } from 'react-icons/fa';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const { openSubscriptionModal } = useAuth();
  const router = useRouter();

  const handleSearch = () => {
    router.push('/vendors');
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[80vh] flex items-center pt-24 pb-16 lg:pt-20">
      
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-teal-50/80 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-50/80 blur-[100px]" />
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)" />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10 w-full mt-4 lg:mt-0">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* LEFT COLUMN - 70% */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            
            {/* Top Badge */}
            <motion.div 
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-200 shadow-sm mb-4 hover:shadow-md transition-shadow cursor-default"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px] font-semibold text-slate-800 tracking-tight">Gaya's #1 Local Services Platform</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              variants={fadeUp}
              className="font-sora font-[800] text-[36px] md:text-[48px] lg:text-[62px] text-[#0F172A] leading-[1.1] tracking-tight w-full max-w-3xl"
            >
              Your City. Your Experts. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500">
                One Platform.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={fadeUp}
              className="mt-3 font-inter text-[16px] lg:text-[18px] text-slate-600 max-w-[600px] leading-relaxed"
            >
              Connecting Gaya's finest professionals with the people who need them. Whether you're looking for <strong className="text-slate-900 font-semibold">instant reliable help</strong> or ready to <strong className="text-indigo-600 font-semibold">skyrocket your business growth</strong>.
            </motion.p>

            {/* Floating Search Card */}
            <motion.div 
              variants={fadeUp}
              className="mt-5 w-full max-w-[850px] bg-white rounded-[16px] border border-slate-100 p-1.5 flex flex-col md:flex-row items-stretch gap-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]"
            >
              <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3 bg-slate-50/50 md:bg-transparent rounded-xl md:rounded-none">
                <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-500 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">What are you looking for?</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Electrician, Plumber"
                    className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1 w-full px-4 py-2 flex items-center gap-3 bg-slate-50/50 md:bg-transparent rounded-xl md:rounded-none">
                <div className="bg-teal-50 p-1.5 rounded-lg text-teal-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Gaya City, Bodh Gaya..."
                    className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
                  />
                </div>
              </div>

              <button onClick={handleSearch} className="w-full md:w-auto h-[46px] md:h-auto bg-[#0F172A] text-white font-bold rounded-[12px] px-8 py-2 flex items-center justify-center gap-2 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 mt-1.5 md:mt-0 duration-300">
                <Search className="w-4 h-4" />
                Search
              </button>
            </motion.div>

            {/* Popular Searches */}
            <motion.div 
              variants={fadeUp}
              className="mt-4 w-full max-w-[700px] flex flex-wrap justify-center lg:justify-start items-center gap-2.5"
            >
              <span className="text-[12px] font-semibold text-slate-500 mr-1 hidden sm:inline-block">Trending:</span>
              {[
                { icon: "⚡", label: "Electrician" },
                { icon: "🔧", label: "Plumber" },
                { icon: "❄️", label: "AC Repair" },
                { icon: "👷", label: "Local Workforce" },
                { icon: "🪚", label: "Carpenter" },
                { icon: "🎨", label: "Painter" },
                { icon: "🧹", label: "Cleaning" }
              ].map((item) => (
                <Link href="/services" key={item.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[12px] font-semibold text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="text-[13px]">{item.icon}</span> {item.label}
                </Link>
              ))}
            </motion.div>

            {/* Map Link */}
            <motion.div variants={fadeUp} className="mt-8 flex w-full justify-center lg:justify-start">
              <Link href="/map" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-teal-50 text-indigo-700 font-bold px-6 py-3 rounded-full border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                Explore Interactive Map
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </motion.div>

          {/* RIGHT COLUMN - 30% */}
          <div className="lg:col-span-5 relative flex justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-[500px] aspect-[4/5] mx-auto group">
              {/* Decorative Blur */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse"></div>
              
              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[36px] overflow-hidden shadow-2xl border-[4px] border-white z-20">
                <img 
                  src="/images/gaya_seva_hero_banner.png" 
                  alt="Gaya Seva Professionals" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Glassmorphism Floating Card Over Image */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/images/gaya_seva_logo.png" 
                        alt="Gaya Seva Logo" 
                        className="w-12 h-12 rounded-full border-2 border-white shadow-lg bg-white object-cover" 
                      />
                      <div>
                        <h4 className="text-white font-bold text-[16px] flex items-center gap-1.5">
                          Verified Experts <ShieldCheck className="w-4 h-4 text-teal-400" />
                        </h4>
                        <p className="text-white/90 text-[13px] font-medium">Ready to serve Gaya</p>
                      </div>
                    </div>
                    <div className="bg-white/20 px-2 py-1 rounded-md flex items-center justify-center">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                  <Link href="/register-vendor" className="w-full bg-white text-indigo-700 font-bold rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg">
                    Join as Professional <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Floating Element: Trust Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -right-4 top-10 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 z-30 flex items-center gap-3 animate-bounce"
                style={{ animationDuration: '4s' }}
              >
                <div className="bg-amber-100 p-2 rounded-xl">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div className="pr-2">
                  <div className="text-[13px] font-extrabold text-slate-800">4.9/5 Rating</div>
                  <div className="text-[10px] font-semibold text-slate-500">Trusted by Locals</div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-50">
        <a href="https://wa.me/918544491413" target="_blank" rel="noreferrer" className="w-[52px] h-[52px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer" title="Chat on WhatsApp">
           <FaWhatsapp size={28} />
        </a>
      </div>
      
      <div className="fixed bottom-6 right-6 z-50">
        <a href="tel:+919117588242" className="w-[52px] h-[52px] bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer" title="Call Us">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
      </div>
    </section>
  );
}
