'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function PopupAd() {
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Check if it was already closed in this session
    if (sessionStorage.getItem('popupAdClosed')) {
      return;
    }

    // Fetch popup settings
    fetch('/api/admin/popup')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.isActive && d.data?.imageUrl) {
          setImageUrl(d.data.imageUrl);
          setShow(true);
        }
      })
      .catch(() => {}); // ignore errors, just don't show popup
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('popupAdClosed', 'true');
  };

  if (!show || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative max-w-md w-full animate-in zoom-in-95 duration-500">
        <button 
          onClick={handleClose}
          className="absolute -top-12 right-0 md:-right-12 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all"
        >
          <FiX size={24} />
        </button>
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative">
          <img 
            src={imageUrl} 
            alt="Advertisement" 
            className="w-full max-h-[80vh] object-contain block"
          />
        </div>
      </div>
    </div>
  );
}
