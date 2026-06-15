'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiImage, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, active, expired

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const toggleBannerStatus = async (bannerId, updates) => {
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Banner updated successfully');
        setBanners(banners.map(b => b._id === bannerId ? data.banner : b));
      } else {
        toast.error(data.message || 'Failed to update banner');
      }
    } catch (error) {
      toast.error('Error updating banner');
    }
  };

  const isExpired = (endDate) => new Date(endDate) < new Date();

  const filteredBanners = banners.filter(banner => {
    const expired = isExpired(banner.endDate);
    if (filter === 'expired') return expired;
    if (filter === 'pending') return !expired && !banner.adminApproved;
    if (filter === 'active') return !expired && banner.adminApproved && banner.isActive;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Banners</h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setFilter('pending')}
          className={`pb-2 px-2 font-semibold ${filter === 'pending' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pending Requests
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`pb-2 px-2 font-semibold ${filter === 'active' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Active Banners
        </button>
        <button 
          onClick={() => setFilter('expired')}
          className={`pb-2 px-2 font-semibold ${filter === 'expired' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Expired Banners
        </button>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title / Vendor</th>
                  <th className="px-6 py-4">Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBanners.map((banner) => {
                  const expired = isExpired(banner.endDate);
                  return (
                    <tr key={banner._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="h-16 w-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                          ) : (
                            <FiImage className="text-slate-300 text-2xl" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {banner.title}
                        <div className="text-xs text-slate-500 mt-1 font-normal">
                          {banner.vendorId?.name || 'Unknown Vendor'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {banner.linkUrl ? (
                          <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">
                            Link <FiExternalLink />
                          </a>
                        ) : (
                          <span className="text-slate-400">No link</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {expired ? (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <FiClock /> Expired
                          </span>
                        ) : !banner.adminApproved ? (
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <FiClock /> Pending Approval
                          </span>
                        ) : banner.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <FiCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <FiXCircle /> Paused
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {!expired && (
                          <>
                            {!banner.adminApproved ? (
                              <button
                                onClick={() => toggleBannerStatus(banner._id, { adminApproved: true, isActive: true })}
                                className="px-3 py-1.5 rounded-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition"
                              >
                                Approve & Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleBannerStatus(banner._id, { isActive: !banner.isActive })}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-white transition ${
                                  banner.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                              >
                                {banner.isActive ? 'Pause' : 'Activate'}
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filteredBanners.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No banners found in this category.
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

