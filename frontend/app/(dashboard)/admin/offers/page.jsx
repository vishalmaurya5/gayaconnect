'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ vendorId: '', title: '', description: '', discountText: '', validUntil: '' });

  useEffect(() => {
    fetchOffersAndVendors();
  }, []);

  const fetchOffersAndVendors = async () => {
    try {
      const [offersRes, overviewRes] = await Promise.all([
        fetch('/api/admin/offers'),
        fetch('/api/admin/overview')
      ]);
      const offersData = await offersRes.json();
      const overviewData = await overviewRes.json();

      if (offersData.success) {
        setOffers(offersData.offers || []);
      }
      if (overviewData.success) {
        setVendors(overviewData.vendors || []);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.vendorId) {
      return toast.error('Please select a vendor');
    }
    setPosting(true);
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Offer posted successfully');
        setForm({ vendorId: '', title: '', description: '', discountText: '', validUntil: '' });
        fetchOffersAndVendors(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to post');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setPosting(false);
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
        fetchOffersAndVendors();
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

      {/* Post New Offer Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          Post New Offer
        </h2>
        <form onSubmit={handlePost} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Vendor</label>
            <select required value={form.vendorId} onChange={e => setForm({...form, vendorId: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">-- Choose Vendor --</option>
              {vendors.map(v => (
                <option key={v._id} value={v._id}>{v.name} ({v.phone || 'No phone'})</option>
              ))}
            </select>
          </div>
          
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Offer Title" />
          </div>

          <div className="sm:col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Text</label>
            <input type="text" value={form.discountText} onChange={e => setForm({...form, discountText: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 50% OFF, Buy 1 Get 1" />
          </div>

          <div className="sm:col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Valid Until</label>
            <input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div className="sm:col-span-2 md:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Offer Description"></textarea>
          </div>
          
          <button type="submit" disabled={posting} className="sm:col-span-2 md:col-span-4 mt-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
            {posting ? 'Posting...' : 'Post Offer'}
          </button>
        </form>
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
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {offers.map((offer) => {
                  const expired = offer.validUntil ? isExpired(offer.validUntil) : false;
                  return (
                    <tr key={offer._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {offer.vendorId?.name || 'Unknown'}
                        <div className="text-xs text-slate-500 font-normal">{offer.vendorId?.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 max-w-[200px] truncate" title={offer.title}>{offer.title}</div>
                        {offer.discountText && (
                          <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-semibold text-xs mt-1 inline-block">
                            {offer.discountText}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <FiClock /> Exp: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'No expiry'}
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
