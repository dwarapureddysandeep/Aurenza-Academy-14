"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, HelpCircle, PhoneCall, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Are the courses live or recorded?",
    answer: "Our programs are primarily live instructor-led sessions with interactive learning, interactive Q&A blocks, and hands-on laboratory practice. All sessions are also recorded in 4K resolution and uploaded to your student portal for lifetime asynchronous review."
  },
  {
    question: "Will I receive a certificate after completion?",
    answer: "Yes. Upon completing the course modules and labs, learners receive an official Aurenza Academy Course Completion Certificate. We also provide direct roadmap guidance, vouchers, and mock reviews for relevant international industry certifications (like AWS, PMP, Scrum Alliance, AZ-104)."
  },
  {
    question: "Do you provide certification exam support?",
    answer: "Yes, absolutely. We provide exam preparation quizzes, dumps, structured study materials, mock examinations, and expert mentorship reviews to maximize your certification success rates on your first attempt."
  },
  {
    question: "Are weekend and weekday batches available?",
    answer: "Yes. Flexible batch schedules are configured to suit both working professionals and full-time graduates. We offer intensive weekend cohorts (Saturdays & Sundays) as well as evening weekday sessions."
  },
  {
    question: "Do courses include hands-on projects?",
    answer: "Yes, every program is built around practical application. You will build, debug, and deploy multiple real-world portfolio projects, coding assignments, and case studies hosted on live sandbox environments."
  },
  {
    question: "Do you offer corporate training?",
    answer: "Yes, we partner with enterprises to deliver customized workforce upskilling solutions. We tailor course outlines to your business goals and tech stack, providing HR managers with automated skill assessments and attendance metrics logs."
  },
  {
    question: "Is career support available?",
    answer: "Yes. Selected programs include comprehensive career support: professional resume rebuilding, LinkedIn profile optimization, salary negotiation techniques, mock interview prep, and direct referrals with our 500+ corporate hiring partners."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach out to our corporate advisors via email (info@aurenzaacademy.com), phone/WhatsApp hotline (+91 7013057827), or by submitting the contact forms available on our website."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleBookConsultation = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-lead-modal', { detail: { source: 'FAQ Help Banner' } });
      window.dispatchEvent(event);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  // Filter FAQs based on search input
  const filteredFAQs = FAQS.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compile JSON-LD structured schema for search engines
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="max-w-[900px] w-full mx-auto space-y-8 font-sans">
      
      {/* Dynamic SEO JSON-LD Injected Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* FAQ Search Box */}
      <div className="max-w-md mx-auto w-full">
        <div className="relative rounded-full border border-borderLight bg-white shadow-sm flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-[#7A008C]/10 transition duration-300">
          <Search className="w-4 h-4 text-[#8A8A9A] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your question (e.g. live, projects)..."
            className="bg-transparent border-none text-xs text-textPrimary placeholder-[#8A8A9A] focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-[16px] border border-[#ECECF4] bg-white overflow-hidden transition-all duration-300 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`flex items-center gap-3.5 text-xs sm:text-sm font-semibold leading-snug transition-colors duration-300 ${isOpen ? 'text-[#7A008C] font-extrabold' : 'text-textPrimary font-semibold'}`}>
                    <HelpCircle className={`w-4.5 h-4.5 shrink-0 transition-colors duration-300 ${isOpen ? 'text-[#7A008C]' : 'text-[#8A8A9A]'}`} />
                    {faq.question}
                  </span>
                  
                  {/* Plus/Minus Rotatable Indicator Box */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen ? 'border-[#7A008C] bg-[#7A008C]/5 text-[#7A008C] rotate-180' : 'border-borderLight text-textSecondary'}`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-[#ECECF4]/60 bg-[#FAFAFC]/40 text-xs sm:text-sm text-textSecondary leading-relaxed font-semibold">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-xs font-bold text-textSecondary">No matching questions found in FAQ archives.</p>
          </div>
        )}
      </div>

      {/* Still Need Help CTA Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white border border-[#ECECF4] rounded-[20px] p-6 sm:p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] text-center space-y-5 max-w-2xl mx-auto"
      >
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-extrabold text-textPrimary heading">Still have questions?</h4>
          <p className="text-xs text-textSecondary font-semibold">
            Our technical learning advisors are active to resolve batch pricing details and scheduling options.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto px-5 py-3 rounded-btn border border-borderLight text-textSecondary text-xs font-bold hover:bg-[#FAFAFC] hover:text-textPrimary transition flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-textSecondary" /> Contact Us
          </button>
          
          <button
            onClick={handleBookConsultation}
            className="w-full sm:w-auto px-6 py-3 rounded-btn bg-gradient-purple-pink text-white text-xs font-black tracking-wider uppercase hover:opacity-95 shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <CalendarDays className="w-4 h-4" /> Book Free Consultation
          </button>
        </div>
      </motion.div>

    </div>
  );
}
