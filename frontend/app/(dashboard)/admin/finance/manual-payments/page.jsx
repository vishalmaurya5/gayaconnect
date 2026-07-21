'use client';
import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, MoreVertical, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ManualPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/finance/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    if (!window.confirm('Mark this payment as PAID and generate invoice?')) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/finance/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment marked as Paid! Invoice generated.');
        fetchPayments();
      } else {
        toast.error(data.message || 'Error updating payment');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Paid</span>;
      case 'Pending': return <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'Failed': return <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
      default: return <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manual Payments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all manual payment requests.</p>
        </div>
        <Link href="/admin/finance/create-payment" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Create Payment
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search payments by name or phone..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{payment.customerName}</p>
                      <p className="text-xs text-slate-500">{payment.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block truncate max-w-[150px]" title={payment.service}>{payment.service}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{payment.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-semibold">{payment.paymentMethod}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.paymentStatus !== 'Paid' ? (
                        <button 
                          onClick={() => markAsPaid(payment._id)}
                          disabled={updating === payment._id}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-sm disabled:opacity-50"
                        >
                          {updating === payment._id ? 'Updating...' : 'Mark Paid'}
                        </button>
                      ) : (
                        <Link href="/admin/finance/invoices" className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 w-full max-w-[100px] ml-auto">
                          <FileText className="w-3 h-3" /> Invoice
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
