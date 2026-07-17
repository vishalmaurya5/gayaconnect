'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, CheckCircle, Clock, AlertTriangle, UserPlus, FileText, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef(null);

  // Mock Notifications for Enterprise Dashboard
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Vendor Registration',
      message: 'Rajeev Kumar has registered a new hardware business.',
      time: '10 mins ago',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      unread: true,
      link: '/admin/vendors/pending'
    },
    {
      id: 2,
      title: 'Pending Verification',
      message: '5 new labour profiles require KYC approval.',
      time: '1 hour ago',
      icon: ShieldAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      unread: true,
      link: '/admin/labour'
    },
    {
      id: 3,
      title: 'Membership Expiring',
      message: 'Gaya Sweets premium membership expires in 2 days.',
      time: '3 hours ago',
      icon: Clock,
      color: 'text-rose-600',
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      unread: true,
      link: '/admin/members/renewals'
    },
    {
      id: 4,
      title: 'System Backup Complete',
      message: 'Daily automated database backup was successful.',
      time: '12 hours ago',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      unread: false,
      link: '/admin/settings'
    },
    {
      id: 5,
      title: 'New Employee Leave Request',
      message: 'Amit Sharma has requested sick leave for tomorrow.',
      time: '1 day ago',
      icon: UserPlus,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      unread: false,
      link: '/admin/employees/leave'
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const removeNotification = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const isRemovingUnread = notifications.find(n => n.id === id)?.unread;
    setNotifications(notifications.filter(n => n.id !== id));
    if (isRemovingUnread) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition relative focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0B0F19] animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in slide-in-from-top-2 opacity-100 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 py-0.5 px-2 rounded-full text-[10px] uppercase tracking-wider">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {notifications.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className={`block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative ${item.unread ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-transparent ${item.bg} ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <p className={`text-sm font-semibold truncate ${item.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {item.message}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1.5 uppercase tracking-wider">
                          {item.time}
                        </p>
                      </div>
                    </div>
                    {/* Delete button (shows on hover) */}
                    <button 
                      onClick={(e) => removeNotification(e, item.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/* Unread dot */}
                    {item.unread && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 rounded-full bg-indigo-500 group-hover:opacity-0 transition-opacity"></div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h4 className="text-slate-800 dark:text-white font-bold mb-1">All Caught Up!</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">You have no new notifications right now.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-center">
              <Link 
                href="/admin/activity" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest"
              >
                View Activity Timeline
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
