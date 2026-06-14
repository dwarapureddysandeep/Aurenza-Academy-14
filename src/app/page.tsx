import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Code, Laptop, Users, Target, Phone, Mail, MapPin, ChevronRight, Sparkles, GraduationCap } from 'lucide-react';

import { db } from '@/lib/db';
import CourseFilterGrid from '@/components/course-filter-grid';
import RoadmapExplorer from '@/components/roadmap-explorer';
import FAQAccordion from '@/components/faq-accordion';
import CorporateForm from '@/components/corporate-form';
import ContactForm from '@/components/contact-form';
import CounselingButton from '@/components/counseling-button';
import HeroSection from '@/components/hero-section';
import PopularCategories from '@/components/popular-categories';
import TrendingCourses from '@/components/trending-courses';
import WhyChooseAurenza from '@/components/why-choose-aurenza';
import Testimonials from '@/components/testimonials';
import CorporateTraining from '@/components/corporate-training';

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function HomePage() {
  // Fetch dynamic data straight from the database
  const courses = await db.course.findMany();
  const testimonials = await db.testimonial.findMany();
  const batches = await db.batch.findMany();
  const webinars = await db.webinar.findMany();

  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans">
      
      {/* ==========================================
         SECTION 1: HERO SECTION (White Background - Duplicating First Screenshot)
         ========================================== */}
      <HeroSection />

      {/* ==========================================
         NEW SECTION: POPULAR CATEGORIES (Course Discovery Section)
         ========================================== */}
      <PopularCategories />

      {/* ==========================================
         NEW SECTION: TRENDING COURSES (Primary Conversion Section)
         ========================================== */}
      <TrendingCourses initialCourses={courses as any} />

      {/* ==========================================
         SECTION 2: FEATURED CERTIFICATIONS (Off-White Background - Duplicating Second Screenshot)
         ========================================== */}
      <section className="py-24 bg-sectionBg border-t border-borderLight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Prestige Programs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Explore Our <span className="text-gradient-purple-pink">Flagship Certifications</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Curriculums mapped to international standards, live interactive classes, and corporate review sessions.
            </p>
          </div>

          {/* Dynamic filtering courses catalog */}
          <CourseFilterGrid initialCourses={courses} />

        </div>
      </section>

      {/* ==========================================
         SECTION 3: CAREER ROADMAP EXPLORER (White Background)
         ========================================== */}
      <section className="py-24 border-t border-borderLight bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Interactive Navigator</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Career <span className="text-gradient-purple-pink">Roadmap Explorer</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Choose your current background status and trace your high-paying engineering roadmap step-by-step.
            </p>
          </div>

          <RoadmapExplorer />

        </div>
      </section>

      {/* ==========================================
         SECTION 4: WHY CHOOSE AURENZA (Trust & Differentiation Section)
         ========================================== */}
      <WhyChooseAurenza />

      {/* ==========================================
         SECTION 5: UPCOMING BATCHES (White Background)
         ========================================== */}
      <section className="py-24 border-t border-borderLight bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Scheduler</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Upcoming <span className="text-gradient-purple-pink">Cohort Timetable</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Secure your batch seat. Cohorts are limited to 30 seats to ensure proper mock reviews and 1-on-1 counselor allocations.
            </p>
          </div>

          <div className="bg-white border border-borderLight rounded-2xl overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-borderLight bg-sectionBg text-textPrimary font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-5 font-black">Certification Program</th>
                    <th className="p-5 font-black">Cohort Start Date</th>
                    <th className="p-5 font-black">Class Time Slots</th>
                    <th className="p-5 font-black">Corporate Mentor</th>
                    <th className="p-5 font-black text-center">Remaining Seats</th>
                    <th className="p-5 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight text-xs text-textSecondary">
                  {batches.map((batch: any) => {
                    const matchedCourse = courses.find((c: any) => c.id === batch.courseId);
                    return (
                      <tr key={batch.id} className="hover:bg-sectionBg/40 transition duration-200">
                        <td className="p-5 font-extrabold text-textPrimary heading flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0"></div>
                          {matchedCourse ? matchedCourse.name : "Engineering Course"}
                        </td>
                        <td className="p-5 font-medium text-textPrimary">{batch.startDate}</td>
                        <td className="p-5 font-medium text-textPrimary">{batch.timeSlot}</td>
                        <td className="p-5 text-textPrimary font-bold">Dr. Ramesh Kumar</td>
                        <td className="p-5 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-primary/5 text-primary font-bold text-[10px] tracking-wider uppercase border border-primary/10">
                            {batch.seatsLeft} Seats Left
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <CounselingButton
                            source="Timetable Batches Grid"
                            prefilledCourse={matchedCourse?.name}
                            className="px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-[10px] text-white tracking-wider uppercase transition shadow-soft font-black"
                          >
                            Reserve Seat &rarr;
                          </CounselingButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
         SECTION 6: TESTIMONIALS (Social Proof & Trust Section)
         ========================================== */}
      <Testimonials initialTestimonials={testimonials} />

      {/* ==========================================
         SECTION 7: CORPORATE TRAINING (High-Value Lead Generation Section)
         ========================================== */}
      <CorporateTraining />

      {/* ==========================================
         SECTION 8: UPCOMING WEBINARS (Off-White Background)
         ========================================== */}
      <section className="py-24 bg-sectionBg border-t border-borderLight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Learning Events</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
              Upcoming Live <span className="text-gradient-purple-pink">Career Webinars</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Join free interactive sessions led by active technology directors. Get live career advice and QA sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {webinars.map((web: any) => (
              <div 
                key={web.id}
                className="premium-glass-card p-6 space-y-4 border-l-4 border-l-primary relative overflow-hidden hover:-translate-y-1 transition duration-300"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{web.status} Masterclass</span>
                  <h4 className="text-md sm:text-lg font-extrabold text-textPrimary heading leading-snug">{web.title}</h4>
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">{web.description}</p>
                </div>

                <div className="pt-3 border-t border-borderLight grid grid-cols-2 gap-3 text-xs text-textSecondary">
                  <div>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">Corporate Speaker</span>
                    <strong className="text-textPrimary mt-0.5 block">{web.speaker}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider">Date & Time</span>
                    <strong className="text-textPrimary mt-0.5 block">{web.date} ({web.time})</strong>
                  </div>
                </div>

                <CounselingButton
                  source="Webinars Registration Grid"
                  prefilledCourse={`Webinar: ${web.title}`}
                  className="w-full py-3 rounded-lg bg-sectionBg border border-borderLight hover:border-primary hover:bg-primary/5 text-xs font-bold text-textPrimary hover:text-primary transition text-center"
                >
                  Register For Free Session
                </CounselingButton>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
         SECTION 10: FAQ SECTION (Objection Handling & Conversion Booster)
         ========================================== */}
      <section className="py-24 bg-sectionBg border-t border-borderLight">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold text-[#7A008C] uppercase tracking-widest bg-[#7A008C]/5 px-3 py-1 rounded-full">
              Got Questions? We Have Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading tracking-tight">
              Frequently Asked <span className="text-gradient-purple-pink">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              Find answers to the most common questions about our courses, certifications, and training programs.
            </p>
          </div>

          <FAQAccordion />

        </div>
      </section>

      {/* ==========================================
         SECTION 11: HQ CONTACTS HUB & MAP (White Background)
         ========================================== */}
      <section id="contact-section" className="py-24 border-t border-borderLight bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Contact details & Map */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Connect with our team</span>
                <h2 className="text-3xl font-extrabold text-textPrimary heading">
                  Visit Our HQ or <span className="text-gradient-purple-pink">Talk to an Advisor</span>
                </h2>
                <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                  Have questions about course costs, weekend cohort schedules, or placement referral guarantees? Talk to our corporate counseling team directly.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-textPrimary font-semibold">
                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Academy Head Office</h5>
                    <p className="text-xs text-textSecondary mt-1">Gajuwaka, Vishakapatanam, India</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Corporate Hotline</h5>
                    <Link href="tel:+917013057827" className="text-xs text-textSecondary hover:text-primary transition mt-1 block">+91 7013057827</Link>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-textPrimary heading">Support Mail</h5>
                    <Link href="mailto:info@aurenzaacademy.com" className="text-xs text-textSecondary hover:text-primary transition mt-1 block">info@aurenzaacademy.com</Link>
                  </div>
                </div>
              </div>

              {/* HQ Map overlay */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-borderLight bg-sectionBg">
                <iframe 
                  src="https://maps.google.com/maps?q=Gajuwaka,%20Vishakapatanam,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, opacity: 0.8 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aurenza HQ Google Maps"
                ></iframe>
              </div>
            </div>

            {/* Inbound lead query form */}
            <div className="lg:col-span-6 bg-sectionBg border border-borderLight p-6 sm:p-8 rounded-[32px] shadow-premium relative self-stretch flex flex-col justify-center">
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-extrabold text-textPrimary heading leading-none">Drop Us A Message</h4>
                <p className="text-xs text-textSecondary">Specify your questions, and our enrollment officers will email standard brochures.</p>
              </div>
              <ContactForm />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
