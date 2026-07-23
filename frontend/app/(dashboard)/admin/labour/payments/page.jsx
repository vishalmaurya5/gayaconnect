'use client';

import { useState, useEffect, useContext } from 'react';
import { 
  Search, Filter, Download, Plus, HardHat, DollarSign, Receipt, CreditCard, X, CheckCircle
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { exportToCSV } from '@/lib/utils/export';

export default function LabourPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ totalPaid: 0, totalPending: 0, count: 0 });
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    labourId: '',
    amount: '',
    paymentMethod: 'UPI',
    period: 'Daily Wage Payout',
    notes: '',
    status: 'PAID'
  };
  const [form, setForm] = useState(initialFormState);
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchPayments();
    fetchLabourers();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/labour/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
        setStats(data.stats || { totalPaid: 0, totalPending: 0, count: 0 });
      }
    } catch (error) {
      toast.error('Failed to load payment records');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabourers = async () => {
    try {
      const res = await fetch('/api/admin/labour');
      const data = await res.json();
      if (data.success) setLabourers(data.labourers || []);
    } catch (err) {}
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!form.labourId || !form.amount) {
      return toast.error('Worker and amount are required');
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/labour/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment recorded successfully!');
        setIsRecordModalOpen(false);
        setForm(initialFormState);
        fetchPayments();
      } else {
        toast.error(data.message || 'Failed to record payment');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const s = searchInput.toLowerCase();
    return !s || 
      p.labourId?.name?.toLowerCase().includes(s) ||
      p.transactionId?.toLowerCase().includes(s) ||
      p.paymentMethod?.toLowerCase().includes(s);
  });

  const handleExportCSV = () => {
    const exportData = filteredPayments.map(p => ({
      Transaction_ID: p.transactionId,
      Worker_Name: p.labourId?.name || 'N/A',
      Phone: p.labourId?.phone || 'N/A',
      Amount: p.amount,
      Payment_Method: p.paymentMethod,
      Period: p.period,
      Status: p.status,
      Date: new Date(p.paymentDate).toLocaleDateString()
    }));
    exportToCSV(exportData, 'Labour_Payouts_Ledger');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Labour Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage wage payouts, record transaction receipts, and track financial ledgers.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Ledger CSV
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Record Payout
          </motion.button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Paid Out</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">₹{stats.totalPaid.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Payouts</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">₹{stats.totalPending.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Payout Transactions</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{stats.count} Records</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by worker, txn ID, method..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="text-sm font-bold text-slate-500">
            Showing <span className="text-indigo-600">{filteredPayments.length} transactions</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Worker Identity</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Amount & Method</th>
                  <th className="px-6 py-4">Payment Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-500/10 mb-4 text-rose-500">
                        <Receipt className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Payout Records</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Record wage payments to track payouts here.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-indigo-500/30">
                            {p.labourId?.photo ? (
                              <img src={p.labourId.photo} alt="worker" className="w-full h-full object-cover" />
                            ) : (
                              <HardHat className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{p.labourId?.name || 'Worker'}</div>
                            <div className="text-xs text-slate-500 font-mono">{p.labourId?.lwfId || 'GS-LWF'} • {p.labourId?.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md inline-block border border-indigo-200 dark:border-indigo-800">
                          {p.transactionId}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-black text-slate-900 dark:text-white text-base">₹{p.amount?.toLocaleString()}</div>
                        <div className="text-xs font-semibold text-slate-500">{p.paymentMethod} • {p.period}</div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {new Date(p.paymentDate || p.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1 font-bold text-xs rounded-full border inline-flex items-center gap-1 ${
                          p.status === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <CheckCircle className="w-3 h-3" /> {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {isRecordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Record Wage Payout</h3>
                <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Labour Worker *</label>
                  <select 
                    value={form.labourId}
                    onChange={(e) => setForm({ ...form, labourId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-medium"
                    required
                  >
                    <option value="">-- Choose Worker --</option>
                    {labourers.map(l => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.profession || l.category || 'Worker'}) - {l.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount Paid (₹) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1500"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                    <select 
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-medium"
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Cash">Cash Handover</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payout Period / Type</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Daily Wage / Weekly Payout"
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payout Status</label>
                    <select 
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-medium"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Remarks / Notes</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Full settlement for 2 days work"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setIsRecordModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-sm disabled:opacity-50"
                  >
                    {submitting ? 'Recording...' : 'Record Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
