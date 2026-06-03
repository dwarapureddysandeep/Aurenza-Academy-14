import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import { db } from '@/lib/db';
import { AlertCircle, Laptop, Calendar, Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import TrainerActionsWidget from '@/components/trainer-actions-widget';
import TrainerUploadWidget from '@/components/trainer-upload-widget';

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

  // 2. Fetch assigned batches
  const batches = await db.batch.findMany();
  
  // Hydrate courses inside batches
  const hydratedBatches = await Promise.all(
    batches.map(async (batch: any) => {
      const course = await db.course.findUnique({ where: { id: batch.courseId } });
      const enrollmentsCount = await db.enrollment.count({ where: { courseId: batch.courseId } });
      return { ...batch, course, enrollmentsCount };
    })
  );

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
              Cohort Control Center, <span className="text-gradient-purple-pink">{user.name}</span>
              <Sparkles className="w-5 h-5 text-secondary" />
            </h2>
            <p className="text-xs text-textSecondary">Launch classes, update syllabus materials, post Zoom links, and trace student attendance rates.</p>
          </div>
          
          <div className="bg-white border border-borderLight rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-textPrimary font-semibold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span>Trainer status active</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Active Cohorts list */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-extrabold text-textPrimary heading border-b border-borderLight pb-3 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-primary" /> My Active Cohorts
            </h3>

            <div className="space-y-6">
              {hydratedBatches.map((batch: any) => (
                <div 
                  key={batch.id}
                  className="bg-white border border-borderLight p-6 space-y-4 rounded-[24px] shadow-soft hover:shadow-premium transition-all relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-0.5 rounded-full">{batch.course?.level || "Cohort"}</span>
                      <h4 className="text-md sm:text-lg font-extrabold text-textPrimary heading pt-1">{batch.course?.name}</h4>
                      <p className="text-xs text-textSecondary flex items-center gap-1.5 pt-1">
                        <Calendar className="w-3.5 h-3.5 text-secondary animate-pulse" /> Class Slot: <strong className="text-textPrimary">{batch.timeSlot}</strong>
                      </p>
                    </div>

                    <div className="bg-sectionBg border border-borderLight rounded-2xl px-4 py-2 text-center h-fit shrink-0">
                      <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">Active Students</p>
                      <p className="text-sm font-extrabold text-textPrimary heading mt-0.5">{batch.enrollmentsCount} Enrolled</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-borderLight flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-textSecondary">
                    <span>Date: <strong>{batch.startDate}</strong></span>
                    
                    {/* Zoom links and active actions widget */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <TrainerActionsWidget 
                        batchId={batch.id} 
                        currentZoomLink={batch.linkZoom} 
                      />
                      
                      <Link 
                        href={batch.linkZoom}
                        target="_blank"
                        className="px-4 py-2.5 rounded-[14px] bg-primary hover:bg-primaryHover text-white font-bold transition flex items-center gap-1 shrink-0 shadow-soft hover:shadow-glowPurple"
                      >
                        Launch Live Lecture &rarr;
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic study material uploader widget */}
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-textPrimary heading border-b border-borderLight pb-3 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary" /> Upload Resource
            </h3>

            <TrainerUploadWidget batches={hydratedBatches} />
          </div>

        </div>

      </div>
    </div>
  );
}
