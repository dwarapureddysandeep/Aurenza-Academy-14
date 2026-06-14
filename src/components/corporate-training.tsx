"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitCorporateLead } from '@/lib/actions';
import { 
  Compass, Users, Calendar, LineChart, Award, BarChart3, 
  Check, CheckCircle2, User, Building, Mail, Phone, CalendarDays,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from './loading-spinner';

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function CorporateTraining() {
  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [size, setSize] = useState('10-50 employees');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const benefits: BenefitCard[] = [
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Customized Learning Paths",
      description: "Training programs tailored precisely to your team's specific business goals and technology stack."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Trainers",
      description: "Learn from certified subject matter experts with extensive, active production experience."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Delivery Models",
      description: "Convenient online live sessions, hybrid structures, onsite workshops, or weekend batches."
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Skill Assessments",
      description: "Measure your engineering team's current skill levels with structured entry/exit assessments."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certification Support",
      description: "Equip your workforce with verified preparation tracks to maximize certification success rates."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Post-Training Analytics",
      description: "Receive detailed performance logs, attendance reports, and practical project progress dashboards."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email || !phone || !size) {
      toast.error('Please populate all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitCorporateLead({
        name,
        company,
        email,
        phone,
        size,
        message
      });

      setLoading(false);
      if (res.success) {
        setSuccess(true);
        toast.success('B2B Counseling request submitted successfully!', { icon: '🏢' });
        setName('');
        setCompany('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        toast.error(`Submission error: ${res.error}`);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(`Request failed: ${err.message}`);
    }
  };

  const handleBookMeeting = () => {
    toast.success('Opening corporate scheduling calendar...', { icon: '📅' });
    if (typeof window !== 'undefined') {
      // Mock redirect to calendar scheduling
      setTimeout(() => {
        window.open('https://calendly.com', '_blank');
      }, 800);
    }
  };

  return (
    <section className="py-24 bg-[#FAFAFC] border-t border-borderLight relative overflow-hidden">
      
      {/* Mesh decorative colored circles */}
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-primary/3 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-[#E85AD9]/3 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold text-[#7A008C] uppercase tracking-widest leading-none bg-[#7A008C]/5 px-3 py-1 rounded-full">
            Enterprise Talent Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary leading-none heading tracking-tight">
            Corporate Training Solutions <span className="text-gradient-purple-pink">for Modern Teams</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary max-w-xl mx-auto">
            Upskill your workforce with customized training programs delivered by active industry specialists to achieve tangible business outcomes.
          </p>
        </div>

        {/* 2-Column Corporate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ════════════════════ LEFT COLUMN (Benefits Cards) ════════════════════ */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-textPrimary heading">
                Upskill, Retain, and Build Future-Ready Engineering Units
              </h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
                Aurenza Academy's white-labeled B2B programs are customized to match your enterprise tech stack. We deliver onsite or remote instructor-led live training complete with automated dashboards to monitor employee progression.
              </p>
            </div>

            {/* Benefits Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  className="group bg-white border border-[#ECECF4] rounded-[16px] p-6 space-y-4 hover:-translate-y-1 hover:shadow-soft transition-all duration-300 ease-in-out"
                >
                  {/* Icon Box */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7A008C] to-[#E85AD9] flex items-center justify-center text-white shadow-sm shrink-0 transform group-hover:scale-105 transition duration-300">
                    {benefit.icon}
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-textPrimary heading">
                      {benefit.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-textSecondary font-semibold leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════ RIGHT COLUMN (Form Card) ════════════════════ */}
          <div className="lg:col-span-5 bg-white border border-[#ECECF4] p-8 rounded-[24px] shadow-soft relative flex flex-col justify-center">
            
            {success ? (
              <div className="text-center py-10 space-y-5 animate-fade-up">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold heading text-textPrimary">B2B Consultation Request Received</h4>
                  <p className="text-xs text-textSecondary leading-relaxed max-w-xs mx-auto font-semibold">
                    Thank you! Our Corporate Program Director has received your upskilling objectives and will reach out with a custom draft blueprint within 2 business hours.
                  </p>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs text-[#7A008C] hover:underline font-bold"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Form Header */}
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black text-textPrimary leading-none heading">
                    Talk to Our B2B Advisor
                  </h3>
                  <p className="text-xs text-textSecondary font-semibold">
                    Input your team's details to request customized curriculum proposal sheets.
                  </p>
                </div>

                {/* Consultation Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#7A008C]" /> Contact Representative *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elvyn Kumar"
                      className="w-full px-4.5 py-3 text-xs bg-[#FAFAFC] border border-[#ECECF4] focus:border-[#7A008C]/50 rounded-[12px] placeholder-[#8A8A9A] focus:outline-none focus:ring-1 focus:ring-[#7A008C]/15 transition font-semibold"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#7A008C]" /> Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Wipro Technologies"
                      className="w-full px-4.5 py-3 text-xs bg-[#FAFAFC] border border-[#ECECF4] focus:border-[#7A008C]/50 rounded-[12px] placeholder-[#8A8A9A] focus:outline-none focus:ring-1 focus:ring-[#7A008C]/15 transition font-semibold"
                    />
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#7A008C]" /> Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="corporate@company.com"
                        className="w-full px-4.5 py-3 text-xs bg-[#FAFAFC] border border-[#ECECF4] focus:border-[#7A008C]/50 rounded-[12px] placeholder-[#8A8A9A] focus:outline-none focus:ring-1 focus:ring-[#7A008C]/15 transition font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#7A008C]" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXX XXX XXXX"
                        className="w-full px-4.5 py-3 text-xs bg-[#FAFAFC] border border-[#ECECF4] focus:border-[#7A008C]/50 rounded-[12px] placeholder-[#8A8A9A] focus:outline-none focus:ring-1 focus:ring-[#7A008C]/15 transition font-semibold"
                      />
                    </div>
                  </div>

                  {/* Team Size select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#7A008C]" /> Team Size to Upskill *
                    </label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4.5 py-3 text-xs bg-[#FAFAFC] border border-[#ECECF4] focus:border-[#7A008C]/50 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#7A008C]/15 transition font-bold text-textPrimary"
                    >
                      <option value="5-20 employees">5-20 employees</option>
                      <option value="20-50 employees">20-50 employees</option>
                      <option value="50-200 employees">50-200 employees</option>
                      <option value="200+ employees">200+ employees</option>
                    </select>
                  </div>

                  {/* Training requirement */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider">
                      Specify Training Requirements / Objectives
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. We require AWS and Kubernetes training for 25 backend engineers."
                      rows={3}
                      className="w-full px-4.5 py-3 text-xs bg-[#FAFAFC] border border-[#ECECF4] focus:border-[#7A008C]/50 rounded-[12px] placeholder-[#8A8A9A] focus:outline-none focus:ring-1 focus:ring-[#7A008C]/15 transition resize-none font-sans font-semibold"
                    />
                  </div>

                  {/* Main Gradient Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-[12px] bg-gradient-purple-pink text-white text-xs font-black tracking-wider uppercase hover:opacity-95 active:scale-[0.98] transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" className="brightness-150 text-white" />
                        Allocating Account Executive...
                      </span>
                    ) : "Request Upskilling Proposal"}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-borderLight"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-textSecondary font-black uppercase">Or</span>
                  <div className="flex-grow border-t border-borderLight"></div>
                </div>

                {/* Secondary CTA scheduling */}
                <button
                  type="button"
                  onClick={handleBookMeeting}
                  className="w-full py-3.5 rounded-[12px] border border-[#7A008C] text-[#7A008C] hover:bg-[#7A008C]/5 text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <CalendarDays className="w-4 h-4 text-[#7A008C]" /> Book A Meeting Now
                </button>

                {/* Trust Indicators checkmarks */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-textSecondary font-semibold border-t border-borderLight pt-4">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Customized Programs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Certified Trainers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Flexible Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Dedicated Support</span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Enterprise Trusted Logos Band */}
        <div className="text-center space-y-4 pt-4 border-t border-borderLight">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-[#8A8A9A]">
            Trusted by Growing Teams & Enterprises Worldwide
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {[
              "Tech Mahindra", "Cognizant", "Accenture", "Wipro", "Infosys", "TCS", "HCL"
            ].map((company, idx) => (
              <div 
                key={idx}
                className="text-[#8A8A9A] hover:text-[#7A008C] transition duration-300 font-black tracking-widest text-xs select-none border border-[#ECECF4] px-4 py-2.5 rounded-xl bg-white cursor-default"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
