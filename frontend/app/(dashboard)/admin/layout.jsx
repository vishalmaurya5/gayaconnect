'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, FiUsers, FiShoppingBag, FiTool, FiTag, 
  FiImage, FiDollarSign, FiLogOut, FiShield, FiMenu, FiX 
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
    { name: 'Offers', path: '/admin/offers', icon: FiTag },
    { name: 'Banners', path: '/admin/banners', icon: FiImage },
    { name: 'Payments', path: '/admin/payments', icon: FiDollarSign },
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
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <FiShield className="text-emerald-500" /> Admin Portal
          </span>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <FiX className="text-2xl" />
          </button>
        </div>
        <div className="p-4 space-y-1">
          {menuItems.map((item) => {
            // Precise active matching
            const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`text-lg ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-left text-slate-400 font-medium">
            <FiLogOut className="text-lg" /> Logout
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
