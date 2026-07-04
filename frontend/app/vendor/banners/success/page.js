'use client'
import { useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FiCheckCircle } from 'react-icons/fi'
import { useSearchParams } from 'next/navigation'

function BannerSuccessContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('paymentId') || 'DUMMY_PAYMENT'

  useEffect(() => {
    if (user) {
      const supportWhatsapp = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '919117588242').replace(/\D/g, '')
      const message = `Hi, I have paid for banner advertisement.\nMy business: ${user.name}\nTransaction ID: ${paymentId}\nPlease activate my banner posting access.`
      
      const timer = setTimeout(() => {
        window.location.href = `https://wa.me/${supportWhatsapp}?text=${encodeURIComponent(message)}`
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [user, paymentId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
        <FiCheckCircle className="mx-auto text-6xl text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-600">Redirecting to WhatsApp to send your request...</p>
      </div>
    </div>
  )
}

export default function BannerSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <BannerSuccessContent />
    </Suspense>
  )
}
