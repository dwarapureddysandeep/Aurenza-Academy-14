import { useLeadModal } from '../context/ModalContext';
import { Bot, Map, Users, Target, BookOpen, Compass, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CareerGuidancePage() {
  const { openModal } = useLeadModal();

  const careerTracks = [
    { title: 'Frontend Developer', salary: '5 - 18 LPA', skills: 'HTML, CSS, Tailwind, JS, React, Next.js', course: 'Frontend Development (React & Next.js)' },
    { title: 'Full Stack Java Engineer', salary: '6 - 22 LPA', skills: 'Java, Spring Boot, Microservices, React, SQL', course: 'Java Full Stack Development' },
    { title: 'Data Scientist', salary: '7 - 25 LPA', skills: 'Python, SQL, Statistics, Pandas, Machine Learning', course: 'Data Science & Analytics' },
    { title: 'AI & ML Engineer', salary: '8 - 35 LPA', skills: 'Neural Networks, CV, NLP, Transformers, PyTorch', course: 'AI & Machine Learning Engineering' }
  ];
  return (
    <div className="bg-white bg-soft-radial font-sans text-appleDark min-h-screen pt-24 pb-28 relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -left-30 w-[380px] h-[380px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />

      {/* 1. HEADER SECTION */}
      <section className="py-20 relative z-10 border-b border-black/[0.03]">
        <div className="mx-auto max-w-[1200px] px-6 text-center space-y-5 animate-fade-up">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-applePurple bg-applePurple/5 px-3.5 py-1.5 rounded-full border border-applePurple/10">Guidance Portal</span>
          <h1 className="text-[clamp(2.4rem,4.5vw,4.5rem)] font-black leading-[1.08] text-appleDark tracking-tight">
            Navigate your career with <span className="bg-apple-gradient bg-clip-text text-transparent">clarity & precision</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-base font-semibold leading-relaxed text-neutral-400">
            Uncertain which specialized path aligns with your background? Evaluate options and build optimal roadmaps.
          </p>
        </div>
      </section>

      {/* 2. DYNAMIC CAREER SPECIALIZATIONS */}
      <section className="py-24 relative z-10">
        <div className="mx-auto max-w-[1200px] px-6 space-y-16">
          <div className="text-center max-w-[700px] mx-auto space-y-3 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-black text-appleDark tracking-tight">Featured Specializations</h2>
            <p className="text-sm font-semibold text-neutral-400">Explore entry-level packages, essential skills, and matched Aurenza bootcamps.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 animate-fade-up">
            {careerTracks.map((track, idx) => (
              <div key={idx} className="premium-card rounded-3xl p-8 shadow-soft flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-appleDark tracking-tight">{track.title}</h3>
                    <span className="rounded-full bg-applePurple/5 border border-applePurple/10 px-3.5 py-1.5 text-[11px] font-bold text-applePurple uppercase tracking-wider">
                      Avg CTC: {track.salary}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-applePurple bg-applePurple/5 px-2.5 py-1 rounded-full border border-applePurple/10 inline-block">Key Skill Requirements</p>
                    <p className="text-[15px] font-semibold text-neutral-500 mt-3">{track.skills}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-black/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-neutral-400">
                    Recommended: <strong className="text-appleDark font-bold">{track.course}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => openModal(track.course)}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-applePurple hover:text-appleGlow transition duration-300"
                  >
                    View Roadmap <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MENTOR & AI COUNSELING CALLOUT */}
      <section className="bg-appleGray/45 py-24 border-y border-black/[0.03] relative z-10">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-14 lg:grid-cols-2 items-center animate-fade-up">
            <div className="space-y-6">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-applePurple bg-applePurple/5 px-3.5 py-1.5 rounded-full border border-applePurple/10">Interactive counseling</span>
              <h2 className="text-3xl sm:text-4xl font-black text-appleDark tracking-tight leading-[1.1]">
                Two ways to evaluate <span className="bg-apple-gradient bg-clip-text text-transparent">your tech potential</span>
              </h2>
              <p className="text-base font-semibold leading-[1.55] text-neutral-400">
                Choose between speaking to our expert senior corporate mentors or triggering Auri, our career assistant chatbot that processes resumes in real-time.
              </p>
              
              <div className="space-y-6 pt-2">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10 font-bold text-sm">1</span>
                  <div>
                    <h4 className="text-base font-black text-appleDark tracking-tight">Personal Advisor Counseling</h4>
                    <p className="text-sm font-semibold text-neutral-400 mt-1">Submit your credentials to book a direct 1-on-1 counseling call with our senior placement director.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10 font-bold text-sm">2</span>
                  <div>
                    <h4 className="text-base font-black text-appleDark tracking-tight">AI Resume Parsing & Skill-Gap Analysis</h4>
                    <p className="text-sm font-semibold text-neutral-400 mt-1">Paste your CV directly inside the chatbot at the bottom-right for instant, automated skill mapping.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Action Widget */}
            <div className="glass-panel p-8 sm:p-12 rounded-[36px] shadow-premium text-center space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
                <Compass size={24} />
              </div>
              <h3 className="text-2xl font-black text-appleDark tracking-tight">Resolve Career Ambiguity Today</h3>
              <p className="text-[15px] font-semibold text-neutral-400 leading-relaxed">
                Book a free session to clear quantitative aptitude questions, resolve profile gap checks, and map target goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="rounded-2xl bg-applePurple hover:bg-appleGlow px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 hover:-translate-y-0.5"
                >
                  Book Free Counseling
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Click the Auri floating robot at the bottom right corner to analyze your resume.');
                  }}
                  className="rounded-2xl border border-black/10 hover:border-applePurple bg-white px-6 py-4 text-xs font-bold uppercase tracking-wider text-appleDark transition duration-300"
                >
                  Analyze Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
