"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, IndianRupee, ArrowRight, BookOpen, User, Briefcase, Award } from 'lucide-react';

interface RoadmapNode {
  title: string;
  salary: string;
  skills: string[];
  certifications: string[];
  opportunities: string;
  description: string;
}

interface RoadmapCategory {
  title: string;
  path: RoadmapNode[];
}

const ROADMAP_DATA: Record<string, RoadmapCategory> = {
  "After 10th": {
    title: "Pathways After 10th Standard",
    path: [
      {
        title: "Step 1: STEM / Computer Literacy Foundations",
        description: "Focus on math, logical reasoning, and basic coding paradigms (Python/HTML).",
        salary: "N/A (Learning Phase)",
        skills: ["Logical reasoning", "Basic Python", "Algorithms basics"],
        certifications: ["School Foundations", "Basic Computer Literacy"],
        opportunities: "Prepares for higher secondary school or basic diploma projects."
      },
      {
        title: "Step 2: Core Engineering Pivot (Web UI)",
        description: "Learn web layout structures (HTML5, CSS3, JavaScript ES6) and custom responsive styles.",
        salary: "₹3 LPA - ₹4.5 LPA (Entry-Level Web Designer)",
        skills: ["HTML5", "CSS3", "JavaScript ES6", "Responsive Designs"],
        certifications: ["Aurenza Frontend Certification (React)"],
        opportunities: "Freelance projects, web layout specialist roles."
      }
    ]
  },
  "After Intermediate": {
    title: "Pathways After Intermediate / 12th",
    path: [
      {
        title: "Step 1: Core Coding & Programming Bootcamps",
        description: "Intense immersion into structured programming like Java OOPs, relational SQL database structures.",
        salary: "N/A (Career Bootcamp Prep)",
        skills: ["Java OOPs", "SQL Databases", "Data Structures"],
        certifications: ["Aurenza Career Bootcamps"],
        opportunities: "Prepares for technical entry tests, internships, and quantitative tests."
      },
      {
        title: "Step 2: Junior UI / Full Stack Engineer",
        description: "Constructing enterprise web APIs, Spring Boot REST integrations, and deploying frontends.",
        salary: "₹5 LPA - ₹7.5 LPA",
        skills: ["Spring Boot", "React", "REST APIs", "Git Version Control"],
        certifications: ["Aurenza Java Full Stack Certification"],
        opportunities: "Junior Web Developer, Associate Analyst, Backend Support Engineer."
      }
    ]
  },
  "After Degree": {
    title: "Pathways After General Degree (B.Sc / B.Com / B.A)",
    path: [
      {
        title: "Step 1: Data Analytics & Business Intelligence",
        description: "Bridge the gap between general analytics and high-income tech roles. Learn advanced SQL, Excel, and Tableau visualization.",
        salary: "₹4.5 LPA - ₹6 LPA",
        skills: ["Advanced SQL", "Excel dashboards", "Tableau BI", "Python basics"],
        certifications: ["Aurenza Data Science & Analytics"],
        opportunities: "Junior Data Analyst, Operations Analyst, Business Intelligence Associate."
      },
      {
        title: "Step 2: Data Science Specialist",
        description: "Scale into advanced pipeline development, statistical modeling, and PySpark big data aggregations.",
        salary: "₹7 LPA - ₹12 LPA",
        skills: ["Statistical Modeling", "PySpark", "Machine Learning models", "Hadoop"],
        certifications: ["Aurenza Data Science Specialist"],
        opportunities: "Data Scientist, Data Engineer, Product Analyst at top product companies."
      }
    ]
  },
  "After B.Tech": {
    title: "Pathways After B.Tech (ECE / CSE / EEE / Mechanical)",
    path: [
      {
        title: "Step 1: Production-Grade Software Engineering",
        description: "Rebuild engineering foundations: high-performance multithreading, advanced data structures, microservices architectures, and system designs.",
        salary: "₹7 LPA - ₹12 LPA",
        skills: ["Java Multi-threading", "Microservices", "Docker", "Next.js UI Engine"],
        certifications: ["Aurenza Java Full Stack Developer"],
        opportunities: "Full Stack Engineer, Systems Developer, Backend Architect at Microsoft, TCS, Amazon."
      },
      {
        title: "Step 2: Artificial Intelligence Engineer",
        description: "Specialize in cutting-edge neural computing, PyTorch models, computer vision frameworks, and transformer model fine-tunings.",
        salary: "₹12 LPA - ₹25 LPA",
        skills: ["PyTorch Deep Learning", "Transformers", "LLM fine-tuning", "FastAPI, MLOps"],
        certifications: ["Aurenza AI & ML Engineer Masterclass"],
        opportunities: "AI Engineer, Machine Learning Specialist, NLP Researcher, Core AI Solutions Architect."
      }
    ]
  },
  "Working Professionals": {
    title: "Pathways for Working Professionals (Non-Tech to Tech or Upskilling)",
    path: [
      {
        title: "Step 1: Professional Project & Agile Management",
        description: "Leverage domain experience while pivoting to high-income management consulting roles. Learn global governance models.",
        salary: "₹9 LPA - ₹15 LPA",
        skills: ["PMI governance", "Risk Management", "Agile scaling", "Business Analysis"],
        certifications: ["Aurenza PMP Exam Prep", "Aurenza CBAP Business Analysis"],
        opportunities: "Project Manager, Scrum Master, Business Analyst, Agile Lead."
      },
      {
        title: "Step 2: Director / Enterprise Solutions Architect",
        description: "Direct enterprise programs, cloud governance frameworks (AWS, DevOps pipelines), and corporate consulting pipelines.",
        salary: "₹18 LPA - ₹40+ LPA",
        skills: ["Cloud Architecture", "AWS Solutions", "DevOps Pipelines", "Corporate Consulting"],
        certifications: ["Aurenza AWS Solutions Architect & DevOps Masterclass"],
        opportunities: "Solutions Architect, Program Director, DevOps Lead, IT Governance Chief."
      }
    ]
  }
};

