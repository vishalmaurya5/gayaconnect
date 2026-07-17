'use client';

import { useState, useEffect } from 'react';
import { FiTag, FiMapPin, FiMessageCircle, FiPhone, FiInfo, FiX, FiGrid, FiSearch, FiDollarSign } from 'react-icons/fi';
import { JOB_SALE_CATEGORIES } from '@/lib/utils/jobSaleCategories';

const ADMIN_PHONE = '+919117588242';

export default function MarketplacePage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationInput, setLocationInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSales();
    }, 400);
    return () => clearTimeout(timer);
  }, [categoryFilter, locationInput, searchInput, sortOrder]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/jobs', window.location.origin);
      url.searchParams.append('type', 'sale');
      if (categoryFilter !== 'all') url.searchParams.append('category', categoryFilter);
      if (locationInput) url.searchParams.append('location', locationInput);
      if (searchInput) url.searchParams.append('search', searchInput);
      if (sortOrder) url.searchParams.append('sort', sortOrder);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setSales(data.jobs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (type, title) => {
    const text = encodeURIComponent(`Hi, I am interested in buying the item/service: "${title}" on Gaya Seva.`);
    if (type === 'whatsapp') {
      window.open(`https://wa.me/${ADMIN_PHONE.replace(/[^0-9]/g, "")}?text=${text}`, '_blank');
    } else {
      window.location.href = `tel:${ADMIN_PHONE}`;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#05080f] pt-24 pb-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Buy & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Sell</span> Marketplace
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Discover exclusive products, real estate, and items for sale directly from our verified local vendors.
          </p>
          
          <div className="flex flex-col flex-1 w-full gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <form onSubmit={(e) => { e.preventDefault(); fetchSales(); }} className="flex flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="px-3 flex items-center text-slate-400 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700">
                  <FiSearch />
                </div>
                <input 
                  type="text" 
                  placeholder="Search products, services..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-medium text-slate-700 dark:text-slate-200 bg-transparent placeholder:text-slate-400 min-w-0"
                />
              </form>

              <form onSubmit={(e) => { e.preventDefault(); fetchSales(); }} className="flex flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="px-3 flex items-center text-slate-400 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700">
                  <FiMapPin />
                </div>
                <input 
                  type="text" 
                  placeholder="Location (e.g. Bodh Gaya)" 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-medium text-slate-700 dark:text-slate-200 bg-transparent placeholder:text-slate-400 min-w-0"
                />
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="px-3 flex items-center text-slate-400 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700">
                  <FiGrid />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-medium text-slate-700 dark:text-slate-200 bg-transparent cursor-pointer min-w-0"
                >
                  <option value="all">All Categories</option>
                  {JOB_SALE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="px-3 flex items-center text-slate-400 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700">
                  <FiDollarSign />
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none font-medium text-slate-700 dark:text-slate-200 bg-transparent cursor-pointer min-w-0"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
          
          {(searchInput || locationInput || categoryFilter !== 'all' || sortOrder !== 'newest') && (
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => {
                  setSearchInput('');
                  setLocationInput('');
                  setCategoryFilter('all');
                  setSortOrder('newest');
                }}
                className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors px-3 py-1 bg-rose-50 dark:bg-rose-900/20 rounded-md"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : sales.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
            {sales.map(sale => (
              <div 
                key={sale._id} 
                onClick={() => setSelectedSale(sale)}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="h-2 w-full shrink-0 bg-green-500"></div>
                {sale.image && (
                  <div className="w-full h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-700">
                    <img src={sale.image} alt={sale.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <FiTag /> Sale
                      </span>
                      {sale.category && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          {sale.category}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {sale.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                    {sale.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {sale.salaryOrPrice && (
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                          <FiTag />
                        </div>
                        Price:  
                        <span className="text-slate-900 dark:text-white">
                          {/^[₹$£€]/.test(sale.salaryOrPrice) || /rs/i.test(sale.salaryOrPrice) ? sale.salaryOrPrice : `₹ ${sale.salaryOrPrice}`}
                        </span>
                      </div>
                    )}
                    
                    {sale.location && (
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                        <div className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <FiMapPin />
                        </div>
                        {sale.location}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-3 mb-4 flex items-start gap-2">
                      <FiInfo className="text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-500">
                        To ensure security, please contact the Gaya Seva admin to purchase.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleContact('whatsapp', sale.title); }}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                      >
                        <FiMessageCircle /> WhatsApp Admin
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleContact('call', sale.title); }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-400 font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                      >
                        <FiPhone /> Call Admin
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTag className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No items found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              There are currently no marketplace listings matching your criteria. Please check back later!
            </p>
            <button
              onClick={() => {
                setSearchInput('');
                setLocationInput('');
                setCategoryFilter('all');
                setSortOrder('newest');
              }}
              className="px-6 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedSale(null)}>
          <div className="bg-white dark:bg-[#0B0F19] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedSale(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10"
            >
              <FiX className="text-xl" />
            </button>

            <div className="h-2 w-full bg-green-500"></div>
            
            {selectedSale.image && (
              <div className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <img src={selectedSale.image} alt={selectedSale.title} className="w-full max-h-96 object-contain" />
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <FiTag /> Sale
                  </span>
                  {selectedSale.category && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {selectedSale.category}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md">
                  {new Date(selectedSale.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                {selectedSale.title}
              </h2>

              <div className="space-y-3 mb-8 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedSale.salaryOrPrice && (
                  <div className="flex items-center gap-3 text-base font-bold text-slate-800 dark:text-slate-200">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                      <FiTag />
                    </div>
                    Price:  
                    <span className="text-slate-900 dark:text-white text-lg">
                      {/^[₹$£€]/.test(selectedSale.salaryOrPrice) || /rs/i.test(selectedSale.salaryOrPrice) ? selectedSale.salaryOrPrice : `₹ ${selectedSale.salaryOrPrice}`}
                    </span>
                  </div>
                )}
                
                {selectedSale.location && (
                  <div className="flex items-center gap-3 text-base font-semibold text-slate-600 dark:text-slate-400">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <FiMapPin />
                    </div>
                    {selectedSale.location}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Product Description</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedSale.description}
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                <FiInfo className="text-amber-600 mt-1 shrink-0 text-lg" />
                <p className="text-sm font-medium text-amber-800 dark:text-amber-500 leading-relaxed">
                  To ensure security, please contact the Gaya Seva admin to proceed with this purchase.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleContact('whatsapp', selectedSale.title); }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <FiMessageCircle className="text-lg" /> WhatsApp Admin
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleContact('call', selectedSale.title); }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-400 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <FiPhone className="text-lg" /> Call Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
