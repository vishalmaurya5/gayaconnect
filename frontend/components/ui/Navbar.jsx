'use client'

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { UserIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout, openSubscriptionModal } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Topbar */}
      <div className="bg-indigo-700 text-white text-center py-1.5 text-xs">
        Limited time: Unlock all vendor contacts, offers & local workforce listings for just{" "}
        <strong className="text-amber-300">₹11/month</strong>
        <button onClick={openSubscriptionModal} className="text-indigo-200 underline ml-1.5 hover:text-white transition">
          Subscribe now →
        </button>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 w-full flex items-center justify-between px-4 lg:px-8 xl:px-12 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-sm text-gray-700 backdrop-blur-xl border-b border-gray-200/60 py-3" : "bg-indigo-600 border-b border-white/30 shadow-[0_2px_20px_rgba(255,255,255,0.3)] py-4 md:py-5"}`}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 shadow-sm border-2 ${isScrolled ? 'border-indigo-100 bg-white' : 'border-white/20 bg-white/90'}`}>
            <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Icon" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-sora text-[22px] leading-none flex items-center tracking-tighter drop-shadow-sm">
              <span className={`font-black transition-colors duration-300 ${isScrolled ? 'text-slate-800' : 'text-white'}`}>Gaya</span>
              <span className={`font-bold italic transition-colors duration-300 ${isScrolled ? 'text-indigo-600' : 'text-amber-400'}`}>Seva</span>
            </div>
            <div className={`text-[9px] uppercase tracking-widest font-black transition-colors duration-300 ${isScrolled ? 'text-amber-500' : 'text-amber-300 drop-shadow-md'}`}>
              Grow · Collaborate · Earn
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-3 lg:gap-6">
          <NavLink href="/" isScrolled={isScrolled}>Home</NavLink>
          <NavLink href="/explore" isScrolled={isScrolled}>Explore Gaya <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isScrolled ? 'bg-orange-500 text-white' : 'bg-white text-orange-500'}`}>New</span></NavLink>
          <NavLink href="/vendors" isScrolled={isScrolled}>Vendors</NavLink>
          <NavLink href="/offers" isScrolled={isScrolled}>Offers <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isScrolled ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}>New</span></NavLink>
          <NavLink href="/services" isScrolled={isScrolled}>Services</NavLink>
          <NavLink href="/labour" isScrolled={isScrolled}>Local Workforce</NavLink>
          <NavLink href="/vehicles" isScrolled={isScrolled}>Rent Vehicles <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isScrolled ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'}`}>New</span></NavLink>
          <NavLink href="/jobs-and-sales" isScrolled={isScrolled}>Jobs & Sales</NavLink>
          <NavLink href="/about" isScrolled={isScrolled}>About</NavLink>
        </div>

        {/* Desktop Right */}
        <div className="hidden xl:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-white/80'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isScrolled ? 'bg-indigo-100 border-indigo-200' : 'bg-white/20 border-white/30'}`}>
                  <span className={`text-sm font-bold ${isScrolled ? 'text-indigo-700' : 'text-white'}`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span>{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className={`text-sm font-bold border rounded-full px-5 py-2 transition-all duration-300 ${isScrolled ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`text-sm font-bold border rounded-full px-6 py-2.5 transition-all duration-300 ${isScrolled ? 'border-gray-300 text-gray-700 hover:border-indigo-600 hover:text-indigo-600' : 'border-white/30 text-white hover:border-white'}`}
              >
                Login
              </Link>
              <button 
                onClick={openSubscriptionModal}
                className={`text-sm font-bold rounded-full px-6 py-2.5 flex items-center gap-1.5 transition-all duration-300 ${isScrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-md'}`}
              >
                Subscribe
                <span className={`${isScrolled ? 'bg-white/20' : 'bg-indigo-600/10 text-indigo-800'} rounded px-1.5 py-0.5 text-xs`}>₹11/mo</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 xl:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -mr-2">
            <svg className={`h-6 w-6 cursor-pointer transition-colors ${isScrolled ? "text-gray-800" : "text-white"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col xl:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <button className="absolute top-6 right-6 p-2" onClick={() => setIsMenuOpen(false)}>
                <svg className="h-7 w-7 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/explore" onClick={() => setIsMenuOpen(false)}>Explore Gaya 🌟</MobileNavLink>
            <MobileNavLink href="/vendors" onClick={() => setIsMenuOpen(false)}>Vendors</MobileNavLink>
            <MobileNavLink href="/offers" onClick={() => setIsMenuOpen(false)}>Offers</MobileNavLink>
            <MobileNavLink href="/services" onClick={() => setIsMenuOpen(false)}>Services</MobileNavLink>
            <MobileNavLink href="/labour" onClick={() => setIsMenuOpen(false)}>Local Workforce</MobileNavLink>
            <MobileNavLink href="/vehicles" onClick={() => setIsMenuOpen(false)}>Rent Vehicles</MobileNavLink>
            <MobileNavLink href="/jobs-and-sales" onClick={() => setIsMenuOpen(false)}>Jobs & Sales</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>

            <div className="flex flex-col gap-4 mt-4 w-full max-w-[200px]">
              {user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                    className="w-full text-center text-[15px] font-bold text-indigo-700 border border-indigo-200 bg-indigo-50 rounded-full py-3 flex items-center justify-center gap-2"
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
                    className="w-full text-center text-[15px] font-bold text-red-600 border border-red-200 rounded-full py-3 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block w-full text-center text-[15px] font-bold text-gray-700 border border-gray-300 rounded-full py-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      openSubscriptionModal();
                    }}
                    className="block w-full text-center bg-indigo-600 text-white font-bold rounded-full py-3 shadow-md"
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

function NavLink({ href, children, isScrolled }) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-0.5 text-[14px] font-medium transition-colors ${
        isScrolled ? "text-gray-700 hover:text-indigo-600" : "text-white/90 hover:text-white"
      }`}
    >
      <div className="flex items-center">
          {children}
      </div>
      <div className={`${isScrolled ? "bg-indigo-600" : "bg-white"} h-[2px] w-0 group-hover:w-full transition-all duration-300 rounded-full`} />
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 text-[18px] font-bold text-gray-800 hover:text-indigo-600 transition-colors"
    >
      {children}
    </Link>
  )
}
