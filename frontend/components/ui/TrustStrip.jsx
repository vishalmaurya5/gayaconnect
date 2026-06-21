import { ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react';

export default function TrustStrip() {
  const items = [
    { 
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />, 
      title: "Verified & Trusted", 
      subtitle: "Build trust and credibility",
    },
    { 
      icon: <TrendingUp className="w-6 h-6 text-teal-500" />, 
      title: "Grow Your Business", 
      subtitle: "Get more leads and sales",
    },
    { 
      icon: <Users className="w-6 h-6 text-indigo-600" />, 
      title: "Local Reach", 
      subtitle: "Connect with local customers",
    },
    { 
      icon: <Zap className="w-6 h-6 text-teal-500" />, 
      title: "Easy Management", 
      subtitle: "Manage your profile & leads",
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col md:flex-row flex-wrap justify-center lg:justify-between items-start sm:items-center gap-8 md:gap-6 font-sora">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-row items-center gap-4 flex-1 min-w-[200px] w-full sm:w-auto group">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm border border-slate-100 bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-[800] text-[15px] text-slate-900 leading-tight">{item.title}</div>
              <div className="text-[12px] font-medium text-slate-500 mt-1">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
