// app/offers/page.jsx — Offers listing page
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Lock, Tag, Plus, ArrowRight, Search, Filter } from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Food", "Hotels", "Auto", "Home Services", "Shopping"];

const DEMO_OFFERS = [
  { _id:"o1", discount:"20%", unit:"OFF",  stripColor:"#4338CA", bgColor:"#EEF2FF", textColor:"#4338CA", vendor:"Sonu AC Repair",       area:"Gaya City",  category:"Electronics",    title:"AC servicing & gas refill discount",        desc:"Get 20% off on complete AC servicing including gas refill. Valid on all AC brands.",   expiresAt:"2025-07-10", daysLeft:23, hot:true  },
  { _id:"o2", discount:"₹99", unit:"FLAT", stripColor:"#0D9488", bgColor:"#F0FDFA", textColor:"#0D9488", vendor:"Raja Motors",           area:"Bodh Gaya",  category:"Auto",           title:"Full bike service at flat ₹99 only",        desc:"Complete bike servicing including oil change, chain lube, brake adjustment and wash.", expiresAt:"2025-06-25", daysLeft:8,  hot:true  },
  { _id:"o3", discount:"30%", unit:"OFF",  stripColor:"#D97706", bgColor:"#FFFBEB", textColor:"#D97706", vendor:"Hotel Gaya Inn",        area:"Gaya City",  category:"Hotels",         title:"Monsoon season room discount",               desc:"Book any room category and get 30% off. Valid Mon–Thu. Complimentary breakfast included.", expiresAt:"2025-08-31", daysLeft:75, hot:false },
  { _id:"o4", discount:"FREE",unit:"Visit",stripColor:"#BE123C", bgColor:"#FFF1F2", textColor:"#BE123C", vendor:"Mishra Electricals",    area:"Manpur",     category:"Home Services",  title:"Free home inspection on first visit",       desc:"First-time customers get a free electrical inspection. No hidden charges.",           expiresAt:"2025-07-05", daysLeft:18, hot:false },
  { _id:"o5", discount:"15%", unit:"OFF",  stripColor:"#7E22CE", bgColor:"#FDF4FF", textColor:"#7E22CE", vendor:"Sharma Plumbing",       area:"Bodh Gaya",  category:"Home Services",  title:"Pipe fitting & leakage repair discount",    desc:"All pipe fitting and leakage repair jobs at 15% off. Same day service available.",    expiresAt:"2025-07-20", daysLeft:33, hot:false },
  { _id:"o6", discount:"₹49", unit:"OFF",  stripColor:"#15803D", bgColor:"#F0FDF4", textColor:"#15803D", vendor:"Fresh Veg Corner",      area:"Gaya City",  category:"Food",           title:"₹49 off on grocery orders above ₹300",     desc:"Order fresh vegetables and groceries worth ₹300 or more and get ₹49 off instantly.",  expiresAt:"2025-06-30", daysLeft:13, hot:true  },
  { _id:"o7", discount:"25%", unit:"OFF",  stripColor:"#C2410C", bgColor:"#FFF7ED", textColor:"#C2410C", vendor:"Guddu Auto Works",      area:"Tekari",     category:"Auto",           title:"Car wash & detailing at 25% off",           desc:"Complete car exterior wash, interior vacuuming and dashboard polish at 25% off.",     expiresAt:"2025-07-15", daysLeft:28, hot:false },
  { _id:"o8", discount:"BUY 1",unit:"GET 1",stripColor:"#0369A1",bgColor:"#EFF6FF", textColor:"#0369A1", vendor:"Kapda World",           area:"Gaya City",  category:"Shopping",       title:"Buy 1 get 1 free on all kurtas",            desc:"Buy any kurta and get one free. Valid on selected stock only. While stocks last.",     expiresAt:"2025-06-28", daysLeft:11, hot:true  },
];

