'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShieldCheck, MessageCircle, Send, CheckCircle, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorRatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/vendors/${id}`);
      const json = await res.json();
      if (json.success && json.vendor) {
        setVendor(json.vendor);
      } else {
        toast.error('Vendor not found');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!name.trim() || !comment.trim()) {
      toast.error('Name and feedback are required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vendor',
          vendorId: id,
          name: name.trim(),
          rating,
          comment: comment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold animate-pulse">Loading Secure Rating Portal...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Business Not Found</h2>
        <p className="text-slate-500 text-center max-w-sm mb-6">The business you are trying to rate could not be located. Please check the QR code.</p>
        <button onClick={() => router.push('/')} className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 py-8 px-4 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="form"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="bg-indigo-600 p-6 text-center relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full"></div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-3">
                  <img src="/gaya_seva_app_icon.png" alt="Gaya Seva" className="w-10 h-10 object-contain" />
                </div>
                <h1 className="text-xl font-bold text-white mb-1">Gaya Seva Secure Rating</h1>
                <div className="flex items-center justify-center gap-1 text-indigo-100 text-xs font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner Feedback
                </div>
              </div>

              {/* Business Info */}
              <div className="px-6 py-5 border-b border-slate-100 text-center bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{vendor.name}</h2>
                <p className="text-slate-500 text-sm mt-1">{vendor.category} • {vendor.area || 'Gaya'}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Star Rating */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Rate Your Experience</label>
                  <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className={`p-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
                          (hoverRating || rating) >= star ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'
                        }`}
                      >
                        <Star className="w-10 h-10" fill={(hoverRating || rating) >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-amber-500 mt-2 h-5">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent!"}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Your Feedback</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share details of your experience with this business..." 
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-800 resize-none"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || rating === 0}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-lg py-3.5 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : (
                    <>Submit Feedback <Send className="w-5 h-5" /></>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-semibold uppercase tracking-wider mt-2">
                  Powered by Gaya Seva Network
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center border border-slate-100"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Thank You!</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Your feedback for <strong>{vendor.name}</strong> has been securely submitted. Your review helps maintain the quality of the Gaya Seva network.
              </p>
              <button 
                onClick={() => router.push('/')}
                className="w-full bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Return to Gaya Seva
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
