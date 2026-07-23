'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, ShieldCheck, MessageCircle, Send, CheckCircle, Store, Phone, MapPin, Clock, Award, Users, ChevronRight, ThumbsUp, Sparkles, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorRatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
      fetchVendorReviews();
    }
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      const res = await fetch(`/api/vendors/${id}`);
      const json = await res.json();
      if (json.success && json.vendor) {
        setVendor(json.vendor);
      } else {
        toast.error('Vendor profile not found');
      }
    } catch (err) {
      toast.error('Failed to load business profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorReviews = async () => {
    try {
      const res = await fetch(`/api/feedback?type=vendor&vendorId=${id}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data || []);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating (1 to 5 stars)');
      return;
    }
    if (!name.trim() || !comment.trim()) {
      toast.error('Please fill in your name and feedback');
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
          phone: phone.trim(),
          rating,
          comment: comment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        fetchVendorDetails();
        fetchVendorReviews();
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-bold tracking-wide animate-pulse">Loading Verified Business Profile...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center mb-4 border border-rose-500/30">
          <Store className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-center">Business Not Found</h2>
        <p className="text-slate-400 text-center max-w-sm mb-6 text-sm">The business profile you scanned could not be loaded. Please check the QR code or try again.</p>
        <button onClick={() => router.push('/')} className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-8 py-3 rounded-2xl shadow-lg">Return to GayaSeva</button>
      </div>
    );
  }

  const phoneNum = vendor.userId?.phone || vendor.phone || vendor.mobile || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 relative overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-indigo-600/20 via-amber-500/10 to-transparent blur-[120px] pointer-events-none"></div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-full p-1 shadow-md border border-amber-400/40 flex items-center justify-center">
              <img src="/gaya_seva_app_icon.png" alt="GayaSeva" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">Gaya<span className="text-amber-400">Seva</span></h1>
              <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">Verified Partner Portal</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Shop
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6 relative z-10">

        {/* VENDOR DETAILS HERO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 rounded-3xl border border-slate-800/80 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Badge */}
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-full uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" /> GayaSeva Partner
            </span>
            <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-300 font-black text-sm">{vendor.rating || 4.8}</span>
              <span className="text-slate-400 text-xs font-bold">({reviews.length || vendor.totalReviews || 0})</span>
            </div>
          </div>

          {/* Shop Name & Owner */}
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-1">{vendor.name}</h1>
          
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-4">
            <Store className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{vendor.category || 'Local Business'}</span>
            {vendor.subCategory && <span className="text-slate-500">• {vendor.subCategory}</span>}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 gap-2.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 text-xs mb-5">
            {vendor.address && (
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{vendor.address}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-medium">{vendor.workingHours || '9:00 AM - 9:00 PM (Everyday)'}</span>
            </div>

            {vendor.userId?.name && (
              <div className="flex items-center gap-2.5 text-slate-300">
                <Users className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="font-medium">Owner: <strong className="text-white">{vendor.userId.name}</strong></span>
              </div>
            )}
          </div>

          {/* Call & WhatsApp Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {phoneNum ? (
              <>
                <a 
                  href={`tel:${phoneNum}`}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl border border-slate-700 transition-all text-sm"
                >
                  <Phone className="w-4 h-4 text-emerald-400" /> Call Shop
                </a>
                <a 
                  href={`https://wa.me/91${phoneNum.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${vendor.name}, I found your business on GayaSeva!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </>
            ) : (
              <div className="col-span-2 text-center text-xs font-semibold text-slate-400 bg-slate-950/40 py-2 rounded-xl border border-slate-800">
                Verified Business Partner on GayaSeva
              </div>
            )}
          </div>
        </motion.div>

        {/* RATING & REVIEW FORM CONTAINER */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="rating-form"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/90 rounded-3xl border border-amber-500/30 p-6 shadow-2xl backdrop-blur-xl relative"
            >
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-400/10 text-amber-400 rounded-2xl mb-3 border border-amber-400/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">Leave Your Feedback</h2>
                <p className="text-slate-400 text-xs mt-1">Rate your experience at <strong className="text-amber-300">{vendor.name}</strong></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Interactive Star Rating */}
                <div className="flex flex-col items-center bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2">Tap Stars to Rate</label>
                  <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className={`p-1.5 transition-transform duration-150 hover:scale-125 active:scale-95 ${
                          (hoverRating || rating) >= star ? 'text-amber-400' : 'text-slate-700 hover:text-amber-400/50'
                        }`}
                      >
                        <Star className="w-9 h-9" fill={(hoverRating || rating) >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-black text-amber-400 mt-2.5 h-4">
                    {rating === 1 && "⭐ Poor Experience"}
                    {rating === 2 && "⭐⭐ Fair / Needs Improvement"}
                    {rating === 3 && "⭐⭐⭐ Good Service"}
                    {rating === 4 && "⭐⭐⭐⭐ Very Good"}
                    {rating === 5 && "⭐⭐⭐⭐⭐ Excellent Service!"}
                  </div>
                </div>

                {/* Customer Details Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Kumar" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number (Optional)</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Feedback / Review *</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about the product quality, service, or your experience..." 
                      rows="3"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-slate-600 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={submitting || rating === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-base py-3.5 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting Review...' : (
                    <>Submit Feedback <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* Success Feedback Card */
            <motion.div 
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/90 rounded-3xl border border-emerald-500/40 p-8 text-center shadow-2xl backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Feedback Received!</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Thank you <strong>{name}</strong>! Your review for <strong>{vendor.name}</strong> has been saved and helps strengthen GayaSeva network standards.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl border border-slate-700 transition-colors text-sm"
              >
                Submit Another Feedback
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VERIFIED CUSTOMER REVIEWS LIST */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/80 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-400" /> Customer Reviews ({reviews.length})
            </h3>
            <span className="text-xs font-bold text-slate-400">Verified Network</span>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              <p className="font-semibold mb-1">Be the first to review this business!</p>
              <p className="text-xs text-slate-600">Scan the QR code at the shop counter to submit your experience.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/70 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xs">
                        {rev.name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <span className="font-bold text-white text-sm">{rev.name}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full text-xs font-bold text-amber-300">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {rev.rating} / 5
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed font-normal">{rev.comment}</p>
                  <div className="text-[10px] text-slate-500 font-semibold text-right">
                    {new Date(rev.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER BRANDING */}
        <footer className="text-center pt-4 pb-8 space-y-1">
          <p className="text-xs font-extrabold text-slate-400">GayaSeva Official Verified Partner Portal</p>
          <p className="text-[10px] text-slate-600">www.gayaseva.com • All Rights Reserved</p>
        </footer>

      </main>
    </div>
  );
}
