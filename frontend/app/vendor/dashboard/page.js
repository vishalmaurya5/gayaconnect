'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiTrendingUp, FiCheckCircle, FiDollarSign, FiClock, FiSettings, FiImage, FiGift, FiBriefcase, FiTrash2, FiTag, FiCreditCard, FiTruck, FiEdit2, FiSave, FiX, FiDownload, FiPrinter } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

export default function VendorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', businessName: '', address: '', instagram: '', facebook: '', experience: '', workingHours: '', services: '', profileImage: '' });
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef(null);

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;
    setIsDownloading(true);
    try {
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      const canvas = await window.html2canvas(qrRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `Vendor-QR-${vendorDetails?.name || user?.businessName || 'Business'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success("QR Code downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download QR code");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Standee</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: flex-start; background: #f1f5f9; font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .card { 
              width: 100%; max-width: 380px; text-align: center; 
              border-radius: 32px; 
              background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 50%, #fef3c7 100%);
              position: relative; overflow: hidden;
              box-shadow: 0 20px 50px rgba(0,0,0,0.15);
              padding: 12px;
              height: max-content;
            }
            .card-inner {
              background: white; border-radius: 24px; overflow: hidden;
              box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
              position: relative; z-index: 5;
            }
            .header { 
              background: white; 
              padding: 24px 16px 16px 16px; border-bottom: 3px solid #f1f5f9; border-top-left-radius: 24px; border-top-right-radius: 24px;
              position: relative;
            }
            .logo-container { background: white; padding: 6px; border-radius: 50%; display: inline-block; margin-bottom: 12px; position: relative; z-index: 10; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
            .logo { width: 50px; height: 50px; border-radius: 50%; }
            .brand-title { font-weight: 900; font-size: 28px; letter-spacing: 0px; margin: 0 0 4px 0; line-height: 1; display: flex; justify-content: center; }
            .text-gaya { color: #1e293b; }
            .text-seva { color: #f59e0b; }
            .tagline { color: #334155; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin: 0; }
            
            .content { position: relative; z-index: 20; margin-top: 24px; padding: 0 20px; display: flex; flex-direction: column; align-items: center; }
            .badge { background: white; color: #059669; padding: 6px 16px; border-radius: 20px; font-weight: 900; font-size: 12px; display: inline-block; margin: 0 auto 16px auto; border: 2px solid #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { font-size: 24px; margin: 0 0 16px 0; font-weight: 900; color: #1e293b; text-transform: uppercase; word-break: break-word; border-bottom: 2px dashed #e2e8f0; padding-bottom: 12px; }
            
            .qr-container { background: white; padding: 8px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.1); margin: 0 auto 24px auto; display: inline-block; position: relative; border: 2px solid #e0e7ff; }
            .qr-image { width: 200px; height: 200px; }
            .qr-logo { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: white; padding: 4px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 2px solid #f59e0b; }
            
            .corner { position: absolute; width: 24px; height: 24px; border: 4px solid #4f46e5; margin: 4px; }
            .tl { top: 0; left: 0; border-right: none; border-bottom: none; border-top-left-radius: 12px; }
            .tr { top: 0; right: 0; border-left: none; border-bottom: none; border-top-right-radius: 12px; }
            .bl { bottom: 0; left: 0; border-right: none; border-top: none; border-bottom-left-radius: 12px; }
            .br { bottom: 0; right: 0; border-left: none; border-top: none; border-bottom-right-radius: 12px; }

            .footer { background: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; margin-top: auto; }
            .footer strong { display: block; font-size: 14px; margin-bottom: 8px; color: #312e81; text-transform: uppercase; letter-spacing: 1px; font-weight: 900; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-inner">
              <div class="header">
              <div class="logo-container">
                <img src="${window.location.origin}/gaya_seva_app_icon.png" class="logo" />
              </div>
              <div class="brand-title">
                <span class="text-gaya">Gaya</span><span class="text-seva">Seva</span>
              </div>
              <p class="tagline">Zarurat Aapki, Seva Hamari</p>
            </div>
            
            <div class="content">
              <div class="badge">✓ VERIFIED PARTNER</div>
              <h1>${vendorDetails?.name || user?.businessName || 'Your Business Name'}</h1>
              
              <div class="qr-container">
                <div class="corner tl"></div><div class="corner tr"></div>
                <div class="corner bl"></div><div class="corner br"></div>
                <img src="https://quickchart.io/qr?text=${encodeURIComponent(window.location.origin + '/vendors/' + vendorDetails._id + '/rate')}&size=300&margin=1" class="qr-image" crossorigin="anonymous" />
                <img src="${window.location.origin}/gaya_seva_app_icon.png" class="qr-logo" />
              </div>
            </div>

            <div class="footer">
              <strong>SCAN TO RATE & REVIEW</strong>
              <div style="display: flex; justify-content: center; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">
                <span style="margin: 0 8px;">✓ SAFE</span>
                <span style="margin: 0 8px;">✓ TRUSTED</span>
                <span style="margin: 0 8px;">✓ VERIFIED</span>
              </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 1500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const { user, setUser } = useAuth();
  
  const subActive = user?.subscriptionActive && new Date(user?.subscriptionExpiry) > new Date();
  const daysLeft = user?.subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  useEffect(() => { 
    fetch('/api/bookings/vendor')
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .catch(console.error); 
      
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setVendorDetails(data.vendor);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProfile(false);
      });
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/offers?vendorId=${user.id}&all=true`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setOffers(data.offers);
        })
        .catch(console.error);
        
      fetch(`/api/users/transactions?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setTransactions(data.transactions);
        })
        .catch(console.error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (vendorDetails?._id) {
      fetch(`/api/jobs?vendorId=${vendorDetails._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setJobs(data.jobs);
        })
        .catch(console.error);
    }
  }, [vendorDetails?._id]);

  const handleDeleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOffers(prev => prev.filter(o => o._id !== offerId));
      } else {
        alert(data.message || 'Failed to delete offer');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting offer');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this posting?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.filter(j => j._id !== id));
      } else {
        alert(data.message || 'Failed to delete posting');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting posting');
    }
  };

  const completed = bookings.filter((b) => b.status === 'completed').length;
  const revenue = bookings.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + Number(b.servicePrice || 0), 0);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 100 * 1024) {
      toast.error('File size must be less than 100KB');
      return;
    }
    if (!file.type.startsWith('image/jpeg')) {
      toast.error('Only JPG/JPEG files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditForm(prev => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditForm({
        name: user?.name || '',
        businessName: vendorDetails?.name || user?.businessName || '',
        address: vendorDetails?.address || user?.address || '',
        instagram: vendorDetails?.instagram || '',
        facebook: vendorDetails?.facebook || '',
        experience: vendorDetails?.experience || '',
        workingHours: vendorDetails?.workingHours || '',
        services: vendorDetails?.services?.join(', ') || '',
        profileImage: vendorDetails?.images?.[0] || user?.profileImage || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const payload = {
        name: editForm.name,
        businessName: editForm.businessName,
        address: editForm.address,
        businessAddress: editForm.address,
        instagram: editForm.instagram,
        facebook: editForm.facebook,
        experience: editForm.experience,
        workingHours: editForm.workingHours,
        services: editForm.services,
        phone: user?.phone,
        profileImage: editForm.profileImage
      };
      
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Profile updated successfully!");
        if (setUser) setUser(data.user);
        if (data.vendor) setVendorDetails(data.vendor);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setSavingProfile(false);
    }
  };

  const getPlanName = (plan) => {
    if (!plan) return 'Payment';
    if (plan.includes('banner')) return 'Banner Advertisement';
    if (plan.includes('user_monthly')) return 'Monthly Subscription';
    if (plan === 'offer_post_7days') return 'Offer Post (7 Days)';
    if (plan === 'offer_post_30days') return 'Offer Post (30 Days)';
    if (plan === 'offer_post') return 'Offer Post (Lifetime)';
    return plan.replace(/_/g, ' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf3] via-[#f4fce8] to-[#e8f5e9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header & Details Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] items-start">
          <div className="rounded-3xl bg-white/60 p-6 shadow-sm backdrop-blur-xl border border-green-200/50 flex flex-col">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-green-600">Overview</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Welcome, {user?.name || 'Vendor'}</h1>
              <p className="mt-1 text-slate-600 text-sm">Here is what is happening with your business today.</p>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/offers/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-5 py-2.5 font-bold text-yellow-950 shadow-md transition hover:scale-105 hover:shadow-lg">
                <FiGift /> Post Offer
              </Link>
              <Link href="/vendor/dashboard/jobs" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                <FiBriefcase /> Jobs & Sales
              </Link>
              {subActive ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md">
                  <FiCheckCircle /> Subscribed ({daysLeft} days)
                </div>
              ) : (
                <button onClick={() => setIsSubModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                  <FiDollarSign /> Subscription
                </button>
              )}
              
              {(() => {
                if (vendorDetails?.bannerStatus === 'approved') {
                  return (
                    <Link href="/vendor/banners/upload" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                      <FiImage /> Upload Banner
                    </Link>
                  );
                } else if (vendorDetails?.bannerStatus === 'pending') {
                  return (
                    <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 font-bold text-amber-950 shadow-md">
                      <FiClock /> Banner Pending
                    </span>
                  );
                } else {
                  return (
                    <Link href="/vendor/banners/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                      <FiImage /> Post Banner Ad
                    </Link>
                  );
                }
              })()}
              <Link href="/vendor/dashboard/vehicles" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                <FiTruck /> Post Vehicle
              </Link>

            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur-xl border border-yellow-200/50 flex flex-col justify-center min-w-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Business Details</h2>
              {!isEditing ? (
                <button onClick={handleEditToggle} className="text-xs flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition">
                  <FiEdit2 /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleEditToggle} className="text-xs flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition">
                    <FiX /> Cancel
                  </button>
                  <button onClick={handleSaveProfile} disabled={savingProfile} className="text-xs flex items-center gap-1 font-semibold text-white bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-700 transition disabled:opacity-50">
                    <FiSave /> {savingProfile ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            
            {loadingProfile ? (
              <div className="h-20 animate-pulse bg-slate-100 rounded-xl"></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Registration Code</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{vendorDetails?.regCode || user?.regCode || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Owner Name</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900">{user?.name}</span>
                  ) : (
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-500 font-semibold mb-1">Profile Photo (Max 100KB, JPEG only)</span>
                  {!isEditing ? (
                    vendorDetails?.images?.[0] || user?.profileImage ? (
                      <img src={vendorDetails?.images?.[0] || user?.profileImage} alt="Profile" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <span className="font-bold text-slate-900">No photo uploaded</span>
                    )
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {editForm.profileImage ? (
                         <img src={editForm.profileImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-indigo-200" />
                      ) : (
                         <div className="h-16 w-16 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center text-xs text-slate-400">No Image</div>
                      )}
                      <input type="file" accept=".jpg,.jpeg" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-500 font-semibold mb-1">Business Name</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900">{vendorDetails?.name || user?.businessName || 'Please set in profile'}</span>
                  ) : (
                    <input type="text" value={editForm.businessName} onChange={e => setEditForm({...editForm, businessName: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-500 font-semibold mb-1">Address</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900">{vendorDetails?.address || user?.address || 'N/A'}</span>
                  ) : (
                    <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Instagram Link</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900 break-all">
                      {vendorDetails?.instagram ? <a href={vendorDetails.instagram} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{vendorDetails.instagram}</a> : 'N/A'}
                    </span>
                  ) : (
                    <input type="url" placeholder="https://instagram.com/..." value={editForm.instagram} onChange={e => setEditForm({...editForm, instagram: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Facebook Link</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900 break-all">
                      {vendorDetails?.facebook ? <a href={vendorDetails.facebook} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{vendorDetails.facebook}</a> : 'N/A'}
                    </span>
                  ) : (
                    <input type="url" placeholder="https://facebook.com/..." value={editForm.facebook} onChange={e => setEditForm({...editForm, facebook: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Experience</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900">{vendorDetails?.experience || 'N/A'}</span>
                  ) : (
                    <input type="text" placeholder="e.g., 5+ years" value={editForm.experience} onChange={e => setEditForm({...editForm, experience: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Working Hours</span>
                  {!isEditing ? (
                    <span className="font-bold text-slate-900">{vendorDetails?.workingHours || 'N/A'}</span>
                  ) : (
                    <input type="text" placeholder="e.g., Mon-Sat, 9AM-8PM" value={editForm.workingHours} onChange={e => setEditForm({...editForm, workingHours: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-500 font-semibold mb-1">Services Offered</span>
                  {!isEditing ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {vendorDetails?.services?.length > 0 ? (
                        vendorDetails.services.map(s => <span key={s} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded">{s}</span>)
                      ) : (
                        <span className="font-bold text-slate-900">N/A</span>
                      )}
                    </div>
                  ) : (
                    <input type="text" placeholder="e.g., Plumbing, Wiring, Repair (comma separated)" value={editForm.services} onChange={e => setEditForm({...editForm, services: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-indigo-500" />
                  )}
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold">Email</span>
                  <span className="font-bold text-slate-900 truncate block">{user?.email}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold">Phone</span>
                  <span className="font-bold text-slate-900">{user?.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-500 font-semibold mt-1">User Subscription</span>
                  <span className={`font-bold ${subActive ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {subActive ? `Active (${daysLeft} days remaining)` : 'No active subscription'}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
        </div>

        {/* Vendor Rating QR Card */}
        {vendorDetails?._id && (
          <div className="mt-8 rounded-3xl border border-indigo-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden print:hidden">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <FiTag className="text-xl" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">Your Rating QR Code</h2>
                </div>
                <p className="text-slate-600 mb-6 max-w-lg">
                  Print or download this official QR code. Ask your customers to scan it to securely rate your services directly on the Gaya Seva platform.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleDownloadQR}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isDownloading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <FiDownload />}
                    Download Image
                  </button>
                  <button 
                    onClick={handlePrintQR}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition shadow-sm"
                  >
                    <FiPrinter />
                    Print
                  </button>
                </div>
              </div>

              {/* QR Preview (Hidden on print, we will render it natively on print via popup window) */}
              <div className="shrink-0 relative rounded-[32px] p-3 bg-gradient-to-br from-indigo-100 via-white to-amber-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] min-w-[320px] max-w-[340px]" ref={qrRef}>
                <div className="bg-white rounded-[24px] overflow-hidden flex flex-col items-center text-center w-full border border-white shadow-sm relative">
                  <div className="w-full bg-white pt-6 pb-6 px-4 relative flex flex-col items-center border-b-[3px] border-slate-100 rounded-t-[20px]">
                    <div className="bg-white p-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] mb-3 border border-slate-100">
                      <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Logo" className="w-12 h-12 object-contain rounded-full" />
                    </div>
                    <h3 className="font-black text-[28px] tracking-tight flex items-center justify-center leading-none mb-1.5 w-full">
                      <span className="text-[#1e293b]">Gaya</span>
                      <span className="text-[#f59e0b]">Seva</span>
                    </h3>
                    <p className="text-[9px] text-[#334155] font-black uppercase tracking-[0.25em]">Zarurat Aapki, Seva Hamari</p>
                  </div>

                  <div className="w-full relative z-20 mt-6 flex flex-col items-center px-4">
                    <div className="bg-white border-2 border-emerald-500 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black shadow-md flex items-center justify-center mb-4 inline-flex">
                      <FiCheckCircle className="text-emerald-500 text-sm mr-1.5" /> VERIFIED PARTNER
                    </div>
                    <div className="w-full flex justify-center mb-5 px-3">
                      <h2 className="text-[20px] font-extrabold text-[#1e293b] text-center leading-snug tracking-tight max-w-[280px] break-words uppercase border-b-2 border-dashed border-slate-200 pb-3">
                        {vendorDetails?.name || user?.businessName || 'Business Name'}
                      </h2>
                    </div>

                    <div className="bg-white p-2 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] border-2 border-indigo-100 mb-6 relative">
                      <img 
                        src={`https://quickchart.io/qr?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/vendors/' + vendorDetails._id + '/rate' : '')}&size=300&margin=1`} 
                        alt="QR Code" 
                        className="w-48 h-48 rounded-xl object-contain"
                        crossOrigin="anonymous" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white p-1 rounded-full shadow-md border-2 border-[#f59e0b]">
                          <img src="/gaya_seva_app_icon.png" alt="Icon" className="w-8 h-8 object-contain rounded-full" />
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-600 rounded-tl-xl m-1"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-600 rounded-tr-xl m-1"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-600 rounded-bl-xl m-1"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-600 rounded-br-xl m-1"></div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-50 border-t border-slate-200 p-4 mt-auto">
                    <p className="text-indigo-900 font-black text-sm mb-2 uppercase tracking-wider w-full text-center">Scan To Rate & Review</p>
                    <div className="flex items-center justify-center text-slate-500">
                      <span className="flex items-center text-[10px] font-bold uppercase mx-2"><FiCheckCircle className="text-emerald-500 mr-1" /> Safe</span>
                      <span className="flex items-center text-[10px] font-bold uppercase mx-2"><FiCheckCircle className="text-indigo-500 mr-1" /> Trusted</span>
                      <span className="flex items-center text-[10px] font-bold uppercase mx-2"><FiCheckCircle className="text-amber-500 mr-1" /> Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Offers Section */}
        <div className="mt-8 rounded-3xl border border-yellow-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-100 blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <FiGift className="text-xl" />
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">My Offers</h2>
              </div>
              <Link href="/offers/new" className="text-sm font-bold text-yellow-700 hover:text-yellow-800 transition underline underline-offset-4">
                + Post New Offer
              </Link>
            </div>
            
            <div className="space-y-4">
              {offers.length > 0 ? (
                offers.map((offer) => {
                  const isValid = !offer.validUntil || new Date(offer.validUntil) > new Date();
                  return (
                    <div key={offer._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-yellow-200/50 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-lg">{offer.title}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {isValid ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{offer.description}</p>
                        <div className="mt-2 text-xs font-semibold text-slate-400">
                          Validity: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'Lifetime'}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center gap-3 shrink-0">
                        <button 
                          onClick={() => handleDeleteOffer(offer._id)}
                          className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-yellow-200 bg-yellow-50/50 p-10 text-center">
                  <FiGift className="mx-auto text-4xl text-yellow-300" />
                  <h3 className="mt-4 font-bold text-slate-900 text-lg">No offers posted</h3>
                  <p className="mt-1 text-slate-500">Create promotional offers to attract more customers.</p>
                  <Link href="/offers/new" className="mt-4 inline-block rounded-xl bg-yellow-400 px-6 py-2 font-bold text-yellow-950 shadow-sm hover:bg-yellow-500 transition">
                    Create Offer
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jobs & Sales Section */}
        <div className="mt-8 rounded-3xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FiBriefcase className="text-xl" />
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Jobs & Sales</h2>
              </div>
              <Link href="/vendor/dashboard/jobs" className="text-sm font-bold text-blue-700 hover:text-blue-800 transition underline underline-offset-4">
                + Post New
              </Link>
            </div>
            
            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-blue-200/50 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${job.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {job.type}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-1">{job.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        {job.salaryOrPrice && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                            <FiTag className="text-slate-400" /> {job.salaryOrPrice}
                          </div>
                        )}
                        {job.location && (
                          <div className="text-xs text-slate-500">📍 {job.location}</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center gap-3 shrink-0">
                      <button 
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-10 text-center">
                  <FiBriefcase className="mx-auto text-4xl text-blue-300" />
                  <h3 className="mt-4 font-bold text-slate-900 text-lg">No Jobs or Sales</h3>
                  <p className="mt-1 text-slate-500">Post job openings or items for sale to the marketplace.</p>
                  <Link href="/vendor/dashboard/jobs" className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2 font-bold text-white shadow-sm hover:bg-blue-700 transition">
                    Create Post
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="mt-8 rounded-3xl border border-purple-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-purple-100 blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <FiCreditCard className="text-xl" />
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Payment History</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-purple-200/50 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-purple-600 text-white shadow-sm">
                          {getPlanName(tx.plan || tx.type)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{new Date(tx.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mt-2">₹{tx.amount}</h3>
                      <p className="text-sm text-slate-600 mt-0.5 font-medium">Transaction ID: <span className="font-mono text-slate-500">{tx.paymentId || tx.orderId || 'N/A'}</span></p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
                        <FiCheckCircle /> Successful
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-10 text-center">
                  <FiCreditCard className="mx-auto text-4xl text-purple-300" />
                  <h3 className="mt-4 font-bold text-slate-900 text-lg">No Transactions</h3>
                  <p className="mt-1 text-slate-500">You haven't made any payments yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
    </div>
  );
}
