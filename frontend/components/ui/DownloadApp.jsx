'use client';

import { Apple, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DownloadApp() {
  return (
    <section className="bg-[#0F172A] py-20 md:py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[32px] border border-white/10 p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl">
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          {/* Left Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[11px] font-bold text-teal-300 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Coming Soon
            </div>
            
            <h2 className="font-sora text-3xl md:text-5xl font-[800] text-white tracking-tight leading-[1.1] mb-6">
              The Official <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Mobile App
              </span>
            </h2>
            
            <p className="text-slate-300 text-[16px] md:text-[18px] leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Take the most trusted digital platform wherever you go. Book services, hire professionals, and unlock exclusive deals on the move.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Play Store Button Mock */}
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 rounded-xl px-6 py-3.5 group cursor-not-allowed">
                <Play className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-300 uppercase font-semibold leading-none mb-1">Coming Soon on</div>
                  <div className="text-[16px] text-white font-bold leading-none">Google Play</div>
                </div>
              </button>

              {/* App Store Button Mock */}
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 rounded-xl px-6 py-3.5 group cursor-not-allowed">
                <Apple className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-300 uppercase font-semibold leading-none mb-1">Coming Soon on</div>
                  <div className="text-[16px] text-white font-bold leading-none">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Phone Mockups */}
          <div className="lg:w-1/2 relative h-[300px] md:h-[400px] w-full flex items-center justify-center lg:justify-end perspective-1000">
            {/* Phone 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="absolute z-10 w-[180px] md:w-[220px] aspect-[9/19] bg-slate-900 rounded-[32px] border-[6px] border-slate-800 shadow-2xl overflow-hidden right-[20%] md:right-[30%] lg:right-[40%]"
            >
              {/* Screen Mockup */}
              <div className="w-full h-full bg-slate-50 flex flex-col">
                <div className="h-14 bg-indigo-600 w-full flex items-center px-4">
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                  <div className="w-20 h-3 rounded-full bg-white/20 ml-3"></div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="w-full h-24 rounded-xl bg-slate-200"></div>
                  <div className="w-full h-12 rounded-xl bg-indigo-100"></div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="w-full h-16 rounded-xl bg-slate-200"></div>
                    <div className="w-full h-16 rounded-xl bg-slate-200"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phone 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 10 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="absolute z-20 w-[180px] md:w-[220px] aspect-[9/19] bg-slate-900 rounded-[32px] border-[6px] border-slate-800 shadow-2xl overflow-hidden right-[5%] md:right-[10%] lg:right-0 mt-12"
            >
               {/* Screen Mockup */}
               <div className="w-full h-full bg-slate-50 flex flex-col">
                <div className="h-20 bg-slate-900 w-full flex flex-col justify-end p-4 pb-3">
                  <div className="w-24 h-4 rounded-full bg-white/20"></div>
                </div>
                <div className="p-4 space-y-3 flex-1 bg-slate-100">
                  <div className="w-full h-10 rounded-full bg-white shadow-sm"></div>
                  <div className="w-full h-32 rounded-xl bg-white shadow-sm mt-4"></div>
                  <div className="w-full h-16 rounded-xl bg-teal-100 mt-2"></div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
