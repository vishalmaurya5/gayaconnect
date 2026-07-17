'use client';

import { useContext } from 'react';
import { AdminContext } from '@/app/(dashboard)/admin/layout';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * RoleGuard Component
 * Wraps around pages or sections to restrict access based on Admin role.
 * 
 * @param {Array<string>} allowedRoles - Array of roles permitted (e.g., ['SUPER_ADMIN', 'MANAGER'])
 * @param {React.ReactNode} children - Content to render if authorized
 */
export default function RoleGuard({ allowedRoles = [], children }) {
  const admin = useContext(AdminContext);

  // If loading or context isn't fully ready, we could show a loader. 
  // For now, if there is no admin, we assume access is denied.
  if (!admin || !admin.role) {
    return null; 
  }

  const isAuthorized = allowedRoles.includes(admin.role) || admin.role === 'SUPER_ADMIN';

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-[#0B0F19]/50 rounded-3xl border border-slate-200 dark:border-slate-800 m-4">
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-200 dark:border-rose-500/20">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Access Restricted
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg mb-8 leading-relaxed">
          You do not have the required permission level ({allowedRoles.join(' or ')}) to view this module. Please contact a Super Administrator if you need access.
        </p>
        <Link 
          href="/admin" 
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
