'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiCreditCard,
  FiEdit2,
  FiGift,
  FiImage,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPercent,
  FiPhone,
  FiSave,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { BANNER_POST_MONTHLY_PLAN } from '@/lib/utils/contactAccess'
import { PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_MAX_LABEL } from '@/lib/utils/imageUpload'
import { SERVICE_CATEGORIES, getSubcategoriesForCategory } from '@/lib/utils/serviceCategories'

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

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, updateUser } = useAuth()
  const [vendor, setVendor] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    profileImage: '',
    businessName: '',
    category: '',
    subCategory: '',
    businessAddress: '',
    description: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [offers, setOffers] = useState([])
  const [offersLoading, setOffersLoading] = useState(false)
  const [editingOfferId, setEditingOfferId] = useState(null)
  const [offerForms, setOfferForms] = useState({})
  const [savingOfferId, setSavingOfferId] = useState(null)
  const [deletingOfferId, setDeletingOfferId] = useState(null)
  const [bannerPaying, setBannerPaying] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    loadProfile()
  }, [authLoading, user?.id])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!data.success) throw new Error(data.message || 'Could not load profile')

      setVendor(data.vendor)
      setForm({
        name: data.user.name || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        profileImage: data.user.profileImage || '',
        businessName: data.vendor?.name || '',
        category: data.vendor?.category || '',
        subCategory: data.vendor?.subCategory || '',
        businessAddress: data.vendor?.address || '',
        description: data.vendor?.description || '',
      })

      if (data.vendor?._id) {
        loadVendorOffers(data.vendor._id)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const suggestedSubcategories = getSubcategoriesForCategory(form.category)

  const toDateInputValue = (date) => {
    if (!date) return ''
    return new Date(date).toISOString().slice(0, 10)
  }

  const loadVendorOffers = async (vendorId) => {
    setOffersLoading(true)

    try {
      const response = await fetch(`/api/offers?vendorId=${vendorId}`)
      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Could not load offers')

      setOffers(data.offers || [])
      setOfferForms(Object.fromEntries((data.offers || []).map((offer) => [
        offer._id,
        {
          title: offer.title || '',
          discountText: offer.discountText || '',
          description: offer.description || '',
          validUntil: toDateInputValue(offer.validUntil),
        },
      ])))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setOffersLoading(false)
    }
  }

  const updateOfferForm = (offerId, field, value) => {
    setOfferForms((current) => ({
      ...current,
      [offerId]: {
        ...(current[offerId] || {}),
        [field]: value,
      },
    }))
  }

  const editOffer = (offer) => {
    setEditingOfferId(offer._id)
    setOfferForms((current) => ({
      ...current,
      [offer._id]: {
        title: offer.title || '',
        discountText: offer.discountText || '',
        description: offer.description || '',
        validUntil: toDateInputValue(offer.validUntil),
      },
    }))
  }

  const saveOffer = async (offerId) => {
    setSavingOfferId(offerId)

    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerForms[offerId]),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Could not update offer')

      setOffers((current) => current.map((offer) => (
        offer._id === offerId ? { ...offer, ...data.offer, vendorId: offer.vendorId } : offer
      )))
      setEditingOfferId(null)
      toast.success('Offer updated')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSavingOfferId(null)
    }
  }

  const deleteOffer = async (offerId) => {
    if (!window.confirm('Delete this offer?')) return
    setDeletingOfferId(offerId)

    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Could not delete offer')

      setOffers((current) => current.filter((offer) => offer._id !== offerId))
      toast.success('Offer deleted')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeletingOfferId(null)
    }
  }

  const updateCategory = (value) => {
    setForm((current) => ({
      ...current,
      category: value,
      subCategory: getSubcategoriesForCategory(value).includes(current.subCategory) ? current.subCategory : '',
    }))
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Profile photo must be an image file')
      event.target.value = ''
      return
    }

    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      toast.error(`Profile photo must be less than ${PROFILE_IMAGE_MAX_LABEL}`)
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateForm('profileImage', reader.result)
    reader.readAsDataURL(file)
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Could not update profile')

      updateUser(data.user)
      setVendor(data.vendor)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const unlockBannerPosting = async () => {
    setBannerPaying(true)

    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-use-dummy-razorpay': process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === 'true' ? 'false' : 'true',
        },
        body: JSON.stringify({ provider: 'razorpay', planType: BANNER_POST_MONTHLY_PLAN }),
      })
      const orderData = await orderResponse.json()
      if (!orderData.success) throw new Error(orderData.message || 'Could not create payment order')

      if (orderData.isDummy) {
        router.push(`/dummy-razorpay?orderId=${orderData.order.id}&amount=${orderData.order.amount}&returnTo=/profile`)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load')

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: 'Monthly banner promotion',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
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
            toast.success('Banner posting unlocked for 1 month')
          } catch (error) {
            toast.error(error.message)
          }
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
      setBannerPaying(false)
    }
  }

  const [subscriptionPaying, setSubscriptionPaying] = useState(false)

  const unlockSubscription = async () => {
    setSubscriptionPaying(true)

    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-use-dummy-razorpay': process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === 'true' ? 'false' : 'true',
        },
        body: JSON.stringify({ provider: 'razorpay', planType: 'subscription_monthly' }),
      })
      const orderData = await orderResponse.json()
      if (!orderData.success) throw new Error(orderData.message || 'Could not create payment order')

      if (orderData.isDummy) {
        router.push(`/dummy-razorpay?orderId=${orderData.order.id}&amount=${orderData.order.amount}&returnTo=/profile`)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load')

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: 'Monthly Platform Subscription',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
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
          } catch (error) {
            toast.error(error.message)
          }
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
      setSubscriptionPaying(false)
    }
  }

  if (authLoading || loading || !user) {
    return <div className="container-custom py-10"><div className="h-72 animate-pulse rounded-lg bg-slate-100" /></div>
  }

  const supportWhatsapp = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '917667328993').replace(/\D/g, '')
  const bannerMessage = encodeURIComponent(
    `Hello Gaya Connect, I want to post a banner ad. Business: ${form.businessName || user?.name || ''}. Please share banner posting details.`
  )
  const bannerContactHref = `https://wa.me/${supportWhatsapp}?text=${bannerMessage}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf3] via-[#f4fce8] to-[#e8f5e9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white/60 p-6 shadow-sm backdrop-blur-xl border border-green-200/50">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-600">Dashboard</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">{user.role === 'vendor' ? 'Vendor Workspace' : 'My Profile'}</h1>
            <p className="mt-1 text-slate-600 text-sm">View your details and manage your active presence.</p>
          </div>
          {user.role === 'vendor' && (
            <div className="flex flex-wrap gap-3">
              <Link href="/offers/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-5 py-2.5 font-bold text-yellow-950 shadow-md transition hover:scale-105 hover:shadow-lg">
                <FiGift /> Post Offer
              </Link>
              {user?.hasBannerPostAccess ? (
                <Link href={bannerContactHref} target={supportWhatsapp ? '_blank' : undefined} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                  <FiImage /> Post Banner
                </Link>
              ) : (
                <button onClick={unlockBannerPosting} disabled={bannerPaying} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:opacity-70">
                  <FiImage /> {bannerPaying ? 'Opening...' : 'Unlock Banner'}
                </button>
              )}
            </div>
          )}
        </div>

        <form onSubmit={saveProfile} className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-green-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer">
                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-100 to-yellow-100 text-green-600 ring-4 ring-white shadow-md">
                  {form.profileImage ? <img src={form.profileImage} alt="Profile" className="h-full w-full object-cover" /> : <FiUser className="text-5xl" />}
                </div>
                <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition group-hover:scale-110 group-hover:bg-green-600">
                  <FiCamera className="text-lg" />
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{form.businessName || form.name}</h2>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-800">
                {user.role}
              </p>
              <p className="mt-4 text-xs text-slate-500">Tap the camera icon to change your photo.<br/>Max size: {PROFILE_IMAGE_MAX_LABEL}</p>
            </div>

            <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white shadow-xl transition hover:bg-slate-800 disabled:opacity-70">
              <FiSave className="text-xl" />
              {saving ? 'Saving changes...' : 'Save Allowed Changes'}
            </button>
          </section>

          <section className="space-y-8">
            <div className="rounded-3xl border border-yellow-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600"><FiUser /></span>
                Personal Details
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field icon={FiUser} label="Full name (Read Only)">
                  <input className="input-field pl-10 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" value={form.name} disabled />
                </Field>
                <Field icon={FiPhone} label="Phone number (Read Only)">
                  <input className="input-field pl-10 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" value={form.phone} disabled />
                </Field>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field icon={FiMail} label="Email (Read Only)">
                  <input className="input-field pl-10 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" value={user.email} disabled />
                </Field>
                <Field icon={FiMapPin} label="Personal Address (Editable)">
                  <input className="input-field pl-10 focus:border-green-500 focus:ring-green-500" value={form.address} onChange={(event) => updateForm('address', event.target.value)} placeholder="Your area or city" />
                </Field>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
              <div className="relative z-10">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><FiCreditCard /></span>
                  Subscription Details
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
                    <p className={`font-semibold text-lg ${user.subscriptionActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.subscriptionActive ? 'Active' : 'Inactive / Expired'}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Expiry Date</label>
                    <p className="font-semibold text-lg text-slate-800">
                      {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                {!user.subscriptionActive && (
                  <div className="mt-6">
                    <button 
                      type="button"
                      onClick={unlockSubscription}
                      disabled={subscriptionPaying}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {subscriptionPaying ? 'Processing...' : 'Renew ₹11/month'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {user.role === 'vendor' && (
              <div className="rounded-3xl border border-green-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-100 blur-3xl"></div>
                <div className="relative z-10">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600"><FiBriefcase /></span>
                    Business Details
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field icon={FiBriefcase} label="Business Name (Editable)">
                      <input className="input-field pl-10 focus:border-green-500 focus:ring-green-500" value={form.businessName} onChange={(event) => updateForm('businessName', event.target.value)} />
                    </Field>
                    <Field icon={FiMapPin} label="Business Address (Editable)">
                      <input className="input-field pl-10 focus:border-green-500 focus:ring-green-500" value={form.businessAddress} onChange={(event) => updateForm('businessAddress', event.target.value)} />
                    </Field>
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Category (Read Only)</label>
                      <input className="input-field bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" value={form.category} disabled />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Subcategory (Read Only)</label>
                      <input className="input-field bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" value={form.subCategory} disabled />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-bold text-slate-700">Business Description (Read Only)</label>
                    <textarea className="input-field min-h-[120px] bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" value={form.description} disabled />
                  </div>
                </div>
              </div>
            )}
          </section>
        </form>

        {user.role === 'vendor' && (
          <VendorPromotionPlans
            user={user}
            paying={bannerPaying}
            onPayBanner={unlockBannerPosting}
          />
        )}

        {user.role === 'vendor' && (
          <section className="mt-8 rounded-3xl border border-green-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Manage Posted Offers</h2>
                <p className="mt-1 text-sm text-slate-500">Edit or remove your existing promotional offers.</p>
              </div>
            </div>

            {offersLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, index) => <div key={index} className="h-52 animate-pulse rounded-2xl bg-green-50" />)}
              </div>
            ) : offers.length ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {offers.map((offer) => (
                  <VendorOfferCard
                    key={offer._id}
                    offer={offer}
                    form={offerForms[offer._id] || {}}
                    isEditing={editingOfferId === offer._id}
                    isSaving={savingOfferId === offer._id}
                    isDeleting={deletingOfferId === offer._id}
                    onEdit={() => editOffer(offer)}
                    onCancel={() => setEditingOfferId(null)}
                    onSave={() => saveOffer(offer._id)}
                    onDelete={() => deleteOffer(offer._id)}
                    onChange={(field, value) => updateOfferForm(offer._id, field, value)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 p-10 text-center">
                <FiGift className="mx-auto text-4xl text-green-300" />
                <h3 className="mt-4 font-bold text-slate-900 text-lg">No offers posted yet</h3>
                <p className="mt-1 text-slate-500">Create your first offer to attract local customers.</p>
                <Link href="/offers/new" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-2 font-bold text-yellow-950 transition hover:bg-yellow-500">
                  <FiGift /> Post Offer Now
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function VendorOfferCard({
  offer,
  form,
  isEditing,
  isSaving,
  isDeleting,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
}) {
  const validUntil = offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'No end date'

  return (
    <article className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {isEditing ? (
        <div className="space-y-4">
          <Field icon={FiGift} label="Offer title">
            <input className="input-field pl-10 focus:border-green-500 focus:ring-green-500" value={form.title || ''} onChange={(event) => onChange('title', event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field icon={FiPercent} label="Discount">
              <input className="input-field pl-10 focus:border-green-500 focus:ring-green-500" value={form.discountText || ''} onChange={(event) => onChange('discountText', event.target.value)} />
            </Field>
            <Field icon={FiCalendar} label="Valid until">
              <input type="date" className="input-field pl-10 focus:border-green-500 focus:ring-green-500" value={form.validUntil || ''} onChange={(event) => onChange('validUntil', event.target.value)} />
            </Field>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
            <textarea className="input-field min-h-[110px] focus:border-green-500 focus:ring-green-500" value={form.description || ''} onChange={(event) => onChange('description', event.target.value)} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-2">
            <button type="button" onClick={onCancel} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-slate-700 transition hover:bg-slate-50">
              <FiX /> Cancel
            </button>
            <button type="button" onClick={onSave} disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white transition hover:bg-green-700 disabled:opacity-70">
              <FiSave /> {isSaving ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
                <FiPercent className="shrink-0" />
                <span className="truncate">{offer.discountText}</span>
              </span>
              <h3 className="mt-3 break-words text-xl font-bold leading-snug text-slate-900">{offer.title}</h3>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={onEdit} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-green-100 hover:text-green-700" aria-label="Edit offer">
                <FiEdit2 />
              </button>
              <button type="button" onClick={onDelete} disabled={isDeleting} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-60" aria-label="Delete offer">
                <FiTrash2 />
              </button>
            </div>
          </div>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{offer.description}</p>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 font-medium"><FiCalendar className="text-slate-400" /> Expires: {validUntil}</span>
            {isDeleting && <span className="font-bold text-red-500">Deleting...</span>}
          </div>
        </>
      )}
    </article>
  )
}

function VendorPromotionPlans({ user, paying, onPayBanner }) {
  const supportWhatsapp = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '917667328993').replace(/\D/g, '')
  const bannerMessage = encodeURIComponent(
    `Hello Gaya Connect, I want to post a banner ad. Business: ${user?.name || ''}. Please share banner posting details.`
  )
  const bannerContactHref = `https://wa.me/${supportWhatsapp}?text=${bannerMessage}`

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-yellow-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-100 blur-3xl opacity-60"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 shadow-md">
              <FiGift className="text-2xl" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">Vendor Offers</p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Post Offers</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Publish deals on the main platform to attract customers. Managed easily from your profile.
              </p>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <Link href="/offers/new" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 font-bold text-yellow-950 shadow-sm transition hover:bg-yellow-500 hover:shadow">
              <FiGift /> Create New Offer
            </Link>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-green-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-green-100 blur-3xl opacity-60"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md">
              <FiImage className="text-2xl" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-green-600">Banner Promotion</p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Post Banner</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Get premium visibility with a home page banner ad. Image, offer text, and direct call-to-action link included.
              </p>
            </div>
          </div>
          <div className="mt-auto pt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            {user?.hasBannerPostAccess ? (
              <Link href={bannerContactHref} target={supportWhatsapp ? '_blank' : undefined} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-green-700">
                <FiMessageCircle /> Send Banner Details
              </Link>
            ) : (
              <button
                type="button"
                onClick={onPayBanner}
                disabled={paying}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiCreditCard /> {paying ? 'Processing...' : 'Pay Rs. 399 / Month'}
              </button>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        {children}
      </div>
    </div>
  )
}
