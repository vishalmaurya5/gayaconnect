'use client'

import Link from "next/link";
import { FiGrid } from "react-icons/fi";
import HeroSection from "@/components/ui/HeroSection";
import TrustStrip from "@/components/ui/TrustStrip";
import CategoryGrid from "@/components/ui/CategoryGrid";
import VendorSection from "@/components/ui/VendorSection";
import OfferSection from "@/components/ui/OfferSection";
import LabourSection from "@/components/ui/LabourSection";
import HowItWorks from "@/components/ui/HowItWorks";
import Testimonials from "@/components/ui/Testimonials";
import VendorCTA from "@/components/ui/VendorCTA";
import PopupAd from "@/components/ui/PopupAd";
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, openSubscriptionModal } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      <PopupAd />
      <HeroSection />
      
      {/* Trust Strip */}
      <div className="relative z-20 -mt-8">
        <TrustStrip />
      </div>

      {/* Subscription Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-10 mt-12 mb-20 relative z-10">
        <div className="bg-gradient-to-r from-[#0F172A] via-indigo-950 to-[#0F172A] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-teal-500/20 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[11px] font-bold text-teal-300 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Premium Access
            </div>
            <h3 className="font-sora text-2xl md:text-3xl font-[800] text-white leading-tight">
              Get started for just <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">₹11/month</span>
            </h3>
            <p className="text-slate-300 mt-3 text-[15px] max-w-xl leading-relaxed">
              Unlock all verified vendor contacts, exclusive local offers, and local workforce listings instantly. Join thousands of users today.
            </p>
          </div>
          <button 
            onClick={openSubscriptionModal}
            className="relative z-10 shrink-0 bg-white text-[#0F172A] font-bold px-8 py-4 rounded-[16px] shadow-xl hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300 w-full md:w-auto text-[15px] flex items-center justify-center gap-2"
          >
            Subscribe Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-slate-50/50 py-20 border-y border-slate-100">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span> Explore
              </div>
              <h2 className="font-sora text-3xl md:text-4xl font-[800] text-[#0F172A] tracking-tight flex items-center gap-3">
                <FiGrid className="text-indigo-500 w-8 h-8 md:w-10 md:h-10" /> 
                Browse services
              </h2>
            </div>
            <Link href="/services" className="text-[#0F172A] font-bold text-[14px] flex items-center gap-2 hover:text-indigo-600 transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
              View all categories <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Vendors Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-40 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-20 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="text-teal-600 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-teal-600 rounded-full"></span> Top Rated
              </div>
              <h2 className="font-sora text-3xl md:text-4xl font-[800] text-[#0F172A] tracking-tight">Trusted professionals</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/map" className="hidden sm:flex text-indigo-600 font-bold text-[14px] items-center gap-2 hover:text-indigo-800 transition-colors bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 hover:border-indigo-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Map
              </Link>
              <Link href="/vendors" className="text-[#0F172A] font-bold text-[14px] flex items-center gap-2 hover:text-teal-600 transition-colors bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200 hover:border-teal-200">
                View all vendors <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>
          <VendorSection />
        </div>
      </section>

      {/* Offers Section - Only visible to logged-in users */}
      {user && (
        <section className="bg-slate-50/50 py-20 border-y border-slate-100">
          <div className="max-w-[1440px] mx-auto px-5 lg:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <div className="text-rose-500 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-rose-500 rounded-full"></span> Savings
                </div>
                <h2 className="font-sora text-3xl md:text-4xl font-[800] text-[#0F172A] tracking-tight">Latest local offers</h2>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/map" className="hidden sm:flex text-indigo-600 font-bold text-[14px] items-center gap-2 hover:text-indigo-800 transition-colors bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 hover:border-indigo-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Map
                </Link>
                <Link href="/offers" className="text-[#0F172A] font-bold text-[14px] flex items-center gap-2 hover:text-rose-600 transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
                  View all offers <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </Link>
              </div>
            </div>
            <OfferSection />
          </div>
        </section>
      )}

      {/* Labour Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="text-amber-500 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500 rounded-full"></span> Skilled Workforce
              </div>
              <h2 className="font-sora text-3xl md:text-4xl font-[800] text-[#0F172A] tracking-tight">Hire local workforce</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/map" className="hidden sm:flex text-indigo-600 font-bold text-[14px] items-center gap-2 hover:text-indigo-800 transition-colors bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 hover:border-indigo-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Map
              </Link>
              <Link href="/labour" className="text-[#0F172A] font-bold text-[14px] flex items-center gap-2 hover:text-amber-600 transition-colors bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200">
                View all workers <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>
          <LabourSection />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
          <div className="text-center mb-16">
            <div className="text-indigo-400 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-indigo-400 rounded-full"></span> Process <span className="w-8 h-[2px] bg-indigo-400 rounded-full"></span>
            </div>
            <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-white tracking-tight">How it works</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50/50 py-24 border-y border-slate-100">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10">
          <div className="text-center mb-16">
            <div className="text-emerald-500 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-emerald-500 rounded-full"></span> Community Love <span className="w-8 h-[2px] bg-emerald-500 rounded-full"></span>
            </div>
            <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-[#0F172A] tracking-tight">What people say</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Final Vendor CTA */}
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 pb-20 pt-10">
        <VendorCTA />
      </div>
    </div>
  );
}
