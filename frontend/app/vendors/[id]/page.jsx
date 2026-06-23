// app/vendors/[id]/page.jsx — Vendor detail page
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, Phone, MessageCircle, Shield, Clock,
  ArrowLeft, Lock, CheckCircle, Tag, Share2, Heart,
} from "lucide-react";

export default function VendorDetailPage() {
  const { id }          = useParams();
  const [vendor, setVendor]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [isSubscribed, setIsSub]  = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    // Fetch vendor
    fetch(`/api/vendors/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.vendor) setVendor(d.vendor); setLoading(false); })
      .catch(() => setLoading(false));

    // Check subscription
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) {
          const active = d.user.subscriptionActive &&
            new Date(d.user.subscriptionExpiry) > new Date();
          setIsSub(active);
        }
      }).catch(() => {});
  }, [id]);

  const handleContact = async (e, actionType, url) => {
    e.preventDefault();
    try {
      await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: vendor?._id || id,
          receiverName: vendor?.name || "Vendor",
          receiverType: 'Vendor',
          receiverPhone: vendor?.phone || "+91 98765 43210",
          actionType
        })
      });
    } catch (err) {}
    if (actionType === 'WhatsApp') {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
    </div>
  );

  if (!vendor) return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center text-center px-6">
      <div>
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-['Sora',sans-serif] text-xl font-bold text-gray-800 mb-2">Vendor not found</h2>
        <Link href="/vendors" className="text-indigo-600 font-semibold hover:underline no-underline">← Back to vendors</Link>
      </div>
    </div>
  );

  // Demo data fallback
  const v = {
    name:        vendor.name        || "Ravi Electrical Works",
    category:    vendor.category    || "Electrician",
    area:        vendor.area        || "Gaya City",
    rating:      vendor.rating      || 4.9,
    reviewCount: vendor.reviewCount || 124,
    phone:       vendor.phone       || "+91 98765 43210",
    whatsapp:    vendor.whatsapp    || "+91 98765 43210",
    description: vendor.description || "We provide professional electrical services across Gaya district. 10+ years of experience in residential and commercial wiring, inverter installation, switchboard repairs, and more.",
    services:    vendor.services    || ["Home wiring", "Inverter installation", "Switchboard repair", "Fan & light fitting", "Electrical inspection", "MCB & fuse replacement"],
    tags:        vendor.tags        || ["Wiring", "Inverter", "Switchboard", "Home visit", "Emergency service"],
    workingHours:vendor.workingHours|| "Mon–Sat, 8:00 AM – 8:00 PM",
    experience:  vendor.experience  || "10+ years",
    verified:    vendor.verified    !== false,
    emoji:       "⚡",
    thumbBg:     "#EEF2FF",
    ...vendor,
  };

  const DEMO_REVIEWS = [
    { name:"Rajeev V", rating:5, date:"2 weeks ago", text:"Excellent work! Fixed my wiring issue in 30 minutes. Very professional and reasonable pricing." },
    { name:"Sunita D", rating:5, date:"1 month ago", text:"Got my inverter installed. Clean work, no mess. Would definitely call again." },
    { name:"Amit K",   rating:4, date:"1 month ago", text:"Good service. Came on time. Slight delay on first call but resolved quickly." },
  ];

  return (
    <main className="bg-[#F8F9FC] min-h-screen">

      {/* Back nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <Link href="/vendors" className="flex items-center gap-2 text-[13.5px] text-gray-500 hover:text-gray-700 no-underline w-fit">
            <ArrowLeft size={15} /> Back to vendors
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">

          {/* ── LEFT: Main info ── */}
          <div className="col-span-2 space-y-5">

            {/* Hero card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="h-36 flex items-center justify-center relative"
                style={{ background: v.thumbBg || "#EEF2FF" }}>
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-md border-2 border-white/50">
                  {v.emoji || "🏪"}
                </div>
                {v.verified && (
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-[11px] font-bold text-indigo-700 flex items-center gap-1.5 shadow-sm">
                    <Shield size={11} /> Verified
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="font-['Sora',sans-serif] text-[22px] font-bold text-gray-900 mb-1">{v.name}</h1>
                    <div className="flex items-center gap-3 text-[13.5px] text-gray-500">
                      <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full text-[12px]">{v.category}</span>
                      <span className="flex items-center gap-1"><MapPin size={13} />{v.area}</span>
                    </div>
                  </div>
                  <button onClick={() => setSaved(!saved)}
                    className={`p-2.5 rounded-xl border transition-all ${saved ? "bg-red-50 border-red-200 text-red-500" : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-400"}`}>
                    <Heart size={18} fill={saved ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Rating row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={15}
                          className={s <= Math.round(v.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <span className="font-semibold text-[14px] text-gray-800">{v.rating}</span>
                    <span className="text-[13px] text-gray-400">({v.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                    <Clock size={13} /> {v.workingHours}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {v.tags?.map(tag => (
                    <span key={tag} className="text-[12px] font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex border-b border-gray-100">
                {["about", "services", "reviews"].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`flex-1 py-3.5 text-[13.5px] font-semibold capitalize transition-colors ${
                      activeTab === t
                        ? "text-indigo-700 border-b-2 border-indigo-600 -mb-px"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "about" && (
                  <div>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-5">{v.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label:"Experience", value: v.experience },
                        { label:"Area served", value: v.area },
                        { label:"Category",   value: v.category },
                        { label:"Working hrs",value: v.workingHours },
                      ].map(d => (
                        <div key={d.label} className="bg-gray-50 rounded-xl px-4 py-3">
                          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{d.label}</div>
                          <div className="text-[13.5px] font-medium text-gray-800">{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {v.services?.map(s => (
                      <div key={s} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                        <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-[13.5px] text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {DEMO_REVIEWS.map((r, i) => (
                      <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[12px]">
                              {r.name[0]}
                            </div>
                            <span className="font-semibold text-[13.5px] text-gray-800">{r.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={11}
                                  className={s <= r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                              ))}
                            </div>
                            <span className="text-[11.5px] text-gray-400">{r.date}</span>
                          </div>
                        </div>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Contact card ── */}
          <div className="space-y-4">

            {/* Contact card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4 text-[15px]">Contact vendor</h3>

              {isSubscribed ? (
                <div className="space-y-3">
                  <a href={`tel:${v.phone}`} onClick={(e) => handleContact(e, 'Call', `tel:${v.phone}`)}
                    className="flex items-center justify-center gap-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[14.5px] py-3.5 rounded-xl transition-colors no-underline w-full cursor-pointer">
                    <Phone size={17} /> Call now
                  </a>
                  <a href={`https://wa.me/${v.whatsapp?.replace(/[^0-9]/g, "")}?text=Hi, I found you on Gaya Connect. I need your services.`}
                    onClick={(e) => handleContact(e, 'WhatsApp', `https://wa.me/${v.whatsapp?.replace(/[^0-9]/g, "")}?text=Hi, I found you on Gaya Connect. I need your services.`)}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-[14.5px] py-3.5 rounded-xl transition-colors no-underline w-full cursor-pointer">
                    <MessageCircle size={17} /> WhatsApp
                  </a>

                  <div className="bg-gray-50 rounded-xl px-4 py-3 mt-2">
                    <div className="text-[11px] text-gray-400 mb-0.5">Phone number</div>
                    <div className="text-[15px] font-bold text-gray-900 tracking-wide">{v.phone}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Blurred preview */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 relative overflow-hidden">
                    <div className="text-[11px] text-gray-400 mb-0.5">Phone number</div>
                    <div className="text-[15px] font-bold text-gray-900 blur-sm select-none">+91 98765 43210</div>
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                    <Lock size={20} className="text-indigo-500 mx-auto mb-2" />
                    <p className="text-[13px] text-indigo-800 font-medium mb-3">
                      Subscribe to view contact details and connect directly
                    </p>
                    <Link href="/pricing"
                      className="block w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[14px] py-3 rounded-xl transition-colors no-underline">
                      Subscribe — ₹11/month
                    </Link>
                  </div>
                </div>
              )}

              {/* Share button */}
              <button
                onClick={() => navigator.share?.({ title: v.name, url: window.location.href })}
                className="flex items-center justify-center gap-2 w-full mt-3 border border-gray-200 text-gray-500 hover:text-gray-700 text-[13px] font-medium py-2.5 rounded-xl transition-colors">
                <Share2 size={14} /> Share this vendor
              </button>
            </div>

            {/* Nearby vendors suggestion */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-800 text-[14px] mb-3">Similar vendors nearby</h3>
              {["Mishra Electricals", "Gaya Power Solutions", "Ram Electricals"].map(name => (
                <div key={name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm">⚡</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-800 truncate">{name}</div>
                    <div className="text-[11.5px] text-gray-400">Gaya City</div>
                  </div>
                  <div className="text-[11.5px] text-amber-500">★ 4.7</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
