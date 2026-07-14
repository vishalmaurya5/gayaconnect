// app/profile/page.jsx — User & Vendor profile page
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Store, Tag, CreditCard, Edit3, LogOut,
  CheckCircle, Clock, AlertTriangle, Phone, Mail,
  MapPin, Shield, Bell, Trash2, Save, Truck, Car, Briefcase
} from "lucide-react";
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

export default function ProfilePage() {
  const [user, setUser]       = useState(null);
  const [worker, setWorker]   = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Read initial tab from URL if present
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'profile';
    }
    return 'profile';
  };
  const [tab, setTab]         = useState(getInitialTab);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [requestingDelete, setRequestingDelete] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vehForm, setVehForm] = useState({ vehicleName: '', categoryId: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', isCommercial: true, liabilityAccepted: false });
  const [postingVeh, setPostingVeh] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.user) {
          setUser(d.user);
          // fetch transactions
          fetch(`/api/users/transactions?userId=${d.user.id}`).then(r=>r.json()).then(t => setTransactions(t.transactions || []));
          // fetch vehicles
          fetch(`/api/vehicles?ownerId=${d.user.id}`).then(r=>r.json()).then(v => setVehicles(v.vehicles || []));
          // fetch categories
          fetch("/api/categories").then(r=>r.json()).then(c => setCategories(c.categories || []));
          // fetch call history
          fetch('/api/calls').then(r=>r.json()).then(c => setCallHistory(c.calls || []));

          setForm({
            name:        d.user.name || "",
            phone:       d.user.phone || "",
            address:     d.user.address || "",
            // vendor fields
            businessName: d.vendor?.name || d.user.businessName || "",
            category:    d.vendor?.category || d.user.category || "",
            description: d.vendor?.description || d.user.description || "",
            businessAddress: d.vendor?.address || d.user.address || "",
            // worker fields
            workerName: d.worker?.name || "",
            workerRole: d.worker?.role || "",
            workerCategory: d.worker?.category || "",
            workerArea: d.worker?.area || "",
            workerDailyRate: d.worker?.dailyRate || "",
            workerHourlyRate: d.worker?.hourlyRate || "",
            workerAvailability: d.worker?.availability ?? true,
            workerSkills: d.worker?.skills ? d.worker.skills.join(', ') : "",
            workerPhone: d.worker?.phone || d.user.phone || "",
            workerLwfId: d.worker?.lwfId || "",
            workerAadhaar: d.worker?.aadhaarNumber || "",
            workerBloodGroup: d.worker?.bloodGroup || "",
            workerState: d.worker?.state || "",
            workerDistrict: d.worker?.district || "",
          });
          if (d.worker) {
            setWorker(d.worker);
          }
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
        if (data.worker) setWorker(data.worker);
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
    localStorage.removeItem("gc_token");
    localStorage.removeItem("gc_user");
    window.location.href = "/login";
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
          ownerId: user.id,
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
        name: "Gaya Seva",
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
            setVehForm({ vehicleName: '', categoryId: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', isCommercial: true, liabilityAccepted: false });
            fetch(`/api/vehicles?ownerId=${user.id}`).then(r=>r.json()).then(v => setVehicles(v.vehicles || []));
            fetch(`/api/users/transactions?userId=${user.id}`).then(r=>r.json()).then(t => setTransactions(t.transactions || []));
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

  const toggleVehicleAvailability = async (vehicleId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'booked' : 'available';
    setVehicles(prev => prev.map(v => v._id === vehicleId ? { ...v, availability_status: newStatus } : v));
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability_status: newStatus }),
      });
      if (!res.ok) throw new Error();
    } catch (e) {
      setVehicles(prev => prev.map(v => v._id === vehicleId ? { ...v, availability_status: currentStatus } : v));
      alert("Failed to update availability");
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
    { id:"profile",      label:"Profile",        shortLabel:"Profile",     icon:User        },
    { id:"subscription", label:"Subscription",   shortLabel:"Premium",     icon:CreditCard  },
    ...(isVendor ? [{ id:"vendor", label:"My listing", shortLabel:"Vendor", icon:Store }] : []),
    ...(worker ? [{ id:"worker", label:"Worker Profile", shortLabel:"Worker", icon:Briefcase }] : []),
    { id:"vehicles",     label:"My Vehicles",    shortLabel:"Vehicles",    icon:Car         },
    { id:"calls",        label:"Call History",   shortLabel:"Calls",       icon:Phone       },
    { id:"settings",     label:"Settings",       shortLabel:"Settings",    icon:Shield      },
  ];

  return (
    <main className="bg-[#f3f5f9] min-h-screen pb-24 md:pb-12">
      {/* Premium Top Banner */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute top-0 -right-24 w-64 h-64 bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[5px] border-white shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative group">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <span className="text-4xl md:text-5xl font-extrabold text-indigo-600 font-['Sora',sans-serif]">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
              <h1 className="font-['Sora',sans-serif] text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                  isVendor ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/50" 
                           : "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/50"
                }`}>
                  {user.role}
                </span>
                {subActive && (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm shadow-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Premium
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-[14px] font-medium flex items-center justify-center md:justify-start gap-1.5">
              <Mail size={14} className="text-gray-600" /> {user.email}
            </p>
          </div>

          <button onClick={handleLogout}
            className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 text-[14px] font-semibold text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-6 py-2.5 rounded-2xl transition-all duration-300">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs - Desktop & Tablet */}
          <div className="hidden md:flex w-full lg:w-64 flex-col gap-2 flex-shrink-0">
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`group w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[14.5px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 translate-x-1"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                  }`}>
                  <Icon size={18} className={`transition-colors ${isActive ? "text-white" : "text-gray-600 group-hover:text-indigo-500"}`} /> 
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 px-2 pb-safe pt-2 flex items-center justify-between overflow-x-auto gap-1 no-scrollbar shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex flex-col items-center justify-center min-w-[72px] p-2 rounded-2xl transition-all duration-300 ${
                    isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-600"
                  }`}>
                  <div className={`p-1.5 rounded-xl mb-1 transition-all duration-300 ${isActive ? "bg-indigo-50 scale-110" : "bg-transparent scale-100"}`}>
                    <Icon size={22} className={isActive ? "fill-indigo-50/50" : ""} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide transition-all ${isActive ? "opacity-100" : "opacity-70 font-medium"}`}>
                    {t.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 pb-10">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
              {/* ── PROFILE TAB ── */}
              {tab === "profile" && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                    <h2 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg flex items-center gap-2">
                      <User className="text-indigo-600" size={20} /> Personal Information
                    </h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)}
                        className="flex items-center gap-2 text-[14px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold transition-colors">
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(false); }}
                          className="text-[14px] text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving}
                          className="flex items-center gap-2 text-[14px] bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-60">
                          <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>

                  {saved && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-5 py-3 mb-6 text-[14px] font-medium animate-in fade-in">
                      <CheckCircle size={18} /> Profile updated successfully!
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center overflow-hidden relative flex-shrink-0 group mx-auto sm:mx-0">
                      {form.profileImage || user.profileImage ? (
                        <img src={form.profileImage || user.profileImage} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="text-gray-600 font-bold text-4xl font-['Sora',sans-serif]">{(form.name || user.name)?.[0]?.toUpperCase() || "U"}</span>
                      )}
                      {editing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit3 size={24} className="text-white" />
                        </div>
                      )}
                    </div>
                    {editing && (
                      <div className="text-center sm:text-left">
                        <input type="file" id="profilePic" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
                        <label htmlFor="profilePic" className="cursor-pointer inline-flex items-center gap-2 bg-white border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-[14px] font-bold text-gray-700 hover:text-indigo-600 px-5 py-2.5 rounded-xl transition-all">
                          Upload New Photo
                        </label>
                        <p className="text-[12px] text-gray-600 mt-2 font-medium">JPG/JPEG only. Max 50KB.</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label:"Full Name",   key:"name",  icon:User,    type:"text",  editable: true },
                      { label:"Phone Number",key:"phone", icon:Phone,   type:"tel",   editable: false },
                      { label:"Address",     key:"address", icon:MapPin,  type:"text",  editable: true },
                    ].map(f => {
                      const Icon = f.icon;
                      return (
                        <div key={f.key} className="relative">
                          <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">{f.label}</label>
                          {editing && f.editable !== false ? (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icon size={18} className="text-indigo-400" />
                              </div>
                              <input type={f.type} value={form[f.key]}
                                onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                                className="w-full bg-white border-2 border-gray-100 focus:border-indigo-500 rounded-2xl pl-11 pr-4 py-3.5 text-[15px] font-medium text-gray-800 outline-none transition-all shadow-sm focus:shadow-md" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5">
                              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                                <Icon size={16} className="text-indigo-500" />
                              </div>
                              <span className="text-[15px] font-medium text-gray-800">{user[f.key] || "—"}</span>
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
                <div className="space-y-6">
                  {/* Status card */}
                  <div className={`rounded-3xl p-6 md:p-8 border-2 shadow-sm relative overflow-hidden ${
                    subActive
                      ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100"
                      : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100"
                  }`}>
                    <div className="absolute -right-10 -top-10 opacity-10">
                      {subActive ? <CheckCircle size={150} /> : <AlertTriangle size={150} />}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                        subActive ? "bg-white text-emerald-500" : "bg-white text-orange-500"
                      }`}>
                        {subActive
                          ? <CheckCircle size={32} />
                          : <AlertTriangle size={32} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-['Sora',sans-serif] font-bold text-xl md:text-2xl text-gray-900 mb-2 tracking-tight">
                          {subActive ? "Subscription Active" : "No Active Subscription"}
                        </h3>
                        <p className="text-[15px] text-gray-600 font-medium">
                          {subActive
                            ? `Your premium access is valid for ${daysLeft} more days. Expires on ${new Date(user.subscriptionExpiry).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}.`
                            : "Subscribe for ₹11/month to unlock all vendor contacts, exclusive offers, and local workforce listings directly."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* What you get */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                      <Shield className="text-indigo-500" size={20} /> What's included in Premium
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {[
                        "View all vendor contact numbers (2,400+ vendors)",
                        "Access all local offers & discounts",
                        "Contact local workers directly",
                        "Unlimited searches across Gaya district",
                        "Priority customer support",
                      ].map((f, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-[14.5px] font-medium text-gray-700 bg-gray-50 p-4 rounded-2xl">
                          <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                    </div>

                    <button onClick={() => setIsSubModalOpen(true)}
                      className="block w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-bold text-[16px] py-4 rounded-2xl transition-all shadow-xl shadow-gray-900/20 text-center">
                      {subActive ? "Renew Subscription Now" : "Subscribe to Premium for ₹11/mo"}
                    </button>
                  </div>

                  {/* Payment history */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                      <CreditCard className="text-indigo-500" size={20} /> Payment History
                    </h3>
                    <div className="space-y-3">
                      {transactions.length > 0 ? transactions.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center shrink-0">
                              <CreditCard size={16} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="text-[15px] font-bold text-gray-900 capitalize">{p.purpose.replace('_', ' ')}</div>
                              <div className="text-[12.5px] font-medium text-gray-700 mt-0.5">{new Date(p.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-gray-900 text-[16px]">₹{p.amount}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full mt-1 uppercase tracking-wider">Paid</span>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
                          <p className="text-[14px] text-gray-700 font-medium">No payment history available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── VEHICLES TAB ── */}
              {tab === "vehicles" && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h2 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                      <Car className="text-indigo-600" size={20} /> Post Vehicle for Rent
                    </h2>
                    <form onSubmit={handlePostVehicle} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                          <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Vehicle Category</label>
                          <select required value={vehForm.categoryId} onChange={e => setVehForm({...vehForm, categoryId: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-[14px] font-medium text-gray-800 outline-none transition-all appearance-none cursor-pointer">
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="relative">
                          <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Vehicle Name</label>
                          <input required type="text" value={vehForm.vehicleName} onChange={e => setVehForm({...vehForm, vehicleName: e.target.value})} placeholder="e.g. Maruti Swift Dzire" className="w-full bg-white border-2 border-gray-100 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-[14px] font-medium text-gray-800 outline-none transition-all shadow-sm focus:shadow-md" />
                        </div>
                        <div className="relative">
                          <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Vehicle Model / Year</label>
                          <input required type="text" value={vehForm.vehicleModel} onChange={e => setVehForm({...vehForm, vehicleModel: e.target.value})} placeholder="e.g. 2021 VXI" className="w-full bg-white border-2 border-gray-100 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-[14px] font-medium text-gray-800 outline-none transition-all shadow-sm focus:shadow-md" />
                        </div>
                        <div className="relative">
                          <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Vehicle Number</label>
                          <input required type="text" value={vehForm.vehicleNumber} onChange={e => setVehForm({...vehForm, vehicleNumber: e.target.value})} placeholder="e.g. BR 02 XX 1234" className="w-full bg-white border-2 border-gray-100 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-[14px] font-medium text-gray-800 outline-none transition-all shadow-sm focus:shadow-md" />
                        </div>
                        <div className="relative md:col-span-2">
                          <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Driving License No.</label>
                          <input required type="text" value={vehForm.dlNumber} onChange={e => setVehForm({...vehForm, dlNumber: e.target.value})} placeholder="e.g. BR02XXXXXXXXX" className="w-full bg-white border-2 border-gray-100 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-[14px] font-medium text-gray-800 outline-none transition-all shadow-sm focus:shadow-md" />
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5">
                        <label className="flex items-start gap-4 cursor-pointer">
                          <div className="relative flex items-center pt-0.5">
                            <input required type="checkbox" checked={vehForm.liabilityAccepted} onChange={e => setVehForm({...vehForm, liabilityAccepted: e.target.checked})} className="peer w-5 h-5 appearance-none border-2 border-amber-300 rounded bg-white checked:bg-amber-500 checked:border-amber-500 transition-colors cursor-pointer" />
                            <CheckCircle size={14} className="absolute left-0.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
                          </div>
                          <div className="text-[13px] text-amber-900 leading-relaxed font-medium">
                            <strong>Terms & Conditions:</strong> I confirm this is a commercial vehicle. I assume all liabilities, risks, and responsibilities associated with renting out this vehicle. Gaya Seva is only a listing platform and holds no responsibility for damages or disputes.
                          </div>
                        </label>
                      </div>

                      <button type="submit" disabled={postingVeh} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[16px] py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60 flex justify-center items-center gap-2">
                        <Truck size={20} /> {postingVeh ? "Processing..." : "Pay ₹200 & Post Vehicle"}
                      </button>
                    </form>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg mb-6">My Posted Vehicles</h3>
                    <div className="space-y-4">
                      {vehicles.length > 0 ? vehicles.map((v) => {
                        const isAvailable = !v.availability_status || v.availability_status === 'available';
                        return (
                        <div key={v._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 bg-gray-50/50 hover:bg-gray-50 rounded-2xl gap-5 transition-colors">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white border border-gray-100 shadow-sm text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                              <Truck size={24} />
                            </div>
                            <div>
                              <div className="font-bold text-[16px] text-gray-900 flex items-center gap-3 mb-1">
                                {v.vehicleName}
                                <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                  v.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                                  v.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {v.status}
                                </span>
                              </div>
                              <div className="text-[13.5px] font-medium text-gray-700 flex items-center gap-2">
                                <span className="bg-white border border-gray-200 shadow-sm px-2.5 py-0.5 rounded-lg text-gray-700 font-bold tracking-wide">{v.vehicleNumber}</span>
                                &bull; {v.vehicleModel}
                              </div>
                            </div>
                          </div>
                          
                          {v.status === 'approved' && (
                            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-200 pt-4 md:pt-0 w-full md:w-auto mt-2 md:mt-0">
                              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Status</span>
                              <div 
                                onClick={() => toggleVehicleAvailability(v._id, v.availability_status || 'available')}
                                className={`relative w-28 h-9 rounded-full cursor-pointer transition-colors border-2 ${
                                  isAvailable ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'
                                }`}
                              >
                                <div className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                                  isAvailable ? 'bg-emerald-500 left-0.5 translate-x-0' : 'bg-red-500 left-0.5 translate-x-[72px]'
                                }`}>
                                </div>
                                <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                                  isAvailable ? 'text-emerald-700 right-3' : 'text-red-700 left-3'
                                }`}>
                                  {isAvailable ? 'READY' : 'IN USE'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <Car size={32} className="text-gray-300 mx-auto mb-3" />
                          <p className="text-[14px] text-gray-700 font-medium">You haven't posted any vehicles yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── VENDOR TAB ── */}
              {tab === "vendor" && isVendor && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                    <h2 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Store className="text-indigo-600" size={20} /> Business Listing
                    </h2>
                    <Link href="/vendor/dashboard"
                      className="flex items-center gap-2 text-[14px] bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gray-900/20">
                      <Store size={16} /> Open Dashboard
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label:"Business Name", key:"businessName" },
                      { label:"Category",      key:"category"     },
                      { label:"Business Address", key:"businessAddress", full: true },
                    ].map(f => (
                      <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">{f.label}</label>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-[15px] font-medium text-gray-800">
                          {form[f.key] || "—"}
                        </div>
                      </div>
                    ))}
                    <div className="md:col-span-2 mt-2">
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Description</label>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-[15px] font-medium text-gray-700 leading-relaxed min-h-[100px]">
                        {form.description || "No description added yet."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── WORKER TAB ── */}
              {tab === "worker" && worker && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                    <h2 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Briefcase className="text-indigo-600" size={20} /> Local Worker Profile
                    </h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)}
                        className="flex items-center gap-2 text-[14px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold transition-colors">
                        <Edit3 size={16} /> Edit Details
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(false); }}
                          className="text-[14px] text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving}
                          className="flex items-center gap-2 text-[14px] bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-60">
                          <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>

                  {saved && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-5 py-3 mb-6 text-[14px] font-medium animate-in fade-in">
                      <CheckCircle size={18} /> Worker profile updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label:"Worker Name",   key:"workerName",  type:"text" },
                      { label:"Phone Number",  key:"workerPhone", type:"tel" },
                      { label:"Local Workforce ID", key:"workerLwfId", type:"text", readOnly: true },
                      { label:"Aadhaar Number",key:"workerAadhaar", type:"text" },
                      { label:"Blood Group",   key:"workerBloodGroup", type:"text" },
                      { label:"State",         key:"workerState", type:"text" },
                      { label:"District",      key:"workerDistrict", type:"text" },
                      { label:"Role/Category", key:"workerRole",  type:"text" },
                      { label:"Skill/Specialization", key:"workerSkills", type:"text" },
                      { label:"Service Area",  key:"workerArea",  type:"text" },
                      { label:"Daily Rate (₹)",key:"workerDailyRate", type:"number" },
                      { label:"Hourly Rate (₹)",key:"workerHourlyRate", type:"number" },
                    ].map(f => (
                      <div key={f.key} className="relative">
                        <label className="block text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wider">{f.label}</label>
                        {editing && !f.readOnly ? (
                          <input type={f.type} value={form[f.key]}
                            onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                            className="w-full bg-white border-2 border-gray-100 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-[15px] font-medium text-gray-800 outline-none transition-all shadow-sm focus:shadow-md" />
                        ) : (
                          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-[15px] font-medium text-gray-800">
                            {form[f.key] || "—"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between p-5 border border-gray-100 bg-gray-50 rounded-2xl">
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-900 mb-1">Availability Status</h4>
                      <p className="text-[12px] text-gray-700 font-medium">Toggle this if you are currently booked or unavailable.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer border-2 ${form.workerAvailability ? "bg-emerald-50 border-emerald-500" : "bg-gray-100 border-gray-300"}`}
                           onClick={async () => {
                             const newStatus = !form.workerAvailability;
                             setForm(p => ({...p, workerAvailability: newStatus}));
                             if (!editing) {
                               try {
                                 await fetch("/api/profile", {
                                   method: "PUT",
                                   headers: { "Content-Type": "application/json" },
                                   body: JSON.stringify({ ...form, workerAvailability: newStatus }),
                                 });
                               } catch (err) {
                                 setForm(p => ({...p, workerAvailability: !newStatus}));
                               }
                             }
                           }}>
                        <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white shadow-sm rounded-full transition-transform duration-300 ${form.workerAvailability ? "left-0.5 translate-x-6 bg-emerald-500" : "left-0.5 translate-x-0 bg-gray-400"}`} />
                      </div>
                      <span className={`text-[12px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider ${form.workerAvailability ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                        {form.workerAvailability ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CALL HISTORY TAB ── */}
              {tab === "calls" && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                    <Phone className="text-indigo-600" size={20} /> Your Contact History
                  </h2>
                  <div className="space-y-4">
                    {callHistory.length > 0 ? callHistory.map((call) => (
                      <div key={call._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 border border-gray-100 bg-gray-50 hover:bg-white rounded-2xl gap-4 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                            call.actionType === 'WhatsApp' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            <Phone size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-[15.5px] text-gray-900 mb-0.5">{call.receiverName}</div>
                            <div className="text-[13px] font-medium text-gray-700 capitalize flex items-center gap-2">
                              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">{call.receiverType}</span> 
                              {call.receiverPhone}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm mb-1.5 ${
                            call.actionType === 'WhatsApp' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {call.actionType}
                          </div>
                          <div className="text-[12px] text-gray-600 font-medium flex items-center gap-1.5">
                            <Clock size={12} />
                            {new Date(call.createdAt).toLocaleString("en-IN", {
                              day: "numeric", month: "short", hour: "numeric", minute: "2-digit"
                            })}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="inline-flex w-16 h-16 rounded-full bg-white shadow-sm items-center justify-center text-gray-300 mb-4">
                          <Phone size={28} />
                        </div>
                        <h4 className="text-[16px] font-bold text-gray-900 mb-1">No Contact History</h4>
                        <p className="text-[14px] text-gray-700 font-medium">You haven't contacted any professionals yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── SETTINGS TAB ── */}
              {tab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h2 className="font-['Sora',sans-serif] font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                      <Shield className="text-indigo-600" size={20} /> Account Settings
                    </h2>
                    <div className="space-y-2">
                      {[
                        { label:"Email notifications", sub:"Get updates about new offers and vendors", enabled:true },
                        { label:"WhatsApp alerts",     sub:"Receive alerts on WhatsApp",               enabled:false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                          <div>
                            <div className="text-[15px] font-bold text-gray-800 mb-0.5">{s.label}</div>
                            <div className="text-[13px] text-gray-700 font-medium">{s.sub}</div>
                          </div>
                          <div className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer border-2 ${s.enabled ? "bg-indigo-600 border-indigo-600" : "bg-gray-100 border-gray-300"}`}>
                            <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${s.enabled ? "left-0.5 translate-x-6" : "left-0.5 translate-x-0"}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-red-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-5">
                      <AlertTriangle size={120} className="text-red-600" />
                    </div>
                    <div className="relative z-10">
                      <h2 className="font-['Sora',sans-serif] font-bold text-red-600 text-lg mb-2 flex items-center gap-2">
                        <Trash2 size={20} /> Danger Zone
                      </h2>
                      <p className="text-[14px] text-gray-600 font-medium mb-6 max-w-md">Once you delete your account, all your personal data, listings, and history will be permanently removed. This action cannot be undone.</p>
                      <button 
                        onClick={handleDeleteRequest}
                        disabled={requestingDelete}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 cursor-pointer text-[14.5px] font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 w-full sm:w-auto shadow-sm">
                        <Trash2 size={18} /> 
                        {requestingDelete ? "Processing Deletion..." : "Permanently Delete My Account"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
    </main>
  );
}
