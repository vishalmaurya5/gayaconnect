'use client';

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { FiPhone, FiMail, FiMapPin, FiShield, FiMap } from 'react-icons/fi';

export default function Footer() {
  const { openSubscriptionModal } = useAuth();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <style>
          {`
              @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
              .geist-font * {
                  font-family: "Geist", sans-serif;
              }
          `}
      </style>
      {/* Platform Guide Section - Distinct Design */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-sora font-extrabold text-slate-900 mb-4 tracking-tight">How Gaya Seva Works</h3>
            <p className="text-slate-500 text-[15px] max-w-2xl mx-auto">Your simple guide to navigating our local platform, connecting with vendors, and managing your services effectively.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 shadow-inner">
                <FiShield size={24} strokeWidth={2.5} />
              </div>
              <h4 className="text-slate-900 font-bold mb-3 text-[15px] font-sora">User & Worker Accounts</h4>
              <p className="text-slate-500 text-[13.5px] leading-relaxed">
                Register as a Local Worker and log in with your phone number. Your worker profile automatically links to your User Account for easy, unified management.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 shadow-inner">
                <FiMap size={24} strokeWidth={2.5} />
              </div>
              <h4 className="text-slate-900 font-bold mb-3 text-[15px] font-sora">Posters & Offers</h4>
              <p className="text-slate-500 text-[13.5px] leading-relaxed">
                Registered Vendors can easily publish exclusive Offers and vivid Posters (Banners) directly from their dashboard to attract targeted local customers.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 text-orange-600 shadow-inner">
                <FiMapPin size={24} strokeWidth={2.5} />
              </div>
              <h4 className="text-slate-900 font-bold mb-3 text-[15px] font-sora">Find Local Services</h4>
              <p className="text-slate-500 text-[13.5px] leading-relaxed">
                Instantly search our comprehensive directory for top-rated vendors, compare exciting local deals, and browse verified workforce professionals across Gaya.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 text-teal-600 shadow-inner">
                <FiPhone size={24} strokeWidth={2.5} />
              </div>
              <h4 className="text-slate-900 font-bold mb-3 text-[15px] font-sora">Unlock Contacts</h4>
              <p className="text-slate-500 text-[13.5px] leading-relaxed">
                Subscribe to our premium plan to instantly unlock direct contact numbers for thousands of verified vendors and local workers to fulfill your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer - New Template */}
      <div className='bg-black pt-20 px-4 geist-font'>
          <footer className="bg-white w-full max-w-[1350px] mx-auto text-black pt-8 lg:pt-12 px-4 sm:px-8 md:px-16 lg:px-28 rounded-tl-3xl rounded-tr-3xl overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12">
                  
                  <div className="lg:col-span-3 space-y-6">
                      <Link href="/" className="block">
                          <div className="flex items-center gap-3">
                              <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Logo" className="w-9 h-9 object-cover rounded-xl shadow-sm border border-slate-100" />
                              <div className="font-sora text-3xl font-extrabold tracking-tight">
                                  <span className="text-black">Gaya</span>
                                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">Seva</span>
                              </div>
                          </div>
                      </Link>
                      <p className="text-sm/6 text-neutral-600 max-w-96">
                          Your premium local discovery platform for Gaya &amp; Bodh Gaya. Find trusted services, vendors, deals, and local workers all in one place.
                      </p>
                      
                      <button onClick={openSubscriptionModal} className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-3 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/30 w-max">
                        Subscribe Premium
                        <span className="bg-white/20 rounded px-2 py-0.5 text-xs">₹11 / mo</span>
                      </button>

                      <div className="flex flex-col gap-3 order-1 md:order-2 pt-4">
                          <a href="tel:+919117588242" className="flex items-center gap-2 text-neutral-600 hover:text-emerald-500 transition-colors w-max">
                              <FiPhone size={18} /> <span className="text-sm font-medium">+91 91175 88242</span>
                          </a>
                          <a href="tel:+918544491413" className="flex items-center gap-2 text-neutral-600 hover:text-emerald-500 transition-colors w-max">
                              <FiPhone size={18} /> <span className="text-sm font-medium">+91 85444 91413</span>
                          </a>
                          <a href="mailto:thegayaseva@gmail.com" className="flex items-center gap-2 text-neutral-600 hover:text-emerald-500 transition-colors w-max">
                              <FiMail size={18} /> <span className="text-sm font-medium">thegayaseva@gmail.com</span>
                          </a>
                          <a href="mailto:supportgayaseva@gmail.com" className="flex items-center gap-2 text-neutral-600 hover:text-emerald-500 transition-colors w-max">
                              <FiMail size={18} /> <span className="text-sm font-medium">supportgayaseva@gmail.com</span>
                          </a>
                      </div>
                  </div>

                  <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-28 items-start">
                      {/* Explore */}
                      <div>
                          <h3 className="font-medium text-sm mb-4 uppercase tracking-wider text-black">Explore</h3>
                          <ul className="space-y-3 text-sm text-neutral-600">
                              <li><Link href="/vendors" className="hover:text-emerald-600 transition-colors">Vendors</Link></li>
                              <li><Link href="/offers" className="hover:text-emerald-600 transition-colors">Offers & deals</Link></li>
                              <li><Link href="/labour" className="hover:text-emerald-600 transition-colors">Local Workforce</Link></li>
                              <li><Link href="/services" className="hover:text-emerald-600 transition-colors">Services</Link></li>
                              <li><Link href="/hotels" className="hover:text-emerald-600 transition-colors">Hotels</Link></li>
                          </ul>
                      </div>

                      {/* For Vendors */}
                      <div>
                          <h3 className="font-medium text-sm mb-4 uppercase tracking-wider text-black">For Vendors</h3>
                          <ul className="space-y-3 text-sm text-neutral-600">
                              <li><Link href="/vendor/register" className="hover:text-emerald-600 transition-colors">Register Business</Link></li>
                              <li><Link href="/vendor/offers" className="hover:text-emerald-600 transition-colors">Post an Offer</Link></li>
                              <li><Link href="/vendor/banners" className="hover:text-emerald-600 transition-colors">Banner Advertising</Link></li>
                              <li><Link href="/vendor/dashboard" className="hover:text-emerald-600 transition-colors">Vendor Dashboard</Link></li>
                              <li><Link href="/pricing" className="hover:text-emerald-600 transition-colors">Pricing & Plans</Link></li>
                          </ul>
                      </div>

                      {/* Company */}
                      <div className="col-span-2 md:col-span-1">
                          <h3 className="font-medium text-sm mb-4 uppercase tracking-wider text-black">Company</h3>
                          <ul className="space-y-3 text-sm text-neutral-600">
                              <li><Link href="/about" className="hover:text-emerald-600 transition-colors">About</Link></li>
                              <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy policy</Link></li>
                              <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms of service</Link></li>
                              <li><a href="mailto:thegayaseva@gmail.com" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
                          </ul>
                      </div>
                  </div>
              </div>

              <div className="max-w-7xl mx-auto mt-12 pt-4 border-t border-neutral-300 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} GayaSeva. Premium Local Discovery.</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full text-neutral-600 text-xs font-medium"><FiShield className="text-emerald-500" /> 100% Secure Payments</span>
                    <span className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full text-neutral-600 text-xs font-medium"><FiMap className="text-emerald-500" /> Proudly in Gaya, Bihar</span>
                  </div>
              </div>
              <div className="relative">
                  <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-slate-100 rounded-full blur-[100px] pointer-events-none"/>
                  <h1 className="text-center font-extrabold leading-[0.7] text-transparent bg-clip-text bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 text-[clamp(3rem,11vw,15rem)] drop-shadow-sm mt-8 pb-4" >
                      Gaya Seva
                  </h1>
              </div>
          </footer>
      </div>
  </>
  );
}