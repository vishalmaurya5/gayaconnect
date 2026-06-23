// app/profile/page.jsx — User & Vendor profile page
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Store, Tag, CreditCard, Edit3, LogOut,
  CheckCircle, Clock, AlertTriangle, Phone, Mail,
  MapPin, Shield, Bell, Trash2, Save, Truck, Car
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [requestingDelete, setRequestingDelete] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehForm, setVehForm] = useState({ vehicleName: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', isCommercial: true, liabilityAccepted: false });
  const [postingVeh, setPostingVeh] = useState(false);
  const [callHistory, setCallHistory] = useState([]);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) {
          setUser(d.user);
          // fetch transactions
          fetch(`/api/users/transactions?userId=${d.user._id}`).then(r=>r.json()).then(t => setTransactions(t.transactions || []));
          // fetch vehicles
          fetch(`/api/vehicles?ownerId=${d.user._id}`).then(r=>r.json()).then(v => setVehicles(v.vehicles || []));
          // fetch call history
          fetch('/api/calls').then(r=>r.json()).then(c => setCallHistory(c.calls || []));

          setForm({
            name:        d.user.name || "",
            phone:       d.user.phone || "",
            address:     d.user.address || "",
            // vendor fields
            businessName: d.vendor?.name || "",
            category:    d.vendor?.category || "",
            description: d.vendor?.description || "",
            businessAddress: d.vendor?.address || "",
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
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save profile");
      }
    } catch {}
    finally { setSaving(false); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      alert("Only JPG/JPEG files are allowed for security reasons.");
      return;
    }
    
    if (file.size > 50 * 1024) {
      alert("Profile picture must be less than 50KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setForm(p => ({ ...p, profileImage: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm("Are you sure you want to request account deletion? This action cannot be undone.")) return;
    
    setRequestingDelete(true);
    try {
      const res = await fetch("/api/profile/delete-request", { method: "POST" });
      if (res.ok) {
        alert("Your account has been deleted from the website.");
        window.location.href = "/";
      } else {
        const err = await res.json();
        alert(err.message || "Failed to request deletion");
      }
    } catch {
      alert("Failed to request deletion");
    } finally {
      setRequestingDelete(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const handlePostVehicle = async (e) => {
    e.preventDefault();
    if (!vehForm.liabilityAccepted) return alert("You must accept liability for commercial vehicle usage.");
    setPostingVeh(true);
    try {
      const res = await fetch("/api/vehicles/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vehForm,
          ownerId: user._id,
          ownerName: user.name,
          phone: user.phone
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Gaya Connect",
        description: "Vehicle Listing Fee",
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch("/api/vehicles/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              vehicleId: data.vehicleId
            })
          });
          if (verifyRes.ok) {
            alert("Vehicle posted successfully! Pending admin approval.");
            setVehForm({ vehicleName: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', isCommercial: true, liabilityAccepted: false });
            fetch(`/api/vehicles?ownerId=${user._id}`).then(r=>r.json()).then(v => setVehicles(v.vehicles || []));
            fetch(`/api/users/transactions?userId=${user._id}`).then(r=>r.json()).then(t => setTransactions(t.transactions || []));
          } else {
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#4f46e5" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || "Failed to initiate payment");
    } finally {
      setPostingVeh(false);
    }
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
    { id:"vehicles",     label:"My Vehicles",      icon:Car         },
    { id:"calls",        label:"Call History",     icon:Phone       },
    { id:"settings",     label:"Settings",         icon:Shield      },
  ];

  return (
    <main className="bg-[#F8F9FC] min-h-screen py-8 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Profile header card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl font-['Sora',sans-serif] flex-shrink-0 overflow-hidden relative">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.name?.[0]?.toUpperCase() || "U"
            )}
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

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden relative flex-shrink-0">
                    {form.profileImage || user.profileImage ? (
                      <img src={form.profileImage || user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-indigo-700 font-bold text-3xl font-['Sora',sans-serif]">{(form.name || user.name)?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  {editing && (
                    <div>
                      <input type="file" id="profilePic" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
                      <label htmlFor="profilePic" className="cursor-pointer inline-block bg-white border border-gray-200 hover:border-indigo-300 text-[13px] font-semibold text-gray-700 px-4 py-2 rounded-xl transition-all">
                        Change Photo
                      </label>
                      <p className="text-[11px] text-gray-400 mt-2">JPG/JPEG only. Max 50KB.</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label:"Full name",   key:"name",  icon:User,    type:"text",  editable: true },
                    { label:"Phone",       key:"phone", icon:Phone,   type:"tel",   editable: false },
                    { label:"Address",     key:"address", icon:MapPin,  type:"text",  editable: true },
                  ].map(f => {
                    const Icon = f.icon;
                    return (
                      <div key={f.key}>
                        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                        {editing && f.editable !== false ? (
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
                          : "Subscribe for ₹11/month to unlock all vendor contacts, offers and local workforce listings."}
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
                      "Contact local workers directly",
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
                    {transactions.length > 0 ? transactions.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="text-[13.5px] font-medium text-gray-800 capitalize">{p.purpose.replace('_', ' ')}</div>
                          <div className="text-[12px] text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</div>
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

            {/* ── VEHICLES TAB ── */}
            {tab === "vehicles" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Post Vehicle for Rent</h2>
                  <form onSubmit={handlePostVehicle} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase">Vehicle Name</label>
                        <input required type="text" value={vehForm.vehicleName} onChange={e => setVehForm({...vehForm, vehicleName: e.target.value})} placeholder="e.g. Maruti Swift Dzire" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase">Vehicle Model / Year</label>
                        <input required type="text" value={vehForm.vehicleModel} onChange={e => setVehForm({...vehForm, vehicleModel: e.target.value})} placeholder="e.g. 2021 VXI" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase">Vehicle Number</label>
                        <input required type="text" value={vehForm.vehicleNumber} onChange={e => setVehForm({...vehForm, vehicleNumber: e.target.value})} placeholder="e.g. BR 02 XX 1234" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase">Driving License No.</label>
                        <input required type="text" value={vehForm.dlNumber} onChange={e => setVehForm({...vehForm, dlNumber: e.target.value})} placeholder="e.g. BR02XXXXXXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-indigo-400" />
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input required type="checkbox" checked={vehForm.liabilityAccepted} onChange={e => setVehForm({...vehForm, liabilityAccepted: e.target.checked})} className="mt-1" />
                        <div className="text-[13px] text-amber-900 leading-relaxed">
                          <strong>Terms & Conditions:</strong> I confirm this is a commercial vehicle. I assume all liabilities, risks, and responsibilities associated with renting out this vehicle. Gaya Connect is only a listing platform and holds no responsibility for damages or disputes.
                        </div>
                      </label>
                    </div>

                    <button type="submit" disabled={postingVeh} className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 flex justify-center items-center gap-2">
                      <Truck size={18} /> {postingVeh ? "Processing..." : "Pay ₹200 & Post Vehicle"}
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">My Posted Vehicles</h3>
                  <div className="space-y-3">
                    {vehicles.length > 0 ? vehicles.map((v) => (
                      <div key={v._id} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-bold text-[14.5px] text-gray-900">{v.vehicleName} <span className="font-normal text-gray-500">({v.vehicleModel})</span></div>
                          <div className="text-[12px] font-semibold text-indigo-600 mt-0.5">{v.vehicleNumber}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          v.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                          v.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {v.status}
                        </div>
                      </div>
                    )) : (
                      <p className="text-[13px] text-gray-400 text-center py-4">You haven't posted any vehicles yet.</p>
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
                    { label:"Business Address", key:"businessAddress" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{f.label}</label>
                      <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-[14px] text-gray-700">
                        {form[f.key] || "—"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-[14px] text-gray-700 leading-relaxed">
                    {form.description || "No description added yet."}
                  </div>
                </div>
              </div>
            )}

            {/* ── CALL HISTORY TAB ── */}
            {tab === "calls" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-semibold text-gray-900 mb-5">Your Contact History</h2>
                <div className="space-y-3">
                  {callHistory.length > 0 ? callHistory.map((call) => (
                    <div key={call._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl gap-3">
                      <div>
                        <div className="font-bold text-[14.5px] text-gray-900">{call.receiverName}</div>
                        <div className="text-[12.5px] font-medium text-gray-500 mt-0.5 capitalize">{call.receiverType} &bull; {call.receiverPhone}</div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end">
                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                          call.actionType === 'WhatsApp' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {call.actionType}
                        </div>
                        <div className="text-[11.5px] text-gray-400 mt-1.5 font-medium">
                          {new Date(call.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <div className="inline-flex w-12 h-12 rounded-full bg-gray-100 items-center justify-center text-gray-400 mb-3">
                        <Phone size={20} />
                      </div>
                      <p className="text-[13.5px] text-gray-500 font-medium">You haven't contacted any professionals yet.</p>
                    </div>
                  )}
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
                  <button 
                    onClick={handleDeleteRequest}
                    disabled={requestingDelete}
                    className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer text-[13.5px] font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <Trash2 size={15} /> 
                    {requestingDelete ? "Deleting..." : "Delete my account"}
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
