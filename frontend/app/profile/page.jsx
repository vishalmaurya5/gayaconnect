// app/profile/page.jsx — User & Vendor profile page
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Store, Tag, CreditCard, Edit3, LogOut,
  CheckCircle, Clock, AlertTriangle, Phone, Mail,
  MapPin, Shield, Bell, Trash2, Save,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) {
          setUser(d.user);
          setForm({
            name:        d.user.name || "",
            phone:       d.user.phone || "",
            email:       d.user.email || "",
            area:        d.user.area || "",
            // vendor fields
            businessName: d.user.businessName || "",
            category:    d.user.category || "",
            description: d.user.description || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-['Sora',sans-serif] text-xl font-bold text-gray-800 mb-2">Please login</h2>
          <Link href="/login" className="bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold no-underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const isVendor      = user.role === "vendor";
  const subActive     = user.subscriptionActive && new Date(user.subscriptionExpiry) > new Date();
  const daysLeft      = user.subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const TABS = [
    { id:"profile",      label:"Profile",         icon:User        },
    { id:"subscription", label:"Subscription",     icon:CreditCard  },
    ...(isVendor ? [{ id:"vendor", label:"My listing", icon:Store }] : []),
    { id:"settings",     label:"Settings",         icon:Shield      },
  ];

  return (
    <main className="bg-[#F8F9FC] min-h-screen py-8 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Profile header card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl font-['Sora',sans-serif] flex-shrink-0">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-['Sora',sans-serif] text-[20px] font-bold text-gray-900">{user.name}</h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                isVendor ? "bg-purple-50 text-purple-700" : "bg-indigo-50 text-indigo-700"
              }`}>{user.role}</span>
              {subActive && (
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Subscribed
                </span>
              )}
            </div>
            <p className="text-gray-500 text-[13.5px] mt-0.5">{user.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl transition-all">
            <LogOut size={15} /> Sign out
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-48 flex-shrink-0 space-y-1">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                    tab === t.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-500 hover:text-gray-800 hover:bg-white"
                  }`}>
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ── PROFILE TAB ── */}
            {tab === "profile" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-900 text-[16px]">Personal information</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 text-[13px] text-indigo-600 hover:text-indigo-800 font-semibold">
                      <Edit3 size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(false); }}
                        className="text-[13px] text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">
                        Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1.5 text-[13px] bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold disabled:opacity-60">
                        <Save size={13} /> {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                {saved && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2.5 mb-4 text-[13.5px]">
                    <CheckCircle size={15} /> Profile updated successfully!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label:"Full name",   key:"name",  icon:User,    type:"text"  },
                    { label:"Phone",       key:"phone", icon:Phone,   type:"tel"   },
                    { label:"Email",       key:"email", icon:Mail,    type:"email" },
                    { label:"Area",        key:"area",  icon:MapPin,  type:"text"  },
                  ].map(f => {
                    const Icon = f.icon;
                    return (
                      <div key={f.key}>
                        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                        {editing ? (
                          <input type={f.type} value={form[f.key]}
                            onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                            className="w-full border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none" />
                        ) : (
                          <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5">
                            <Icon size={15} className="text-gray-400 flex-shrink-0" />
                            <span className="text-[14px] text-gray-700">{user[f.key] || "—"}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SUBSCRIPTION TAB ── */}
            {tab === "subscription" && (
              <div className="space-y-4">
                {/* Status card */}
                <div className={`rounded-2xl p-6 border ${
                  subActive
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-orange-50 border-orange-200"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      subActive ? "bg-emerald-100" : "bg-orange-100"
                    }`}>
                      {subActive
                        ? <CheckCircle size={24} className="text-emerald-600" />
                        : <AlertTriangle size={24} className="text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-['Sora',sans-serif] font-bold text-[17px] text-gray-900 mb-1">
                        {subActive ? "Subscription active" : "No active subscription"}
                      </h3>
                      <p className="text-[13.5px] text-gray-600">
                        {subActive
                          ? `Your subscription is valid for ${daysLeft} more days (until ${new Date(user.subscriptionExpiry).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })})`
                          : "Subscribe for ₹11/month to unlock all vendor contacts, offers and daily labour listings."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What you get */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">What's included in ₹11/month</h3>
                  <div className="space-y-3">
                    {[
                      "View all vendor contact numbers (2,400+ vendors)",
                      "Access all local offers & discounts",
                      "Contact daily labour workers directly",
                      "Unlimited searches across Gaya district",
                      "New offers notified instantly",
                    ].map(f => (
                      <div key={f} className="flex items-center gap-3 text-[13.5px] text-gray-700">
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <Link href="/pricing"
                    className="block w-full mt-6 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[14.5px] py-3.5 rounded-xl transition-colors no-underline text-center">
                    {subActive ? "Renew subscription" : "Subscribe for ₹11/month"}
                  </Link>
                </div>

                {/* Payment history */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment history</h3>
                  <div className="space-y-2">
                    {user.payments?.length > 0 ? user.payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="text-[13.5px] font-medium text-gray-800">{p.type}</div>
                          <div className="text-[12px] text-gray-400">{new Date(p.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">₹{p.amount}</span>
                          <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Paid</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-[13px] text-gray-400 text-center py-4">No payments yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── VENDOR TAB ── */}
            {tab === "vendor" && isVendor && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-900 text-[16px]">Business listing</h2>
                  <Link href="/vendor/dashboard"
                    className="flex items-center gap-1.5 text-[13px] bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-semibold no-underline hover:bg-indigo-100 transition-colors">
                    <Store size={14} /> Open dashboard
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label:"Business name", key:"businessName" },
                    { label:"Category",      key:"category"     },
                    { label:"Area",          key:"area"         },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{f.label}</label>
                      <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-[14px] text-gray-700">
                        {user[f.key] || "—"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-[14px] text-gray-700 leading-relaxed">
                    {user.description || "No description added yet."}
                  </div>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === "settings" && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="font-semibold text-gray-900 mb-5">Account settings</h2>
                  <div className="space-y-3">
                    {[
                      { label:"Email notifications", sub:"Get updates about new offers and vendors", enabled:true },
                      { label:"WhatsApp alerts",     sub:"Receive alerts on WhatsApp",               enabled:false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="text-[14px] font-medium text-gray-800">{s.label}</div>
                          <div className="text-[12.5px] text-gray-400">{s.sub}</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${s.enabled ? "bg-indigo-600" : "bg-gray-200"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${s.enabled ? "translate-x-4" : "translate-x-0"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-red-100 rounded-2xl p-6">
                  <h2 className="font-semibold text-red-600 mb-2">Danger zone</h2>
                  <p className="text-[13px] text-gray-500 mb-4">Once you delete your account, all data will be permanently removed.</p>
                  <button className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-[13.5px] font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <Trash2 size={15} /> Delete my account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
