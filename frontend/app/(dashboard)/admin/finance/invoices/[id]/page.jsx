'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Printer, Download, ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PrintInvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/admin/finance/invoices/${id}`);
      const data = await res.json();
      if (data.success) {
        setInvoice(data.invoice);
      } else {
        toast.error('Invoice not found');
      }
    } catch (err) {
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Invoice...</div>;
  }
  if (!invoice) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <Link href="/admin/finance/invoices" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </Link>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-semibold shadow-lg shadow-indigo-600/20 transition">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
          html, body { width: 210mm; height: 297mm; background: white !important; }
        }
      `}} />

      <div id="printable-invoice" className="bg-white mx-auto relative overflow-hidden shadow-2xl" style={{ width: '210mm', minHeight: '297mm', padding: '40px 50px' }}>
        
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
          <img src="/gaya_seva_app_icon.png" alt="Watermark" style={{ width: '500px', height: '500px' }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-8">
            <div className="flex items-center gap-4">
              <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-20 h-20 object-contain" />
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">GAYA<span className="text-amber-500">SEVA</span></h1>
                <p className="text-slate-500 text-xs font-bold tracking-[2px] uppercase">Zarurat Aapki, Seva Hamari</p>
                <div className="mt-3 text-slate-600 text-xs leading-relaxed">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-indigo-600" /> Gaya, Bihar 823001</p>
                  <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-indigo-600" /> support@gayaseva.com</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-indigo-600" /> +91 9117588242</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-slate-200 uppercase tracking-widest mb-4">INVOICE</h2>
              <div className="inline-block bg-slate-50 border border-slate-200 p-3 rounded-lg text-left">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Invoice Number</p>
                <p className="text-lg font-black text-slate-900 font-mono leading-none">{invoice.invoiceNumber}</p>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-2">Date: <span className="text-slate-900">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="flex justify-between items-start mt-8 mb-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1 w-48">Billed To</p>
              <h3 className="text-xl font-black text-slate-900 uppercase">{invoice.customerDetails?.name}</h3>
              {invoice.customerDetails?.businessName && <p className="text-sm font-bold text-indigo-600 uppercase mb-1">{invoice.customerDetails?.businessName}</p>}
              <p className="text-sm text-slate-600 mt-1">{invoice.customerDetails?.address || 'Gaya, Bihar'}</p>
              <p className="text-sm text-slate-600">{invoice.customerDetails?.phone}</p>
              {invoice.customerDetails?.email && <p className="text-sm text-slate-600">{invoice.customerDetails?.email}</p>}
            </div>
            
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1 w-48 ml-auto">Payment Info</p>
              <p className="text-sm text-slate-600 mb-1"><span className="font-semibold">Method:</span> {invoice.paymentMethod || 'Online'}</p>
              {invoice.referenceNumber && <p className="text-sm text-slate-600 mb-1"><span className="font-semibold">Ref No:</span> {invoice.referenceNumber}</p>}
              <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Paid
              </div>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg">Description</th>
                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Discount</th>
                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Tax (GST)</th>
                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900 text-sm">{invoice.serviceDetails?.service}</p>
                  {invoice.serviceDetails?.description && <p className="text-xs text-slate-500 mt-1">{invoice.serviceDetails?.description}</p>}
                </td>
                <td className="py-4 px-4 text-right font-medium text-slate-700">₹{invoice.serviceDetails?.amount?.toFixed(2)}</td>
                <td className="py-4 px-4 text-right font-medium text-rose-600">-₹{invoice.serviceDetails?.discount?.toFixed(2)}</td>
                <td className="py-4 px-4 text-right font-medium text-slate-700">₹{((invoice.serviceDetails?.amount - invoice.serviceDetails?.discount) * (invoice.serviceDetails?.gst / 100))?.toFixed(2)} ({invoice.serviceDetails?.gst}%)</td>
                <td className="py-4 px-4 text-right font-bold text-slate-900">₹{invoice.serviceDetails?.total?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-between items-start mt-8">
            <div className="w-1/2 pt-4">
              {/* Brand seal removed as requested */}
            </div>
            <div className="w-1/3 space-y-3">
              <div className="flex justify-between text-sm text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>₹{(invoice.serviceDetails?.amount - invoice.serviceDetails?.discount)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 font-medium pb-3 border-b border-slate-200">
                <span>Total Tax (GST {invoice.serviceDetails?.gst}%)</span>
                <span>₹{((invoice.serviceDetails?.amount - invoice.serviceDetails?.discount) * (invoice.serviceDetails?.gst / 100))?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-black text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <span>Total Amount</span>
                <span>₹{invoice.serviceDetails?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-16 flex justify-between items-end border-t border-slate-200 pt-8">
            <div className="flex items-center gap-4">
              <img 
                src={`https://quickchart.io/qr?text=${encodeURIComponent(`GAYA SEVA INVOICE\nNo: ${invoice.invoiceNumber}\nAmount: ${invoice.serviceDetails?.total}\nStatus: PAID\nDate: ${new Date(invoice.invoiceDate).toLocaleDateString()}`)}&size=150`}
                alt="QR Code" 
                className="w-20 h-20 mix-blend-multiply border border-slate-200 p-1 rounded-lg"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">Scan to Verify</p>
                <p className="text-[10px] text-slate-500 w-48 mt-1 leading-tight">This is a system generated invoice and does not require a physical signature.</p>
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-[Brush Script MT, cursive, serif] text-4xl text-indigo-900 leading-none mb-1">Gaya Seva</h4>
              <div className="w-32 h-0.5 bg-slate-300 mx-auto mb-2"></div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Authorized Signatory</p>
            </div>
          </div>

          <div className="mt-8 text-center bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-500">Thank you for your business! For any billing queries, please contact <span className="font-semibold text-slate-700">support@gayaseva.com</span></p>
            <p className="text-[10px] text-slate-500 mt-1">All disputes are subject to Gaya jurisdiction only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
