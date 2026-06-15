'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiBriefcase, FiHome, FiLock, FiMail, FiMapPin, FiPhone, FiUser, FiUserPlus, FiUsers } from 'react-icons/fi'
import { SERVICE_CATEGORIES, getSubcategoriesForCategory } from '@/lib/utils/serviceCategories'

const accountTypes = [
  {
    role: 'user',
    label: 'Customer',
    icon: FiUsers,
    title: 'Create a customer account',
    description: 'Discover local services, vendors, hotels, and deals around Gaya.',
  },
  {
    role: 'vendor',
    label: 'Vendor',
    icon: FiBriefcase,
    title: 'Register your business',
    description: 'List your business, receive customer enquiries, and grow your local reach.',
  },
]

export default function RegisterPage({ searchParams }) {
  const [selectedRole, setSelectedRole] = useState(searchParams?.type === 'vendor' ? 'vendor' : 'user')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    category: '',
    subCategory: '',
    address: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const selectedType = accountTypes.find((type) => type.role === selectedRole)
  const suggestedSubcategories = getSubcategoriesForCategory(form.category)

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateCategory = (value) => {
    setForm((current) => ({
      ...current,
      category: value,
      subCategory: getSubcategoriesForCategory(value).includes(current.subCategory) ? current.subCategory : '',
    }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required'
    if (!form.email.includes('@')) return 'Enter a valid email address'
    if (!form.phone.trim()) return 'Phone number is required'
    if (!form.address.trim()) return 'Address is required'
    if (form.password.length < 8) return 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'

    if (selectedRole === 'vendor') {
      if (!form.businessName.trim()) return 'Business name is required'
      if (!form.category.trim()) return 'Business category is required'
      if (!form.subCategory.trim()) return 'Business subcategory is required'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationMessage = validate()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: selectedRole,
          businessName: form.businessName,
          category: form.category,
          subCategory: form.subCategory,
          address: form.address,
          description: form.description,
        }),
      })
      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Registration failed')
        return
      }

      if (selectedRole === 'user') {
        toast.success('Thank You, registration is successful')
      } else {
        toast.success(data.message || 'Account created. You can now login.')
      }
      
      router.push(`/login?type=${selectedRole}`)
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center font-sans">
      
      <div className="w-full max-w-xl my-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h1>
          <p className="mt-2 text-slate-600 font-medium">Join Gaya Connect to discover or list services</p>
        </div>

        <div className="rounded-2xl bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          {/* Account Type Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            {accountTypes.map((type) => (
              <button
                key={type.role}
                type="button"
                onClick={() => setSelectedRole(type.role)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all ${
                  selectedRole === type.role
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-900/5'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <type.icon className={selectedRole === type.role ? 'text-emerald-600 text-lg' : 'text-lg'} />
                {type.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 flex items-center gap-2">
              <FiUserPlus className="text-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={FiUser} label="Full Name">
                <input className={inputClasses} value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="John Doe" />
              </Field>
              <Field icon={FiPhone} label="Mobile Number">
                <input type="tel" className={inputClasses} value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="+91 9876543210" />
              </Field>
            </div>

            <Field icon={FiMail} label="Email Address">
              <input type="email" className={inputClasses} value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="you@example.com" />
            </Field>

            <Field icon={FiMapPin} label={selectedRole === 'vendor' ? 'Business Address' : 'Your Address'}>
              <input className={inputClasses} value={form.address} onChange={(event) => updateForm('address', event.target.value)} placeholder={selectedRole === 'vendor' ? 'Shop location in Gaya' : 'Your residential area'} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={FiLock} label="Password">
                <input type="password" className={inputClasses} value={form.password} onChange={(event) => updateForm('password', event.target.value)} placeholder="Min. 8 characters" />
              </Field>
              <Field icon={FiLock} label="Confirm Password">
                <input type="password" className={inputClasses} value={form.confirmPassword} onChange={(event) => updateForm('confirmPassword', event.target.value)} placeholder="Repeat password" />
              </Field>
            </div>

            {selectedRole === 'vendor' && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <FiBriefcase className="text-emerald-600" /> Business Details
                </h3>
                <div className="space-y-5">
                  <Field icon={FiHome} label="Business Name">
                    <input className={inputClasses} value={form.businessName} onChange={(event) => updateForm('businessName', event.target.value)} placeholder="Your shop or service name" />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiBriefcase className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                          className={inputClasses}
                          list="category-options"
                          value={form.category}
                          onChange={(event) => updateCategory(event.target.value)}
                          placeholder="Select category"
                        />
                      </div>
                      <datalist id="category-options">
                        {SERVICE_CATEGORIES.map((category) => (
                          <option key={category.name} value={category.name} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">Subcategory</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiBriefcase className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                          className={inputClasses}
                          list="subcategory-options"
                          value={form.subCategory}
                          onChange={(event) => updateForm('subCategory', event.target.value)}
                          placeholder="Select subcategory"
                        />
                      </div>
                      <datalist id="subcategory-options">
                        {suggestedSubcategories.map((subcategory) => (
                          <option key={subcategory} value={subcategory} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Short Description</label>
                    <textarea
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium min-h-[100px] resize-y"
                      value={form.description}
                      onChange={(event) => updateForm('description', event.target.value)}
                      placeholder="Briefly tell customers what you offer..."
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 mt-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating account...
                </>
              ) : (
                `Create ${selectedType.label} Account`
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-medium border-t border-slate-100 pt-6">
            Already registered?{' '}
            <Link href={`/login?type=${selectedRole}`} className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10" />
        </div>
        {children}
      </div>
    </div>
  )
}
