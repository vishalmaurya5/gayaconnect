'use client';
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServicePricingPage() {
  const [pricingList, setPricingList] = useState([
    { _id: '1', serviceName: 'Vendor Registration', basePrice: 500, gst: 18, type: 'One-time', isActive: true },
    { _id: '2', serviceName: 'Premium Vendor Listing', basePrice: 2000, gst: 18, type: 'Subscription', isActive: true },
    { _id: '3', serviceName: 'Local Workforce Registration', basePrice: 300, gst: 0, type: 'One-time', isActive: true },
    { _id: '4', serviceName: 'Premium Workforce', basePrice: 1000, gst: 0, type: 'Subscription', isActive: true },
    { _id: '5', serviceName: 'Digital Identity Card', basePrice: 150, gst: 18, type: 'One-time', isActive: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Pricing</h1>
          <p className="text-slate-500 text-sm mt-1">Manage standardized pricing for all Gaya Seva services.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Pricing
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Billing Type</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">GST Rate</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {pricingList.map((item) => {
                const total = item.basePrice + (item.basePrice * item.gst / 100);
                return (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.serviceName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-xs">{item.type}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">₹{item.basePrice}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.gst}%</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{total}</td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
