import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy | Aurenza Academy",
  description: "Read Aurenza Academy's privacy policy and learn how we manage and protect user data and dynamic counseling diagnostics.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen py-16 md:py-24 text-textPrimary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primaryHover transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Page Header */}
        <div className="space-y-4 border-b border-borderLight pb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/10">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight heading">
            Privacy <span className="text-gradient-purple-pink">Policy</span>
          </h1>
          <p className="text-xs text-textSecondary font-bold">
            Last Updated: June 13, 2026 &bull; Effective Immediately
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">1. Overview</h2>
            <p>
              Aurenza Academy ("we", "our", "us") is dedicated to protecting your personal information and maintaining the highest standards of data safety. This Privacy Policy details how we collect, store, share, and safeguard your personal details, resume diagnostics information, and inbound counselor requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">2. Information Collection</h2>
            <p>
              We collect information directly provided by you when interacting with our digital interfaces, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>**Counseling Inquiries**: Name, corporate email address, contact phone number, current employment status, and target certification programs submitted through form widgets or scheduling modules.</li>
              <li>**Resume Screening Data**: Raw resume texts, documents (PDF, DOCX, TXT), and skillsets submitted directly to Auri AI Resume Diagnostics.</li>
              <li>**Interactive Chatbot Inputs**: User messages, inquiries, and prompt options selected during chatbot sessions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">3. Information Usage</h2>
            <p>
              Your data is utilized strictly to provide and optimize our educational services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Allocating counseling slots and calling back interested prospects.</li>
              <li>Running semantic keyword mapping to diagnose your skills and gap profiles.</li>
              <li>Answering chatbot queries about certification schedules, placement supports, and hotline details.</li>
              <li>Referral sharing with our 500+ corporate hiring partners (with your explicit authorization during placement programs).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">4. Cookies & Trackers</h2>
            <p>
              We use essential cookies and light local storage mechanisms (such as localStorage) to store basic configuration settings, verify user authentication sessions, and retain wishlists of desired certification programs. You can choose to disable cookies in your browser settings, though certain interface widgets (like comparison sheets) may degrade.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">5. Data Protection</h2>
            <p>
              We enforce premium security practices, including database encryption at rest, secure sockets layer (SSL) communication pipes, and strict internal access controls, to prevent data leaks, unauthorized access, or file alterations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-textPrimary heading">6. Contacts & Inquiries</h2>
            <p>
              For concerns regarding this policy, data deletion requests, or general inquiries, please connect with our compliance officer:
            </p>
            
            <div className="bg-sectionBg border border-borderLight rounded-2xl p-5 space-y-3 max-w-md mt-4 text-xs font-bold text-textPrimary">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Gajuwaka, Vishakapatanam, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@aurenzaacademy.com" className="hover:text-primary transition">info@aurenzaacademy.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+917013057827" className="hover:text-primary transition">+91 70130 57827</a>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
