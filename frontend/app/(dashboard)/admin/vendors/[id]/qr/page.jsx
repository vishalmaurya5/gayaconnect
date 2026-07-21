'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function VendorQRStandeePage() {
  const params = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const downloadCard = async () => {
    setIsDownloading(true);
    try {
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }
      
      const cardElement = document.getElementById('qr-standee-card');
      const canvas = await window.html2canvas(cardElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `GayaSeva_Standee_${(vendor?.name || 'Shop').replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error('Failed to download card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-lg font-bold text-slate-700 animate-pulse">Generating Standee...</div>
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 print:m-0 print:p-0 print:space-y-0 print:max-w-none">
      
      {/* Control Panel (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm print:hidden border border-slate-200 dark:border-slate-800 gap-4">
        <Link href="/admin/vendors" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" /> Back to Registry
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadCard}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-70"
          >
            <Download className="w-4 h-4" /> {isDownloading ? 'Downloading...' : 'Download Image'}
          </button>
          <button 
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`
                <html>
                  <head>
                    <title>Print QR Standee</title>
                    <style>
                      body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: flex-start; background: #f1f5f9; font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                      .card { 
                        width: 100%; max-width: 380px; text-align: center; 
                        border-radius: 32px; 
                        background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 50%, #fef3c7 100%);
                        position: relative; overflow: hidden;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                        padding: 12px;
                        height: max-content;
                      }
                      .card-inner {
                        background: white; border-radius: 24px; overflow: hidden;
                        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
                        position: relative; z-index: 5;
                      }
                      .header { 
                        background: white; 
                        padding: 24px 16px 16px 16px; border-bottom: 3px solid #f1f5f9; border-top-left-radius: 24px; border-top-right-radius: 24px;
                        position: relative;
                      }
                      .logo-container { background: white; padding: 6px; border-radius: 50%; display: inline-block; margin-bottom: 12px; position: relative; z-index: 10; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
                      .logo { width: 50px; height: 50px; border-radius: 50%; }
                      .brand-title { font-weight: 900; font-size: 28px; letter-spacing: 0px; margin: 0 0 4px 0; line-height: 1; display: flex; justify-content: center; }
                      .text-gaya { color: #1e293b; }
                      .text-seva { color: #f59e0b; }
                      .tagline { color: #334155; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin: 0; }
                      
                      .content { position: relative; z-index: 20; margin-top: 24px; padding: 0 20px; display: flex; flex-direction: column; align-items: center; }
                      .badge { background: white; color: #059669; padding: 6px 16px; border-radius: 20px; font-weight: 900; font-size: 12px; display: inline-block; margin: 0 auto 16px auto; border: 2px solid #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                      h1 { font-size: 24px; margin: 0 0 16px 0; font-weight: 900; color: #1e293b; text-transform: uppercase; word-break: break-word; border-bottom: 2px dashed #e2e8f0; padding-bottom: 12px; }
                      
                      .qr-container { background: white; padding: 8px; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.1); margin: 0 auto 24px auto; display: inline-block; position: relative; border: 2px solid #e0e7ff; }
                      .qr-image { width: 200px; height: 200px; }
                      .qr-logo { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: white; padding: 4px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 2px solid #f59e0b; }
                      
                      .corner { position: absolute; width: 24px; height: 24px; border: 4px solid #4f46e5; margin: 4px; }
                      .tl { top: 0; left: 0; border-right: none; border-bottom: none; border-top-left-radius: 12px; }
                      .tr { top: 0; right: 0; border-left: none; border-bottom: none; border-top-right-radius: 12px; }
                      .bl { bottom: 0; left: 0; border-right: none; border-top: none; border-bottom-left-radius: 12px; }
                      .br { bottom: 0; right: 0; border-left: none; border-top: none; border-bottom-right-radius: 12px; }

                      .footer { background: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; margin-top: auto; }
                      .footer strong { display: block; font-size: 14px; margin-bottom: 8px; color: #312e81; text-transform: uppercase; letter-spacing: 1px; font-weight: 900; }
                    </style>
                  </head>
                  <body>
                    <div class="card">
                      <div class="card-inner">
                        <div class="header">
                        <div class="logo-container">
                          <img src="${window.location.origin}/gaya_seva_app_icon.png" class="logo" />
                        </div>
                        <div class="brand-title">
                          <span class="text-gaya">Gaya</span>
                          <span class="text-seva">Seva</span>
                        </div>
                        <p class="tagline">Zarurat Aapki, Seva Hamari</p>
                      </div>
                      
                      <div class="content">
                        <div class="badge">✓ VERIFIED PARTNER</div>
                        <h1>${vendor?.name || 'Business Name'}</h1>
                        
                        <div class="qr-container">
                          <div class="corner tl"></div><div class="corner tr"></div>
                          <div class="corner bl"></div><div class="corner br"></div>
                          <img src="https://quickchart.io/qr?text=${encodeURIComponent(window.location.origin + '/vendors/' + vendor._id + '/rate')}&size=300&margin=1" class="qr-image" crossorigin="anonymous" />
                          <img src="${window.location.origin}/gaya_seva_app_icon.png" class="qr-logo" />
                        </div>
                      </div>

                      <div class="footer">
                        <strong>SCAN TO RATE & REVIEW</strong>
                        <div style="display: flex; justify-content: center; color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">
                          <span style="margin: 0 8px;">✓ SAFE</span>
                          <span style="margin: 0 8px;">✓ TRUSTED</span>
                          <span style="margin: 0 8px;">✓ VERIFIED</span>
                        </div>
                        </div>
                      </div>
                    </div>
                    <script>
                      window.onload = () => { setTimeout(() => { window.print(); }, 1500); }
                    </script>
                  </body>
                </html>
              `);
              printWindow.document.close();
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-5 h-5" /> Print Standee
          </button>
        </div>
      </div>

      {/* Standee Canvas Container */}
      <div className="bg-slate-200 dark:bg-slate-800 p-4 sm:p-8 rounded-3xl print:p-0 print:bg-white flex justify-center">
        
        {/* Modern Premium Standee Style */}
        <div 
          id="qr-standee-card"
          className="relative rounded-[32px] p-3 bg-gradient-to-br from-indigo-100 via-white to-amber-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] min-w-[340px] max-w-sm mx-auto w-full flex flex-col"
        >
          {/* Inner White Card */}
          <div className="bg-white rounded-[24px] overflow-hidden flex flex-col items-center text-center w-full border border-white shadow-sm relative">
            {/* Header Section */}
            <div className="w-full bg-white pt-6 pb-6 px-4 relative flex flex-col items-center border-b-[3px] border-slate-100 rounded-t-[20px]">
              <div className="bg-white p-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] mb-3 border border-slate-100">
                <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Logo" className="w-12 h-12 object-contain rounded-full" />
              </div>
              <h3 className="font-black text-[28px] tracking-tight flex items-center justify-center leading-none mb-1.5 w-full">
                <span className="text-[#1e293b]">Gaya</span>
                <span className="text-[#f59e0b]">Seva</span>
              </h3>
              <p className="text-[9px] text-[#334155] font-black uppercase tracking-[0.25em]">Zarurat Aapki, Seva Hamari</p>
            </div>

            {/* Main Content Area */}
            <div className="w-full relative z-20 mt-6 flex flex-col items-center px-4">
              
              {/* Verified Badge */}
              <div className="bg-white border-2 border-emerald-500 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black shadow-md flex items-center justify-center mb-4 inline-flex">
                <FiCheckCircle className="text-emerald-500 text-sm mr-1.5" /> VERIFIED PARTNER
              </div>

              {/* Shop Name */}
              <div className="w-full flex justify-center mb-5 px-3">
                <h2 className="text-[22px] font-extrabold text-[#1e293b] text-center leading-snug tracking-tight max-w-[280px] break-words uppercase border-b-2 border-dashed border-slate-200 pb-3">
                  {vendor.name || 'Your Business Name'}
                </h2>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-2 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] border-2 border-indigo-100 mb-6 relative">
                <img 
                  src={`https://quickchart.io/qr?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/vendors/' + vendor._id + '/rate' : '')}&size=300&margin=1`} 
                  alt="QR Code" 
                  className="w-52 h-52 rounded-xl object-contain"
                  crossOrigin="anonymous" 
                />
                {/* Center Logo in QR */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white p-1 rounded-full shadow-md border-2 border-[#f59e0b]">
                    <img src="/gaya_seva_app_icon.png" alt="Icon" className="w-10 h-10 object-contain rounded-full" />
                  </div>
                </div>
                {/* Corner scan brackets graphic */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-600 rounded-tl-xl m-1"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-600 rounded-tr-xl m-1"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-600 rounded-bl-xl m-1"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-600 rounded-br-xl m-1"></div>
              </div>

            </div>

            {/* Footer Graphics & Text */}
            <div className="w-full bg-slate-50 border-t border-slate-200 p-4 mt-auto">
              <p className="text-indigo-900 font-black text-sm mb-2 uppercase tracking-wider w-full text-center">Scan To Rate & Review</p>
              <div className="flex items-center justify-center text-slate-500">
                <span className="flex items-center text-[10px] font-bold uppercase mx-2"><FiCheckCircle className="text-emerald-500 mr-1" /> Safe</span>
                <span className="flex items-center text-[10px] font-bold uppercase mx-2"><FiCheckCircle className="text-indigo-500 mr-1" /> Trusted</span>
                <span className="flex items-center text-[10px] font-bold uppercase mx-2"><FiCheckCircle className="text-amber-500 mr-1" /> Verified</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
