// app/offers/page.jsx — Offers listing page
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Lock, Tag, Plus, ArrowRight, Search, Filter, User, Gift, X, MapPin, Phone, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Food", "Hotels", "Auto", "Home Services", "Shopping"];

const DEMO_OFFERS = [
  { _id:"o1", avatar: "https://randomuser.me/api/portraits/men/22.jpg", discount:"20%", unit:"OFF",  stripColor:"#4338CA", bgColor:"#EEF2FF", textColor:"#4338CA", vendor:"Sonu AC Repair",       area:"Gaya City",  category:"Electronics",    title:"AC servicing & gas refill discount",        desc:"Get 20% off on complete AC servicing including gas refill. Valid on all AC brands.", businessDesc: "Expert AC technicians with 10+ years of experience in Gaya. We handle all brands including LG, Samsung, and Voltas.", phone: "9876543210", address: "G.B Road, Gaya", expiresAt:"2025-07-10", daysLeft:23, hot:true  },
  { _id:"o2", avatar: "https://randomuser.me/api/portraits/men/32.jpg", discount:"₹99", unit:"FLAT", stripColor:"#0D9488", bgColor:"#F0FDFA", textColor:"#0D9488", vendor:"Raja Motors",           area:"Bodh Gaya",  category:"Auto",           title:"Full bike service at flat ₹99 only",        desc:"Complete bike servicing including oil change, chain lube, brake adjustment and wash.", businessDesc: "Premium multi-brand two-wheeler service center. Genuine parts guaranteed with quick service.", phone: "8765432109", address: "Main Road, Bodh Gaya", expiresAt:"2025-07-15", daysLeft:45,  hot:true  },
  { _id:"o3", avatar: "https://randomuser.me/api/portraits/men/44.jpg", discount:"30%", unit:"OFF",  stripColor:"#D97706", bgColor:"#FFFBEB", textColor:"#D97706", vendor:"Hotel Gaya Inn",        area:"Gaya City",  category:"Hotels",         title:"Monsoon season room discount",               desc:"Book any room category and get 30% off. Valid Mon–Thu. Complimentary breakfast included.", businessDesc: "Luxury stay in the heart of Gaya with free WiFi, AC rooms, and 24/7 room service.", phone: "7654321098", address: "Station Road, Gaya", expiresAt:"2025-08-31", daysLeft:75, hot:false },
  { _id:"o4", avatar: "https://randomuser.me/api/portraits/men/55.jpg", discount:"FREE",unit:"Visit",stripColor:"#BE123C", bgColor:"#FFF1F2", textColor:"#BE123C", vendor:"Mishra Electricals",    area:"Manpur",     category:"Home Services",  title:"Free home inspection on first visit",       desc:"First-time customers get a free electrical inspection. No hidden charges.", businessDesc: "Licensed electricians for residential and commercial wiring, repairing, and new installations.", phone: "6543210987", address: "Manpur Bazaar, Gaya", expiresAt:"2025-07-05", daysLeft:18, hot:false },
  { _id:"o5", avatar: "https://randomuser.me/api/portraits/men/66.jpg", discount:"15%", unit:"OFF",  stripColor:"#7E22CE", bgColor:"#FDF4FF", textColor:"#7E22CE", vendor:"Sharma Plumbing",       area:"Bodh Gaya",  category:"Home Services",  title:"Pipe fitting & leakage repair discount",    desc:"All pipe fitting and leakage repair jobs at 15% off. Same day service available.", businessDesc: "Professional plumbing services. We fix leaks, install motors, and handle complete bathroom fittings.", phone: "9988776655", address: "Kaluahi, Bodh Gaya", expiresAt:"2025-07-20", daysLeft:33, hot:false },
  { _id:"o6", avatar: "https://randomuser.me/api/portraits/men/77.jpg", discount:"₹49", unit:"OFF",  stripColor:"#15803D", bgColor:"#F0FDF4", textColor:"#15803D", vendor:"Fresh Veg Corner",      area:"Gaya City",  category:"Food",           title:"₹49 off on grocery orders above ₹300",     desc:"Order fresh vegetables and groceries worth ₹300 or more and get ₹49 off instantly.", businessDesc: "Daily fresh vegetables, fruits, and daily needs delivered to your doorstep in Gaya.", phone: "9123456780", address: "AP Colony, Gaya", expiresAt:"2025-06-30", daysLeft:13, hot:true  },
  { _id:"o7", avatar: "https://randomuser.me/api/portraits/men/88.jpg", discount:"25%", unit:"OFF",  stripColor:"#C2410C", bgColor:"#FFF7ED", textColor:"#C2410C", vendor:"Guddu Auto Works",      area:"Tekari",     category:"Auto",           title:"Car wash & detailing at 25% off",           desc:"Complete car exterior wash, interior vacuuming and dashboard polish at 25% off.", businessDesc: "High-tech foam wash and ceramic coating center for all cars and SUVs.", phone: "8877665544", address: "Tekari Road, Gaya", expiresAt:"2025-07-15", daysLeft:28, hot:false },
  { _id:"o8", avatar: "https://randomuser.me/api/portraits/men/99.jpg", discount:"BUY 1",unit:"GET 1",stripColor:"#0369A1",bgColor:"#EFF6FF", textColor:"#0369A1", vendor:"Kapda World",           area:"Gaya City",  category:"Shopping",       title:"Buy 1 get 1 free on all kurtas",            desc:"Buy any kurta and get one free. Valid on selected stock only. While stocks last.", businessDesc: "Gaya's biggest showroom for men's and women's ethnic wear.", phone: "7766554433", address: "Tower Chowk, Gaya", expiresAt:"2025-06-28", daysLeft:11, hot:true  },
];

