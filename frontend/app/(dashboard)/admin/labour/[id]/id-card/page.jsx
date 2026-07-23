'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Printer, ArrowLeft, Download, ShieldCheck, User, MapPin, Droplet, Phone, Globe, Users, Award, Handshake, FileCheck, UserCheck, Shield
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function WorkforceIDCardPage() {
  const params = useParams();
  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
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

  const publicProfileUrl = origin ? `${origin}/labour/${params.id}` : `/labour/${params.id}`;
  const qrCodeImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(publicProfileUrl)}&size=300&margin=0`;

  const downloadCard = async () => {
    setIsDownloading(true);
    try {
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }
      
      const cardElement = document.getElementById('labour-id-card');
      
      // Wait for all images inside card to load completely
      const images = cardElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
      
      const canvas = await window.html2canvas(cardElement, {
        scale: 3, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `GayaSeva_ID_${(labour?.name || 'Worker').replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error('Failed to download ID Card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Labour ID Card - ${labour?.name || 'Worker'}</title>
          <style>
            @page {
              size: 65mm 95mm;
              margin: 0;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #ffffff;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .print-card-wrapper {
              width: 65mm;
              height: 95mm;
              background: #ffffff;
              overflow: hidden;
              position: relative;
              display: flex;
              flex-direction: column;
              border: 0.5px solid #cbd5e1;
              page-break-inside: avoid;
            }
            
            .header-bg {
              background: linear-gradient(135deg, #07142a 0%, #0b1936 100%) !important;
              height: 19mm;
              padding: 1.8mm 2.5mm;
              position: relative;
              border-bottom: 1.2mm solid #f59e0b !important;
              border-bottom-left-radius: 50% 3.5mm !important;
              border-bottom-right-radius: 50% 3.5mm !important;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              flex-shrink: 0;
            }
            .brand-container { display: flex; align-items: center; gap: 1.5mm; }
            .logo-wrapper { width: 6.5mm; height: 6.5mm; border-radius: 50%; border: 0.5px solid white; overflow: hidden; background: white; flex-shrink: 0; }
            .logo { width: 100%; height: 100%; object-fit: cover; }
            .brand-text { display: flex; flex-direction: column; }
            .brand-title { color: white; font-weight: 900; font-size: 11px; letter-spacing: 0px; margin: 0; line-height: 1.1; }
            .brand-title span { color: #f59e0b; }
            .brand-subtitle { color: rgba(255,255,255,0.75); font-size: 4px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 1px; }
            
            .verified-shield { text-align: right; }
            .shield-text { color: white; font-size: 4.8px; font-weight: 800; line-height: 1.1; margin: 0; }
            .shield-icon { width: 3.5mm; height: 3.5mm; color: #f59e0b; stroke: #f59e0b; display: inline-block; }

            .card-title-box { text-align: center; margin-top: 1mm; flex-shrink: 0; }
            .card-title { color: #1e293b; font-size: 5.8px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin: 0; }
            .card-title span { color: #f59e0b; margin: 0 2px; }

            .profile-section { display: flex; justify-content: space-between; align-items: center; padding: 0 2mm; margin-top: 1mm; position: relative; height: 18mm; flex-shrink: 0; }
            
            .side-badge { display: flex; align-items: center; gap: 1mm; background: white; padding: 1mm; border-radius: 1.5mm; border: 0.5px solid #e2e8f0; width: 14mm; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
            .side-badge svg { width: 2.5mm; height: 2.5mm; flex-shrink: 0; stroke: #312e81; }
            .side-badge p { font-size: 3.8px; font-weight: 900; color: #334155; margin: 0; line-height: 1.2; text-transform: uppercase; }

            .photo-container {
              width: 17.5mm; height: 17.5mm; border-radius: 50%; background: white; padding: 0.6mm; border: 1.5px solid #e5e7eb; position: absolute; left: 50%; transform: translateX(-50%); z-index: 10;
            }
            .photo-inner { width: 100%; height: 100%; border-radius: 50%; border: 1px solid #f59e0b; overflow: hidden; display: flex; align-items: center; justify-content: center; }
            .photo { width: 100%; height: 100%; object-fit: cover; }

            .name-section { text-align: center; margin-top: 1mm; padding: 0 2mm; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
            .name { font-size: 11px; font-weight: 900; color: #0f172a; margin: 0 0 0.5mm 0; text-transform: uppercase; line-height: 1.3; letter-spacing: 0px; word-spacing: 1px; }
            .profession { color: #312e81; font-size: 6.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 1mm 0; line-height: 1.3; }

            .id-box { background: #ffffff; border: 0.5px dashed #818cf8; padding: 1mm 3mm; border-radius: 1.5mm; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 1mm; min-width: 36mm; }
            .id-label { font-size: 4px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0; line-height: 1.3; display: block; }
            .id-value { font-size: 9.5px; color: #0f172a; font-weight: 900; font-family: monospace; letter-spacing: 1.5px; margin: 0; line-height: 1.3; display: block; padding-top: 0.5mm; }

            .info-qr-container { display: flex; background: #f8fafc; margin: 0 2mm; border-radius: 1.5mm; border: 0.5px solid #e2e8f0; overflow: hidden; height: auto; min-height: 18mm; }
            .info-col { flex: 1; padding: 1.2mm 2mm; display: flex; flex-direction: column; justify-content: space-between; border-right: 0.5px dashed #cbd5e1; text-align: left; }
            .info-row { display: flex; align-items: center; gap: 1mm; }
            .info-icon { width: 3.5mm; height: 3.5mm; background: #07142a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
            .info-icon svg { width: 2mm; height: 2mm; stroke: white; }
            .info-text-col { display: flex; flex-direction: column; min-width: 0; }
            .info-text-label { font-size: 4px; font-weight: 800; color: #64748b; letter-spacing: 0.5px; margin: 0; text-transform: uppercase; line-height: 1.2; }
            .info-text-val { font-size: 6.5px; font-weight: 900; color: #0f172a; margin: 0; line-height: 1.3; padding-bottom: 0.2mm; }
            .info-text-val.red { color: #dc2626; }
            .info-divider { width: 100%; height: 0.5px; border-bottom: 0.5px dashed #cbd5e1; margin: 0.5mm 0; }

            .qr-col { width: 18mm; padding: 1mm; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; text-align: center; flex-shrink: 0; }
            .qr-label { font-size: 4.5px; font-weight: 900; color: #1e293b; margin: 0; line-height: 1.1; }
            .qr-sub { font-size: 4px; font-weight: 800; color: #312e81; margin: 0 0 0.8mm 0; line-height: 1.1; }
            .qr-wrapper { position: relative; width: 12.5mm; height: 12.5mm; padding: 0.5px; border: 0.5px solid #312e81; }
            .qr-img { width: 100%; height: 100%; }
            .qr-inner-logo { position: absolute; width: 3mm; height: 3mm; background: white; border-radius: 50%; padding: 0.3px; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 0.5px 2px rgba(0,0,0,0.2); }

            .badges-row { display: flex; justify-content: space-between; padding: 1.2mm 2mm; margin-top: auto; border-top: 0.5px solid #e2e8f0; flex-shrink: 0; }
            .mini-badge { display: flex; align-items: center; gap: 0.8mm; width: 23%; }
            .mini-badge svg { width: 2.3mm; height: 2.3mm; color: #1e293b; stroke: #1e293b; flex-shrink: 0; }
            .mini-badge-text { font-size: 3.8px; font-weight: 800; color: #334155; text-transform: uppercase; line-height: 1.1; margin: 0; }

            .footer { background: #07142a; height: 5mm; display: flex; justify-content: space-between; align-items: center; padding: 0 2mm; color: white; position: relative; flex-shrink: 0; }
            .footer-link { font-size: 5px; font-weight: 700; letter-spacing: 0.5px; color: #94a3b8; }
            .footer-auth { font-size: 5px; font-weight: 800; letter-spacing: 0.5px; color: #cbd5e1; }
            .signature { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; bottom: 0.5mm; }
            .signature-img { font-family: 'Brush Script MT', cursive, serif; font-size: 10px; color: #f59e0b; margin: 0; font-style: italic; line-height: 1; }
            .signature-text { font-size: 3.8px; font-weight: 800; letter-spacing: 0.5px; color: white; text-transform: uppercase; margin: 0; }
          </style>
        </head>
        <body>
          <div class="print-card-wrapper">
            <div class="header-bg">
              <div class="brand-container">
                <div class="logo-wrapper">
                  <img src="${origin}/gaya_seva_app_icon.png" class="logo" />
                </div>
                <div class="brand-text">
                  <h2 class="brand-title">GAYA<span>SEVA</span></h2>
                  <p class="brand-subtitle">ZARURAT AAPKI, SEVA HAMARI</p>
                </div>
              </div>
              <div class="verified-shield">
                <svg class="shield-icon" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <p class="shield-text">VERIFIED<br/>WORKFORCE</p>
              </div>
            </div>

            <div class="card-title-box">
              <h3 class="card-title"><span>•</span> LOCAL WORKFORCE ID CARD <span>•</span></h3>
            </div>

            <div class="profile-section">
              <div class="side-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <p>TRUSTED<br/>SKILLED<br/>RELIABLE</p>
              </div>
              
              <div class="photo-container">
                <div class="photo-inner">
                  ${labour?.photo 
                    ? `<img src="${labour.photo}" class="photo" />` 
                    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
                  }
                </div>
              </div>

              <div class="side-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <p>BUILDING<br/>STRONGER<br/>COMMUNITIES</p>
              </div>
            </div>

            <div class="name-section">
              <h1 class="name">${labour?.name || 'Worker Name'}</h1>
              <h2 class="profession">${labour?.profession || labour?.role || labour?.category || 'Local Worker'}</h2>
              
              <div class="id-box">
                <span class="id-label">WORKFORCE ID</span>
                <span class="id-value">${labour?.lwfId || 'GS-LWF-000001'}</span>
              </div>
            </div>

            <div class="info-qr-container">
              <div class="info-col">
                <div class="info-row">
                  <div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg></div>
                  <div class="info-text-col">
                    <p class="info-text-label">Blood Group</p>
                    <p class="info-text-val red">${labour?.bloodGroup || 'N/A'}</p>
                  </div>
                </div>
                <div class="info-divider"></div>
                <div class="info-row">
                  <div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                  <div class="info-text-col">
                    <p class="info-text-label">Phone</p>
                    <p class="info-text-val">${labour?.phone || 'N/A'}</p>
                  </div>
                </div>
                <div class="info-divider"></div>
                <div class="info-row">
                  <div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                  <div class="info-text-col">
                    <p class="info-text-label">Address / Area</p>
                    <p class="info-text-val">${labour?.location || labour?.address || labour?.district || 'Gaya, Bihar, India'}</p>
                  </div>
                </div>
              </div>
              
              <div class="qr-col">
                <p class="qr-label">SCAN TO</p>
                <p class="qr-sub">VIEW PROFILE & REVIEWS</p>
                <div class="qr-wrapper">
                  <img src="${qrCodeImageUrl}" class="qr-img" />
                  <img src="${origin}/gaya_seva_app_icon.png" class="qr-inner-logo" />
                </div>
              </div>
            </div>

            <div class="badges-row">
              <div class="mini-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <p class="mini-badge-text">VERIFIED BY<br/>GAYASEVA</p>
              </div>
              <div class="mini-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                <p class="mini-badge-text">BACKGROUND<br/>VERIFIED</p>
              </div>
              <div class="mini-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <p class="mini-badge-text">SKILLED &<br/>TRAINED</p>
              </div>
              <div class="mini-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path></svg>
                <p class="mini-badge-text">TRUSTED BY<br/>COMMUNITY</p>
              </div>
            </div>

            <div class="footer">
              <div class="footer-link">www.gayaseva.com</div>
              <div class="signature">
                <p class="signature-img">Gayaseva</p>
                <p class="signature-text">AUTHORIZED SIGNATURE</p>
              </div>
              <div class="footer-auth">ADMIN AUTHORITY</div>
            </div>
          </div>
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 800); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin"></div>
        <div className="text-lg font-bold text-slate-700 dark:text-slate-300 animate-pulse">Generating GayaSeva Official ID Card...</div>
      </div>
    );
  }

  if (!labour) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">Worker Profile Not Found</div>
        <Link href="/admin/labour" className="text-indigo-600 font-medium hover:underline">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print:m-0 print:p-0 print:space-y-0 print:w-full">
      
      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm print:hidden border border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <Link href="/admin/labour" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <span className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800">
            Standard Template Size: 65mm × 95mm (Portrait Badge)
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadCard}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-70 text-sm"
          >
            <Download className="w-4 h-4" /> {isDownloading ? 'Downloading...' : 'Download Image'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 text-sm"
          >
            <Printer className="w-4 h-4" /> Print 65x95mm Card
          </button>
        </div>
      </div>

      {/* ID Card Display Screen Canvas - Robust Inline Styling with Zero Font Collisions */}
      <div className="bg-slate-200 dark:bg-slate-900 p-6 sm:p-12 rounded-3xl flex flex-col items-center justify-center gap-4">
        
        {/* Rendered Component canvas (400px x 650px - Standard 65x95mm aspect ratio) */}
        <div 
          id="labour-id-card"
          className="w-[400px] bg-white rounded-[24px] overflow-hidden relative flex flex-col border border-slate-300 shadow-2xl font-sans select-none box-border"
          style={{ width: '400px', minHeight: '650px' }}
        >
          {/* Header Area */}
          <div 
            className="h-[110px] w-full bg-gradient-to-r from-[#07142A] to-[#0B1936] relative border-b-[4px] border-amber-500 flex justify-between px-6 py-4 z-10 flex-shrink-0"
            style={{ borderBottomLeftRadius: '50% 18px', borderBottomRightRadius: '50% 18px' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-[45px] h-[45px] bg-white rounded-full border-2 border-white overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-white font-black text-[22px] tracking-normal leading-tight m-0" style={{ letterSpacing: '0px' }}>GAYA<span className="text-amber-500">SEVA</span></h2>
                <p className="text-white/70 text-[8px] font-black tracking-wider uppercase mt-0.5 leading-tight m-0">ZARURAT AAPKI, SEVA HAMARI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-right">
              <ShieldCheck className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <p className="text-white text-[9px] font-black leading-tight m-0">VERIFIED<br/>WORKFORCE</p>
            </div>
          </div>

          {/* Sub Header */}
          <div className="text-center mt-2 z-20 relative flex-shrink-0">
            <h3 className="text-slate-800 text-[11px] font-black tracking-widest uppercase m-0 leading-tight">
              <span className="text-amber-500 mx-1.5">•</span> LOCAL WORKFORCE ID CARD <span className="text-amber-500 mx-1.5">•</span>
            </h3>
          </div>

          {/* Profile Photo & Floating Badges */}
          <div className="flex justify-between items-center px-4 mt-2 relative h-[135px] flex-shrink-0">
            <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-xl border border-slate-200 w-[90px] shadow-sm z-20">
              <ShieldCheck className="w-4 h-4 text-indigo-900 flex-shrink-0" />
              <p className="text-[7.5px] font-black text-slate-700 leading-snug m-0 uppercase">TRUSTED<br/>SKILLED<br/>RELIABLE</p>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 w-[125px] h-[125px] bg-white rounded-full p-1 border-2 border-slate-200 shadow-xl z-30">
              <div className="w-full h-full rounded-full border-[3px] border-amber-500 overflow-hidden bg-slate-50 flex items-center justify-center">
                {labour?.photo ? (
                  <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-xl border border-slate-200 w-[90px] shadow-sm z-20">
              <Users className="w-4 h-4 text-indigo-900 flex-shrink-0" />
              <p className="text-[7.5px] font-black text-slate-700 leading-snug m-0 uppercase">BUILDING<br/>STRONGER<br/>COMMUNITIES</p>
            </div>
          </div>

          {/* Name & Title - FIXED: Clean font styles without letter collision */}
          <div className="text-center mt-2 px-5 relative z-20 flex flex-col items-center flex-shrink-0">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-px bg-amber-400 w-8"></div>
              <Shield className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <div className="h-px bg-amber-400 w-8"></div>
            </div>

            <h1 
              className="m-0 p-0 text-[#0f172a] font-black text-[24px] uppercase leading-[1.3]"
              style={{ letterSpacing: '0px', wordSpacing: '2px', wordBreak: 'keep-all' }}
            >
              {labour?.name}
            </h1>
            <h2 
              className="mt-0.5 mb-2 p-0 text-[#312e81] font-black text-[13px] uppercase leading-[1.3]"
              style={{ letterSpacing: '1.5px' }}
            >
              {labour?.profession || labour?.role || labour?.category || 'LOCAL WORKER'}
            </h2>
            
            {/* Workforce ID Box - Fixed vertical padding & centering for html2canvas */}
            <div 
              style={{
                background: '#ffffff',
                border: '1.5px dashed #818cf8',
                padding: '10px 24px 12px 24px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                marginTop: '4px',
                minWidth: '250px',
                width: 'fit-content',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.2', display: 'block', margin: 0 }}>WORKFORCE ID</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '2.5px', lineHeight: '1.2', display: 'block', marginTop: '4px', marginBotom: 0 }}>{labour?.lwfId || 'GS-LWF-000001'}</span>
            </div>
          </div>

          {/* Details & QR Code Block */}
          <div className="flex items-stretch bg-slate-50 mx-4 rounded-2xl border border-slate-200 overflow-hidden relative z-20 my-1">
            {/* Left Info Column */}
            <div className="flex-1 p-2.5 flex flex-col justify-between border-r border-slate-300 border-dashed text-left space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] bg-[#07142A] rounded-full flex items-center justify-center flex-shrink-0 text-white"><Droplet className="w-3.5 h-3.5" /></div>
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', lineHeight: '1.2' }}>Blood Group</span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#dc2626', lineHeight: '1.3', paddingBottom: '2px' }}>{labour?.bloodGroup || 'N/A'}</span>
                </div>
              </div>
              
              <div className="w-full h-px border-b border-slate-300 border-dashed"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] bg-[#07142A] rounded-full flex items-center justify-center flex-shrink-0 text-white"><Phone className="w-3.5 h-3.5" /></div>
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', lineHeight: '1.2' }}>Phone</span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', lineHeight: '1.3', paddingBottom: '2px' }}>{labour?.phone || 'N/A'}</span>
                </div>
              </div>
              
              <div className="w-full h-px border-b border-slate-300 border-dashed"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] bg-[#07142A] rounded-full flex items-center justify-center flex-shrink-0 text-white"><MapPin className="w-3.5 h-3.5" /></div>
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', lineHeight: '1.2' }}>Address / Area</span>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#0f172a', lineHeight: '1.3', paddingBottom: '2px', display: 'block' }}>{labour?.location || labour?.address || labour?.district || 'Gaya, Bihar, India'}</span>
                </div>
              </div>
            </div>
            
            {/* Right QR Column */}
            <div className="w-[130px] p-2 flex flex-col items-center justify-center bg-white text-center flex-shrink-0">
              <p className="text-[9px] font-black text-slate-800 m-0 leading-tight">SCAN TO</p>
              <p className="text-[7.5px] font-extrabold text-indigo-900 m-0 mb-1 leading-tight">VIEW PROFILE & REVIEWS</p>
              <div className="relative w-[82px] h-[82px] p-[2px] border border-indigo-900 rounded-md bg-white flex-shrink-0">
                <img 
                  src={qrCodeImageUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain" 
                  crossOrigin="anonymous" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-white rounded-full p-[1.5px] shadow-md border border-slate-200">
                  <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex justify-between px-5 py-2 mt-auto flex-shrink-0">
            <div className="flex items-center gap-1.5 w-[23%]">
              <FileCheck className="w-[15px] h-[15px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">VERIFIED BY<br/>GAYASEVA</p>
            </div>
            <div className="flex items-center gap-1.5 w-[23%]">
              <UserCheck className="w-[15px] h-[15px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">BACKGROUND<br/>VERIFIED</p>
            </div>
            <div className="flex items-center gap-1.5 w-[23%]">
              <Award className="w-[15px] h-[15px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">SKILLED &<br/>TRAINED</p>
            </div>
            <div className="flex items-center gap-1.5 w-[23%]">
              <Handshake className="w-[15px] h-[15px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">TRUSTED BY<br/>COMMUNITY</p>
            </div>
          </div>

          {/* Footer Bar */}
          <div 
            className="h-[44px] w-full bg-[#07142A] flex justify-between items-center px-5 relative z-20 text-white flex-shrink-0"
            style={{ borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}
          >
            <div className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3 h-3 text-slate-300" />
              <span className="text-[8.5px] font-bold tracking-wide">www.gayaseva.com</span>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1.5 text-center flex flex-col items-center">
              <span className="text-[22px] text-amber-500 italic leading-none mb-0.5" style={{ fontFamily: '"Brush Script MT", cursive, serif' }}>Gayaseva</span>
              <span className="text-[6.5px] font-extrabold text-white tracking-widest uppercase">AUTHORIZED SIGNATURE</span>
            </div>
            
            <div className="text-[8.5px] font-extrabold text-slate-300 tracking-widest">
              ADMIN AUTHORITY
            </div>
          </div>

        </div>

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Scanning the QR Code above opens the public profile at <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">{publicProfileUrl}</code>
        </p>

      </div>
    </div>
  );
}
