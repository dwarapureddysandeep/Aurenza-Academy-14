"use client";

import React, { useState } from 'react';
import { submitCorporateLead } from '@/lib/actions';
import { CheckCircle2, Building, Mail, Phone, Users, User } from 'lucide-react';
import LoadingSpinner from './loading-spinner';

export default function CorporateForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [size, setSize] = useState('10-50 employees');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email || !phone || !size) return;

    setLoading(true);
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
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      alert("Error booking enterprise counseling: " + res.error);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 animate-fade-up">
        <div className="w-14 h-14 rounded-full bg-successGreen/10 border border-successGreen/25 text-successGreen flex items-center justify-center shadow-soft">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-md font-extrabold heading text-textPrimary">Proposal Request Received</h4>
        <p className="text-xs text-textSecondary max-w-xs leading-relaxed">
          Thank you! Our Corporate Upskilling Coordinator has received your parameters and will email a customized commercial proposal within 2 working hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm font-sans text-textSecondary">
      
      {/* Contact Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" /> Contact Representative
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

      {/* Corporate Email & Corporate Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-secondary" /> Corporate Name
          </label>
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Microsoft India"
            className="glass-input text-xs py-2.5"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" /> Corporate Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. corporate@company.com"
            className="glass-input text-xs py-2.5"
          />
        </div>
      </div>

      {/* Corporate Phone & Team Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-secondary" /> Contact Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 99888 77766"
            className="glass-input text-xs py-2.5"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" /> Team Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="glass-input text-xs py-2.5 bg-white text-textPrimary"
          >
            <option value="10-50 employees">10-50 employees</option>
            <option value="50-200 employees">50-200 employees</option>
            <option value="200-500 employees">200-500 employees</option>
            <option value="500+ employees">500+ employees</option>
          </select>
        </div>
      </div>

      {/* Upskilling requirements */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider">
          Upskilling target specializations / notes
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. We require intensive training in microservices systems security & cloud AWS Solution designs for 40 of our engineers."
          rows={3}
          className="glass-input text-xs py-2.5 resize-none font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover text-xs font-black text-white hover:shadow-glowPurple transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" className="brightness-150 text-white" />
            Allocating B2B Coordinator...
          </span>
        ) : "Request Upskilling Proposal →"}
      </button>

    </form>
  );
}
