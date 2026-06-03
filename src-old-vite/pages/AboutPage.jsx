import { useLeadModal } from '../context/ModalContext';
import { Shield, Sparkles, Target, Award, Users, BookOpen, Trophy } from 'lucide-react';

export default function AboutPage() {
  const { openModal } = useLeadModal();

  const values = [
    { title: 'Quality & Integrity', text: 'We build curricula alongside real Amazon and Oracle engineers. No fluff, only production-grade skills.', icon: Shield },
    { title: 'Unrestricted Access', text: 'Democratizing career advancement. We support student payment pathways to accommodate all backgrounds.', icon: Target },
    { title: 'Student-First Focus', text: 'Your dream job is our finish line. We coordinate mock reviews and portfolio critiques daily.', icon: Sparkles }
  ];

  return (
    <div className="bg-white font-sans text-appleDark pt-24">
      {/* 1. HERO HEADER */}
      <section className="bg-soft-radial py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-[1000px] px-6 text-center space-y-6 animate-fade-up">
          <span className="text-xs font-black uppercase tracking-widest text-applePurple">Our Story</span>
          <h1 className="text-[clamp(2.4rem,4vw,4.5rem)] font-black leading-tight tracking-tight text-appleDark">
            Empowering professionals to <span className="bg-apple-gradient bg-clip-text text-transparent">pivot with confidence.</span>
          </h1>
          <p className="mx-auto max-w-[760px] text-base sm:text-lg font-medium leading-relaxed text-neutral-500">
            Aurenza Academy was launched with a single objective: to dismantle the barriers preventing ambitious graduates and developers from stepping into high-paying, elite corporate tech offices.
          </p>
        </div>
      </section>

      {/* 2. THREE PILLARS VALUES */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center max-w-[600px] mx-auto space-y-2">
            <h2 className="text-3xl font-black text-appleDark tracking-tight">Our Core Values</h2>
            <p className="text-sm font-semibold text-neutral-400">The foundational guidelines that direct every class, curriculum, and placement.</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((val, idx) => (
              <div key={idx} className="rounded-2xl border border-black/5 bg-white p-8 shadow-soft hover:-translate-y-0.5 transition duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-applePurple/10 text-applePurple mb-6">
                  <val.icon size={20} />
                </div>
                <h3 className="text-lg font-black text-appleDark">{val.title}</h3>
                <p className="mt-2.5 text-[14.5px] font-medium leading-relaxed text-neutral-500">{val.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE STATEMENT & STATS */}
      <section className="bg-appleGray py-24 border-y border-neutral-100">
        <div className="mx-auto max-w-[1200px] px-6 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-applePurple">Methodology</span>
            <h2 className="text-3xl font-black text-appleDark leading-tight tracking-tight">
              An academy structured around <span className="bg-apple-gradient bg-clip-text text-transparent">practical workflows</span>, not simple slides.
            </h2>
            <p className="text-[15.5px] font-medium leading-relaxed text-neutral-500">
              At Aurenza, we believe memorizing code syntax is a failed paradigm. Our training modules center around architectural design systems, schema layouts, Git versioning checks, code reviews, and MLOps deployments.
            </p>
            <p className="text-[15.5px] font-medium leading-relaxed text-neutral-500">
              You will build a dynamic, scalable React dashboard, configure a secure Spring Boot microservices backend, and compile real SQL query triggers that will impress any product tech panel.
            </p>
            
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openModal()}
                className="rounded-full bg-applePurple px-7 py-3.5 text-sm font-black text-white hover:bg-appleGlow transition"
              >
                Schedule Career Counseling Call
              </button>
            </div>
          </div>

          {/* Graphical Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '10,000+', label: 'Trained Learners', desc: 'Across 12 global cities', icon: Users },
              { value: '95%', label: 'Placement Ratio', desc: 'Audited placement checks', icon: Trophy },
              { value: '1-on-1', label: 'Mentorship Coaching', desc: 'Direct corporate guides', icon: Award },
              { value: '28+', label: 'Course Categories', desc: 'Expanding catalog', icon: BookOpen }
            ].map((metric, idx) => (
              <div key={idx} className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft hover:shadow-premium transition">
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="text-[10px] font-black uppercase tracking-wider text-applePurple">{metric.desc}</span>
                  <metric.icon size={18} className="text-applePurple opacity-65" />
                </div>
                <p className="text-2xl font-black text-appleDark mt-4 tracking-tight">{metric.value}</p>
                <p className="text-xs font-bold text-neutral-400 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
