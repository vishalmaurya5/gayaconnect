'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, Star, Phone, MapPin, HardHat, CheckCircle2, User, Send, Calendar, Award, Droplet, MessageSquare, ThumbsUp, ChevronRight
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLabourProfilePage() {
  const params = useParams();
  const [labour, setLabour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    fetchPublicProfile();
  }, [params.id]);

  const fetchPublicProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/labour/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setLabour(data.labour);
        setReviews(data.reviews || []);
      } else {
        toast.error(data.message || 'Worker profile not found');
      }
    } catch (err) {
      toast.error('Network error loading worker details');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      return toast.error('Please enter your name and feedback comment');
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/labour/${params.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          rating,
          comment
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Thank you! Your feedback has been published.');
        setSubmittedSuccess(true);
        setComment('');
        setCustomerName('');
        setCustomerPhone('');
        fetchPublicProfile(); // Refresh reviews and aggregate rating
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-300 font-semibold text-sm animate-pulse">Loading Verified Workforce Profile...</p>
      </div>
    );
  }

  if (!labour) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-4 border border-rose-500/20">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white">Worker Profile Not Found</h1>
        <p className="text-slate-400 mt-2 max-w-sm">The requested worker profile could not be located or may have been updated.</p>
        <Link href="/labour" className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
          Browse Labour Directory
        </Link>
      </div>
    );
  }

  const activeSkillsList = (labour.skills && labour.skills.length > 0)
    ? labour.skills
    : [labour.category || labour.profession || labour.role || 'Skilled Labour'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-slate-950 font-black text-lg">G</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">GAYA<span className="text-amber-400">SEVA</span></span>
          </Link>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>QR Verified Worker Profile</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Worker Hero Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
            
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-amber-500/80 overflow-hidden bg-slate-800 shadow-xl flex items-center justify-center">
                {labour.photo ? (
                  <img src={labour.photo} alt={labour.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-500" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-900 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Main Information */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold rounded-md">
                  ID: {labour.lwfId || 'GS-LWF-VERIFIED'}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Workforce
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide mt-2">
                {labour.name}
              </h1>

              <h2 className="text-lg font-extrabold text-indigo-400 uppercase tracking-widest mt-0.5">
                {labour.profession || labour.category || labour.role || 'Technician / Worker'}
              </h2>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {labour.location || labour.address || labour.district || 'Gaya, Bihar'}
                </span>
                {labour.bloodGroup && (
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <Droplet className="w-4 h-4 fill-rose-500/20" />
                    Blood Group: {labour.bloodGroup}
                  </span>
                )}
              </div>

              {/* Rating Summary Header */}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-400 font-black text-base">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{labour.rating ? labour.rating.toFixed(1) : '5.0'}</span>
                </div>
                <span className="text-slate-400 text-xs font-semibold">
                  Based on <strong className="text-white">{labour.reviewCount || reviews.length} customer feedbacks</strong>
                </span>
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-5">
                <a 
                  href={`tel:${labour.phone}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
                >
                  <Phone className="w-4 h-4" /> Call Worker ({labour.phone})
                </a>
                {labour.whatsapp && (
                  <a 
                    href={`https://wa.me/${labour.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/30 text-sm"
                  >
                    <FaWhatsapp className="w-4 h-4 text-white" /> WhatsApp
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Active Skills & Verification Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Skills Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <HardHat className="w-5 h-5 text-indigo-400" /> Active Verified Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {activeSkillsList.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> {skill}
                </span>
              ))}
            </div>

            {labour.dailyRate && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-400 font-semibold">Standard Wage Rate:</span>
                <span className="text-lg font-black text-amber-400">₹{labour.dailyRate} / Day</span>
              </div>
            )}
          </div>

          {/* Safety & Trust Guarantees */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-emerald-400" /> GayaSeva Safety & Quality Seal
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Identity & Aadhaar KYC Verified
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Background Checked Local Worker
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Direct Customer Rating & Feedback System
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Scanned via Official GayaSeva QR Code on Worker ID Badge.
            </div>
          </div>

        </div>

        {/* Customer Feedback & Rating Form Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" /> Give Feedback to {labour.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Have you hired or worked with this labour worker? Share your review directly.</p>
            </div>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            
            {/* Interactive Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Select Your Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform transform hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 font-black text-amber-400 text-lg">{hoverRating || rating} / 5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Your Phone (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Your Feedback Comment *</label>
              <textarea 
                rows="3"
                placeholder="Write about the worker's quality, behavior, punctuality, or work experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white outline-none focus:border-amber-500 transition-all"
                required
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Customer Reviews List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2 mb-6">
            <ThumbsUp className="w-5 h-5 text-emerald-400" /> Customer Reviews & Ratings ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-700 mb-2" />
              <p className="text-sm font-semibold">No feedback reviews submitted yet.</p>
              <p className="text-xs text-slate-600 mt-1">Be the first customer to rate and review this worker using the form above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold text-xs">
                        {rev.customerName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <span className="font-bold text-white text-sm">{rev.customerName}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-amber-400 text-xs">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed font-medium pl-10">
                    "{rev.comment}"
                  </p>

                  <div className="text-[10px] text-slate-500 text-right font-mono">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-900">
        © GayaSeva • Official Local Workforce Management SaaS System
      </footer>

    </div>
  );
}
