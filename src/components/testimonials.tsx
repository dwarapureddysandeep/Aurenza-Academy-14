"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, X, Check, Quote, Users, Award, ShieldAlert } from 'lucide-react';

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  featured?: boolean;
  initial?: string;
  image?: string;
}

interface VideoTestimonial {
  id: string;
  studentName: string;
  courseCompleted: string;
  thumbnail: string;
  videoUrl: string;
}

interface TestimonialsProps {
  initialTestimonials: TestimonialData[];
}

export default function Testimonials({ initialTestimonials }: TestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  // Combine database-fetched testimonials with additional high-quality mock data
  const customTestimonials: TestimonialData[] = [
    {
      id: "cust-test-1",
      name: "Rahul Sharma",
      role: "Senior Cloud Engineer at Infosys",
      quote: "The AWS training was excellent. The instructor explained concepts clearly, and the hands-on labs helped me pass the certification exam confidently.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      id: "cust-test-2",
      name: "Priya Patel",
      role: "Project Manager at TCS",
      quote: "The PMP Certification preparation course gave me all the necessary credits and mock exams. Passed the PMP exam on my first attempt with flying colors!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      id: "cust-test-3",
      name: "Amit Kumar",
      role: "DevOps Architect at Wipro",
      quote: "Aurenza's DevOps program was pure gold. We deployed live Kubernetes clusters on AWS sandboxes and configured full automated CI/CD pipelines.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      id: "cust-test-4",
      name: "Neha Gupta",
      role: "UI Engineer at Accenture",
      quote: "The Next.js and React bootcamp was extremely practical. I went from basic HTML/CSS to deploying optimized production-ready server applications in 4 months.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80"
    }
  ];

  // Map initials if no image is available
  const allTestimonials = [
    ...initialTestimonials.map(t => ({
      ...t,
      image: t.image || `https://images.unsplash.com/photo-${t.id === 'test-1' ? '534528741775-53994a69daeb' : '539571696357-5a69c17a67c6'}?auto=format&fit=crop&w=120&h=120&q=80`
    })),
    ...customTestimonials
  ].slice(0, 6); // Cap at 6 written reviews

  const videoTestimonials: VideoTestimonial[] = [
    {
      id: "vid-1",
      studentName: "Vikram Aditya",
      courseCompleted: "AWS Solutions Architect",
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34287-large.mp4"
    },
    {
      id: "vid-2",
      studentName: "Meera Reddy",
      courseCompleted: "PMP Certification",
      thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-next-to-a-laptop-41617-large.mp4"
    },
    {
      id: "vid-3",
      studentName: "Siddharth Roy",
      courseCompleted: "Data Science & AI Bootcamp",
      thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-developer-working-with-multiple-monitors-42721-large.mp4"
    }
  ];

  const companyLogos = [
    { name: "TCS" },
    { name: "Infosys" },
    { name: "Wipro" },
    { name: "Accenture" },
    { name: "Cognizant" },
    { name: "HCL" },
    { name: "Tech Mahindra" }
  ];

  return (
    <section className="py-24 bg-white border-t border-borderLight relative overflow-hidden">
      
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Rating Trust Badge & Header */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          
          {/* Trust Badge Widget */}
          <div className="inline-flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-sectionBg border border-borderLight shadow-sm">
            <div className="flex items-center text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
              <span className="text-xs font-black text-textPrimary ml-1.5">4.8 / 5 Rating</span>
            </div>
            <span className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider">
              Based on 5000+ Learner Reviews
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary leading-none heading tracking-tight">
              What Our <span className="text-gradient-purple-pink">Learners Say</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              Thousands of professionals have accelerated their careers and passed certification exams confidently with Aurenza Academy.
            </p>
          </div>
        </div>

        {/* Written Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTestimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#ECECF4] rounded-[16px] p-8 shadow-sm flex flex-col justify-between hover:shadow-soft hover:-translate-y-1 transition duration-300 relative"
            >
              {/* Quote Mark Decoration */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/5 pointer-events-none" />

              <div className="space-y-4 flex-1">
                {/* Stars */}
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Student Metadata */}
              <div className="flex items-center gap-3 pt-6 border-t border-borderLight mt-6 shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-borderLight"
                />
                <div>
                  <h4 className="text-xs font-black text-textPrimary leading-none heading">{item.name}</h4>
                  <span className="text-[10px] text-textSecondary font-bold mt-1 block">{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Testimonials Subsection */}
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-extrabold text-[#7A008C] uppercase tracking-widest leading-none bg-[#7A008C]/5 px-3 py-1 rounded-full">
              Authentic Stories
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">
              Hear Directly From <span className="text-gradient-purple-pink">Our Learners</span>
            </h3>
            <p className="text-xs text-textSecondary max-w-md mx-auto">
              Real stories of career pivots, salary bumps, and certification preparation victories.
            </p>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videoTestimonials.map((vid) => (
              <div 
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="group cursor-pointer bg-white rounded-card overflow-hidden border border-borderLight shadow-sm hover:shadow-soft transition-all duration-300"
              >
                {/* Thumbnail Area */}
                <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.studentName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-95 transition duration-300">
                      <Play className="w-5 h-5 fill-primary text-primary ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info Footer */}
                <div className="p-5 space-y-1">
                  <h4 className="text-xs font-black text-textPrimary leading-none heading">{vid.studentName}</h4>
                  <p className="text-[10px] text-textSecondary font-bold">
                    Completed: <span className="text-primary">{vid.courseCompleted}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grayscale Hiring Company Logos Strip */}
        <div className="border-t border-b border-borderLight py-10 space-y-4">
          <p className="text-center text-[10px] uppercase font-extrabold tracking-widest text-[#8A8A9A]">
            Aurenza Alumni Upskill & Work At Leading Enterprises
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {companyLogos.map((logo, idx) => (
              <div 
                key={idx}
                className="text-[#8A8A9A] hover:text-primary transition duration-300 font-black tracking-widest text-xs sm:text-sm select-none border border-[#ECECF4] px-4.5 py-2.5 rounded-xl bg-[#FAFAFC]/40 cursor-default"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-textSecondary pt-4">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>Certified Trainers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>Live Instructor-Led Sessions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>Hands-On Learning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>1-on-1 Career Support</span>
          </div>
        </div>

      </div>

      {/* ── VIDEO PLAYER MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10"
            >
              {/* Close Button overlay */}
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white border border-white/10 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Native Video Player */}
              <video 
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={activeVideo.thumbnail}
              />
              
              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-4 py-2 rounded-xl text-white pointer-events-none max-w-sm hidden sm:block">
                <h4 className="text-xs font-black leading-none">{activeVideo.studentName}</h4>
                <p className="text-[10px] text-primary font-bold mt-1">Completed: {activeVideo.courseCompleted}</p>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
