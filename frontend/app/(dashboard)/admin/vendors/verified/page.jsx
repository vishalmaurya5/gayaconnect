'use client';
import { useState, useEffect, useContext } from 'react';
import { ShieldCheck, Search, Filter, Building, Mail, Phone, XCircle } from 'lucide-react';
import { AdminContext } from '../../layout';
import toast from 'react-hot-toast';

export default function VerifiedVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchVerifiedVendors();
  }, []);

  const fetchVerifiedVendors = async () => {
    try {
      const res = await fetch(`/api/admin/vendors`);
      const data = await res.json();
      if (data.success) {
        setVendors((data.vendors || []).filter(v => v.isApproved));
      }
    } catch (error) {
      toast.error('Failed to load verified vendors');
    } finally {
      setLoading(false);
    }
  };

  const revokeVendor = async (id) => {
    if (!confirm('Are you sure you want to revoke verification for this vendor?')) return;
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: false })
      });
      if ((await res.json()).success) {
        toast.success('Verification Revoked');
        setVendors(vendors.filter(v => v._id !== id));
      }
    } catch (error) {
      toast.error('Error revoking vendor');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Verified Vendors</h1>
        <p className="text-slate-500 mt-1">Manage active and verified vendors on the Gaya Seva marketplace.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search verified vendors..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500" />
          </div>
          <button className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"><Filter className="w-4 h-4" /></button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-6 space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}</div>
          ) : vendors.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Verified Vendors</h3>
              <p className="text-slate-500 mt-1">There are currently no verified vendors in the system.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Business Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Owner Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {vendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-100">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{vendor.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{vendor.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.userId ? (
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{vendor.userId.name}</span>
                          <span className="text-slate-500 text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> {vendor.userId.email}</span>
                          <span className="text-slate-500 text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> {vendor.userId.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">No linked user</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {admin?.role === 'SUPER_ADMIN' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => revokeVendor(vendor._id)} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm font-bold flex items-center gap-1.5 transition">
                            <XCircle className="w-4 h-4" /> Revoke
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
