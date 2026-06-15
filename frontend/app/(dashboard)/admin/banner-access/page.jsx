'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBannerAccessPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Reusing the existing vendors API or creating a specific one. Let's just fetch all vendors for now
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors || []);
      }
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const toggleBannerAccess = async (vendorId, userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/vendors/${userId}/banner-access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasAccess: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Banner access ${!currentStatus ? 'granted' : 'revoked'}`);
        // Update local state
        setVendors(vendors.map(v => v.userId?._id === userId ? {
          ...v,
          userId: { ...v.userId, bannerPostExpiresAt: !currentStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null }
        } : v));
      } else {
        toast.error(data.message || 'Failed to update access');
      }
    } catch (error) {
      toast.error('Error updating banner access');
    }
  };

  const hasAccess = (user) => {
    return user?.bannerPostExpiresAt && new Date(user.bannerPostExpiresAt) > new Date();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Banner Access</h1>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-20 bg-slate-200 rounded"></div>
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
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Email / Phone</th>
                  <th className="px-6 py-4">Banner Access</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vendors.map((vendor) => {
                  const access = hasAccess(vendor.userId);
                  return (
                    <tr key={vendor._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {vendor.name}
                      </td>
                      <td className="px-6 py-4">
                        {vendor.userId?.email}<br />
                        {vendor.userId?.phone}
                      </td>
                      <td className="px-6 py-4">
                        {access ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <FiCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <FiXCircle /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleBannerAccess(vendor._id, vendor.userId?._id, access)}
                          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                            access ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                        >
                          {access ? 'Revoke Access' : 'Grant Access (30 days)'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
