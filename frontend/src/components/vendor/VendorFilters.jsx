import { CATEGORIES, CITIES } from '../../utils/constants';

export default function VendorFilters({ filters, onChange }) {
  return (
    <aside className="card p-4 space-y-3">
      <h3 className="font-semibold">Filters</h3>
      <input className="w-full border rounded px-3 py-2" placeholder="Search vendor" value={filters.q} onChange={(e) => onChange({ ...filters, q: e.target.value })} />
      <select className="w-full border rounded px-3 py-2" value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value })}>
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="w-full border rounded px-3 py-2" value={filters.city} onChange={(e) => onChange({ ...filters, city: e.target.value })}>
        <option value="">All Cities</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </aside>
  );
}
