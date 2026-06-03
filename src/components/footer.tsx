"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Linkedin, Youtube, Instagram, Facebook, Twitter, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thank you for subscribing to Aurenza insights!", {
        style: {
          background: '#0E061A',
          color: '#ffffff',
          borderRadius: '16px',
        }
      });
      setEmail('');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hello Aurenza Academy! I would like to enquire about your upcoming live cohorts, placement referrals, and AI Career Counseling packages.");
    window.open(`https://wa.me/917013057827?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#FAFAFC] border-t border-[#ECECF4] pt-20 pb-10 z-10 relative font-sans text-textPrimary">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ─── 5-COLUMN NAVIGATION SITEMAP ─── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 border-b border-[#ECECF4] pb-12">
          
          {/* Column 1 — Company */}
          <div className="space-y-4">
            <span className="font-heading text-[16px] font-semibold text-textPrimary">
              Company
            </span>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">About Us</Link></li>
              <li><Link href="/about#story" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Our Story</Link></li>
              <li><Link href="/login" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Careers</Link></li>
              <li><Link href="/corporate" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Corporate Training</Link></li>
              <li><Link href="/contact" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2 — Courses */}
          <div className="space-y-4">
            <span className="font-heading text-[16px] font-semibold text-textPrimary">
              Courses
            </span>
            <ul className="space-y-3">
              <li><Link href="/courses?category=Cloud" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Cloud Computing</Link></li>
              <li><Link href="/courses?category=DevOps" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">DevOps & CI/CD</Link></li>
              <li><Link href="/courses?category=Cyber" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Cyber Security</Link></li>
              <li><Link href="/courses?category=Data" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Data Science</Link></li>
              <li><Link href="/courses?category=AI" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">AI & Machine Learning</Link></li>
              <li><Link href="/courses?category=Full Stack" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Programming</Link></li>
            </ul>
          </div>

          {/* Column 3 — Certifications */}
          <div className="space-y-4">
            <span className="font-heading text-[16px] font-semibold text-textPrimary">
              Certifications
            </span>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">AWS Solutions</Link></li>
              <li><Link href="/courses" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Microsoft Azure</Link></li>
              <li><Link href="/courses" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Google Cloud</Link></li>
              <li><Link href="/courses" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">PMP Certification</Link></li>
              <li><Link href="/courses" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Scrum Master</Link></li>
              <li><Link href="/courses" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">ITIL Systems</Link></li>
            </ul>
          </div>

          {/* Column 4 — Resources */}
          <div className="space-y-4">
            <span className="font-heading text-[16px] font-semibold text-textPrimary">
              Resources
            </span>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Blogs</Link></li>
              <li><Link href="/#webinars" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Webinars</Link></li>
              <li><Link href="/corporate" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Case Studies</Link></li>
              <li><Link href="/roadmaps" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">Learning Paths</Link></li>
              <li><Link href="/#faqs" className="text-[14px] text-textSecondary hover:text-primary transition font-medium">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 5 — Contact */}
          <div className="space-y-4">
            <span className="font-heading text-[16px] font-semibold text-textPrimary">
              Contact & Support
            </span>
            <ul className="space-y-3 text-[14px] text-textSecondary font-medium">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:aurenzaacademy@gmail.com" className="hover:text-primary transition">aurenzaacademy@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+917013057827" className="hover:text-primary transition">+91 70130 57827</a>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full h-10 px-4 rounded-btn bg-[#25D366]/5 border border-[#25D366]/20 text-[#128C7E] font-bold text-xs inline-flex items-center justify-center gap-2 hover:bg-[#25D366]/10 transition"
                >
                  <MessageSquare className="w-4 h-4 shrink-0 fill-current text-[#128C7E]" />
                  Chat on WhatsApp
                </button>
              </li>
              <li><Link href="/contact" className="hover:text-primary transition block text-xs underline underline-offset-2">Submit Support Inquiry</Link></li>
              <li><Link href="/corporate" className="hover:text-primary transition block text-xs underline underline-offset-2">Business Enquiries</Link></li>
            </ul>
          </div>

        </div>

        {/* ─── NEWSLETTER SUBSCRIPTION SECTION ─── */}
        <div className="bg-white border border-borderLight rounded-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-heading text-lg font-bold text-textPrimary">
              Stay Updated with New Courses & Career Insights
            </h4>
            <p className="text-xs text-textSecondary">
              Receive structural migration guidelines and placement referral rosters weekly.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto max-w-md shrink-0">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your corporate email..."
              className="h-11 px-4 rounded-btn border border-borderLight text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-sectionBg w-full md:w-64"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-btn bg-primary hover:bg-primaryHover text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              Subscribe <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ─── SOCIAL CONNECTIONS & BOTTOM BAR ─── */}
        <div className="pt-8 border-t border-[#ECECF4] flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Social circular icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: <Linkedin className="w-4 h-4" />, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: <Youtube className="w-4 h-4" />, href: 'https://youtube.com', label: 'YouTube' },
              { icon: <Instagram className="w-4 h-4" />, href: 'https://instagram.com', label: 'Instagram' },
              { icon: <Facebook className="w-4 h-4" />, href: 'https://facebook.com', label: 'Facebook' },
              { icon: <Twitter className="w-4 h-4" />, href: 'https://twitter.com', label: 'Twitter' },
            ].map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-borderLight flex items-center justify-center text-textSecondary hover:text-primary hover:border-primary hover:bg-purple-50/10 transition duration-300 shadow-sm"
                aria-label={soc.label}
              >
                {soc.icon}
              </a>
            ))}
          </div>

          {/* Legal Links & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-semibold text-textSecondary">
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition underline decoration-1 underline-offset-2">Privacy Policy</Link>
              <Link href="/login" className="hover:text-primary transition underline decoration-1 underline-offset-2">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-primary transition underline decoration-1 underline-offset-2">Refund Policy</Link>
            </div>
            <div className="text-textSecondary/80 font-normal">
              &copy; 2026 Aurenza Academy. All Rights Reserved.
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
