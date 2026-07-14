'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
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

  if (loading) return <div className="p-10 text-center font-bold">Generating ID Card...</div>;
  if (!labour) return <div className="p-10 text-center font-bold text-red-500">Profile Not Found</div>;

  const maskedAadhaar = labour.aadhaarNumber ? `XXXXXXXX${labour.aadhaarNumber.slice(-4)}` : 'N/A';
  const qrData = `Gaya Seva Workforce ID: ${labour.lwfId || 'PENDING'}\nName: ${labour.name}\nPhone: ${labour.phone}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="max-w-2xl mx-auto space-y-8 print:m-0 print:space-y-0">
      
      {/* Controls (Hidden on Print) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm print:hidden border border-slate-200">
        <Link href="/admin/labour" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold">
          <FiArrowLeft /> Back to Workforce
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition"
        >
          <FiPrinter /> Print ID Card
        </button>
      </div>

      {/* ID Card Wrapper */}
      <div className="flex justify-center print:block print:w-full print:h-screen print:bg-white print:p-0">
        
        {/* The Actual ID Card Design */}
        <div className="w-[320px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 print:shadow-none print:border-slate-300 relative bg-cover bg-center" style={{ backgroundImage: 'url("/patterns/circuit-board.svg")' }}>
          
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            <img src="/logo2.png" alt="Gaya Seva" className="h-10 mx-auto relative z-10 filter brightness-0 invert mb-2" />
            <h2 className="font-black tracking-widest text-sm relative z-10">OFFICIAL ID CARD</h2>
          </div>

          {/* Body */}
          <div className="p-6 text-center bg-white/95 backdrop-blur-sm relative z-10">
            {/* Photo */}
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg mb-4 bg-slate-100 flex items-center justify-center">
              {labour.photo ? (
                <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-slate-300">{labour.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <h1 className="text-xl font-black text-slate-900 leading-tight uppercase">{labour.name}</h1>
            <p className="text-emerald-600 font-bold text-sm tracking-wide mb-1">{labour.role}</p>

            <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Workforce ID</p>
              <p className="text-lg font-black text-slate-800 font-mono tracking-widest">{labour.lwfId || 'PENDING'}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-left mb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p>
                <p className="text-xs font-bold text-slate-800">{labour.bloodGroup || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact</p>
                <p className="text-xs font-bold text-slate-800">{labour.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Operating Region</p>
                <p className="text-xs font-bold text-slate-800 truncate">{labour.district || labour.area}, {labour.state || 'Bihar'}</p>
              </div>
              <div className="col-span-2 mt-2 pt-2 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase text-center">Aadhaar Number (Verified)</p>
                <p className="text-sm font-black text-slate-800 font-mono tracking-[0.2em] text-center">{maskedAadhaar}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                <img src={qrUrl} alt="QR Code" className="w-20 h-20" crossOrigin="anonymous" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-900 p-3 text-center text-white/70 text-[10px]">
            <p className="font-bold text-white mb-1">If found, please return to:</p>
            <p>Gaya Seva Platform Office</p>
            <p>support@gayaseva.com | www.gayaseva.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
