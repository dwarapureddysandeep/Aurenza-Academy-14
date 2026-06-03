"use client";

import React, { useState } from 'react';
import { Sparkles, Clock, Users, Star, ArrowDown, Search, HelpCircle, Layers, ChevronDown, Check, Info } from 'lucide-react';

export default function DesignSystemPage() {
  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState(true);

  // Tabs state
  const [activeTab, setActiveTab] = useState('curriculum');

  // Modal simulation state
  const [modalOpen, setModalOpen] = useState(false);

  // Form input demo
  const [inputVal, setInputVal] = useState('');

  // Dropdown filter demo
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-sectionBg text-textPrimary py-16 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* Background glow meshes */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto space-y-16 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-borderLight pb-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-primary/5 border border-primary/10 text-xs font-bold text-primary uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-primary" /> Step 1: UI Foundation
          </span>
          <h1 className="text-h2 sm:text-h1 text-[#0C182F] heading tracking-tight">
            Aurenza Academy <span className="text-gradient-purple-pink">Design System</span>
          </h1>
          <p className="text-body-lg text-textSecondary max-w-2xl">
            A standardized, premium living style guide representing the visual language and modular components of Aurenza Academy, built to duplicate the elite experience of top-tier professional training sites.
          </p>
        </div>

        {/* ─── 1. BRAND COLORS ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            1. Brand Color Palette
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Color 1 */}
            <div className="bg-white border border-borderLight p-4 rounded-card shadow-soft space-y-4">
              <div className="h-24 rounded-input bg-primary w-full shadow-sm"></div>
              <div>
                <h4 className="text-sm font-bold text-textPrimary heading">Aurenza Purple</h4>
                <code className="text-[11px] text-primary font-black mt-1 block">#7A008C</code>
                <p className="text-[10px] text-textSecondary mt-1">Used for primary actions, active states, and highlights.</p>
              </div>
            </div>

            {/* Color 2 */}
            <div className="bg-white border border-borderLight p-4 rounded-card shadow-soft space-y-4">
              <div className="h-24 rounded-input bg-accent w-full shadow-sm"></div>
              <div>
                <h4 className="text-sm font-bold text-textPrimary heading">Aurenza Pink</h4>
                <code className="text-[11px] text-accent font-black mt-1 block">#E85AD9</code>
                <p className="text-[10px] text-textSecondary mt-1">Used for hovers, badges, alerts, and gradients.</p>
              </div>
            </div>

            {/* Color 3 */}
            <div className="bg-white border border-borderLight p-4 rounded-card shadow-soft space-y-4">
              <div className="h-24 rounded-input bg-gradient-to-r from-primary to-accent w-full shadow-sm"></div>
              <div>
                <h4 className="text-sm font-bold text-textPrimary heading">Brand Gradient</h4>
                <code className="text-[11px] text-[#7A008C] font-black mt-1 block">linear-gradient(90deg, #7A008C, #E85AD9)</code>
                <p className="text-[10px] text-textSecondary mt-1">Used for hero headers, banners, and premium badges.</p>
              </div>
            </div>

            {/* Color 4 */}
            <div className="bg-white border border-borderLight p-4 rounded-card shadow-soft space-y-4">
              <div className="h-24 rounded-input bg-sectionBg border border-borderLight w-full"></div>
              <div>
                <h4 className="text-sm font-bold text-textPrimary heading">Section Background</h4>
                <code className="text-[11px] text-textSecondary font-black mt-1 block">#FAFAFC</code>
                <p className="text-[10px] text-textSecondary mt-1">Soft background color to divide structural grid sections.</p>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 2. TYPOGRAPHY SCALE ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            2. Typography Scale
          </h2>
          <div className="bg-white border border-borderLight p-6 sm:p-8 rounded-card shadow-soft space-y-8">
            
            {/* Heading Font */}
            <div className="space-y-4 border-b border-borderLight pb-6">
              <span className="text-[10px] text-primary uppercase tracking-widest font-extrabold">Heading Font: Plus Jakarta Sans</span>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">H1 (Hero Titles - 56px)</span>
                  <h1 className="text-h1 text-[#0C182F] tracking-tight">The Next.js Generation</h1>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">H2 (Section Headings - 42px)</span>
                  <h2 className="text-h2 text-[#0C182F]">Upskill Corporate Teams</h2>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">H3 (Subsection Headings - 32px)</span>
                  <h3 className="text-h3 text-[#0C182F]">Interactive Roadmaps</h3>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">H4 (Cards & Form Titles - 24px)</span>
                  <h4 className="text-h4 text-[#0C182F]">Frontend Architecture</h4>
                </div>
              </div>
            </div>

            {/* Body Font */}
            <div className="space-y-4">
              <span className="text-[10px] text-primary uppercase tracking-widest font-extrabold">Body Font: Inter</span>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">Body Large (18px)</span>
                  <p className="text-body-lg text-textSecondary">
                    Transform your professional path with verified, industry-recognized certificates.
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">Body Regular (16px)</span>
                  <p className="text-body text-textSecondary">
                    Aurenza Academy conducts high-fidelity live classroom lectures on weekends with 1-on-1 counselor reviews.
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-textSecondary uppercase block">Small (Descriptions & Labels - 14px)</span>
                  <p className="text-small text-textSecondary">
                    Includes verified credentials secure blocks and dynamic payment registers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 3. BUTTON SYSTEM ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            3. Button Library
          </h2>
          <div className="bg-white border border-borderLight p-6 sm:p-8 rounded-card shadow-soft space-y-6">
            <p className="text-xs text-textSecondary">
              Buttons feature rounded 12px edges, height 48px, bold typography, and micro-elevation hover translations with transition animations.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <span className="text-[9px] text-textSecondary block uppercase mb-1">Primary Button</span>
                <button type="button" className="btn-primary">
                  Explore Courses
                </button>
              </div>

              <div>
                <span className="text-[9px] text-textSecondary block uppercase mb-1">Secondary Button</span>
                <button type="button" className="btn-secondary">
                  Download Brochure
                </button>
              </div>

              <div>
                <span className="text-[9px] text-textSecondary block uppercase mb-1">CTA with icon</span>
                <button type="button" className="btn-primary gap-2">
                  Enroll Now <Sparkles className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. FORM INPUTS & DROPDOWNS ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            4. Inputs & Selection Controls
          </h2>
          <div className="bg-white border border-borderLight p-6 sm:p-8 rounded-card shadow-soft">
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
              
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">
                  Interactive Input Box (Height 52px, Radius 12px)
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Enter your name..."
                  className="input-field"
                />
                <span className="text-[10px] text-textSecondary block">Focus transitions to Purple Border with a soft ring glow.</span>
              </div>

              {/* Custom Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">
                  Category Dropdown Filter
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="dropdown-field"
                  >
                    <option value="All">All Course Categories</option>
                    <option value="Agile">Agile Management</option>
                    <option value="Project">Project Management</option>
                    <option value="Full">Full Stack Development</option>
                  </select>
                </div>
                <span className="text-[10px] text-textSecondary block">Custom SVG indicator aligned to Aurenza brand styling.</span>
              </div>

            </div>
          </div>
        </section>

        {/* ─── 5. COURSE CARD DESIGN ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            5. Enterprise Course Card
          </h2>
          
          <div className="max-w-md">
            
            {/* Card Markup */}
            <article className="course-card">
              
              {/* Banner Area */}
              <div className="relative h-48 w-full bg-neutral-100 border-b border-borderLight">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
                  alt="Frontend development catalog cover"
                  className="w-full h-full object-cover"
                />
                
                {/* Brand Badge */}
                <span className="absolute right-3 top-3 bg-gradient-to-r from-primary to-accent badge-pill">
                  Best Seller
                </span>
              </div>

              {/* Course Detail Block */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest block">
                    Live Cohort / Self Paced
                  </span>
                  <h3 className="text-h4 text-[#0C182F] heading line-clamp-2 leading-tight">
                    Frontend Engineering (React & Next.js)
                  </h3>
                  
                  {/* Rating block */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-textPrimary">4.9</span>
                    <span className="text-xs text-textSecondary">(320 Reviews)</span>
                  </div>

                  {/* Param grid */}
                  <div className="flex items-center gap-4 pt-2 text-xs text-textSecondary font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      4 months
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-secondary" />
                      14,290 enrolled
                    </span>
                  </div>
                </div>

                {/* Pricing & Checkout link */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">Tuition Fees</span>
                  <div className="text-right">
                    <span className="text-xs text-textSecondary line-through font-bold block">₹34,999</span>
                    <span className="text-lg font-black text-successGreen block">₹24,999</span>
                  </div>
                </div>

                {/* Footer Buttons inside card */}
                <div className="flex gap-2 pt-2">
                  <button type="button" className="btn-secondary flex-1 h-10 text-xs px-4">
                    View Details
                  </button>
                  <button type="button" className="btn-primary flex-1 h-10 text-xs px-4">
                    Enroll Now
                  </button>
                </div>

              </div>

            </article>

          </div>
        </section>

        {/* ─── 6. BADGES ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            6. Status Pill Badges
          </h2>
          <div className="bg-white border border-borderLight p-6 sm:p-8 rounded-card shadow-soft flex flex-wrap gap-4 items-center">
            
            <div>
              <span className="text-[9px] text-textSecondary block uppercase mb-1">Bestseller Pill</span>
              <span className="bg-gradient-to-r from-primary to-accent badge-pill">
                Best Seller
              </span>
            </div>

            <div>
              <span className="text-[9px] text-textSecondary block uppercase mb-1">Trending Pill</span>
              <span className="bg-[#EF4444] badge-pill">
                Trending
              </span>
            </div>

            <div>
              <span className="text-[9px] text-textSecondary block uppercase mb-1">New Launch Pill</span>
              <span className="bg-[#3B82F6] badge-pill">
                New Launch
              </span>
            </div>

            <div>
              <span className="text-[9px] text-textSecondary block uppercase mb-1">Custom Category tag</span>
              <span className="bg-primary/5 border border-primary/10 text-primary px-3 py-1 rounded-badge text-[10px] font-bold uppercase tracking-wider">
                Full Stack
              </span>
            </div>

          </div>
        </section>

        {/* ─── 7. ACCORDIONS & FAQS ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            7. Accordion (Syllabus & FAQs)
          </h2>
          <div className="max-w-2xl bg-white border border-borderLight rounded-card shadow-soft p-5 space-y-4">
            
            <div className="border border-borderLight rounded-input overflow-hidden">
              <button
                type="button"
                onClick={() => setAccordionOpen(!accordionOpen)}
                className="w-full p-4 text-left font-bold text-sm text-[#0C182F] flex justify-between items-center transition bg-white hover:bg-neutral-50"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-primary shrink-0" />
                  Are lectures live or recorded?
                </span>
                <ChevronDown className={`w-4 h-4 text-textSecondary transition-transform ${accordionOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>
              
              {accordionOpen && (
                <div className="p-4 text-xs text-textSecondary leading-relaxed border-t border-borderLight bg-[#FAFAFC] animate-fade-up">
                  All weekly cohort classes are streamed live on weekend mornings/evenings. They are recorded in high resolution, and users receive lifetime access to the video vault.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ─── 8. TABS ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            8. Content Tabs
          </h2>
          
          <div className="max-w-2xl bg-white border border-borderLight rounded-card shadow-soft p-4">
            
            {/* Tabs List */}
            <div className="flex border-b border-borderLight text-xs font-bold text-textSecondary">
              {[
                { id: 'overview', label: 'Program Overview' },
                { id: 'curriculum', label: 'Curriculum Syllabus' },
                { id: 'reviews', label: 'Learner Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 font-bold transition-all ${activeTab === tab.id ? 'border-primary text-primary text-sm' : 'border-transparent hover:text-primary'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="py-4 px-2 text-xs text-textSecondary leading-relaxed animate-fade-up">
              {activeTab === 'overview' && "Comprehensive curriculum designed in tandem with corporate hiring criteria."}
              {activeTab === 'curriculum' && "5 primary syllabus modules covering sandbox setups, tests architectures, and REST endpoints deployments."}
              {activeTab === 'reviews' && "Alumni reports outline salary pivot benchmarks reaching averages of 12-18 LPA."}
            </div>

          </div>
        </section>

        {/* ─── 9. SEARCH BAR & MODAL SIMULATIONS ─── */}
        <section className="space-y-6">
          <h2 className="text-h3 text-[#0C182F] heading flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-badge bg-primary"></span>
            9. Search Bar & Consultation Modals
          </h2>
          
          <div className="bg-white border border-borderLight p-6 sm:p-8 rounded-card shadow-soft space-y-6">
            
            {/* Search Bar */}
            <div className="space-y-2">
              <label className="text-[10px] text-textSecondary font-bold block uppercase tracking-wider px-1">Large Search Input</label>
              <div className="relative max-w-xl">
                <input
                  type="text"
                  placeholder="Search Courses, Certifications..."
                  className="w-full h-12 pl-12 pr-4 rounded-input border border-borderLight text-sm placeholder-[#8A8A9A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <Search className="w-4.5 h-4.5 text-[#8A8A9A] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Modal button */}
            <div className="pt-4 border-t border-borderLight">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-primary"
              >
                Launch Mock Counseling Modal
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* ─── 10. MODAL PREVIEW OVERLAY ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-modal p-8 shadow-soft border border-borderLight text-textPrimary space-y-6 animate-fade-up">
            
            <div className="space-y-1.5">
              <h3 className="text-h4 text-[#0C182F] heading flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-primary" /> Book Consultation
              </h3>
              <p className="text-xs text-textSecondary">
                Enter your details to secure a 15-minute mock profile review with career counselors.
              </p>
            </div>

            <div className="space-y-3">
              <input type="text" placeholder="Your certified name" className="input-field" />
              <input type="email" placeholder="Corporate email address" className="input-field" />
            </div>

            <div className="flex gap-3 justify-end pt-2 text-xs">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-10 px-4 rounded-btn border border-borderLight hover:bg-neutral-50 font-bold transition text-textSecondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => { setModalOpen(false); alert('Mock consultation booked!'); }}
                className="h-10 px-4 rounded-btn bg-primary hover:bg-primaryHover font-bold text-white transition shadow-sm"
              >
                Submit Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
