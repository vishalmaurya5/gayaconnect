'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiImage, FiUploadCloud, FiLink, FiSend, FiInfo } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

export default function UploadBannerPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    linkUrl: '',
    position: 'home_top',
    targetCategory: '',
  })
  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login?type=vendor')
      return
    }
    
    // Check vendor status instead of user object
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.vendor?.bannerStatus === 'approved') {
          setIsCheckingAccess(false)
        } else {
          toast.error('You do not have approved banner access.')
          router.push('/vendor/banners/pricing')
        }
      })
      .catch(() => {
        router.push('/vendor/dashboard')
      })
      
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.categories || [])
        }
      })
      .catch(err => console.error("Failed to load categories", err))
  }, [loading, user, router])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image is too large. Max 2MB.')
        e.target.value = ''
        return
      }
      
      const objectUrl = URL.createObjectURL(file)
      const img = new window.Image()
      img.onload = () => {
        if (img.width <= img.height) {
          toast.error('Please upload a landscape image (width must be greater than height).')
          e.target.value = ''
          URL.revokeObjectURL(objectUrl)
          return
        }
        
        setImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        URL.revokeObjectURL(objectUrl)
      }
      img.onerror = () => {
        toast.error('Invalid image file.')
        e.target.value = ''
        URL.revokeObjectURL(objectUrl)
      }
      img.src = objectUrl
    }
  }

  const submitBanner = async (e) => {
    e.preventDefault()
    if (!form.title || !image) {
      toast.error('Please provide a title and an image')
      return
    }

    if (form.position === 'category_top' && !form.targetCategory) {
      toast.error('Please select a target category')
      return
    }

    setSubmitting(true)
    try {
      const payload = { ...form, imageUrl: imagePreview };
      if (form.position !== 'category_top') payload.targetCategory = '';

      const response = await fetch('/api/vendor/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Failed to upload banner')

      toast.success('Banner uploaded successfully! Awaiting Admin approval.')
      router.push('/vendor/dashboard')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || isCheckingAccess) return <div className="container-custom py-10"><div className="h-72 animate-pulse rounded-2xl bg-slate-100" /></div>

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-custom max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Banner Management</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight">Upload Your Banner</h1>
          <p className="mt-2 text-slate-600 text-lg">Submit your advertisement banner. It will go live once approved by an admin.</p>
        </div>

        {/* Design Guidelines Note */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3 shadow-sm">
          <FiInfo className="text-blue-600 mt-1 shrink-0 text-xl" />
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">Design Guidelines for Perfect Fit</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Optimal Size:</strong> 1200px Width × 400px Height (3:1 Ratio)</li>
              <li>• <strong>Safe Zone:</strong> Keep important text and logos in the <strong>center</strong> of the image so they don't get cut off on mobile devices.</li>
              <li>• <strong>Format:</strong> Only Landscape JPG/JPEG format allowed (Max 2MB).</li>
            </ul>
          </div>
        </div>

        <form onSubmit={submitBanner} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Banner Image (Desktop/Mobile)</label>
              <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 hover:border-emerald-500 transition relative overflow-hidden bg-slate-50 cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageChange}
                />
                <div className="text-center z-10 pointer-events-none">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-sm" />
                  ) : (
                    <>
                      <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                        <span className="relative rounded-md font-semibold text-emerald-600 focus-within:outline-none hover:text-emerald-500">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500 font-medium">Landscape format only, up to 2MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Banner Title</label>
              <input className="input-field rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Summer Sale 50% Off" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Target Link URL (Optional)</label>
              <div className="relative">
                <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input type="url" className="input-field pl-11 rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://yourwebsite.com/offer" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Position</label>
              <select className="input-field rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                <option value="home_top">Home Top</option>
                <option value="home_middle">Home Middle</option>
                <option value="category_top">Category Top</option>
                <option value="community">Community</option>
              </select>
            </div>
            
            {form.position === 'category_top' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="mb-2 block text-sm font-bold text-slate-700">Target Category</label>
                <select className="input-field rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" value={form.targetCategory} onChange={(e) => setForm({ ...form, targetCategory: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500">Your banner will only be displayed on this specific category's page.</p>
              </div>
            )}
            
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Description (Optional)</label>
              <textarea className="input-field min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Any specific notes for the admin..." />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
            <FiSend className="text-xl" />
            {submitting ? 'Uploading...' : 'Submit Banner Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
