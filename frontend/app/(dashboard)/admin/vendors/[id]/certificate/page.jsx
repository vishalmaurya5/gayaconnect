'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
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

  if (loading) return <div className="p-10 text-center font-bold">Generating Certificate...</div>;
  if (!vendor) return <div className="p-10 text-center font-bold text-red-500">Vendor Not Found</div>;

  const qrData = `Gaya Seva Vendor ID: ${vendor.vendorId || 'PENDING'}\nBusiness: ${vendor.name}\nCategory: ${vendor.category}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  
  const issueDate = new Date(vendor.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:m-0 print:space-y-0 print:w-full print:h-screen">
      
      {/* Controls (Hidden on Print) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm print:hidden border border-slate-200">
        <Link href="/admin/vendors" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold">
          <FiArrowLeft /> Back to Vendors
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition"
        >
          <FiPrinter /> Print Certificate
        </button>
      </div>

      {/* Certificate Wrapper (Landscape Print) */}
      <div className="bg-white p-2 rounded-xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        
        {/* Certificate Border Design */}
        <div className="border-[12px] border-emerald-900 p-2 print:border-[8px]">
          <div className="border-4 border-emerald-600 p-8 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("/patterns/topography.svg")' }}>
            
            <div className="absolute inset-0 bg-white/95"></div> {/* Brightener overlay */}

            <div className="relative z-10 flex flex-col items-center text-center">
              
              {/* Header */}
              <div className="flex items-center justify-between w-full mb-8">
                <img src="/logo2.png" alt="Gaya Seva" className="h-20" />
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Certificate Number</p>
                  <p className="text-2xl font-black text-slate-900 font-mono">{vendor.vendorId || 'PENDING'}</p>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase mt-6 mb-2 font-serif">Certificate of Registration</h1>
              <div className="w-64 h-1 bg-emerald-500 mb-8 rounded-full"></div>

              <p className="text-xl text-slate-600 font-medium mb-4 italic font-serif">This is to proudly certify that</p>
              
              <h2 className="text-4xl font-extrabold text-emerald-700 mb-4 uppercase">{vendor.name}</h2>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                has successfully registered as an official service provider on the Gaya Seva platform. 
                They are authorized to offer services under the category of <span className="font-bold text-slate-900 border-b-2 border-emerald-500">{vendor.category}</span> in the region of <span className="font-bold text-slate-900 border-b-2 border-emerald-500">{vendor.address || 'Gaya, Bihar'}</span>.
              </p>

              {/* Footer Grid */}
              <div className="w-full grid grid-cols-3 gap-8 items-end mt-12 border-t-2 border-slate-200 pt-8">
                
                {/* Date & Seal */}
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-lg mb-1">{issueDate}</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider border-t border-slate-300 pt-1 inline-block">Date of Issue</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-2 border-4 border-emerald-600 rounded-xl bg-white shadow-lg transform -translate-y-4">
                    <img src={qrUrl} alt="QR Code" className="w-24 h-24" crossOrigin="anonymous" />
                  </div>
                </div>

                {/* Signature */}
                <div className="text-right">
                  <div className="h-16 mb-2 flex items-end justify-end">
                    <img src="/logo2.png" alt="Signature Seal" className="h-12 opacity-30 mix-blend-multiply" />
                  </div>
                  <p className="font-bold text-slate-900 text-lg mb-1">Director, Gaya Seva</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider border-t border-slate-300 pt-1 inline-block">Authorized Signatory</p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
      
      {/* Global CSS for Landscape Print */}
      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
