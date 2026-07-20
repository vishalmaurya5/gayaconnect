import Link from 'next/link';

export default function VendorCTA() {
  return (
    <div className="w-full p-[1px] rounded-[32px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-teal-500/30 shadow-2xl mt-6 mb-10 relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 px-5 md:px-8 rounded-[31px] bg-[#0B101E] relative overflow-hidden z-10">
        
        {/* Subtle Background Glows inside the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center justify-center bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-md shadow-lg gap-2 rounded-full text-[12px] md:text-[13px] uppercase tracking-[0.2em] font-bold mb-6 relative z-10">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="bg-gradient-to-r from-teal-200 to-indigo-200 bg-clip-text text-transparent">For Businesses</span>
        </div>
        
        <h2 className="font-sora text-4xl md:text-5xl lg:text-[64px] font-[800] mt-4 mb-6 leading-[1.15] text-white relative z-10 tracking-tight">
            Grow Your Business<br className="hidden md:block" />
            <span className="bg-gradient-to-r from-teal-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent"> with Our Platform.</span> 
        </h2>
        
        <p className="text-slate-400 mt-2 max-w-3xl text-[16px] md:text-[20px] leading-[1.6] relative z-10 font-medium">
          Join thousands of professionals who are managing their listings, posting offers, and skyrocketing their revenue through our digital platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-10 relative z-10 w-full sm:w-auto">
          <Link href="/pricing" className="border border-white/10 bg-white/5 text-slate-200 px-8 py-4 rounded-2xl text-[16px] md:text-[17px] font-bold hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
            Learn more
          </Link>
          <Link href="/register-vendor" className="bg-white text-slate-900 px-8 py-4 rounded-2xl text-[16px] md:text-[17px] font-bold hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"> 
            Register for Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
