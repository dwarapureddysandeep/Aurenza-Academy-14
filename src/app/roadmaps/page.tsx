"use client";

import React from 'react';
import RoadmapExplorer from '@/components/roadmap-explorer';
import { Compass, Star } from 'lucide-react';

export default function RoadmapsPage() {
  return (
    <div className="min-h-screen bg-[#05010B] text-neutral-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background glowing bubbles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-applePurple/10 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-applePink uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <Compass className="w-3.5 h-3.5" /> Career Operating System
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white outfit">
            Interactive <span className="text-gradient-purple-pink">Career Timelines</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Constructed by corporate recruitment managers. Navigate through milestones, check aggregate starting salaries, audit priority skill gaps, and explore Aurenza specializations designed to secure direct referrals.
          </p>
        </div>

        {/* Interactive Explorer Grid */}
        <div className="bg-[#0E061A]/40 border border-white/[0.06] rounded-[32px] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <RoadmapExplorer />
        </div>

        {/* Floating Callout */}
        <div className="max-w-4xl mx-auto premium-glass-card p-6.5 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 map-grid opacity-[0.25] pointer-events-none"></div>
          <div className="space-y-1.5 relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-applePink/10 px-2.5 py-0.5 text-[9px] font-bold text-applePink uppercase">
              <Star className="w-3.5 h-3.5 fill-current" /> Instant Diagnostics
            </span>
            <h4 className="text-sm font-bold text-white outfit">Struggling with a generic resume?</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Launch our **Auri AI Assistant** at the bottom-right corner of the screen, paste your raw experience details, and let Auri parse your skill gaps instantly!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auri-open-resume'));
              }
            }}
            className="px-6 py-3 rounded-full bg-applePurple hover:bg-appleGlow font-black text-xs text-white transition shrink-0 relative z-10 shadow-neonPurple"
          >
            Launch Resume Analyzer &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
