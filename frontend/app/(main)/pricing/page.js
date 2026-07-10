'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';

const plans = [
  { id: '1m', name: 'Monthly', duration: '1 month', price: 11, savings: '', popular: false },
  { id: '3m', name: 'Quarterly', duration: '3 months', price: 30, savings: 'Save ₹3', popular: true },
  { id: '6m', name: 'Half-Yearly', duration: '6 months', price: 55, savings: 'Save ₹11', popular: false },
  { id: '12m', name: 'Yearly', duration: '12 months', price: 100, savings: 'Save ₹32', popular: false },
];

export default function PricingPage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: plan.price * 100,
          planId: plan.id,
          planName: plan.name
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Gaya Seva",
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
          color: "#4f46e5"
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
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Choose Your Plan</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Get unlimited access to verified vendor contacts, exclusive offers, and daily workers. Invest locally, save globally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 ${plan.popular ? 'border-indigo-500 shadow-xl shadow-indigo-100 scale-105' : 'border-slate-200 hover:border-indigo-300 hover:shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-slate-900">₹{plan.price}</span>
                <span className="text-sm font-medium text-slate-500">/ {plan.duration}</span>
              </div>
              
              {plan.savings ? (
                <div className="inline-block bg-green-50 text-green-700 text-sm font-bold px-3 py-1 rounded-md mb-8">
                  {plan.savings}
                </div>
              ) : (
                <div className="h-8 mb-8"></div>
              )}

              <ul className="space-y-4 mb-10">
                <li className="flex gap-3 text-slate-600 font-medium">
                  <FiCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Unlock all vendor contacts
                </li>
                <li className="flex gap-3 text-slate-600 font-medium">
                  <FiCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> View exclusive local offers
                </li>
                <li className="flex gap-3 text-slate-600 font-medium">
                  <FiCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Contact daily workers
                </li>
                <li className="flex gap-3 text-slate-600 font-medium">
                  <FiCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Premium priority support
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
