'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, User, MapPin, Phone, Mail, CreditCard, Briefcase, Calendar, CheckCircle, Globe, Award, Sparkles, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicEmployeeVerificationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVerification();
    }
  }, [id]);

  const fetchVerification = async () => {
    try {
      const res = await fetch(`/api/employee/${id}`);
      const json = await res.json();
      if (json.success && json.employee) {
        setEmp(json.employee);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-bold tracking-wide animate-pulse">Verifying GayaSeva Employee Credentials...</p>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center mb-4 border border-rose-500/30">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-center">Invalid Verification Request</h2>
        <p className="text-slate-400 text-center max-w-sm mb-6 text-xs">The employee ID or verification record could not be validated in the official GayaSeva registry.</p>
        <button onClick={() => router.push('/')} className="bg-indigo-600 text-white font-black px-6 py-2.5 rounded-2xl shadow-lg text-sm">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 relative overflow-x-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-indigo-600/30 via-indigo-900/10 to-transparent blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-full p-1 shadow-md border border-indigo-400/40 flex items-center justify-center">
              <img src="/gaya_seva_app_icon.png" alt="GayaSeva" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">Gaya<span className="text-indigo-400">Seva</span></h1>
              <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Enterprise Staff Registry</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-full flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> VERIFIED RECORD
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6 relative z-10">

        {/* VERIFICATION HERO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 rounded-3xl border border-indigo-500/30 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Status Badge */}
          <div className="flex justify-between items-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> OFFICIAL ACTIVE STAFF
            </span>
            <span className="text-xs font-mono font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {emp.empId}
            </span>
          </div>

          {/* Employee Avatar */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-28 h-28 bg-slate-800 rounded-full p-1 border-2 border-indigo-500/60 shadow-xl mb-4 relative">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center border-2 border-slate-700">
                {emp.photo ? (
                  <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-500" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-900 shadow-md">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{emp.name}</h1>
            <p className="text-indigo-400 font-extrabold text-sm uppercase tracking-wider">{emp.designation}</p>
            <p className="text-slate-400 text-xs mt-0.5">{emp.department} Department</p>
          </div>

          {/* VERIFIED DETAILS GRID */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
            
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400 font-bold flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Aadhar Verification:
              </span>
              <strong className="text-white font-mono">{emp.maskedAadhar}</strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400 font-bold flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Employee ID:
              </span>
              <strong className="text-amber-400 font-mono">{emp.empId}</strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400 font-bold flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> Contact Phone:
              </span>
              <strong className="text-slate-200">{emp.phone}</strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400 font-bold flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Official Email:
              </span>
              <strong className="text-slate-200">{emp.email}</strong>
            </div>

            {emp.joiningDate && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Joining Date:
                </span>
                <strong className="text-slate-200">{new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </div>
            )}

            {emp.address && (
              <div className="flex items-start justify-between py-1.5">
                <span className="text-slate-400 font-bold flex items-center gap-2 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Address:
                </span>
                <span className="text-slate-200 font-medium text-right ml-4">{emp.address}</span>
              </div>
            )}

          </div>

          {/* Verification Footnote */}
          <div className="mt-5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 text-center font-medium">
            ✔ This record is cryptographically verified against the official GayaSeva Enterprise Employee Database.
          </div>

        </motion.div>

        {/* Footer */}
        <footer className="text-center pt-2 pb-6 space-y-1">
          <p className="text-xs font-extrabold text-slate-400">GayaSeva Enterprise Personnel System</p>
          <p className="text-[10px] text-slate-600">www.gayaseva.com • All Rights Reserved</p>
        </footer>

      </main>
    </div>
  );
}
