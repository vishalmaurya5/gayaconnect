'use client';

import { useState, useEffect } from 'react';
import { FiDownload, FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments(filter);
  }, [filter]);

  const fetchPayments = async (f) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?filter=${f}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (payments.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['Date', 'User', 'Email', 'Plan Type', 'Amount', 'Status', 'Transaction ID'];
    const rows = payments.map(p => [
      new Date(p.createdAt).toLocaleString(),
      p.userId?.name || 'Unknown',
      p.userId?.email || 'N/A',
      p.purpose || p.planType || p.type || p.plan || 'Other',
      p.amount,
      p.status,
      p.paymentId || p.razorpayPaymentId || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Payments & Revenue</h1>
        <button 
          onClick={exportCSV} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Payments' },
          { id: 'user_subscription', label: 'Subscriptions' },
          { id: 'offer_post', label: 'Offer Posts' },
          { id: 'banner_fee', label: 'Banner Ads' },
          { id: 'vehicle_listing', label: 'Vehicle Listings' },
          { id: 'vendor_registration', label: 'Vendor Registrations' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setFilter(tab.id)} 
            className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-semibold transition ${filter === tab.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
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
                  <th className="px-6 py-4">Transaction / Date</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-500">{payment.razorpayPaymentId || payment._id}</div>
                      <div className="text-sm font-medium text-slate-900 mt-1">{new Date(payment.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{payment.userId?.name}</div>
                      <div className="text-slate-500 text-xs mt-1">{payment.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-semibold text-xs px-2 py-1 rounded">
                        {payment.purpose || payment.planType || payment.type || payment.plan || 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-600">₹{payment.amount}</div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <FiCheckCircle /> Success
                        </span>
                      ) : payment.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                          <FiClock /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-xs">
                          <FiXCircle /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No payments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
