import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import CourseFilterGrid from '@/components/course-filter-grid';
import { GraduationCap } from 'lucide-react';

export const metadata = {
  title: "Professional IT & AI Certifications Catalog - Aurenza Academy",
  description: "Explore 28 enterprise-grade career certification cohorts in Java Full Stack, Spring Boot Microservices, Next.js frontend architectures, and Machine Learning pipelines."
};

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function CoursesCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || '';
  const category = resolvedParams?.category || '';
  const courses = await db.course.findMany();

  return (
    <div className="min-h-screen bg-white text-textPrimary py-16 px-4 sm:px-6 lg:px-8 font-sans relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
            <GraduationCap className="w-3.5 h-3.5" /> Certification Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
            Certified <span className="text-gradient-purple-pink">Career Pathways</span>
          </h2>
          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
            All programs are live-streamed, pre-seeded with intensive mock coding quizzes, real-world microservices deployments, and backed by direct referral networks with top global recruiters.
          </p>
        </div>

        {/* Dynamic Catalog Filter Grid */}
        <Suspense fallback={<div className="text-center py-12 text-xs font-bold text-textSecondary animate-pulse">Loading course catalog...</div>}>
          <CourseFilterGrid initialCourses={courses} searchParam={search} initialCategory={category} />
        </Suspense>

      </div>
    </div>
  );
}
