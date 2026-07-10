const testimonials = [
  { text: "Found a good electrician within 10 minutes for my house wiring work. The subscription for ₹11 is literally nothing compared to the time it saves.", name: "Rajeev Verma", role: "Resident, Gaya City", initials: "RV", bg: "bg-indigo-50" },
  { text: "As a vendor, I got 3 new customers in the first week of listing. The offer posting feature really helped promote my shop during festivals.", name: "Amit Sharma", role: "Vendor, Bodh Gaya", initials: "AS", bg: "bg-teal-50" },
  { text: "Needed a local worker for construction. Found Ramesh Mistri on GayaSeva in minutes. Professional, punctual, excellent work.", name: "Priya Kumari", role: "Homeowner, Tekari Road", initials: "PK", bg: "bg-amber-50" },
];

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-white border border-slate-100 rounded-[24px] p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 relative group">
          {/* Subtle quotation mark background */}
          <div className="absolute top-6 right-6 text-slate-100 font-serif text-6xl leading-none select-none group-hover:text-indigo-50/50 transition-colors">
            "
          </div>
          
          <div className="flex gap-1 mb-6">
            {[1,2,3,4,5].map(star => (
              <svg key={star} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          
          <p className="text-[15px] text-slate-600 leading-relaxed mb-8 relative z-10 italic font-medium">"{t.text}"</p>
          
          <div className="flex items-center gap-4 mt-auto">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-[800] ${t.bg} text-indigo-700 border border-slate-100 shadow-sm`}>
              {t.initials}
            </div>
            <div>
              <div className="font-[800] text-[15px] text-slate-900">{t.name}</div>
              <div className="text-[12px] font-medium text-slate-400 mt-0.5">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
