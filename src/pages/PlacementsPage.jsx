import { useLeadModal } from '../context/ModalContext';
import { Briefcase, Trophy, Award, Star, ShieldCheck, Heart } from 'lucide-react';

export default function PlacementsPage() {
  const { openModal } = useLeadModal();

  const successCards = [
    { name: 'Kunal Sen', company: 'Oracle', package: '14 LPA', quote: 'Aurenzas deep coding sessions and mock interviews with senior developers completely changed my career confidence.' },
    { name: 'Rohan Joshi', company: 'Amazon', package: '21 LPA', quote: 'The DSA questions asked in interview rounds matched our course syllabus patterns exactly. Best transition choice!' },
    { name: 'Esha Gupta', company: 'Adobe', package: '18 LPA', quote: 'Dr. Rameshs Spring Boot microservices lectures prepared me to answer complex architecture system design queries.' }
  ];
  return (
    <div className="bg-white bg-soft-radial font-sans text-appleDark min-h-screen pt-24 pb-28 relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -left-30 w-[380px] h-[380px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />

      {/* 1. HEADER HERO */}
      <section className="py-20 relative z-10 border-b border-black/[0.03]">
        <div className="mx-auto max-w-[1200px] px-6 text-center space-y-5 animate-fade-up">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-applePurple bg-applePurple/5 px-3.5 py-1.5 rounded-full border border-applePurple/10">Placement Hub</span>
          <h1 className="text-[clamp(2.4rem,4.5vw,4.5rem)] font-black leading-[1.08] text-appleDark tracking-tight">
            Bridging talent with <span className="bg-apple-gradient bg-clip-text text-transparent">global product companies</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-base font-semibold leading-relaxed text-neutral-400">
            Our graduates excel at corporate assessments. We prepare you to pass strict technical review parameters.
          </p>
        </div>
      </section>

      {/* 2. PLACEMENT METRICS CARD */}
      <section className="py-20 relative z-10">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-8 md:grid-cols-3 animate-fade-up">
            {[
              { value: '95%', label: 'Audited Placement Rate', desc: 'Active student job acquisitions', icon: Briefcase },
              { value: '8.4 LPA', label: 'Average Graduate Package', desc: 'Starting salary statistics', icon: Trophy },
              { value: '42 LPA', label: 'Highest Salary Package', desc: 'Secured at international tech firm', icon: Award }
            ].map((metric, idx) => (
              <div key={idx} className="premium-card rounded-3xl p-8 shadow-soft text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10">
                  <metric.icon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-applePurple tracking-tight">{metric.value}</p>
                  <h3 className="text-[15px] font-black text-appleDark tracking-tight">{metric.label}</h3>
                  <p className="text-xs font-semibold text-neutral-400">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PLACEMENT SUCCESS STORY */}
      <section className="py-20 bg-appleGray/45 border-y border-black/[0.03] relative z-10">
        <div className="mx-auto max-w-[1200px] px-6 space-y-16">
          <div className="text-center space-y-3 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-black text-appleDark tracking-tight">Success Stories</h2>
            <p className="text-sm font-semibold text-neutral-400">Aurenza graduates sharing their technical transition journeys.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 animate-fade-up">
            {successCards.map((success, idx) => (
              <div key={idx} className="premium-card rounded-3xl p-8 bg-white/70 backdrop-blur-md shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="border-transparent" />
                      ))}
                    </div>
                    <span className="rounded-full bg-applePurple/5 border border-applePurple/10 px-3 py-1 text-[10px] font-bold text-applePurple uppercase tracking-wider">
                      Hired at {success.company}
                    </span>
                  </div>
                  
                  <p className="mt-6 text-[14.5px] font-semibold leading-relaxed text-neutral-500">
                    “{success.quote}”
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-black/[0.03] pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-apple-gradient text-white text-sm font-black shadow-soft">
                      {success.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-appleDark tracking-tight">{success.name}</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Software Engineer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">CTC Secured</p>
                    <p className="text-base font-black text-applePurple">{success.package}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA counseling */}
          <div className="text-center animate-fade-up pt-4">
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-applePurple hover:bg-appleGlow px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 hover:-translate-y-0.5"
            >
              Get Placement Preparation Advice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
