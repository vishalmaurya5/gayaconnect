'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTrendingUp, FiCheckCircle, FiDollarSign, FiClock, FiSettings, FiImage, FiGift } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

export default function VendorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { user } = useAuth();
  
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

  const completed = bookings.filter((b) => b.status === 'completed').length;
  const revenue = bookings.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + Number(b.servicePrice || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf3] via-[#f4fce8] to-[#e8f5e9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header & Details Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="rounded-3xl bg-white/60 p-6 shadow-sm backdrop-blur-xl border border-green-200/50 flex flex-col justify-between">
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
              
              {(() => {
                return user?.hasBannerPostAccess ? (
                  <Link href="/vendor/banners/upload" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                    <FiImage /> Upload Banner
                  </Link>
                ) : (
                  <Link href="/vendor/banners/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                    <FiImage /> Post Banner Ad
                  </Link>
                )
              })()}
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur-xl border border-yellow-200/50 flex flex-col justify-center min-w-[300px]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Business Details</h2>
            {loadingProfile ? (
              <div className="h-20 animate-pulse bg-slate-100 rounded-xl"></div>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="block text-slate-500 font-semibold">Owner Name</span>
                  <span className="font-bold text-slate-900">{user?.name}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold">Business Name</span>
                  <span className="font-bold text-slate-900">{vendorDetails?.name || 'Please set in profile'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 font-semibold">Email</span>
                  <span className="font-bold text-slate-900">{user?.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 font-semibold">Phone</span>
                  <span className="font-bold text-slate-900">{user?.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 font-semibold">Address</span>
                  <span className="font-bold text-slate-900">{vendorDetails?.address || user?.address || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="relative overflow-hidden rounded-3xl border border-yellow-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-100 blur-2xl opacity-60"></div>
            <div className="relative z-10 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 shadow-md">
                <FiTrendingUp className="text-2xl" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Total Bookings</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{bookings.length}</h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-green-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100 blur-2xl opacity-60"></div>
            <div className="relative z-10 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md">
                <FiCheckCircle className="text-2xl" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Completed</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{completed}</h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-yellow-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-100 blur-2xl opacity-60"></div>
            <div className="relative z-10 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-950 shadow-md">
                <FiDollarSign className="text-2xl" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Revenue</p>
                <h3 className="text-3xl font-extrabold text-slate-900">₹{revenue}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="rounded-3xl border border-green-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-green-100 blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <FiClock className="text-xl" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Recent Bookings</h2>
            </div>
            
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.slice(0, 5).map((b) => (
                  <div key={b._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-yellow-200/50 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{b.serviceName || 'Service Booking'}</p>
                      <p className="text-sm text-slate-500 mt-1">ID: {b._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        b.status === 'completed' ? 'bg-green-100 text-green-700' :
                        b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-10 text-center">
                  <FiClock className="mx-auto text-4xl text-green-300" />
                  <h3 className="mt-4 font-bold text-slate-900 text-lg">No bookings yet</h3>
                  <p className="mt-1 text-slate-500">Your recent service requests and bookings will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
