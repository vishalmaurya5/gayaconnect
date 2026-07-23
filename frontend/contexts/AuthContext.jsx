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
        
        // Fetch fresh user data in the background to keep subscription status updated
        fetch(`/api/profile?t=${Date.now()}`)
          .then(async res => {
            if (!res.ok) {
              const text = await res.text();
              throw new Error(`Profile API error ${res.status}: ${text.substring(0, 100)}`);
            }
            return res.json();
          })
          .then(data => {
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem("gc_user", JSON.stringify(data.user));
            }
          })
          .catch(console.error);

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
    const isVendorRoute = pathname === "/vendor" || pathname.startsWith("/vendor/");
    const isProfileRoute = pathname.startsWith("/profile");
    const isOffersRoute = pathname.startsWith("/offers");

    if (!user && (isVendorRoute || isProfileRoute || isOffersRoute)) {
      router.push("/login");
    }

    if (user && isVendorRoute && user.role !== "vendor" && user.role !== "admin") {
      router.push("/profile");
    }

    // Redirect logged-in users away from auth pages
    if (user && isAuthPage) {
      if (user.role === 'vendor') router.push("/vendor/dashboard");
      else if (user.role === 'admin') router.push("/admin");
      else if (user.role === 'employee') router.push("/employee/dashboard");
      else router.push("/profile");
    }

  }, [user, loading, pathname, router]);

  const login = async (identifier, password, role) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      // Store in localStorage
      localStorage.setItem("gc_token", data.token);
      localStorage.setItem("gc_user", JSON.stringify(data.user));
      if (data.user?.role === 'employee') {
        localStorage.setItem("employee_session", JSON.stringify(data.user));
      }
      
      setUser(data.user);
      return { success: true, user: data.user };
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

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem("gc_token");
      localStorage.removeItem("gc_user");
      localStorage.removeItem("employee_session");
    }
    setUser(null);
    window.location.href = "/login";
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
