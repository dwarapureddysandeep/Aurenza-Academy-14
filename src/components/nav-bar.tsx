"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Search, BookOpen, Layers, Award, Laptop, Cloud, Shield, Cpu, HelpCircle, Activity } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/actions';

const navLinks = [
  { label: 'Courses', href: '#', hasMega: true },
  { label: 'Certifications', href: '/courses' },
  { label: 'Corporate Training', href: '/corporate' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'About Us', href: '/about' },
];

const megaCategories = [
  { name: 'Cloud Computing', href: '/courses?category=Cloud', icon: <Cloud className="w-4 h-4 text-primary" /> },
  { name: 'DevOps & CI/CD', href: '/courses?category=DevOps', icon: <Activity className="w-4 h-4 text-primary" /> },
  { name: 'Cyber Security', href: '/courses?category=Cyber', icon: <Shield className="w-4 h-4 text-primary" /> },
  { name: 'Data Science', href: '/courses?category=Data', icon: <Layers className="w-4 h-4 text-primary" /> },
  { name: 'AI & Machine Learning', href: '/courses?category=AI', icon: <Cpu className="w-4 h-4 text-primary" /> },
  { name: 'Full Stack Programming', href: '/courses?category=Full Stack', icon: <Laptop className="w-4 h-4 text-primary" /> },
  { name: 'Software Testing', href: '/courses?category=Testing', icon: <HelpCircle className="w-4 h-4 text-primary" /> },
  { name: 'Project Management', href: '/courses?category=Project', icon: <Award className="w-4 h-4 text-primary" /> },
];

