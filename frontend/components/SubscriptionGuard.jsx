"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { X, Lock, CheckCircle, CreditCard } from "lucide-react";

export default function SubscriptionGuard({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  const handleAction = (e) => {
    // If the child has an onClick, prevent it initially
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Check if user is already subscribed
    const isSubActive = user?.subscriptionActive && new Date(user?.subscriptionExpiry) > new Date();
    
    if (isSubActive) {
      // Allow the action to proceed (you can trigger a callback here if needed)
      // Usually, if they are already subscribed, the button shouldn't show "Subscribe", but "Manage" or similar.
    } else {
      setShowModal(true);
    }
  };

  const handleSubscribe = async () => {
    try {
      // 1. Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "user_monthly" })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create order");

      if (data.isDummy) {
        // Redirect to dummy razorpay
        router.push(`/dummy-razorpay?orderId=${data.orderId}&amount=${data.amount}&redirect=/profile`);
        return;
      }

      // Real Razorpay implementation
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Gaya Seva",
        description: "Monthly Subscription",
        order_id: data.orderId,
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              plan: "user_monthly"
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setShowModal(false);
            window.location.href = verifyData.redirect || "/profile";
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: { color: "#4338CA" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <>
      <div onClick={handleAction} className="inline-block w-full">
        {children}
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-6">You need to be logged in to subscribe and unlock premium features.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLoginPrompt(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => router.push("/login")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            
            <div className="text-center mb-6 mt-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Gaya Seva</h3>
              <p className="text-gray-500 text-sm">Get full access to all vendors, offers, and local workforce contacts.</p>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-600 rounded-2xl p-5 mb-6 relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl rounded-tr-xl">
                Most Popular
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-indigo-700">₹11</span>
                <span className="text-sm font-semibold text-indigo-500">/month</span>
              </div>
              
              <ul className="space-y-3">
                {[
                  "View all vendor phone numbers",
                  "Direct WhatsApp access to businesses",
                  "Claim exclusive local offers",
                  "Contact local workers",
                  "Cancel anytime"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-indigo-900 font-medium">
                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={handleSubscribe} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
              <CreditCard size={18} />
              Pay ₹11 & Subscribe
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-4">
              Secure payments powered by Razorpay
            </p>
          </div>
        </div>
      )}
    </>
  );
}
