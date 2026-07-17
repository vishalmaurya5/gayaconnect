'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Download, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function WorkforceIDCardPage() {
  const params = useParams();
  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabour();
  }, [params.id]);

  const fetchLabour = async () => {
    try {
      const res = await fetch(`/api/admin/labour/${params.id}`);
      const json = await res.json();
      if (json.success) setLabour(json.labour);
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
        <div className="text-lg font-bold text-slate-700 animate-pulse">Generating Secure ID Card...</div>
      </div>
    );
  }

  if (!labour) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="text-2xl font-bold text-slate-900">Worker Profile Not Found</div>
        <Link href="/admin/labour" className="text-indigo-600 font-medium hover:underline">Return to Directory</Link>
      </div>
    );
  }

  const maskedAadhaar = labour.aadhaarNumber ? `XXXX-XXXX-${labour.aadhaarNumber.slice(-4)}` : 'NOT PROVIDED';
  const qrData = `Gaya Seva Workforce\nID: ${labour.lwfId || 'PENDING'}\nName: ${labour.name}\nPhone: ${labour.phone}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print:m-0 print:p-0 print:space-y-0 print:w-full">
      
      {/* Control Panel (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm print:hidden border border-slate-200 dark:border-slate-800 gap-4">
        <Link href="/admin/labour" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" /> Back to Workforce
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
            <Printer className="w-5 h-5" /> Print ID Card
          </button>
        </div>
      </div>

      {/* ID Card Canvas Container */}
      <div className="bg-slate-200 dark:bg-slate-800 p-8 sm:p-12 rounded-3xl print:p-0 print:bg-white flex justify-center">
        
        {/* The Actual ID Card Design (CR80 Standard Size approximation: 2.125" x 3.375") */}
        {/* We use standard ID aspect ratio (vertical) approx 330x520 */}
        <div className="w-[330px] h-[520px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 print:shadow-none print:border-slate-200 relative shrink-0">
          
          {/* Background Textures */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/microbial-mat.png')] opacity-5 z-0 pointer-events-none"></div>
          
          {/* Top Header Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-600 p-5 text-center text-white relative z-10 shadow-md">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <img src="/logo2.png" alt="Gaya Seva" className="h-10 mx-auto filter brightness-0 invert mb-1.5 drop-shadow-sm" />
              <h2 className="font-black tracking-[0.3em] text-[10px] text-indigo-100 uppercase">Official Identity Card</h2>
            </div>
          </div>

          {/* Main Card Body */}
          <div className="p-6 text-center bg-white/95 relative z-10 h-full flex flex-col">
            
            {/* ID Photo */}
            <div className="relative w-32 h-32 mx-auto -mt-12 rounded-full p-1.5 bg-white shadow-xl mb-4 z-20">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-indigo-100 bg-slate-50 flex items-center justify-center shadow-inner">
                {labour.photo ? (
                  <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
            </div>

            {/* Core Identification Details */}
            <h1 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">{labour.name}</h1>
            <p className="text-indigo-600 font-bold text-xs tracking-widest uppercase mt-1 mb-5">{labour.profession || 'Workforce Member'}</p>

            {/* Highlighted LWF ID */}
            <div className="inline-block bg-slate-50 px-5 py-2 rounded-xl border border-slate-200/60 shadow-inner mb-6 mx-auto w-max">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Workforce Registry ID</p>
              <p className="text-lg font-black text-slate-800 font-mono tracking-widest">{labour.lwfId || 'PENDING'}</p>
            </div>

            {/* Grid Data */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left w-full mb-auto px-2">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Blood Group</p>
                <p className="text-xs font-black text-rose-600">{labour.bloodGroup || 'UNKNOWN'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                <p className="text-xs font-bold text-slate-800">{labour.phone}</p>
              </div>
              <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Aadhaar Verification</p>
                  <p className="text-sm font-black text-slate-700 font-mono tracking-wider">{maskedAadhaar}</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            {/* QR Code Absolute Positioned Bottom Right Corner */}
            <div className="absolute bottom-20 right-6 w-16 h-16 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
              <img src={qrUrl} alt="QR Code" className="w-full h-full mix-blend-multiply" crossOrigin="anonymous" />
            </div>
            
          </div>

          {/* Card Footer Banner */}
          <div className="absolute bottom-0 left-0 w-full bg-slate-900 p-4 text-center z-20">
            <p className="font-bold text-white text-[10px] tracking-wide mb-1 uppercase">Valid Gaya Seva Contractor</p>
            <p className="text-slate-400 text-[8px] tracking-widest uppercase">www.gayaseva.in | Admin Authority</p>
          </div>

        </div>
      </div>
      
      {/* Global CSS for Print specific to ID Cards */}
      <style jsx global>{`
        @media print {
          @page { size: portrait; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            background-color: white !important;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          /* Hide scrollbars during print setup */
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}
