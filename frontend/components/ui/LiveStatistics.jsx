'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const StatCounter = ({ value, label, suffix = "+", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing out quint
      const easeOut = 1 - Math.pow(1 - percentage, 5);
      
      setCount(Math.floor(easeOut * value));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  // Format number with commas
  const formattedCount = count.toLocaleString('en-IN');

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center group">
      <div className="font-sora text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-2 group-hover:scale-110 transition-transform duration-300">
        {formattedCount}{suffix}
      </div>
      <div className="text-[13px] md:text-[15px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
};

export default function LiveStatistics() {
  const stats = [
    { value: 10000, label: "Happy Users" },
    { value: 1000, label: "Verified Businesses" },
    { value: 700, label: "Skilled Professionals" },
    { value: 200, label: "Jobs Posted" },
    { value: 500, label: "Active Offers" },
    { value: 99, label: "Customer Satisfaction", suffix: "%" }
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-y border-slate-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50/50 rounded-full blur-[80px]"></div>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 divide-x divide-slate-100">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={index % 2 !== 0 ? "border-l border-slate-100 md:border-none" : ""}
            >
              <StatCounter 
                value={stat.value} 
                label={stat.label} 
                suffix={stat.suffix}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
