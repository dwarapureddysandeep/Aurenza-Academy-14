"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Search, HelpCircle, ArrowRight } from 'lucide-react';

export default function VerifySearchPage() {
  const [certId, setCertId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim();
    if (!cleanId) {
      setError("Please specify a valid Certificate ID.");
      return;
    }
    
    // Redirect to the dynamic verification sub-route
    router.push(`/verify/${cleanId}`);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-sectionBg py-16 px-4 font-sans relative">
      {/* Dynamic decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-xl w-full bg-white border border-borderLight rounded-[32px] p-8 sm:p-10 shadow-premium relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-2 shadow-soft">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading tracking-tight">
            Verify Academy Credentials
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary max-w-sm mx-auto leading-relaxed">
            Enter a unique Certificate ID below to validate achievements and verify graduate skill credentials instantly.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              required
              value={certId}
              onChange={(e) => {
                setCertId(e.target.value);
                setError('');
              }}
              placeholder="e.g. AUR-2026-000125"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-sectionBg border border-borderLight text-sm font-semibold text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition shadow-soft"
            />
            <Search className="w-5 h-5 text-textSecondary/50 absolute left-4.5 top-1/2 -translate-y-1/2" />
          </div>
          
          {error && (
            <p className="text-xs text-rose-500 font-semibold px-2 animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-xs uppercase tracking-widest hover:opacity-95 transition shadow-glowPurple flex items-center justify-center gap-2 group"
          >
            Verify Credentials 
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Informative Footer Box */}
        <div className="bg-sectionBg border border-borderLight rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-textSecondary">
          <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="text-textPrimary font-bold block mb-0.5">Where can I find the ID?</strong>
            Certificate IDs are located at the bottom-left corner of all official Aurenza Academy certificates. You can also scan the printed QR code to bypass manual entry.
          </div>
        </div>

      </div>
    </div>
  );
}
