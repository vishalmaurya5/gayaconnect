import { FiUsers, FiGrid, FiStar, FiUserCheck, FiMapPin } from 'react-icons/fi';

export default function TrustStrip() {
  const stats = [
    { 
      icon: <FiUsers className="w-6 h-6 text-indigo-600" />, 
      label: "Verified vendors", 
      value: "2,400+",
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    { 
      icon: <FiGrid className="w-6 h-6 text-teal-600" />, 
      label: "Service categories", 
      value: "180+",
      bg: "bg-teal-50",
      border: "border-teal-100"
    },
    { 
      icon: <FiStar className="w-6 h-6 text-amber-500" />, 
      label: "Average rating", 
      value: "4.8★",
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    { 
      icon: <FiUserCheck className="w-6 h-6 text-emerald-600" />, 
      label: "Daily workers", 
      value: "800+",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    { 
      icon: <FiMapPin className="w-6 h-6 text-rose-600" />, 
      label: "Areas in Gaya", 
      value: "40+",
      bg: "bg-rose-50",
      border: "border-rose-100"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-10 relative z-20 -mt-12 mb-10">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl py-6 px-2 flex flex-wrap justify-around gap-y-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-4 px-4 md:px-6 md:border-r last:border-r-0 border-slate-100 flex-1 min-w-[180px] group hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${stat.border} ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div>
              <div className="font-sora text-2xl font-extrabold text-slate-800 tracking-tight">{stat.value}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
