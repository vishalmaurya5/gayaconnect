'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { toggleDarkMode } from '../../store/slices/uiSlice';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const activeClass = (path) => pathname === path ? 'text-blue-600 font-semibold' : 'hover:text-blue-600';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600">Gaya Connect</Link>
        <div className="hidden md:flex gap-4">
          <Link href="/vendors" className={activeClass('/vendors')}>Vendors</Link>
          <Link href="/community" className={activeClass('/community')}>Community</Link>
          {user?.role === 'vendor' && <Link href="/vendor/dashboard" className={activeClass('/vendor/dashboard')}>Vendor</Link>}
          {user?.role === 'admin' && <Link href="/admin/dashboard" className={activeClass('/admin/dashboard')}>Admin</Link>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => dispatch(toggleDarkMode())} className="p-2 rounded border border-slate-300 dark:border-slate-700">
            {darkMode ? <SunIcon className="h-5" /> : <MoonIcon className="h-5" />}
          </button>
          {user ? (
            <span className="text-sm">Hi, {user.name}</span>
          ) : (
            <Link href="/login" className="text-sm bg-blue-600 text-white px-3 py-2 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
