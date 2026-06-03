"use client";

import React, { useState } from 'react';
import { submitConsultationLead } from '@/lib/actions';
import { CheckCircle2, User, Mail, Phone, GraduationCap } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('General Enquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !course) return;

    setLoading(true);
    const res = await submitConsultationLead({
      name,
      email,
      phone,
      course,
      message: message || "General contact inquiry submitted."
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      alert("Error sending message: " + res.error);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 animate-fade-up">
        <div className="w-14 h-14 rounded-full bg-successGreen/10 border border-successGreen/25 text-successGreen flex items-center justify-center shadow-soft">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-md font-extrabold heading text-textPrimary">Message Dispatched</h4>
        <p className="text-xs text-textSecondary max-w-xs leading-relaxed">
          Thank you for reaching out! Your support ticket has been dispatched. An enrollment consultant will phone you back or reply via email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm font-sans text-textSecondary">
      
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" /> Your Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priyanjali Sen"
          className="glass-input text-xs py-2.5"
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-secondary" /> Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. priya@gmail.com"
            className="glass-input text-xs py-2.5"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="glass-input text-xs py-2.5"
          />
        </div>
      </div>

      {/* Select Course of interest */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-secondary" /> Course of Interest
        </label>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="glass-input text-xs py-2.5 bg-white text-textPrimary"
        >
          <option value="General Enquiry">General Enquiry / Career Guidance</option>
          <option value="Java Full Stack Development">Java Full Stack Development</option>
          <option value="Frontend Development (React & Next.js)">Frontend Development (React & Next.js)</option>
          <option value="AI & Machine Learning Engineering">AI & Machine Learning Engineering</option>
          <option value="PMP Exam Prep">PMP (Project Management Professional)</option>
          <option value="Data Science & Analytics">Data Science & Analytics</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider">
          How can we help you?
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Specify your questions or ask about tuition fees..."
          rows={3}
          className="glass-input text-xs py-2.5 resize-none font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover text-xs font-black text-white hover:shadow-glowPurple transition flex items-center justify-center gap-2"
      >
        {loading ? "Transmitting Query..." : "Send Message Now →"}
      </button>

    </form>
  );
}
