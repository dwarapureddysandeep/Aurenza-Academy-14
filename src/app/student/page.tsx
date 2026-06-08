import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import { db } from '@/lib/db';
import { AlertCircle, GraduationCap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import StudentCrmWidget from '@/components/student-crm-widget';

export const revalidate = 0; // Dynamic server component

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  // 1. Session check redirecting unauthorized visitors
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'STUDENT' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-sectionBg">
        <AlertCircle className="w-12 h-12 text-primary animate-pulse mb-4" />
        <h3 className="text-xl font-bold heading text-textPrimary">Access Denied</h3>
        <p className="text-sm text-textSecondary max-w-sm mt-1 leading-relaxed">
          Your active session role ({user.role}) is not authorized to access the learner portal. Go to your corresponding dashboard.
        </p>
        <Link href={user.role === 'ADMIN' ? '/admin' : '/trainer'} className="mt-4 px-6 py-2.5 rounded-[14px] bg-primary text-xs font-bold text-white hover:bg-primaryHover transition">
          Go to my Dashboard
        </Link>
      </div>
    );
  }

  // 2. Fetch student dynamic metrics
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id }
  });

  const certificates = await db.certificate.findMany({
    where: { userId: user.id }
  });

  const payments = await db.payment.findMany({
    where: { userId: user.id }
  });

  // Extract enrolled course IDs
  const courseIds = enrollments.map((enr: any) => enr.courseId);

  // Fetch unique courses corresponding to enrollments
  const allCourses = await db.course.findMany();
  const courses = allCourses.filter((c: any) => courseIds.includes(c.id));

  // Fetch live batches timetables for these courses
  const allBatches = await db.batch.findMany();
  const batches = allBatches.filter((b: any) => courseIds.includes(b.courseId));

  // Fetch active assignments issued for these courses
  const allAssignments = await db.assignment.findMany();
  const assignments = allAssignments.filter((a: any) => courseIds.includes(a.courseId));

  // Fetch trainers and attendance sheets records (Phase 7)
  const trainers = await db.trainer.findMany();
  const allAttendances = await db.attendance.findMany();
  const batchIds = batches.map((b: any) => b.id);
  const attendances = allAttendances.filter((att: any) => batchIds.includes(att.batchId));

  return (
    <div className="min-h-screen bg-sectionBg text-textPrimary py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-10 relative z-10">
        
        {/* Welcome Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-borderLight pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <GraduationCap className="w-3.5 h-3.5" /> Learner Hub Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading leading-none flex items-center gap-2">
              Welcome back, <span className="text-gradient-purple-pink">{user.name}</span>
              <Sparkles className="w-5 h-5 text-secondary" />
            </h2>
            <p className="text-xs text-textSecondary">Track your weekly interactive cohorts schedules, complete assignments, watch lessons, and download certificates.</p>
          </div>
          
          <div className="bg-white border border-borderLight rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-textPrimary font-semibold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-successGreen animate-pulse"></span>
            <span>Student account verified</span>
          </div>
        </div>

        {/* Student CRM Dashboard control panel */}
        <StudentCrmWidget 
          user={user}
          enrollments={enrollments}
          certificates={certificates}
          payments={payments}
          assignments={assignments}
          batches={batches}
          courses={courses}
          attendances={attendances}
          trainers={trainers}
        />

      </div>
    </div>
  );
}
