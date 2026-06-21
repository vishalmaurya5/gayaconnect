export default function VendorCTA() {
  return (
    <div className="relative rounded-[32px] py-14 md:py-20 px-8 md:px-16 overflow-hidden mt-6 mb-10 shadow-2xl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-indigo-950 to-[#0F172A]"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[11px] font-bold text-teal-300 uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            For Businesses
          </div>
          <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-white leading-[1.1] mb-4">
            List your business.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">Reach the entire district.</span>
          </h2>
          <p className="text-slate-300 text-[16px] md:text-[18px] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Join thousands of local professionals who are managing their listings, posting offers, and skyrocketing their revenue through Gaya Connect.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
          <button className="border border-white/20 bg-white/5 text-white px-8 py-4 rounded-[16px] text-[15px] font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
            Learn more
          </button>
          <button className="bg-white text-[#0F172A] px-8 py-4 rounded-[16px] text-[15px] font-bold hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            Register for Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
