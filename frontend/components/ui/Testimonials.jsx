'use client';

import { useState, useEffect } from 'react';
import FeedbackModal from './FeedbackModal';

const staticTestimonials = [
  { text: "Found a good electrician within 10 minutes for my house wiring work. The subscription for ₹11 is literally nothing compared to the time it saves.", name: "Rajeev Verma", role: "Resident, Gaya City", initials: "RV", bg: "bg-indigo-50" },
  { text: "As a vendor, I got 3 new customers in the first week of listing. The offer posting feature really helped promote my shop during festivals.", name: "Amit Sharma", role: "Vendor, Bodh Gaya", initials: "AS", bg: "bg-teal-50" },
  { text: "Needed a local worker for construction. Found Ramesh Mistri on GayaSeva in minutes. Professional, punctual, excellent work.", name: "Priya Kumari", role: "Homeowner, Tekari Road", initials: "PK", bg: "bg-amber-50" },
];

export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback?type=website&status=approved&limit=6');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setFeedbacks(data.data);
      } else {
        // Fallback to static if no dynamic feedback is available
        setFeedbacks(staticTestimonials);
      }
    } catch (error) {
      console.error('Error fetching feedbacks', error);
      setFeedbacks(staticTestimonials);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const bgColors = ["bg-indigo-50", "bg-teal-50", "bg-amber-50", "bg-rose-50", "bg-blue-50", "bg-emerald-50"];

  return (
    <div>
      <div className="flex justify-center mb-10">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Leave Feedback
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeletons
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-8 h-[250px] animate-pulse">
              <div className="flex gap-1 mb-6"><div className="w-24 h-4 bg-slate-200 rounded"></div></div>
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div></div>
              </div>
            </div>
          ))
        ) : (
          feedbacks.map((t, idx) => {
            const isDynamic = !!t.rating;
            const ratingStars = isDynamic ? t.rating : 5;
            const commentText = isDynamic ? t.comment : t.text;
            const authorName = isDynamic ? t.name : t.name;
            const authorRole = isDynamic ? 'Website User' : t.role;
            const initials = isDynamic ? getInitials(t.name) : t.initials;
            const bgClass = isDynamic ? bgColors[idx % bgColors.length] : t.bg;

            return (
              <div key={idx} className="bg-white border border-slate-100 rounded-[24px] p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 relative group flex flex-col">
                <div className="absolute top-6 right-6 text-slate-100 font-serif text-6xl leading-none select-none group-hover:text-indigo-50/50 transition-colors">
                  "
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < ratingStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-[15px] text-slate-600 leading-relaxed mb-8 relative z-10 italic font-medium flex-grow break-words">"{commentText}"</p>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-50">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-[800] ${bgClass} text-indigo-700 border border-slate-100 shadow-sm shrink-0`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-[800] text-[15px] text-slate-900 truncate">{authorName}</div>
                    <div className="text-[12px] font-medium text-slate-400 mt-0.5 truncate">{authorRole}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type="website" 
      />
    </div>
  );
}
