import { useEffect, useState } from 'react';
import VendorCard from '../../components/vendor/VendorCard';
import VendorFilters from '../../components/vendor/VendorFilters';
import { fetchVendors } from '../../services/vendorService';

export default function VendorsPage() {
  const [filters, setFilters] = useState({ q: '', category: '', city: '', page: 1, sort: '-createdAt' });
  const [result, setResult] = useState({ data: [], pages: 1 });

  useEffect(() => {
    fetchVendors(filters).then(setResult).catch(console.error);
  }, [filters]);

  return (
    <div className="grid lg:grid-cols-4 gap-5">
      <VendorFilters filters={filters} onChange={setFilters} />
      <div className="lg:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vendors</h1>
          <select className="border rounded px-3 py-2" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="-createdAt">Newest</option>
            <option value="-ratingAvg">Top Rated</option>
            <option value="-views">Most Viewed</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {result.data.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)}
        </div>
      </div>
    </div>
  );
}
