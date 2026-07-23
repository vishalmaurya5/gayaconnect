'use client'

import { useState } from "react";
import { FiX, FiArrowRight } from "react-icons/fi";
import { ShieldCheck, Search, TrendingUp, Users, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";

export default function AboutGaya() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const highlights = [
    {
      title: "Digital Trust",
      desc: "A secure ecosystem where every business and professional is verified.",
      longDesc: "We prioritize your safety and satisfaction. Every service provider, vendor, and professional on our platform goes through a comprehensive verification process to ensure authentic and high-quality services for our community.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
      icon: ShieldCheck,
      badgeColor: "bg-emerald-500",
      tag: "100% Verified"
    },
    {
      title: "Smart Discovery",
      desc: "Find the exact service you need instantly with our intelligent search.",
      longDesc: "Our modern platform is designed for seamless discovery. Whether you need a local contractor, a freelance professional, or a trusted business, our advanced matching connects you with the best options in seconds.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      icon: Search,
      badgeColor: "bg-indigo-500",
      tag: "Instant Match"
    },
    {
      title: "Business Growth",
      desc: "Empowering local merchants & vendors with enterprise-grade digital tools.",
      longDesc: "We provide businesses with a powerful digital storefront to reach more customers, manage bookings, and build a trusted reputation online through verified customer reviews and transparent ratings.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      icon: TrendingUp,
      badgeColor: "bg-amber-500",
      tag: "Digital Scaling"
    },
    {
      title: "Community Marketplace",
      desc: "Building stronger local economies through reliable digital connections.",
      longDesc: "More than just a marketplace, we are a digital community. We bring together skilled professionals and local customers, creating a thriving ecosystem of trusted services and mutual growth.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      icon: Users,
      badgeColor: "bg-rose-500",
      tag: "Local Community"
    }
  ];

  return (
    <>
      <section className="bg-transparent py-24 relative overflow-hidden font-inter">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Text Content */}
            <div className="lg:w-5/12 lg:sticky lg:top-32">
              <div className="text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span> Enterprise Digital Ecosystem
              </div>
              <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-[#0F172A] tracking-tight leading-tight mb-6">
                About <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-amber-600">
                  Our Platform
                </span>
              </h2>
              <p className="text-slate-500 text-[16px] leading-relaxed mb-8">
                A trusted digital ecosystem connecting businesses, professionals, and customers through one modern intelligent platform. Our mission is to simplify digital discovery while empowering local merchants and skilled workforce to scale seamlessly.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> #DigitalTrust
                </span>
                <span className="px-4 py-2 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> #SmartDiscovery
                </span>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> #VerifiedBusiness
                </span>
                <span className="px-4 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-full border border-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> #LocalGrowth
                </span>
              </div>
            </div>

            {/* Right Grid Highlights */}
            <div className="lg:w-7/12 w-full grid sm:grid-cols-2 gap-6">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedPlace(item)}
                    className="cursor-pointer bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 group flex flex-col relative"
                  >
                    <div className="h-48 w-full overflow-hidden relative bg-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent z-10"></div>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                      
                      <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                        {item.tag}
                      </span>

                      <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between text-white">
                        <h4 className="font-bold text-[18px] font-sora drop-shadow-md">{item.title}</h4>
                        <div className={`p-2 rounded-xl text-white shadow-md ${item.badgeColor}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <p className="text-slate-600 text-[14px] leading-relaxed mb-4 font-medium">
                        {item.desc}
                      </p>
                      <div className="text-indigo-600 font-bold text-[13px] flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        Read details <FiArrowRight />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Explore More Button */}
          <div className="mt-16 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[15px] px-8 py-4 rounded-full shadow-lg shadow-indigo-600/30 hover:-translate-y-1 transition-all duration-300">
              Explore Platform Features <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlace(null)}>
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative transform transition-all animate-in fade-in zoom-in duration-300 font-sans" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="h-64 sm:h-72 w-full relative bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-10"></div>
              <img src={selectedPlace.image} alt={selectedPlace.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-2">
                  {selectedPlace.tag}
                </span>
                <h3 className="text-white font-extrabold text-2xl sm:text-3xl font-sora drop-shadow-md">
                  {selectedPlace.title}
                </h3>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 bg-white">
              <p className="text-slate-700 text-[15px] sm:text-[16px] leading-relaxed mb-6 font-medium">
                {selectedPlace.longDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
                <Link href="/register-vendor" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3 rounded-xl transition-colors text-[14px] shadow-lg shadow-indigo-600/20">
                  <FiArrowRight /> Register Your Business
                </Link>
                
                <button onClick={() => setSelectedPlace(null)} className="text-slate-400 hover:text-slate-600 font-bold text-[14px] px-4 py-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
