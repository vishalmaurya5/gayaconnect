'use client';

import { FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingContactButtons() {
  const callPhone = '+918544491413';
  const whatsappPhone = '+919117588242';
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Gaya Seva Team, I need assistance.')}`;

  return (
    <>
      {/* LEFT SIDE FIXED STICKY CALL BUTTON */}
      <div className="fixed bottom-6 left-6 z-[999] font-inter">
        <a
          href={`tel:${callPhone}`}
          className="relative group flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-indigo-600/50 hover:scale-105 transition-all duration-300 border border-indigo-400/60"
          title="Call Support (+91 85444 91413)"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          
          <FiPhone className="w-5 h-5 text-white animate-pulse" />
          <span className="hidden sm:inline font-extrabold text-xs tracking-wider">Call Us</span>
        </a>
      </div>

      {/* RIGHT SIDE FIXED STICKY WHATSAPP BUTTON */}
      <div className="fixed bottom-6 right-6 z-[999] font-inter">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-500/50 hover:scale-105 transition-all duration-300 border border-emerald-400/60"
          title="Chat on WhatsApp (+91 91175 88242)"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          
          <FaWhatsapp className="w-6 h-6 text-white" />
          <span className="hidden sm:inline font-extrabold text-xs tracking-wider">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
