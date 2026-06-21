'use client';

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';

export default function Footer() {
  const { openSubscriptionModal } = useAuth();

  return (
    <footer className="bg-slate-900 text-white/70 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-sora text-xl font-bold mb-3">
              <span className="text-indigo-300">Gaya</span>
              <span className="text-teal-300">Connect</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Your trusted local discovery platform for Gaya &amp; Bodh Gaya district. Find services, vendors, deals, and daily workers — all in one place.
            </p>
            <button onClick={openSubscriptionModal} className="mt-4 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition">
              Subscribe now
              <span className="bg-white/20 rounded px-1.5 py-0.5 text-xs">₹11 / month</span>
            </button>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vendors" className="hover:text-white transition">Vendors</Link></li>
              <li><Link href="/offers" className="hover:text-white transition">Offers & deals</Link></li>
              <li><Link href="/labour" className="hover:text-white transition">Daily labour</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition">Hotels</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">For vendors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vendor/register" className="hover:text-white transition">Register business</Link></li>
              <li><Link href="/vendor/offers" className="hover:text-white transition">Post an offer</Link></li>
              <li><Link href="/vendor/banners" className="hover:text-white transition">Banner advertising</Link></li>
              <li><Link href="/vendor/dashboard" className="hover:text-white transition">Vendor dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of use</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© 2025 GayaConnect · Made with ♥ in Gaya, Bihar</p>
          <div className="flex gap-3">
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> Secure payments</span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg> Gaya district</span>
          </div>
        </div>
      </div>
    </footer>
  );
}