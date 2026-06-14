"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, GraduationCap, CheckCircle2 } from 'lucide-react';
import { submitConsultationLead } from '@/lib/actions';
import LoadingSpinner from './loading-spinner';

const COURSES_LIST = [
  "Java Full Stack Development",
  "Frontend Development (React & Next.js)",
  "AI & Machine Learning Engineering",
  "PMP (Project Management Professional)",
  "CAPM (Certified Associate in Project Management)",
  "PMI ACP (Agile Certified Practitioner)",
  "CBAP (Certified Business Analysis Professional)",
  "Data Science & Analytics",
  "AWS Cloud Solutions",
  "Azure DevOps Systems",
  "Digital Marketing Mastery",
  "Product Management Core"
];

export default function LeadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [source, setSource] = useState('Generic Link');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(COURSES_LIST[0]);
  const [message, setMessage] = useState('');

  // Listen to global open-lead-modal event
  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.source) {
        setSource(e.detail.source);
      }
      if (e.detail?.prefilledCourse) {
        setCourse(e.detail.prefilledCourse);
      }
      if (e.detail?.message) {
        setMessage(e.detail.message);
      } else {
        setMessage('');
      }
      setSuccess(false);
      setIsOpen(true);
    };

    window.addEventListener('open-lead-modal', handleOpen);
    return () => {
      window.removeEventListener('open-lead-modal', handleOpen);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !course) return;

    setLoading(true);
    const res = await submitConsultationLead({
      name,
      email,
      phone,
      course,
      message: message ? `${message} (Source: ${source})` : `Enquired via: ${source}`
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      
      // Auto close after 2.5s
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } else {
      alert("Error submitting lead: " + res.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0E061A]/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl animate-fade-up">
        
        {/* Glow backdrop bubbles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-applePurple/15 rounded-full filter blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-applePink/15 rounded-full filter blur-[50px] pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-white/[0.05] hover:text-white transition"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shadow-neonPink">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold outfit">Session Booked Successfully!</h3>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Excellent! A senior career counsellor has been allocated to review your profile. We will email details and schedule a phone callback within 1 working hour.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-applePink uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Book Free Career Counselling
              </span>
              <h3 className="text-2xl font-black tracking-tight outfit text-white leading-tight">
                Secure Your <span className="text-gradient-purple-pink">1-on-1 Session</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Allocate 15 minutes with our corporate mentors to construct custom roadmap specializations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-applePink" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elvyn Kumar"
                  className="glass-input text-xs sm:text-sm"
                />
              </div>

              {/* Contact Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-applePurple" /> Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. elvyn@gmail.com"
                  className="glass-input text-xs sm:text-sm"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-applePink" /> Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 XXX XXX XXXX"
                  className="glass-input text-xs sm:text-sm"
                />
              </div>

              {/* Preferred Course */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-applePurple" /> Certificate Program
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="glass-input text-xs sm:text-sm bg-[#0E061A] text-white"
                >
                  {COURSES_LIST.map((c, i) => (
                    <option key={i} value={c} className="bg-[#0E061A] text-white">{c}</option>
                  ))}
                </select>
              </div>

              {/* Custom Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Optional Questions or Experience Details
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. I am a recent graduate looking to build a career in software development and improve my full-stack development skills."
                  rows={2}
                  className="glass-input text-xs sm:text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-applePurple to-applePink text-xs sm:text-sm font-black text-white hover:opacity-90 transition flex items-center justify-center gap-2 hover:shadow-neonPink mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" className="brightness-150 text-white" />
                    Allocating Counselor...
                  </span>
                ) : "Book Session Now →"}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
