import Link from 'next/link'
import { FiSearch, FiShield, FiTrendingUp, FiMapPin, FiSmartphone, FiTarget, FiAlertCircle, FiBriefcase, FiHeart, FiGlobe, FiLock, FiUsers, FiAward, FiServer } from 'react-icons/fi'

export const metadata = {
  title: 'About Us | Gaya Seva Global Enterprise',
  description: 'Learn about the Gaya Seva Platform, our global mission, enterprise infrastructure, and how we digitize businesses worldwide.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf3] via-[#f4fce8] to-[#e8f5e9] selection:bg-emerald-500 selection:text-white pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-emerald-200/50 text-emerald-800 text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
            <FiGlobe className="text-emerald-500 animate-pulse" />
            Global Digital Ecosystem
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-emerald-950 mb-8 leading-tight">
            Empowering the World's <br className="hidden md:block"/> Service Economy
          </h1>
          <p className="text-xl md:text-2xl text-emerald-800/80 leading-relaxed max-w-3xl mx-auto font-medium">
            Bridging the gap between businesses and consumers worldwide by building a beautifully centralized, reliable digital ecosystem.
          </p>
        </div>
      </section>

      {/* 2. What We Provide / Our Services */}
      <section className="relative z-30 -mt-16 mb-24 container-custom">
        <div className="rounded-[3rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-10 md:p-16 shadow-2xl overflow-hidden relative border border-emerald-800">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3 text-center lg:text-left shrink-0">
              <span className="text-yellow-400 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Our Offerings</span>
              <h2 className="text-4xl md:text-5xl font-serif italic font-light text-white mb-6">
                What We <br className="hidden lg:block"/>
                <span className="font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-200 not-italic">Provide</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-emerald-500 rounded-full mx-auto lg:mx-0"></div>
            </div>
            
            <div className="lg:w-2/3">
              <p className="text-xl md:text-2xl text-emerald-50 font-light leading-relaxed tracking-wide">
                Gaya Seva is a comprehensive, <strong className="font-bold text-white">all-in-one digital ecosystem</strong> designed to seamlessly connect you with premium, verified services across every sector. From <span className="italic text-yellow-200">skilled contractors, mechanics, and technicians</span> to local storefronts and enterprise suppliers, our platform aggregates the best the market has to offer.
              </p>
              <br/>
              <p className="text-lg md:text-xl text-emerald-100/80 font-medium leading-relaxed">
                Whether you urgently require home repairs, automotive assistance, daily wage labor, or professional B2B consulting, we provide an intuitive dashboard to discover, vet, and contact top-tier professionals instantly. By digitizing the unorganized sector, we ensure <strong className="font-bold text-emerald-300">speed, reliability, and absolute transparency</strong>—empowering users and scaling local businesses globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Global Problem Section */}
      <section className="relative z-20 -mt-16 container-custom">
        <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-yellow-100/50 shadow-xl shadow-emerald-900/5 p-8 md:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                  <FiAlertCircle className="text-2xl" />
                </span>
                <h2 className="text-3xl font-extrabold text-emerald-950">The Industry Disconnect</h2>
              </div>
              <p className="text-lg text-emerald-900/70 leading-relaxed mb-8 font-medium">
                For years, finding reliable enterprise and local services globally has relied heavily on fragmented directories, scattered platforms, and unverified data.
              </p>
              <ul className="space-y-5">
                {[
                  'Consumers struggle to find verified, trusted professionals quickly.',
                  'Businesses lack affordable, scalable, and premium digital visibility.',
                  'No central enterprise platform bridges the gap effectively across diverse markets.',
                  'Trust issues arise due to a severe lack of transparent business profiles.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-emerald-900/80 font-medium">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-100/50 to-yellow-50/50 rounded-3xl blur-2xl"></div>
              <div className="relative rounded-[2rem] bg-gradient-to-br from-emerald-900 to-emerald-950 p-10 shadow-2xl overflow-hidden border border-emerald-800/50">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-bold text-yellow-50 mb-5">The Result?</h3>
                <p className="text-emerald-100/80 leading-relaxed text-lg">
                  Lost economic opportunities on a global scale. Consumers waste precious time searching for essential services, while excellent businesses remain undiscovered by their potential audience. The global economy remains disconnected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Mission Section */}
      <section className="container-custom py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Our Enterprise Mission</p>
          <h2 className="text-4xl font-extrabold text-emerald-950 mb-6">Why Our Platform Exists</h2>
          <p className="text-lg text-emerald-800/70 leading-relaxed font-medium">
            Our aim is ambitious: to organize the world's service landscape into a beautifully accessible, highly scalable, and universally trusted digital directory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FiGlobe,
              title: 'Global Discovery',
              description: 'To provide a single, unified platform where anyone can find enterprises, mechanics, contractors, and daily services instantly, anywhere.',
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              border: 'border-blue-100/50'
            },
            {
              icon: FiTrendingUp,
              title: 'Empowering Businesses',
              description: 'To give every enterprise, big or small, a premium SaaS profile, robust dashboards, and the elegant tools they need to scale globally.',
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200/50'
            },
            {
              icon: FiShield,
              title: 'Unbreakable Trust',
              description: 'To ensure authenticity by implementing strict verification standards, transparent reviews, and beautifully designed digital identities.',
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
              border: 'border-yellow-200/50'
            }
          ].map((item, i) => (
            <div key={i} className={`rounded-[2rem] border ${item.border} bg-white/60 backdrop-blur-xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80`}>
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} ${item.color} mb-6 shadow-sm`}>
                <item.icon className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-4">{item.title}</h3>
              <p className="text-emerald-800/70 leading-relaxed font-medium">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Infrastructure & Security Section */}
      <section className="container-custom pb-24 relative z-10">
        <div className="rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-900/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Enterprise-Grade Infrastructure</h2>
            <p className="text-lg text-slate-300 font-medium">
              We leverage cloud-native architectures, advanced AI verification, and highly redundant global servers to ensure zero downtime and maximum security for all our partners.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative z-10">
            {[
              { icon: FiServer, title: 'Global Edge Network', desc: 'Lightning-fast delivery across regions via our distributed edge networks.' },
              { icon: FiLock, title: 'Military-Grade Security', desc: 'End-to-end encryption for all enterprise data and personal information.' },
              { icon: FiTarget, title: '99.99% Uptime SLA', desc: 'Guaranteed reliability for businesses that depend on our digital ecosystem.' }
            ].map((feature, i) => (
              <div key={i} className="rounded-[1.5rem] bg-slate-800/50 border border-slate-700 p-8 hover:bg-slate-800 transition-colors">
                <feature.icon className="text-emerald-400 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Platform Features Section */}
      <section className="container-custom pb-24 relative z-10">
        <div className="rounded-[3rem] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center relative z-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Platform Architecture</p>
              <h2 className="text-4xl font-extrabold text-emerald-950 mb-6">How It Works</h2>
              <p className="text-lg text-emerald-800/70 leading-relaxed mb-10 font-medium">
                Our platform is designed with state-of-the-art technology to ensure speed, security, and a visually stunning experience for every user across the globe.
              </p>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:shadow-emerald-500/40">
                Join the Network
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: FiSearch, title: 'Smart Global Search', desc: 'Find specialized businesses across borders using our AI-driven search algorithm.' },
                { icon: FiBriefcase, title: 'Enterprise Dashboards', desc: 'Powerful CRM and analytics dashboards to manage data, offers, and leads.' },
                { icon: FiSmartphone, title: 'Mobile First', desc: 'A seamless, ultra-responsive app-like experience optimized for all devices.' },
                { icon: FiUsers, title: 'B2B & B2C Scaling', desc: 'Designed perfectly to handle both direct consumers and massive enterprise contracts.' }
              ].map((feature, i) => (
                <div key={i} className="rounded-[1.5rem] bg-white/80 border border-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 mb-5">
                    <feature.icon className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-2">{feature.title}</h3>
                  <p className="text-sm text-emerald-800/70 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Core Values Section */}
      <section className="container-custom pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-emerald-950 mb-6">Our Core Values</h2>
          <p className="text-lg text-emerald-800/70 font-medium">The foundational principles that guide our global enterprise.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Transparency", icon: FiSearch },
            { title: "Innovation", icon: FiTrendingUp },
            { title: "Excellence", icon: FiAward },
            { title: "Community", icon: FiHeart }
          ].map((val, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-md border border-emerald-100 rounded-3xl p-8 text-center hover:bg-white transition-colors shadow-sm">
              <val.icon className="text-4xl text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-emerald-950">{val.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Government Registration Section */}
      <section className="container-custom pb-24 relative z-10">
        <div className="rounded-[3rem] bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md shrink-0 border border-emerald-100 relative z-10">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India Emblem" className="h-14 w-14 opacity-90" />
             <FiShield className="text-emerald-100 text-4xl absolute -z-10" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              <FiShield className="text-emerald-500" />
              Verified & Registered
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mb-3">Officially Registered Enterprise</h2>
            <p className="text-lg text-emerald-800/80 font-medium max-w-2xl">
              Our platform operates with absolute compliance and is officially recognized and registered, ensuring trust, legality, and global authenticity.
            </p>
            <div className="mt-6 inline-flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 bg-white px-5 py-3 sm:px-6 rounded-xl border border-emerald-200 shadow-sm text-sm sm:text-base">
              <span className="text-emerald-900 font-bold">UDYAM REGISTRATION CERTIFICATE</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-600 font-extrabold tracking-wide">UDYAM-BR-12-0049000</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Global CTA Section */}
      <section className="container-custom">
        <div className="rounded-[3rem] bg-gradient-to-br from-emerald-800 to-emerald-950 px-6 py-20 text-center text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-6 text-yellow-50">Be Part of Our Global Growth</h2>
            <p className="text-lg text-emerald-100/90 mb-12 leading-relaxed">
              Whether you are a consumer looking for top-tier digital services, or an enterprise wanting to scale your reach globally, our ecosystem is built for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/vendors" className="rounded-2xl bg-yellow-400 px-8 py-4 font-bold text-emerald-950 shadow-lg transition hover:bg-yellow-300 hover:-translate-y-1">
                Explore Enterprise Network
              </Link>
              <Link href="/register?type=vendor" className="rounded-2xl border border-emerald-400/50 bg-emerald-800/50 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-emerald-700/50 hover:-translate-y-1">
                Register Your Business
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
