import React from 'react';
import ContactForm from '@/components/contact-form';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import WhatsAppContactButton from '@/components/whatsapp-contact-button';

export const metadata = {
  title: "Contact Our Advising Office - Aurenza Academy",
  description: "Get in touch with Aurenza Academy. Inquire about weekend cohorts, career pathways, placement assistance referrals, or book 1-on-1 counselor callbacks."
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#05010B] text-neutral-200 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-applePurple/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-applePink uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <ShieldCheck className="w-3.5 h-3.5" /> 24/7 ENROLLMENT HOTLINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white outfit">
            Let's Talk <span className="text-gradient-purple-pink">Career Directions</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Have questions regarding batch timings, corporate White-labeled upskilling rates, or curriculum prerequisites? Connect with our corporate office directly.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start max-w-6xl mx-auto">
          
          {/* Details Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="premium-glass-card p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider outfit border-b border-white/[0.05] pb-2">Academy Advisor Contacts</h4>
              
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-applePink shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Academy HQ Office</h5>
                    <p className="text-xs text-neutral-400 mt-1">Gajuwaka, Vishakapatanam, India</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-applePurple shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Corporate Support Hotline</h5>
                    <Link href="tel:+917013057827" className="text-xs text-neutral-400 hover:text-white transition mt-1 block">+91 7013057827</Link>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Mail className="w-5 h-5 text-applePink shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Official Support Email</h5>
                    <Link href="mailto:aurenzaacademy@gmail.com" className="text-xs text-neutral-400 hover:text-white transition mt-1 block">aurenzaacademy@gmail.com</Link>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <WhatsAppContactButton />
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div className="h-64 rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E061A]">
              <iframe 
                src="https://maps.google.com/maps?q=Gajuwaka,%20Vishakapatanam,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, opacity: 0.7 }} 
                allowFullScreen={false} 
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-6 bg-[#0E061A]/80 border border-white/[0.08] p-6 sm:p-8 rounded-[32px] backdrop-blur-2xl shadow-2xl">
            <div className="space-y-3 mb-6">
              <h4 className="text-md sm:text-lg font-bold text-white outfit leading-none">Drop Us A Message</h4>
              <p className="text-xs text-neutral-400">Specify your career ambitions or questions, and our counseling team will email brochure catalogs.</p>
            </div>
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
