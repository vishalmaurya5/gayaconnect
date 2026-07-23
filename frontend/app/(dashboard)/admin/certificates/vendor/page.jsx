'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Award, Plus, Search, Printer, Download, Eye, CheckCircle2, ShieldCheck, X, Sparkles, Building2, Calendar, QrCode, Save, RefreshCw, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorCertificatePage() {
  const [liveVendors, setLiveVendors] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  
  const [newCert, setNewCert] = useState({
    vendorId: '',
    vendorName: '',
    shopName: '',
    category: 'Electrical & Electronics',
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
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      
      let fetchedVendors = [];
      if (data.success && Array.isArray(data.vendors)) {
        fetchedVendors = data.vendors;
        setLiveVendors(data.vendors);
      }

      let savedCerts = [];
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('gc_vendor_certificates');
        if (saved) {
          try { savedCerts = JSON.parse(saved); } catch (e) {}
        }
      }

      const mappedLiveCerts = fetchedVendors.map((v, idx) => {
        const certId = v.vendorId ? `GS-CERT-VND-${v.vendorId}` : `GS-CERT-VND-2026-${String(idx + 101).padStart(3, '0')}`;
        const issue = v.createdAt ? new Date(v.createdAt) : new Date();
        const expiry = new Date(issue);
        expiry.setFullYear(expiry.getFullYear() + 1);

        return {
          id: v._id || certId,
          certId: certId,
          vendorName: v.userId?.name || v.ownerName || v.contactPerson || v.name || 'Gaya Merchant',
          shopName: v.businessName || v.name || v.shopName || 'Registered Vendor Store',
          category: v.category || 'General Merchant',
          city: v.city || v.address?.split(',')[0] || 'Gaya',
          issueDate: issue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          expiryDate: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: v.status === 'REJECTED' ? 'REJECTED' : 'VERIFIED & ACTIVE',
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
            certId: 'GS-CERT-VND-2026-081',
            vendorName: 'Nikhil Mehta',
            shopName: 'Gaya Electricals & Hardware',
            category: 'Electrical & Electronics',
            city: 'Gaya',
            issueDate: '20 Jul 2026',
            expiryDate: '19 Jul 2027',
            status: 'VERIFIED & ACTIVE',
            qrData: 'https://www.gayaseva.com/verify?cert=GS-CERT-VND-2026-081'
          },
          {
            certId: 'GS-CERT-VND-2026-082',
            vendorName: 'Rajesh Kumar',
            shopName: 'Gaya Medical & Surgical',
            category: 'Pharmacy & Healthcare',
            city: 'Gaya',
            issueDate: '15 Jul 2026',
            expiryDate: '14 Jul 2027',
            status: 'VERIFIED & ACTIVE',
            qrData: 'https://www.gayaseva.com/verify?cert=GS-CERT-VND-2026-082'
          }
        ];
        defaults.forEach(c => certMap.set(c.certId, c));
      }

      setCertificates(Array.from(certMap.values()));
    } catch (error) {
      toast.error('Failed to load live vendor database');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLiveVendor = (vendorId) => {
    const v = liveVendors.find(item => String(item._id) === String(vendorId));
    if (v) {
      setNewCert({
        ...newCert,
        vendorId: v._id,
        vendorName: v.userId?.name || v.ownerName || v.contactPerson || v.name || '',
        shopName: v.businessName || v.name || v.shopName || '',
        category: v.category || 'Electrical & Electronics',
        city: v.city || v.address?.split(',')[0] || 'Gaya'
      });
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!newCert.vendorName || !newCert.shopName) {
      toast.error('Vendor Proprietor Name and Shop Name are required');
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const certId = `GS-CERT-VND-2026-${randomNum}`;

    const issue = new Date();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + Number(newCert.validityYears));

    const created = {
      id: Date.now(),
      certId,
      vendorName: newCert.vendorName.trim(),
      shopName: newCert.shopName.trim(),
      category: newCert.category,
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
      localStorage.setItem('gc_vendor_certificates', JSON.stringify(customOnly));
    }

    toast.success('Official Vendor Certificate Generated & Saved!');
    setIsGenerateOpen(false);
    setSelectedCert(created);
    setNewCert({ vendorId: '', vendorName: '', shopName: '', category: 'Electrical & Electronics', city: 'Gaya', validityYears: 1 });
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
          <div class="a4-page border-[10px] border-amber-600 relative font-serif shadow-none">
            <div class="border-2 border-amber-500 p-6 rounded-lg relative bg-amber-50/20 h-full flex flex-col justify-between">
              
              <!-- Header -->
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #fcd34d;padding-bottom:12px;">
                <div style="display:flex;align-items:center;gap:14px;">
                  <img src="/gaya_seva_app_icon.png" alt="GayaSeva Logo" style="width:56px;height:56px;border-radius:9999px;border:2px solid #f59e0b;" />
                  <div>
                    <h1 style="font-size:22px;font-weight:900;font-family:sans-serif;color:#0f172a;margin:0;">
                      Gaya<span style="color:#d97706;">Seva</span> Digital Network
                    </h1>
                    <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#b45309;font-family:sans-serif;margin-top:2px;">
                      OFFICIAL ENTERPRISE GOVERNANCE & VERIFICATION COUNCIL
                    </p>
                  </div>
                </div>
                <div style="text-align:right;font-family:sans-serif;">
                  <span style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;padding:4px 12px;border-radius:9999px;font-size:10px;font-weight:900;">
                    VERIFIED MERCHANT CERTIFICATE
                  </span>
                  <div style="font-size:11px;font-family:monospace;font-weight:700;margin-top:4px;color:#475569;">${certToPrint.certId}</div>
                </div>
              </div>

              <!-- Main Title -->
              <div style="text-align:center;margin:16px 0;">
                <h2 style="font-size:28px;font-weight:900;color:#92400e;letter-spacing:0.1em;text-transform:uppercase;font-family:serif;margin:0;">
                  Certificate of Business Verification
                </h2>
                <p style="font-size:12px;color:#475569;font-family:sans-serif;font-style:italic;max-width:650px;margin:6px auto 0;">
                  This is to certify that the business establishment listed below has been thoroughly inspected, identity verified, and officially onboarded as an Authentic Service Provider under GayaSeva Council guidelines.
                </p>
              </div>

              <!-- Recipient Box -->
              <div style="background:rgba(255,255,255,0.95);padding:18px 24px;border-radius:14px;border:1.5px solid #fcd34d;text-align:center;font-family:sans-serif;">
                <span style="font-size:10px;font-weight:900;color:#b45309;letter-spacing:0.15em;display:block;">PROPRIETOR & BUSINESS ESTABLISHMENT</span>
                <h3 style="font-size:28px;font-weight:900;color:#0f172a;margin:4px 0;">${certToPrint.shopName}</h3>
                <div style="font-size:16px;font-weight:900;color:#1e293b;margin:4px 0;">
                  Proprietor: <span style="color:#78350f;font-weight:900;font-size:20px;border-bottom:2px solid #f59e0b;padding-bottom:1px;">${certToPrint.vendorName}</span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#475569;margin-top:2px;">
                  Category: <span style="color:#78350f;font-weight:900;">${certToPrint.category}</span> • Location: ${certToPrint.city}, Bihar
                </div>
              </div>

              <!-- Validity Dates -->
              <div style="display:flex;justify-content:space-around;font-family:sans-serif;font-size:11px;border-top:1px solid #fcd34d;border-bottom:1px solid #fcd34d;padding:8px 0;margin:12px 0;text-align:center;">
                <div>
                  <span style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;display:block;">Date of Issuance</span>
                  <span style="font-weight:900;color:#1e293b;font-size:13px;">${certToPrint.issueDate}</span>
                </div>
                <div>
                  <span style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;display:block;">Valid Until</span>
                  <span style="font-weight:900;color:#047857;font-size:13px;">${certToPrint.expiryDate}</span>
                </div>
              </div>

              <!-- Footer Seal & Signature -->
              <div style="display:flex;justify-content:space-between;align-items:center;font-family:sans-serif;">
                <div style="display:flex;align-items:center;gap:10px;background:#fffbeb;padding:6px 10px;border-radius:10px;border:1px solid #fef3c7;">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(certToPrint.qrData)}" style="width:48px;height:48px;" />
                  <div style="font-size:9px;text-align:left;">
                    <strong style="color:#0f172a;display:block;">Scan to Verify</strong>
                    <span style="color:#64748b;font-family:monospace;display:block;">gayaseva.com/verify</span>
                    <span style="color:#047857;font-weight:900;display:block;">● AUTHENTIC & VALID</span>
                  </div>
                </div>

                <div style="width:64px;height:64px;background:linear-gradient(135deg, #fcd34d, #f59e0b, #b45309);border-radius:9999px;display:flex;align-items:center;justify-content:center;color:white;font-size:7px;font-weight:900;text-align:center;padding:4px;border:2.5px solid #fef3c7;">
                  VERIFIED MERCHANT
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
    c.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    c.shopName.toLowerCase().includes(search.toLowerCase()) ||
    c.certId.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Vendor Certificate Center
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-500/30 text-[10px] font-black rounded-full uppercase">
              A4 LANDSCAPE SIZE
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">Generate, save, print, and download A4 size verification certificates for all registered GayaSeva merchants.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchInitialData}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Refresh Live Vendors"
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
              placeholder="Search live vendors by name, shop, or cert ID..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Vendors: <strong className="text-indigo-600 dark:text-indigo-400">{filtered.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Certificate ID</th>
                <th className="py-3.5 px-6">Merchant & Shop Establishment</th>
                <th className="py-3.5 px-4">Vendor Category</th>
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
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{c.shopName}</div>
                    <div className="text-[11px] text-slate-500 font-bold">Proprietor: <span className="text-slate-900 dark:text-slate-100 font-black">{c.vendorName}</span> ({c.city})</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">{c.category}</td>
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
                        <Printer className="w-3.5 h-3.5 text-amber-400" /> Print
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

      {/* Generate Certificate Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Issue & Save Vendor Certificate</h2>
              <button onClick={() => setIsGenerateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              {liveVendors.length > 0 && (
                <div>
                  <label className="block font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Select Registered Live Vendor (Auto-Fill)
                  </label>
                  <select 
                    onChange={e => handleSelectLiveVendor(e.target.value)}
                    className="w-full bg-indigo-50/50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">-- Choose from Registered Database Vendors --</option>
                    {liveVendors.map(v => (
                      <option key={v._id} value={v._id}>
                        {v.businessName || v.name} ({v.userId?.name || v.ownerName || 'Vendor'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Proprietor / Owner Name *</label>
                <input 
                  required
                  type="text" 
                  value={newCert.vendorName}
                  onChange={e => setNewCert({...newCert, vendorName: e.target.value})}
                  placeholder="e.g. Rajesh Kumar / Nikhil Mehta"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Shop / Business Establishment Name *</label>
                <input 
                  required
                  type="text" 
                  value={newCert.shopName}
                  onChange={e => setNewCert({...newCert, shopName: e.target.value})}
                  placeholder="e.g. Gaya Medical & Surgical"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Vendor Shop Category *</label>
                  <select 
                    value={newCert.category}
                    onChange={e => setNewCert({...newCert, category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                    <option value="Hardware & Plumbing Supplies">Hardware & Plumbing Supplies</option>
                    <option value="General Grocery & Supermarket">General Grocery & Supermarket</option>
                    <option value="Automobile & Spare Parts">Automobile & Spare Parts</option>
                    <option value="Restaurant & Food Services">Restaurant & Food Services</option>
                    <option value="Clothing & Apparel">Clothing & Apparel</option>
                    <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                    <option value="Furniture & Home Decor">Furniture & Home Decor</option>
                    <option value="Other Merchant Services">Other Merchant Services</option>
                  </select>
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
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsGenerateOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Save & Create Certificate</button>
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
            
            {/* Top Modal Controls */}
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Official Merchant Certificate (A4 Size)</h3>
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
              <div ref={printRef} className="w-[850px] sm:w-[1000px] h-[600px] sm:h-[700px] mx-auto bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border-[10px] sm:border-[14px] border-amber-600 relative flex flex-col justify-between font-serif shadow-2xl">
                
                <div className="border-2 border-amber-500 p-4 sm:p-8 rounded-lg relative bg-amber-50/20 h-full flex flex-col justify-between">
                  
                  {/* Background Watermark Seal */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <img src="/gaya_seva_app_icon.png" alt="Watermark" className="w-72 h-72 sm:w-96 sm:h-96 object-contain" />
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center border-b-2 border-amber-400/50 pb-3">
                    <div className="flex items-center gap-3">
                      <img src="/gaya_seva_app_icon.png" alt="GayaSeva Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full shadow-md border-2 border-amber-400" />
                      <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                          Gaya<span className="text-amber-600">Seva</span> Digital Network
                        </h1>
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-amber-700 font-sans mt-0.5">
                          OFFICIAL ENTERPRISE GOVERNANCE & VERIFICATION COUNCIL
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-sans">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-800 border border-amber-500/30 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider inline-block mb-1">
                        VERIFIED MERCHANT CERTIFICATE
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600 block">{selectedCert.certId}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center my-2 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-widest font-serif">
                      Certificate of Business Verification
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto italic">
                      This is to certify that the business establishment listed below has been thoroughly inspected, identity verified, and officially onboarded as an Authentic Service Provider under GayaSeva Council guidelines.
                    </p>
                  </div>

                  {/* Recipient Box */}
                  <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-sm text-center font-sans space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-800 uppercase tracking-widest block">PROPRIETOR & BUSINESS ESTABLISHMENT</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedCert.shopName}</h3>
                    <div className="py-0.5">
                      <span className="text-sm sm:text-base font-black text-slate-800">Proprietor: </span>
                      <span className="text-amber-900 font-black text-lg sm:text-xl uppercase tracking-wide border-b-2 border-amber-500/60 pb-0.5 ml-1">{selectedCert.vendorName}</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-700">Category: <span className="text-amber-900 font-black">{selectedCert.category}</span> • Location: {selectedCert.city}, Bihar</p>
                  </div>

                  {/* Validity Dates */}
                  <div className="grid grid-cols-2 gap-4 text-center font-sans text-xs border-y border-amber-300/60 py-2.5">
                    <div>
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Date of Issuance</span>
                      <span className="font-black text-slate-800 text-xs sm:text-sm">{selectedCert.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Valid Until</span>
                      <span className="font-black text-emerald-700 text-xs sm:text-sm">{selectedCert.expiryDate}</span>
                    </div>
                  </div>

                  {/* Footer Seal & Signature */}
                  <div className="flex justify-between items-center font-sans pt-1">
                    
                    <div className="flex items-center gap-2.5 bg-amber-50 p-2 rounded-xl border border-amber-200">
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

                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-full flex items-center justify-center p-1 shadow-xl border-4 border-amber-200">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-amber-100 flex flex-col items-center justify-center text-center p-0.5 text-white">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-0.5" />
                        <span className="text-[6px] font-black uppercase tracking-widest leading-none">VERIFIED PARTNER</span>
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
