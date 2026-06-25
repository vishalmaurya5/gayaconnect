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
      {/* Platform Guide Section - Distinct Design */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-sora font-extrabold text-slate-900 mb-4 tracking-tight">How Gaya Connect Works</h3>
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

      {/* Main Footer */}
      <footer className="bg-[#0A0F1C] text-slate-300 pt-16 pb-8 border-t border-slate-800/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="font-sora text-2xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Gaya</span>
              <span className="text-white">Connect</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Your premium local discovery platform for Gaya &amp; Bodh Gaya. Find trusted services, vendors, deals, and local workers all in one place.
            </p>
            <button onClick={openSubscriptionModal} className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-3 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/30">
              Subscribe Premium
              <span className="bg-white/20 rounded px-2 py-0.5 text-xs">₹11 / mo</span>
            </button>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">Explore</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/vendors" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 hover:bg-emerald-500 transition-colors"></span> Vendors</Link></li>
              <li><Link href="/offers" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 hover:bg-emerald-500 transition-colors"></span> Offers & deals</Link></li>
              <li><Link href="/labour" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 hover:bg-emerald-500 transition-colors"></span> Local Workforce</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 hover:bg-emerald-500 transition-colors"></span> Services</Link></li>
              <li><Link href="/hotels" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 hover:bg-emerald-500 transition-colors"></span> Hotels</Link></li>
            </ul>
          </div>

          {/* Vendor Links */}
          <div>
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">For Vendors</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/vendor/register" className="text-slate-400 hover:text-emerald-400 transition-colors">Register Business</Link></li>
              <li><Link href="/vendor/offers" className="text-slate-400 hover:text-emerald-400 transition-colors">Post an Offer</Link></li>
              <li><Link href="/vendor/banners" className="text-slate-400 hover:text-emerald-400 transition-colors">Banner Advertising</Link></li>
              <li><Link href="/vendor/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">Vendor Dashboard</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-emerald-400 transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">Contact Support</h4>
            <div className="space-y-3.5 text-sm font-medium">
              <a href="tel:+919117588242" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-emerald-500/20 transition-colors"><FiPhone className="text-emerald-500" /></div>
                +91 9117588242
              </a>
              <a href="tel:+918544491413" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-emerald-500/20 transition-colors"><FiPhone className="text-emerald-500" /></div>
                +91 8544491413
              </a>
              <a href="mailto:support@gayaconnect.in" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-emerald-500/20 transition-colors"><FiMail className="text-emerald-500" /></div>
                support@gayaconnect.in
              </a>
              <a href="mailto:gayaconnectin@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors group">
                <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-emerald-500/20 transition-colors"><FiMail className="text-emerald-500" /></div>
                <span className="truncate">gayaconnectin@gmail.com</span>
              </a>
            </div>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-800/60 text-xs font-semibold">
              <Link href="/about" className="text-slate-500 hover:text-emerald-400 transition-colors">About</Link>
              <Link href="/privacy" className="text-slate-500 hover:text-emerald-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-slate-500 hover:text-emerald-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} GayaConnect. Premium Local Discovery.</p>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full text-slate-400"><FiShield className="text-emerald-500" /> 100% Secure Payments</span>
            <span className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full text-slate-400"><FiMap className="text-emerald-500" /> Proudly in Gaya, Bihar</span>
          </div>
        </div>
      </div>
    </footer>
  </>
  );
}