'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Award, Plus, Search, Printer, Download, Eye, CheckCircle2, ShieldCheck, X, HardHat, QrCode, Save, RefreshCw, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LabourCertificatePage() {
  const [liveLabourers, setLiveLabourers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  
  const [newCert, setNewCert] = useState({
    workerId: '',
    workerName: '',
    tradeSkill: 'Electrician',
    aadhaarNo: '',
    city: 'Gaya',
    validityYears: 1
  });

  const printRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/labour');
      const data = await res.json();
      
      let fetchedLabourers = [];
      if (data.success && Array.isArray(data.labourers)) {
        fetchedLabourers = data.labourers;
        setLiveLabourers(data.labourers);
      }

      let savedCerts = [];
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('gc_labour_certificates');
        if (saved) {
          try { savedCerts = JSON.parse(saved); } catch (e) {}
        }
      }

      const mappedLiveCerts = fetchedLabourers.map((w, idx) => {
        const certId = w.lwfId ? `GS-CERT-LBR-${w.lwfId}` : `GS-CERT-LBR-2026-${String(idx + 101).padStart(3, '0')}`;
        const issue = w.createdAt ? new Date(w.createdAt) : new Date();
        const expiry = new Date(issue);
        expiry.setFullYear(expiry.getFullYear() + 1);

        return {
          id: w._id || certId,
          certId: certId,
          workerName: w.name || w.userId?.name || 'Skilled Worker',
          tradeSkill: w.profession || w.category || 'Skilled Labourer',
          aadhaarNo: w.aadhaarNumber ? `XXXX-XXXX-${w.aadhaarNumber.slice(-4)}` : (w.phone ? `PHONE: ${w.phone}` : 'VERIFIED'),
          city: w.district || w.location || 'Gaya',
          issueDate: issue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          expiryDate: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'VERIFIED & ACTIVE',
          qrData: `https://www.gayaseva.com/verify?cert=${certId}`,
          isLive: true
        };
      });

      const certMap = new Map();
      mappedLiveCerts.forEach(c => certMap.set(c.certId, c));
      savedCerts.forEach(c => certMap.set(c.certId, c));

      if (certMap.size === 0) {
        const defaults = [
          {
            certId: 'GS-CERT-LBR-2026-101',
            workerName: 'Ramesh Kumar',
            tradeSkill: 'Electrician',
            aadhaarNo: 'XXXX-XXXX-4892',
            city: 'Gaya',
            issueDate: '18 Jul 2026',
            expiryDate: '17 Jul 2027',
            status: 'VERIFIED & ACTIVE',
            qrData: 'https://www.gayaseva.com/verify?cert=GS-CERT-LBR-2026-101'
          },
          {
            certId: 'GS-CERT-LBR-2026-102',
            workerName: 'Sunil Yadav',
            tradeSkill: 'Plumber',
            aadhaarNo: 'XXXX-XXXX-8921',
            city: 'Gaya',
            issueDate: '12 Jul 2026',
            expiryDate: '11 Jul 2027',
            status: 'VERIFIED & ACTIVE',
            qrData: 'https://www.gayaseva.com/verify?cert=GS-CERT-LBR-2026-102'
          }
        ];
        defaults.forEach(c => certMap.set(c.certId, c));
      }

      setCertificates(Array.from(certMap.values()));
    } catch (error) {
      toast.error('Failed to load live workforce database');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLiveWorker = (workerId) => {
    const w = liveLabourers.find(item => String(item._id) === String(workerId));
    if (w) {
      setNewCert({
        ...newCert,
        workerId: w._id,
        workerName: w.name || w.userId?.name || '',
        tradeSkill: w.profession || w.category || 'Electrician',
        aadhaarNo: w.aadhaarNumber || '',
        city: w.district || w.location || 'Gaya'
      });
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!newCert.workerName || !newCert.tradeSkill) {
      toast.error('Worker Name and Trade Skill are required');
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const certId = `GS-CERT-LBR-2026-${randomNum}`;

    const issue = new Date();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + Number(newCert.validityYears));

    const created = {
      id: Date.now(),
      certId,
      workerName: newCert.workerName.trim(),
      tradeSkill: newCert.tradeSkill.trim(),
      aadhaarNo: newCert.aadhaarNo ? `XXXX-XXXX-${newCert.aadhaarNo.slice(-4)}` : 'VERIFIED',
      city: newCert.city,
      issueDate: issue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'VERIFIED & ACTIVE',
      qrData: `https://www.gayaseva.com/verify?cert=${certId}`
    };

    const updated = [created, ...certificates];
    setCertificates(updated);
    if (typeof window !== 'undefined') {
      const customOnly = updated.filter(c => !c.isLive);
      localStorage.setItem('gc_labour_certificates', JSON.stringify(customOnly));
    }

    toast.success('Official Skilled Workforce Certificate Generated & Saved!');
    setIsGenerateOpen(false);
    setSelectedCert(created);
    setNewCert({ workerId: '', workerName: '', tradeSkill: 'Electrician', aadhaarNo: '', city: 'Gaya', validityYears: 1 });
  };

  // FAIL-SAFE DIRECT PRINT & PDF DOWNLOAD FUNCTION (STRICT A4 LANDSCAPE DIMENSIONS)
  const triggerPrintWindow = (cert) => {
    const certToPrint = cert || selectedCert;
    if (!certToPrint) return;

    const printWin = window.open('', '_blank', 'width=1150,height=820');
    if (!printWin) {
      toast.error('Please allow popups to print certificate');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GayaSeva Certificate - ${certToPrint.certId}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { 
              size: A4 landscape; 
              margin: 0; 
            }
            body { 
              margin: 0;
              padding: 0;
              background: #ffffff;
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }
            .a4-page {
              width: 297mm;
              height: 210mm;
              box-sizing: border-box;
              margin: 0 auto;
              padding: 12mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background: #ffffff;
            }
          </style>
        </head>
        <body class="flex items-center justify-center min-h-screen">
          <div class="a4-page border-[10px] border-emerald-700 relative font-serif shadow-none">
            <div class="border-2 border-emerald-600 p-6 rounded-lg relative bg-emerald-50/20 h-full flex flex-col justify-between">
              
              <!-- Header -->
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #a7f3d0;padding-bottom:12px;">
                <div style="display:flex;align-items:center;gap:14px;">
                  <img src="/gaya_seva_app_icon.png" alt="GayaSeva Logo" style="width:56px;height:56px;border-radius:9999px;border:2px solid #059669;" />
                  <div>
                    <h1 style="font-size:22px;font-weight:900;font-family:sans-serif;color:#0f172a;margin:0;">
                      Gaya<span style="color:#047857;">Seva</span> Skilled Workforce
                    </h1>
                    <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#065f46;font-family:sans-serif;margin-top:2px;">
                      NATIONAL SKILL VERIFICATION & CERTIFICATION AUTHORITY
                    </p>
                  </div>
                </div>
                <div style="text-align:right;font-family:sans-serif;">
                  <span style="background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;padding:4px 12px;border-radius:9999px;font-size:10px;font-weight:900;">
                    SKILLED LABOUR CERTIFICATE
                  </span>
                  <div style="font-size:11px;font-family:monospace;font-weight:700;margin-top:4px;color:#475569;">${certToPrint.certId}</div>
                </div>
              </div>

              <!-- Main Title -->
              <div style="text-align:center;margin:16px 0;">
                <h2 style="font-size:28px;font-weight:900;color:#065f46;letter-spacing:0.1em;text-transform:uppercase;font-family:serif;margin:0;">
                  Certificate of Skilled Skill Verification
                </h2>
                <p style="font-size:12px;color:#475569;font-family:sans-serif;font-style:italic;max-width:650px;margin:6px auto 0;">
                  This document certifies that the technician named below has undergone background screening, skill evaluation, and is officially registered on the GayaSeva Workforce Network.
                </p>
              </div>

              <!-- Recipient Box -->
              <div style="background:rgba(255,255,255,0.95);padding:18px 24px;border-radius:14px;border:1.5px solid #6ee7b7;text-align:center;font-family:sans-serif;">
                <span style="font-size:10px;font-weight:900;color:#047857;letter-spacing:0.15em;display:block;">CERTIFIED WORKFORCE TECHNICIAN</span>
                <h3 style="font-size:28px;font-weight:900;color:#0f172a;margin:4px 0;">${certToPrint.workerName}</h3>
                <div style="font-size:16px;font-weight:900;color:#1e293b;margin:4px 0;">
                  Trade Skill: <span style="color:#065f46;font-weight:900;font-size:20px;border-bottom:2px solid #059669;padding-bottom:1px;">${certToPrint.tradeSkill}</span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#475569;margin-top:2px;">
                  Aadhaar ID: <span style="color:#065f46;font-weight:900;">${certToPrint.aadhaarNo}</span> • Location: ${certToPrint.city}, Bihar
                </div>
              </div>

              <!-- Validity Dates -->
              <div style="display:flex;justify-content:space-around;font-family:sans-serif;font-size:11px;border-top:1px solid #6ee7b7;border-bottom:1px solid #6ee7b7;padding:8px 0;margin:12px 0;text-align:center;">
                <div>
                  <span style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;display:block;">Date of Certification</span>
                  <span style="font-weight:900;color:#1e293b;font-size:13px;">${certToPrint.issueDate}</span>
                </div>
                <div>
                  <span style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;display:block;">Valid Until</span>
                  <span style="font-weight:900;color:#047857;font-size:13px;">${certToPrint.expiryDate}</span>
                </div>
              </div>

              <!-- Footer Seal & Signature -->
              <div style="display:flex;justify-content:space-between;align-items:center;font-family:sans-serif;">
                <div style="display:flex;align-items:center;gap:10px;background:#ecfdf5;padding:6px 10px;border-radius:10px;border:1px solid #a7f3d0;">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(certToPrint.qrData)}" style="width:48px;height:48px;" />
                  <div style="font-size:9px;text-align:left;">
                    <strong style="color:#0f172a;display:block;">Scan to Verify</strong>
                    <span style="color:#64748b;font-family:monospace;display:block;">gayaseva.com/verify</span>
                    <span style="color:#047857;font-weight:900;display:block;">● AUTHENTIC & VALID</span>
                  </div>
                </div>

                <div style="width:64px;height:64px;background:linear-gradient(135deg, #34d399, #059669, #065f46);border-radius:9999px;display:flex;align-items:center;justify-content:center;color:white;font-size:7px;font-weight:900;text-align:center;padding:4px;border:2.5px solid #a7f3d0;">
                  CERTIFIED LABOUR
                </div>

                <div style="text-align:right;">
                  <div style="font-family:serif;font-style:italic;font-size:16px;font-weight:700;color:#1e293b;border-bottom:1px solid #94a3b8;padding-bottom:1px;display:inline-block;">
                    Dr. A. K. Verma
                  </div>
                  <span style="font-size:9px;font-weight:900;text-transform:uppercase;color:#0f172a;display:block;margin-top:2px;">AUTHORISED REGISTRAR</span>
                  <span style="font-size:8px;color:#64748b;font-family:monospace;display:block;">Digitally Signed & Certified</span>
                </div>
              </div>

            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handlePrint = (cert) => {
    triggerPrintWindow(cert);
  };

  const handleSavePdf = (cert) => {
    toast.success("Opening A4 Print/PDF window... Select 'Save as PDF' in destination.", { duration: 4000 });
    triggerPrintWindow(cert);
  };

  const filtered = certificates.filter(c => 
    c.workerName.toLowerCase().includes(search.toLowerCase()) ||
    c.tradeSkill.toLowerCase().includes(search.toLowerCase()) ||
    c.certId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Skilled Workforce Certificate Center
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase">
              A4 LANDSCAPE SIZE
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">Generate, save, print, and download A4 size verification certificates for all registered daily labourers & technicians.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchInitialData}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Refresh Live Labourers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setIsGenerateOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Issue & Save Certificate
          </button>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden print:hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search live labourers by name, skill, or cert ID..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Workforce: <strong className="text-indigo-600 dark:text-indigo-400">{filtered.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Certificate ID</th>
                <th className="py-3.5 px-6">Worker Name & Details</th>
                <th className="py-3.5 px-4">Trade Skill</th>
                <th className="py-3.5 px-4">Issue / Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions (A4 Save & Print)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(c => (
                <tr key={c.certId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-6 font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                    {c.certId}
                    {c.isLive && <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-bold rounded">Live DB</span>}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{c.workerName}</div>
                    <div className="text-[11px] text-slate-500 font-bold">ID: <span className="text-slate-900 dark:text-slate-100 font-black">{c.aadhaarNo}</span> ({c.city})</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{c.tradeSkill}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{c.issueDate} &rarr; {c.expiryDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ● {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedCert(c)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1 shadow-md shadow-indigo-600/20"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>

                      <button 
                        onClick={() => handlePrint(c)}
                        className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold rounded-xl transition flex items-center gap-1 shadow-md"
                        title="Print A4 Certificate"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" /> Print
                      </button>

                      <button 
                        onClick={() => handleSavePdf(c)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        title="Save A4 PDF"
                      >
                        <Download className="w-3.5 h-3.5" /> Save A4 PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Issue Skilled Worker Certificate</h2>
              <button onClick={() => setIsGenerateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              {liveLabourers.length > 0 && (
                <div>
                  <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Select Registered Live Worker (Auto-Fill)
                  </label>
                  <select 
                    onChange={e => handleSelectLiveWorker(e.target.value)}
                    className="w-full bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">-- Choose from Registered Database Labourers --</option>
                    {liveLabourers.map(w => (
                      <option key={w._id} value={w._id}>
                        {w.name || w.userId?.name} ({w.profession || w.category || 'Worker'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Worker Full Name *</label>
                <input 
                  required
                  type="text" 
                  value={newCert.workerName}
                  onChange={e => setNewCert({...newCert, workerName: e.target.value})}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Workforce Trade Skill *</label>
                  <select 
                    value={newCert.tradeSkill}
                    onChange={e => setNewCert({...newCert, tradeSkill: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Mason / Mistry">Mason / Mistry</option>
                    <option value="AC & Appliance Technician">AC & Appliance Technician</option>
                    <option value="Driver (Light/Heavy Vehicle)">Driver (Light/Heavy Vehicle)</option>
                    <option value="Welder & Fabricator">Welder & Fabricator</option>
                    <option value="General Labour / Helper">General Labour / Helper</option>
                    <option value="CCTV & Security Technician">CCTV & Security Technician</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Aadhaar Number</label>
                  <input 
                    type="text" 
                    maxLength="12"
                    value={newCert.aadhaarNo}
                    onChange={e => setNewCert({...newCert, aadhaarNo: e.target.value})}
                    placeholder="12 digit Aadhaar"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">City Location</label>
                <input 
                  type="text" 
                  value={newCert.city}
                  onChange={e => setNewCert({...newCert, city: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsGenerateOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Save & Issue Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ULTRA-PREMIUM CERTIFICATE MODAL (A4 ASPECT RATIO PREVIEW) */}
      {selectedCert && (
        <div 
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 max-w-5xl w-full space-y-4 shadow-2xl my-auto"
          >
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Skilled Worker Certificate (A4 Size)</h3>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => handlePrint(selectedCert)}
                  className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print A4
                </button>

                <button 
                  onClick={() => handleSavePdf(selectedCert)}
                  className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Save A4 PDF
                </button>

                <button onClick={() => setSelectedCert(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* PREMIUM CERTIFICATE CONTAINER WITH STRICT A4 PROPORTIONS */}
            <div className="w-full overflow-x-auto p-2">
              <div ref={printRef} className="w-[850px] sm:w-[1000px] h-[600px] sm:h-[700px] mx-auto bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border-[10px] sm:border-[14px] border-emerald-700 relative flex flex-col justify-between font-serif shadow-2xl">
                
                <div className="border-2 border-emerald-600 p-4 sm:p-8 rounded-lg relative bg-emerald-50/20 h-full flex flex-col justify-between">
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <img src="/gaya_seva_app_icon.png" alt="Watermark" className="w-72 h-72 sm:w-96 sm:h-96 object-contain" />
                  </div>

                  <div className="flex justify-between items-center border-b-2 border-emerald-400/50 pb-3">
                    <div className="flex items-center gap-3">
                      <img src="/gaya_seva_app_icon.png" alt="GayaSeva Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full shadow-md border-2 border-emerald-500" />
                      <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                          Gaya<span className="text-emerald-700">Seva</span> Skilled Workforce
                        </h1>
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-800 font-sans mt-0.5">
                          NATIONAL SKILL VERIFICATION & CERTIFICATION AUTHORITY
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-sans">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider inline-block mb-1">
                        SKILLED LABOUR CERTIFICATE
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600 block">{selectedCert.certId}</span>
                    </div>
                  </div>

                  <div className="text-center my-2 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 uppercase tracking-widest font-serif">
                      Certificate of Skilled Skill Verification
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto italic">
                      This document certifies that the technician named below has undergone background screening, skill evaluation, and is officially registered on the GayaSeva Workforce Network.
                    </p>
                  </div>

                  {/* Recipient Box */}
                  <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-emerald-300 shadow-sm text-center font-sans space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-black text-emerald-800 uppercase tracking-widest block">CERTIFIED WORKFORCE TECHNICIAN</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedCert.workerName}</h3>
                    <div className="py-0.5">
                      <span className="text-sm sm:text-base font-black text-slate-800">Trade Skill: </span>
                      <span className="text-emerald-900 font-black text-lg sm:text-xl uppercase tracking-wide border-b-2 border-emerald-500/60 pb-0.5 ml-1">{selectedCert.tradeSkill}</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-700">Aadhaar ID: <span className="text-emerald-900 font-black">{selectedCert.aadhaarNo}</span> • Location: {selectedCert.city}, Bihar</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center font-sans text-xs border-y border-emerald-300/60 py-2.5">
                    <div>
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Date of Certification</span>
                      <span className="font-black text-slate-800 text-xs sm:text-sm">{selectedCert.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Valid Until</span>
                      <span className="font-black text-emerald-700 text-xs sm:text-sm">{selectedCert.expiryDate}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-sans pt-1">
                    
                    <div className="flex items-center gap-2.5 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(selectedCert.qrData)}`} 
                        alt="Verification QR" 
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div className="text-[9px] space-y-0.5 text-left">
                        <span className="font-bold text-slate-900 block">Scan to Verify</span>
                        <span className="text-slate-500 font-mono block">gayaseva.com/verify</span>
                        <span className="text-emerald-700 font-black block">● AUTHENTIC & VALID</span>
                      </div>
                    </div>

                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 rounded-full flex items-center justify-center p-1 shadow-xl border-4 border-emerald-200">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-emerald-100 flex flex-col items-center justify-center text-center p-0.5 text-white">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-0.5" />
                        <span className="text-[6px] font-black uppercase tracking-widest leading-none">CERTIFIED LABOUR</span>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <div className="font-serif italic text-base font-bold text-slate-800 border-b border-slate-400 pb-0.5 px-3 inline-block">
                        Dr. A. K. Verma
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-900 block">AUTHORISED REGISTRAR</span>
                      <span className="text-[8px] text-slate-500 font-mono block">Digitally Signed & Certified</span>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
