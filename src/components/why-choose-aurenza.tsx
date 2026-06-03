"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Users, GraduationCap, Code, 
  Briefcase, Building2, Star, Check 
} from 'lucide-react';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Custom Counter Component for Statistics
function CountUpNumber({ 
  target, 
  suffix = '', 
  duration = 2000, 
  startTrigger = false 
}: { 
  target: number; 
  suffix?: string; 
  duration?: number; 
  startTrigger?: boolean; 
}) {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startTrigger) return;

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };
    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [startTrigger, target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function WhyChooseAurenza() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger statistics animations when scrolled into view
  useEffect(() => {
    const current = containerRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const features: FeatureCard[] = [
    {
      icon: <Video className="w-7 h-7" />,
      title: "Live Instructor Training",
      description: "Interactive live sessions led by experienced trainers with real-world industry expertise."
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Industry Experts",
      description: "Learn from certified professionals actively working in leading organizations."
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: "Certification Preparation",
      description: "Comprehensive exam-focused training designed to maximize certification success rates."
    },
    {
      icon: <Code className="w-7 h-7" />,
      title: "Hands-On Projects",
      description: "Gain practical experience through real-world projects, labs, and case studies."
    },
    {
      icon: <Briefcase className="w-7 h-7" />,
      title: "Career Support",
      description: "Resume guidance, interview preparation, and career mentoring to help you advance faster."
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Corporate Training",
      description: "Customized workforce upskilling programs designed for organizations and teams."
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAFC] border-t border-borderLight relative overflow-hidden">
      
      {/* Visual background details using Aurenza colors at low opacity */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#7A008C]/3 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#E85AD9]/3 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold text-[#7A008C] uppercase tracking-widest leading-none bg-[#7A008C]/5 px-3 py-1 rounded-full">
            Our Core Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary leading-none heading tracking-tight">
            Why Choose <span className="text-gradient-purple-pink">Aurenza Academy?</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed max-w-xl mx-auto">
            Empowering professionals with industry-focused training, expert mentorship, and globally recognized certifications.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white border border-[#ECECF4] rounded-[16px] p-8 space-y-6 hover:-translate-y-2 hover:shadow-[0px_12px_32px_rgba(0,0,0,0.10)] transition-all duration-300 ease-in-out flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Large Prominent Gradient Icon Box */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7A008C] to-[#E85AD9] flex items-center justify-center text-white shadow-md shadow-[#7A008C]/10 shrink-0 transform group-hover:scale-110 transition duration-300">
                  {feature.icon}
                </div>

                <h3 className="text-base sm:text-lg font-black text-textPrimary leading-snug group-hover:text-[#7A008C] transition-colors heading">
                  {feature.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
                  {feature.description}
                </p>
                
              </div>

              {/* Minimalist interactive indicator at bottom of card */}
              <div className="pt-4 flex items-center gap-1.5 text-[11px] font-bold text-[#7A008C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span> 
                <span className="transform translate-x-0 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Strip Component */}
        <div 
          ref={containerRef}
          className="bg-white border border-borderLight rounded-[20px] shadow-soft p-8 md:p-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-borderLight">
            
            {/* Learners Stat */}
            <div className="text-center md:px-4 space-y-1.5 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#7A008C] heading tracking-tight">
                <CountUpNumber target={5000} suffix="+" startTrigger={inView} />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-textSecondary font-black">
                Active Learners
              </span>
            </div>

            {/* Courses Stat */}
            <div className="text-center pt-6 md:pt-0 md:px-4 space-y-1.5 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#7A008C] heading tracking-tight">
                <CountUpNumber target={100} suffix="+" startTrigger={inView} />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-textSecondary font-black">
                Premium Courses
              </span>
            </div>

            {/* Trainers Stat */}
            <div className="text-center pt-6 md:pt-0 md:px-4 space-y-1.5 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#7A008C] heading tracking-tight">
                <CountUpNumber target={50} suffix="+" startTrigger={inView} />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-textSecondary font-black">
                Expert Mentors
              </span>
            </div>

            {/* Satisfaction Rate Stat */}
            <div className="text-center pt-6 md:pt-0 md:px-4 space-y-1.5 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-green-600 heading tracking-tight flex items-center justify-center gap-1">
                <CountUpNumber target={95} suffix="%" startTrigger={inView} />
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-textSecondary font-black">
                Satisfaction Rate
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
