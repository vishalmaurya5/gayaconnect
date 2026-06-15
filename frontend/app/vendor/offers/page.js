'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiPlus, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VendorOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchOffers();
    }
  }, [user?._id]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`/api/offers?vendorId=${user._id}&all=true`);
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysRemaining = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-custom max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Offers</h1>
            <p className="mt-2 text-slate-600">Manage your active and expired offers.</p>
          </div>
          <Link href="/offers/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-sky-700 hover:shadow-lg hover:scale-105">
            <FiPlus className="text-xl" /> Post New Offer
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 animate-pulse bg-white rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <FiAlertCircle className="mx-auto text-5xl text-slate-300" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">No offers found</h3>
            <p className="mt-2 text-slate-500">You haven't posted any offers yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => {
              const isExpired = new Date(offer.expiresAt) < new Date();
              const daysRemaining = calculateDaysRemaining(offer.expiresAt);
              const isActive = offer.isActive && !isExpired;

              return (
                <div key={offer._id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="p-6 flex-1">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isActive ? <FiCheckCircle /> : <FiAlertCircle />}
                        {isActive ? 'Active' : 'Expired'}
                      </span>
                      {isActive && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-sky-600">
                          <FiClock /> {daysRemaining} days left
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 line-clamp-2">{offer.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">{offer.description}</p>
                    <div className="mt-4 inline-block rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-700 border border-sky-100">
                      Discount: {offer.discount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
