'use client';

import { Printer, Search, ShieldCheck, Calendar, MapPin } from 'lucide-react';
import { useRef } from 'react';

export default function GenerateCertificatePage() {
  const certificateRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section (hidden when printing) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Vendor Certificate</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Issue official verification certificates to registered businesses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search vendor by ID..." className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" />
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1E3D] text-white font-semibold rounded-xl hover:bg-[#1a2d5c] transition shadow-lg shadow-[#0F1E3D]/20">
            <Printer className="w-4 h-4" /> Print Certificate
          </button>
        </div>
      </div>

      {/* Certificate Preview Container */}
      <div className="flex justify-center bg-slate-100 dark:bg-slate-800/50 p-4 md:p-10 rounded-3xl print:p-0 print:bg-transparent border border-slate-200 dark:border-slate-700 print:border-none w-full overflow-x-auto">
        
        {/* 
          The Certificate - Exact Replica of Reference
          A4 Landscape Ratio ~ 1.414 (1123px x 794px)
        */}
        <div 
          ref={certificateRef}
          className="relative shrink-0 shadow-2xl print:shadow-none overflow-hidden print:w-full print:h-screen print:max-w-none print:m-0"
          style={{
            width: '1123px',
            height: '794px',
            backgroundColor: '#FCFAF5', // Light ivory background
          }}
        >
          {/* Subtle Background Texture/Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ 
                 backgroundImage: 'radial-gradient(#0F1E3D 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
               }}>
          </div>

          {/* ──────────────────────── BORDERS ──────────────────────── */}
          <div className="absolute inset-[30px] border-[2px] border-[#D4AF37] pointer-events-none z-10 opacity-70 shadow-sm"></div>
          <div className="absolute inset-[36px] border-[1px] border-[#D4AF37] pointer-events-none z-10 opacity-40"></div>
          
          {/* Corner Squares for Inner Border */}
          <div className="absolute top-[28px] left-[28px] w-[6px] h-[6px] bg-[#D4AF37] z-10 rounded-sm"></div>
          <div className="absolute top-[28px] right-[28px] w-[6px] h-[6px] bg-[#D4AF37] z-10 rounded-sm"></div>
          <div className="absolute bottom-[28px] left-[28px] w-[6px] h-[6px] bg-[#D4AF37] z-10 rounded-sm"></div>
          <div className="absolute bottom-[28px] right-[28px] w-[6px] h-[6px] bg-[#D4AF37] z-10 rounded-sm"></div>

          {/* ──────────────────────── CORNER SWOOSHES ──────────────────────── */}
          {/* Top Left Swoosh */}
          <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E5C158] via-[#D4AF37] to-[#8B6914] rounded-full shadow-2xl"></div>
            <div className="absolute inset-[12px] bg-[#0B132B] rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] translate-x-1 translate-y-1"></div>
            <div className="absolute inset-[20px] bg-gradient-to-br from-[#16274e] to-[#0F1E3D] rounded-full border border-white/5 shadow-2xl translate-x-1 translate-y-1"></div>
          </div>

          {/* Bottom Right Swoosh */}
          <div className="absolute -bottom-[280px] -right-[250px] w-[700px] h-[650px] z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tl from-[#E5C158] via-[#D4AF37] to-[#8B6914] rounded-full shadow-2xl"></div>
            <div className="absolute inset-[12px] bg-[#0B132B] rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] -translate-x-1 -translate-y-1"></div>
            <div className="absolute inset-[20px] bg-gradient-to-tl from-[#16274e] to-[#0F1E3D] rounded-full border border-white/5 shadow-2xl -translate-x-1 -translate-y-1"></div>
          </div>

          {/* Bottom Left Corner (Verified Trust Badge) */}
          <div className="absolute bottom-0 left-0 w-[240px] h-[240px] z-20 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-[240px] h-[240px] bg-gradient-to-tr from-[#E5C158] via-[#D4AF37] to-[#8B6914]" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }}></div>
            <div className="absolute bottom-0 left-0 w-[232px] h-[232px] bg-[#0F1E3D]" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }}></div>
            
            <div className="absolute bottom-[25px] left-[25px] flex gap-3 items-center z-30">
              <div className="w-9 h-9 border border-[#D4AF37] rounded flex items-center justify-center bg-transparent">
                 <ShieldCheck className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-[#D4AF37] text-[9px] font-bold tracking-[0.2em] leading-tight">
                <span>VERIFIED</span>
                <span>TRUSTED</span>
                <span>REGISTERED</span>
              </div>
            </div>
          </div>

          {/* ──────────────────────── CONTENT ──────────────────────── */}
          <div className="relative z-10 w-full h-full">
            
            {/* Top Left Logo & Title */}
            <div className="absolute top-[60px] left-[60px] flex items-center gap-3">
              <img src="/gaya_seva_app_icon.png" alt="Gaya Seva" className="w-16 h-16 object-contain" />
              <div className="flex flex-col text-[#0F1E3D]">
                <span className="text-[26px] font-black tracking-widest leading-none font-sans">GAYA SEVA</span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Digital Vendor Registry</span>
              </div>
            </div>

            {/* Top Right ID Panel */}
            <div className="absolute top-[60px] right-[60px]">
              <div className="bg-[#0F1E3D] border-[2px] border-[#D4AF37] rounded-xl px-8 py-3.5 flex flex-col items-center shadow-lg">
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Official Document ID</span>
                <span className="text-white text-xl font-mono font-bold tracking-widest">GS-VEN-000001</span>
              </div>
            </div>

            {/* Center Content Group */}
            <div className="absolute top-[170px] left-0 w-full flex flex-col items-center">
              
              {/* Title Section */}
              <div className="text-center">
                <h1 className="text-[76px] font-serif text-[#0F1E3D] tracking-[0.1em] leading-none uppercase" style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8)' }}>
                  CERTIFICATE
                </h1>
                <div className="flex items-center justify-center gap-4 mt-2">
                   <div className="w-[60px] h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                   <span className="text-[24px] font-serif text-[#0F1E3D] tracking-[0.4em] uppercase">OF REGISTRATION</span>
                   <div className="w-[60px] h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                </div>
              </div>

              {/* Gold Ribbon */}
              <div className="mt-8 flex justify-center relative">
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -left-5 border-[14px] border-transparent border-r-[#8A6B1C] w-0 h-0 z-0"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-5 border-[14px] border-transparent border-l-[#8A6B1C] w-0 h-0 z-0"></div>
                  <div className="bg-gradient-to-r from-[#B48E2D] via-[#D4AF37] to-[#B48E2D] px-12 py-1.5 relative z-10 shadow-md">
                    <span className="text-[#0F1E3D] text-[11px] font-black tracking-[0.25em] uppercase">This Proudly Certifies That</span>
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <div className="text-center mt-10 w-full">
                <h2 className="text-[52px] font-serif text-[#0F1E3D] font-bold tracking-[0.05em] uppercase px-4">
                  RAMESH AC & REFRIGERATION
                </h2>
                <div className="w-[600px] mx-auto h-[2px] mt-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-[1.5px] border-[#D4AF37] bg-[#FCF9F0]"></div>
                </div>
              </div>

              {/* Description Paragraph */}
              <div className="max-w-[850px] mx-auto text-center mt-8 text-[#0F1E3D] font-serif">
                <p className="text-[18px] leading-[1.8] font-medium opacity-90 px-10">
                  has successfully met all verification requirements, and is registered as an<br/>
                  <strong className="font-bold text-[19px]">official service provider</strong> on the Gaya Seva platform. They are fully authorized<br/>
                  to offer premium services under the category of <strong className="font-bold text-[19px]">Repair & Technical Services</strong><br/>
                  within the operational region of
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" fill="#D4AF37" stroke="#FCF9F0" />
                  <span className="text-[20px] font-bold">Station Road, Gaya, Bihar 823001.</span>
                </div>
              </div>

            </div>

            {/* Bottom Section */}
            
            {/* Bottom Left: Date */}
            <div className="absolute bottom-[80px] left-[90px] flex items-center gap-4">
              <Calendar className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] font-bold text-[#6B7280] tracking-[0.1em] uppercase">Date of Registration</p>
                <p className="text-[18px] font-serif font-bold text-[#0F1E3D]">07 July 2026</p>
                <div className="w-full h-[1px] bg-[#D4AF37] mt-1 opacity-50"></div>
              </div>
            </div>

            {/* Bottom Right: Signature */}
            <div className="absolute bottom-[80px] right-[90px] flex flex-col items-center">
              <div className="w-[220px] text-center mb-1 relative h-[50px] flex items-end justify-center">
                {/* Simulated Cursive Signature */}
                <span className="font-['Brush_Script_MT',cursive,serif] text-[46px] text-[#0F1E3D] -rotate-3 inline-block leading-none">Gaya Seva Admin</span>
              </div>
              <div className="w-[220px] h-[1.5px] bg-[#D4AF37] opacity-60 mb-2"></div>
              <p className="text-[10px] font-bold text-[#6B7280] tracking-[0.2em] uppercase">Authorized Signature</p>
            </div>

            {/* Bottom Center: Brand Seal */}
            <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="relative">
                {/* Ribbon Tails */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-5 z-0">
                  <div className="w-12 h-24 bg-[#0F1E3D] border-x-[3px] border-b-[3px] border-[#D4AF37] relative overflow-hidden shadow-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}>
                     <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                  </div>
                  <div className="w-12 h-24 bg-[#0F1E3D] border-x-[3px] border-b-[3px] border-[#D4AF37] relative overflow-hidden shadow-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}>
                     <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                  </div>
                </div>
                
                {/* The Golden Seal Base */}
                <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-[#E5C158] via-[#D4AF37] to-[#8B6914] shadow-2xl p-[4px] relative z-10 flex items-center justify-center">
                   {/* Inner White/Dark Circle */}
                   <div className="w-full h-full rounded-full border-[4px] border-[#0F1E3D] bg-white flex flex-col items-center justify-center overflow-hidden p-1 shadow-inner relative">
                     {/* We use the official gaya_seva_seal.png */}
                     <img src="/gaya_seva_seal.png" alt="Official Seal" className="w-[130px] h-[130px] object-contain relative z-10" />
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
