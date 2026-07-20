'use client';
import { motion } from 'framer-motion';
import React from 'react';

const steps = [
  {
    title: "Search",
    desc: "Find verified services, businesses, or jobs.",
    icon: "🔍"
  },
  {
    title: "Compare",
    desc: "Evaluate profiles, ratings, and portfolios.",
    icon: "📊"
  },
  {
    title: "Connect",
    desc: "Get instant access to contact details.",
    icon: "📞"
  },
  {
    title: "Hire",
    desc: "Book services securely and seamlessly.",
    icon: "✅"
  },
  {
    title: "Review",
    desc: "Leave feedback to help the community.",
    icon: "⭐"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function HowItWorks() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 text-center mt-10"
    >
      {steps.map((step, idx) => (
        <motion.div variants={itemVariants} key={idx} className="flex flex-col items-center relative group">
          
          {/* Connector line for desktop */}
          {idx !== steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-[60%] w-full h-[1px] bg-gradient-to-r from-indigo-500/50 to-transparent z-0"></div>
          )}

          <div className="w-24 h-24 bg-slate-800/50 backdrop-blur-sm rounded-[24px] flex items-center justify-center text-4xl mb-6 shadow-xl border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300 relative z-10 group-hover:-translate-y-2">
            <span className="drop-shadow-lg">{step.icon}</span>
            
            {/* Step Number Badge */}
            <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-[800] text-[14px] shadow-lg border-2 border-slate-900">
              {idx + 1}
            </div>
          </div>
          
          <h3 className="text-xl font-[800] text-white mb-3 font-sora">{step.title}</h3>
          <p className="text-slate-400 text-[15px] max-w-[280px] leading-relaxed">{step.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
