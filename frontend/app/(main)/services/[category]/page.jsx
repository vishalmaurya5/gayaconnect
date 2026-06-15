'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { FiBriefcase, FiLock, FiMapPin, FiPhone } from 'react-icons/fi'
import { SERVICE_CATEGORIES, mergeServiceCategories, slugifyService } from '@/lib/utils/serviceCategories'

export default function ServiceCategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const initialSubcategory = searchParams.get('subCategory') || ''
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory)
  const [serviceCategories, setServiceCategories] = useState(SERVICE_CATEGORIES)
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const category = useMemo(
    () => serviceCategories.find((item) => slugifyService(item.name) === params.category),
    [params.category, serviceCategories]
  )

  useEffect(() => {
    fetchServiceCategories()
  }, [])

  useEffect(() => {
    if (category) fetchVendors()
    if (!categoriesLoading && !category) setLoading(false)
  }, [categoriesLoading, category?.name, selectedSubcategory])

  const fetchServiceCategories = async () => {
    try {
      const response = await fetch('/api/services/categories', { cache: 'no-store' })
      const data = await response.json()
      setServiceCategories(mergeServiceCategories(data.categories || []))
    } catch (error) {
      console.error(error)
      setServiceCategories(SERVICE_CATEGORIES)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchVendors = async () => {
    setLoading(true)
    const query = new URLSearchParams({ category: category.name, limit: '80' })
    if (selectedSubcategory) query.set('subCategory', selectedSubcategory)

    try {
      const response = await fetch(`/api/vendors?${query.toString()}`)
      const data = await response.json()
      setVendors(data.vendors || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (categoriesLoading) {
    return <div className="container-custom py-10"><div className="h-72 animate-pulse rounded-lg bg-slate-100" /></div>
  }

  if (!category) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Service category not found</h1>
        <Link href="/services" className="mt-4 inline-block font-semibold text-blue-700">Back to services</Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="container-custom">
        <Link href="/services" className="font-semibold text-blue-700">Back to all services</Link>
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Service Category</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">{category.name}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubcategory('')}
              className={`rounded-full px-3 py-2 text-sm font-medium ${!selectedSubcategory ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              All
            </button>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory}
                type="button"
                onClick={() => setSelectedSubcategory(subcategory)}
                className={`rounded-full px-3 py-2 text-sm font-medium ${selectedSubcategory === subcategory ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950">{selectedSubcategory || category.name} Vendors</h2>
          <span className="text-sm text-slate-500">{vendors.length} found</span>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg bg-white" />)}
          </div>
        ) : vendors.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => <ServiceVendorCard key={vendor._id} vendor={vendor} />)}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <FiBriefcase className="mx-auto text-4xl text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-950">No vendors found</h3>
            <p className="mt-2 text-slate-500">No approved vendors are available for this service yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceVendorCard({ vendor }) {
  const image = vendor.logo || vendor.images?.[0] || 'https://placehold.co/400x260?text=Vendor'
  const contact = vendor.phone || vendor.contactNumber

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <img src={image} alt={vendor.name || vendor.businessName} className="h-44 w-full object-cover" />
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-950">{vendor.name || vendor.businessName}</h3>
        <p className="mt-1 text-sm font-medium text-blue-700">{vendor.category}{vendor.subCategory ? ` / ${vendor.subCategory}` : ''}</p>
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
