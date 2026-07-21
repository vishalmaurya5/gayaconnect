'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Download, ShieldCheck, User, CheckCircle, MapPin, Users, Droplet, Phone, Globe, FileCheck, UserCheck, Star, Handshake, Shield } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function WorkforceIDCardPage() {
  const params = useParams();
  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
      const canvas = await window.html2canvas(cardElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff' // Or transparent if you prefer
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print:m-0 print:p-0 print:space-y-0 print:w-full">
      
      {/* Control Panel (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm print:hidden border border-slate-200 dark:border-slate-800 gap-4">
        <Link href="/admin/labour" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5" /> Back to Workforce
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
                    <title>Print Labour ID Card</title>
                    <style>
                      body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: flex-start; background: #f1f5f9; font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                      
                      .id-card-wrapper {
                        width: 400px; 
                        height: 640px; 
                        background: #ffffff;
                        border-radius: 24px; 
                        overflow: hidden; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        border: 1px solid #e2e8f0;
                      }

                      .header-bg {
                        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
                        height: 110px;
                        width: 100%;
                        position: relative;
                        border-bottom: 6px solid #f59e0b;
                        border-bottom-left-radius: 50% 15%;
                        border-bottom-right-radius: 50% 15%;
                        display: flex;
                        justify-content: space-between;
                        padding: 15px 25px;
                        box-sizing: border-box;
                        z-index: 5;
                      }

                      .brand-container { display: flex; align-items: flex-start; gap: 10px; }
                      .logo-wrapper { width: 45px; height: 45px; border-radius: 50%; border: 3px solid white; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center; }
                      .logo { width: 100%; height: 100%; object-fit: cover; }
                      .brand-text { display: flex; flex-direction: column; margin-top: 4px; }
                      .brand-title { color: white; font-weight: 900; font-size: 22px; letter-spacing: 1px; margin: 0; line-height: 1; }
                      .brand-title span { color: #f59e0b; }
                      .brand-subtitle { color: rgba(255,255,255,0.7); font-size: 8px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin: 4px 0 0 0; }
                      .brand-seal { position: absolute; top: 90px; left: 35px; width: 45px; height: 45px; z-index: 25; object-fit: contain; border-radius: 50%; background: white; border: 1px solid #e2e8f0; padding: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

                      .verified-shield { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
                      .verified-shield svg { width: 24px; height: 24px; stroke: #f59e0b; }
                      .shield-text { color: white; font-size: 10px; font-weight: 800; line-height: 1.2; text-align: left; margin: 0; }

                      .card-title-box { text-align: center; margin-top: 5px; z-index: 10; position: relative; }
                      .card-title { color: #1e293b; font-size: 11px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
                      .card-title span { color: #f59e0b; margin: 0 6px; }

                      .profile-section { display: flex; justify-content: space-between; align-items: center; padding: 0 15px; margin-top: 10px; position: relative; height: 140px; }
                      
                      .side-badge { display: flex; align-items: center; gap: 8px; background: white; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; width: 85px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
                      .side-badge svg { width: 16px; height: 16px; flex-shrink: 0; stroke: #4338ca; }
                      .side-badge p { font-size: 7px; font-weight: 900; color: #334155; margin: 0; line-height: 1.3; text-transform: uppercase; }

                      .photo-container {
                        width: 120px; height: 120px; border-radius: 50%; background: white; padding: 6px; border: 3px solid #e5e7eb; position: absolute; left: 50%; transform: translateX(-50%); z-index: 10; box-shadow: 0 8px 20px rgba(0,0,0,0.08);
                      }
                      .photo-inner { width: 100%; height: 100%; border-radius: 50%; border: 3px solid #f59e0b; overflow: hidden; display: flex; align-items: center; justify-content: center; }
                      .photo { width: 100%; height: 100%; object-fit: cover; }

                      .name-section { text-align: center; margin-top: 15px; padding: 0 20px; }
                      .shield-center { width: 20px; height: 20px; margin: 0 auto 5px auto; color: #f59e0b; stroke: #f59e0b; }
                      .name { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0 0 4px 0; text-transform: uppercase; line-height: 1.1; letter-spacing: 0.5px; }
                      .profession { color: #4338ca; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; }

                      .id-box { background: #f8fafc; border: 1px dashed #94a3b8; padding: 8px 25px; border-radius: 10px; display: inline-block; margin-bottom: 15px; }
                      .id-label { font-size: 9px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0; }
                      .id-value { font-size: 24px; color: #0f172a; font-weight: 900; font-family: monospace; letter-spacing: 4px; margin: 0; }

                      .info-qr-container { display: flex; background: #f8fafc; margin: 0 20px; border-radius: 12px; border: 1px solid #e2e8f0; height: auto; min-height: 125px; overflow: hidden; }
                      .info-col { flex: 1; padding: 12px 15px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px dashed #cbd5e1; text-align: left; }
                      .info-row { display: flex; align-items: center; gap: 10px; }
                      .info-icon { width: 22px; height: 22px; background: #1e3a8a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
                      .info-icon svg { width: 12px; height: 12px; stroke: white; }
                      .info-text-col { display: flex; flex-direction: column; }
                      .info-text-label { font-size: 8px; font-weight: 800; color: #64748b; letter-spacing: 1px; margin: 0 0 2px 0; text-transform: uppercase; }
                      .info-text-val { font-size: 11px; font-weight: 900; color: #0f172a; margin: 0; }
                      .info-text-val.red { color: #dc2626; }
                      .info-divider { width: 100%; height: 1px; border-bottom: 1px dashed #cbd5e1; margin: 0; }

                      .qr-col { width: 130px; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; text-align: center; }
                      .qr-label { font-size: 9px; font-weight: 900; color: #1e293b; margin: 0 0 2px 0; }
                      .qr-sub { font-size: 8px; font-weight: 800; color: #4338ca; margin: 0 0 6px 0; }
                      .qr-wrapper { position: relative; width: 85px; height: 85px; padding: 2px; border: 1px solid #4338ca; }
                      .qr-img { width: 100%; height: 100%; }
                      .qr-inner-logo { position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; padding: 2px; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

                      .badges-row { display: flex; justify-content: space-between; padding: 15px 25px; margin-top: auto; }
                      .mini-badge { display: flex; align-items: center; gap: 6px; width: 22%; }
                      .mini-badge svg { width: 18px; height: 18px; color: #1e293b; stroke: #1e293b; flex-shrink: 0; }
                      .mini-badge-text { font-size: 7px; font-weight: 800; color: #334155; text-transform: uppercase; line-height: 1.2; margin: 0; }

                      .footer { background: #0f172a; height: 50px; display: flex; justify-content: space-between; align-items: center; padding: 0 25px; color: white; position: relative; }
                      .footer-link { display: flex; align-items: center; gap: 5px; font-size: 9px; font-weight: 700; letter-spacing: 1px; color: #94a3b8; }
                      .footer-link svg { width: 12px; height: 12px; stroke: #94a3b8; }
                      .footer-auth { font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #cbd5e1; }
                      .signature { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; bottom: 8px; }
                      .signature-img { font-family: 'Brush Script MT', cursive, serif; font-size: 26px; color: #f59e0b; margin: 0 0 2px 0; font-style: italic; font-weight: 400; line-height: 1; }
                      .signature-text { font-size: 7px; font-weight: 800; letter-spacing: 1px; color: white; text-transform: uppercase; margin: 0; }
                    </style>
                  </head>
                  <body>
                    <div class="id-card-wrapper">
                      <div class="header-bg">
                        <div class="brand-container">
                          <div class="logo-wrapper">
                            <img src="${window.location.origin}/gaya_seva_app_icon.png" class="logo" />
                          </div>
                          <div class="brand-text">
                            <h2 class="brand-title">GAYA<span>SEVA</span></h2>
                            <p class="brand-subtitle">Zarurat Aapki, Seva Hamari</p>
                          </div>
                        </div>
                        <div class="verified-shield">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                          <p class="shield-text">VERIFIED<br/>WORKFORCE</p>
                        </div>
                      </div>

                      <div class="card-title-box">
                        <h3 class="card-title"><span>•</span> LOCAL WORKFORCE ID CARD <span>•</span></h3>
                      </div>

                      <div class="profile-section">
                        <div class="side-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                          <p>TRUSTED<br/>SKILLED<br/>RELIABLE</p>
                        </div>
                        <img src="${window.location.origin}/local_workforce _seal.png" class="brand-seal" crossorigin="anonymous" />
                        
                        <div class="photo-container">
                          <div class="photo-inner">
                            ${labour?.photo 
                              ? `<img src="${labour.photo}" class="photo" crossorigin="anonymous" />` 
                              : `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
                            }
                          </div>
                        </div>

                        <div class="side-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          <p>BUILDING<br/>STRONGER<br/>COMMUNITIES</p>
                        </div>
                      </div>

                      <div class="name-section">
                        <svg class="shield-center" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        <h1 class="name">${labour?.name || 'Worker Name'}</h1>
                        <h2 class="profession">${labour?.profession || labour?.role || labour?.category || 'Local Worker'}</h2>
                        
                        <div class="id-box">
                          <p class="id-label">Workforce ID</p>
                          <p class="id-value">${labour?.lwfId || 'PENDING'}</p>
                        </div>
                      </div>

                      <div class="info-qr-container">
                        <div class="info-col">
                          <div class="info-row">
                            <div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg></div>
                            <div class="info-text-col">
                              <p class="info-text-label">Blood Group</p>
                              <p class="info-text-val red">${labour?.bloodGroup || 'N/A'}</p>
                            </div>
                          </div>
                          <div class="info-divider"></div>
                          <div class="info-row">
                            <div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                            <div class="info-text-col">
                              <p class="info-text-label">Phone</p>
                              <p class="info-text-val">${labour?.phone || 'N/A'}</p>
                            </div>
                          </div>
                          <div class="info-divider"></div>
                          <div class="info-row">
                            <div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                            <div class="info-text-col">
                              <p class="info-text-label">Address / Area</p>
                              <p class="info-text-val">${labour?.location || labour?.address || labour?.district || 'Gaya, Bihar'}</p>
                            </div>
                          </div>
                        </div>
                        <div class="qr-col">
                          <p class="qr-label">SCAN TO</p>
                          <p class="qr-sub">VIEW PROFILE & REVIEWS</p>
                          <div class="qr-wrapper">
                            <img src="https://quickchart.io/qr?text=${encodeURIComponent('GAYA SEVA - WORKFORCE\nName: ' + (labour?.name || '') + '\nRole: ' + (labour?.profession || labour?.role || labour?.category || 'Worker') + '\nID: ' + (labour?.lwfId || 'PENDING') + '\nPhone: ' + (labour?.phone || 'N/A') + '\nBlood: ' + (labour?.bloodGroup || 'N/A') + '\nAddress: ' + (labour?.location || labour?.address || labour?.district || 'Gaya, Bihar'))}&size=200&margin=0" class="qr-img" crossorigin="anonymous" />
                            <img src="${window.location.origin}/gaya_seva_app_icon.png" class="qr-inner-logo" />
                          </div>
                        </div>
                      </div>

                      <div class="badges-row">
                        <div class="mini-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                          <p class="mini-badge-text">VERIFIED BY<br/>GAYASEVA</p>
                        </div>
                        <div class="mini-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                          <p class="mini-badge-text">BACKGROUND<br/>VERIFIED</p>
                        </div>
                        <div class="mini-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          <p class="mini-badge-text">SKILLED &<br/>TRAINED</p>
                        </div>
                        <div class="mini-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path></svg>
                          <p class="mini-badge-text">TRUSTED BY<br/>COMMUNITY</p>
                        </div>
                      </div>

                      <div class="footer">
                        <div class="footer-link">
                          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          gayaseva.com
                        </div>
                        <div class="signature">
                          <p class="signature-img">Gayaseva</p>
                          <p class="signature-text">AUTHORIZED SIGNATURE</p>
                        </div>
                        <div class="footer-auth">ADMIN AUTHORITY</div>
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
            <Printer className="w-5 h-5" /> Print ID Card
          </button>
        </div>
      </div>

      {/* ID Card Canvas Container */}
      <div className="bg-slate-200 dark:bg-slate-800 p-8 sm:p-12 rounded-3xl print:p-0 print:bg-white flex justify-center">
        
        {/* Rendered Component for html2canvas */}
        <div 
          id="labour-id-card"
          className="w-[400px] h-[640px] bg-white rounded-[24px] overflow-hidden relative flex flex-col border border-slate-200 shadow-2xl font-sans"
        >
          {/* Header Area */}
          <div className="h-[110px] w-full bg-gradient-to-br from-slate-900 to-indigo-900 relative border-b-[6px] border-amber-500 rounded-b-[50%] flex justify-between px-6 py-4 z-10" style={{ borderBottomLeftRadius: '50% 15%', borderBottomRightRadius: '50% 15%' }}>
            <div className="flex items-start gap-2.5">
              <div className="w-[45px] h-[45px] bg-white rounded-full border-[3px] border-white overflow-hidden shadow-md flex items-center justify-center">
                <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col mt-1">
                <h2 className="text-white font-black text-[22px] tracking-wide leading-none m-0">GAYA<span className="text-amber-500">SEVA</span></h2>
                <p className="text-white/70 text-[8px] font-extrabold tracking-[1.5px] uppercase mt-1">Zarurat Aapki, Seva Hamari</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <p className="text-white text-[10px] font-extrabold leading-tight">VERIFIED<br/>WORKFORCE</p>
            </div>
          </div>

          <div className="text-center mt-1 z-20 relative">
            <h3 className="text-slate-800 text-[11px] font-black tracking-[4px] uppercase"><span className="text-amber-500 mx-1">•</span> LOCAL WORKFORCE ID CARD <span className="text-amber-500 mx-1">•</span></h3>
          </div>

          <div className="flex justify-between items-center px-4 mt-3 relative h-[140px]">
            <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-lg border border-slate-200 w-[85px] shadow-sm z-20">
              <ShieldCheck className="w-4 h-4 text-indigo-700 flex-shrink-0" />
              <p className="text-[7px] font-black text-slate-700 leading-snug m-0 uppercase">TRUSTED<br/>SKILLED<br/>RELIABLE</p>
            </div>
            <img src="/local_workforce _seal.png" alt="Brand Seal" className="absolute top-[90px] left-[35px] w-[45px] h-[45px] object-contain z-30 shadow-sm bg-white rounded-full p-0.5 border border-slate-200" crossOrigin="anonymous" />
            
            <div className="absolute left-1/2 -translate-x-1/2 w-[120px] h-[120px] bg-white rounded-full p-1.5 border-[3px] border-slate-200 shadow-xl z-30">
              <div className="w-full h-full rounded-full border-[3px] border-amber-500 overflow-hidden bg-slate-50 flex items-center justify-center">
                {labour?.photo ? (
                  <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-lg border border-slate-200 w-[85px] shadow-sm z-20">
              <Users className="w-4 h-4 text-indigo-700 flex-shrink-0" />
              <p className="text-[7px] font-black text-slate-700 leading-snug m-0 uppercase">BUILDING<br/>STRONGER<br/>COMMUNITIES</p>
            </div>
          </div>

          <div className="text-center mt-4 px-5 relative z-20">
            <Shield className="w-5 h-5 text-amber-500 mx-auto mb-1 fill-amber-500/20" />
            <h1 className="text-[26px] font-black text-slate-900 uppercase leading-[1.1] mb-1 tracking-[0.5px]">{labour?.name}</h1>
            <h2 className="text-[14px] font-black text-indigo-700 uppercase tracking-[2px] mb-4">{labour?.profession || labour?.role || labour?.category || 'Local Worker'}</h2>
            
            <div className="bg-slate-50 border border-slate-400 border-dashed px-6 py-2 rounded-xl inline-block mb-4">
              <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-[2px] mb-1">Workforce ID</p>
              <p className="text-[24px] font-black text-slate-900 font-mono tracking-[4px] leading-none">{labour?.lwfId || 'PENDING'}</p>
            </div>
          </div>

          <div className="flex items-stretch bg-slate-50 mx-5 rounded-xl border border-slate-200 min-h-[125px] overflow-hidden relative z-20">
            <div className="flex-1 p-3 flex flex-col justify-between border-r border-slate-300 border-dashed text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-[22px] h-[22px] bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 text-white"><Droplet className="w-3 h-3" /></div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-[1px] mb-0.5">Blood Group</span>
                  <span className="text-[11px] font-black text-rose-600 leading-none">{labour?.bloodGroup || 'N/A'}</span>
                </div>
              </div>
              <div className="w-full h-px border-b border-slate-300 border-dashed"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-[22px] h-[22px] bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 text-white"><Phone className="w-3 h-3" /></div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-[1px] mb-0.5">Phone</span>
                  <span className="text-[11px] font-black text-slate-900 leading-none">{labour?.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="w-full h-px border-b border-slate-300 border-dashed"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-[22px] h-[22px] bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 text-white"><MapPin className="w-3 h-3" /></div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-[1px] mb-0.5">Address / Area</span>
                  <span className="text-[11px] font-black text-slate-900 leading-none">{labour?.location || labour?.address || labour?.district || 'Gaya, Bihar'}</span>
                </div>
              </div>
            </div>
            
            <div className="w-[130px] p-2.5 flex flex-col items-center justify-center bg-white text-center">
              <p className="text-[9px] font-black text-slate-800 m-0">SCAN TO</p>
              <p className="text-[8px] font-extrabold text-indigo-700 m-0 mb-1.5">VIEW PROFILE & REVIEWS</p>
              <div className="relative w-[85px] h-[85px] p-[2px] border border-indigo-700">
                <img 
                  src={`https://quickchart.io/qr?text=${encodeURIComponent('GAYA SEVA - WORKFORCE\nName: ' + (labour?.name || '') + '\nRole: ' + (labour?.profession || labour?.role || labour?.category || 'Worker') + '\nID: ' + (labour?.lwfId || 'PENDING') + '\nPhone: ' + (labour?.phone || 'N/A') + '\nBlood: ' + (labour?.bloodGroup || 'N/A') + '\nAddress: ' + (labour?.location || labour?.address || labour?.district || 'Gaya, Bihar'))}&size=200&margin=0`} 
                  alt="QR Code" 
                  className="w-full h-full mix-blend-multiply" 
                  crossOrigin="anonymous" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full p-[1.5px] shadow-sm">
                  <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between px-6 py-4 mt-auto">
            <div className="flex items-center gap-1.5 w-[22%]">
              <FileCheck className="w-[18px] h-[18px] text-slate-800 flex-shrink-0" />
              <p className="text-[7px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">VERIFIED BY<br/>GAYASEVA</p>
            </div>
            <div className="flex items-center gap-1.5 w-[22%]">
              <UserCheck className="w-[18px] h-[18px] text-slate-800 flex-shrink-0" />
              <p className="text-[7px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">BACKGROUND<br/>VERIFIED</p>
            </div>
            <div className="flex items-center gap-1.5 w-[22%]">
              <Star className="w-[18px] h-[18px] text-slate-800 flex-shrink-0" />
              <p className="text-[7px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">SKILLED &<br/>TRAINED</p>
            </div>
            <div className="flex items-center gap-1.5 w-[22%]">
              <Handshake className="w-[18px] h-[18px] text-slate-800 flex-shrink-0" />
              <p className="text-[7px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">TRUSTED BY<br/>COMMUNITY</p>
            </div>
          </div>

          <div className="h-[50px] w-full bg-slate-900 flex justify-between items-center px-6 relative z-20">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3 h-3" />
              <span className="text-[9px] font-bold tracking-wide">gayaseva.com</span>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-center flex flex-col items-center">
              <span className="text-[26px] text-amber-500 italic leading-none mb-0.5" style={{ fontFamily: '"Brush Script MT", cursive, serif' }}>Gayaseva</span>
              <span className="text-[7px] font-extrabold text-white tracking-widest uppercase">AUTHORIZED SIGNATURE</span>
            </div>
            
            <div className="text-[9px] font-extrabold text-slate-300 tracking-widest">
              ADMIN AUTHORITY
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
