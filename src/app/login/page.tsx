"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Mail, Lock, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '@/lib/actions';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    toast.loading("Constructing learner profile...", { id: "auth" });
    
    const res = await registerUser({ name, email, password, phone });
    
    setLoading(false);
    if (res.success && res.user) {
      toast.success("Profile created! Welcome to Aurenza.", { id: "auth" });
      setTimeout(() => {
        router.push('/student');
        router.refresh();
      }, 800);
    } else {
      toast.error(res.error || "Registration failed.", { id: "auth" });
    }
  };

  const triggerGoogleLogin = () => {
    toast.success("Simulating Google OAuth verification flow...", { duration: 3000 });
  };

  const triggerOtpLogin = () => {
    toast.success("Sending One-Time Password (OTP) check...", { duration: 3000 });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 font-sans bg-sectionBg">
      
      {/* Background glowing bubbles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-borderLight bg-white p-6 sm:p-8 text-textPrimary shadow-premium animate-fade-up">
        
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE GATEWAY
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight heading text-textPrimary">
            {activeTab === 'login' ? "Access Your Dashboard" : "Register Learner Profile"}
          </h3>
          <p className="text-xs text-textSecondary">
            {activeTab === 'login' 
              ? "Sign in with your verified student, trainer or admin email."
              : "Acquire lifetime cohorts access and placement statistics."}
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex border-b border-borderLight mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center text-xs font-bold transition ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary hover:text-primary'}`}
          >
            Learner Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center text-xs font-bold transition ${activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary hover:text-primary'}`}
          >
            Create Profile
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@aurenzaacademy.com"
                className="glass-input text-xs sm:text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-secondary" /> Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.success("Mock password recovery trigger dispatched!")}
                  className="text-[9px] font-bold text-textSecondary hover:text-primary transition"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover hover:shadow-glowPurple transition text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? "Verifying Session..." : "Authorize Dashboard Access →"}
            </button>

          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sandeep Kumar"
                className="glass-input text-xs sm:text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-secondary" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sandeep@gmail.com"
                className="glass-input text-xs sm:text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="glass-input text-xs sm:text-sm"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-secondary" /> Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="glass-input text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover hover:shadow-glowPurple transition text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? "Creating Account..." : "Register & Start Learning →"}
            </button>

          </form>
        )}

        {/* Divider */}
        <div className="relative my-6 text-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-borderLight"></span>
          <span className="relative bg-white px-3 text-[10px] font-bold text-textSecondary uppercase tracking-wider">
            OR VERIFY WITH
          </span>
        </div>

        {/* Social Authentication buttons */}
        <div className="grid grid-cols-2 gap-3.5 text-xs text-textPrimary">
          <button
            type="button"
            onClick={triggerGoogleLogin}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sectionBg border border-borderLight hover:bg-white transition font-bold"
          >
            <span className="text-primary font-black">G</span> Google OAuth
          </button>
          <button
            type="button"
            onClick={triggerOtpLogin}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sectionBg border border-borderLight hover:bg-white transition font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" /> Email OTP
          </button>
        </div>

        {/* Diagnostic Credentials Helper block */}
        <div className="mt-8 bg-sectionBg border border-borderLight p-3 rounded-2xl space-y-1.5 text-[10px] text-textSecondary">
          <p className="font-extrabold text-primary uppercase tracking-widest flex items-center gap-1 leading-none">
            <Bot className="w-3.5 h-3.5" /> DIAGNOSTIC DEVELOPER CREDENTIALS
          </p>
          <p className="leading-normal">
            For local offline testing, you can use these default pre-seeded credentials:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[9px] pt-1 text-textPrimary border-t border-borderLight mt-1.5">
            <div>
              <p className="text-textSecondary font-bold">ADMIN EMAIL:</p>
              <code className="text-primary font-extrabold select-all">aurenzaacademy@gmail.com</code>
              <p className="text-textSecondary font-bold mt-1">PASSWORD:</p>
              <code className="select-all">Aurenza@0210</code>
            </div>
            <div>
              <p className="text-textSecondary font-bold">STUDENT EMAIL:</p>
              <code className="text-primary font-extrabold select-all">student@aurenzaacademy.com</code>
              <p className="text-textSecondary font-bold mt-1">PASSWORD:</p>
              <code className="select-all">Student@123</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
