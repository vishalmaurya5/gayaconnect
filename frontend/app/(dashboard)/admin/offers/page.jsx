'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/admin/offers');
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers || []);
      }
    } catch (error) {
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Offer ${!currentStatus ? 'activated' : 'deactivated'}`);
        setOffers(offers.map(o => o._id === offerId ? { ...o, isActive: !currentStatus } : o));
      } else {
        toast.error(data.message || 'Failed to update offer');
      }
    } catch (error) {
      toast.error('Error updating offer');
    }
  };

  const deleteOffer = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const res = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Offer deleted');
        setOffers(offers.filter(o => o._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting offer');
    }
  };

  const deleteExpiredOffers = async () => {
    if (!confirm('Are you sure you want to delete all expired offers?')) return;
    try {
      const res = await fetch('/api/admin/offers?action=delete-expired', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(`Deleted ${data.count} expired offers`);
        fetchOffers();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting expired offers');
    }
  };

  const isExpired = (expiresAt) => new Date(expiresAt) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Manage Offers</h1>
        <button 
          onClick={deleteExpiredOffers} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
        >
          <FiTrash2 /> Delete All Expired
        </button>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Offer Details</th>
                  <th className="px-6 py-4">Plan & Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {offers.map((offer) => {
                  const expired = isExpired(offer.expiresAt);
                  return (
                    <tr key={offer._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {offer.vendorId?.name || 'Unknown'}
                        <div className="text-xs text-slate-500 font-normal">{offer.vendorId?.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 max-w-[200px] truncate" title={offer.title}>{offer.title}</div>
                        <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-semibold text-xs mt-1 inline-block">
                          {offer.discount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700 uppercase text-xs">{offer.planType} Plan</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <FiClock /> Exp: {new Date(offer.expiresAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {expired ? (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <FiClock /> Expired
                          </span>
                        ) : offer.isActive ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <FiCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <FiXCircle /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => toggleOfferStatus(offer._id, offer.isActive)}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-white transition ${
                            offer.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                        >
                          {offer.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteOffer(offer._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                          <FiTrash2 className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No offers found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
