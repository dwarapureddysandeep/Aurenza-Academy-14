"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Check } from 'lucide-react';

// ── Custom Count-up Hook ────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number = 2000, startDelay: number = 500) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setCount(Math.round(eased * target));
        if (progress < 1) ref.current = requestAnimationFrame(step);
      };
      ref.current = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration, startDelay]);

  return count;
}

// ── Floating Wrapper Component ──────────────────────────────────────────────────
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  floatDuration?: number;
  delay?: number;
}

function FloatingCard({ children, className = '', floatDuration = 4, delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      className={`bg-white border border-borderLight rounded-card shadow-soft p-4 ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Stats hooks
  const learnersCount = useCountUp(5000, 2000, 600);
  const coursesCount = useCountUp(100, 2000, 800);
  const trainersCount = useCountUp(50, 2000, 1000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Helper to open Consultation Dialog modal
  const openConsultationModal = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-lead-modal', { detail: { source: 'Homepage Hero CTA' } });
      window.dispatchEvent(event);
    }
  };

  return (
    <section className="relative min-h-[85vh] bg-white overflow-hidden py-16 lg:py-[100px] flex items-center">
      
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-accent/5 rounded-full filter blur-[90px] pointer-events-none"></div>

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* ════════════════════ LEFT SIDE (Content) ════════════════════ */}
          <motion.div 
            className="lg:col-span-7 space-y-8 flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight">
              Advance Your Career With <span className="text-gradient-purple-pink">Industry Recognized</span> Certifications
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg text-[#5A5A6A] leading-relaxed font-sans max-w-xl font-medium">
              Learn from industry experts through live instructor-led training programs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={() => router.push('/courses')}
                className="btn-primary w-full sm:w-auto h-12"
              >
                Explore Courses
              </button>
              
              <button
                type="button"
                onClick={openConsultationModal}
                className="btn-secondary w-full sm:w-auto h-12"
              >
                Book Free Consultation
              </button>
            </div>

            {/* Search Bar (Placed below the buttons) */}
            <form onSubmit={handleSearchSubmit} className="max-w-lg w-full relative group">
              <div className="relative rounded-[16px] overflow-hidden shadow-soft border border-borderLight bg-white p-1 flex items-center justify-between">
                <div className="flex items-center pl-3 flex-1">
                  <Search className="w-5 h-5 text-[#8A8A9A] mr-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search certifications and courses..."
                    className="bg-transparent border-none text-xs sm:text-sm text-textPrimary placeholder-[#8A8A9A] focus:outline-none w-full font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-[12px] text-xs font-bold transition shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-2 text-xs font-semibold text-[#5A5A6A]">
              {[
                "Live Instructor-Led Training",
                "Industry Experts",
                "Career Support",
                "Certification Focused"
              ].map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-successGreen/10 border border-successGreen/25 flex items-center justify-center text-successGreen">
                    <Check className="w-3 h-3 stroke-[2.5px]" />
                  </div>
                  <span>{indicator}</span>
                </div>
              ))}
            </div>

          </motion.div>

          {/* ════════════════════ RIGHT SIDE (Visual) ════════════════════ */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-12 lg:mt-0 select-none">
            
            {/* Visual Area Illustration */}
            <motion.div
              className="relative w-full max-w-md mx-auto"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <img
                src="/hero-illustration.png"
                alt="Aurenza Academy — Professional learning illustration"
                className="w-full h-auto object-contain mx-auto opacity-95"
              />

              {/* FLOATING STATISTICS CARDS */}
              
              {/* Card 1: 5000+ Learners (Top Right) */}
              <FloatingCard
                className="absolute -top-6 -right-4 w-44 shadow-soft"
                floatDuration={4}
                delay={0.4}
              >
                <div className="text-center space-y-1">
                  <h4 className="text-2xl font-heading font-extrabold text-primary leading-none">
                    {learnersCount}+
                  </h4>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A9A]">
                    Active Learners
                  </p>
                </div>
              </FloatingCard>

              {/* Card 2: 100+ Courses (Left Middle) */}
              <FloatingCard
                className="absolute top-1/2 -translate-y-1/2 -left-8 w-40 shadow-soft"
                floatDuration={3.5}
                delay={0.7}
              >
                <div className="text-center space-y-1">
                  <h4 className="text-2xl font-heading font-extrabold text-secondary leading-none">
                    {coursesCount}+
                  </h4>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A9A]">
                    Elite Courses
                  </p>
                </div>
              </FloatingCard>

              {/* Card 3: 50+ Trainers (Bottom Right) */}
              <FloatingCard
                className="absolute -bottom-6 right-2 w-40 shadow-soft"
                floatDuration={4.5}
                delay={1}
              >
                <div className="text-center space-y-1">
                  <h4 className="text-2xl font-heading font-extrabold text-primary leading-none">
                    {trainersCount}+
                  </h4>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A9A]">
                    Expert Trainers
                  </p>
                </div>
              </FloatingCard>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
