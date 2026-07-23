'use client';

import { useState } from 'react';
import { Shield, UserPlus, Briefcase, ShoppingBag, User, CheckCircle2, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RolesPermissionsPage() {
  const roles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      icon: Shield,
      color: 'indigo',
      description: 'Unrestricted full access across all platform modules, cities, and user management.',
      permissions: ['All Platform Operations', 'User & Admin Management', 'System Configuration', 'Payroll & Financial Audits']
    },
    {
      id: 'city_admin',
      name: 'City / Regional Admin',
      icon: UserPlus,
      color: 'emerald',
      description: 'Scoped administrative permissions limited strictly to their designated city territory.',
      permissions: ['City Specific Vendors', 'Local Labour Approvals', 'Regional Content & Jobs', 'Local Activity Logs']
    },
    {
      id: 'employee',
      name: 'Internal Employee / Staff',
      icon: Briefcase,
      color: 'amber',
      description: 'Staff member account with attendance check-ins, sick leave requests, and ID card access.',
      permissions: ['Punch In / Check In Attendance', 'Apply for Sick Leaves', 'Download Official 65x95mm Badge', 'Keep Notes Work Diary']
    },
    {
      id: 'vendor',
      name: 'Vendor & Service Provider',
      icon: ShoppingBag,
      color: 'purple',
      description: 'Business account to post services, products, manage orders, and receive customer reviews.',
      permissions: ['Manage Business Profile', 'Respond to Customer Reviews', 'QR Standee Downloads', 'Service Offer Postings']
    },
    {
      id: 'user',
      name: 'Registered Platform User',
      icon: User,
      color: 'blue',
      description: 'Standard public user account to browse local services, post requirements, and write reviews.',
      permissions: ['Search Local Vendors & Labour', 'Write Ratings & Reviews', 'Book Appointments', 'Manage Personal Profile']
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Roles & Permissions Matrix</h1>
        <p className="text-slate-500 text-xs mt-1">Configure user role definitions, privilege boundaries, and access rules.</p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <div key={role.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{role.name}</h3>
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">System Role</span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs font-medium leading-relaxed">{role.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">Assigned Permissions:</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {role.permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => toast.success(`Permission rules for ${role.name} updated`)}
                className="mt-6 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition"
              >
                Configure Privileges
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
