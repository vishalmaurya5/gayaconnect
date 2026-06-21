"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  
  const openSubscriptionModal = () => setIsSubscriptionModalOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionModalOpen(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("gc_token");
    const storedUser = localStorage.getItem("gc_user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("gc_token");
        localStorage.removeItem("gc_user");
      }
    }
    setLoading(false);
  }, []);

  // Client-side route protection
  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isVendorRoute = pathname.startsWith("/vendor");
    const isProfileRoute = pathname.startsWith("/profile");

    if (!user && (isVendorRoute || isProfileRoute)) {
      router.push("/login");
    }

    if (user && isVendorRoute && user.role !== "vendor" && user.role !== "admin") {
      router.push("/profile");
    }

    // Redirect logged-in users away from auth pages
    if (user && isAuthPage) {
      if (user.role === 'vendor') router.push("/vendor/dashboard");
      else if (user.role === 'admin') router.push("/admin");
      else router.push("/profile");
    }

  }, [user, loading, pathname, router]);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      // Store in localStorage
      localStorage.setItem("gc_token", data.token);
      localStorage.setItem("gc_user", JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Registration failed");
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("gc_token");
    localStorage.removeItem("gc_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isVendor: user?.role === "vendor",
      isAdmin: user?.role === "admin",
      openSubscriptionModal,
      closeSubscriptionModal
    }}>
      {children}
      <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={closeSubscriptionModal} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
