'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiCalendar, FiCreditCard, FiGift, FiLock, FiMapPin, FiPhone, FiPlus, FiTag } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { OFFER_ACCESS_USER_PLAN, OFFER_ACCESS_VENDOR_PLAN } from '@/lib/utils/contactAccess'

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

const previewOffers = [
  {
    _id: 'preview-1',
    title: 'Festival family meal deal',
    discountText: '20% OFF',
    description: 'A limited local offer from a verified Gaya vendor with call details after unlock.',
    vendorId: { name: 'Gaya Local Vendor', category: 'Food', subCategory: 'Restaurant', address: 'Gaya Market', phone: '9876543210' },
    validUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'preview-2',
    title: 'Service booking discount',
    discountText: 'Save Rs. 250',
    description: 'Unlock the offer page to view live offers, vendor phone numbers, and current deals.',
    vendorId: { name: 'Trusted Service Partner', category: 'Services', subCategory: 'Home Service', address: 'Near Tower Chowk', phone: '9123456789' },
    validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'preview-3',
    title: 'Shopping cashback special',
    discountText: 'Buy 1 Get 1',
    description: 'Paid members can browse all active offers and contact vendors directly.',
    vendorId: { name: 'City Store', category: 'Shopping', subCategory: 'Retail', address: 'Gaya Main Road', phone: '9988776655' },
  },
]

export default function OffersPage() {
  const router = useRouter()
  const { user, loading: authLoading, updateUser } = useAuth()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetch('/api/offers')
      .then((response) => response.json())
      .then((data) => setOffers(data.offers || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.hasOfferAccess, user?.role])

  const canViewOffers = Boolean(user?.subscriptionActive || user?.role === 'admin')
  const locked = !authLoading && !canViewOffers
  const planType = 'subscription_monthly'
  const price = 11
  const visibleOffers = offers.length ? offers : locked ? previewOffers : []

  const unlockOffers = async () => {
    if (!user) {
      toast.error('Login required to unlock offers')
      router.push('/login')
      return
    }

    setPaying(true)

    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-use-dummy-razorpay': process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === 'true' ? 'false' : 'true',
        },
        body: JSON.stringify({ provider: 'razorpay', planType }),
      })
      const orderData = await orderResponse.json()
      if (!orderData.success) throw new Error(orderData.message || 'Could not create payment order')

      if (orderData.isDummy) {
        router.push(`/dummy-razorpay?orderId=${orderData.order.id}&amount=${orderData.order.amount}&returnTo=/offers`)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load')

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: 'Monthly platform subscription',
        order_id: orderData.order.id,
        handler: async (response) => {
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ provider: 'razorpay', ...response }),
          })
          const verifyData = await verifyResponse.json()
          if (!verifyData.success) throw new Error(verifyData.message || 'Payment verification failed')

          updateUser(verifyData.user)
          toast.success('Subscription activated successfully')
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#2563eb' },
      })

      checkout.open()
    } catch (error) {
      toast.error(error.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="container-custom">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Offers</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Latest Local Offers</h1>
            <p className="mt-2 text-slate-600">Browse current deals posted by Gaya Connect vendors.</p>
          </div>
          {user?.role === 'vendor' && user?.hasOfferPostAccess && (
            <Link href="/offers/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
              <FiPlus />
              Post Offer
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => <div key={index} className="h-56 animate-pulse rounded-lg bg-white" />)}
          </div>
        ) : visibleOffers.length ? (
          <div className="relative">
            <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${locked ? 'max-h-[640px] overflow-hidden blur-[3px] pointer-events-none select-none' : ''}`}>
              {visibleOffers.map((offer) => <OfferCard key={offer._id} offer={offer} />)}
            </div>
            {locked && (
              <div className="absolute inset-x-0 top-12 z-10 mx-auto max-w-lg rounded-lg border border-blue-100 bg-white p-6 text-center shadow-2xl">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FiLock className="text-2xl" />
                </span>
                <h2 className="mt-4 text-2xl font-bold text-slate-950">Subscription Required</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Unlock the offers page, vendor contact details, and daily labour page for Rs. 11/month.
                </p>
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">Monthly subscription</p>
                  <p className="mt-1 text-3xl font-bold text-slate-950">Rs. {price}</p>
                </div>
                <button
                  type="button"
                  onClick={unlockOffers}
                  disabled={paying}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiCreditCard />
                  {paying ? 'Opening...' : `Renew ₹${price}/month`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <FiGift className="mx-auto text-4xl text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">No offers yet</h2>
            <p className="mt-2 text-slate-500">Vendor offers will appear here when posted.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OfferCard({ offer }) {
  const vendor = offer.vendorId
  const validUntil = offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : null
  const phone = vendor?.phone || ''
  const vendorInitial = (vendor?.name || 'V').charAt(0).toUpperCase()

  return (
    <article className="flex min-h-[320px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex max-w-[70%] items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-slate-950 shadow-sm">
            <FiTag className="shrink-0 text-green-600" />
            <span className="truncate">{offer.discountText}</span>
          </span>
          <span className="rounded-lg bg-white/10 p-3 text-white ring-1 ring-white/15"><FiGift /></span>
        </div>
        <h2 className="mt-5 text-xl font-bold leading-snug">{offer.title}</h2>
        {(vendor?.category || vendor?.subCategory) && (
          <p className="mt-2 text-sm text-blue-100">
            {[vendor.category, vendor.subCategory].filter(Boolean).join(' / ')}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-4 text-sm leading-6 text-slate-600">{offer.description}</p>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-lg font-bold text-blue-700 ring-1 ring-blue-100">
            {vendor?.logo ? <img src={vendor.logo} alt={vendor?.name || 'Vendor'} className="h-full w-full object-cover" /> : vendorInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{vendor?.name || 'Vendor'}</p>
            {vendor?.address && <p className="mt-1 flex min-w-0 items-center gap-1 text-sm text-slate-500"><FiMapPin className="shrink-0" /><span className="truncate">{vendor.address}</span></p>}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {validUntil ? (
            <p className="flex items-center gap-1 text-sm font-medium text-slate-500"><FiCalendar className="shrink-0" />Valid until {validUntil}</p>
          ) : (
            <p className="text-sm font-medium text-slate-400">Limited time offer</p>
          )}
          {phone ? (
            <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              <FiPhone />
              <span className="truncate">Call {phone}</span>
            </a>
          ) : (
            <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">
              Contact unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
