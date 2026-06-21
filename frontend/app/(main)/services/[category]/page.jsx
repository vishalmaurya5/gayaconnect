'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { FiBriefcase } from 'react-icons/fi'
import { SERVICE_CATEGORIES, mergeServiceCategories, slugifyService } from '@/lib/utils/serviceCategories'
import VendorCard from '@/components/ui/VendorCard'

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
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="container-custom max-w-[1440px] px-5 lg:px-10 mx-auto">
        <Link href="/services" className="font-semibold text-indigo-700 hover:text-indigo-800 transition-colors">← Back to all services</Link>
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-2">Service Category</p>
          <h1 className="text-3xl md:text-4xl font-sora font-bold text-slate-900">{category.name}</h1>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubcategory('')}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${!selectedSubcategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All
            </button>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory}
                type="button"
                onClick={() => setSelectedSubcategory(subcategory)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${selectedSubcategory === subcategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between mb-6">
          <h2 className="text-2xl font-sora font-bold text-slate-900">{selectedSubcategory || category.name} Providers</h2>
          <span className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">{vendors.length} found</span>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, index) => <div key={index} className="h-80 animate-pulse rounded-[24px] bg-slate-200" />)}
          </div>
        ) : vendors.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vendors.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)}
          </div>
        ) : (
          <div className="mt-5 rounded-[24px] border-2 border-dashed border-slate-300 bg-white p-16 text-center">
            <FiBriefcase className="mx-auto text-5xl text-slate-300 mb-4" />
            <h3 className="text-xl font-sora font-bold text-slate-900">No vendors found</h3>
            <p className="mt-2 text-slate-500 font-medium max-w-md mx-auto">No approved vendors are available for this specific service yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
