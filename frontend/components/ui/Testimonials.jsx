const testimonials = [
  { text: "Found a good electrician within 10 minutes for my house wiring work. The subscription for ₹11 is literally nothing compared to the time it saves.", name: "Rajeev Verma", role: "Resident, Gaya City", initials: "RV", bg: "bg-indigo-50" },
  { text: "As a vendor, I got 3 new customers in the first week of listing. The offer posting feature really helped promote my shop during festivals.", name: "Amit Sharma", role: "Vendor, Bodh Gaya", initials: "AS", bg: "bg-teal-50" },
  { text: "Needed a daily labour for construction. Found Ramesh Mistri on GayaConnect in minutes. Professional, punctual, excellent work.", name: "Priya Kumari", role: "Homeowner, Tekari Road", initials: "PK", bg: "bg-amber-50" },
];

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="text-yellow-500 text-sm mb-2">★★★★★</div>
          <p className="text-sm text-gray-600 italic mb-4">"{t.text}"</p>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${t.bg} text-indigo-800`}>{t.initials}</div>
            <div>
              <div className="font-semibold text-sm text-gray-800">{t.name}</div>
              <div className="text-xs text-gray-400">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
