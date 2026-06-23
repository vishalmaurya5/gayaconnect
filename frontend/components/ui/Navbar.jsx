'use client'

import Link from "next/link"
import { useState } from "react"
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { UserIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, openSubscriptionModal } = useAuth()
  const pathname = usePathname()

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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-5 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="20" viewBox="0 0 20 22" fill="none">
              <ellipse cx="10" cy="8" rx="7" ry="7" fill="white" opacity="0.9" />
              <polygon points="10,22 5,14 15,14" fill="white" opacity="0.7" />
              <circle cx="10" cy="8" r="3" fill="#4338CA" />
              <line x1="10" y1="8" x2="6" y2="5.5" stroke="#4338CA" strokeWidth="1.2" />
              <line x1="10" y1="8" x2="14" y2="5.5" stroke="#4338CA" strokeWidth="1.2" />
              <line x1="10" y1="8" x2="10" y2="11.5" stroke="#4338CA" strokeWidth="1.2" />
              <circle cx="6" cy="5.5" r="1.5" fill="#4338CA" />
              <circle cx="14" cy="5.5" r="1.5" fill="#4338CA" />
              <circle cx="10" cy="11.5" r="1.5" fill="#4338CA" />
            </svg>
          </div>
          <div>
            <div className="font-sora font-bold text-lg leading-tight">
              <span className="text-indigo-600">Gaya</span>
              <span className="text-teal-600">Connect</span>
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
              Gaya District · Bihar
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/" active>Home</NavLink>
          <NavLink href="/vendors">Vendors</NavLink>
          <NavLink href="/offers">Offers <span className="ml-1 bg-teal-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">New</span></NavLink>
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/labour">Local Workforce</NavLink>
          <NavLink href="/vehicles">Rent Vehicles <span className="ml-1 bg-teal-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">New</span></NavLink>
          <NavLink href="/about">About</NavLink>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                  <span className="text-sm font-bold text-indigo-700">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span>{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 border border-red-200 rounded-lg px-4 py-1.5 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 border border-gray-300 rounded-lg px-4 py-1.5 hover:border-indigo-600 hover:text-indigo-600 transition inline-block"
              >
                Login
              </Link>
              <button 
                onClick={openSubscriptionModal}
                className="bg-indigo-600 text-white text-sm font-semibold rounded-lg px-5 py-1.5 flex items-center gap-1.5 hover:bg-indigo-700 transition"
              >
                Subscribe
                <span className="bg-white/20 rounded px-1.5 py-0.5 text-xs">₹11/mo</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2">
          <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="/vendors" onClick={() => setMobileMenuOpen(false)}>Vendors</MobileNavLink>
          <MobileNavLink href="/offers" onClick={() => setMobileMenuOpen(false)}>Offers</MobileNavLink>
          <MobileNavLink href="/services" onClick={() => setMobileMenuOpen(false)}>Services</MobileNavLink>
          <MobileNavLink href="/labour" onClick={() => setMobileMenuOpen(false)}>Local Workforce</MobileNavLink>
          <MobileNavLink href="/vehicles" onClick={() => setMobileMenuOpen(false)}>Rent Vehicles</MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                  className="w-full text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-center text-sm font-medium text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block w-full text-center text-sm font-medium text-gray-600 border border-gray-300 rounded-lg py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSubscriptionModal();
                  }}
                  className="block w-full text-center bg-indigo-600 text-white font-semibold rounded-lg py-2"
                >
                  Subscribe ₹11/mo
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function NavLink({ href, children, active = false }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
        active
          ? "text-indigo-600 bg-indigo-50"
          : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
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
      className="block py-2 text-gray-700 hover:text-indigo-600"
    >
      {children}
    </Link>
  )
}
