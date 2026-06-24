'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';

const plans = [
  { id: '1m', name: 'Monthly', duration: '1 month', price: 11, savings: '', popular: false },
  { id: '3m', name: 'Quarterly', duration: '3 months', price: 30, savings: 'Save ₹3', popular: true },
  { id: '6m', name: 'Half-Yearly', duration: '6 months', price: 55, savings: 'Save ₹11', popular: false },
  { id: '12m', name: 'Yearly', duration: '12 months', price: 100, savings: 'Save ₹32', popular: false },
];

export default function SubscriptionModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('Please login to subscribe');
      onClose();
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: plan.price * 100, // in paise
          planId: plan.id,
          planName: plan.name
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Gaya Connect",
        description: `Subscription - ${plan.name} Plan`,
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Subscription activated successfully!');
            onClose();
            // Optionally reload window to update user state
            window.location.reload();
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || ""
        },
        theme: {
          color: "#4f46e5" // indigo-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            className="fixed left-1/2 top-1/2 w-full max-w-5xl bg-slate-50 rounded-2xl shadow-2xl z-[101] max-h-[90vh] overflow-y-auto p-6 md:p-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Unlock Premium Access</h2>
              <p className="text-slate-500 mt-2">Get unlimited access to verified vendor contacts, exclusive offers, and daily workers.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-100 scale-105 z-10' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                    <span className="text-sm text-slate-500">/ {plan.duration}</span>
                  </div>
                  
                  {plan.savings && (
                    <div className="inline-block bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md mb-6">
                      {plan.savings}
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    <li className="flex gap-2 text-sm text-slate-600">
                      <FiCheck className="w-5 h-5 text-indigo-500 shrink-0" /> Unlock all vendor contacts
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                      <FiCheck className="w-5 h-5 text-indigo-500 shrink-0" /> View exclusive local offers
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                      <FiCheck className="w-5 h-5 text-indigo-500 shrink-0" /> Contact daily workers
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                  >
                    {loading ? 'Processing...' : 'Subscribe Now'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
