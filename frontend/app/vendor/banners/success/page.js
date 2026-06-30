'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FiCheckCircle } from 'react-icons/fi'

export default function BannerSuccessPage() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const supportWhatsapp = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '919117588242').replace(/\D/g, '')
      const message = `Hi, I have paid for banner advertisement.\nMy business: ${user.name}\nTransaction ID: DUMMY_PAYMENT\nPlease activate my banner posting access.`
      
      const timer = setTimeout(() => {
        window.location.href = `https://wa.me/${supportWhatsapp}?text=${encodeURIComponent(message)}`
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [user])

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