const featuredCourses = [
  {
    name: 'AWS Solutions Architect',
    description: 'Design secure, elastic cloud environments on Amazon AWS.',
    href: '/courses/java-full-stack-development', // link to a valid seeded course
    icon: '☁️'
  },
  {
    name: 'Azure Administrator',
    description: 'Govern and scale enterprise compute infrastructure.',
    href: '/courses/frontend-development-react-nextjs',
    icon: '⚙️'
  },
  {
    name: 'DevOps System Engineer',
    description: 'Deploy automated Docker container pipelines.',
    href: '/courses/java-full-stack-development',
    icon: '🚀'
  },
  {
    name: 'Data Science Bootcamp',
    description: 'Analyze enterprise metrics and statistics models.',
    href: '/courses/ai-machine-learning-engineering',
    icon: '📊'
  }
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCourses, setMobileCourses] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Sticky Scroll State
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch session on mount
  useEffect(() => {
    async function loadSession() {
      const activeUser = await getCurrentUser();
      setUser(activeUser);
    }
    loadSession();
  }, []);

  // Listen to window scroll events to trigger sticky header animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProfileDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Helper to open Consultation Dialog modal
  const openConsultationModal = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-lead-modal', { detail: { source: 'Navbar Enroll Action' } });
      window.dispatchEvent(event);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Spacer to prevent page content from clipping behind header */}
      <div className="w-full h-20" />
      
      {/* ─── STICKY HEADER ─── */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-borderLight transition-all duration-300 flex items-center ${
          isScrolled ? 'h-16 shadow-soft' : 'h-20'
        }`}
      >
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 select-none group" aria-label="Aurenza">
            <img
              src="/aurenza-logo.png"
              alt="Aurenza"
              className="h-[32px] sm:h-[36px] w-auto object-contain transition-all duration-300 group-hover:scale-[1.02] group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(122,0,140,0.15)]"
            />
          </Link>

          {/* Center Navigation Links (spacing 24px - 32px) */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              if (link.hasMega) {
                return (
                  <li
                    key={link.label}
                    className="h-full py-4 relative flex items-center"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-bold text-textPrimary hover:text-primary transition-colors duration-200">
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    {/* MEGA MENU DROPDOWN */}
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 -translate-x-[35%] pt-3 cursor-default"
                        >
                          <div className="w-[850px] bg-white rounded-modal shadow-soft border border-borderLight p-6 grid grid-cols-12 gap-8">
                            
                            {/* Left Column: Categories List */}
                            <div className="col-span-5 border-r border-borderLight pr-6 space-y-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#8A8A9A]">
                                Category tracks
                              </span>
                              <div className="grid grid-cols-1 gap-1">
                                {megaCategories.map((cat) => (
                                  <Link
                                    key={cat.name}
                                    href={cat.href}
                                    onClick={() => setMegaOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-textSecondary rounded-btn hover:text-primary hover:bg-primary/5 transition-all duration-200"
                                  >
                                    {cat.icon}
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Right Column: Featured Courses */}
                            <div className="col-span-7 space-y-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#8A8A9A] block">
                                Featured Programs
                              </span>
                              <div className="grid grid-cols-2 gap-4">
                                {featuredCourses.map((course) => (
                                  <Link
                                    key={course.name}
                                    href={course.href}
                                    onClick={() => setMegaOpen(false)}
                                    className="group flex items-start gap-3 p-2.5 rounded-btn hover:bg-purple-50/30 transition-all duration-200"
                                  >
                                    <span className="text-xl shrink-0 mt-0.5">{course.icon}</span>
                                    <div>
                                      <h4 className="text-xs font-bold text-textPrimary group-hover:text-primary transition-colors leading-snug">
                                        {course.name}
                                      </h4>
                                      <p className="text-[10px] text-textSecondary mt-0.5 leading-relaxed font-semibold">
                                        {course.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              <div className="pt-3 border-t border-borderLight flex justify-between items-center text-[10px] font-bold">
                                <Link
                                  href="/courses"
                                  onClick={() => setMegaOpen(false)}
                                  className="text-primary hover:underline"
                                >
                                  Browse all certifications &rarr;
                                </Link>
                                <span className="text-textSecondary uppercase">Weekend Live Batches Available</span>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={link.label} className="relative py-1">
                  <Link
                    href={link.href}
                    className={`text-sm font-bold transition-all duration-200 relative ${
                      isActive ? 'text-primary' : 'text-textPrimary hover:text-primary'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Section */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Compact Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-sectionBg border border-borderLight rounded-badge px-3.5 py-1.5 w-44 xl:w-56 focus-within:ring-2 focus-within:ring-primary/10 transition">
              <Search className="w-3.5 h-3.5 text-[#8A8A9A] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Courses..."
                className="bg-transparent border-none text-xs text-textPrimary placeholder-[#8A8A9A] focus:outline-none w-full font-medium"
              />
            </form>

            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 bg-[#FAFAFC] border border-borderLight rounded-badge px-3.5 py-1.5 hover:bg-purple-50/20 transition"
                >
                  <span className="w-7 h-7 rounded-full bg-primary text-[10px] font-black text-white flex items-center justify-center leading-none">
                    {user.avatar || user.name.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="text-xs font-bold max-w-[80px] truncate text-textPrimary">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
                </button>

                {/* Logged in settings dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-borderLight rounded-card shadow-soft p-1.5 z-50"
                    >
                      <div className="px-3.5 py-2 border-b border-borderLight mb-1">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{user.role}</p>
                        <p className="text-[11px] text-textSecondary truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      {user.role === 'ADMIN' && (
                        <Link 
                          href="/admin"
                          className="flex items-center gap-2 px-3.5 py-2 rounded-btn hover:bg-purple-50/30 text-xs text-textPrimary font-bold transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                          Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 text-left px-3.5 py-2 rounded-btn hover:bg-red-50 text-xs text-red-600 font-bold transition"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2.5">
                {/* Secondary Button: login */}
                <Link
                  href="/login"
                  className="h-10 px-4 rounded-btn border border-primary text-primary hover:bg-purple-50/20 font-bold text-xs inline-flex items-center justify-center transition"
                >
                  Admin Portal
                </Link>

                {/* Primary Gradient Button: Join Immediately */}
                <button
                  type="button"
                  onClick={openConsultationModal}
                  className="h-10 px-5 rounded-btn bg-brand-gradient text-white font-bold text-xs inline-flex items-center justify-center transition hover:opacity-90 hover:shadow-soft"
                >
                  Join Immediately
                </button>
              </div>
            )}

            {/* Mobile Hamburger menu icon */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-btn text-textPrimary hover:bg-neutral-100 transition"
              aria-label="Open menu drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE DRAWER (Hamburger) ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer layout */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[300px] max-w-[85vw] bg-white shadow-soft flex flex-col justify-between border-l border-borderLight"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-borderLight shrink-0">
                <span className="font-heading font-extrabold text-lg text-primary">Aurenza Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 rounded-btn text-textSecondary hover:bg-neutral-100 transition"
                  aria-label="Close menu drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items Body */}
              <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
                
                {/* Compact Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-sectionBg border border-borderLight rounded-input px-3.5 py-2.5">
                  <Search className="w-4 h-4 text-[#8A8A9A] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Courses..."
                    className="bg-transparent border-none text-xs text-textPrimary placeholder-[#8A8A9A] focus:outline-none w-full font-medium"
                  />
                </form>

                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setMobileCourses((v) => !v)}
                      className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-textPrimary rounded-btn hover:text-primary transition"
                    >
                      <span>Courses</span>
                      <ChevronDown className={`w-4 h-4 text-textSecondary transition-transform ${mobileCourses ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {mobileCourses && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 pb-2 space-y-1">
                            {megaCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 py-2 text-xs font-bold text-textSecondary hover:text-primary"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>

                  {navLinks.slice(1).map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 text-sm font-bold text-textPrimary hover:text-primary transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons footer */}
              <div className="shrink-0 px-5 pb-8 pt-4 border-t border-borderLight space-y-3">
                {user ? (
                  <>
                    <div className="px-1 py-1 mb-2">
                      <p className="text-[9px] text-primary font-black uppercase tracking-wider">{user.role}</p>
                      <p className="text-sm font-extrabold text-textPrimary truncate">{user.name}</p>
                    </div>
                    <Link
                      href={
                        user.role === 'ADMIN' ? '/admin' : 
                        user.role === 'TRAINER' ? '/trainer' : 
                        '/student'
                      }
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full text-center py-3 text-xs font-black text-textPrimary bg-sectionBg border border-borderLight rounded-btn hover:bg-neutral-100 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full text-center py-3 text-xs font-black text-red-600 bg-red-50 rounded-btn hover:bg-red-100 transition"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full py-3 border border-primary text-primary rounded-btn font-bold text-xs transition text-center hover:bg-purple-50/10"
                    >
                      Admin Portal
                    </Link>
                    <button
                      onClick={openConsultationModal}
                      className="w-full py-3 bg-brand-gradient text-white rounded-btn font-bold text-xs hover:opacity-90 transition text-center shadow-sm"
                    >
                      Join Immediately
                    </button>
                  </>
                )}
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
