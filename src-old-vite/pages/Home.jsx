import { useState, useEffect } from 'react';
import { useLeadModal } from '../context/ModalContext';
import { courseService, siteService } from '../services/db';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Code, BookOpen, Bot, Layout, Trophy, Landmark } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Home() {
  const { openModal } = useLeadModal();
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseList, testimonialList] = await Promise.all([
          courseService.getCourses(),
          siteService.getTestimonials()
        ]);
        setCourses(courseList.slice(0, 3));
        setTestimonials(testimonialList.filter(t => t.featured));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white font-sans text-appleDark">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[820px] overflow-hidden bg-soft-radial pt-32">
        {/* Ambient Gradient Blob */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-applePurple/5 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-20 text-center space-y-9 relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-appleGray px-4.5 py-2 text-xs font-black text-applePurple">
            <Star size={13} fill="currentColor" />
            #1 Career Growth Academy
          </div>
          
          <h1 className="mx-auto max-w-[960px] text-[clamp(2.6rem,5vw,5.5rem)] font-black tracking-tight leading-[1.05] text-appleDark">
            Transform Your Career Into <span className="bg-apple-gradient bg-clip-text text-transparent">Something Extraordinary.</span>
          </h1>
          
          <p className="mx-auto max-w-[650px] text-lg sm:text-xl font-medium leading-relaxed text-neutral-500">
            Unlock industry-grade technical skills, 1-on-1 coaching, and direct referral opportunities with top product companies.
          </p>
          
          <div className="flex flex-col gap-3.5 sm:flex-row justify-center pt-4">
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-applePurple px-8 py-4 text-base font-black text-white hover:bg-appleGlow transition"
            >
              Book Free Counseling
              <ArrowRight size={16} />
            </button>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-8 py-4 text-base font-black text-appleDark hover:bg-appleGray transition"
            >
              Explore Courses
            </Link>
          </div>
          
          {/* Spacious borderless metrics */}
          <div className="grid max-w-[720px] grid-cols-2 gap-8 sm:grid-cols-4 pt-16 border-t border-black/5 mx-auto text-center">
            {[
              { value: '10K+', label: 'Students Trained' },
              { value: '95%', label: 'Placement Rate' },
              { value: '500+', label: 'Hiring Partners' },
              { value: '4.9 ★', label: 'Avg Rating' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl font-black tracking-tight text-applePurple">{stat.value}</p>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HIRING PARTNERS COLLAGE */}
      <section className="bg-[#F5F5F7]/30 py-16 border-y border-neutral-100">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-neutral-400">
            Our graduates are hired by tech giants
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition duration-350">
            {['Amazon', 'Oracle', 'TCS', 'Adobe', 'Flipkart', 'Infosys', 'Capgemini'].map((company, index) => (
              <span key={index} className="text-xl font-black text-appleDark tracking-tight">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION SECTION */}
      <section className="py-28 bg-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] items-center">
            <div className="space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-applePurple">Why Aurenza Academy</span>
              <h2 className="text-3xl sm:text-4xl font-black text-appleDark tracking-tight leading-tight">
                Where professional ambition <span className="bg-apple-gradient bg-clip-text text-transparent">meets</span> extraordinary opportunity.
              </h2>
              <p className="text-[17px] font-medium leading-relaxed text-neutral-500">
                Aurenza Academy is an elite career-pivoting platform constructed for graduates and professionals. We unify live cohorts, industry mentors, customized study plans, and referral pipelines.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft hover:shadow-premium transition">
                  <h3 className="text-sm font-black text-applePurple uppercase tracking-wide">Our Mission</h3>
                  <p className="mt-2 text-xs font-bold leading-relaxed text-neutral-400">Democratize high-income technical roles by providing premium education models.</p>
                </div>
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft hover:shadow-premium transition">
                  <h3 className="text-sm font-black text-applePurple uppercase tracking-wide">Our Vision</h3>
                  <p className="mt-2 text-xs font-bold leading-relaxed text-neutral-400">Equip 1 Million career aspirants with future-proof AI and engineering skills.</p>
                </div>
              </div>
            </div>

            {/* Core Features Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: '1-on-1 Mentorship', text: 'Real industry practitioners guide your curriculum, review codes, and align goals.' },
                { title: 'Placement referrals', text: 'Get direct corporate interview invitations through our robust placement pipeline.' },
                { title: 'Interactive Roadmaps', text: 'Structure your learning week-by-week using clear visual objectives and projects.' },
                { title: 'Elite Interview Prep', text: 'Conduct custom coding mock sessions, system architecture checks, and behavioral tasks.' }
              ].map((card, idx) => (
                <div key={idx} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft hover:-translate-y-1 transition duration-300">
                  <h3 className="text-lg font-black text-appleDark">{card.title}</h3>
                  <p className="mt-2 text-[14px] font-medium leading-relaxed text-neutral-500">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED DYNAMIC COURSES */}
      <section className="bg-appleGray py-28 border-y border-neutral-100">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-applePurple">Featured Programs</span>
              <h2 className="text-3xl font-black text-appleDark tracking-tight">
                Industry-grade <span className="bg-apple-gradient bg-clip-text text-transparent">curriculums</span>
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-neutral-200 px-6 py-3 text-[14px] font-black text-applePurple shadow-soft hover:-translate-y-0.5"
            >
              View All 28 Specializations <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] rounded-3xl bg-white animate-pulse border border-black/5"></div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3 animate-fade-up">
              {courses.map(course => (
                <article
                  key={course.id}
                  className="group overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-premium duration-350 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-103"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-applePurple shadow-soft">
                      {course.level}
                    </span>
                  </div>
                  
                  <div className="p-6.5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-applePurple">{course.categoryName}</p>
                      <Link to={`/courses/${course.slug}`}>
                        <h3 className="mt-2 text-xl font-black text-appleDark group-hover:text-applePurple transition line-clamp-1">{course.name}</h3>
                      </Link>
                      <p className="text-xs font-semibold text-neutral-400 mt-1">Duration: {course.duration}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-black/5 pt-4">
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wide">Investment</p>
                        <p className="text-lg font-black text-appleDark">₹{course.price.toLocaleString()}</p>
                      </div>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="rounded-full bg-applePurple px-4.5 py-2 text-xs font-black text-white hover:bg-appleGlow transition"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. AURI AI FLOATING ASSISTANT CALLOUT */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-appleGray p-8 sm:p-14 text-appleDark border border-black/5 shadow-soft">
            {/* Ambient Purple Light behind */}
            <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-applePurple/5 rounded-full filter blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-[650px] space-y-5 animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-applePurple/10 px-3.5 py-1 text-xs font-black text-applePurple">
                <Bot size={14} /> Auri AI Counselor Active
              </span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight text-appleDark">
                Struggling to find the right career direction?
              </h2>
              <p className="text-[16px] font-medium leading-relaxed text-neutral-500">
                Auri, our floating AI counselor, can analyze your skills, read your uploaded resume, identify missing technical gaps, and generate a customized week-by-week career roadmap instantly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Auri is ready! Click the floating bot at the bottom right corner of the screen.');
                  }}
                  className="rounded-full bg-applePurple px-7 py-3 text-sm font-black text-white shadow-soft hover:bg-appleGlow transition"
                >
                  Analyze My Resume
                </button>
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="rounded-full bg-white px-7 py-3 text-sm font-black text-appleDark border border-neutral-200 hover:bg-appleGray transition"
                >
                  Book human counselor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DYNAMIC TESTIMONIALS CAROUSEL */}
      <section className="bg-white py-28 border-t border-neutral-100">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-applePurple">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-appleDark tracking-tight">
              Loved by <span className="bg-apple-gradient bg-clip-text text-transparent">thousands of students</span>
            </h2>
            <p className="text-sm font-bold text-neutral-400">Real outcomes achieved by developers who pivoting using our roadmaps.</p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-60 rounded-3xl bg-appleGray border border-black/5 animate-pulse"></div>
              ))
            ) : (
              testimonials.map(test => (
                <article key={test.id} className="relative rounded-[26px] border border-black/5 bg-white p-7 shadow-soft hover:-translate-y-0.5 transition duration-350 flex flex-col justify-between space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-applePurple">
                      {Array.from({ length: test.rating }).map((_, idx) => (
                        <Star key={idx} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-4xl font-black text-purple-100 leading-none">“</span>
                  </div>

                  <p className="text-[15.5px] font-semibold leading-relaxed text-appleDark flex-1">
                    “{test.quote}”
                  </p>

                  <div className="flex items-center gap-3 border-t border-black/5 pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-applePurple text-base font-black text-white">
                      {test.initial}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-appleDark leading-none">{test.name}</h4>
                      <p className="text-[11px] font-bold text-neutral-400 mt-1">{test.role}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Bottom Lead Capture block */}
          <div className="mx-auto mt-28 max-w-[920px] rounded-[32px] border border-black/5 bg-appleGray px-6 py-16 text-center shadow-soft relative overflow-hidden">
            <div className="relative z-10 space-y-5 animate-fade-up">
              <h3 className="text-3xl font-black tracking-tight text-appleDark">
                Ready to <span className="bg-apple-gradient bg-clip-text text-transparent">level up?</span>
              </h3>
              <p className="mx-auto max-w-[500px] text-[16px] font-semibold leading-relaxed text-neutral-500">
                Claim your free counseling session to evaluate your current skillset with our senior technical advisors today.
              </p>
              <button
                type="button"
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-applePurple px-8 py-3.5 text-base font-black text-white hover:bg-appleGlow transition"
              >
                Book Free Counseling
                <ArrowRight size={16} />
              </button>
            </div>
            
            {/* Grid styling backdrops */}
            <div className="absolute inset-0 map-grid opacity-[0.25] pointer-events-none"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

