'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, FiUsers, FiShoppingBag, FiTool, FiTag, 
  FiImage, FiDollarSign, FiLogOut, FiShield, FiMenu, FiX,
  FiPhoneCall, FiSettings, FiMonitor, FiBriefcase, FiTruck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Vendors', path: '/admin/vendors', icon: FiShoppingBag },
    { name: 'Labour', path: '/admin/labour', icon: FiTool },
    { name: 'Vehicles', path: '/admin/vehicles', icon: FiTruck },
    { name: 'Jobs & Sales', path: '/admin/jobs', icon: FiBriefcase },
    { name: 'Offers', path: '/admin/offers', icon: FiTag },
    { name: 'Banners', path: '/admin/banners', icon: FiImage },
    { name: 'Payments', path: '/admin/payments', icon: FiDollarSign },
    { name: 'Call Logs', path: '/admin/calls', icon: FiPhoneCall },
    { name: 'Popup Ad', path: '/admin/popup', icon: FiMonitor },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-[280px] bg-[#0A0F1C] border-r border-slate-800/60 shadow-2xl text-slate-300 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60 bg-[#0A0F1C]/80 backdrop-blur-xl shrink-0">
          <span className="font-extrabold text-xl flex items-center gap-3 tracking-tight">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <FiShield className="text-white text-xl" /> 
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Admin Pro</span>
          </span>
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <FiX className="text-2xl" />
          </button>
        </div>
        
        <div className="p-4 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent hover:border-slate-800/60'
                }`}
              >
                <item.icon className={`text-xl transition-transform duration-300 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-110'}`} />
                <span className="tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-[#0A0F1C] shrink-0">
          <button onClick={logout} className="flex items-center gap-3.5 px-4 py-3.5 w-full rounded-2xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300 text-left text-slate-400 font-medium group">
            <FiLogOut className="text-xl transition-transform duration-300 group-hover:-translate-x-1" /> 
            <span className="tracking-wide">Logout Securely</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:text-slate-900">
            <FiMenu className="text-2xl" />
          </button>
          <span className="ml-2 font-bold text-slate-800">Admin Portal</span>
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
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
    <div className="min-h-screen bg-slate-950 px-4 py-10 flex items-center justify-center">
      <form onSubmit={login} className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 mb-6">
          <FiShield className="text-3xl" />
        </span>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Login</h1>
        <p className="mt-2 text-slate-400">Secure access to the Gaya Connect control center.</p>
        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Admin ID</label>
            <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-emerald-500 focus:ring-emerald-500" value={credentials.userId} onChange={e => setCredentials({...credentials, userId: e.target.value})} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input type="password" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-emerald-500 focus:ring-emerald-500" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} />
          </div>
        </div>
        <button disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-500 disabled:opacity-70">
          {loading ? 'Authenticating...' : 'Enter Admin'}
        </button>
      </form>
    </div>
  );
}
