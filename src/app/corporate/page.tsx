import React from 'react';
import CorporateForm from '@/components/corporate-form';
import { Shield, BarChart3, Users, Award, Settings, CheckSquare, Sparkles, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: "Corporate Training & B2B Upskilling Solutions - Aurenza Academy",
  description: "Accelerate your engineering teams. white-labeled live cohorts, custom modular syllabi (AWS, Java Full Stack, Spring Boot, Cyber, AI), automated skills assessments and HR dashboards."
};

export default function CorporateTrainingPage() {
  return (
    <div className="w-full bg-white text-textPrimary overflow-x-hidden font-sans relative">
      
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* ─── HERO SECTION ─── */}
      <section className="py-20 border-b border-borderLight bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Column Description */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Enterprise Talent Solutions
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0C182F] heading leading-tight">
                Upskill & Align Your <span className="text-gradient-purple-pink">Engineering Teams</span>
              </h1>
              
              <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
                Empower your development teams with certification pathways customized to your system architecture requirements. We conduct white-labeled corporate cohorts in Java Microservices, Cloud Computing, Next.js UI Engineering, and Generative AI.
              </p>

              {/* Grid of Key Features */}
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="flex gap-3 items-start p-4 rounded-xl bg-sectionBg border border-borderLight">
                  <Settings className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-textPrimary heading">Customized Syllabus</h4>
                    <p className="text-[11px] text-textSecondary mt-0.5 leading-normal">
                      Align lectures to your internal product tech stack parameters.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-4 rounded-xl bg-sectionBg border border-borderLight">
                  <BarChart3 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-textPrimary heading">HR Reporting Portal</h4>
                    <p className="text-[11px] text-textSecondary mt-0.5 leading-normal">
                      Track developer module progress and quiz logs through a private dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column B2B Capture Form */}
            <div className="lg:col-span-5 bg-sectionBg border border-borderLight p-6 sm:p-8 rounded-[32px] shadow-premium relative">
              <div className="space-y-4 mb-6 text-center lg:text-left">
                <h3 className="text-lg font-extrabold text-textPrimary heading leading-none">Schedule B2B Consultation</h3>
                <p className="text-xs text-textSecondary">Provide your team's specifications and get custom corporate brochures and proposals.</p>
              </div>
              <CorporateForm />
            </div>

          </div>
        </div>
      </section>

      {/* ─── CORPORATE OUTCOMES METRICS ─── */}
      <section className="py-16 bg-sectionBg border-b border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "50+", label: "Enterprise Clients Upskilled", icon: <HeartHandshake className="w-5 h-5 text-primary" /> },
              { value: "10,000+", label: "Developers Certified", icon: <Users className="w-5 h-5 text-secondary" /> },
              { value: "98%", label: "Satisfaction Review Index", icon: <Award className="w-5 h-5 text-primary" /> },
              { value: "40%", label: "Reduction in Skill Gaps", icon: <Shield className="w-5 h-5 text-secondary" /> }
            ].map((metric, idx) => (
              <div key={idx} className="bg-white border border-borderLight p-6 rounded-2xl text-center space-y-2 shadow-soft">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-2">
                  {metric.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-textPrimary heading leading-none">{metric.value}</h3>
                <p className="text-[10px] text-textSecondary uppercase tracking-wider font-bold">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE ENTERPRISE AURENZA ─── */}
      <section className="py-24 bg-white border-b border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Key B2B Capabilities</span>
            <h2 className="text-3xl font-extrabold text-textPrimary heading">
              Enterprise Upskilling <span className="text-gradient-purple-pink">Without Friction</span>
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary">
              We design structured corporate cohorts focusing on modern software design patterns, sandbox labs deployments, and scalable structures.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Sandbox Testing Environments", desc: "Our virtual servers let team members run, deploy, and debug complex containerized applications with full network visibility." },
              { title: "Flexible Cohort Timelines", desc: "Schedule weekend batches or custom weekday evening sessions to align with sprint deliverables and normal working hours." },
              { title: "Verifiable Certifications", desc: "Issue individual credentials containing verifiable cryptographic hashes, allowing HR and clients to inspect skill audits." },
              { title: "HR Analytics Dashboard", desc: "Gain total visibility on active enrollments, course module completion rates, test performance, and individual certifications." },
              { title: "Pre-Training Skill Assessments", desc: "Assess baseline capabilities of developers to exclude redundant beginner modules and focus 100% on advanced stack architecture." },
              { title: "Dedicated Support Engineers", desc: "Get allocated 1-on-1 counselor callbacks and support engineers to guide your developers through complex syllabus homework queries." }
            ].map((feature, idx) => (
              <div key={idx} className="premium-glass-card p-6 space-y-4 hover:-translate-y-1 transition duration-300">
                <div className="w-10 h-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-sm font-extrabold text-textPrimary heading">{feature.title}</h4>
                <p className="text-xs text-textSecondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
