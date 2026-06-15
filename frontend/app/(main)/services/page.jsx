'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FiBriefcase, FiLock, FiMapPin, FiPhone, FiSearch } from 'react-icons/fi'
import { SERVICE_CATEGORIES, mergeServiceCategories, slugifyService } from '@/lib/utils/serviceCategories'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [search, setSearch] = useState('')
  const [vendors, setVendors] = useState([])
  const [serviceCategories, setServiceCategories] = useState(SERVICE_CATEGORIES)
  const [loading, setLoading] = useState(false)

  const activeCategory = useMemo(
    () => serviceCategories.find((category) => category.name === selectedCategory),
    [serviceCategories, selectedCategory]
  )

  useEffect(() => {
    fetchServiceCategories()
  }, [])

  useEffect(() => {
    fetchVendors()
  }, [selectedCategory, selectedSubcategory])

  const fetchServiceCategories = async () => {
    try {
      const response = await fetch('/api/services/categories', { cache: 'no-store' })
      const data = await response.json()
      setServiceCategories(mergeServiceCategories(data.categories || []))
    } catch (error) {
      console.error(error)
      setServiceCategories(SERVICE_CATEGORIES)
    }
  }

  const fetchVendors = async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '60' })
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedSubcategory) params.set('subCategory', selectedSubcategory)
    if (search.trim()) params.set('search', search.trim())

    try {
      const response = await fetch(`/api/vendors?${params.toString()}`)
      const data = await response.json()
      setVendors(data.vendors || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const selectCategory = (categoryName) => {
    setSelectedCategory(categoryName)
    setSelectedSubcategory('')
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Services</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Browse Services by Category</h1>
          <p className="mt-2 text-slate-600">Choose a category and subcategory to find matching vendors in the database.</p>
        </div>

        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <form onSubmit={(event) => { event.preventDefault(); fetchVendors() }} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-field pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search shop name, category, subcategory, address"
              />
            </div>
            <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Search</button>
          </form>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-950">Categories</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceCategories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => selectCategory(category.name)}
                  className={`rounded-lg border p-4 text-left transition ${
                    selectedCategory === category.name
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-950">{category.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{category.subcategories.length}</span>
                  </div>
                  <Link href={`/services/${slugifyService(category.name)}`} className="mt-2 inline-block text-sm font-semibold text-blue-700">
                    Open category
                  </Link>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-bold text-slate-950">{selectedCategory || 'Select a category'}</h2>
              {(selectedCategory || selectedSubcategory) && (
                <button type="button" onClick={() => { setSelectedCategory(''); setSelectedSubcategory('') }} className="text-sm font-semibold text-blue-700">
                  Clear
                </button>
              )}
            </div>
            {activeCategory ? (
              <div className="flex flex-wrap gap-2">
                {activeCategory.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    type="button"
                    onClick={() => setSelectedSubcategory(subcategory)}
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                      selectedSubcategory === subcategory
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Pick a category to see its subcategories.</p>
            )}
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Matching Vendors</h2>
            <span className="text-sm text-slate-500">{vendors.length} found</span>
          </div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg bg-white" />)}
            </div>
          ) : vendors.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => <ServiceVendorCard key={vendor._id} vendor={vendor} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <FiBriefcase className="mx-auto text-4xl text-slate-300" />
              <h3 className="mt-4 text-lg font-bold text-slate-950">No vendors found</h3>
              <p className="mt-2 text-slate-500">Try another category, subcategory, or search term.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ServiceVendorCard({ vendor }) {
  const image = vendor.logo || vendor.images?.[0] || vendor.profileImage || 'https://placehold.co/400x260?text=Vendor'
  const contact = vendor.phone || vendor.contactNumber

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <img src={image} alt={vendor.name || vendor.businessName} className="h-44 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">{vendor.name || vendor.businessName}</h3>
            <p className="mt-1 text-sm font-medium text-blue-700">{vendor.category}{vendor.subCategory ? ` / ${vendor.subCategory}` : ''}</p>
          </div>
        </div>
        {vendor.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{vendor.description}</p>}
        {vendor.address && <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><FiMapPin />{vendor.address}</p>}
        <div className="mt-4 flex items-center justify-between gap-3">
          {contact ? (
            <a href={`tel:${contact}`} className="inline-flex items-center gap-2 font-semibold text-green-700"><FiPhone />{contact}</a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><FiLock />Contact locked</span>
          )}
          <Link href={`/vendors/${vendor._id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
