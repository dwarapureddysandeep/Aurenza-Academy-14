import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Users, Star, BookOpen, User, Calendar, MessageSquare, ArrowRight, ShieldCheck, Sparkles, Award, PlayCircle } from 'lucide-react';
import { db } from '@/lib/db';
import FAQAccordion from '@/components/faq-accordion';
import CourseActionsWidget from '@/components/course-actions-widget';
import ReserveSeatButton from '@/components/reserve-seat-button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch course details
  const course = await db.course.findUnique({
    where: { slug }
  });

  if (!course) {
    notFound();
  }

  // 2. Fetch course batches
  const batches = await db.batch.findMany({
    where: { courseId: course.id }
  });

  // 3. Fetch general testimonials for outcomes section
  const testimonials = await db.testimonial.findMany();

  // 4. Parse syllabus and FAQs JSON arrays safely
  let syllabusItems = [];
  if (course.syllabus) {
    try {
      const parsed = typeof course.syllabus === 'string' ? JSON.parse(course.syllabus) : course.syllabus;
      syllabusItems = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      syllabusItems = [];
    }
  }

  let faqItems = [];
  if (course.faqs) {
    try {
      const parsed = typeof course.faqs === 'string' ? JSON.parse(course.faqs) : course.faqs;
      faqItems = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      faqItems = [];
    }
  }

  // Fake enrolled counter based on reviews count
  const baseEnroll = course.reviewsCount ? course.reviewsCount * 412 : 124580;
  const enrolledString = baseEnroll.toLocaleString();

  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans relative">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[800px] left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[130px] pointer-events-none"></div>

      {/* ─── BREADCRUMBS ─── */}
      <div className="bg-sectionBg border-b border-borderLight py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-[11px] font-bold uppercase tracking-wider text-textSecondary flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/courses" className="hover:text-primary transition">Certifications</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-textPrimary">{course.name}</span>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="py-16 sm:py-20 border-b border-borderLight bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> {course.level}
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0C182F] heading leading-tight">
                {course.name} <span className="text-gradient-purple-pink">Certification</span> Program
              </h1>

              <p className="text-sm sm:text-base text-textSecondary leading-relaxed max-w-2xl">
                Master this curriculum mapped directly to international corporate standards. Engage in weekly weekend live cohorts led by active technology directors, deploy real-world containerized microservices, and gain direct recruitment referrals.
              </p>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-4 items-center pt-2">
                <div className="flex items-center gap-1 bg-[#F8FAFC] border border-borderLight px-3 py-1.5 rounded-full text-xs font-bold text-textPrimary shadow-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>{course.rating} ({course.reviewsCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-1 bg-[#F8FAFC] border border-borderLight px-3 py-1.5 rounded-full text-xs font-bold text-textPrimary shadow-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{course.duration} Duration</span>
                </div>
                <div className="flex items-center gap-1 bg-[#F8FAFC] border border-borderLight px-3 py-1.5 rounded-full text-xs font-bold text-textPrimary shadow-sm">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>{enrolledString} Learners Enrolled</span>
                </div>
              </div>

              {/* Trust Badge Grid */}
              <div className="grid gap-4 sm:grid-cols-2 pt-6">
                {[
                  { title: "Verifiable Credential", desc: "Cryptographically signed ID to display on professional sites." },
                  { title: "Live Cohort Interactive", desc: "Ask queries 1-on-1 and undergo live code reviews." },
                  { title: "Hiring Partners Referrals", desc: "Submit resume directly to our network of 500+ tech consultancies." },
                  { title: "Refund Protection Policy", desc: "100% guarantee before the commencement of batch lectures." }
                ].map((badge, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-4 rounded-2xl bg-sectionBg border border-borderLight">
                    <ShieldCheck className="w-5 h-5 text-successGreen shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-textPrimary heading">{badge.title}</h4>
                      <p className="text-[11px] text-textSecondary mt-0.5 leading-normal">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Booking/Checkout Column */}
            <div className="lg:col-span-5 bg-white border border-borderLight p-6 sm:p-8 rounded-[32px] shadow-premium relative">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/5 rounded-full filter blur-[45px] pointer-events-none"></div>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#7E8B9B] uppercase tracking-wider block">Join a Cohort</span>
                  <h3 className="text-lg font-black text-textPrimary heading mt-1">Submit Enquiry</h3>
                  <p className="text-[11px] text-textSecondary mt-1.5 leading-relaxed">
                    Weekend live cohorts are led by active technology directors. Submit an enquiry to reserve your seat, schedule a counseling callback, or get direct curriculum referrals.
                  </p>
                </div>

                <CourseActionsWidget courseName={course.name} courseId={course.id} />

                <div className="pt-4 border-t border-borderLight space-y-3.5 text-xs text-textSecondary">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span>Includes certified diploma credentials verified by block links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-secondary" />
                    <span>36+ Hours of high-definition weekend lecture recordings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Direct access to private Slack channels for learner peer groups</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── QUICK NAV BAR ─── */}
      <div className="sticky top-20 z-40 bg-white border-b border-borderLight shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex gap-8 text-xs font-bold text-textSecondary py-4">
          <a href="#overview" className="hover:text-primary transition">Overview</a>
          <a href="#curriculum" className="hover:text-primary transition">Syllabus Curriculum</a>
          <a href="#mentor" className="hover:text-primary transition">Corporate Mentor</a>
          <a href="#batches" className="hover:text-primary transition">Cohort Timetable</a>
          <a href="#testimonials" className="hover:text-primary transition">Alumni Reviews</a>
          <a href="#faqs" className="hover:text-primary transition">FAQs</a>
        </div>
      </div>

      {/* ─── OVERVIEW SECTION ─── */}
      <section id="overview" className="py-20 bg-sectionBg border-b border-borderLight scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0C182F] heading">Program Objectives & Focus</h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                This comprehensive upskilling certification program is tailored for graduates and working professionals wishing to make high-paying career pivots into modern tech environments. We bypass classical academic textbook theories and focus 100% on real-world product engineering pipelines.
              </p>
              
              <div className="grid gap-6 sm:grid-cols-2 pt-4">
                <div className="bg-white border border-borderLight p-6 rounded-2xl space-y-2.5">
                  <h4 className="font-extrabold text-sm text-textPrimary flex items-center gap-2 heading">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">1</span>
                    Sandbox Labs Training
                  </h4>
                  <p className="text-xs text-textSecondary leading-relaxed">Implement modern coding standards. Gain experience by deploying container microservices on live sandbox environments.</p>
                </div>
                <div className="bg-white border border-borderLight p-6 rounded-2xl space-y-2.5">
                  <h4 className="font-extrabold text-sm text-textPrimary flex items-center gap-2 heading">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center">2</span>
                    1-on-1 Mentoring Checks
                  </h4>
                  <p className="text-xs text-textSecondary leading-relaxed">Have your code reviewed and query logs cleared directly during weekly feedback sessions with active software directors.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-borderLight p-6 rounded-[24px] space-y-4 shadow-soft">
              <h4 className="font-extrabold text-sm text-textPrimary heading border-b border-borderLight pb-3">Key Technical Competencies</h4>
              <ul className="space-y-3 text-xs font-semibold text-textSecondary">
                <li className="flex items-center gap-2">✓ Advanced modular clean coding structure</li>
                <li className="flex items-center gap-2">✓ CI/CD deployment pipelines setup</li>
                <li className="flex items-center gap-2">✓ Restful APIs integration and schema models</li>
                <li className="flex items-center gap-2">✓ Unit tests integration testing frameworks</li>
                <li className="flex items-center gap-2">✓ Interactive frontend component frameworks</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CURRICULUM SECTION ─── */}
      <section id="curriculum" className="py-20 border-b border-borderLight bg-white scroll-mt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Syllabus Blueprint</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Detailed Modules Curriculum</h2>
            <p className="text-xs sm:text-sm text-textSecondary">Structure designed sequentially to accommodate beginners and non-CS professionals.</p>
          </div>

          <div className="space-y-4">
            {syllabusItems.length > 0 ? (
              syllabusItems.map((item: any, idx: number) => (
                <div key={idx} className="border border-borderLight rounded-2xl overflow-hidden bg-[#F8FAFC]">
                  <div className="p-5 bg-white border-b border-borderLight flex justify-between items-center">
                    <h4 className="text-sm font-extrabold text-[#0C182F] heading flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/5 text-primary text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {item.module}
                    </h4>
                  </div>
                  <div className="p-5 text-xs text-textSecondary leading-relaxed bg-[#F8FAFC]">
                    {item.details}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-textSecondary py-6">Custom syllabus elements loading...</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── MENTOR SECTION ─── */}
      <section id="mentor" className="py-20 bg-sectionBg border-b border-borderLight scroll-mt-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Syllabus Directors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Meet Your Corporate Instructor</h2>
          </div>

          <div className="bg-white border border-borderLight p-6 sm:p-8 rounded-[32px] flex flex-col md:flex-row gap-8 items-center shadow-soft">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] bg-gradient-to-r from-primary to-accent font-black text-white text-3xl flex items-center justify-center shrink-0 shadow-soft">
              {course.mentorAvatar || (course.mentorName ? course.mentorName.substring(0, 1) : "M")}
            </div>
            
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#0C182F] heading">{course.mentorName}</h4>
                <span className="text-xs font-bold text-primary mt-1 block uppercase tracking-wider">{course.mentorExp}</span>
              </div>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
                "{course.mentorBio}"
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-sectionBg border border-borderLight text-[10px] font-bold text-textPrimary">Ex-Amazon Lead</span>
                <span className="px-3 py-1 rounded-full bg-sectionBg border border-borderLight text-[10px] font-bold text-textPrimary">10+ Enterprise Mentorships</span>
                <span className="px-3 py-1 rounded-full bg-sectionBg border border-borderLight text-[10px] font-bold text-textPrimary">1-on-1 Review Allocation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BATCHES TABLE SECTION ─── */}
      <section id="batches" className="py-20 border-b border-borderLight bg-white scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Timetable</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Upcoming Live Cohorts</h2>
            <p className="text-xs sm:text-sm text-textSecondary max-w-lg mx-auto">
              Secure your batch seat. Cohorts are limited to 30 seats to ensure proper feedback cycles and counselor allocations.
            </p>
          </div>

          <div className="bg-white border border-borderLight rounded-2xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-borderLight bg-sectionBg text-textPrimary font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-5 font-black">Cohort Start Date</th>
                    <th className="p-5 font-black">Class Time Slots</th>
                    <th className="p-5 font-black">Delivery Mode</th>
                    <th className="p-5 font-black text-center">Remaining Seats</th>
                    <th className="p-5 text-right font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight text-xs text-textSecondary">
                  {batches.length > 0 ? (
                    batches.map((batch: any) => (
                      <tr key={batch.id} className="hover:bg-sectionBg/40 transition duration-200">
                        <td className="p-5 font-extrabold text-textPrimary heading flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0"></div>
                          {batch.startDate}
                        </td>
                        <td className="p-5 font-semibold text-textPrimary">{batch.timeSlot}</td>
                        <td className="p-5 font-bold text-textPrimary uppercase tracking-wider text-[10px] text-primary">Weekend Live Cohort</td>
                        <td className="p-5 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-primary/5 text-primary font-bold text-[10px] tracking-wider uppercase border border-primary/10">
                            {batch.seatsLeft} Seats Left
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <ReserveSeatButton 
                            courseName={course.name} 
                            startDate={batch.startDate} 
                            timeSlot={batch.timeSlot} 
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-xs text-textSecondary font-semibold">
                        No upcoming cohorts scheduled at the moment. Drop us a message for special batches.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS OUTCOMES ─── */}
      <section id="testimonials" className="py-20 bg-sectionBg border-b border-borderLight scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Alumni Outcomes</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Pivoted Career Paths</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((test: any) => (
              <div key={test.id} className="premium-glass-card p-6 flex flex-col justify-between space-y-6 hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                    ))}
                  </div>
                  <span className="text-3xl font-bold text-primary opacity-20 leading-none">“</span>
                </div>

                <p className="text-[13px] leading-relaxed font-semibold text-textSecondary">
                  “{test.quote}”
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-borderLight">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-black text-white flex items-center justify-center shrink-0">
                      {test.initial}
                    </span>
                    <div>
                      <h5 className="text-xs font-black text-textPrimary heading leading-none">{test.name}</h5>
                      <p className="text-[9px] text-textSecondary font-bold mt-1 uppercase tracking-wider">{test.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section id="faqs" className="py-20 bg-white border-b border-borderLight scroll-mt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Got questions?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading">Frequently Asked Questions</h2>
          </div>

          {faqItems.length > 0 ? (
            <div className="space-y-4">
              {faqItems.map((faq: any, idx: number) => (
                <div key={idx} className="border border-borderLight rounded-xl p-5 space-y-2 bg-sectionBg">
                  <h4 className="font-extrabold text-xs sm:text-sm text-textPrimary heading flex gap-2">
                    <span className="text-primary font-black">Q:</span> {faq.q}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-textSecondary leading-relaxed pl-4 border-l border-primary/20">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <FAQAccordion />
          )}
        </div>
      </section>

    </div>
  );
}
