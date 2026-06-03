"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Zap, LineChart, BarChart3, Cpu, Cloud, Shield, 
  Activity, Code, Terminal, CheckSquare, Award, Folder, 
  Database, Globe, Sparkles, ArrowRight, Search, ChevronDown, ChevronUp 
} from 'lucide-react';

interface CategoryData {
  name: string;
  coursesCount: string;
  slug: string;
  icon: React.ReactNode;
  description: string;
}

export default function PopularCategories() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const categories: CategoryData[] = [
    { name: 'Project Management', coursesCount: '15+ Courses', slug: 'Project', icon: <Briefcase className="w-5 h-5" />, description: 'PMP, CAPM, PgMP, PMI-ACP, PMO' },
    { name: 'Agile & Scrum', coursesCount: '20+ Courses', slug: 'Agile', icon: <Zap className="w-5 h-5" />, description: 'CSM, CSPO, A-CSM, SAFe Agilist' },
    { name: 'Business Analysis', coursesCount: '12+ Courses', slug: 'Business', icon: <LineChart className="w-5 h-5" />, description: 'CBAP, CCBA, ECBA, Agile Analysis' },
    { name: 'Data Science & Analytics', coursesCount: '25+ Courses', slug: 'Data', icon: <BarChart3 className="w-5 h-5" />, description: 'Data Science, Analytics, Power BI, SQL' },
    { name: 'AI & Machine Learning', coursesCount: '18+ Courses', slug: 'AI', icon: <Cpu className="w-5 h-5" />, description: 'Generative AI, Prompting, ML, Deep Learning' },
    { name: 'Cloud Computing', coursesCount: '30+ Courses', slug: 'Cloud', icon: <Cloud className="w-5 h-5" />, description: 'AWS, Microsoft Azure, Google Cloud' },
    { name: 'Cyber Security', coursesCount: '15+ Courses', slug: 'Cyber', icon: <Shield className="w-5 h-5" />, description: 'Ethical Hacking, Security+, CISSP, CEH' },
    { name: 'DevOps & Systems', coursesCount: '18+ Courses', slug: 'DevOps', icon: <Activity className="w-5 h-5" />, description: 'Docker, Kubernetes, Jenkins, Terraform' },
    { name: 'Software Development', coursesCount: '22+ Courses', slug: 'Full Stack', icon: <Code className="w-5 h-5" />, description: 'Java Full Stack, Python, Spring Boot, MERN' },
    { name: 'Programming Languages', coursesCount: '15+ Courses', slug: 'Full Stack', icon: <Terminal className="w-5 h-5" />, description: 'Java, Python, JavaScript, C#, Go' },
    { name: 'Testing & QA', coursesCount: '10+ Courses', slug: 'Testing', icon: <CheckSquare className="w-5 h-5" />, description: 'Selenium, Playwright, Automation, API' },
    { name: 'IT Service Management', coursesCount: '8+ Courses', slug: 'Project', icon: <Award className="w-5 h-5" />, description: 'ITIL Foundation, ITIL Intermediate' },
    { name: 'Product Management', coursesCount: '10+ Courses', slug: 'Business', icon: <Folder className="w-5 h-5" />, description: 'Product Owner, PM Fundamentals' },
    { name: 'Database Technologies', coursesCount: '12+ Courses', slug: 'Data', icon: <Database className="w-5 h-5" />, description: 'SQL Server, MySQL, PostgreSQL, MongoDB' },
    { name: 'Networking Systems', coursesCount: '8+ Courses', slug: 'Cloud', icon: <Globe className="w-5 h-5" />, description: 'CCNA, Network Security, Enterprise' },
    { name: 'Emerging Tech', coursesCount: '6+ Courses', slug: 'AI', icon: <Sparkles className="w-5 h-5" />, description: 'Blockchain, IoT, AR/VR, Quantum' },
  ];

  // Filter categories based on search term
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categories to render: 8 initially if not showAll, otherwise show all filtered categories
  const displayedCategories = showAll ? filteredCategories : filteredCategories.slice(0, 8);

  const handleCategoryClick = (slug: string) => {
    router.push(`/courses?category=${encodeURIComponent(slug)}`);
  };

  return (
    <section className="py-24 bg-sectionBg border-t border-borderLight relative overflow-hidden">
      
      {/* Mesh Glow mesh background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest leading-none">
            Course Discovery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading tracking-tight">
            Explore <span className="text-gradient-purple-pink">Popular Categories</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            Choose from industry-leading certification and training programs designed to accelerate your career.
          </p>
        </div>

        {/* Dynamic Category Search Input */}
        <div className="max-w-md mx-auto w-full">
          <div className="relative rounded-input border border-borderLight bg-white shadow-soft flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-primary/10 transition">
            <Search className="w-4 h-4 text-[#8A8A9A] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specific categories (e.g. AWS, Agile)..."
              className="bg-transparent border-none text-xs text-textPrimary placeholder-[#8A8A9A] focus:outline-none w-full font-medium"
            />
          </div>
        </div>

        {/* Categories Responsive Grid: 4 cols desktop, 3 cols tablet, 1-2 cols mobile */}
        {displayedCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1280px] mx-auto">
            {displayedCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group course-card bg-white p-6 cursor-pointer border border-borderLight hover:border-primary/20 flex flex-col justify-between h-[160px] select-none hover:-translate-y-1 hover:shadow-soft transition-all duration-300 rounded-card"
              >
                <div className="space-y-3">
                  
                  {/* Icon with purple highlight hover state */}
                  <div className="w-10 h-10 rounded-btn bg-[#FAFAFC] border border-borderLight flex items-center justify-center text-[#8A8A9A] group-hover:text-white group-hover:bg-primary transition-all duration-300 shrink-0">
                    {cat.icon}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-textPrimary leading-none heading group-hover:text-primary transition">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-textSecondary font-semibold truncate max-w-[210px] mt-0.5" title={cat.description}>
                      {cat.description}
                    </p>
                  </div>

                </div>

                {/* Course Count Footer */}
                <div className="flex justify-between items-center border-t border-borderLight pt-3 text-[11px] font-bold text-textSecondary">
                  <span>{cat.coursesCount}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary transform group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xs font-bold text-textSecondary">No categories match your active search filter.</p>
          </div>
        )}

        {/* View All Categories Trigger Button */}
        {filteredCategories.length > 8 && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-btn border border-primary text-primary hover:bg-purple-50/20 text-xs font-bold transition shadow-sm bg-white"
            >
              {showAll ? (
                <>Collapse List <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>View All Categories <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
