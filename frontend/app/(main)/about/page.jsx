import Link from 'next/link'
import { FiSearch, FiShield, FiTrendingUp, FiMapPin, FiSmartphone, FiTarget, FiAlertCircle, FiBriefcase, FiHeart } from 'react-icons/fi'

export const metadata = {
  title: 'About Us | Gaya Seva',
  description: 'Learn about Gaya Seva, our mission, the problems we solve, and how we are digitizing local businesses in Gaya.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf3] via-[#f4fce8] to-[#e8f5e9] selection:bg-emerald-500 selection:text-white pb-20 font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-emerald-200/50 text-emerald-800 text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
            <FiHeart className="text-emerald-500 animate-pulse" />
            About Gaya Seva
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-emerald-950 mb-8 leading-tight">
            Empowering Gaya's <br className="hidden md:block"/> Digital Revolution
          </h1>
          <p className="text-xl md:text-2xl text-emerald-800/80 leading-relaxed max-w-3xl mx-auto font-medium">
            Bridging the gap between local businesses and customers, building a beautifully centralized, reliable digital ecosystem for the holy city of Gaya.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative z-20 -mt-16 container-custom">
        <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-yellow-100/50 shadow-xl shadow-emerald-900/5 p-8 md:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                  <FiAlertCircle className="text-2xl" />
                </span>
                <h2 className="text-3xl font-extrabold text-emerald-950">The Problem</h2>
              </div>
              <p className="text-lg text-emerald-900/70 leading-relaxed mb-8 font-medium">
                For years, finding reliable local services in Gaya has relied heavily on scattered word-of-mouth, outdated directories, or physically searching the markets in the heat.
              </p>
              <ul className="space-y-5">
                {[
                  'Customers struggle to find verified local professionals quickly.',
                  'Small businesses and vendors lack affordable, beautiful digital visibility.',
                  'No central platform exists dedicated entirely to Gaya\'s unique market.',
                  'Trust issues arise due to a lack of transparent business profiles.'
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
                  Lost opportunities. Customers waste precious time searching for simple services, while excellent local vendors sit idle without a way to reach their potential audience. The local economy remains disconnected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Aim Section */}
      <section className="container-custom py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Our Mission</p>
          <h2 className="text-4xl font-extrabold text-emerald-950 mb-6">Why Gaya Seva is Necessary</h2>
          <p className="text-lg text-emerald-800/70 leading-relaxed font-medium">
            Our aim is simple but ambitious: to organize Gaya's local business landscape into a beautifully accessible, highly functional, and soothing digital directory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FiTarget,
              title: 'Centralized Discovery',
              description: 'To provide a single, calm platform where anyone can find cars, bikes, tractors, local stores, mechanics, and daily services instantly.',
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              border: 'border-blue-100/50'
            },
            {
              icon: FiTrendingUp,
              title: 'Empowering Vendors',
              description: 'To give every local business, big or small, a premium profile, dashboard, and the elegant tools they need to grow their customer base.',
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200/50'
            },
            {
              icon: FiShield,
              title: 'Building Trust',
              description: 'To ensure authenticity by providing transparent business details, contact information, and beautifully verified vendor identities.',
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

      {/* Platform Details Section */}
      <section className="container-custom pb-24 relative z-10">
        <div className="rounded-[3rem] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-yellow-200/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center relative z-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Platform Details</p>
              <h2 className="text-4xl font-extrabold text-emerald-950 mb-6">How It Works</h2>
              <p className="text-lg text-emerald-800/70 leading-relaxed mb-10 font-medium">
                Gaya Seva is designed with state-of-the-art technology to ensure speed, security, and a visually soothing experience for everyone in the city.
              </p>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:shadow-emerald-500/40">
                Join the Network
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: FiSearch, title: 'Smart Search', desc: 'Find businesses by specific categories like "Car Part Store" or "Tractor Mechanics" effortlessly.' },
                { icon: FiBriefcase, title: 'Vendor Dashboards', desc: 'Business owners get exclusive, beautiful dashboards to manage their details, offers, and banners.' },
                { icon: FiSmartphone, title: 'Mobile First', desc: 'A seamless, app-like experience optimized perfectly for mobile phone users on the go.' },
                { icon: FiMapPin, title: 'Hyper-Local', desc: 'Everything is tailored specifically to the geography, culture, and market of Gaya.' }
              ].map((feature, i) => (
                <div key={i} className="rounded-[1.5rem] bg-white/80 border border-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-emerald-50 text-emerald-600 mb-5">
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

      {/* CTA Section */}
      <section className="container-custom">
        <div className="rounded-[3rem] bg-gradient-to-br from-emerald-800 to-emerald-950 px-6 py-20 text-center text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-6 text-yellow-50">Be Part of Gaya's Growth</h2>
            <p className="text-lg text-emerald-100/90 mb-12 leading-relaxed">
              Whether you are a resident looking for quick services, or a business owner wanting to modernize your reach, Gaya Seva is your platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/vendors" className="rounded-2xl bg-yellow-400 px-8 py-4 font-bold text-emerald-950 shadow-lg transition hover:bg-yellow-300 hover:-translate-y-1">
                Explore Vendors
              </Link>
              <Link href="/register?type=vendor" className="rounded-2xl border border-emerald-400/50 bg-emerald-800/50 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-emerald-700/50 hover:-translate-y-1">
                Register as Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
