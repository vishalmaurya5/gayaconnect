'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Download, ShieldCheck, Award } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function VendorCertificatePage() {
  const params = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendor();
  }, [params.id]);

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/admin/vendors/${params.id}`);
      const json = await res.json();
      if (json.success) setVendor(json.vendor);
      else toast.error('Failed to load profile');
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-lg font-bold text-slate-700 animate-pulse">Generating Secure Certificate...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="text-2xl font-bold text-slate-900">Vendor Not Found</div>
        <Link href="/admin/vendors" className="text-indigo-600 font-medium hover:underline">Return to Directory</Link>
      </div>
    );
  }

  const qrData = `Gaya Seva Official Vendor\nID: ${vendor.vendorId || 'PENDING'}\nBusiness: ${vendor.name}\nStatus: Verified`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=0f172a&bgcolor=ffffff`;
  
  const issueDate = new Date(vendor.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 print:m-0 print:p-0 print:space-y-0 print:max-w-none">
      
      {/* Control Panel (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm print:hidden border border-slate-200 dark:border-slate-800 gap-4">
        <Link href="/admin/vendors" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" /> Back to Registry
        </Link>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-5 h-5" /> Print Certificate
          </button>
        </div>
      </div>

      {/* Certificate Canvas Container */}
      <div className="bg-slate-200 dark:bg-slate-800 p-4 sm:p-8 rounded-3xl print:p-0 print:bg-white flex justify-center overflow-x-auto">
        
        {/* The Certificate Itself (A4 Landscape aspect ratio approximate: 1123x794) */}
        <div className="relative bg-white w-[1123px] h-[794px] shadow-2xl print:shadow-none shrink-0 overflow-hidden print:w-full print:h-screen flex flex-col">
          
          {/* Background Patterns & Gradients */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-indigo-800 via-indigo-500 to-teal-500 z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-teal-500 via-indigo-500 to-indigo-800 z-10"></div>
          
          {/* Ornate Border */}
          <div className="absolute inset-6 border-[3px] border-slate-200 z-10 pointer-events-none"></div>
          <div className="absolute inset-8 border border-slate-300 z-10 pointer-events-none"></div>
          
          {/* Corner Ornaments */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-[3px] border-l-[3px] border-indigo-900 z-20"></div>
          <div className="absolute top-6 right-6 w-12 h-12 border-t-[3px] border-r-[3px] border-indigo-900 z-20"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-[3px] border-l-[3px] border-indigo-900 z-20"></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-[3px] border-r-[3px] border-indigo-900 z-20"></div>

          {/* Main Content Container */}
          <div className="relative z-30 flex-1 flex flex-col p-16">
            
            {/* Header Section */}
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-4">
                <img src="/logo2.png" alt="Gaya Seva Logo" className="h-20 object-contain" />
                <div className="pl-4 border-l-2 border-slate-200">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gaya Seva</h2>
                  <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase">Digital Vendor Registry</p>
                </div>
              </div>

              <div className="text-right bg-slate-50 px-6 py-3 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Official Document ID</p>
                <p className="text-xl font-black text-slate-900 font-mono tracking-widest">{vendor.vendorId || 'PENDING-ID'}</p>
              </div>
            </div>

            {/* Core Certificate Body */}
            <div className="flex-1 flex flex-col items-center justify-center text-center mt-8">
              
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <Award className="w-8 h-8" />
              </div>
              
              <h1 className="text-[54px] font-black text-slate-900 tracking-tight uppercase leading-none font-serif">
                Certificate of<br/>Registration
              </h1>
              
              <div className="flex items-center justify-center w-full my-8">
                <div className="w-24 h-px bg-slate-300"></div>
                <div className="mx-4 text-slate-400 text-sm font-serif italic tracking-widest">This proudly certifies that</div>
                <div className="w-24 h-px bg-slate-300"></div>
              </div>

              <h2 className="text-5xl font-extrabold text-indigo-900 mb-6 uppercase tracking-wide px-10">
                {vendor.name}
              </h2>

              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                has successfully met all verification requirements and is registered as an official service provider on the Gaya Seva platform. They are fully authorized to offer premium services under the category of <strong className="text-slate-900 border-b border-indigo-200 pb-0.5">{vendor.category}</strong> within the operational region of <strong className="text-slate-900 border-b border-indigo-200 pb-0.5">{vendor.address || 'Gaya, Bihar'}</strong>.
              </p>

            </div>

            {/* Footer Section */}
            <div className="w-full grid grid-cols-3 gap-8 items-end mt-12 pt-8">
              
              {/* Date */}
              <div className="text-left flex flex-col items-start">
                <p className="font-bold text-slate-900 text-xl mb-2">{issueDate}</p>
                <div className="w-40 border-t-2 border-slate-800 pt-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Date of Issue</p>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex justify-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-50 rounded-full -z-10"></div>
                <div className="p-3 bg-white rounded-xl shadow-xl border border-slate-100 flex flex-col items-center justify-center gap-2">
                  <img src={qrUrl} alt="Verification QR" className="w-24 h-24 mix-blend-multiply" crossOrigin="anonymous" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Scan to Verify</span>
                </div>
              </div>

              {/* Signature */}
              <div className="text-right flex flex-col items-end">
                <div className="h-20 mb-2 relative flex items-end justify-end w-full">
                  {/* Decorative Signature Line */}
                  <img src="/logo2.png" alt="Seal" className="h-16 opacity-10 absolute right-12 bottom-2 mix-blend-multiply grayscale" />
                  <span className="font-serif italic text-3xl text-slate-800 pr-4">Gaya Seva Admin</span>
                </div>
                <div className="w-48 border-t-2 border-slate-800 pt-2 text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Authorized Signatory</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Gaya Seva Director</p>
                </div>
              </div>

            </div>

          </div>
          
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] z-0">
            <img src="/logo2.png" alt="Watermark" className="w-[600px] grayscale" />
          </div>

        </div>
      </div>
      
      {/* Global Print Styles specific to this layout */}
      <style jsx global>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            background-color: white !important;
          }
          /* Hide scrollbars during print setup */
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}
