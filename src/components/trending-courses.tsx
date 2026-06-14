"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Heart, Star, Clock, Calendar, Check, X, ArrowRight, 
  Eye, BookOpen, Award, Sparkles, TrendingUp, User, Info, 
  HelpCircle, ArrowLeftRight
} from 'lucide-react';

interface SyllabusItem {
  module: string;
  details: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface Course {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  duration: string;
  level: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  mentorName: string;
  mentorExp: string;
  mentorAvatar: string;
  mentorBio: string;
  syllabus: string; // JSON string
  faqs: string; // JSON string
  createdAt: string;
}

interface TrendingCoursesProps {
  initialCourses: Course[];
}

// Helper to resolve original (strikethrough) pricing
const getOriginalPrice = (id: string, price: number) => {
  switch (id) {
    case 'course-aws': return 34999;
    case 'course-pmp': return 26999;
    case 'course-csm': return 21999;
    case 'course-azure': return 31999;
    case 'course-dsai': return 56999;
    case 'course-devops': return 42999;
    default: return Math.round(price * 1.4);
  }
};

// Helper to get upcoming batch dates
const getNextBatchDate = (id: string) => {
  switch (id) {
    case 'course-aws': return '15 June 2026';
    case 'course-pmp': return '18 June 2026';
    case 'course-csm': return '10 June 2026';
    case 'course-azure': return '22 June 2026';
    case 'course-dsai': return '12 June 2026';
    case 'course-devops': return '25 June 2026';
    default: return '15 June 2026';
  }
};

// Helper to format currency in INR style
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export default function TrendingCourses({ initialCourses }: TrendingCoursesProps) {
  const router = useRouter();

  // Filter for the 6 target trending courses in the specified order
  const trendingIds = ['course-aws', 'course-pmp', 'course-csm', 'course-azure', 'course-dsai', 'course-devops'];
  const courses = trendingIds
    .map(id => initialCourses.find(c => c.id === id))
    .filter((c): c is Course => !!c);

  // States
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [activePreviewCourse, setActivePreviewCourse] = useState<Course | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurenza_wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading wishlist', e);
        }
      }
    }
  }, []);

  // Toggle wishlist function
  const toggleWishlist = (courseId: string, name: string) => {
    let updated: string[];
    if (wishlist.includes(courseId)) {
      updated = wishlist.filter(id => id !== courseId);
      toast.error(`${name} removed from wishlist`, { id: courseId });
    } else {
      updated = [...wishlist, courseId];
      toast.success(`${name} added to wishlist!`, { 
        icon: '❤️', 
        id: courseId,
        style: {
          border: '1px solid #7A008C',
          padding: '16px',
          color: '#ffffff',
          background: '#0E061A'
        }
      });
    }
    setWishlist(updated);
    localStorage.setItem('aurenza_wishlist', JSON.stringify(updated));
  };

  // Toggle comparison item function
  const toggleCompare = (course: Course) => {
    if (compareList.includes(course.id)) {
      setCompareList(prev => prev.filter(id => id !== course.id));
      toast('Removed from comparison list', { icon: '🔄' });
    } else {
      if (compareList.length >= 3) {
        toast.error('You can compare up to 3 courses at a time.', { id: 'compare_limit' });
        return;
      }
      setCompareList(prev => [...prev, course.id]);
      toast.success(`Added ${course.name} to comparison!`, { icon: '⚖️' });
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-borderLight">
      {/* Dynamic corner gradient effects (5% opacity) */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-primary/10 to-transparent rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-borderLight pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-extrabold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" /> High Demand Certificates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary leading-none heading tracking-tight">
              Trending <span className="text-gradient-purple-pink">Certification Programs</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              Most in-demand certifications chosen by professionals worldwide. Build industry expertise via live cohort learning.
            </p>
          </div>
          
          <button
            onClick={() => router.push('/courses')}
            className="group inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-[#E85AD9] transition-colors py-2"
          >
            View All Courses 
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Courses Display Grid */}
        {/* Mobile: Horizontal swipable snap carousel | Tablet/Desktop: Grid */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 md:pb-0 scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => {
            const isWishlisted = wishlist.includes(course.id);
            const isComparing = compareList.includes(course.id);
            const originalPrice = getOriginalPrice(course.id, course.price);
            const savings = originalPrice - course.price;
            const savingsPercent = Math.round((savings / originalPrice) * 100);
            const batchDate = getNextBatchDate(course.id);

            return (
              <div 
                key={course.id}
                className="group flex-shrink-0 w-[290px] sm:w-[320px] md:w-auto snap-center bg-white rounded-card border border-borderLight overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full select-none"
              >
                {/* Image Banner Section */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Link href={`/courses/${course.slug}`} className="block w-full h-full">
                    <img 
                      src={course.image} 
                      alt={course.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  
                  {/* Compare Overlay Checkbox */}
                  <label className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-borderLight shadow-sm cursor-pointer select-none transition hover:scale-105 active:scale-95">
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => toggleCompare(course)}
                      className="w-3.5 h-3.5 rounded border-[#8A8A9A] text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <span className="text-[10px] font-extrabold text-textPrimary">Compare</span>
                  </label>

                  {/* Wishlist Overlay Button */}
                  <button 
                    onClick={() => toggleWishlist(course.id, course.name)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-borderLight shadow-sm flex items-center justify-center text-textSecondary hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Glassmorphic Curriculum Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <button 
                      onClick={() => setActivePreviewCourse(course)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-btn bg-white/95 text-textPrimary text-xs font-bold shadow-md hover:bg-white hover:scale-105 transition duration-300"
                    >
                      <Eye className="w-4 h-4 text-primary" /> View Curriculum
                    </button>
                  </div>

                  {/* Category Badge on Banner Bottom Left */}
                  <div className="absolute bottom-3 left-3 bg-[#7A008C] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {course.categoryName}
                  </div>
                </div>

                {/* Card Body details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Reviews & Ratings row */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(course.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-textPrimary">{course.rating.toFixed(1)}</span>
                    <span className="text-[10px] font-semibold text-textSecondary">({course.reviewsCount.toLocaleString()} reviews)</span>
                  </div>

                  {/* Course Title */}
                  <div className="space-y-1">
                    <Link href={`/courses/${course.slug}`} className="block group/title">
                      <h3 className="text-base sm:text-lg font-black text-textPrimary leading-snug group-hover/title:text-primary transition duration-300 heading line-clamp-1">
                        {course.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] font-semibold text-[#8A8A9A] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {course.duration} &bull; {course.level}
                    </p>
                  </div>

                  {/* Trust Factors Checklist */}
                  <div className="space-y-1.5 border-y border-borderLight py-3 text-[11px] font-semibold text-textSecondary">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>Live Interactive Classes (Cohort Model)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>PRISMA-mapped Labs & Portfolio Projects</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>1-on-1 Placement Coaching</span>
                    </div>
                  </div>

                  {/* Calendar Row */}
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-textSecondary flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> Next Live Batch:
                    </span>
                    <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full">{batchDate}</span>
                  </div>

                  {/* Course Level Display */}
                  <div className="flex items-baseline justify-between pt-2">
                    <span className="text-xs text-textSecondary font-bold">
                      Program Level
                    </span>
                    <span className="text-xs font-extrabold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full uppercase">
                      {course.level}
                    </span>
                  </div>

                  {/* Enroll CTA */}
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-lead-modal', {
                        detail: { prefilledCourse: course.name, source: 'Trending Course Card' }
                      }));
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-btn bg-gradient-purple-pink text-white text-xs font-black tracking-wider uppercase hover:opacity-95 active:scale-[0.98] transition-all duration-300 shadow-sm"
                  >
                    Join Immediately <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Details Trigger */}
                  <button
                    type="button"
                    onClick={() => setActivePreviewCourse(course)}
                    className="w-full text-center text-[10px] font-bold text-textSecondary hover:text-primary transition py-1"
                  >
                    View curriculum overview
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STICKY COMPARISON DRAWER ────────────────────────────────────────── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-borderLight shadow-[0_-10px_25px_rgba(0,0,0,0.08)] py-4 px-6"
          >
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Items List */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black">
                    {compareList.length}
                  </span>
                  <span className="text-xs font-extrabold text-textPrimary">Comparing Programs</span>
                </div>
                
                <div className="h-6 w-px bg-borderLight hidden sm:block"></div>
                
                <div className="flex items-center gap-3">
                  {compareList.map(courseId => {
                    const c = courses.find(item => item.id === courseId);
                    if (!c) return null;
                    return (
                      <div 
                        key={c.id}
                        className="flex items-center gap-2 bg-[#FAFAFC] border border-borderLight px-2.5 py-1.5 rounded-full max-w-[180px] sm:max-w-xs"
                      >
                        <img 
                          src={c.image} 
                          alt="" 
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[10px] font-bold text-textPrimary truncate">{c.name}</span>
                        <button 
                          onClick={() => setCompareList(prev => prev.filter(id => id !== c.id))}
                          className="text-textSecondary hover:text-rose-500 transition-colors p-0.5 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompareList([])}
                  className="px-4 py-2 border border-borderLight rounded-btn text-textSecondary text-xs font-bold hover:bg-[#FAFAFC] hover:text-textPrimary transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-5 py-2.5 rounded-btn bg-gradient-purple-pink text-white text-xs font-black tracking-wide uppercase hover:opacity-95 shadow-sm transition flex items-center gap-1.5"
                >
                  <ArrowLeftRight className="w-4 h-4" /> Compare Now
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DYNAMIC CURRICULUM DRAWER (SLIDES FROM RIGHT) ────────────────────────── */}
      <AnimatePresence>
        {activePreviewCourse && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePreviewCourse(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-borderLight flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full">
                      {activePreviewCourse.categoryName}
                    </span>
                    <h3 className="text-lg font-black text-textPrimary leading-snug heading mt-1.5">
                      {activePreviewCourse.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActivePreviewCourse(null)}
                    className="p-2 rounded-full border border-borderLight hover:bg-[#FAFAFC] text-textSecondary hover:text-textPrimary transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
                  
                  {/* Quick Overview stats */}
                  <div className="grid grid-cols-3 gap-3 bg-[#FAFAFC] p-4 rounded-card border border-borderLight">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-textSecondary font-semibold uppercase block">Duration</span>
                      <span className="text-xs font-bold text-textPrimary flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> {activePreviewCourse.duration}
                      </span>
                    </div>
                    <div className="text-center space-y-1 border-x border-borderLight">
                      <span className="text-[10px] text-textSecondary font-semibold uppercase block">Course Level</span>
                      <span className="text-xs font-bold text-textPrimary block">{activePreviewCourse.level}</span>
                    </div>
                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-textSecondary font-semibold uppercase block">Rating</span>
                      <span className="text-xs font-bold text-textPrimary flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" /> {activePreviewCourse.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Mentor Spotlight Card */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
                      <User className="w-4 h-4 text-primary" /> Instructor Spotlight
                    </h4>
                    
                    <div className="premium-glass-card p-4 flex gap-4 items-start rounded-card">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary font-black flex items-center justify-center text-lg shrink-0 select-none">
                        {activePreviewCourse.mentorAvatar || activePreviewCourse.mentorName.charAt(0)}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div>
                          <h5 className="text-sm font-bold text-textPrimary">{activePreviewCourse.mentorName}</h5>
                          <span className="text-[10px] font-bold text-[#E85AD9] block">{activePreviewCourse.mentorExp}</span>
                        </div>
                        <p className="text-[11px] text-textSecondary leading-relaxed italic">
                          "{activePreviewCourse.mentorBio || 'Professional certifications tutor mapping live project-based workflows for graduates.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modules Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-primary" /> Curriculum Modules
                    </h4>

                    <div className="relative pl-4 border-l border-primary/20 space-y-6">
                      {(() => {
                        try {
                          const modules: SyllabusItem[] = JSON.parse(activePreviewCourse.syllabus);
                          return modules.map((mod, idx) => (
                            <div key={idx} className="relative space-y-1">
                              {/* Connector dot */}
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                              
                              <h5 className="text-xs font-extrabold text-textPrimary">{mod.module}</h5>
                              <p className="text-[11px] text-textSecondary leading-relaxed">{mod.details}</p>
                            </div>
                          ));
                        } catch (e) {
                          return <p className="text-xs text-textSecondary">Curriculum outlines currently loading.</p>;
                        }
                      })()}
                    </div>
                  </div>

                  {/* Frequently Asked Questions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-primary" /> Frequently Asked Questions
                    </h4>

                    <div className="space-y-3">
                      {(() => {
                        try {
                          const faqs: FAQItem[] = JSON.parse(activePreviewCourse.faqs);
                          return faqs.map((faq, idx) => (
                            <div key={idx} className="bg-[#FAFAFC] border border-borderLight p-4 rounded-card space-y-1.5">
                              <h5 className="text-xs font-extrabold text-textPrimary flex items-start gap-1.5">
                                <span className="text-primary font-black">Q:</span>
                                <span>{faq.q}</span>
                              </h5>
                              <p className="text-[11px] text-textSecondary leading-relaxed pl-4">
                                {faq.a}
                              </p>
                            </div>
                          ));
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-borderLight bg-[#FAFAFC] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-textSecondary font-semibold">Program Level</span>
                    <span className="text-base font-extrabold text-primary block">
                      {activePreviewCourse.level}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActivePreviewCourse(null)}
                      className="px-4 py-2.5 rounded-btn border border-borderLight bg-white text-xs font-bold text-textSecondary hover:text-textPrimary transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setActivePreviewCourse(null);
                        window.dispatchEvent(new CustomEvent('open-lead-modal', {
                          detail: { prefilledCourse: activePreviewCourse.name, source: 'Curriculum Preview Modal' }
                        }));
                      }}
                      className="px-6 py-2.5 rounded-btn bg-gradient-purple-pink text-white text-xs font-black tracking-wider uppercase hover:opacity-95 shadow-sm transition flex items-center gap-1"
                    >
                      Join Immediately <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FULL SCREEN COMPARISON TABLE MODAL ────────────────────────── */}
      <AnimatePresence>
        {isCompareModalOpen && compareList.length > 0 && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-card shadow-2xl flex flex-col justify-between overflow-hidden border border-borderLight z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-borderLight flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-textPrimary heading flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-primary" /> Program Comparison Sheet
                  </h3>
                  <p className="text-[11px] text-textSecondary font-semibold">
                    Compare technical specifications, syllabus focus, pricing structures, and live cohort schedules side-by-side.
                  </p>
                </div>
                <button 
                  onClick={() => setIsCompareModalOpen(false)}
                  className="p-2 rounded-full border border-borderLight hover:bg-[#FAFAFC] text-textSecondary hover:text-textPrimary transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid content container (Scrollable) */}
              <div className="flex-1 overflow-auto p-6 scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-borderLight">
                      <th className="py-4 px-4 w-1/4 text-xs font-extrabold uppercase text-[#8A8A9A]">Metric</th>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return (
                          <th key={c.id} className="py-4 px-4 w-1/4">
                            <div className="space-y-3">
                              <img 
                                src={c.image} 
                                alt="" 
                                className="w-full h-24 object-cover rounded-card border border-borderLight"
                              />
                              <div>
                                <span className="text-[8px] font-extrabold text-primary uppercase tracking-widest block bg-primary/5 px-2 py-0.5 rounded-full w-max">
                                  {c.categoryName}
                                </span>
                                <h4 className="text-xs font-black text-textPrimary leading-snug heading mt-1">
                                  {c.name}
                                </h4>
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderLight text-xs font-semibold text-textSecondary">
                    
                    {/* Level */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary">Level</td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return <td key={c.id} className="py-4 px-4 text-textPrimary font-bold">{c.level}</td>;
                      })}
                    </tr>

                    {/* Duration */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary">Duration</td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return <td key={c.id} className="py-4 px-4">{c.duration}</td>;
                      })}
                    </tr>

                    {/* Rating & Reviews */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary">Rating score</td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return (
                          <td key={c.id} className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-textPrimary">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                              <span className="font-bold">{c.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-textSecondary font-semibold">({c.reviewsCount.toLocaleString()} reviews)</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Mentor Name */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary">Mentor Spotlight</td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return (
                          <td key={c.id} className="py-4 px-4">
                            <span className="font-bold text-textPrimary block">{c.mentorName}</span>
                            <span className="text-[10px] text-[#E85AD9] block">{c.mentorExp}</span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Up Next Live Batch */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary">Up Next Live Batch</td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return (
                          <td key={c.id} className="py-4 px-4">
                            <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full font-bold">
                              {getNextBatchDate(c.id)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Syllabus overview */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary valign-top">Core Modules Preview</td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        let modules: SyllabusItem[] = [];
                        try {
                          modules = JSON.parse(c.syllabus);
                        } catch(e) {}
                        return (
                          <td key={c.id} className="py-4 px-4 align-top">
                            <ul className="space-y-2 list-none">
                              {modules.slice(0, 3).map((mod, idx) => (
                                <li key={idx} className="text-[10px] text-textSecondary leading-relaxed">
                                  &bull; <strong className="text-textPrimary">{mod.module.split(':')[0]}</strong>: {mod.details.substring(0, 60)}...
                                </li>
                              ))}
                            </ul>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Actions Row */}
                    <tr>
                      <td className="py-4 px-4 font-bold text-textPrimary"></td>
                      {compareList.map(courseId => {
                        const c = courses.find(item => item.id === courseId);
                        if (!c) return null;
                        return (
                          <td key={c.id} className="py-4 px-4">
                            <button
                              onClick={() => {
                                setIsCompareModalOpen(false);
                                window.dispatchEvent(new CustomEvent('open-lead-modal', {
                                  detail: { prefilledCourse: c.name, source: 'Comparison Sheet' }
                                }));
                              }}
                              className="w-full py-2.5 px-4 rounded-btn bg-gradient-purple-pink text-white text-[10px] font-black tracking-wide uppercase hover:opacity-95 shadow-sm transition"
                            >
                              Join Immediately
                            </button>
                          </td>
                        );
                      })}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-borderLight bg-[#FAFAFC] flex justify-end gap-3">
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-5 py-2.5 rounded-btn border border-borderLight bg-white text-xs font-bold text-textSecondary hover:text-textPrimary transition"
                >
                  Close Comparison
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