export default function OffersPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [category, setCategory]         = useState("All");
  const [search, setSearch]             = useState("");
  const [offers, setOffers]             = useState(DEMO_OFFERS);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) {
          const active = d.user.subscriptionActive &&
            new Date(d.user.subscriptionExpiry) > new Date();
          setIsSubscribed(active);
        }
      }).catch(() => {});
  }, []);

  // Filter offers
  const filtered = DEMO_OFFERS.filter(o => {
    const matchCat    = category === "All" || o.category === category;
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const hotOffers = filtered.filter(o => o.hot);
  const allOffers = filtered.filter(o => !o.hot);

  return (
    <main className="bg-[#F8F9FC] min-h-screen">

      {/* Header */}
      <div className="bg-[#0F172A] px-6 py-12">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-[11.5px] font-bold text-amber-400 uppercase tracking-widest mb-2">Deals &amp; discounts</p>
            <h1 className="font-['Sora',sans-serif] text-[34px] font-extrabold text-white mb-2 tracking-tight">
              Local offers in Gaya district
            </h1>
            <p className="text-white/50 text-[15px]">
              Exclusive deals from verified local businesses — updated daily
            </p>
          </div>
          <Link href="/offers/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[14px] px-5 py-3 rounded-xl transition-colors no-underline flex-shrink-0">
            <Plus size={16} /> Post an offer
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Subscribe gate */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between shadow-lg shadow-amber-200">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-white flex-shrink-0" />
              <p className="text-white font-medium text-[14px]">
                Subscribe for <strong>₹11/month</strong> to view full offer details, contact vendors, and claim deals.
              </p>
            </div>
            <Link href="/pricing"
              className="flex-shrink-0 bg-white text-orange-600 font-bold text-[13.5px] px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors no-underline">
              Subscribe now
            </Link>
          </div>
        )}

        {/* Search + filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search offers, vendors…"
              className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex-shrink-0 text-[13px] font-medium px-4 py-2 rounded-xl border transition-all ${
                category === cat
                  ? "bg-indigo-700 text-white border-indigo-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Hot deals */}
        {hotOffers.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔥</span>
              <h2 className="font-['Sora',sans-serif] text-[18px] font-bold text-gray-900">Hot deals</h2>
              <span className="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full">{hotOffers.length} offers</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {hotOffers.map(offer => (
                <OfferCard key={offer._id} offer={offer} isSubscribed={isSubscribed} hot />
              ))}
            </div>
          </div>
        )}

        {/* All offers */}
        {allOffers.length > 0 && (
          <div>
            <h2 className="font-['Sora',sans-serif] text-[18px] font-bold text-gray-900 mb-4">All offers</h2>
            <div className="grid grid-cols-2 gap-4">
              {allOffers.map(offer => (
                <OfferCard key={offer._id} offer={offer} isSubscribed={isSubscribed} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="font-['Sora',sans-serif] text-xl font-bold text-gray-800 mb-2">No offers found</h3>
            <p className="text-gray-500 text-[14px]">Try a different category or search term</p>
          </div>
        )}
      </div>
    </main>
  );
}

function OfferCard({ offer: o, isSubscribed, hot }) {
  return (
    <div className={`bg-white border rounded-2xl overflow-hidden flex hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer ${
      hot ? "border-orange-200 shadow-md shadow-orange-50" : "border-gray-200 hover:border-gray-300"
    }`}>
      {/* Left color strip */}
      <div className="w-2 flex-shrink-0" style={{ background: o.stripColor }} />

      <div className="flex gap-4 p-5 flex-1">
        {/* Discount badge */}
        <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
          style={{ background: o.bgColor }}>
          <span className="font-['Sora',sans-serif] font-extrabold leading-none text-center"
            style={{ color: o.textColor, fontSize: o.discount.length > 3 ? "13px" : "22px" }}>
            {o.discount}
          </span>
          <span className="font-bold tracking-wide mt-0.5 text-center"
            style={{ color: o.textColor, fontSize: "9.5px" }}>
            {o.unit}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              {o.vendor} · {o.area}
            </p>
            {hot && (
              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">🔥 Hot</span>
            )}
          </div>

          <h3 className="text-[14.5px] font-semibold text-gray-900 mb-1.5 leading-snug">{o.title}</h3>

          {isSubscribed ? (
            <p className="text-[12.5px] text-gray-500 mb-3 leading-relaxed">{o.desc}</p>
          ) : (
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-2 mb-3">
              <Lock size={11} className="text-gray-400" />
              <span className="text-[12px] text-gray-400">Subscribe to view full offer details</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
              <Clock size={11} />
              <span className={o.daysLeft <= 7 ? "text-red-500 font-semibold" : ""}>
                {o.daysLeft <= 0 ? "Expired" : `${o.daysLeft} days left`}
              </span>
            </div>
            {isSubscribed ? (
              <button className="bg-indigo-700 hover:bg-indigo-800 text-white text-[12px] font-semibold px-4 py-1.5 rounded-xl transition-colors">
                Claim offer
              </button>
            ) : (
              <Link href="/pricing"
                className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[12px] font-semibold px-4 py-1.5 rounded-xl transition-colors no-underline">
                <Lock size={11} /> Unlock
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
