import { NavLink } from 'react-router-dom';

const links = [
  ['Dashboard', '/admin/dashboard'],
  ['Vendors', '/admin/vendors'],
  ['Users', '/admin/users'],
  ['Banners', '/admin/banners'],
  ['Categories', '/admin/categories'],
  ['Bookings', '/admin/bookings'],
  ['Payments', '/admin/payments'],
  ['Analytics', '/admin/analytics'],
  ['Settings', '/admin/settings'],
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 hidden lg:block">
      <h2 className="font-bold text-xl mb-6">Admin Panel</h2>
      <nav className="space-y-1">
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
