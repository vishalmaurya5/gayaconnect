'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTrendingUp, FiCheckCircle, FiDollarSign, FiClock, FiSettings, FiImage, FiGift, FiBriefcase, FiTrash2, FiTag, FiCreditCard, FiTruck, FiEdit2, FiSave, FiX } from 'react-icons/fi';
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
