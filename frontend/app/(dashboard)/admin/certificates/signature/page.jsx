'use client';

import { useState, useEffect } from 'react';
import { 
  PenTool, Save, Upload, CheckCircle2, ShieldCheck, RefreshCw, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DigitalSignaturePage() {
  const [loading, setLoading] = useState(false);
  const [signatory, setSignatory] = useState({
    name: 'Dr. A. K. Verma',
    designation: 'Registrar & Authorised Director',
    council: 'GayaSeva Digital Governance & Verification Council',
    sigUrl: '/gaya_seva_app_icon.png',
    securityHash: 'SHA256-GS-84920194820194'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_digital_signature');
      if (saved) {
        try { setSignatory(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_digital_signature', JSON.stringify(signatory));
      }
      toast.success('Authorised Digital Signature updated!');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Authorised Digital Signature</h1>
          <p className="text-slate-500 text-xs mt-1">Manage official digital signatures and seals embedded in certificates.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Signature Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Signatory Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <PenTool className="w-4 h-4 text-indigo-500" /> Signatory Information
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Authorised Signatory Full Name *
              </label>
              <input 
                type="text" 
                value={signatory.name}
                onChange={e => setSignatory({...signatory, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Official Designation *
              </label>
              <input 
                type="text" 
                value={signatory.designation}
                onChange={e => setSignatory({...signatory, designation: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Governance Body / Council
              </label>
              <input 
                type="text" 
                value={signatory.council}
                onChange={e => setSignatory({...signatory, council: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Signature Image / Asset URL
              </label>
              <input 
                type="text" 
                value={signatory.sigUrl}
                onChange={e => setSignatory({...signatory, sigUrl: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </form>
        </div>

        {/* Right Column: Live Signature Preview */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Digital Certificate Seal & Signature Preview
          </h2>

          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 font-sans">
            <div className="font-serif italic text-2xl font-black text-slate-800 dark:text-slate-100 border-b border-slate-300 dark:border-slate-700 pb-2 inline-block px-6">
              {signatory.name}
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white text-xs block uppercase tracking-wider">{signatory.designation}</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{signatory.council}</span>
            </div>
            <div className="pt-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-mono font-black rounded-full uppercase">
                ● HASH: {signatory.securityHash}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
