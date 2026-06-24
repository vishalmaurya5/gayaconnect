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
            <div className="relative w-full max-w-[460px] mx-auto">
              
              {/* Decorative background element behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-[36px] blur-2xl opacity-20 animate-pulse"></div>

              {/* Professional Vendor CTA Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative z-20"
                style={{ perspective: "1000px" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 border border-indigo-100">
                    <Store className="w-3.5 h-3.5" /> For Businesses
                  </div>
                  <div className="bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border border-green-200/50 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Now
                  </div>
                </div>
                
                <h3 className="font-sora font-[800] text-[26px] text-[#0F172A] leading-[1.2] mb-3">
                  Accelerate your business.
                </h3>
                
                <p className="text-[14px] text-slate-500 leading-relaxed mb-6 font-medium">
                  Join <strong className="text-indigo-600 font-bold">1,000+ local experts</strong> multiplying their daily bookings through Gaya Connect.
                </p>

                {/* Real-time Proof / Sample Card */}
                <div className="flex items-center gap-4 mb-6 p-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-[20px] border border-slate-200/60 shadow-sm">
                  <div className="relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=150&h=150" 
                      alt="Local Professional" 
                      className="w-14 h-14 rounded-full border-[3px] border-white shadow-md object-cover" 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 flex items-center gap-1">
                      Rajesh Kumar 
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </h4>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Electrician • Gaya City</p>
                    <div className="text-[11px] font-bold text-teal-600 mt-1 flex items-center gap-1 bg-teal-50 w-fit px-2 py-0.5 rounded-full border border-teal-100">
                      <TrendingUp className="w-3 h-3" /> +4 bookings today
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 mb-8">
                  <div className="flex items-center gap-3 text-[14px] font-semibold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                    Premium verified profile
                  </div>
                  <div className="flex items-center gap-3 text-[14px] font-semibold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                    Increase revenue instantly
                  </div>
                </div>

                <Link href="/register-vendor" className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-[16px] px-6 py-4 flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-1 duration-300">
                  List Your Business Free <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Trust badges below card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-center gap-6 mt-6 relative z-20 text-slate-500 text-[13px] font-bold uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-500" /> 100% Secure
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 4.9/5 Rating
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
