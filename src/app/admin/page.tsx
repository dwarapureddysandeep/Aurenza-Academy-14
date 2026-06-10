import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import { db } from '@/lib/db';
import { AlertCircle, Users, IndianRupee, Award, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AdminCrmWidget from '@/components/admin-crm-widget';

export const revalidate = 0; // Dynamic server component

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  // 1. Auth check
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-sectionBg">
        <AlertCircle className="w-12 h-12 text-primary animate-pulse mb-4" />
        <h3 className="text-xl font-bold heading text-textPrimary">Access Denied</h3>
        <p className="text-sm text-textSecondary max-w-sm mt-1 leading-relaxed">
          Your active session role ({user.role}) is not authorized to access the administrator panel.
        </p>
        <Link href={user.role === 'TRAINER' ? '/trainer' : '/student'} className="mt-4 px-6 py-2.5 rounded-[14px] bg-primary text-xs font-bold text-white hover:bg-primaryHover transition">
          Go to my Dashboard
        </Link>
      </div>
    );
  }

  // 2. Fetch all CRM details
  const leads = await db.lead.findMany();
  const corporateLeads = await db.corporateLead.findMany();
  const courses = await db.course.findMany();
  const batches = await db.batch.findMany();
  const trainers = await db.trainer.findMany();
  const categories = await db.category.findMany();
  const testimonials = await db.testimonial.findMany();
  const blogs = await db.blog.findMany();

  return (
    <div className="min-h-screen bg-sectionBg text-textPrimary py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-10 relative z-10">
        
        {/* Welcome Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-borderLight pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Layers className="w-3.5 h-3.5" /> Enterprise Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading leading-none flex items-center gap-2">
              Admin & CRM Dashboard, <span className="text-gradient-purple-pink">Aurenza Academy</span>
              <Sparkles className="w-5 h-5 text-secondary" />
            </h2>
            <p className="text-xs text-textSecondary">Review course enquiries, manage course listings, schedule live batches, moderate reviews, write blogs, and update settings.</p>
          </div>
          
          <div className="bg-white border border-borderLight rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-textPrimary font-semibold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span>Admin session authenticated</span>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            { title: "Course Enquiries", value: leads.length, color: "text-primary", icon: <Users className="w-4 h-4 text-primary" /> },
            { title: "Total Courses", value: courses.length, color: "text-secondary", icon: <Layers className="w-4 h-4 text-secondary" /> },
            { title: "Total Tutors", value: trainers.length, color: "text-amber-500", icon: <Users className="w-4 h-4 text-amber-500" /> },
            { title: "Active Batches", value: batches.length, color: "text-blue-500", icon: <Award className="w-4 h-4 text-blue-500" /> },
            { title: "Corporate Leads", value: corporateLeads.length, color: "text-rose-500", icon: <Users className="w-4 h-4 text-rose-500" /> }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-borderLight p-4.5 space-y-2 rounded-2xl shadow-soft">
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[9px] font-bold uppercase tracking-wider">{stat.title}</span>
                <div className="p-1 rounded bg-sectionBg border border-borderLight">{stat.icon}</div>
              </div>
              <p className={`text-lg sm:text-xl font-extrabold heading leading-none ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Dynamic CRM Kanban Board & Management Panels (Client Widget Wrapper) */}
        <AdminCrmWidget 
          initialLeads={leads} 
          initialCorporateLeads={corporateLeads}
          courses={courses}
          batches={batches}
          students={[]}
          trainers={trainers}
          categories={categories}
          payments={[]}
          certificates={[]}
          testimonials={testimonials}
          blogs={blogs}
          notificationSettings={[]}
          notificationLogs={[]}
        />

      </div>
    </div>
  );
}
