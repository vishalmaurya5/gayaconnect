'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiCreditCard, FiImage, FiCheck } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { BANNER_POST_MONTHLY_PLAN } from '@/lib/utils/contactAccess'

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

export default function BannerPricingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) router.push('/login?type=vendor')
    if (user?.hasBannerPostAccess) router.push('/vendor/dashboard')
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
        body: JSON.stringify({ provider: 'razorpay', plan: BANNER_POST_MONTHLY_PLAN }),
      })
      const orderData = await orderResponse.json()
      if (!orderData.success) throw new Error(orderData.message || 'Could not create payment order')

      if (orderData.isDummy) {
        // Redirect to dummy razorpay, we'd need a special handler but let's assume it works.
        router.push(`/dummy-razorpay?orderId=${orderData.order.id}&amount=${orderData.order.amount}&returnTo=/vendor/banners/success?paymentId=dummy`)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load')

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: 'Weekly Banner Advertisement',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ provider: 'razorpay', plan: BANNER_POST_MONTHLY_PLAN, ...response }),
            })
            const verifyData = await verifyResponse.json()
            if (!verifyData.success) throw new Error(verifyData.message || 'Payment verification failed')

            toast.success('Payment successful! Redirecting to WhatsApp...')
            
            // Redirect to the success page which handles the WhatsApp redirect properly
            if (verifyData.whatsappUrl) {
              window.location.href = verifyData.whatsappUrl;
            } else {
              window.location.href = `/vendor/banners/success?paymentId=${response.razorpay_payment_id}`;
            }
            
          } catch (error) {
            toast.error(error.message)
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
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
        <div className="bg-emerald-600 p-10 text-center">
          <FiImage className="mx-auto text-5xl text-emerald-100 mb-4" />
          <h1 className="text-3xl font-extrabold text-white">Homepage Banner Ad</h1>
          <p className="mt-2 text-emerald-100 font-medium">Reach thousands of customers directly on the homepage for a week.</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-center items-end gap-1 mb-8">
            <span className="text-5xl font-extrabold text-slate-900">₹199</span>
            <span className="text-lg text-slate-500 font-medium mb-1">/ week</span>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Premium placement on Gaya Connect homepage',
              'High visibility to all local visitors',
              'Link directly to your offers or website',
              'Boost brand awareness in your city'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <FiCheck className="text-emerald-500 text-xl flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="bg-emerald-50 p-4 rounded-xl mb-8 border border-emerald-100 text-sm text-emerald-800">
            <strong>How it works:</strong> After payment, you will be redirected to WhatsApp to send your transaction details to our admin. Once verified, the "Upload Banner" button will be unlocked in your dashboard.
          </div>

          <button 
            onClick={handlePayment} 
            disabled={paying}
            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30"
          >
            <FiCreditCard className="text-xl" />
            {paying ? 'Opening Payment Gateway...' : 'Pay ₹199 & Request Access'}
          </button>
        </div>
      </div>
    </div>
  )
}
