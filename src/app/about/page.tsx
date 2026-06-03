import React from 'react';
import { Target, Users, BookOpen, Laptop, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "About Our Academy - Aurenza Academy",
  description: "Learn more about Aurenza Academy. We are an elite career operating platform led by active technology directors, democratizing high-income engineering roles."
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E2229] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background radial soft blue-grey glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-5xl space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <Users className="w-3.5 h-3.5" /> Democratizing Tech Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C182F] heading">
            Our Mission & <span className="text-primary">Pioneering Vision</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            Aurenza Academy is an elite career-pivoting operating ecosystem designed to bridge the massive gap between academic text theory and modern industry production environments.
          </p>
        </div>

        {/* Vision & Mission Grids */}
        <div className="grid gap-8 sm:grid-cols-2">
          
          <div className="bg-white border border-[#ECECF4] p-6 sm:p-8 space-y-4 rounded-[8px] shadow-soft hover:shadow-premium transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-red-50 text-primary border border-red-100">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#0C182F] heading">Our Global Mission</h3>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              We empower graduates and professionals—regardless of their non-technical backgrounds—to successfully transition into high-income engineering, analytics, and software architecture positions at top product giants.
            </p>
          </div>

          <div className="bg-white border border-[#ECECF4] p-6 sm:p-8 space-y-4 rounded-[8px] shadow-soft hover:shadow-premium transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-[#EBF8F2] text-[#10B981] border border-[#C8E6C9]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#0C182F] heading">Our Corporate Vision</h3>
            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              Our target is to equip 1 Million career aspirants with future-proof engineering and artificial intelligence certifications by 2030, partnering with leading cloud and PM authorities globally.
            </p>
          </div>

        </div>

        {/* 4 Pillars Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">HOW WE SUCCEED</span>
            <h4 className="text-xl font-bold text-[#0C182F] heading">Our Core Training Pillars</h4>
          </div>

          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { title: "Live Cohorts", desc: "Interactive weekend lectures with senior advisors.", icon: <Laptop className="w-4 h-4 text-primary" /> },
              { title: "Production Projects", desc: "Build mock systems, AWS cloud architectures.", icon: <BookOpen className="w-4 h-4 text-[#0C182F]" /> },
              { title: "Verifiable Credentials", desc: "Earn cryptographically secure certificates.", icon: <Award className="w-4 h-4 text-[#10B981]" /> },
              { title: "Hiring Partners Referral", desc: "Resume editing and interview pathways.", icon: <Users className="w-4 h-4 text-[#FFB800]" /> }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-[#F6F8FB] border border-[#ECECF4] p-5 rounded-[8px] space-y-3 text-center hover:shadow-soft transition-all duration-300">
                <div className="p-2.5 w-fit rounded-full bg-white border border-[#ECECF4] mx-auto shadow-sm">{pillar.icon}</div>
                <h5 className="text-xs font-bold text-[#0C182F] heading">{pillar.title}</h5>
                <p className="text-[10px] text-textSecondary leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-[4px] bg-[#0C182F] hover:bg-[#1A2E50] text-xs font-bold text-white shadow-soft transition uppercase tracking-wider"
          >
            Explore Technical Catalog &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
