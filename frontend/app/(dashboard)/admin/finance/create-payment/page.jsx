'use client';
import { useState, useEffect } from 'react';
import { CreditCard, UploadCloud, Save, ChevronRight, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    service: '',
    description: '',
    amount: '',
    discount: '0',
    gst: '0',
    totalAmount: '',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    referenceNumber: '',
    remarks: ''
  });

  const services = [
    'Vendor Registration', 'Premium Vendor Listing', 'Local Workforce Registration', 
    'Premium Workforce', 'Business Verification', 'Business Promotion', 
    'Featured Listing', 'Advertisement', 'QR Card', 'Certificate', 
    'Digital Identity Card', 'Review QR', 'Custom Services', 'Other Charges'
  ];

  const paymentMethods = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card', 'Demand Draft', 'Wallet', 'Other'];
  const paymentStatuses = ['Pending', 'Paid', 'Partial Paid', 'Cancelled', 'Refunded', 'Failed'];

  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const gst = parseFloat(formData.gst) || 0;
    const subtotal = amount - discount;
    const total = subtotal + (subtotal * gst / 100);
    setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
  }, [formData.amount, formData.discount, formData.gst]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = require('next/navigation').useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/finance/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment Created Successfully');
        if (data.invoiceId) {
          toast.success('Invoice Generated Automatically');
          router.push(`/admin/finance/invoices/${data.invoiceId}`);
        } else {
          setFormData({
            customerName: '', phone: '', email: '', businessName: '', address: '', city: '', state: '',
            service: '', description: '', amount: '', discount: '0', gst: '0', totalAmount: '',
            paymentMethod: 'Cash', paymentStatus: 'Paid', referenceNumber: '', remarks: ''
          });
        }
      } else {
        toast.error(data.message || 'Error creating payment');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Payment Request</h1>
          <p className="text-slate-500 text-sm mt-1">Generate a manual payment link or record a received payment.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-6 md:p-8 space-y-8">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">1</span> 
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Customer / Vendor Name *</label>
                <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Business Name</label>
                <input name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm" placeholder="XYZ Traders" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm" placeholder="123 Main St, Area" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Service Details */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">2</span> 
              Service & Amount
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Service Type *</label>
                <select required name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm">
                  <option value="">Select Service...</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <input name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm" placeholder="Additional details..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Base Amount (₹) *</label>
                <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Discount (₹)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GST (%)</label>
                <select name="gst" value={formData.gst} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm">
                  <option value="0">0% (None)</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Total Amount</label>
                <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg">
                  ₹ {formData.totalAmount || '0.00'}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">3</span> 
              Payment Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Payment Method *</label>
                <select required name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 outline-none transition text-sm">
                  {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Payment Status *</label>
                <select required name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 outline-none transition text-sm">
                  {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reference Number (Txn ID)</label>
                <input name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 outline-none transition text-sm" placeholder="UPI Ref / Cheque No" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Remarks / Notes</label>
                <input name="remarks" value={formData.remarks} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 outline-none transition text-sm" placeholder="Any internal notes..." />
              </div>
            </div>
          </div>

        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-4">
          <button type="button" className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">Cancel</button>
          <button disabled={loading} type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition disabled:opacity-70 shadow-lg shadow-indigo-600/20">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            Save & Generate Receipt
          </button>
        </div>
      </form>
    </div>
  );
}
