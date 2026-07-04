'use client';
import { useAuth } from '@/contexts/AuthContext';

// Static class maps — Tailwind's JIT compiler only picks up classes it can
// see as full strings in the source. `bg-${w.text}-50` etc. get purged in
// production because the compiler never sees the complete class name.
const COLOR_STYLES = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
};

const workers = [
  { name: "Ramesh Kumar", role: "Raj Mistri (Mason)", rate: "₹600", available: true, avatar: "RK", color: "indigo" },
  { name: "Suresh Paswan", role: "Painter", rate: "₹500", available: true, avatar: "SP", color: "teal" },
  { name: "Mohan Das", role: "Carpenter", rate: "₹550", available: false, avatar: "MD", color: "amber", locked: true },
  { name: "Ajay Kumar", role: "Helper / Loader", rate: "₹400", available: false, avatar: "AK", color: "rose", locked: true },
];

function WorkerCard({ w }) {
  const c = COLOR_STYLES[w.color];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 relative group hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300">

      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-sora font-[800] text-[14px] border ${c.bg} ${c.text} ${c.border}`}>
          {w.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-[800] text-[14px] text-slate-900 truncate">{w.name}</span>
            {w.available && (
              <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="text-[11px] font-medium text-slate-500 truncate">{w.role}</div>
        </div>

        {w.available ? (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        ) : (
          <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-12v2H8V7a4 4 0 118 0z" />
          </svg>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
        <span className={`font-[800] text-indigo-600 text-[15px] ${w.locked ? "blur-[4px] select-none" : ""}`}>
          {w.rate}<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">/day</span>
        </span>

        {w.available ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 rounded-full px-2 py-1 border border-green-100">
            Available
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full px-2 py-1 border border-slate-200">
            Locked
          </span>
        )}
      </div>
    </div>
  );
}

export default function LabourSection() {
  const { user, openSubscriptionModal } = useAuth();

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {workers.map((w, idx) => <WorkerCard key={idx} w={w} />)}
      </div>

      {user?.isSubscribed ? (
        <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-[20px] p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-emerald-900">
              Premium access active. Contact local workers directly anytime.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-[20px] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-white mb-1">800+ local workers registered.</p>
              <p className="text-[13px] font-medium text-slate-400">
                Subscribe to unlock rates, availability and contact numbers instantly.
              </p>
            </div>
          </div>

          <button
            onClick={openSubscriptionModal}
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-[12px] text-[13px] font-bold tracking-wide hover:bg-indigo-500 transition-colors duration-200"
          >
            Subscribe ₹11/month
          </button>
        </div>
      )}
    </div>
  );
}