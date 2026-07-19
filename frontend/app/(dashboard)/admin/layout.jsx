'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, Bell, User, Settings, LogOut, Menu, X, ChevronDown, ChevronRight,
  LayoutDashboard, Users, Briefcase, UserCheck, ShoppingBag, Wrench, Car, 
  Store, Globe, Building2, Megaphone, DollarSign, MessageSquare,
  FileText, Award, BarChart3, Sliders, Shield, Sun, Moon, Link as LinkIcon
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
      { name: 'System Admins', path: '/admin/users/admins' },
      { name: 'Roles & Permissions', path: '/admin/roles' },
      { name: 'Employees', path: '/admin/employees' },
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
      { name: 'Payments', path: '/admin/payments' },
      { name: 'Invoices', path: '/admin/finance/invoices' },
      { name: 'Revenue', path: '/admin/finance/revenue' },
      { name: 'GST Reports', path: '/admin/finance/gst' },
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
    items: [
      { name: 'Homepage', path: '/admin/content/home' },
      { name: 'Blogs', path: '/admin/content/blogs' },
      { name: 'SEO', path: '/admin/content/seo' },
      { name: 'Media Library', path: '/admin/content/media' },
      { name: 'Legal Pages', path: '/admin/content/legal' },
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
    title: 'Settings',
    icon: Sliders,
    items: [
      { name: 'General', path: '/admin/settings' },
      { name: 'Security', path: '/admin/settings/security' },
      { name: 'Theme', path: '/admin/settings/theme' },
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
    // Search focus on Ctrl+K
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Auto-open accordion based on current path
    SIDEBAR_STRUCTURE.forEach(group => {
      if (group.items.some(item => pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin'))) {
        setOpenAccordion(group.title);
      }
    });
  }, [pathname]);

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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthenticated(false);
    toast.success('Logged out successfully');
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
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
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
          {SIDEBAR_STRUCTURE.map((group) => {
            
            // Enforce RBAC
            if (adminDetails.role === 'JOBS_MANAGER' && !['Jobs Management', 'Dashboard', 'Settings'].includes(group.title)) return null;
            if (adminDetails.role === 'MARKETPLACE_MANAGER' && !['Marketplace Management', 'Dashboard', 'Settings'].includes(group.title)) return null;

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
                  {/* Tooltip for collapsed mode */}
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
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-800 dark:text-slate-200 capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {/* Global Search Button */}
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

            {/* Quick Actions & Notifications */}
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-3 lg:pr-5">
              <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <NotificationCenter />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                A
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {adminDetails.role === 'SUPER_ADMIN' ? 'Super Admin' : adminDetails.role === 'JOBS_MANAGER' ? 'Jobs Manager' : adminDetails.role === 'MARKETPLACE_MANAGER' ? 'Marketplace Manager' : 'Admin'}
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
            {children}
          </AdminContext.Provider>
          
          <QuickActions />
          <GlobalSearch sidebarStructure={SIDEBAR_STRUCTURE} />
        </main>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({ userId: 'admin', password: '' });
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Access granted');
        onLogin();
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 lg:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Gaya Seva Workspace</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">Enter your credentials to access the enterprise control center.</p>
          </div>

          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Workspace ID</label>
              <input 
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                placeholder="admin"
                value={credentials.userId} 
                onChange={e => setCredentials({...credentials, userId: e.target.value})} 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot?</a>
              </div>
              <input 
                required
                type="password" 
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                placeholder="••••••••"
                value={credentials.password} 
                onChange={e => setCredentials({...credentials, password: e.target.value})} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3.5 font-semibold shadow-lg shadow-indigo-600/25 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In to Workspace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

