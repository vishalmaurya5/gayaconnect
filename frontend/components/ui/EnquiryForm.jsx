'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSend, FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

export default function EnquiryForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Thank you! Your enquiry has been sent successfully.");
        reset();
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Enquiry submission error:", error);
      toast.error("Failed to submit enquiry. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-20 relative bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Information */}
          <div className="bg-slate-900 text-white p-10 md:p-12 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-6">
                Get in Touch
              </div>
              <h2 className="font-sora text-3xl md:text-4xl font-[800] leading-tight mb-4">
                Have a question? <br/> Let's talk.
              </h2>
              <p className="text-slate-300 text-[15px] leading-relaxed mb-8">
                Whether you need help finding a service, want to list your business, or have general feedback, our team is here to assist you instantly.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <FiPhone className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 font-medium">Call Us</p>
                  <p className="font-bold text-white">+91 9117588242</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <FiMail className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 font-medium">Email Us</p>
                  <p className="font-bold text-white">thegayaseva@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-10 md:p-12 md:w-7/12 bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-[15px] ${errors.name ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'}`}
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && <p className="text-rose-500 text-[12px] font-medium">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700">Phone Number <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="text-slate-400" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000"
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-[15px] ${errors.phone ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'}`}
                      {...register("phone", { 
                        required: "Phone is required",
                        pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" }
                      })}
                    />
                  </div>
                  {errors.phone && <p className="text-rose-500 text-[12px] font-medium">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">Email Address <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-[15px] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    {...register("email")}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">How can we help you? <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <FiMessageSquare className="text-slate-400" />
                  </div>
                  <textarea 
                    rows="4"
                    placeholder="Write your message here..."
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-[15px] resize-none ${errors.message ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'}`}
                    {...register("message", { required: "Please provide a message" })}
                  ></textarea>
                </div>
                {errors.message && <p className="text-rose-500 text-[12px] font-medium">{errors.message.message}</p>}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Send Message <FiSend /></>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
