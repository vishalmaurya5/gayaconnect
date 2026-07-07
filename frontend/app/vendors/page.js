'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import VendorCard from '@/components/ui/VendorCard';
import { FiSearch, FiMapPin, FiFilter } from 'react-icons/fi';
import { SERVICE_CATEGORIES } from '@/lib/utils/serviceCategories';

const categories = ['all', ...SERVICE_CATEGORIES.map((category) => category.name)];

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="container-custom py-8">Loading vendors...</div>}>
      <VendorsContent />
    </Suspense>
  );
}

function VendorsContent() {
  const searchParams = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => { fetchVendors(); }, [category, sort]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      if (area) params.set('area', area);
      if (sort) params.set('sort', sort);
      params.set('limit', '20');
      const res = await fetch(`/api/vendors?${params.toString()}`);
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Discover Local Experts</h1>
        <p className="text-slate-500 text-lg">Find trusted professionals and businesses in your area</p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto mb-10">
        <form 
          onSubmit={(e) => { e.preventDefault(); fetchVendors(); }} 
          className="flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-2 md:p-1.5 gap-2 md:gap-0 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          {/* Search Keyword */}
          <div className="flex-1 w-full relative flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-slate-100 group">
            <FiSearch className="text-slate-400 text-xl shrink-0 mr-3 group-focus-within:text-indigo-600 transition-colors" />
            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">What</label>
              <input 
                type="text" 
                placeholder="Services, business, keywords" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm md:text-base font-semibold text-slate-800 placeholder:text-slate-300 outline-none" 
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex-1 w-full relative flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-slate-100 group">
            <FiMapPin className="text-slate-400 text-xl shrink-0 mr-3 group-focus-within:text-indigo-600 transition-colors" />
            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Where</label>
              <input 
                type="text" 
                placeholder="City, neighborhood, zip" 
                value={area} 
                onChange={(e) => setArea(e.target.value)} 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm md:text-base font-semibold text-slate-800 placeholder:text-slate-300 outline-none" 
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto relative flex items-center px-4 py-3 md:py-2 group">
            <FiFilter className="text-slate-400 text-xl shrink-0 mr-3 md:hidden group-focus-within:text-indigo-600 transition-colors" />
            <div className="w-full md:w-40">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sort By</label>
              <select 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-slate-700 cursor-pointer outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button 
            type="submit" 
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl md:rounded-full px-8 py-4 md:py-3.5 font-bold transition-all shadow-md hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <FiSearch className="md:hidden text-lg" />
            Search
          </button>
        </form>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)} 
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (<div key={i} className="animate-pulse"><div className="bg-gray-200 h-48 rounded-t-xl"></div><div className="bg-white p-4 rounded-b-xl"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></div>))}
        </div>
      ) : vendors.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors.map((vendor) => (<VendorCard key={vendor._id} vendor={vendor} />))}
        </div>
      ) : (
        <div className="text-center py-16"><p className="text-gray-400 text-lg">No vendors found</p></div>
      )}
    </div>
  );
}
