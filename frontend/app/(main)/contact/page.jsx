import { FiPhone, FiMail, FiMessageCircle, FiMapPin, FiGlobe, FiInstagram, FiFacebook, FiClock, FiSend, FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import Link from 'next/link';

export const metadata = {
  title: 'Contact & Support | Gaya Seva',
  description: 'Connect with the Gaya Seva support team for inquiries, business partnerships, and assistance.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-emerald-500 selection:text-white pb-20 font-sans relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24">
        
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
            <FiGlobe className="text-emerald-400 animate-pulse" />
            Global Support Center
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">help you?</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Whether you're a business partner or a consumer, our enterprise support team is available around the clock.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="relative z-20 container-custom px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Methods Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Phone Card */}
              <div className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 group">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                  <FiPhone className="text-3xl text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Direct Lines</h3>
                <p className="text-slate-400 font-medium mb-6">Priority routing for urgent inquiries and enterprise partners.</p>
                
                <div className="space-y-4">
                  <a href="tel:+919117588242" className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-emerald-500/50 transition-all group/btn">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg text-emerald-400 border border-slate-700"><FiPhone /></div>
                      <span className="font-bold text-slate-200 text-lg">+91 91175 88242</span>
                    </div>
                    <FiArrowRight className="text-slate-600 group-hover/btn:text-emerald-400 group-hover/btn:-rotate-45 transition-all" />
                  </a>
                  <a href="tel:+918544491413" className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-emerald-500/50 transition-all group/btn">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg text-emerald-400 border border-slate-700"><FiPhone /></div>
                      <span className="font-bold text-slate-200 text-lg">+91 85444 91413</span>
                    </div>
                    <FiArrowRight className="text-slate-600 group-hover/btn:text-emerald-400 group-hover/btn:-rotate-45 transition-all" />
                  </a>
                </div>
              </div>

              {/* Email & WhatsApp Card */}
              <div className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 group">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                  <FiMessageCircle className="text-3xl text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Digital Support</h3>
                <p className="text-slate-400 font-medium mb-6">Guaranteed response within 24 hours for all digital queries.</p>
                
                <div className="space-y-4">
                  <a href="mailto:supportgayaseva@gmail.com" className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-blue-500/50 transition-all group/btn">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg text-blue-400 border border-slate-700"><FiMail /></div>
                      <span className="font-bold text-slate-200 truncate max-w-[140px] sm:max-w-none text-sm sm:text-base">supportgayaseva@gmail.com</span>
                    </div>
                    <FiArrowRight className="text-slate-600 group-hover/btn:text-blue-400 group-hover/btn:-rotate-45 transition-all" />
                  </a>
                  <a href="https://wa.me/919117588242" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/50 transition-all group/btn">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#25D366]/20 p-2 rounded-lg text-[#25D366] border border-[#25D366]/30"><FiMessageCircle /></div>
                      <span className="font-bold text-slate-200 text-lg">WhatsApp Chat</span>
                    </div>
                    <FiArrowRight className="text-slate-600 group-hover/btn:text-[#25D366] group-hover/btn:-rotate-45 transition-all" />
                  </a>
                </div>
              </div>
            </div>

            {/* Platform Overview Banner */}
            <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 shadow-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 text-center md:text-left group hover:border-emerald-500/40 transition-colors">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 w-24 h-24 shrink-0 bg-slate-900 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-xl group-hover:scale-105 transition-transform">
                <FiGlobe className="text-4xl text-emerald-400" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">The Gaya Seva Ecosystem</h2>
                <p className="text-slate-300 font-medium leading-relaxed max-w-xl text-lg">
                  Empowering the local economy by providing digital tools that foster transparency, efficiency, and trust. Every provider on our platform is carefully verified to ensure quality and safety.
                </p>
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                   <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-emerald-950 font-bold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all">
                     Learn More About Us <FiArrowRight />
                   </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Info Column */}
          <div className="space-y-8">
            
            {/* Location Card */}
            <div className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform border border-orange-500/20">
                <FiMapPin className="text-2xl text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Headquarters</h3>
              <p className="text-slate-400 font-medium mb-6 relative z-10">Our digital infrastructure operates globally from our main office.</p>
              
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 relative z-10">
                <p className="font-bold text-white text-xl">Gaya, Bihar</p>
                <p className="text-orange-400 font-bold mt-1 text-sm tracking-wide">832003, INDIA</p>
              </div>
            </div>

            {/* Social Connect */}
            <div className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-xl p-8 group hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-500/20">
                <FiGlobe className="text-2xl text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Social Connect</h3>
              <p className="text-slate-400 font-medium mb-6">Follow us for updates and exclusive offers on our network.</p>
              
              <div className="flex gap-4">
                <a href="https://www.instagram.com/gayasevabr02?igsh=MTRyMGZxNHdzZ2V1NA%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white font-bold py-4 px-2 rounded-2xl transition-all shadow-md hover:shadow-lg hover:scale-105 group/icon">
                  <FiInstagram className="text-2xl group-hover/icon:scale-110 transition-transform" />
                </a>
                <a href="https://www.facebook.com/share/197hhkzBL6/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white font-bold py-4 px-2 rounded-2xl transition-all shadow-md hover:shadow-lg hover:scale-105 group/icon">
                  <FiFacebook className="text-2xl group-hover/icon:scale-110 transition-transform" />
                </a>
              </div>
            </div>
            
            {/* Hours Card */}
            <div className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-xl p-8 flex items-center gap-5 hover:border-amber-500/30 transition-colors group">
              <div className="w-14 h-14 shrink-0 bg-amber-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-500/20">
                <FiClock className="text-2xl text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Support Hours</h3>
                <p className="text-amber-400 font-bold mt-1">24/7 Digital</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-20 container-custom px-4 max-w-7xl mx-auto mt-16 lg:mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-6 shadow-sm">
            <FiHelpCircle className="text-emerald-400" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-400 font-medium">Quick answers to help you get the most out of the Gaya Seva platform.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            { q: "How long does it take for support to respond?", a: "For digital queries via email, we guarantee a response within 24 hours. For urgent matters, please use our Direct Lines or WhatsApp." },
            { q: "How can I register my business as a Vendor?", a: "You can easily register your business by navigating to the 'Register Business' section from the top menu or the Footer. Verification takes 1-2 business days." },
            { q: "Is the platform available outside of Gaya?", a: "Currently, our primary focus and hyper-local optimizations are built for the Gaya region, but our digital ecosystem is expanding to nearby areas soon." },
            { q: "Are the workers (Labour) verified?", a: "Yes, every service provider and local worker on Gaya Seva undergoes a background verification process to ensure quality and safety." }
          ].map((faq, i) => (
            <div key={i} className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-xl p-8 transition-all hover:-translate-y-1 hover:border-emerald-500/30 group">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{faq.q}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
