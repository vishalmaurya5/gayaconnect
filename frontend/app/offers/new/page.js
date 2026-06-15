'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiCreditCard, FiGift, FiPercent, FiSend, FiX, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { OFFER_TIER_7DAYS, OFFER_TIER_30DAYS, OFFER_TIER_365DAYS } from '@/lib/utils/contactAccess'
import { motion, AnimatePresence } from 'framer-motion'

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

const PLANS = [
  { id: '7days', name: '7 Days Visibility', price: 39, planType: OFFER_TIER_7DAYS },
  { id: '30days', name: '30 Days Visibility', price: 199, planType: OFFER_TIER_30DAYS },
  { id: '365days', name: '365 Days Visibility', price: 399, planType: OFFER_TIER_365DAYS },
]

export default function NewOfferPage() {
  const router = useRouter()
  const { user, loading, updateUser } = useAuth()
  
  const [form, setForm] = useState({
    title: '',
    discount: '',
    description: '',
  })
  
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]) // Default 30 days
  const [paying, setPaying] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) router.push('/login?type=vendor')
    if (user && user.role !== 'vendor') router.push('/offers')
  }, [loading, user?.id])

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (!form.title || !form.discount || !form.description) {
      toast.error('Please fill in all fields')
      return
    }
    setShowModal(true)
  }

  const handlePaymentAndPost = async () => {
    setPaying(true)

    try {
      // 1. Create Order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-use-dummy-razorpay': process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === 'true' ? 'false' : 'true',
        },
        body: JSON.stringify({ provider: 'razorpay', planType: selectedPlan.planType }),
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

        const offerResponse = await fetch('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            planType: selectedPlan.id,
            paymentId: verifyData.payment._id,
          }),
        })
        const offerData = await offerResponse.json()
        if (!offerData.success) throw new Error(offerData.message || 'Could not post offer')

        updateUser(verifyData.user)
        toast.success('Offer posted successfully (Dummy)!')
        setShowModal(false)
        router.push('/vendor/offers')
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load')

      // 2. Open Razorpay
      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: selectedPlan.name,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // 3. Verify Payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ provider: 'razorpay', ...response }),
            })
            const verifyData = await verifyResponse.json()
            if (!verifyData.success) throw new Error(verifyData.message || 'Payment verification failed')

            // 4. Create Offer
            const offerResponse = await fetch('/api/offers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...form,
                planType: selectedPlan.id,
                paymentId: verifyData.payment._id,
              }),
            })
            const offerData = await offerResponse.json()
            if (!offerData.success) throw new Error(offerData.message || 'Could not post offer')

            toast.success('Offer posted successfully!')
            setShowModal(false)
            router.push('/vendor/offers')
          } catch (error) {
            toast.error(error.message)
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#0ea5e9' },
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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-custom max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-sky-600">Vendor Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight">Post a New Offer</h1>
          <p className="mt-2 text-slate-600 text-lg">Create an attractive offer to attract more customers to your business.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <Field icon={FiGift} label="Offer Title">
              <input className="input-field pl-11 rounded-xl bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="e.g. Weekend Family Dinner Special" />
            </Field>
            
            <Field icon={FiPercent} label="Discount">
              <input className="input-field pl-11 rounded-xl bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500" value={form.discount} onChange={(event) => updateForm('discount', event.target.value)} placeholder="e.g. 20% OFF or Buy 1 Get 1 Free" />
            </Field>
            
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
              <textarea className="input-field min-h-[160px] rounded-xl bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500" value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="Explain the details, terms, and conditions of your offer..." />
            </div>
          </div>

          <button type="submit" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-4 font-bold text-white transition hover:bg-sky-700 hover:shadow-lg active:scale-[0.98]">
            <FiSend className="text-xl" />
            Choose Plan & Post
          </button>
        </form>
      </div>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => !paying && setShowModal(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <button 
                onClick={() => !paying && setShowModal(false)} 
                className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                disabled={paying}
              >
                <FiX />
              </button>

              <div className="bg-sky-50 p-8 text-center border-b border-sky-100">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-4 shadow-inner">
                  <FiGift className="text-3xl" />
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Select Offer Duration</h2>
                <p className="mt-2 text-sky-700/80 text-sm font-medium">Choose how long you want your offer to be visible.</p>
              </div>

              <div className="p-8 space-y-4">
                {PLANS.map((plan) => (
                  <label 
                    key={plan.id} 
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${selectedPlan.id === plan.id ? 'border-sky-500 bg-sky-50/50 shadow-md ring-4 ring-sky-500/10' : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${selectedPlan.id === plan.id ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
                        {selectedPlan.id === plan.id && <FiCheckCircle className="text-white text-sm" />}
                      </div>
                      <div>
                        <p className={`font-bold ${selectedPlan.id === plan.id ? 'text-sky-900' : 'text-slate-700'}`}>{plan.name}</p>
                      </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900">₹{plan.price}</p>
                    <input type="radio" className="hidden" name="plan" checked={selectedPlan.id === plan.id} onChange={() => setSelectedPlan(plan)} />
                  </label>
                ))}

                <button 
                  onClick={handlePaymentAndPost} 
                  disabled={paying}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FiCreditCard className="text-xl" />
                  {paying ? 'Processing...' : `Pay ₹${selectedPlan.price} & Post Offer`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        {children}
      </div>
    </div>
  )
}
