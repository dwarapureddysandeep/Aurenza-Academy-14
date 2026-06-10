"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppContactButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('917013057827');

  useEffect(() => {
    const saved = localStorage.getItem('aurenza_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.contactWhatsapp) {
          const cleaned = parsed.contactWhatsapp.replace(/[+\s-]/g, '');
          setWhatsappNumber(cleaned);
        }
      } catch (e) {}
    }
  }, []);

  const handleClick = () => {
    const text = encodeURIComponent("Hello! I wish to enquire about your upcoming batches, live cohorts, and curriculum.");
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-1.5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 font-bold transition justify-center text-xs"
    >
      <MessageSquare className="w-4 h-4" /> Direct Chat on WhatsApp
    </button>
  );
}
