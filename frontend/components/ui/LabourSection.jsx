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
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {workers.map((w, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-sora font-bold text-lg ${w.bg} text-${w.text}-700`}>
              {w.avatar}
            </div>
            <div className="font-semibold mt-2">{w.name}</div>
            <div className="text-xs text-gray-500">{w.role}</div>
            <div className="mt-2">
              <span className={`font-bold text-indigo-600 ${w.locked ? "blur-sm select-none" : ""}`}>{w.rate}</span>
              <span className="text-xs text-gray-400 ml-1">per day</span>
            </div>
            {w.available ? (
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-green-700 bg-green-50 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Available today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 blur-[2px] select-none">
                Locked
              </span>
            )}
          </div>
        ))}
      </div>
      {user?.isSubscribed ? (
        <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm font-medium text-green-900">You have premium access. Contact daily workers directly.</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>
            <p className="text-sm font-medium text-indigo-900">800+ daily workers registered. Subscribe to contact them directly. <span className="text-gray-600 ml-1">Rates, availability & numbers all unlocked.</span></p>
          </div>
          <button 
            onClick={openSubscriptionModal}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-indigo-700 transition"
          >
            Subscribe ₹11/month
          </button>
        </div>
      )}
    </div>
  );
}
