'use client'

import { useState } from "react";
import { FiX, FiArrowRight, FiMapPin } from "react-icons/fi";
import Link from "next/link";

export default function AboutGaya() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const highlights = [
    {
      title: "Digital Trust",
      desc: "A secure ecosystem where every business and professional is verified.",
      longDesc: "We prioritize your safety and satisfaction. Every service provider, vendor, and professional on our platform goes through a comprehensive verification process to ensure authentic and high-quality services for our community.",
      image: "/images/gaya/mahabodhi.png",
      link: ""
    },
    {
      title: "Smart Discovery",
      desc: "Find the exact service you need instantly with our intelligent search.",
      longDesc: "Our modern platform is designed for seamless discovery. Whether you need a local contractor, a freelance professional, or a trusted business, our advanced matching connects you with the best options in seconds.",
      image: "/images/gaya/vishnupad.png",
      link: ""
    },
    {
      title: "Business Growth",
      desc: "Empowering businesses with enterprise-grade digital tools.",
      longDesc: "We provide businesses with a powerful digital storefront to reach more customers, manage bookings, and build a trusted reputation online through verified customer reviews and transparent ratings.",
      image: "/images/gaya/falgu_river.png",
      link: ""
    },
    {
      title: "Community Marketplace",
      desc: "Building stronger communities through reliable digital connections.",
      longDesc: "More than just a marketplace, we are a digital community. We bring together skilled professionals and individuals, creating a thriving ecosystem of trusted services and mutual growth.",
      image: "/images/gaya/mangla_gauri.png",
      link: ""
    }
  ];

  return (
    <>
      <section className="bg-transparent py-24 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Text Content */}
            <div className="lg:w-5/12 lg:sticky lg:top-32">
              <div className="text-orange-500 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-orange-500 rounded-full"></span> Platform
              </div>
              <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-[#0F172A] tracking-tight leading-tight mb-6">
                About <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                  Our Platform
                </span>
              </h2>
              <p className="text-slate-500 text-[16px] leading-relaxed mb-8">
                A trusted digital ecosystem connecting businesses, professionals and customers through one modern intelligent platform. Our mission is to simplify digital discovery while empowering businesses and professionals to scale seamlessly.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-orange-50 text-orange-700 font-semibold text-sm rounded-full border border-orange-100">#DigitalTrust</span>
                <span className="px-4 py-2 bg-amber-50 text-amber-700 font-semibold text-sm rounded-full border border-amber-100">#SmartDiscovery</span>
                <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-full border border-indigo-100">#Verified</span>
                <span className="px-4 py-2 bg-rose-50 text-rose-700 font-semibold text-sm rounded-full border border-rose-100">#Growth</span>
              </div>
            </div>

            {/* Right Grid Highlights */}
            <div className="lg:w-7/12 w-full grid sm:grid-cols-2 gap-6">
              {highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedPlace(item)}
                  className="cursor-pointer bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300 group flex flex-col relative"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10"></div>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <h4 className="absolute bottom-4 left-5 z-20 text-white font-bold text-[18px] font-sora drop-shadow-md pr-4">{item.title}</h4>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-slate-500 text-[14px] leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <div className="text-orange-600 font-bold text-[13px] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      Read more <FiArrowRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Explore More Button */}
          <div className="mt-16 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[16px] px-8 py-4 rounded-full shadow-lg shadow-orange-600/30 hover:-translate-y-1 transition-all duration-300">
              Explore Platform Features <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPlace(null)}>
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative transform transition-all animate-in fade-in zoom-in duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="h-64 sm:h-80 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
              <img src={selectedPlace.image} alt={selectedPlace.title} className="w-full h-full object-cover" />
              <h3 className="absolute bottom-6 left-6 right-6 z-20 text-white font-extrabold text-3xl font-sora drop-shadow-md">
                {selectedPlace.title}
              </h3>
            </div>
            
            <div className="p-6 sm:p-8 bg-white">
              <p className="text-slate-700 text-[15px] sm:text-[16px] leading-relaxed mb-6">
                {selectedPlace.longDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link href="/register-vendor" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-6 py-3 rounded-xl transition-colors text-[14px]">
                    <FiArrowRight /> Get Started
                  </Link>
                  {selectedPlace.link && (
                    <a href={selectedPlace.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold px-6 py-3 rounded-xl transition-colors text-[14px]">
                      Read more <FiArrowRight />
                    </a>
                  )}
                </div>
                
                <button onClick={() => setSelectedPlace(null)} className="text-slate-400 hover:text-slate-600 font-medium text-[14px] px-4 py-2">
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
