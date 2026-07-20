'use client';

import { ShieldCheck, UserCheck, CreditCard, Lock, Clock, Smile } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      title: "Verified Businesses",
      description: "Every business on our platform goes through a strict verification process to ensure quality and trust.",
      color: "bg-indigo-50",
      borderColor: "border-indigo-100"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-teal-600" />,
      title: "Verified Skilled Professionals",
      description: "Hire reliable daily-wage workers and technicians whose identities and skills are verified by our team.",
      color: "bg-teal-50",
      borderColor: "border-teal-100"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-emerald-600" />,
      title: "Affordable ₹11 Membership",
      description: "Unlock all premium features, direct contacts, and exclusive deals for just ₹11 per month.",
      color: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      icon: <Lock className="w-8 h-8 text-orange-600" />,
      title: "Secure Platform",
      description: "Your data is encrypted and protected. We prioritize your privacy and digital security above all.",
      color: "bg-orange-50",
      borderColor: "border-orange-100"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Fast Customer Support",
      description: "Need help? Our dedicated local support team is always ready to assist you quickly.",
      color: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      icon: <Smile className="w-8 h-8 text-rose-600" />,
      title: "Easy to Use",
      description: "Designed for everyone. Our intuitive interface makes finding and hiring services incredibly simple.",
      color: "bg-rose-50",
      borderColor: "border-rose-100"
    }
  ];

  return (
    <section className="bg-slate-50 py-24 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-indigo-50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span> The Platform Advantage <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span>
          </div>
          <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-[#0F172A] tracking-tight">
            Why Choose Our Platform?
          </h2>
          <p className="mt-4 text-[15px] md:text-base text-slate-500 leading-relaxed">
            We are building the most trusted digital ecosystem. Here is why thousands of individuals and businesses choose us every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className={`rounded-[24px] border ${reason.borderColor} bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-16 h-16 rounded-2xl ${reason.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {reason.icon}
              </div>
              <h3 className="font-sora text-xl font-bold text-slate-900 mb-3">{reason.title}</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
