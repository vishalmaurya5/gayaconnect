'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function PopupAd() {
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [positionClass, setPositionClass] = useState('items-center justify-center'); // Default center

  useEffect(() => {
    // Delay slightly so it doesn't instantly block the UI
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/popups');
        const data = await res.json();
        
        if (data.success && data.popups && data.popups.length > 0) {
          // Filter only active popups
          const activePopups = data.popups.filter(p => p.isActive);
          
          if (activePopups.length > 0) {
            // Pick a random popup
            const randomPopup = activePopups[Math.floor(Math.random() * activePopups.length)];
            
            // Randomize position on screen
            const positions = [
              'items-center justify-center', // Center
              'items-end justify-end pb-8 pr-8', // Bottom Right
              'items-end justify-start pb-8 pl-8', // Bottom Left
              'items-start justify-center pt-8' // Top Center
            ];
            setPositionClass(positions[Math.floor(Math.random() * positions.length)]);
            
            setImageUrl(randomPopup.imageUrl);
            setShow(true);
          }
        }
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && imageUrl && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-[104px] inset-x-0 bottom-0 z-40 flex bg-slate-900/60 backdrop-blur-sm p-4 ${positionClass}`}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-md w-full"
          >
            {/* Glowing effect behind popup */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            
            <button 
              onClick={handleClose}
              className="absolute -top-12 right-0 md:-right-12 bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 text-white p-2.5 rounded-full backdrop-blur-md transition-all z-20 group"
            >
              <FiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-white/20">
              <img 
                src={imageUrl} 
                alt="Special Advertisement" 
                className="w-full max-h-[80vh] object-contain block hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
