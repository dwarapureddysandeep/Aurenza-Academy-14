import { useState, useEffect } from 'react';
import { useLeadModal } from '../context/ModalContext';
import { courseService } from '../services/db';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, User, Award, BookOpen, ChevronDown, CheckCircle, HelpCircle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const { openModal } = useLeadModal();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0); // Accordion toggle state
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseBySlug(slug);
        setCourse(data);
      } catch (err) {
        toast.error('Course details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white bg-soft-radial">
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-applePurple border-t-transparent"></div>
          <p className="text-sm font-semibold text-neutral-400">Loading program syllabus...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white bg-soft-radial">
        <div className="text-center glass-panel rounded-[32px] p-16 shadow-soft max-w-[550px] mx-auto space-y-6 animate-fade-up">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl font-black text-appleDark tracking-tight">Program Not Found</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
            We could not find the specific course details you requested. It might have been updated or moved.
          </p>
          <Link to="/courses" className="inline-flex rounded-full bg-appleDark hover:bg-applePurple text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-wider transition duration-300 shadow-soft">
            Return to Course Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-soft-radial font-sans text-appleDark min-h-screen pt-24 pb-28 relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-applePurple/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] -left-40 w-[400px] h-[400px] rounded-full bg-appleGlow/5 blur-[120px] pointer-events-none" />
      
      {/* 1. HERO HEADER */}
      <section className="py-16 relative z-10 border-b border-black/[0.03]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="space-y-6 max-w-[850px] animate-fade-up">
            <Link to="/courses" className="text-xs font-bold text-applePurple hover:text-appleGlow transition duration-300 flex items-center gap-1.5 uppercase tracking-wider">
              ← Back to Catalog
            </Link>
            
            <span className="inline-block rounded-full bg-applePurple/5 border border-applePurple/10 px-4 py-1.5 text-[11px] font-bold text-applePurple uppercase tracking-wider">
              ★ Verified Placement Cohort
            </span>
            
            <h1 className="text-[clamp(2.4rem,4.2vw,4.5rem)] font-black leading-[1.08] text-appleDark tracking-tight">
              {course.name}
            </h1>
            
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-neutral-500">
              Master job-ready development skills, study complex architectural layouts, and compile enterprise projects in coordination with our senior industry instructors.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-[13px] font-semibold text-neutral-400 pt-2">
              <span className="flex items-center gap-2"><Clock size={16} className="text-applePurple opacity-80" /> {course.duration}</span>
              <span className="flex items-center gap-2"><Star size={16} fill="currentColor" className="text-amber-400 border-transparent" /> <span className="text-appleDark font-bold">{course.rating}</span> ({course.reviewsCount} reviews)</span>
              <span className="flex items-center gap-2"><Award size={16} className="text-applePurple opacity-80" /> Level: <span className="text-appleDark font-bold">{course.level}</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT & SIDEBAR */}
      <div className="mx-auto max-w-[1200px] px-6 mt-16 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          
          {/* Main Details Body */}
          <div className="space-y-16 animate-fade-up">
            
            {/* What you will learn */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-appleDark tracking-tight">What You Will Master</h2>
              <div className="grid gap-4.5 sm:grid-cols-2">
                {[
                  'Build highly scalable dynamic web platforms',
                  'Structure complex databases and SQL schemas',
                  'Integrate secure JWT authentication protocols',
                  'Configure Docker containers & deploy to cloud models',
                  'Prepare quantitative aptitude assessment answers',
                  'Deliver technical portfolio showcases to panels'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-applePurple shrink-0 mt-1" />
                    <span className="text-[15px] font-semibold text-neutral-600">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* COLLAPSIBLE SYLLABUS ACCORDION */}
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-appleDark tracking-tight">Comprehensive Curriculum</h2>
                <p className="text-sm font-semibold text-neutral-400 mt-1">A modular, hands-on syllabus structured by senior engineers.</p>
              </div>

              <div className="border border-black/5 bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-soft">
                {course.syllabus.map((syll, index) => {
                  const isExpanded = activeModule === index;
                  return (
                    <div key={index} className="border-b border-black/[0.03] last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setActiveModule(isExpanded ? null : index)}
                        className="flex w-full items-center justify-between bg-transparent px-6 py-5 text-left transition hover:bg-appleGray duration-300"
                      >
                        <span className="text-base font-bold text-appleDark tracking-tight">{syll.module}</span>
                        <ChevronDown
                          size={18}
                          className={`text-applePurple opacity-80 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {isExpanded && (
                        <div className="bg-white/80 px-6 pb-6 pt-1 text-[14.5px] font-semibold leading-relaxed text-neutral-500 border-t border-black/[0.02]">
                          {syll.details}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* MENTOR BIOGRAPHY */}
            <section className="rounded-3xl border border-black/5 bg-white/65 backdrop-blur-md p-8 shadow-soft space-y-6">
              <h2 className="text-2xl font-black text-appleDark tracking-tight">Your Program Instructor</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-apple-gradient text-xl font-black text-white shadow-soft">
                  {course.mentor.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-black text-appleDark tracking-tight">{course.mentor.name}</h3>
                  <p className="text-xs font-black uppercase tracking-wider text-applePurple">{course.mentor.experience}</p>
                </div>
              </div>
              
              <p className="text-[15px] font-semibold leading-relaxed text-neutral-500">
                {course.mentor.bio}
              </p>
            </section>

            {/* FAQS SECTION ACCORDION */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-appleDark tracking-tight">Frequently Asked Questions</h2>
              
              <div className="border border-black/5 bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-soft">
                {course.faqs.map((faq, index) => {
                  const isFaqExpanded = activeFaq === index;
                  return (
                    <div key={index} className="border-b border-black/[0.03] last:border-b-0 bg-transparent">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isFaqExpanded ? null : index)}
                        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-appleGray duration-300"
                      >
                        <span className="text-[15px] font-bold text-appleDark tracking-tight">{faq.q}</span>
                        <ChevronDown
                          size={16}
                          className={`text-applePurple opacity-80 transition-transform duration-300 ${isFaqExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {isFaqExpanded && (
                        <div className="bg-white/80 px-6 pb-6 pt-1 text-[14.5px] font-semibold leading-relaxed text-neutral-500 border-t border-black/[0.02]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* STICKY ENROLLMENT SIDEBAR */}
          <aside className="relative lg:pt-0">
            <div className="lg:sticky lg:top-28 rounded-[32px] glass-panel p-8 shadow-premium space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-applePurple">Cohort pricing</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-appleDark tracking-tight">₹{course.price.toLocaleString()}</span>
                  <span className="text-[15px] font-bold text-neutral-300 line-through">₹{(course.price + 10000).toLocaleString()}</span>
                  <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">22% OFF</span>
                </div>
                <p className="text-[11px] font-semibold text-neutral-400">Includes all tax, study assets, and certificate costs.</p>
              </div>

              {/* Course attributes */}
              <div className="space-y-4 border-t border-b border-black/[0.03] py-5 text-[14px] font-semibold text-neutral-500">
                <div className="flex items-center justify-between">
                  <span>Learning Duration</span>
                  <span className="text-appleDark font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Placement Assistance</span>
                  <span className="text-applePurple font-black uppercase tracking-wider text-[11px]">Guaranteed Program</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mentorship Classes</span>
                  <span className="text-appleDark font-bold">1-on-1 Sessions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform Access</span>
                  <span className="text-appleDark font-bold">Lifetime Access</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => openModal(course.name)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5"
                >
                  Enroll In Course
                  <ArrowRight size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={() => openModal(course.name)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 hover:border-applePurple bg-white py-4 text-xs font-bold uppercase tracking-wider text-appleDark transition-all duration-300"
                >
                  <FileText size={16} className="text-applePurple" />
                  Download Brochure
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-neutral-400">
                <ShieldCheck size={16} className="text-applePurple opacity-80" />
                <span>100% Secure SSL checkout processed locally.</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
