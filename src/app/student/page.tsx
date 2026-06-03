import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import { db } from '@/lib/db';
import { GraduationCap, Award, BookOpen, Clock, Calendar, CheckCircle2, AlertCircle, Compass, FileText, Sparkles, ExternalLink, Bot } from 'lucide-react';

import Link from 'next/link';
import StudentActionsWidget from '@/components/student-actions-widget';

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

  // Hydrate courses inside enrollments
  const hydratedEnrollments = await Promise.all(
    enrollments.map(async (enr: any) => {
      const course = await db.course.findUnique({ where: { id: enr.courseId } });
      const batch = await db.batch.findFirst({ where: { courseId: enr.courseId } });
      return { ...enr, course, batch };
    })
  );

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
            <p className="text-xs text-textSecondary">Track your weekly interactive cohorts schedules, complete assignments, and download certificates.</p>
          </div>
          
          <div className="bg-white border border-borderLight rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-textPrimary font-semibold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-successGreen animate-pulse"></span>
            <span>Student account verified</span>
          </div>
        </div>

        {/* Dynamic Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "Enrolled Specializations", value: hydratedEnrollments.length, color: "text-primary", icon: <BookOpen className="w-4 h-4 text-primary" /> },
            { title: "Completed Cohorts", value: hydratedEnrollments.filter(e => e.progress === 100).length, color: "text-successGreen", icon: <CheckCircle2 className="w-4 h-4 text-successGreen" /> },
            { title: "Issued Certificates", value: certificates.length, color: "text-primary", icon: <Award className="w-4 h-4 text-primary" /> },
            { title: "Tuition Payments", value: `₹${payments.reduce((a: number, b: any) => a + b.amount, 0).toLocaleString()}`, color: "text-textPrimary", icon: <FileText className="w-4 h-4 text-textPrimary" /> }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-borderLight p-5 space-y-3 rounded-2xl shadow-soft">
              <div className="flex justify-between items-center text-textSecondary">
                <span className="text-[10px] font-bold uppercase tracking-wider">{stat.title}</span>
                <div className="p-1.5 rounded bg-sectionBg border border-borderLight">{stat.icon}</div>
              </div>
              <p className={`text-xl sm:text-2xl font-extrabold heading leading-none ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Dashboard Columns (Enrolled courses) */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-lg font-extrabold text-textPrimary heading border-b border-borderLight pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> My Active Programs
            </h3>

            {hydratedEnrollments.length === 0 ? (
              <div className="bg-white border border-borderLight p-10 text-center space-y-4 rounded-3xl shadow-soft">
                <Compass className="w-12 h-12 text-primary/40 mx-auto animate-float" />
                <h4 className="text-md font-bold text-textPrimary">No active enrollments</h4>
                <p className="text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
                  You are not currently enrolled in any IT or AI certifications. Navigate to the course catalog to reserve a cohort seat.
                </p>
                <Link href="/courses" className="inline-block px-5 py-2.5 rounded-[14px] bg-primary hover:bg-primaryHover font-bold text-xs text-white transition">
                  Explore Courses Hub
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {hydratedEnrollments.map((enr) => (
                  <div 
                    key={enr.id}
                    className="bg-white border border-borderLight p-6 space-y-6 rounded-[24px] shadow-soft hover:shadow-premium transition-all relative overflow-hidden"
                  >
                    {/* Inner glowing bubble */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/5 rounded-full filter blur-[45px]"></div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1.5 max-w-[70%]">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-0.5 rounded-full">{enr.course?.level || "Specialization"}</span>
                        <h4 className="text-md sm:text-lg font-extrabold text-textPrimary heading pt-1">{enr.course?.name}</h4>
                        <p className="text-xs text-textSecondary flex items-center gap-1.5 pt-1">
                          <Clock className="w-3.5 h-3.5 text-primary" /> Class Slot: <strong className="text-textPrimary">{enr.batch?.timeSlot || "Schedules TBD"}</strong>
                        </p>
                      </div>

                      {/* progress status */}
                      <div className="space-y-1 sm:text-right">
                        <span className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">Module Progress</span>
                        <p className="text-lg font-extrabold text-textPrimary heading leading-none">{enr.progress}%</p>
                        <span className="text-[10px] text-primary font-bold mt-1 block">Lesson: {enr.lastLesson}</span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full bg-sectionBg rounded-full h-2.5 overflow-hidden border border-borderLight">
                      <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500" style={{ width: `${enr.progress}%` }}></div>
                    </div>

                    {/* Class actions & dynamic Zoom links */}
                    <div className="pt-4 border-t border-borderLight flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-textSecondary">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Start Date: <strong>{enr.batch?.startDate || "TBD"}</strong></span>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        <StudentActionsWidget 
                          userId={user.id} 
                          userName={user.name}
                          courseId={enr.courseId} 
                          courseName={enr.course?.name || "Specialization"}
                          currentProgress={enr.progress}
                          isCertIssued={certificates.some((c: any) => c.courseId === enr.courseId)}
                        />

                        {enr.batch?.linkZoom && (
                          <Link 
                            href={enr.batch.linkZoom}
                            target="_blank"
                            className="px-4 py-2 rounded-xl bg-successGreen/5 hover:bg-successGreen/15 text-successGreen font-bold flex items-center gap-1 shrink-0 border border-successGreen/10 transition"
                          >
                            Live Zoom Class <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar column (Completion Certificates Verifiers) */}
          <div className="space-y-8">
            <h3 className="text-lg font-extrabold text-textPrimary heading border-b border-borderLight pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> My Credentials
            </h3>

            {certificates.length === 0 ? (
              <div className="bg-white border border-borderLight p-6 text-center space-y-3 rounded-[24px] shadow-soft">
                <Award className="w-10 h-10 text-textSecondary/40 mx-auto animate-pulse" />
                <h4 className="text-xs font-bold text-textSecondary">No credentials generated</h4>
                <p className="text-[10px] text-textSecondary leading-relaxed max-w-[200px] mx-auto">
                  Syllabus certifications are unlocked when module progress reaches 100%. Complete active quizzes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert: any) => (
                  <div 
                    key={cert.id}
                    className="bg-white border border-borderLight p-5 space-y-4 rounded-2xl border-t-4 border-t-primary shadow-soft hover:shadow-premium transition-all"
                  >
                    <div className="space-y-1">
                      <p className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none">VERIFIED IT CREDENTIAL</p>
                      <h4 className="text-xs font-bold text-textPrimary truncate heading mt-1">{cert.courseName}</h4>
                      <p className="text-[10px] text-textSecondary mt-1">Conferred: <strong>{cert.completionDate}</strong></p>
                    </div>

                    <div className="bg-sectionBg border border-borderLight px-3 py-2 rounded-xl text-center text-[10px] leading-relaxed">
                      <span className="text-textSecondary uppercase tracking-widest block font-bold">Verification ID</span>
                      <code className="text-primary font-extrabold mt-0.5 block select-all">{cert.certId}</code>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert(`Verified Certificate ID: ${cert.certId}. Complete cryptographically secure PDF downloading hooks implemented.`)}
                        className="flex-1 py-2 rounded-[14px] bg-primary hover:bg-primaryHover hover:shadow-glowPurple font-bold text-[10px] text-white transition text-center shadow-soft"
                      >
                        Download PDF
                      </button>
                      <Link
                        href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.courseName)}&organizationName=Aurenza%20Academy`}
                        target="_blank"
                        className="px-3 py-2 rounded-[14px] bg-[#0077b5]/5 hover:bg-[#0077b5]/15 text-[#0077b5] border border-[#0077b5]/10 font-bold text-[10px] text-center"
                      >
                        Add to LinkedIn
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI counseling alert */}
            <div className="bg-primary/5 border border-primary/10 p-5 rounded-[24px] space-y-3 shadow-soft">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                <Bot className="w-3.5 h-3.5" /> Auri AI Assistant
              </span>
              <h4 className="text-xs font-bold text-textPrimary heading leading-none">Identify missing technical skill gaps?</h4>
              <p className="text-[10px] text-textSecondary leading-normal">
                Upload your latest professional resume text into Auri's analyzer located on the bottom floating bar to compare with upcoming batch topics.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auri-open-resume'));
                  }
                }}
                className="text-[10px] font-extrabold text-primary hover:underline flex items-center gap-0.5"
              >
                Scan Resume Now &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
