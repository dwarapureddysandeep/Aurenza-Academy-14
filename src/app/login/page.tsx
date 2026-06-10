"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { loginUser } from '@/lib/actions';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/loading-spinner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Capture and display URL redirection errors
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      if (errorParam) {
        toast.error(decodeURIComponent(errorParam), { id: "url-error", duration: 5000 });
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    toast.loading("Authenticating secure session...", { id: "auth" });
    
    const res = await loginUser({ email, password });
    
    setLoading(false);
    if (res.success && res.user) {
      toast.success(`Welcome back, ${res.user.name}!`, { id: "auth" });
      
      const role = res.user.role;
      setTimeout(() => {
        if (role === 'ADMIN') router.push('/admin');
        else if (role === 'TRAINER') router.push('/trainer');
        else router.push('/student');
        router.refresh();
      }, 800);
    } else {
      toast.error(res.error || "Authentication failed.", { id: "auth" });
    }
  };

  // OAuth and OTP triggers removed in offline mode

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 font-sans bg-sectionBg">
      
      {/* Background glowing bubbles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-borderLight bg-white p-6 sm:p-8 text-textPrimary shadow-premium animate-fade-up">
        
        {/* Header Block */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE GATEWAY
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight heading text-textPrimary">
            Admin Portal Login
          </h3>
          <p className="text-xs text-textSecondary">
            Sign in with your verified administrative credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aurenzaacademy@gmail.com"
              className="glass-input text-xs sm:text-sm font-semibold text-textPrimary"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-secondary" /> Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input text-xs sm:text-sm font-semibold text-textPrimary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover hover:shadow-glowPurple transition text-xs sm:text-sm font-black text-white flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" className="brightness-150 text-white" />
                Verifying Session...
              </span>
            ) : "Authorize Admin Session →"}
          </button>

        </form>

        {/* Clean Admin Credentials Display Card */}
        <div className="mt-8 bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-2 text-xs">
          <p className="font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <ShieldCheck className="w-4 h-4" /> ADMIN LOGIN DETAILS
          </p>
          <div className="pt-2 text-xs text-textPrimary border-t border-borderLight/60 mt-2 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-textSecondary font-bold">Email:</span>
              <code className="text-primary font-bold select-all bg-white px-2 py-0.5 rounded border border-borderLight font-mono text-[11px]">aurenzaacademy@gmail.com</code>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-textSecondary font-bold">Password:</span>
              <code className="font-bold select-all bg-white px-2 py-0.5 rounded border border-borderLight font-mono text-[11px]">Aurenza@0210</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