export default function RoadmapExplorer() {
  const [activeTab, setActiveTab] = useState<string>("After B.Tech");

  const triggerModal = (courseName: string) => {
    window.dispatchEvent(new CustomEvent('open-lead-modal', { 
      detail: { 
        source: 'Roadmap Explorer',
        prefilledCourse: courseName 
      } 
    }));
  };

  return (
    <div className="space-y-12">
      
      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {Object.keys(ROADMAP_DATA).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border flex items-center gap-1.5 ${
              activeTab === tab
                ? 'bg-primary border-transparent text-white hover:bg-primaryHover shadow-soft hover:shadow-glowPurple'
                : 'bg-white border-borderLight text-textSecondary hover:text-primary hover:border-primary'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeTab === tab ? 'text-white' : 'text-primary'}`} />
            {tab}
          </button>
        ))}
      </div>

      {/* Expanded Timeline Graph */}
      <div className="relative max-w-4xl mx-auto pl-6 sm:pl-8 border-l border-borderLight space-y-10 animate-fade-up">
        
        <h3 className="text-xl font-extrabold heading text-textPrimary border-b border-borderLight pb-3 mb-8 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          {ROADMAP_DATA[activeTab].title}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {ROADMAP_DATA[activeTab].path.map((node, index) => (
              <div key={index} className="relative space-y-3 group">
                
                {/* Timeline node bullet */}
                <span className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white group-hover:bg-secondary group-hover:scale-110 transition duration-300 shadow-soft"></span>

                {/* Main Card */}
                <div className="bg-white border border-borderLight rounded-[24px] p-6 shadow-soft hover:shadow-premium transition duration-300 space-y-4 relative">
                  
                  {/* Step index badge */}
                  <span className="absolute top-4 right-6 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded">
                    Step 0{index + 1}
                  </span>

                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="text-md sm:text-lg font-extrabold text-textPrimary heading">{node.title}</h4>
                    <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">{node.description}</p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-borderLight">
                    
                    {/* Salary benchmark */}
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-successGreen/5 text-successGreen border border-successGreen/10 shrink-0">
                        <IndianRupee className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">Salary Benchmarks</p>
                        <p className="text-xs text-textPrimary font-extrabold mt-0.5">{node.salary}</p>
                      </div>
                    </div>

                    {/* Jobs placement opportunities */}
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-primary/5 text-primary border border-primary/10 shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">Hiring Placements</p>
                        <p className="text-xs text-textSecondary font-medium mt-0.5 leading-relaxed">{node.opportunities}</p>
                      </div>
                    </div>

                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-borderLight text-xs">
                    
                    {/* Skills list */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-secondary" /> Essential Technical Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {node.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-sectionBg border border-borderLight text-[9px] text-textSecondary font-bold">{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications required */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3 h-3 text-primary" /> Recommended Bootcamps
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {node.certifications.map((cert, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => triggerModal(cert.split(' (')[0])}
                            className="px-2.5 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 text-[9px] text-primary font-bold text-left transition flex items-center gap-0.5"
                          >
                            {cert} <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>

    </div>
  );
}