const OFFER_COLORS = [
  { stripColor: "#4338CA", bgColor: "#EEF2FF", textColor: "#4338CA" },
  { stripColor: "#0D9488", bgColor: "#F0FDFA", textColor: "#0D9488" },
  { stripColor: "#D97706", bgColor: "#FFFBEB", textColor: "#D97706" },
  { stripColor: "#BE123C", bgColor: "#FFF1F2", textColor: "#BE123C" },
];

function refreshedDemoOffer(offer) {
  const expiresAt = new Date(Date.now() + offer.daysLeft * 86400000).toISOString();
  return { ...offer, expiresAt };
}

function toOfferCard(offer, index) {
  const vendor = offer.vendorId || {};
  const rawExpiry = offer.validUntil || offer.expiresAt;
  const expiryDate = rawExpiry ? new Date(rawExpiry) : null;
  const hasValidExpiry = expiryDate && !Number.isNaN(expiryDate.getTime());
  const expiresAt = hasValidExpiry ? expiryDate.toISOString() : null;
  const daysLeft = hasValidExpiry
    ? Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / 86400000))
    : null;

  return {
    ...offer,
    ...OFFER_COLORS[index % OFFER_COLORS.length],
    avatar: vendor.images?.[0],
    discount: offer.discountText || offer.discount || "Special deal",
    unit: "OFFER",
    vendor: vendor.name || offer.vendorName || "Local vendor",
    area: vendor.address?.split(",")[0] || "Gaya",
    category: offer.category || vendor.category || "Other",
    desc: offer.description || "Contact the vendor to learn more about this offer.",
    businessDesc: vendor.description || `${vendor.name || "This vendor"} serves customers across Gaya district.`,
    phone: vendor.userId?.phone || "",
    address: vendor.address || "Gaya district",
    expiresAt,
    daysLeft,
    hot: Boolean(offer.hot),
  };
}

