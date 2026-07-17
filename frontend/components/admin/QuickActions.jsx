'use client';

import { useState } from 'react';
import { Plus, Users, ShoppingBag, Briefcase, FileText, X, Award, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const actions = [
    { name: 'Add Vendor', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', path: '/admin/vendors/pending' },
    { name: 'Register Labour', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800', path: '/admin/labour' },
    { name: 'Post Job', icon: Briefcase, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800', path: '/admin/jobs' },
    { name: 'New Employee', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800', path: '/admin/employees/create' },
    { name: 'Create Member', icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800', path: '/admin/members/manage' },
    { name: 'Generate Cert.', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800', path: '/admin/certificates/vendor' },
  ];

  const handleAction = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Menu */}
      <div className={`fixed bottom-24 right-6 sm:bottom-24 sm:right-8 z-50 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 w-64 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Quick Create</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action, idx) => (
              <button 
                key={idx}
                onClick={() => handleAction(action.path)}
                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-2 text-center group"
              >
                <div className={`p-2 rounded-lg border transition-transform group-hover:scale-110 ${action.bg}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all z-50 focus:outline-none"
        title="Quick Actions"
      >
        {isOpen ? <X className="w-6 h-6 animate-in spin-in-180 duration-200" /> : <Plus className="w-6 h-6 animate-in spin-in-180 duration-200" />}
      </button>
    </>
  );
}
