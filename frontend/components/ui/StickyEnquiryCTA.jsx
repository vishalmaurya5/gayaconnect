'use client';

import { FiMessageCircle } from 'react-icons/fi';

export default function StickyEnquiryCTA() {
  const scrollToEnquiry = () => {
    const enquirySection = document.getElementById('enquiry');
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={scrollToEnquiry}
      className="fixed bottom-24 left-6 z-[100] bg-[#0F172A] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(15,23,42,0.3)] flex items-center justify-center hover:bg-indigo-600 hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/50 group"
      aria-label="Enquire Now"
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <FiMessageCircle className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
      </div>
      <span className="font-bold text-[15px] tracking-wide overflow-hidden max-w-0 group-hover:max-w-[150px] group-hover:ml-3 opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap">
        Enquire Now
      </span>
    </button>
  );
}
