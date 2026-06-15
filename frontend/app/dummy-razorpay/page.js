'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiCreditCard, FiShield } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

export default function DummyRazorpayPage() {
  return (
    <Suspense fallback={<div className="container-custom py-10">Loading dummy payment...</div>}>
      <DummyRazorpayContent />
    </Suspense>
  )
}

function DummyRazorpayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const orderId = searchParams.get('orderId')
  const amount = Number(searchParams.get('amount') || 0) / 100
  const returnTo = searchParams.get('returnTo') || '/vendors'

  const completePayment = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: `dummy_payment_${Date.now()}`,
          razorpay_signature: 'dummy_signature',
        }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Dummy payment failed')

      updateUser(data.user)
      toast.success('Dummy payment successful')
      router.push(returnTo)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <FiCreditCard className="text-2xl" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Dummy Razorpay</p>
            <h1 className="text-2xl font-bold text-slate-950">Test Payment</h1>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Order ID</p>
          <p className="mt-1 break-all font-mono text-sm text-slate-800">{orderId}</p>
          <p className="mt-4 text-sm text-slate-500">Amount</p>
          <p className="mt-1 text-3xl font-bold text-slate-950">Rs. {amount || 9}</p>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-800">
          <FiShield className="mt-0.5 shrink-0" />
          This local page simulates a successful Razorpay payment for testing only.
        </div>

        <button
          type="button"
          onClick={completePayment}
          disabled={loading || !orderId}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiCheckCircle />
          {loading ? 'Completing...' : 'Complete Dummy Payment'}
        </button>
      </div>
    </div>
  )
}
