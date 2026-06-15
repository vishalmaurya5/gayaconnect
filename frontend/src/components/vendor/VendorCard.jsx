import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

export default function VendorCard({ vendor }) {
  return (
    <div className="card p-4 transition hover:shadow-lg hover:-translate-y-0.5">
      <img src={vendor.images?.[0] || 'https://placehold.co/400x220'} alt={vendor.businessName} className="h-40 w-full object-cover rounded" />
      <div className="mt-3 flex justify-between">
        <h3 className="font-semibold">{vendor.businessName}</h3>
        {vendor.isPremium && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Premium</span>}
      </div>
      <p className="text-sm text-slate-500 line-clamp-2">{vendor.description}</p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1"><StarIcon className="h-4 text-yellow-500" /> {vendor.ratingAvg?.toFixed?.(1) || 0}</span>
        <Link to={`/vendors/${vendor.slug}`} className="text-blue-600">View</Link>
      </div>
    </div>
  );
}
