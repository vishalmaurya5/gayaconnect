'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, Bell, User, Settings, LogOut, Menu, X, ChevronDown, ChevronRight,
  LayoutDashboard, Users, Briefcase, UserCheck, ShoppingBag, Wrench, Car, 
  Store, Globe, Building2, Megaphone, DollarSign, MessageSquare,
  FileText, Award, BarChart3, Sliders, Shield, Sun, Moon, Link as LinkIcon, ShieldAlert, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

import GlobalSearch from '@/components/admin/GlobalSearch';
import QuickActions from '@/components/admin/QuickActions';
import NotificationCenter from '@/components/admin/NotificationCenter';

export const AdminContext = createContext({ role: 'ADMIN' });

const SIDEBAR_STRUCTURE = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Overview', path: '/admin' },
      { name: 'Analytics', path: '/admin/analytics' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Live Statistics', path: '/admin/live-stats' },
      { name: 'Recent Activity', path: '/admin/activity' },
    ]
  },
  {
    title: 'User Management',
    icon: Users,
    items: [
      { name: 'All Users', path: '/admin/users' },
      { name: 'System Admins', path: '/admin/users/admins', superAdminOnly: true },
      { name: 'Roles & Permissions', path: '/admin/roles' },
      { name: 'Employees', path: '/admin/employees', superAdminOnly: true },
      { name: 'Active Members', path: '/admin/members' },
      { name: 'Pending Verification', path: '/admin/users/pending' },
      { name: 'Blocked Users', path: '/admin/users/blocked' },
      { name: 'Online Users', path: '/admin/users/online' },
      { name: 'Login History', path: '/admin/users/history' },
    ]
  },
  {
    title: 'Employee Management',
    icon: Briefcase,
    superAdminOnly: true,
    items: [
      { name: 'Create Employee', path: '/admin/employees/create' },
      { name: 'Departments', path: '/admin/employees/departments' },
      { name: 'Designation', path: '/admin/employees/designations' },
      { name: 'Attendance', path: '/admin/employees/attendance' },
      { name: 'Salary Status', path: '/admin/employees/salary' },
      { name: 'Performance', path: '/admin/employees/performance' },
      { name: 'Leave Management', path: '/admin/employees/leave' },
      { name: 'Documents', path: '/admin/employees/documents' },
      { name: 'Identity Cards', path: '/admin/employees/id-cards' },
    ]
  },
  {
    title: 'Active Members',
    icon: UserCheck,
    items: [
      { name: 'Manage Members', path: '/admin/members/manage' },
      { name: 'Membership Plans', path: '/admin/members/plans' },
      { name: 'Renewals', path: '/admin/members/renewals' },
      { name: 'Payment History', path: '/admin/members/payments' },
    ]
  },
  {
    title: 'Vendor Management',
    icon: ShoppingBag,
    items: [
      { name: 'Vendor Directory', path: '/admin/vendors' },
      { name: 'Pending Vendors', path: '/admin/vendors/pending' },
      { name: 'Verified Vendors', path: '/admin/vendors/verified' },
      { name: 'Rejected Vendors', path: '/admin/vendors/rejected' },
      { name: 'Vendor Categories', path: '/admin/dashboard/categories' },
      { name: 'Vendor Ratings', path: '/admin/vendors/ratings' },
      { name: 'Generate Certificate', path: '/admin/vendors/certificate' },
    ]
  },
  {
    title: 'Labour Management',
    icon: Wrench,
    items: [
      { name: 'Labour Directory', path: '/admin/labour' },
      { name: 'Verified Labour', path: '/admin/labour/verified' },
      { name: 'Daily Labour', path: '/admin/labour/daily' },
      { name: 'Attendance', path: '/admin/labour/attendance' },
      { name: 'Payments', path: '/admin/labour/payments' },
    ]
  },
  {
    title: 'Vehicle Management',
    icon: Car,
    items: [
      { name: 'Private Vehicles', path: '/admin/vehicles' },
      { name: 'Commercial Vehicles', path: '/admin/vehicles/commercial' },
      { name: 'Drivers', path: '/admin/vehicles/drivers' },
      { name: 'Bookings', path: '/admin/vehicles/bookings' },
      { name: 'Insurance & Fitness', path: '/admin/vehicles/docs' },
    ]
  },
  {
    title: 'Jobs Management',
    icon: Briefcase,
    items: [
      { name: 'Dashboard', path: '/admin/jobs' },
      { name: 'All Jobs', path: '/admin/jobs/all' },
      { name: 'Pending Jobs', path: '/admin/jobs/pending' },
      { name: 'Approved Jobs', path: '/admin/jobs/approved' },
      { name: 'Rejected Jobs', path: '/admin/jobs/rejected' },
      { name: 'Featured Jobs', path: '/admin/jobs/featured' },
      { name: 'Job Categories', path: '/admin/jobs/categories' },
      { name: 'Employers', path: '/admin/jobs/employers' },
      { name: 'Applications', path: '/admin/jobs/applications' },
      { name: 'Applicants', path: '/admin/jobs/applicants' },
      { name: 'Analytics', path: '/admin/jobs/analytics' },
      { name: 'Reports', path: '/admin/jobs/reports' },
      { name: 'Settings', path: '/admin/jobs/settings' },
    ]
  },
  {
    title: 'Marketplace Management',
    icon: Store,
    items: [
      { name: 'Dashboard', path: '/admin/marketplace' },
      { name: 'Products', path: '/admin/marketplace/products' },
      { name: 'Services', path: '/admin/marketplace/services' },
      { name: 'Buy Listings', path: '/admin/marketplace/buy' },
      { name: 'Sell Listings', path: '/admin/marketplace/sell' },
      { name: 'Categories', path: '/admin/marketplace/categories' },
      { name: 'Pending Listings', path: '/admin/marketplace/pending' },
      { name: 'Approved Listings', path: '/admin/marketplace/approved' },
      { name: 'Rejected Listings', path: '/admin/marketplace/rejected' },
      { name: 'Featured Listings', path: '/admin/marketplace/featured' },
      { name: 'Seller Management', path: '/admin/marketplace/sellers' },
      { name: 'Reports', path: '/admin/marketplace/reports' },
      { name: 'Analytics', path: '/admin/marketplace/analytics' },
      { name: 'Settings', path: '/admin/marketplace/settings' },
    ]
  },
  {
    title: 'Community',
    icon: Globe,
    items: [
      { name: 'Community Dashboard', path: '/admin/community' },
      { name: 'Community Posts', path: '/admin/community/posts' },
      { name: 'Pending Posts', path: '/admin/community/pending' },
      { name: 'Moderation', path: '/admin/community/moderation' },
    ]
  },
  {
    title: 'Business Directory',
    icon: Building2,
    items: [
      { name: 'Businesses', path: '/admin/businesses' },
      { name: 'Categories', path: '/admin/businesses/categories' },
      { name: 'Verified Businesses', path: '/admin/businesses/verified' },
    ]
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    items: [
      { name: 'Banner Management', path: '/admin/banners' },
      { name: 'Offers', path: '/admin/offers' },
      { name: 'Popup Management', path: '/admin/popup' },
      { name: 'Email Campaigns', path: '/admin/marketing/email' },
      { name: 'Push Notifications', path: '/admin/marketing/push' },
    ]
  },
  {
    title: 'Finance',
    icon: DollarSign,
    items: [
      { name: 'Dashboard', path: '/admin/finance' },
      { name: 'Create Payment', path: '/admin/finance/create-payment' },
      { name: 'Manual Payments', path: '/admin/finance/manual-payments' },
      { name: 'Invoices', path: '/admin/finance/invoices' },
      { name: 'Receipts', path: '/admin/finance/receipts' },
      { name: 'Transactions', path: '/admin/finance/transactions' },
      { name: 'Service Pricing', path: '/admin/finance/pricing' },
      { name: 'Payment Reports', path: '/admin/finance/reports' },
      { name: 'Customers', path: '/admin/finance/customers' },
      { name: 'Settings', path: '/admin/finance/settings', superAdminOnly: true }
    ]
  },
  {
    title: 'Reviews',
    icon: MessageSquare,
    items: [
      { name: 'Reviews', path: '/admin/reviews' },
      { name: 'Feedbacks', path: '/admin/feedbacks' },
      { name: 'Support Tickets', path: '/admin/support' },
      { name: 'Call Logs', path: '/admin/calls' },
    ]
  },
  {
    title: 'Content Management',
    icon: FileText,
    superAdminOnly: true,
    items: [
      { name: 'Homepage', path: '/admin/content/homepage' },
      { name: 'Explore & City Tourism', path: '/admin/content/explore' },
      { name: 'Blogs', path: '/admin/content/blogs' },
      { name: 'SEO', path: '/admin/content/seo' },
      { name: 'Media Library', path: '/admin/content/media' },
      { name: 'FAQ', path: '/admin/content/faq' },
      { name: 'Pages', path: '/admin/content/pages' },
    ]
  },
  {
    title: 'Certificate Center',
    icon: Award,
    items: [
      { name: 'Vendor Certificate', path: '/admin/certificates/vendor' },
      { name: 'Labour Certificate', path: '/admin/certificates/labour' },
      { name: 'Digital Signature', path: '/admin/certificates/signature' },
      { name: 'Certificate Logs', path: '/admin/certificates/logs' },
    ]
  },
  {
    title: 'Analytics & Reports',
    icon: BarChart3,
    items: [
      { name: 'System Analytics', path: '/admin/analytics' },
      { name: 'User Growth', path: '/admin/analytics/users' },
      { name: 'Revenue Reports', path: '/admin/analytics/revenue' },
      { name: 'Audit Logs', path: '/admin/logs' },
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    superAdminOnly: true,
    items: [
      { name: 'General Settings', path: '/admin/settings' },
      { name: 'Security & Auth', path: '/admin/settings/security' },
      { name: 'Theme & Branding', path: '/admin/settings/theme' },
      { name: 'API Keys', path: '/admin/settings/api' },
      { name: 'Maintenance Mode', path: '/admin/settings/maintenance' },
    ]
  }
];

