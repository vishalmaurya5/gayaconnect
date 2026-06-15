const offers = [
  { title: "AC servicing & gas refill discount", vendor: "Sonu AC Repair · Gaya City", discount: "20% OFF", expiry: "30 Jun 2025", bg: "bg-indigo-50", color: "indigo" },
  { title: "Full bike service at flat ₹99 only", vendor: "Raja Motors · Bodh Gaya", discount: "₹99 FLAT", expiry: "15 Jul 2025", bg: "bg-teal-50", color: "teal" },
  { title: "Monsoon season room discount", vendor: "Hotel Gaya Inn · Gaya City", discount: "30% OFF", expiry: "31 Aug 2025", bg: "bg-amber-50", color: "amber" },
  { title: "Free home inspection on first visit", vendor: "Mishra Electricals · Manpur", discount: "FREE Visit", expiry: "Limited time", bg: "bg-rose-50", color: "rose" },
];

export default function OfferSection() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {offers.map((offer, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-xl flex overflow-hidden hover:shadow-md transition">
          <div className={`w-2 ${offer.bg.replace("bg-", "bg-")}`}></div>
          <div className="flex-1 p-4 flex gap-3">
            <div className={`w-14 h-14 rounded-xl ${offer.bg} flex flex-col items-center justify-center shrink-0`}>
              <div className={`font-sora font-bold text-sm ${offer.color === "indigo" ? "text-indigo-700" : offer.color === "teal" ? "text-teal-700" : offer.color === "amber" ? "text-amber-700" : "text-rose-700"}`}>
                {offer.discount.split(" ")[0]}
              </div>
              <div className="text-[9px] font-bold">{offer.discount.split(" ")[1] || ""}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{offer.vendor}</div>
              <div className="font-semibold text-gray-800 text-sm mt-0.5">{offer.title}</div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Expires {offer.expiry}
              </div>
              <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full px-2 py-0.5 mt-2">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/></svg>
                Subscribe to view full offer
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
