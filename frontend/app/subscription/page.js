'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiCreditCard, FiCheckCircle, FiShield, FiStar } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { SUBSCRIPTION_MONTHLY_PLAN } from '@/lib/utils/contactAccess'

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true)
    return
  }
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

export default function SubscriptionPage() {
  const router = useRouter()
  const { user, loading, updateUser } = useAuth()
  const [paying, setPaying] = useState(false)
  const [price, setPrice] = useState(11)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success && d.pricing?.subscription) setPrice(d.pricing.subscription)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) router.push('/login?redirect=/subscription')
  }, [loading, user])

  const handlePayment = async () => {
    setPaying(true)

    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-use-dummy-razorpay': process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === 'true' ? 'false' : 'true',
        },
        body: JSON.stringify({ provider: 'razorpay', planType: SUBSCRIPTION_MONTHLY_PLAN }),
      })
      const orderData = await orderResponse.json()
      if (!orderData.success) throw new Error(orderData.message || 'Could not create payment order')

      if (orderData.isDummy) {
        // Dummy flow
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'razorpay',
            razorpay_order_id: orderData.order.id,
            razorpay_payment_id: `dummy_payment_${Date.now()}`,
            razorpay_signature: 'dummy_signature',
          }),
        })
        const verifyData = await verifyResponse.json()
        if (!verifyData.success) throw new Error(verifyData.message || 'Dummy verification failed')

        updateUser(verifyData.user)
        toast.success('Subscription Activated Successfully (Dummy)!')
        router.push('/vendors')
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load')

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: 'Monthly Premium Access',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ provider: 'razorpay', ...response }),
            })
            const verifyData = await verifyResponse.json()
            if (!verifyData.success) throw new Error(verifyData.message || 'Payment verification failed')

            updateUser(verifyData.user)
            toast.success('Subscription Activated Successfully!')
            router.push('/vendors')
          } catch (error) {
            toast.error(error.message)
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: '#10b981' },
      })

      checkout.on('payment.failed', () => {
        toast.error('Payment failed or cancelled.')
        setPaying(false)
      })

      checkout.open()
    } catch (error) {
      toast.error(error.message || 'Payment process failed')
      setPaying(false)
    }
  }

  if (loading) return <div className="container-custom py-10"><div className="h-72 animate-pulse rounded-2xl bg-slate-100" /></div>

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 blur-2xl transform rotate-12 scale-150"></div>
          <FiStar className="mx-auto text-5xl text-emerald-100 mb-4 relative z-10" />
          <h1 className="text-3xl font-extrabold text-white relative z-10">Premium Subscription</h1>
          <p className="mt-2 text-emerald-100 font-medium relative z-10">Unlock all contact details for Vendors & Local Workers in Gaya.</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-center items-end gap-1 mb-8">
            <span className="text-6xl font-extrabold text-slate-900">₹{price}</span>
            <span className="text-xl text-slate-500 font-medium mb-2">/ month</span>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Direct phone numbers of 500+ Vendors',
              'Access to contact Local Workers',
              'Unlock exclusive vendor promotional offers',
              'Cancel anytime from your profile',
              'Instant activation after payment'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <FiCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
                <span className="font-semibold text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100 text-sm text-slate-600 flex gap-3">
            <FiShield className="text-emerald-600 text-2xl flex-shrink-0" />
            <p>Your payment is 100% secure. Subscriptions help us maintain the platform and keep local data accurate.</p>
          </div>

          <button 
            onClick={handlePayment} 
            disabled={paying}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 active:scale-[0.98]"
          >
            <FiCreditCard className="text-xl" />
            {paying ? 'Connecting to Payment Gateway...' : `Pay ₹${price} & Subscribe`}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4 font-medium uppercase tracking-wider">
            Powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  )
}
