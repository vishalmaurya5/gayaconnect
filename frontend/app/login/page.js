"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, User as UserIcon, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const res = await login(identifier, password, "user");
    if (res.success) {
      router.push("/profile");
    } else {
      setError(res.error || "Failed to login. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-extrabold text-indigo-700 tracking-tight">
            Gaya Connect
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Sign in to access your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-gray-100">
          
          {/* Role Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            <div className="w-1/2 bg-white text-indigo-700 font-semibold text-sm py-2 rounded-lg text-center shadow-sm">
              User Login
            </div>
            <Link href="/login-vendor" className="w-1/2 text-gray-500 hover:text-gray-700 font-semibold text-sm py-2 rounded-lg text-center transition-colors">
              Vendor Login
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="e.g., 9876543210 or user@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
