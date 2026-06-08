import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import { db } from '@/lib/db';
import { AlertCircle, Laptop, Sparkles } from 'lucide-react';
import Link from 'next/link';
import TrainerCrmWidget from '@/components/trainer-crm-widget';

export const revalidate = 0; // Dynamic server component

export default async function TrainerDashboardPage() {
  const user = await getCurrentUser();

  // 1. Auth check
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'TRAINER' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-sectionBg">
        <AlertCircle className="w-12 h-12 text-primary animate-pulse mb-4" />
        <h3 className="text-xl font-bold heading text-textPrimary">Access Denied</h3>
        <p className="text-sm text-textSecondary max-w-sm mt-1 leading-relaxed">
          Your active session role ({user.role}) is not authorized to access the trainer portal.
        </p>
        <Link href={user.role === 'ADMIN' ? '/admin' : '/student'} className="mt-4 px-6 py-2.5 rounded-[14px] bg-primary text-xs font-bold text-white hover:bg-primaryHover transition">
          Go to my Dashboard
        </Link>
      </div>
    );
  }

  // 2. Fetch specific Trainer profile
  const trainer = await db.trainer.findUnique({
    where: { email: user.email }
  });

  // Fallback helper if profile is not fully pre-seeded yet
  const matchedTrainer = trainer || {
    id: "trainer-1",
    name: user.name,
    email: user.email,
    avatar: user.avatar || "T",
    bio: "Ex-industry expert teaching advanced engineering tracks.",
    specialty: "Full Stack Software Engineering"
  };

  // 3. Fetch batches assigned to this trainer
  const allBatches = await db.batch.findMany();
  const batches = allBatches.filter((b: any) => b.trainerId === matchedTrainer.id);

  // 4. Fetch unique courses corresponding to trainer's batches
  const courseIds = Array.from(new Set(batches.map((b: any) => b.courseId)));
  const allCourses = await db.course.findMany();
  const courses = allCourses.filter((c: any) => courseIds.includes(c.id));

  // 5. Fetch enrollments matching these courses
  const allEnrollments = await db.enrollment.findMany();
  const enrollments = allEnrollments.filter((enr: any) => courseIds.includes(enr.courseId));

  // 6. Fetch unique students enrolled in these courses
  const studentIds = Array.from(new Set(enrollments.map((enr: any) => enr.userId)));
  const allStudents = await db.user.findMany({ where: { role: 'STUDENT' } });
  const students = allStudents.filter((s: any) => studentIds.includes(s.id));

  // 7. Fetch assignments issued for trainer's courses
  const allAssignments = await db.assignment.findMany();
  const assignments = allAssignments.filter((a: any) => courseIds.includes(a.courseId));

  // 8. Fetch attendance sheets logs registered for batches
  const batchIds = batches.map((b: any) => b.id);
  const allAttendances = await db.attendance.findMany();
  const attendances = allAttendances.filter((att: any) => batchIds.includes(att.batchId));

  return (
    <div className="min-h-screen bg-sectionBg text-textPrimary py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-10 relative z-10">
        
        {/* Welcome row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-borderLight pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Laptop className="w-3.5 h-3.5" /> Corporate Trainer Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-textPrimary heading leading-none flex items-center gap-2">
              Trainer Cohort Center, <span className="text-gradient-purple-pink">{matchedTrainer.name}</span>
              <Sparkles className="w-5 h-5 text-secondary" />
            </h2>
            <p className="text-xs text-textSecondary">Reschedule timetables, post live classroom Zoom links, upload notes PDFs, issue homework challenges, and log attendance reports.</p>
          </div>
          
          <div className="bg-white border border-borderLight rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-textPrimary font-semibold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span>Trainer session active</span>
          </div>
        </div>

        {/* Overhauled Client Trainer Workspace Component */}
        <TrainerCrmWidget 
          trainer={matchedTrainer}
          batches={batches}
          courses={courses}
          students={students}
          enrollments={enrollments}
          assignments={assignments}
          attendances={attendances}
        />

      </div>
    </div>
  );
}
