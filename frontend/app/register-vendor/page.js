"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, ArrowRight, User as UserIcon, Phone, Store, MapPin, Tag, FileText } from "lucide-react";

const CATEGORIES = ["Electrician", "Plumber", "Carpenter", "AC Repair", "Cleaning", "Painter", "Appliance Repair", "Pest Control", "Tourist Guide", "Agent", "Other"];

export default function RegisterVendorPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    category: "",
    businessAddress: "",
    gstNumber: "",
    description: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password || !form.businessName || !form.businessAddress || (!form.category && !customCategory)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const finalCategory = form.category === "Other" && customCategory.trim() !== "" ? customCategory.trim() : form.category;

    const res = await register({
      ...form,
      category: finalCategory,
      role: "vendor"
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login-vendor");
      }, 2000);
    } else if (res.paymentRequired) {
      const options = {
        key: res.keyId,
        amount: res.amount,
        currency: res.currency,
        name: "Gaya Connect",
        description: "Vendor Registration Fee",
        order_id: res.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/auth/register-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userData: res.userData
              })
            });
            const verifyJson = await verifyRes.json();
            if (verifyJson.success) {
              setSuccess(true);
              setTimeout(() => router.push("/login-vendor"), 2000);
            } else {
              setError(verifyJson.error || "Payment verification failed.");
            }
          } catch (err) {
            setError("Error verifying payment.");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || "Payment failed");
      });
      rzp.open();
    } else {
      setError(res.error || "Failed to register. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center items-center p-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            <Store size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner with Gaya Connect</h1>
          <p className="text-gray-500 text-sm">Grow your business and reach more customers</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-gray-100">
          
          {/* Role Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8 max-w-md mx-auto">
            <Link href="/register" className="w-1/2 text-gray-500 hover:text-gray-700 font-semibold text-sm py-2 rounded-lg text-center transition-colors">
              Register as User
            </Link>
            <div className="w-1/2 bg-white text-indigo-700 font-semibold text-sm py-2 rounded-lg text-center shadow-sm">
              Register as Vendor
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm mb-6 border border-emerald-100 font-semibold text-center">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Business Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <Store size={20} className="text-indigo-600" /> Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="e.g. Sharma Electricals"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {form.category === "Other" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                        placeholder="Type your category name..."
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Address *</label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={form.businessAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="Complete address in Gaya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">GST Number (Optional)</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                    placeholder="Tell customers about your services..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Owner Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <UserIcon size={20} className="text-indigo-600" /> Owner Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="Owner's Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="Primary Contact"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="business@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600 leading-tight">
                I agree to the <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link> as a vendor.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Partner Account..." : "Create Partner Account"} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already a registered vendor?{" "}
          <Link href="/login-vendor" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
