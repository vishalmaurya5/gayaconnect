'use client'

import HeroSection from "@/components/ui/HeroSection";
import TrustStrip from "@/components/ui/TrustStrip";
import CategoryGrid from "@/components/ui/CategoryGrid";
import VendorSection from "@/components/ui/VendorSection";
import OfferSection from "@/components/ui/OfferSection";
import LabourSection from "@/components/ui/LabourSection";
import HowItWorks from "@/components/ui/HowItWorks";
import Testimonials from "@/components/ui/Testimonials";
import VendorCTA from "@/components/ui/VendorCTA";
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { openSubscriptionModal } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen">
      <HeroSection />
      <TrustStrip />
      
      {/* Minimum Plan Highlight Section */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 mb-12">
        <div className="bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-sora text-xl md:text-2xl font-bold text-slate-800">
              Get started for just <span className="text-indigo-600">₹11/month</span>
            </h3>
            <p className="text-slate-600 mt-2">
              Unlock all verified vendor contacts, exclusive local offers, and daily labour listings instantly.
            </p>
          </div>
          <button 
            onClick={openSubscriptionModal}
            className="shrink-0 bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 transition-all w-full md:w-auto"
          >
            Subscribe Now
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-10 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Explore</div>
            <h2 className="font-sora text-2xl font-bold text-gray-900">Browse by service category</h2>
          </div>
          <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1">View all categories →</button>
        </div>
        <CategoryGrid />
      </section>

      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Top rated</div>
              <h2 className="font-sora text-2xl font-bold text-gray-900">Trusted vendors near you</h2>
            </div>
            <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1">View all vendors →</button>
          </div>
          <VendorSection />
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Deals & discounts</div>
              <h2 className="font-sora text-2xl font-bold text-gray-900">Latest offers from local businesses</h2>
            </div>
            <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1">All offers →</button>
          </div>
          <OfferSection />
        </div>
      </section>

      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Daily wages</div>
              <h2 className="font-sora text-2xl font-bold text-gray-900">Find daily labour & skilled workers</h2>
            </div>
            <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1">All workers →</button>
          </div>
          <LabourSection />
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-10 text-center mb-8">
          <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Simple process</div>
          <h2 className="font-sora text-2xl font-bold text-gray-900">How Gaya Connect works</h2>
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <HowItWorks />
        </div>
      </section>

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-10 text-center mb-8">
          <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Community love</div>
          <h2 className="font-sora text-2xl font-bold text-gray-900">What people in Gaya say</h2>
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <Testimonials />
        </div>
      </section>

      <div className="max-w-6xl mx-auto">
        <VendorCTA />
      </div>
    </div>
  );
}
