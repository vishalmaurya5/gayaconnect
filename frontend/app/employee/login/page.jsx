'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your Employee User ID and Password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/employee/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Welcome! Employee Login Successful.');
        if (typeof window !== 'undefined') {
          localStorage.setItem('employee_session', JSON.stringify(data.employee));
        }
        router.push('/employee/dashboard');
      } else {
        toast.error(data.message || 'Invalid Employee Credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-indigo-600/30 via-amber-500/10 to-transparent blur-[140px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white rounded-3xl p-2 shadow-2xl shadow-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center mx-auto">
            <img src="/gaya_seva_app_icon.png" alt="GayaSeva Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gaya<span className="text-amber-400">Seva</span></h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black rounded-full uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Employee Self-Service Portal
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 text-center">
            <h2 className="text-xl font-black text-white">Staff Account Login</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your User ID / Email and Password assigned by Admin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* User ID / Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">
                Employee User ID / Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  required
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. employee@gayaseva.com or GS-EMP-0001" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 ml-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your login password" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-base py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <LogIn className="w-5 h-5" />}
              {loading ? 'Logging In...' : 'Log In to Employee Portal'}
            </button>
          </form>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 text-center font-medium leading-relaxed">
            🔑 Don't have credentials yet? Ask your Administrator to create your staff profile & generate your password.
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 font-semibold space-y-1">
          <p>© GayaSeva Enterprise Network • Staff Portal</p>
          <a href="/login" className="text-indigo-400 hover:underline inline-flex items-center gap-1">
            Admin / User Login <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
