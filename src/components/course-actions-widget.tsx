"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface CourseActionsWidgetProps {
  courseName: string;
  courseId: string;
}

export default function CourseActionsWidget({ courseName, courseId }: CourseActionsWidgetProps) {
  const [whatsappNumber, setWhatsappNumber] = useState('917013057827');

  useEffect(() => {
    const saved = localStorage.getItem('aurenza_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.contactWhatsapp) {
          // clean number: remove +, space, dash
          const cleaned = parsed.contactWhatsapp.replace(/[+\s-]/g, '');
          setWhatsappNumber(cleaned);
        }
      } catch (e) {}
    }
  }, []);

  const handleJoinImmediately = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-lead-modal', {
        detail: {
          source: `Course Details Booking`,
          prefilledCourse: courseName,
          message: `Hi, I am interested in joining the ${courseName} program immediately. Please contact me with details.`
        }
      }));
    }
  };

  const handleContactUs = () => {
    const text = encodeURIComponent(`Hello Aurenza Academy! I would like to enquire about the ${courseName} certification program, upcoming cohorts, and class timetable.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-3 pt-2">
      <button
        onClick={handleJoinImmediately}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-xs font-black text-white hover:opacity-95 transition flex items-center justify-center gap-2 hover:shadow-neonPurple uppercase tracking-wider text-center"
      >
        Join Immediately <ArrowRight className="w-4 h-4" />
      </button>

      <button
        onClick={handleContactUs}
        className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-xs font-bold text-green-400 transition flex items-center justify-center gap-2 uppercase tracking-wider text-center"
      >
        <MessageSquare className="w-4 h-4 text-green-400" /> Contact Us
      </button>
    </div>
  );
}
