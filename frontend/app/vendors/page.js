'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import VendorCard from '@/components/ui/VendorCard';
import { FiSearch } from 'react-icons/fi';
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
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Vendors</h1>
      <p className="text-gray-600 mb-8">Discover trusted local businesses in Gaya</p>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form onSubmit={(e) => { e.preventDefault(); fetchVendors(); }} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or keyword..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
            <input type="text" placeholder="Search by area or location..." value={area} onChange={(e) => setArea(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <select 
            className="w-full md:w-48 border border-gray-300 rounded-lg p-2 bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="newest">Newest First</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap">Filter</button>
        </form>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat === 'all' ? 'All' : cat}
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
