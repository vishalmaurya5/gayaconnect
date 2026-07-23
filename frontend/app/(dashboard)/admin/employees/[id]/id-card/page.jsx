'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Printer, ArrowLeft, Download, ShieldCheck, User, MapPin, Droplet, Phone, Globe, Users, Award, Handshake, FileCheck, UserCheck, Shield, CreditCard, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EmployeeIDCardPage() {
  const params = useParams();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    fetchEmployee();
  }, [params.id]);

  const fetchEmployee = async () => {
    try {
      const res = await fetch(`/api/admin/employees/${params.id}`);
      const json = await res.json();
      if (json.success) setEmp(json.employee);
      else toast.error('Employee not found');
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const publicVerificationUrl = origin ? `${origin}/employee/${emp?._id || params.id}` : `/employee/${params.id}`;
  const qrCodeImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(publicVerificationUrl)}&size=300&margin=0`;

  const downloadCard = async () => {
    setIsDownloading(true);
    try {
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }
      
      const cardElement = document.getElementById('employee-id-card');
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
      link.download = `GayaSeva_EmpID_${(emp?.name || 'Staff').replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error(err);
      toast.error('Failed to download ID Card');
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
          <title>Print Employee ID Card - ${emp?.name || 'Staff'}</title>
          <style>
            @page { size: 65mm 95mm; margin: 0; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #ffffff; font-family: system-ui, sans-serif; }
            .card { width: 65mm; height: 95mm; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; border: 0.5px solid #cbd5e1; page-break-inside: avoid; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%) !important; height: 18mm; padding: 1.5mm 2.5mm; border-bottom: 1.2mm solid #6366f1 !important; border-bottom-left-radius: 50% 3.5mm !important; border-bottom-right-radius: 50% 3.5mm !important; display: flex; justify-content: space-between; }
            .logo-box { display: flex; align-items: center; gap: 1.5mm; }
            .logo { width: 6.5mm; height: 6.5mm; border-radius: 50%; }
            .title { color: white; font-weight: 900; font-size: 11px; margin: 0; }
            .title span { color: #f59e0b; }
            .subtitle { color: rgba(255,255,255,0.7); font-size: 4px; font-weight: 800; text-transform: uppercase; }
            .photo-box { width: 17mm; height: 17mm; border-radius: 50%; border: 1.5px solid #6366f1; padding: 0.5mm; background: white; margin: -7mm auto 1mm auto; position: relative; z-index: 10; }
            .photo { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
            .name-box { text-align: center; padding: 0 2mm; margin-top: 1mm; }
            .name { font-size: 11px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase; }
            .role { font-size: 6.5px; font-weight: 900; color: #4338ca; text-transform: uppercase; margin: 0.5mm 0 1mm 0; }
            .id-box { border: 0.5px dashed #6366f1; background: #f8fafc; padding: 1mm 3mm; border-radius: 1.5mm; display: inline-flex; flex-direction: column; align-items: center; margin: 0 auto; min-width: 36mm; }
            .id-label { font-size: 4px; color: #64748b; font-weight: 800; text-transform: uppercase; }
            .id-val { font-size: 9.5px; font-weight: 900; font-family: monospace; color: #0f172a; }
            .info-qr { display: flex; background: #f8fafc; margin: 1.5mm 2mm; border-radius: 1.5mm; border: 0.5px solid #e2e8f0; }
            .info-col { flex: 1; padding: 1.2mm; display: flex; flex-direction: column; justify-content: space-between; border-right: 0.5px dashed #cbd5e1; text-align: left; }
            .qr-col { width: 18mm; padding: 1mm; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
            .qr-img { width: 12.5mm; height: 12.5mm; }
            .footer { background: #0f172a; height: 5mm; display: flex; justify-content: space-between; align-items: center; padding: 0 2mm; color: white; font-size: 4.5px; margin-top: auto; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo-box">
                <img src="${origin}/gaya_seva_app_icon.png" class="logo" />
                <div>
                  <h2 class="title">GAYA<span>SEVA</span></h2>
                  <p class="subtitle">STAFF IDENTITY CARD</p>
                </div>
              </div>
              <div style="text-align: right; color: white; font-size: 4.5px; font-weight: 800;">
                <span style="color:#f59e0b">VERIFIED</span><br/>STAFF
              </div>
            </div>

            <div class="photo-box">
              ${emp?.photo ? `<img src="${emp.photo}" class="photo" />` : `<div style="width:100%;height:100%;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:bold;color:#64748b;">EMP</div>`}
            </div>

            <div class="name-box">
              <h1 class="name">${emp?.name || 'Staff Member'}</h1>
              <p class="role">${emp?.designation || 'Employee'} • ${emp?.department || 'GayaSeva'}</p>
              <div class="id-box">
                <span class="id-label">EMPLOYEE ID</span>
                <span class="id-val">${emp?.empId || 'GS-EMP-0001'}</span>
              </div>
            </div>

            <div class="info-qr">
              <div class="info-col">
                <div style="font-size: 4.5px; color: #475569; font-weight: bold;">AADHAR: <span style="color:#0f172a font-weight: 900;">XXXX-XXXX-${(emp?.aadharNumber||'').slice(-4)}</span></div>
                <div style="font-size: 4.5px; color: #475569; font-weight: bold; margin-top: 0.5mm;">PHONE: <span style="color:#0f172a">${emp?.phone || 'N/A'}</span></div>
                <div style="font-size: 4.5px; color: #475569; font-weight: bold; margin-top: 0.5mm;">DEPT: <span style="color:#4338ca">${emp?.department || 'IT'}</span></div>
              </div>
              <div class="qr-col">
                <span style="font-size: 4px; font-weight: 900; color: #1e293b;">SCAN TO VERIFY</span>
                <img src="${qrCodeImageUrl}" class="qr-img" />
              </div>
            </div>

            <div class="footer">
              <span>www.gayaseva.com</span>
              <span style="color:#f59e0b; font-style:italic; font-size:8px;">Gayaseva</span>
              <span>ADMIN AUTHORITY</span>
            </div>
          </div>
          <script>window.onload = () => { setTimeout(() => { window.print(); }, 600); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-lg font-bold text-slate-700 dark:text-slate-300 animate-pulse">Generating Official Employee ID Card...</div>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">Employee Record Not Found</div>
        <Link href="/admin/employees" className="text-indigo-600 font-medium hover:underline">Return to Directory</Link>
      </div>
    );
  }

  const cleanAadhar = (emp.aadharNumber || '').replace(/\D/g, '');
  const maskedAadhar = cleanAadhar.length >= 4 ? `XXXX-XXXX-${cleanAadhar.slice(-4)}` : 'N/A';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <Link href="/admin/employees" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Employee Registry
          </Link>
          <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
            Standard Employee Badge Size: 65mm × 95mm
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadCard}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 text-xs"
          >
            <Download className="w-4 h-4" /> {isDownloading ? 'Downloading...' : 'Download Image'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 text-xs"
          >
            <Printer className="w-4 h-4" /> Print 65x95mm Badge
          </button>
        </div>
      </div>

      {/* ID CARD DISPLAY CANVAS */}
      <div className="bg-slate-200 dark:bg-slate-950 p-6 sm:p-12 rounded-3xl flex flex-col items-center justify-center gap-4">
        
        <div 
          id="employee-id-card"
          className="w-[400px] bg-white rounded-[24px] overflow-hidden relative flex flex-col border border-slate-300 shadow-2xl font-sans select-none box-border"
          style={{ width: '400px', minHeight: '650px' }}
        >
          {/* Header */}
          <div 
            className="h-[115px] w-full bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] relative border-b-[4px] border-indigo-500 flex justify-between px-6 py-4 z-10 flex-shrink-0"
            style={{ borderBottomLeftRadius: '50% 18px', borderBottomRightRadius: '50% 18px' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-[45px] h-[45px] bg-white rounded-full border-2 border-white overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-white font-black text-[22px] leading-tight m-0" style={{ letterSpacing: '0px' }}>GAYA<span className="text-amber-400">SEVA</span></h2>
                <p className="text-indigo-200 text-[8px] font-black tracking-widest uppercase mt-0.5 leading-tight m-0">STAFF IDENTITY CARD</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-right">
              <ShieldCheck className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <p className="text-white text-[9px] font-black leading-tight m-0">VERIFIED<br/>STAFF</p>
            </div>
          </div>

          {/* Sub Header */}
          <div className="text-center mt-2 z-20 relative flex-shrink-0">
            <h3 className="text-slate-800 text-[10px] font-black tracking-widest uppercase m-0 leading-tight">
              <span className="text-indigo-600 mx-1.5">•</span> OFFICIAL ENTERPRISE STAFF <span className="text-indigo-600 mx-1.5">•</span>
            </h3>
          </div>

          {/* Photo & Avatar */}
          <div className="flex justify-center items-center mt-2 relative h-[125px] flex-shrink-0">
            <div className="w-[120px] h-[120px] bg-white rounded-full p-1 border-2 border-slate-200 shadow-xl z-30">
              <div className="w-full h-full rounded-full border-[3px] border-indigo-600 overflow-hidden bg-slate-100 flex items-center justify-center">
                {emp.photo ? (
                  <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mt-2 px-5 relative z-20 flex flex-col items-center flex-shrink-0">
            <h1 
              className="m-0 p-0 text-[#0f172a] font-black text-[22px] uppercase leading-[1.3]"
              style={{ letterSpacing: '0px', wordSpacing: '2px' }}
            >
              {emp.name}
            </h1>
            <h2 
              className="mt-0.5 mb-2 p-0 text-[#4338ca] font-black text-[13px] uppercase leading-[1.3]"
              style={{ letterSpacing: '1px' }}
            >
              {emp.designation || 'STAFF'} • {emp.department || 'GENERAL'}
            </h2>
            
            {/* Employee ID Box */}
            <div 
              style={{
                background: '#f8fafc',
                border: '1.5px dashed #6366f1',
                padding: '8px 24px 10px 24px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                minWidth: '240px',
                width: 'fit-content'
              }}
            >
              <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.2', display: 'block', margin: 0 }}>EMPLOYEE ID</span>
              <span style={{ fontSize: '19px', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '2.5px', lineHeight: '1.2', display: 'block', marginTop: '3px' }}>{emp.empId || 'GS-EMP-0001'}</span>
            </div>
          </div>

          {/* Details & QR Code Block */}
          <div className="flex items-stretch bg-slate-50 mx-4 rounded-2xl border border-slate-200 overflow-hidden relative z-20 my-1">
            {/* Left Info */}
            <div className="flex-1 p-2.5 flex flex-col justify-between border-r border-slate-300 border-dashed text-left space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0 text-white"><CreditCard className="w-3.5 h-3.5" /></div>
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', lineHeight: '1.2' }}>Aadhar Card</span>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#0f172a', lineHeight: '1.3', fontFamily: 'monospace' }}>{maskedAadhar}</span>
                </div>
              </div>
              
              <div className="w-full h-px border-b border-slate-300 border-dashed"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0 text-white"><Phone className="w-3.5 h-3.5" /></div>
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', lineHeight: '1.2' }}>Phone</span>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#0f172a', lineHeight: '1.3' }}>{emp.phone}</span>
                </div>
              </div>
              
              <div className="w-full h-px border-b border-slate-300 border-dashed"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0 text-white"><Briefcase className="w-3.5 h-3.5" /></div>
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: '8px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', lineHeight: '1.2' }}>Department</span>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#4338ca', lineHeight: '1.3' }}>{emp.department}</span>
                </div>
              </div>
            </div>
            
            {/* Right QR Column */}
            <div className="w-[130px] p-2 flex flex-col items-center justify-center bg-white text-center flex-shrink-0">
              <p className="text-[9px] font-black text-slate-800 m-0 leading-tight">SCAN TO</p>
              <p className="text-[7.5px] font-extrabold text-indigo-900 m-0 mb-1 leading-tight">VERIFY EMPLOYEE</p>
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
              <FileCheck className="w-[14px] h-[14px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">GAYASEVA<br/>VERIFIED</p>
            </div>
            <div className="flex items-center gap-1.5 w-[23%]">
              <UserCheck className="w-[14px] h-[14px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">KYC & AADHAR<br/>VERIFIED</p>
            </div>
            <div className="flex items-center gap-1.5 w-[23%]">
              <Award className="w-[14px] h-[14px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">ENTERPRISE<br/>STAFF</p>
            </div>
            <div className="flex items-center gap-1.5 w-[23%]">
              <Handshake className="w-[14px] h-[14px] text-slate-800 flex-shrink-0" />
              <p className="text-[6.5px] font-extrabold text-slate-700 uppercase leading-[1.2] m-0">AUTHORIZED<br/>PERSONNEL</p>
            </div>
          </div>

          {/* Footer Bar */}
          <div 
            className="h-[44px] w-full bg-[#0F172A] flex justify-between items-center px-5 relative z-20 text-white flex-shrink-0"
            style={{ borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}
          >
            <div className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3 h-3 text-slate-300" />
              <span className="text-[8.5px] font-bold tracking-wide">www.gayaseva.com</span>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1.5 text-center flex flex-col items-center">
              <span className="text-[22px] text-amber-400 italic leading-none mb-0.5" style={{ fontFamily: '"Brush Script MT", cursive, serif' }}>Gayaseva</span>
              <span className="text-[6.5px] font-extrabold text-white tracking-widest uppercase">AUTHORIZED SIGNATURE</span>
            </div>
            
            <div className="text-[8.5px] font-extrabold text-slate-300 tracking-widest">
              ADMIN AUTHORITY
            </div>
          </div>

        </div>

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Scanning the QR Code above opens public verification at <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">{publicVerificationUrl}</code>
        </p>

      </div>
    </div>
  );
}