export default function AdminLayout({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminDetails, setAdminDetails] = useState({ role: 'ADMIN' });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('Dashboard');
  const [theme, setTheme] = useState('light');
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isSuperAdmin = adminDetails.role === 'SUPER_ADMIN';

  // Check if current route is restricted for Assigned City Admin (Non-SuperAdmin)
  const isRestrictedRouteForCityAdmin = !isSuperAdmin && (
    pathname.startsWith('/admin/employees') ||
    pathname.startsWith('/admin/content') ||
    pathname.startsWith('/admin/settings') ||
    pathname === '/admin/users/admins' ||
    pathname === '/admin/finance/settings'
  );

  const filteredSidebar = SIDEBAR_STRUCTURE.map(group => {
    if (group.superAdminOnly && !isSuperAdmin) {
      return null;
    }
    const filteredItems = group.items.filter(item => {
      if (item.superAdminOnly && !isSuperAdmin) return false;
      return true;
    });
    if (filteredItems.length === 0) return null;
    return {
      ...group,
      items: filteredItems
    };
  }).filter(Boolean);

  useEffect(() => {
    filteredSidebar.forEach(group => {
      if (group.items.some(item => pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin'))) {
        setOpenAccordion(group.title);
      }
    });
  }, [pathname, isSuperAdmin]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        setAdminDetails(data.admin || { role: 'ADMIN' });
      } else {
        setAuthenticated(false);
      }
    } catch (err) {
      setAuthenticated(false);
    } fontally: {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gc_token');
      localStorage.removeItem('gc_user');
      localStorage.removeItem('employee_session');
    }
    setAuthenticated(false);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="text-8xl font-black text-slate-800 tracking-widest select-none">404</h1>
          <div className="inline-block bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 text-xs font-black rounded-full uppercase tracking-widest">
            Page Not Found
          </div>
          <h2 className="text-2xl font-black text-white">404 - NOT FOUND</h2>
          <p className="text-slate-400 text-xs leading-relaxed">The requested URL was not found on this server.</p>
          <a href="/" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg transition">
            Go Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${theme}`}>
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Enterprise Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none transform transition-all duration-300 ease-in-out lg:static lg:flex-shrink-0 flex flex-col
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${sidebarOpen ? 'w-[280px] lg:translate-x-0' : 'w-[80px] lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && 'lg:justify-center'}`}>
            <div className="bg-white p-0.5 rounded-full shadow-md shadow-indigo-600/10 shrink-0 border border-slate-200 dark:border-slate-700">
              <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Logo" className="h-8 w-8 object-cover rounded-full" />
            </div>
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white whitespace-nowrap">
                Gaya Seva
              </span>
            )}
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white" onClick={() => setMobileSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-3 space-y-1">
          {filteredSidebar.map((group) => {
            const isOpen = openAccordion === group.title;
            const hasActiveChild = group.items.some(item => pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin'));

            if (!sidebarOpen && !mobileSidebarOpen) {
              return (
                <div key={group.title} className="relative group/mini mb-2">
                  <div className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all ${hasActiveChild ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    onClick={() => { setSidebarOpen(true); setOpenAccordion(group.title); }}
                  >
                    <group.icon className="w-5 h-5" />
                  </div>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded opacity-0 invisible group-hover/mini:opacity-100 group-hover/mini:visible whitespace-nowrap z-50">
                    {group.title}
                  </div>
                </div>
              );
            }

            return (
              <div key={group.title} className="mb-1">
                <button
                  onClick={() => setOpenAccordion(isOpen ? '' : group.title)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    hasActiveChild && !isOpen 
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10 font-medium' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${isOpen && 'bg-slate-50 dark:bg-slate-800/50 font-medium text-slate-900 dark:text-slate-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className={`w-5 h-5 ${hasActiveChild ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                    <span className="text-sm tracking-wide whitespace-nowrap">{group.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="mt-1 mb-2 ml-10 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                    {group.items.map(item => {
                      const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
                      return (
                        <Link
                          key={item.name}
                          href={item.path}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive 
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-semibold' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'}`} />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button onClick={logout} className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all font-medium justify-center lg:justify-start">
            <LogOut className="w-5 h-5" />
            {(sidebarOpen || mobileSidebarOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-[#05080f]">
        
        {/* Enterprise Topbar */}
        <header className="h-16 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileSidebarOpen(true);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-800 dark:text-slate-200 capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <button 
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k', 'ctrlKey': true }))}
                className="pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent text-sm w-64 text-left text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-all flex justify-between items-center"
              >
                <span>Search anything...</span>
                <span className="text-[10px] font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm text-slate-400">Ctrl K</span>
              </button>
            </div>

            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-3 lg:pr-5">
              <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <NotificationCenter />
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                {isSuperAdmin ? 'SA' : 'CA'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {isSuperAdmin ? 'Super Admin' : 'Assigned City Admin'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
          <AdminContext.Provider value={adminDetails}>
            {isRestrictedRouteForCityAdmin ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4 max-w-lg mx-auto font-sans">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center shadow-xl border border-red-200 dark:border-red-800">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <span className="px-3.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  SUPER ADMIN PRIVILEGES REQUIRED
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Restricted Section for City Admin</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This feature is reserved exclusively for Master Super Admins. Assigned City Admins do not have access to System Admins, Employee Management, Content Management, System Settings, or Finance Settings.
                </p>
                <button 
                  onClick={() => router.push('/admin')}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
                >
                  Return to Admin Dashboard
                </button>
              </div>
            ) : (
              children
            )}
          </AdminContext.Provider>
          
          <QuickActions />
          <GlobalSearch sidebarStructure={filteredSidebar} />
        </main>
      </div>
    </div>
  );
}