function validityLabel(offer) {
  if (!offer.expiresAt || offer.daysLeft === null) return "Validity unavailable";
  if (offer.daysLeft <= 0) return "Expired";
  if (offer.daysLeft > 30) {
    return `Valid until ${new Date(offer.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }
  return `${offer.daysLeft} days left`;
}

export default function OffersPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [category, setCategory]         = useState("All");
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState(""); // For debouncing
  const [sortOrder, setSortOrder]       = useState("newest");
  const [offers, setOffers]             = useState(() => DEMO_OFFERS.map(refreshedDemoOffer));
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.append("category", category);
    if (search) params.append("search", search);
    if (sortOrder) params.append("sort", sortOrder);

    fetch(`/api/offers?${params.toString()}`)
      .then(async r => {
        const data = await r.json();
        if (!r.ok || !data.success) throw new Error(data.message || "Could not load offers");
        setOffers([
          ...DEMO_OFFERS.map(refreshedDemoOffer),
          ...(data.offers || []).map(toOfferCard),
        ]);
      })
      .catch(error => setLoadError(error.message))
      .finally(() => setLoading(false));

    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) {
          const active = d.user.subscriptionActive &&
            new Date(d.user.subscriptionExpiry) > new Date();
          setIsSubscribed(active);
        }
      }).catch(() => {});
  }, [category, search, sortOrder]);

  // Filter demo offers locally since they are not in DB
  const filteredDemo = DEMO_OFFERS.map(refreshedDemoOffer).filter(o => {
    const matchCat    = category === "All" || o.category === category;
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // DB offers are already filtered by the API
  const dbOffers = offers.filter(o => !DEMO_OFFERS.some(demo => demo._id === o._id));
  
  // Combine them
  const filtered = [...filteredDemo, ...dbOffers];

  if (sortOrder === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt || b.expiresAt) - new Date(a.createdAt || a.expiresAt));
  } else if (sortOrder === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt || a.expiresAt) - new Date(b.createdAt || b.expiresAt));
  }

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
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search offers, vendors…"
              className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 sm:w-48 shrink-0">
            <Filter size={16} className="text-gray-400" />
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="flex-1 text-[14px] text-gray-700 outline-none bg-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
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

        {loading && (
          <div className="py-20 text-center text-sm font-medium text-slate-500">Loading offers...</div>
        )}

        {!loading && loadError && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>
        )}

        {/* Hot deals */}
        {hotOffers.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔥</span>
              <h2 className="font-['Sora',sans-serif] text-[18px] font-bold text-gray-900">Hot deals</h2>
              <span className="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full">{hotOffers.length} offers</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotOffers.map(offer => (
                <OfferCard key={offer._id} offer={offer} isSubscribed={isSubscribed} hot onClick={() => setSelectedOffer(offer)} />
              ))}
            </div>
          </div>
        )}

        {/* All offers */}
        {allOffers.length > 0 && (
          <div>
            <h2 className="font-['Sora',sans-serif] text-[18px] font-bold text-gray-900 mb-4">All offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allOffers.map(offer => (
                <OfferCard key={offer._id} offer={offer} isSubscribed={isSubscribed} onClick={() => setSelectedOffer(offer)} />
              ))}
            </div>
          </div>
        )}

        {!loading && !loadError && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="font-['Sora',sans-serif] text-xl font-bold text-gray-800 mb-2">No offers found</h3>
            <p className="text-gray-500 text-[14px] mb-6">Try a different category or search term</p>
            {(search || category !== 'All' || sortOrder !== 'newest') && (
              <button 
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                  setCategory('All');
                  setSortOrder('newest');
                }}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                Clear Filters & View All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {selectedOffer && (
        <OfferModal 
          offer={selectedOffer} 
          isSubscribed={isSubscribed} 
          onClose={() => setSelectedOffer(null)} 
        />
      )}
    </main>
  );
}

function OfferCard({ offer: o, isSubscribed, hot, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[1.25rem] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative"
      style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)" }}
    >
      {/* Top color strip */}
      <div className="h-[6px] w-full rounded-t-[1.25rem]" style={{ background: o.stripColor }} />

      <div className="flex gap-4 p-5 md:p-6 flex-1">
        {/* Discount badge */}
        <div className="w-[84px] h-[84px] rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
          style={{ background: o.bgColor }}>
          <span className="font-['Sora',sans-serif] font-extrabold leading-none text-center tracking-tight"
            style={{ color: o.textColor, fontSize: o.discount.length > 3 ? "18px" : "26px" }}>
            {o.discount}
          </span>
          <span className="font-bold tracking-widest mt-1 text-center"
            style={{ color: o.textColor, fontSize: "10px" }}>
            {o.unit}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            {o.avatar ? (
              <img src={o.avatar} alt={o.vendor} className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                <User size={12} className="text-slate-500" />
              </div>
            )}
            <p className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wide truncate">
              {o.vendor} · {o.area}
            </p>
            {hot && (
              <span className="ml-auto bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">🔥 Hot</span>
            )}
          </div>

          <h3 className="text-[16px] font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{o.title}</h3>

          {isSubscribed ? (
            <p className="text-[13px] text-slate-500 mb-4 leading-relaxed line-clamp-2">{o.desc}</p>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-3 py-2 mb-4 w-max border border-slate-100">
              <Lock size={12} className="text-slate-400" />
              <span className="text-[12px] font-medium text-slate-500">Subscribe to view details</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400">
              <Clock size={14} className="text-slate-300" />
              <span className={o.daysLeft !== null && o.daysLeft <= 7 ? "text-red-500" : ""}>
                {validityLabel(o)}
              </span>
            </div>
            {isSubscribed ? (
              <button className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-indigo-500/20 active:scale-95">
                <Gift size={14} /> Claim offer
              </button>
            ) : (
              <Link href="/pricing"
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors no-underline border border-amber-200/50">
                <Lock size={13} /> Unlock
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferModal({ offer, isSubscribed, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Strip */}
        <div className="h-2 w-full shrink-0" style={{ background: offer.stripColor }} />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto p-6 md:p-8 flex-1 custom-scrollbar">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            {offer.avatar ? (
              <img src={offer.avatar} alt={offer.vendor} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 shadow-sm">
                <User size={28} className="text-slate-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900">{offer.vendor}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={14} /> {offer.area}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><Tag size={14} /> {offer.category}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-6" />

          {/* The Offer Highlights */}
          <div className="flex items-start gap-5 mb-6">
            <div className="w-[100px] h-[100px] rounded-3xl flex flex-col items-center justify-center flex-shrink-0 shadow-inner"
              style={{ background: offer.bgColor }}>
              <span className="font-['Sora',sans-serif] font-extrabold leading-none text-center tracking-tight"
                style={{ color: offer.textColor, fontSize: offer.discount.length > 3 ? "20px" : "32px" }}>
                {offer.discount}
              </span>
              <span className="font-bold tracking-widest mt-1.5 text-center"
                style={{ color: offer.textColor, fontSize: "12px" }}>
                {offer.unit}
              </span>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{offer.title}</h3>
              <p className="text-slate-600 text-[15px] leading-relaxed">{offer.desc}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <User size={16} className="text-slate-500" /> About the Business
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {offer.businessDesc}
            </p>
          </div>

          {/* Contact Details (Locked for Non-Subscribers) */}
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Phone size={16} className="text-slate-500" /> Contact Info & Redemption
          </h4>
          
          {isSubscribed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Phone Number</p>
                    <p className="font-bold text-slate-900">{offer.phone}</p>
                  </div>
                </div>
                <a href={`tel:${offer.phone}`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                  Call Now
                </a>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Business Address</p>
                  <p className="font-semibold text-slate-900">{offer.address}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <Lock size={32} className="text-slate-300 mx-auto mb-3" />
              <h5 className="font-bold text-slate-800 mb-1">Details Locked</h5>
              <p className="text-sm text-slate-500 mb-4 px-4">Subscribe to view the contact number, full address, and claim this exclusive offer.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
                Subscribe for ₹11/mo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
