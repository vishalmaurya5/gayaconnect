const vendors = [
  {
    name: "Ravi Electrical Works",
    category: "Electrician",
    rating: 4.9,
    reviews: 124,
    location: "Gaya City, Near Bus Stand",
    tags: ["Wiring", "Inverter", "Switchboard", "Home visit"],
    bg: "bg-indigo-50",
    icon: "⚡",
    badge: "Verified",
  },
  {
    name: "Sharma Plumbing Services",
    category: "Plumber",
    rating: 4.8,
    reviews: 89,
    location: "Bodh Gaya, Temple Road",
    tags: ["Pipe fitting", "Leakage fix", "Tank cleaning"],
    bg: "bg-teal-50",
    icon: "🔧",
    badge: "Verified",
  },
  {
    name: "Guddu Bike Mechanic",
    category: "Bike repair",
    rating: 4.6,
    reviews: 67,
    location: "Tekari Road, Gaya",
    tags: ["Servicing", "Puncture", "Engine repair"],
    bg: "bg-amber-50",
    icon: "🏍️",
    badge: "Top rated",
  },
];

export default function VendorSection() {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-5">
        {vendors.map((vendor, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
            <div className={`${vendor.bg} h-28 flex items-center justify-center relative`}>
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-md border-2 border-white/50">
                {vendor.icon}
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-bold bg-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {vendor.badge}
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-gray-800">{vendor.name}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="font-semibold text-sm">{vendor.rating}</span>
                <span className="text-gray-400 text-xs ml-1">({vendor.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2"/></svg>
                {vendor.location}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {vendor.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">{tag}</span>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 p-3 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-gray-400">Contact</div>
                <div className="text-sm font-mono blur-[4px] select-none">+91 98765 43210</div>
              </div>
              <button className="text-indigo-600 bg-indigo-50 text-xs font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/></svg>
                Unlock contact
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Subscribe nudge */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/></svg>
          <p className="text-sm font-medium text-indigo-900">Contact details are hidden. Subscribe to unlock all vendor numbers instantly. <span className="text-gray-600 font-normal ml-1">2,400+ vendors waiting for you.</span></p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap">Subscribe for ₹11/month</button>
      </div>
    </div>
  );
}
