export default function HowItWorks() {
  const steps = [
    {
      title: "Search or Browse",
      desc: "Find the service you need by searching or exploring our local categories.",
      icon: "🔍"
    },
    {
      title: "Compare & Contact",
      desc: "View ratings, compare offers, and instantly unlock contact details.",
      icon: "📞"
    },
    {
      title: "Get it Done",
      desc: "Connect directly with trusted Gaya professionals and get your work done.",
      icon: "✅"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center mt-10">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center relative group">
          
          {/* Connector line for desktop */}
          {idx !== steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-[60%] w-full h-[1px] bg-gradient-to-r from-indigo-500/50 to-transparent z-0"></div>
          )}

          <div className="w-24 h-24 bg-slate-800/50 backdrop-blur-sm rounded-[24px] flex items-center justify-center text-4xl mb-6 shadow-xl border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300 relative z-10 group-hover:-translate-y-2">
            <span className="drop-shadow-lg">{step.icon}</span>
            
            {/* Step Number Badge */}
            <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-[800] text-[14px] shadow-lg border-2 border-slate-900">
              {idx + 1}
            </div>
          </div>
          
          <h3 className="text-xl font-[800] text-white mb-3 font-sora">{step.title}</h3>
          <p className="text-slate-400 text-[15px] max-w-[280px] leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}
