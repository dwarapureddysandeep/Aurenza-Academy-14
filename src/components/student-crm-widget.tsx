"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateProgressAction,
  generateCertificateAction,
  submitAssignmentAction,
  updateUserProfileAction,
  recordStudentJoinAction,
  triggerLiveClassReminderAction
} from '@/lib/actions';
import {
  GraduationCap, Award, BookOpen, Clock, Calendar, CheckCircle2,
  FileText, Sparkles, ExternalLink, Bot, Zap, Play, Send, Check,
  X, User, ChevronRight, Video, Download, CheckCircle, Flame, Users, CheckSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentCrmWidgetProps {
  user: any;
  enrollments: any[];
  certificates: any[];
  payments: any[];
  assignments: any[];
  batches: any[];
  courses: any[];
  attendances: any[];
  trainers: any[];
}

export default function StudentCrmWidget({
  user,
  enrollments,
  certificates,
  payments,
  assignments,
  batches,
  courses,
  attendances,
  trainers
}: StudentCrmWidgetProps) {
  const router = useRouter();

  // Tab States
  type TabType = 'overview' | 'courses' | 'lms' | 'assignments' | 'certificates' | 'profile';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);

  // LMS Player States
  const [activeCourseId, setActiveCourseId] = useState<string>(enrollments[0]?.courseId || '');
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');

  // Assignment upload forms
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionFileUrl, setSubmissionFileUrl] = useState('');

  // Certificate Preview State
  const [previewCert, setPreviewCert] = useState<any>(null);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    password: ''
  });

  // Calculate quick indicators
  const enrolledCoursesCount = enrollments.length;
  const completedCoursesCount = enrollments.filter(e => e.progress === 100).length;
  const certificatesCount = certificates.length;

  // Calculate pending assignments
  const pendingAssignments = assignments.filter(a => {
    try {
      const subs = JSON.parse(a.submissions || '[]');
      const studentSub = subs.find((s: any) => s.studentEmail.toLowerCase() === user.email.toLowerCase());
      return !studentSub || studentSub.status !== 'Submitted';
    } catch(e) {
      return true;
    }
  });

  // Last active enrollment for "Continue Learning"
  const lastActiveEnrollment = enrollments.sort((a, b) => b.progress - a.progress)[0] || null;
  const lastActiveCourse = lastActiveEnrollment ? courses.find(c => c.id === lastActiveEnrollment.courseId) : null;
  const lastActiveBatch = lastActiveEnrollment ? batches.find(b => b.courseId === lastActiveEnrollment.courseId) : null;

  // Reminder States
  const [reminders, setReminders] = useState({ email: false, whatsapp: false });

  // Helper to parse timeslots and calculate starting relative countdown or Live Status
  const getCohortStatus = (timeSlot: string) => {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();

      if (timeSlot.toLowerCase().includes('7:00 pm')) {
        if (currentHour >= 19 && currentHour < 21) {
          return { label: "Live Now", color: "bg-emerald-500 text-white animate-pulse" };
        } else if (currentHour >= 17 && currentHour < 19) {
          const diffHours = 19 - currentHour;
          const diffMins = 60 - currentMin;
          if (diffHours === 1) {
            return { label: `Starts in ${diffMins} Mins`, color: "bg-amber-500 text-white" };
          }
          return { label: `Starts in ${diffHours} Hours`, color: "bg-amber-500 text-white" };
        }
      }
      
      if (timeSlot.toLowerCase().includes('8:00 am')) {
        if (currentHour >= 8 && currentHour < 10) {
          return { label: "Live Now", color: "bg-emerald-500 text-white animate-pulse" };
        }
      }

      // Default high fidelity preview matching Phase 7 AWS Solutions Architect July 2026 Batch specification
      return { label: "Starts in 2 Hours", color: "bg-indigo-500 text-white" };
    } catch (e) {
      return { label: "Starts in 2 Hours", color: "bg-indigo-500 text-white" };
    }
  };

  const handleToggleEmailReminder = async () => {
    const nextVal = !reminders.email;
    setReminders(prev => ({ ...prev, email: nextVal }));
    if (nextVal && lastActiveBatch) {
      toast.loading("Scheduling email reminder notification...", { id: "email-rem" });
      const res = await triggerLiveClassReminderAction(user.id, lastActiveBatch.id, "EMAIL");
      if (res.success) {
        toast.success(`📧 Email reminder active! Mock notification logged for ${user.email}.`, { id: "email-rem", duration: 5000 });
      } else {
        toast.error("📧 Email reminder registration failed.", { id: "email-rem" });
      }
    } else {
      toast.error("📧 Email reminders disabled for this batch.", { id: "email-rem" });
    }
  };

  const handleToggleWhatsAppReminder = async () => {
    const nextVal = !reminders.whatsapp;
    setReminders(prev => ({ ...prev, whatsapp: nextVal }));
    if (nextVal && lastActiveBatch) {
      toast.loading("Scheduling WhatsApp reminder alert...", { id: "wa-rem" });
      const res = await triggerLiveClassReminderAction(user.id, lastActiveBatch.id, "WHATSAPP");
      if (res.success) {
        toast.success(`💬 WhatsApp reminder active! Mock alert logged for ${user.phone || '+91 98765 43210'}.`, { id: "wa-rem", duration: 5000 });
      } else {
        toast.error("💬 WhatsApp reminder registration failed.", { id: "wa-rem" });
      }
    } else {
      toast.error("💬 WhatsApp reminders disabled.", { id: "wa-rem" });
    }
  };

  const handleJoinClass = async (batchId: string, zoomLink: string) => {
    toast.loading("Recording live attendance credentials...", { id: "join-class" });
    const res = await recordStudentJoinAction(user.id, user.name, batchId);
    if (res.success) {
      toast.success("Attendance logged! Connecting to live session room...", { id: "join-class" });
      window.open(zoomLink, '_blank');
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else {
      toast.error(res.error || "Failed to submit attendance.", { id: "join-class" });
      window.open(zoomLink, '_blank');
    }
  };


  // ----------------------------------------------------
  // STUDENT MUTATION HANDLERS
  // ----------------------------------------------------

  // 1. LMS Video Player Progress Updates
  const handleMarkLessonComplete = async (courseId: string, currentProgress: number) => {
    setLoading(true);
    const nextProgress = Math.min(currentProgress + 20, 100);
    const lastLesson = nextProgress === 100
      ? "Syllabus Mastery Assessment (Complete)"
      : `Module ${activeModuleIdx + 1}: Lecture Lesson #${Math.floor(nextProgress / 10)}`;

    toast.loading("Auto-saving study progression logs...", { id: "progress" });
    const res = await updateProgressAction(user.id, courseId, nextProgress, lastLesson);
    setLoading(false);

    if (res.success) {
      toast.success(`Study logs updated! Progress: ${nextProgress}%`, { id: "progress" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save progress.", { id: "progress" });
    }
  };

  const handleClaimCertificate = async (courseId: string, courseName: string) => {
    setLoading(true);
    toast.loading("Verifying syllabus completion requirements...", { id: "cert" });
    const res = await generateCertificateAction(user.id, user.name, courseId, courseName);
    setLoading(false);

    if (res.success) {
      toast.success(` Verifiable Certificate Generated! ID: ${res.certificate?.certId}`, { id: "cert", duration: 6000 });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to generate certificate.", { id: "cert" });
    }
  };

  // 2. Submit Assignment Lab File
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignmentId || !submissionFileUrl.trim()) return;

    setLoading(true);
    toast.loading("Submitting lab workspace coordinates...", { id: "assign" });
    const res = await submitAssignmentAction(submittingAssignmentId, user.email, submissionFileUrl);
    setLoading(false);

    if (res.success) {
      toast.success("Assignment submitted! Waiting for tutor grading.", { id: "assign" });
      setSubmittingAssignmentId(null);
      setSubmissionFileUrl('');
      router.refresh();
    } else {
      toast.error(res.error || "Failed to submit assignment.", { id: "assign" });
    }
  };

  // 3. Save Student Profile details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Updating profile details...", { id: "profile" });
    const res = await updateUserProfileAction(user.id, profileForm);
    setLoading(false);

    if (res.success) {
      toast.success("Profile settings updated successfully!", { id: "profile" });
      setProfileForm(prev => ({ ...prev, password: '' }));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update profile.", { id: "profile" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-white border border-borderLight rounded-[24px] p-5 shadow-soft flex flex-col gap-1.5 shrink-0">
        <span className="text-[9px] font-black uppercase text-textSecondary px-3 tracking-widest block mb-2">LMS Learner Workspace</span>
        
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'courses', label: 'My Courses Catalog', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'lms', label: 'Watch Videos (LMS)', icon: <Video className="w-4 h-4" /> },
          { id: 'assignments', label: 'My Assignments', icon: <FileText className="w-4 h-4" /> },
          { id: 'certificates', label: 'Certificates Vault', icon: <Award className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              if (tab.id === 'lms' && enrollments.length > 0 && !activeCourseId) {
                setActiveCourseId(enrollments[0].courseId);
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-glowPurple'
                : 'text-textSecondary hover:text-primary hover:bg-sectionBg'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {tab.icon}
              {tab.label}
            </span>
            {tab.id === 'assignments' && pendingAssignments.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${activeTab === 'assignments' ? 'bg-white text-primary' : 'bg-rose-500 text-white animate-pulse'}`}>
                {pendingAssignments.length}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* 2. MAIN HUB WORKSPACE */}
      <main className="flex-1 w-full bg-white border border-borderLight p-6 rounded-[28px] shadow-soft min-h-[600px] relative">
        
        {/* Metric counter header summary on overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { title: "Enrolled Courses", value: enrolledCoursesCount, color: "text-primary", icon: <BookOpen className="w-4 h-4 text-primary" /> },
              { title: "Completed Courses", value: completedCoursesCount, color: "text-successGreen", icon: <CheckCircle2 className="w-4 h-4 text-successGreen" /> },
              { title: "Certificates Earned", value: certificatesCount, color: "text-amber-500", icon: <Award className="w-4 h-4 text-amber-500" /> },
              { title: "Pending Homeworks", value: pendingAssignments.length, color: "text-rose-500", icon: <FileText className="w-4 h-4 text-rose-500" /> }
            ].map((stat, idx) => (
              <div key={idx} className="bg-sectionBg border border-borderLight p-4.5 space-y-2 rounded-2xl shadow-soft">
                <div className="flex justify-between items-center text-textSecondary">
                  <span className="text-[9px] font-bold uppercase tracking-wider">{stat.title}</span>
                  <div className="p-1 rounded bg-white border border-borderLight">{stat.icon}</div>
                </div>
                <p className={`text-lg sm:text-xl font-extrabold heading leading-none ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Last active Continue learning banner */}
            {lastActiveEnrollment && lastActiveCourse ? (
              <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-3xl text-white relative overflow-hidden shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full filter blur-[40px]"></div>
                
                <div className="space-y-2 max-w-[70%]">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full">Continue Learning</span>
                  <h3 className="text-base sm:text-lg font-black heading leading-tight pt-1">{lastActiveCourse.name}</h3>
                  <p className="text-[11px] text-white/80">Last watch lesson: <strong className="text-white">{lastActiveEnrollment.lastLesson}</strong></p>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] font-bold uppercase text-white/60 block">Syllabus Progress</span>
                    <strong className="text-lg font-black block mt-0.5">{lastActiveEnrollment.progress}%</strong>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCourseId(lastActiveEnrollment.courseId);
                      setActiveTab('lms');
                    }}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white text-primary font-black text-xs hover:bg-neutral-100 transition text-center shadow-soft flex items-center justify-center gap-1.5"
                  >
                    Resume Learning <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-sectionBg border border-borderLight p-8 text-center rounded-3xl space-y-3">
                <p className="text-xs text-textSecondary">You are not registered in active cohorts yet. Browse course categories to get certified.</p>
                <button onClick={() => setActiveTab('courses')} className="px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:bg-primaryHover transition">Explore Courses</button>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Learning Streak widget */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-3 shadow-soft flex items-center gap-4 col-span-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/5 text-amber-500 border border-amber-500/10 flex items-center justify-center shrink-0 shadow-soft">
                  <Flame className="w-6 h-6 fill-current text-amber-500 animate-pulse" />
                </div>
                <div className="text-xs">
                  <span className="text-[9px] font-black text-textSecondary uppercase tracking-wider block">7-Day Streak Goal</span>
                  <strong className="text-sm font-extrabold text-textPrimary heading mt-0.5 block">5 Days Completed!</strong>
                  <p className="text-[9px] text-textSecondary mt-0.5">Keep learning daily to unlock certificates.</p>
                </div>
              </div>

              {/* Completion Badges */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-3 shadow-soft col-span-2">
                <span className="text-[9px] font-black text-textSecondary uppercase tracking-wider block border-b border-borderLight pb-1.5">Earned Badges</span>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 bg-sectionBg border border-borderLight px-3 py-1.5 rounded-xl text-[10px] text-textSecondary">
                    <CheckCircle className="w-4 h-4 text-successGreen" />
                    <span className="font-extrabold text-textPrimary">Top Performer</span>
                  </div>
                  <div className="flex items-center gap-2 bg-sectionBg border border-borderLight px-3 py-1.5 rounded-xl text-[10px] text-textSecondary">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-extrabold text-textPrimary">Fast Learner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Live Class Schedule */}
            <div className="border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
              <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5 border-b border-borderLight pb-2">
                <Calendar className="w-4 h-4 text-primary animate-pulse" /> Live Cohort Schedule Today
              </h4>
              {lastActiveBatch ? (
                (() => {
                  const batchTrainer = trainers.find(t => t.id === lastActiveBatch.trainerId);
                  const trainerName = batchTrainer?.name || "Rahul Sharma";
                  const status = getCohortStatus(lastActiveBatch.timeSlot);
                  
                  return (
                    <div className="p-5 bg-sectionBg border border-borderLight rounded-2xl space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-wider">
                              Upcoming Live Class
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <strong className="text-sm font-black text-textPrimary heading block pt-1">{lastActiveCourse?.name}</strong>
                          <p className="text-[11px] text-textSecondary flex items-center gap-1">
                            Trainer: <strong className="text-textPrimary">{trainerName}</strong>
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleJoinClass(lastActiveBatch.id, lastActiveBatch.linkZoom)}
                          className="px-5 py-3 rounded-xl bg-successGreen text-white font-black hover:bg-green-600 transition flex items-center gap-1.5 shrink-0 hover:shadow-glowPurple w-full sm:w-auto justify-center text-xs"
                        >
                          Join Now <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-borderLight pt-4">
                        <div>
                          <span className="text-[9px] font-bold block text-textSecondary uppercase tracking-wide">Lecture Timings</span>
                          <p className="text-textPrimary font-extrabold mt-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> {lastActiveBatch.timeSlot}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold block text-textSecondary uppercase tracking-wide">Cohort Start Date</span>
                          <p className="text-textPrimary font-extrabold mt-1 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" /> {lastActiveBatch.startDate}
                          </p>
                        </div>
                      </div>

                      {/* Reminder Buttons */}
                      <div className="border-t border-borderLight pt-4 flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={handleToggleEmailReminder}
                          className={`px-3.5 py-2 rounded-xl text-[10px] font-bold border transition flex items-center gap-1.5 ${
                            reminders.email
                              ? 'bg-primary/5 border-primary text-primary'
                              : 'bg-white border-borderLight text-textSecondary hover:bg-sectionBg'
                          }`}
                        >
                          📧 Email Reminder {reminders.email ? 'Enabled' : 'Disabled'}
                        </button>
                        <button
                          type="button"
                          onClick={handleToggleWhatsAppReminder}
                          className={`px-3.5 py-2 rounded-xl text-[10px] font-bold border transition flex items-center gap-1.5 ${
                            reminders.whatsapp
                              ? 'bg-secondary/5 border-secondary text-secondary'
                              : 'bg-white border-borderLight text-textSecondary hover:bg-sectionBg'
                          }`}
                        >
                          💬 WhatsApp Reminder {reminders.whatsapp ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-xs text-textSecondary italic">No live interactive timetable sessions listed for your courses today.</p>
              )}
            </div>

            {/* Attendance Registry Logs */}
            <div className="border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
              <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5 border-b border-borderLight pb-2">
                <CheckSquare className="w-4 h-4 text-primary" /> My Live Attendance Logs
              </h4>
              
              {(() => {
                const myAttendanceLogs: any[] = [];
                
                attendances.forEach(att => {
                  try {
                    const records = JSON.parse(att.records || '[]');
                    const myRecord = records.find((r: any) => r.studentId === user.id);
                    if (myRecord) {
                      const batch = batches.find(b => b.id === att.batchId);
                      const course = courses.find(c => c.id === batch?.courseId);
                      myAttendanceLogs.push({
                        id: att.id,
                        date: att.date,
                        courseName: course?.name || "Premium Course",
                        present: myRecord.present,
                        joinTime: myRecord.joinTime || "N/A",
                        leaveTime: myRecord.leaveTime || "N/A"
                      });
                    }
                  } catch(e) {}
                });

                if (myAttendanceLogs.length === 0) {
                  return (
                    <p className="text-xs text-textSecondary italic">No class attendance logs registered yet. Join your live sessions to build reports.</p>
                  );
                }

                return (
                  <div className="border border-borderLight rounded-xl overflow-hidden text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-sectionBg border-b border-borderLight font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">
                          <th className="p-3">Course / Cohort</th>
                          <th className="p-3">Session Date</th>
                          <th className="p-3 text-center">Join Time</th>
                          <th className="p-3 text-center">Leave Time</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderLight text-textPrimary font-medium">
                        {myAttendanceLogs.map(log => (
                          <tr key={log.id} className="hover:bg-sectionBg/30 transition">
                            <td className="p-3">
                              <strong className="text-textPrimary font-extrabold">{log.courseName}</strong>
                            </td>
                            <td className="p-3 text-textSecondary font-mono">{log.date}</td>
                            <td className="p-3 text-center font-mono text-textSecondary">{log.joinTime}</td>
                            <td className="p-3 text-center font-mono text-textSecondary">{log.leaveTime}</td>
                            <td className="p-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                log.present 
                                  ? 'bg-successGreen/5 border border-successGreen/10 text-successGreen'
                                  : 'bg-rose-500/5 border border-rose-500/10 text-rose-500'
                              }`}>
                                {log.present ? 'Present' : 'Absent'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY COURSES CATALOG */}
        {/* ======================================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> My Active certification courses
              </h3>
              <p className="text-xs text-textSecondary mt-1">Review active courses, check progress meters, and claim certificates.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {enrollments.map((enr) => {
                const c = courses.find(course => course.id === enr.courseId);
                const b = batches.find(batch => batch.courseId === enr.courseId);
                const isCertified = certificates.some(cert => cert.courseId === enr.courseId);
                return (
                  <div key={enr.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft flex flex-col justify-between hover:shadow-premium transition-all">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-wider">
                          {c ? c.level : "Specialization"}
                        </span>
                        {isCertified && (
                          <span className="px-2 py-0.5 rounded-full bg-successGreen/5 border border-successGreen/10 text-successGreen text-[8px] font-bold">
                            Certified
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-textPrimary heading line-clamp-1">{c ? c.name : "Syllabus Course"}</h4>
                        <span className="text-[10px] text-textSecondary block mt-1">Last topic: <strong className="text-textPrimary">{enr.lastLesson}</strong></span>
                      </div>

                      <div className="w-full bg-sectionBg h-2.5 border border-borderLight rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300" style={{ width: `${enr.progress}%` }}></div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-textSecondary">
                        <span>Curriculum Progress:</span>
                        <strong className="text-textPrimary font-extrabold">{enr.progress}%</strong>
                      </div>
                    </div>

                    <div className="flex gap-2.5 border-t border-borderLight pt-4 mt-4 text-[10px] font-bold">
                      <button
                        onClick={() => {
                          setActiveCourseId(enr.courseId);
                          setActiveTab('lms');
                        }}
                        className="flex-1 py-2 border border-borderLight hover:border-primary hover:text-primary rounded-xl text-center transition flex items-center justify-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 text-primary shrink-0" /> Resume Learning
                      </button>
                      {enr.progress === 100 && !isCertified && (
                        <button
                          onClick={() => handleClaimCertificate(enr.courseId, c?.name || "Premium Certification")}
                          className="px-3.5 py-2 bg-gradient-to-r from-primary to-secondary text-white hover:bg-primaryHover rounded-xl transition flex items-center gap-1.5 shadow-soft"
                        >
                          Claim Cert
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {enrollments.length === 0 && (
                <div className="text-center py-10 col-span-2 text-textSecondary text-xs">
                  <p>You have not registered in active cohorts yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WATCH VIDEOS (LMS PLAYER) */}
        {/* ======================================================== */}
        {activeTab === 'lms' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" /> Watching course video lecture
                </h3>
                <p className="text-xs text-textSecondary mt-1">Study syllabus module tracks, download notes PDFs, and submit checklists.</p>
              </div>

              {/* Course Selector Dropdown in LMS */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-textSecondary">Select Course:</span>
                <select
                  value={activeCourseId}
                  onChange={(e) => {
                    setActiveCourseId(e.target.value);
                    setActiveModuleIdx(0);
                  }}
                  className="glass-input bg-white text-textPrimary font-semibold"
                >
                  {enrollments.map(enr => {
                    const c = courses.find(course => course.id === enr.courseId);
                    return (
                      <option key={enr.id} value={enr.courseId}>{c ? c.name : "Syllabus Course"}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            {(() => {
              const activeEnr = enrollments.find(e => e.courseId === activeCourseId);
              const activeCourse = courses.find(c => c.id === activeCourseId);
              if (!activeCourse) return <p className="text-xs text-textSecondary py-10 text-center">Please select a course to start learning.</p>;

              // Syllabus modules mapping
              let modulesList: any[] = [];
              try {
                modulesList = JSON.parse(activeCourse.syllabus || '[]');
              } catch(e) {}

              return (
                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Left Column: Video player & complete trigger */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="aspect-video bg-black border border-borderLight rounded-2xl overflow-hidden shadow-soft relative flex items-center justify-center">
                      {/* Simple HTML5 Video element */}
                      <video
                        src={activeVideoUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster={activeCourse.image}
                      />
                    </div>

                    {modulesList[activeModuleIdx]?.recordingUrl && (
                      <div className="bg-secondary/5 border border-secondary/25 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-secondary text-white text-[8px] font-black uppercase tracking-wider">
                            Live Recording
                          </span>
                          <p className="font-extrabold text-textPrimary leading-none pt-1">Trainer-Led Cohort Live Class Recording</p>
                          <p className="text-[10px] text-textSecondary">Missed the live cohort classroom? Watch the trainer's class recording for this module.</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveVideoUrl(modulesList[activeModuleIdx].recordingUrl);
                            toast.success("Playing back live cohort class recording!");
                          }}
                          className="px-4 py-2 bg-secondary text-white hover:bg-opacity-90 font-black rounded-xl transition flex items-center gap-1.5 shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Watch Recording
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-between items-center gap-4 bg-sectionBg border border-borderLight p-4 rounded-xl text-xs">
                      <div>
                        <strong className="text-textPrimary block font-bold">Module {activeModuleIdx + 1}: {modulesList[activeModuleIdx]?.module || "Intro to Course"}</strong>
                        <span className="text-[10px] text-textSecondary mt-0.5 block">{activeEnr?.lastLesson || "Chapter Intro"}</span>
                      </div>

                      <div className="flex gap-2">
                        {/* Download Notes PDF */}
                        <button
                          onClick={() => alert("PDF lecture slides study materials download logs triggered. Files downloading...")}
                          className="px-3.5 py-2.5 bg-white border border-borderLight hover:bg-sectionBg rounded-xl text-textPrimary font-bold transition flex items-center gap-1.5"
                          title="Download module PDF slides"
                        >
                          <Download className="w-3.5 h-3.5 text-primary" /> Study Notes PDF
                        </button>
                        
                        {/* Mark lesson completed */}
                        {activeEnr && activeEnr.progress < 100 && (
                          <button
                            onClick={() => handleMarkLessonComplete(activeCourseId, activeEnr.progress)}
                            className="px-4 py-2.5 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple rounded-xl transition flex items-center gap-1.5"
                          >
                            Mark Complete <Check className="w-3.5 h-3.5 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Module outline traversal lists */}
                  <div className="bg-white border border-borderLight p-5 rounded-[24px] shadow-soft space-y-3.5 h-fit">
                    <span className="text-[9px] font-black text-textSecondary uppercase tracking-wider block">Course Modules ({modulesList.length})</span>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {modulesList.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveModuleIdx(idx);
                            // Simulate switching video src URL
                            setActiveVideoUrl(idx % 2 === 0 ? 'https://www.w3schools.com/html/mov_bbb.mp4' : 'https://www.w3schools.com/html/movie.mp4');
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left transition flex items-start gap-2.5 text-xs ${
                            activeModuleIdx === idx
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-borderLight bg-white text-textSecondary hover:bg-sectionBg/40'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[9px] mt-0.5 border ${
                            activeModuleIdx === idx ? 'bg-primary border-primary text-white' : 'bg-sectionBg border-borderLight text-textSecondary'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <strong className={`font-extrabold block heading leading-tight ${activeModuleIdx === idx ? 'text-primary' : 'text-textPrimary'}`}>
                              {m.module || `Module ${idx + 1}`}
                            </strong>
                            <p className="text-[9px] mt-1 text-textSecondary line-clamp-1">{m.details || "View lessons contents details."}</p>
                            {m.recordingUrl && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-black text-secondary uppercase tracking-wider mt-1.5 bg-secondary/5 px-2 py-0.5 rounded border border-secondary/15">
                                <Video className="w-2.5 h-2.5 text-secondary shrink-0" /> Cohort Recording
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MY ASSIGNMENTS */}
        {/* ======================================================== */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Active Cohort Assignments
              </h3>
              <p className="text-xs text-textSecondary mt-1">Review active class assignments issued by trainers and upload your ZIP workspace answers.</p>
            </div>

            <div className="space-y-6">
              {assignments.map(a => {
                const c = courses.find(course => course.id === a.courseId);
                let submissionsList: any[] = [];
                try {
                  submissionsList = JSON.parse(a.submissions || '[]');
                } catch(e) {}

                // Look for logged student's submission status
                const mySub = submissionsList.find(sub => sub.studentEmail.toLowerCase() === user.email.toLowerCase());
                
                return (
                  <div key={a.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft flex flex-col sm:flex-row justify-between gap-6 hover:shadow-premium transition">
                    <div className="space-y-3 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-[8px] text-[8px] font-black uppercase tracking-wider">
                          {c ? c.name : "Syllabus Course Specialization"}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                          mySub?.status === 'Graded'
                            ? 'bg-successGreen/5 text-successGreen border-successGreen/15'
                            : mySub?.status === 'Submitted'
                            ? 'bg-blue-500/5 text-blue-500 border-blue-500/15'
                            : 'bg-amber-500/5 text-amber-500 border-amber-500/15'
                        }`}>
                          {mySub ? mySub.status : 'Pending Submission'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-textPrimary heading block">{a.title}</h4>
                        {a.description && <p className="text-[10px] text-textSecondary mt-1 leading-relaxed">{a.description}</p>}
                      </div>

                      <div className="flex gap-4 text-[9px] text-textSecondary uppercase font-bold tracking-wider">
                        <span>Due Deadline: <strong className="text-primary">{a.dueDate}</strong></span>
                      </div>

                      {mySub?.grade && (
                        <div className="p-3 bg-sectionBg border border-borderLight rounded-xl text-[10px] text-textSecondary leading-normal">
                          <p className="text-textPrimary font-extrabold uppercase tracking-wide">Grade Received: <strong className="text-primary">{mySub.grade}</strong></p>
                          {mySub.feedback && <p className="mt-1">Instructor Review Notes: "{mySub.feedback}"</p>}
                        </div>
                      )}
                    </div>

                    {/* Submission fields upload form */}
                    <div className="shrink-0 flex items-center justify-end">
                      {mySub?.status === 'Graded' ? (
                        <span className="text-[10px] text-successGreen font-black flex items-center gap-1 border border-successGreen/15 px-3 py-2 rounded-xl bg-successGreen/5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-successGreen" /> Graded Completed
                        </span>
                      ) : submittingAssignmentId === a.id ? (
                        <form onSubmit={handleSubmitAssignment} className="flex gap-2 text-xs">
                          <input
                            type="url"
                            required
                            value={submissionFileUrl}
                            onChange={(e) => setSubmissionFileUrl(e.target.value)}
                            placeholder="Paste submission link or file URL..."
                            className="glass-input text-[10px] py-1.5 w-44"
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-3 bg-primary hover:bg-primaryHover text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0"
                          >
                            Submit <Send className="w-3 h-3 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSubmittingAssignmentId(null)}
                            className="p-2 border border-borderLight rounded-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => setSubmittingAssignmentId(a.id)}
                          className="px-4 py-2 border border-borderLight hover:border-primary hover:text-primary rounded-xl text-xs font-bold transition text-center flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5 shrink-0" /> {mySub ? 'Resubmit Link' : 'Upload Submission'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {assignments.length === 0 && (
                <div className="text-center py-10 bg-sectionBg border border-borderLight border-dashed rounded-2xl text-textSecondary text-xs">
                  <p>No active assignments posted in your course cohorts yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CERTIFICATES VAULT */}
        {/* ======================================================== */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Credentials & Verified Certificates
              </h3>
              <p className="text-xs text-textSecondary mt-1">Verify cryptographical syllabus completion certificates and share to LinkedIn.</p>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-10 bg-sectionBg border border-borderLight border-dashed rounded-2xl text-textSecondary text-xs">
                <p>No certifications generated. Lock in 100% course progression targets to verify certificates.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-white border border-borderLight p-5 space-y-4 rounded-2xl border-t-4 border-t-primary shadow-soft hover:shadow-premium transition flex flex-col justify-between">
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none block">VERIFIED ACADEMY CREDENTIAL</span>
                        <h4 className="text-xs font-extrabold text-textPrimary heading mt-1">{cert.courseName}</h4>
                        <span className="text-[10px] text-textSecondary block mt-1">Conferred Date: <strong>{cert.completionDate}</strong></span>
                      </div>

                      <div className="bg-sectionBg border border-borderLight px-3 py-2 rounded-xl text-center select-all">
                        <span className="text-[8px] font-black text-textSecondary uppercase tracking-widest block">Verification ID code</span>
                        <code className="text-primary font-mono font-extrabold mt-0.5 block">{cert.certId}</code>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-4 border-t border-borderLight mt-4 text-[10px] font-bold">
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="flex-1 py-2 rounded-xl bg-primary hover:bg-primaryHover text-white text-center transition font-black hover:shadow-glowPurple"
                      >
                        View & Download PDF
                      </button>
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="px-3.5 py-2 border border-borderLight hover:bg-sectionBg rounded-xl text-textPrimary text-center"
                      >
                        Verify & Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PROFILE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Student Profile & Settings
              </h3>
              <p className="text-xs text-textSecondary mt-1">Manage display name, credentials avatar, hotline numbers, and active passwords.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs text-textPrimary">
              
              <div className="border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-primary border-b border-borderLight pb-2">Profile details</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Display Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Registered Email</label>
                    <input
                      type="email"
                      required
                      disabled
                      value={user.email}
                      className="glass-input bg-sectionBg border-borderLight/30 text-textSecondary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Hotline Mobile Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Avatar initials</label>
                    <input
                      type="text"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Student Bio / Designation</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="e.g. Aspiring cloud engineer..."
                      rows={3}
                      className="glass-input resize-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Change Password settings */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-secondary border-b border-borderLight pb-2">Change Password settings</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">New Secure Password</label>
                    <input
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter new password if modifying..."
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-xs uppercase tracking-wider"
              >
                Save Profile Parameters
              </button>
            </form>
          </div>
        )}

        {/* PREMIUM CERTIFICATE VIEW MODAL */}
        {previewCert && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-auto">
            <div className="bg-white border-[12px] border-double border-amber-500/20 rounded-[32px] max-w-4xl w-full p-8 sm:p-10 relative shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0 print:rounded-none landscape-cert">
              
              {/* Close Button (Hidden on Print) */}
              <button
                onClick={() => setPreviewCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-textSecondary transition print:hidden z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Canvas / Content */}
              <div className="border-4 border-amber-500/10 p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-amber-500/[0.01] to-amber-500/[0.04] relative space-y-6 flex flex-col items-center justify-between text-center min-h-[480px]">
                
                {/* Visual Premium Seal Overlay Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/[0.015] rounded-full border border-amber-500/5 flex items-center justify-center pointer-events-none">
                  <Award className="w-36 h-36 text-amber-500/[0.02]" />
                </div>

                {/* Header */}
                <div className="space-y-1.5 relative z-10">
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block">Official Certified Graduate Registry</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 heading tracking-tight pt-1">
                    CERTIFICATE OF COMPLETION
                  </h2>
                  <p className="text-[10px] text-textSecondary italic">This is proudly presented to</p>
                </div>

                {/* Recipient Name */}
                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-black text-primary underline decoration-amber-500 decoration-wavy underline-offset-8 heading">
                    {previewCert.name}
                  </h3>
                  <p className="text-[10px] text-textSecondary max-w-md mx-auto pt-2 leading-relaxed font-medium">
                    for successfully fulfilling all coursework, assignments, and exam targets required to receive the official Aurenza Academy certification in
                  </p>
                  <h4 className="text-sm sm:text-base font-black text-neutral-800 tracking-tight block pt-1">
                    {previewCert.courseName}
                  </h4>
                </div>

                {/* Metadata & Signatures Row */}
                <div className="w-full grid grid-cols-3 items-end gap-4 border-t border-amber-500/10 pt-5 text-[9px] text-textSecondary relative z-10">
                  {/* Left: Date & ID */}
                  <div className="text-left space-y-1">
                    <p>Issue Date: <strong className="text-neutral-800">{previewCert.completionDate}</strong></p>
                    <p>Cert ID: <strong className="text-primary font-mono select-all">{previewCert.certId}</strong></p>
                  </div>

                  {/* Center: Instructor Signature */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="font-serif italic text-xs text-neutral-600 border-b border-neutral-300 pb-1 px-4 leading-none select-none">
                      Dr. Ramesh Kumar
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-textSecondary">Lead Instructor</span>
                  </div>

                  {/* Right: Founder Signature */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="font-serif italic text-xs text-neutral-600 border-b border-neutral-300 pb-1 px-4 leading-none select-none">
                      Aurenza Academy
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-textSecondary">Founder & Director</span>
                  </div>
                </div>

                {/* QR Code and Logo */}
                <div className="w-full flex justify-between items-center pt-3 relative z-10 border-t border-amber-500/5">
                  <div className="flex items-center gap-1.5">
                    <div className="px-1.5 py-0.5 bg-primary text-white rounded font-black text-[9px] leading-none">AURENZA</div>
                    <span className="text-[7px] font-black text-textSecondary uppercase tracking-widest">IT & AI Certification Registry</span>
                  </div>

                  {/* Dynamic QR Code from QR Server API */}
                  <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-neutral-100 shadow-soft">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(`https://aurenzaacademy.com/verify/${previewCert.certId}`)}`}
                      alt="Verification QR Code"
                      className="w-[40px] h-[40px] select-none"
                    />
                    <div className="text-left text-[6px] text-textSecondary max-w-[70px] leading-tight font-medium">
                      Scan code to verify certificate authenticity online.
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-end pt-1 print:hidden text-xs font-bold">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primaryHover font-black tracking-wider transition flex items-center justify-center gap-1.5 shadow-soft"
                >
                  <Download className="w-4 h-4" /> Download PDF / Print
                </button>
                <a
                  href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(previewCert.courseName)}&organizationName=Aurenza%20Academy`}
                  target="_blank"
                  className="px-5 py-2.5 rounded-xl border border-borderLight hover:bg-neutral-100 text-textPrimary text-center transition"
                >
                  Post to LinkedIn
                </a>
              </div>

            </div>
          </div>
        )}

        {/* Embedded style tags for landscape certificate print media overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            /* Hide entire website structure during certificate printing */
            main, aside, nav, footer, header, #__next, .print\\:hidden, button, section, div:not(.fixed):not(.landscape-cert) {
              display: none !important;
              visibility: hidden !important;
            }
            .fixed {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: white !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 99999 !important;
              padding: 0 !important;
              margin: 0 !important;
              visibility: visible !important;
            }
            .fixed * {
              visibility: visible !important;
            }
            .landscape-cert {
              border: none !important;
              box-shadow: none !important;
              max-width: 100% !important;
              width: 100% !important;
              height: auto !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}} />

      </main>
    </div>
  );
}
