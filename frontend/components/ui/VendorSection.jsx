'use client';
import { useAuth } from '@/contexts/AuthContext';

const vendors = [
  {
    name: "Ravi Electrical Works",
    category: "Electrician",
    rating: 4.9,
    reviews: 124,
    location: "Gaya City, Near Bus Stand",
    tags: ["Wiring", "Inverter", "Switchboard", "Home visit"],
    bg: "bg-indigo-50",
    icon: "⚡",
    badge: "Verified",
  },
  {
    name: "Sharma Plumbing Services",
    category: "Plumber",
    rating: 4.8,
    reviews: 89,
    location: "Bodh Gaya, Temple Road",
    tags: ["Pipe fitting", "Leakage fix", "Tank cleaning"],
    bg: "bg-teal-50",
    icon: "🔧",
    badge: "Verified",
  },
  {
    name: "Guddu Bike Mechanic",
    category: "Bike repair",
    rating: 4.6,
    reviews: 67,
    location: "Tekari Road, Gaya",
    tags: ["Servicing", "Puncture", "Engine repair"],
    bg: "bg-amber-50",
    icon: "🏍️",
    badge: "Top rated",
  },
];

export default function VendorSection() {
  const { openSubscriptionModal } = useAuth();
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {vendors.map((vendor, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 group">
            <div className={`${vendor.bg} h-24 relative`}>
              <div className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm text-slate-700">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {vendor.badge}
              </div>
            </div>
            
            <div className="px-6 pb-6 relative">
              <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center text-3xl shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] border-4 border-white absolute -top-8 left-6 group-hover:-translate-y-1 transition-transform duration-300">
                {vendor.icon}
              </div>
              
              <div className="pt-10">
                <h3 className="font-[800] text-[16px] text-slate-900 leading-tight">{vendor.name}</h3>
                
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="font-bold text-[13px] text-slate-700">{vendor.rating}</span>
                  <span className="text-slate-400 text-[11px] font-medium ml-0.5">({vendor.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-500 text-[12px] mt-2 font-medium">
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2"/></svg>
                  {vendor.location}
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {vendor.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100 rounded-lg px-2.5 py-1 tracking-wide">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-50 bg-slate-50/50 p-4 flex justify-between items-center px-6">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact</div>
                <div className="text-[13px] font-mono blur-[4px] select-none text-slate-800 font-semibold">+91 98765 43210</div>
              </div>
              <button 
                onClick={openSubscriptionModal}
                className="text-white bg-[#0F172A] text-[11px] font-bold tracking-wide rounded-xl px-3.5 py-2 flex items-center gap-1.5 hover:bg-indigo-600 hover:shadow-md transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/></svg>
                Unlock
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe nudge */}
      <div className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50 rounded-[20px] p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/></svg>
          </div>
          <p className="text-[14px] font-semibold text-indigo-900 leading-snug">
            Contact details are hidden. Subscribe to unlock. <br className="hidden md:block" />
            <span className="text-indigo-600/70 font-medium text-[13px]">2,400+ premium vendors waiting for you.</span>
          </p>
        </div>
        <button 
          onClick={openSubscriptionModal}
          className="relative z-10 w-full md:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-[12px] text-[13px] font-bold tracking-wide hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
        >
          Subscribe ₹11/month
        </button>
      </div>
    </div>
  );
}
