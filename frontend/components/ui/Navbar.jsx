'use client'

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { UserIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/components/ThemeProvider'

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return <div className="w-9 h-9" />; // Placeholder to avoid layout shift

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button 
      onClick={() => setTheme(isDark ? 'light' : 'dark')} 
      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout, openSubscriptionModal } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Topbar */}
      <div className="bg-slate-900 text-slate-300 text-center py-2 text-[11px] sm:text-xs font-medium tracking-wide">
        Limited time: Unlock all vendor contacts, offers & local workforce listings for just{" "}
        <strong className="text-white font-bold">₹11/month</strong>
        <button onClick={openSubscriptionModal} className="text-indigo-400 underline ml-2 hover:text-indigo-300 transition">
          Subscribe now &rarr;
        </button>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 w-full flex items-center justify-between px-4 lg:px-8 xl:px-12 transition-all duration-300 z-50 ${isScrolled ? "bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm py-3" : "bg-white/50 dark:bg-[#0B0F19]/50 backdrop-blur-md border-b border-transparent py-4"}`}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 bg-white overflow-hidden">
            <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center pt-0.5">
            <div className="font-extrabold text-[22px] md:text-[26px] leading-[0.9] flex items-center tracking-tight text-slate-900 dark:text-white">
              Gaya<span className="text-indigo-600 ml-0.5">Seva</span>
            </div>
            <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] mt-1 text-slate-500 dark:text-slate-400">
              Digital Gateway
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-sm">
          <NavLink href="/" currentPath={pathname}>Home</NavLink>
          <NavLink href="/vendors" currentPath={pathname}>Vendors</NavLink>
          <NavLink href="/offers" currentPath={pathname}>Offers <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">New</span></NavLink>
          <NavLink href="/services" currentPath={pathname}>Services</NavLink>
          <NavLink href="/labour" currentPath={pathname}>Workforce</NavLink>
          <NavLink href="/vehicles" currentPath={pathname}>Vehicles <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">New</span></NavLink>
          <NavLink href="/jobs" currentPath={pathname}>Jobs</NavLink>
          <NavLink href="/marketplace" currentPath={pathname}>Marketplace</NavLink>
          <NavLink href="/contact" currentPath={pathname}>Contact</NavLink>
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                  <span className="text-sm font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span>{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <button
                onClick={openSubscriptionModal}
                className="text-sm font-bold rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5"
              >
                Subscribe
                <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider">₹11/mo</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -mr-2 text-slate-800 dark:text-slate-200">
            <svg className="h-6 w-6 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-slate-900 text-base flex flex-col lg:hidden items-center justify-center gap-6 font-medium text-slate-800 dark:text-slate-100 transition-transform duration-500 z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" onClick={() => setIsMenuOpen(false)}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/vendors" onClick={() => setIsMenuOpen(false)}>Vendors</MobileNavLink>
          <MobileNavLink href="/offers" onClick={() => setIsMenuOpen(false)}>Offers</MobileNavLink>
          <MobileNavLink href="/services" onClick={() => setIsMenuOpen(false)}>Services</MobileNavLink>
          <MobileNavLink href="/labour" onClick={() => setIsMenuOpen(false)}>Workforce</MobileNavLink>
          <MobileNavLink href="/vehicles" onClick={() => setIsMenuOpen(false)}>Rent Vehicles</MobileNavLink>
          <MobileNavLink href="/jobs" onClick={() => setIsMenuOpen(false)}>Jobs</MobileNavLink>
          <MobileNavLink href="/marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</MobileNavLink>
          <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>

          <div className="flex flex-col gap-4 mt-8 w-full max-w-[240px]">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                  className="w-full text-center text-sm font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl py-3.5 flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-center text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 rounded-xl py-3.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl py-3.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openSubscriptionModal();
                  }}
                  className="block w-full text-center bg-indigo-600 text-white font-bold rounded-xl py-3.5 shadow-lg shadow-indigo-600/20"
                >
                  Subscribe ₹11/mo
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

function NavLink({ href, children, currentPath }) {
  const isActive = currentPath === href || (href !== '/' && currentPath?.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${
        isActive 
          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors tracking-tight"
    >
      {children}
    </Link>
  )
}
