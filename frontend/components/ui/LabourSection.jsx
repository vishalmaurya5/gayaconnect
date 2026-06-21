'use client';
import { useAuth } from '@/contexts/AuthContext';

const workers = [
  { name: "Ramesh Kumar", role: "Raj Mistri (Mason)", rate: "₹600", available: true, avatar: "RK", bg: "bg-indigo-50", text: "indigo" },
  { name: "Suresh Paswan", role: "Painter", rate: "₹500", available: true, avatar: "SP", bg: "bg-teal-50", text: "teal" },
  { name: "Mohan Das", role: "Carpenter", rate: "₹550", available: false, avatar: "MD", bg: "bg-amber-50", text: "amber", locked: true },
  { name: "Ajay Kumar", role: "Helper / Loader", rate: "₹400", available: false, avatar: "AK", bg: "bg-rose-50", text: "rose", locked: true },
];

export default function LabourSection() {
  const { user, openSubscriptionModal } = useAuth();

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {workers.map((w, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-[24px] p-6 text-center hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 relative group">
            
            <div className="absolute top-4 right-4">
              {w.available ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              ) : (
                <span className="relative flex h-2.5 w-2.5 rounded-full bg-slate-300"></span>
              )}
            </div>

            <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto font-sora font-[800] text-xl ${w.bg} text-${w.text}-700 shadow-sm border border-${w.text}-100 group-hover:scale-105 transition-transform duration-300`}>
              {w.avatar}
            </div>
            
            <div className="mt-4">
              <div className="font-[800] text-[16px] text-slate-900">{w.name}</div>
              <div className="text-[12px] font-medium text-slate-500 mt-0.5">{w.role}</div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 bg-slate-50/50 rounded-xl">
              <span className={`font-[800] text-indigo-600 text-[18px] ${w.locked ? "blur-[4px] select-none" : ""}`}>{w.rate}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1.5">per day</span>
            </div>
            
            <div className="mt-3">
              {w.available ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50/80 rounded-full px-3 py-1.5 border border-green-100">
                  Available Today
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200 blur-[2px] select-none">
                  Locked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {user?.isSubscribed ? (
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/60 rounded-[20px] p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[14px] font-semibold text-emerald-900">
              Premium access active. Contact daily workers directly anytime.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-gradient-to-r from-slate-900 to-[#0F172A] border border-slate-800 rounded-[20px] p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-white mb-1">
                800+ daily workers registered.
              </p>
              <p className="text-[13px] font-medium text-slate-400">
                Subscribe to unlock rates, availability & contact numbers instantly.
              </p>
            </div>
          </div>
          
          <button 
            onClick={openSubscriptionModal}
            className="relative z-10 w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-[12px] text-[13px] font-bold tracking-wide hover:bg-indigo-500 hover:shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all duration-300"
          >
            Subscribe ₹11/month
          </button>
        </div>
      )}
    </div>
  );
}
