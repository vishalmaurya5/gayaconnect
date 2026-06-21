'use client';
import { useAuth } from '@/contexts/AuthContext';

const offers = [
  { title: "AC servicing & gas refill discount", vendor: "Sonu AC Repair · Gaya City", discount: "20% OFF", expiry: "30 Jun 2025", bg: "bg-indigo-50", color: "indigo" },
  { title: "Full bike service at flat ₹99 only", vendor: "Raja Motors · Bodh Gaya", discount: "₹99 FLAT", expiry: "15 Jul 2025", bg: "bg-teal-50", color: "teal" },
  { title: "Monsoon season room discount", vendor: "Hotel Gaya Inn · Gaya City", discount: "30% OFF", expiry: "31 Aug 2025", bg: "bg-amber-50", color: "amber" },
  { title: "Free home inspection on first visit", vendor: "Mishra Electricals · Manpur", discount: "FREE Visit", expiry: "Limited time", bg: "bg-rose-50", color: "rose" },
];

export default function OfferSection() {
  const { user, openSubscriptionModal } = useAuth();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {offers.map((offer, idx) => (
        <div key={idx} className="bg-white border border-slate-100 rounded-[24px] flex overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 relative group">
          {/* Ticket styling left accent */}
          <div className={`w-3 ${offer.bg.replace("bg-", "bg-").replace("50", "400")} shrink-0`}></div>
          
          <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            
            {/* Discount Badge */}
            <div className={`w-20 h-20 rounded-[16px] ${offer.bg} border border-${offer.color}-100/50 flex flex-col items-center justify-center shrink-0 border-dashed relative`}>
              {/* Ticket cutouts */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
              
              <div className={`font-sora font-[800] text-[18px] leading-tight ${offer.color === "indigo" ? "text-indigo-700" : offer.color === "teal" ? "text-teal-700" : offer.color === "amber" ? "text-amber-700" : "text-rose-700"}`}>
                {offer.discount.split(" ")[0]}
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${offer.color === "indigo" ? "text-indigo-500/80" : offer.color === "teal" ? "text-teal-500/80" : offer.color === "amber" ? "text-amber-500/80" : "text-rose-500/80"}`}>
                {offer.discount.split(" ")[1] || ""}
              </div>
            </div>
            
            {/* Offer Details */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{offer.vendor}</div>
              <div className="font-[800] text-slate-900 text-[16px] leading-snug">{offer.title}</div>
              
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mt-2">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Expires {offer.expiry}
              </div>
              
              <div className="mt-4">
                {user?.isSubscribed ? (
                  <button 
                    className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wide rounded-full px-4 py-1.5 hover:bg-green-100 hover:shadow-sm transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                    Reveal Code
                  </button>
                ) : (
                  <button 
                    onClick={openSubscriptionModal}
                    className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wide rounded-[10px] px-3.5 py-2 hover:bg-indigo-600 hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/></svg>
                    Subscribe to View
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
