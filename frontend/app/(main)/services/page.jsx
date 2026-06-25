'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FiBriefcase, FiSearch, FiGrid, FiArrowRight } from 'react-icons/fi'
import { SERVICE_CATEGORIES, mergeServiceCategories, slugifyService } from '@/lib/utils/serviceCategories'
import VendorCard from '@/components/ui/VendorCard'
import { useAuth } from '@/contexts/AuthContext'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [search, setSearch] = useState('')
  const [vendors, setVendors] = useState([])
  const [serviceCategories, setServiceCategories] = useState(SERVICE_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

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
    if (selectedCategory === categoryName) {
      setSelectedCategory('') // toggle off
    } else {
      setSelectedCategory(categoryName)
    }
    setSelectedSubcategory('')
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    fetchVendors()
  }

  return (
    <div className="bg-[#F8F9FC] min-h-screen pb-20">
      {/* Premium Hero Section */}
      <section className="relative bg-slate-900 pt-10 pb-16 overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent blur-[100px] pointer-events-none"></div>
        
        <div className="container-custom relative z-10 text-center px-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-[11px] uppercase tracking-widest mb-4">
            <FiGrid /> Professional Directory
          </div>
          
          <h1 className="text-3xl md:text-5xl font-sora font-extrabold text-white mb-4 leading-tight">
            {user?.name ? (
              <>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user.name.split(' ')[0]}</span>.</>
            ) : (
              <>Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Professional</span> for your needs.</>
            )}
          </h1>
          <p className="text-base md:text-lg text-slate-300 font-medium max-w-2xl mx-auto">
            Browse our extensive directory of verified vendors, mechanics, artists, and experts across Gaya.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-custom max-w-[1536px] px-5 lg:px-10 mx-auto -mt-10 relative z-20">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
          
          {/* Sidebar: Categories */}
          <aside className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 h-fit sticky top-24">
            <h2 className="font-sora font-extrabold text-xl text-slate-900 mb-6 flex items-center gap-2">
              <FiGrid className="text-indigo-600" /> Categories
            </h2>
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {serviceCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => selectCategory(category.name)}
                  className={`group flex items-center justify-between w-full p-3.5 rounded-xl font-bold text-[13px] transition-all text-left ${
                    selectedCategory === category.name
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="line-clamp-1 pr-2">{category.name}</span>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                    selectedCategory === category.name 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {category.subcategories.length}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Feed: Subcategories & Vendors */}
          <main>
            {/* Search & Dynamic Subcategory Pills */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 mb-8">
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5 mb-5 transition-all focus-within:bg-white focus-within:border-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-500/10">
                <div className="pl-4 pr-2 text-slate-400">
                  <FiSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none text-slate-800 px-2 py-3 focus:ring-0 placeholder:text-slate-400 outline-none font-medium text-base"
                  placeholder="Search by shop name, category, location, or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2">
                  Search <span className="hidden sm:inline">Now</span>
                </button>
              </form>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sora font-bold text-sm text-slate-500 uppercase tracking-wider">
                  {selectedCategory ? `${selectedCategory} Sub-categories` : 'Popular Filters'}
                </h3>
                {(selectedCategory || selectedSubcategory || search) && (
                  <button 
                    onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); setSearch(''); fetchVendors(); }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeCategory ? (
                  activeCategory.subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => setSelectedSubcategory(subcategory === selectedSubcategory ? '' : subcategory)}
                      className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${
                        selectedSubcategory === subcategory
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))
                ) : (
                  <p className="text-sm font-medium text-slate-500 py-2">
                    Please select a main category from the sidebar to view its specific sub-categories and refine your search.
                  </p>
                )}
              </div>
            </div>

            {/* Vendor Grid */}
            <div className="mb-6 flex items-center justify-between px-2">
              <h2 className="text-2xl font-sora font-extrabold text-slate-900">
                {search ? `Results for "${search}"` : selectedSubcategory ? selectedSubcategory : selectedCategory ? `${selectedCategory} Vendors` : 'All Vendors'}
              </h2>
              <span className="text-sm font-bold text-slate-500 bg-slate-200/70 px-4 py-1.5 rounded-full border border-slate-200">
                {vendors.length} {vendors.length === 1 ? 'Result' : 'Results'}
              </span>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => <div key={index} className="h-[340px] animate-pulse rounded-3xl bg-slate-200/60 border border-slate-100" />)}
              </div>
            ) : vendors.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {vendors.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm mt-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiBriefcase className="text-4xl text-slate-300" />
                </div>
                <h3 className="text-2xl font-sora font-bold text-slate-800 mb-2">No vendors found</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  We couldn't find any professionals matching your current filters or search terms. Try clearing them and searching again.
                </p>
                <button 
                  onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); setSearch(''); fetchVendors(); }}
                  className="mt-6 text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-2"
                >
                  View All Vendors <FiArrowRight />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
