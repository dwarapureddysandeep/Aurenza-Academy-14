"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  saveAssignmentAction,
  deleteAssignmentAction,
  gradeSubmissionAction,
  saveAttendanceAction,
  saveCourseContentAction,
  saveTrainerProfileAction,
  saveBatchAction
} from '@/lib/actions';
import {
  GraduationCap, Laptop, Calendar, Sparkles, PlusCircle, BookOpen,
  Users, FileText, CheckSquare, User, Clock, Trash2, Edit, Check,
  X, Search, Award, Bot, ExternalLink, TrendingUp, Send, CheckCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TrainerCrmWidgetProps {
  trainer: any;
  batches: any[];
  courses: any[];
  students: any[];
  enrollments: any[];
  assignments: any[];
  attendances: any[];
}

export default function TrainerCrmWidget({
  trainer,
  batches,
  courses,
  students,
  enrollments,
  assignments,
  attendances
}: TrainerCrmWidgetProps) {
  const router = useRouter();
  
  // Tab states
  type TabType = 'overview' | 'courses' | 'batches' | 'students' | 'assignments' | 'attendance' | 'profile';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ----------------------------------------------------
  // SUBCOMPONENT / FORM STATES
  // ----------------------------------------------------

  // Content Upload Form
  const [selectedCourseForContent, setSelectedCourseForContent] = useState<string>(courses[0]?.id || '');
  const [syllabusJson, setSyllabusJson] = useState<string>('');

  // Batch Form
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  const [batchForm, setBatchForm] = useState({
    id: '',
    courseId: '',
    trainerId: '',
    startDate: '',
    timeSlot: '',
    seatsTotal: '30',
    seatsLeft: '30',
    linkZoom: ''
  });

  // Assignment Form
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    id: '',
    courseId: courses[0]?.id || '',
    title: '',
    description: '',
    dueDate: '',
    submissions: '[]'
  });

  // Grading Form State
  const [gradingDetails, setGradingDetails] = useState({
    assignmentId: '',
    studentEmail: '',
    grade: '',
    feedback: ''
  });

  // Attendance Form State
  const [selectedAttendanceBatch, setSelectedAttendanceBatch] = useState<string>(batches[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, boolean>>({});

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    id: trainer?.id || '',
    name: trainer?.name || '',
    email: trainer?.email || '',
    avatar: trainer?.avatar || '',
    bio: trainer?.bio || '',
    specialty: trainer?.specialty || ''
  });

  // Synchronize selections
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseForContent) {
      setSelectedCourseForContent(courses[0].id);
      const course = courses.find(c => c.id === courses[0].id);
      setSyllabusJson(course?.syllabus || '[]');
    }
  }, [courses]);

  useEffect(() => {
    if (trainer) {
      setProfileForm({
        id: trainer.id,
        name: trainer.name,
        email: trainer.email || '',
        avatar: trainer.avatar || '',
        bio: trainer.bio || '',
        specialty: trainer.specialty || ''
      });
    }
  }, [trainer]);

  // Load syllabus json when course selection changes
  const handleCourseForContentChange = (courseId: string) => {
    setSelectedCourseForContent(courseId);
    const course = courses.find(c => c.id === courseId);
    setSyllabusJson(course?.syllabus || '[]');
  };

  // ----------------------------------------------------
  // MUTATION MUTATORS
  // ----------------------------------------------------

  // 1. Content Management Syllabus Update
  const handleSaveCourseContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Uploading curriculum modules content...", { id: "tutor" });
    const res = await saveCourseContentAction(selectedCourseForContent, syllabusJson);
    setLoading(false);
    if (res.success) {
      toast.success("Syllabus modules saved and synced with LMS catalog!", { id: "tutor" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update content modules.", { id: "tutor" });
    }
  };

  // 2. Batch Zoom Link & Reschedule Save
  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Saving live batch coordinates...", { id: "tutor" });
    const res = await saveBatchAction(batchForm);
    setLoading(false);
    if (res.success) {
      toast.success("Batch schedule and credentials updated successfully!", { id: "tutor" });
      setEditingBatch(null);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update batch.", { id: "tutor" });
    }
  };

  // 3. Create Assignment
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Creating cohort challenge assignment...", { id: "tutor" });
    
    // Auto-seed student submissions array for active enrolled students of the course
    const courseEnrollments = enrollments.filter(enr => enr.courseId === assignmentForm.courseId);
    let mockSubmissions: any[] = [];
    courseEnrollments.forEach(enr => {
      const student = students.find(s => s.id === enr.userId);
      if (student) {
        mockSubmissions.push({
          studentName: student.name,
          studentEmail: student.email,
          submittedAt: new Date().toISOString(),
          status: "Pending",
          feedback: "",
          grade: ""
        });
      }
    });

    const dataObj = {
      ...assignmentForm,
      submissions: JSON.stringify(mockSubmissions)
    };

    const res = await saveAssignmentAction(dataObj);
    setLoading(false);
    if (res.success) {
      toast.success("Assignment issued directly to student dashboards!", { id: "tutor" });
      setEditingAssignment(null);
      setAssignmentForm({
        id: '',
        courseId: courses[0]?.id || '',
        title: '',
        description: '',
        dueDate: '',
        submissions: '[]'
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to post assignment.", { id: "tutor" });
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;
    toast.loading("Deleting assignment card...", { id: "tutor" });
    const res = await deleteAssignmentAction(id);
    if (res.success) {
      toast.success("Assignment removed.", { id: "tutor" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete.", { id: "tutor" });
    }
  };

  // 4. Submit Grades & Feedback
  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Publishing submission feedback...", { id: "tutor" });
    const res = await gradeSubmissionAction(
      gradingDetails.assignmentId,
      gradingDetails.studentEmail,
      gradingDetails.grade,
      gradingDetails.feedback
    );
    setLoading(false);
    if (res.success) {
      toast.success("Grades and feedback pushed to student dashboard!", { id: "tutor" });
      setGradingDetails({ assignmentId: '', studentEmail: '', grade: '', feedback: '' });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to grade.", { id: "tutor" });
    }
  };

  // 5. Attendance Logging
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Registering attendance logs...", { id: "tutor" });

    // Calculate metrics
    const batch = batches.find(b => b.id === selectedAttendanceBatch);
    const courseEnrollments = enrollments.filter(enr => enr.courseId === batch?.courseId);
    
    let present = 0;
    let absent = 0;
    const recordsList = courseEnrollments.map(enr => {
      const student = students.find(s => s.id === enr.userId);
      const isPresent = !!attendanceRecords[student?.id || ''];
      if (isPresent) present++;
      else absent++;
      return {
        studentId: student?.id || '',
        studentName: student?.name || '',
        present: isPresent
      };
    });

    const res = await saveAttendanceAction({
      batchId: selectedAttendanceBatch,
      date: attendanceDate,
      presentCount: present,
      absentCount: absent,
      records: JSON.stringify(recordsList)
    });

    setLoading(false);
    if (res.success) {
      toast.success(`Attendance logged! Present: ${present}, Absent: ${absent}`, { id: "tutor" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to log attendance.", { id: "tutor" });
    }
  };

  // 6. Tutor Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Updating trainer profile parameters...", { id: "tutor" });
    const res = await saveTrainerProfileAction(profileForm);
    setLoading(false);
    if (res.success) {
      toast.success("Trainer profile updated!", { id: "tutor" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update profile.", { id: "tutor" });
    }
  };

  // Calculated Metrics for Highlights
  const totalStudentsCount = enrollments.length;
  
  // Pending submissions require review (status is "Pending" or grade is empty)
  let pendingAssignmentsCount = 0;
  assignments.forEach(a => {
    try {
      const subs = JSON.parse(a.submissions);
      pendingAssignmentsCount += subs.filter((s: any) => s.status === 'Pending').length;
    } catch(e) {}
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-white border border-borderLight rounded-[24px] p-5 shadow-soft flex flex-col gap-1.5 shrink-0">
        <span className="text-[9px] font-black uppercase text-textSecondary px-3 tracking-widest block mb-2">Trainer Control Center</span>
        
        {[
          { id: 'overview', label: 'Tutor Overview', icon: <Laptop className="w-4 h-4" /> },
          { id: 'courses', label: 'My Courses Hub', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'batches', label: 'My Batches Live', icon: <Calendar className="w-4 h-4" /> },
          { id: 'students', label: 'Assigned Learners', icon: <Users className="w-4 h-4" /> },
          { id: 'assignments', label: 'Class Assignments', icon: <FileText className="w-4 h-4" /> },
          { id: 'attendance', label: 'Mark Attendance', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'profile', label: 'Trainer Profile', icon: <User className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setSearchQuery('');
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
            {tab.id === 'assignments' && pendingAssignmentsCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${activeTab === 'assignments' ? 'bg-white text-primary' : 'bg-amber-500 text-white animate-pulse'}`}>
                {pendingAssignmentsCount}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* 2. MAIN HUB WORKSPACE */}
      <main className="flex-1 w-full bg-white border border-borderLight p-6 rounded-[28px] shadow-soft min-h-[600px] relative">
        
        {/* Metric summary top overlay on overview tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { title: "My Courses", value: courses.length, color: "text-primary", icon: <BookOpen className="w-4 h-4 text-primary" /> },
              { title: "Total Assigned Students", value: totalStudentsCount, color: "text-successGreen", icon: <Users className="w-4 h-4 text-successGreen" /> },
              { title: "Active Batches", value: batches.length, color: "text-blue-500", icon: <Calendar className="w-4 h-4 text-blue-500" /> },
              { title: "Pending Assignments", value: pendingAssignmentsCount, color: "text-rose-500", icon: <FileText className="w-4 h-4 text-rose-500" /> }
            ].map((stat, idx) => (
              <div key={idx} className="bg-sectionBg border border-borderLight p-4 space-y-2 rounded-2xl shadow-soft">
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
        {/* TAB 1: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Laptop className="w-5 h-5 text-primary" /> Cohort Live Timetable Schedules
              </h3>
              <p className="text-xs text-textSecondary mt-1">Check today's lecture targets, view zoom credentials, and upload files.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Batches Overview Panel */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5 border-b border-borderLight pb-2">
                  <Calendar className="w-4 h-4 text-primary" /> Upcoming Timetables
                </h4>
                {batches.length === 0 ? (
                  <p className="text-xs text-textSecondary">No live batches assigned to you.</p>
                ) : (
                  <div className="space-y-3 text-xs">
                    {batches.map(b => {
                      const c = courses.find(course => course.id === b.courseId);
                      return (
                        <div key={b.id} className="p-3 bg-sectionBg border border-borderLight rounded-xl flex justify-between items-center">
                          <div>
                            <strong className="text-textPrimary font-extrabold block">{c ? c.name : "Syllabus Course"}</strong>
                            <span className="text-[10px] text-textSecondary mt-1 block flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary" /> {b.timeSlot}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/5 text-blue-500 border border-blue-500/10 font-bold text-[9px]">
                            {b.startDate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Attendance Quick Shortcut */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5 border-b border-borderLight pb-2">
                  <CheckSquare className="w-4 h-4 text-secondary" /> Rapid Operations
                </h4>
                <div className="grid gap-2.5 text-xs">
                  <button onClick={() => setActiveTab('attendance')} className="w-full text-left p-3 rounded-xl hover:bg-primary/5 hover:text-primary border border-borderLight transition flex items-center justify-between font-bold">
                    <span>Log Attendance for Today's Cohort</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab('assignments')} className="w-full text-left p-3 rounded-xl hover:bg-primary/5 hover:text-primary border border-borderLight transition flex items-center justify-between font-bold">
                    <span>Grade Pending Student Lab Homeworks</span>
                    <Award className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab('courses')} className="w-full text-left p-3 rounded-xl hover:bg-primary/5 hover:text-primary border border-borderLight transition flex items-center justify-between font-bold">
                    <span>Upload Learning Material & Videos</span>
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Assistant helper */}
            <div className="bg-primary/5 border border-primary/10 p-5 rounded-[24px] space-y-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                <Bot className="w-3.5 h-3.5" /> Aurenza AI Cohort Tutor Helper
              </span>
              <h4 className="text-xs font-bold text-textPrimary heading leading-none">Automate homework challenges?</h4>
              <p className="text-[10px] text-textSecondary leading-normal">
                Use your custom AI chatbot helper dashboard on the homepage navigation floating controls to generate week-by-week syllabus homework guidelines based on Spring Boot, Java, or Next.js modules dynamically.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY COURSES */}
        {/* ======================================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Curriculum Content Uploader
              </h3>
              <p className="text-xs text-textSecondary mt-1">Upload lecture recordings, study guidelines, and update modules JSON outline.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-black uppercase text-textPrimary tracking-widest pl-2 border-l-2 border-primary">My Courses</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {courses.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleCourseForContentChange(c.id)}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                        selectedCourseForContent === c.id
                          ? 'border-primary bg-primary/5 shadow-soft'
                          : 'border-borderLight bg-white hover:bg-sectionBg/40'
                      }`}
                    >
                      <div className="space-y-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-wider">
                          {c.level}
                        </span>
                        <h4 className="text-xs font-extrabold text-textPrimary heading block line-clamp-1">{c.name}</h4>
                        <span className="text-[10px] text-textSecondary block">Duration: {c.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Modules list outline display */}
                {selectedCourseForContent && (
                  <div className="bg-sectionBg border border-borderLight p-5 rounded-2xl space-y-3.5 text-xs">
                    <h5 className="font-extrabold text-textPrimary uppercase tracking-wider text-[10px]">Active Syllabus Modules View</h5>
                    <div className="space-y-2.5">
                      {(() => {
                        try {
                          const list = JSON.parse(syllabusJson);
                          if (!Array.isArray(list) || list.length === 0) return <p className="text-textSecondary italic">No modules outline defined.</p>;
                          return list.map((mod: any, idx: number) => (
                            <div key={idx} className="bg-white border border-borderLight p-3.5 rounded-xl space-y-1">
                              <strong className="text-textPrimary text-[11px] heading block">{mod.module || `Module ${idx + 1}`}</strong>
                              <p className="text-textSecondary text-[10px] leading-relaxed">{mod.details || 'Curriculum details not populated.'}</p>
                            </div>
                          ));
                        } catch(e) {
                          return <p className="text-dangerRed font-mono text-[10px]">Invalid JSON format compiled for course syllabus.</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Modules and course content forms */}
              <div className="bg-white border border-borderLight p-5 rounded-[24px] space-y-4 h-fit shadow-soft">
                <h4 className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1">
                  <Laptop className="w-4 h-4" /> Update Syllabus
                </h4>
                <form onSubmit={handleSaveCourseContent} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Target Course</label>
                    <select
                      value={selectedCourseForContent}
                      onChange={(e) => handleCourseForContentChange(e.target.value)}
                      className="glass-input bg-white text-textPrimary font-semibold"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Syllabus Modules (JSON Schema)</label>
                    <textarea
                      required
                      value={syllabusJson}
                      onChange={(e) => setSyllabusJson(e.target.value)}
                      rows={8}
                      className="glass-input font-mono text-[11px] leading-normal bg-white"
                      placeholder='[{"module": "Mod 1: Basics", "details": "Learn variables"}]'
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-[10px] uppercase tracking-wider"
                  >
                    Upload & Update Modules →
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MY BATCHES */}
        {/* ======================================================== */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Timetables & Live coordinates
              </h3>
              <p className="text-xs text-textSecondary mt-1">Manage schedules, timings, and live Zoom / Google Meet classroom links.</p>
            </div>

            {editingBatch ? (
              <form onSubmit={handleSaveBatch} className="space-y-4 bg-sectionBg border border-borderLight p-6 rounded-2xl animate-fade-up">
                <div className="flex justify-between items-center border-b border-borderLight pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider">Modify Live Cohort Scheduling</h4>
                  <button type="button" onClick={() => setEditingBatch(null)} className="p-1 rounded-full hover:bg-white text-textSecondary transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Zoom Meeting URL</label>
                    <input
                      type="url"
                      required
                      value={batchForm.linkZoom}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, linkZoom: e.target.value }))}
                      placeholder="https://zoom.us/j/..."
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Start Date</label>
                    <input
                      type="text"
                      required
                      value={batchForm.startDate}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, startDate: e.target.value }))}
                      placeholder="e.g. 10 July"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Lecture Timings</label>
                    <input
                      type="text"
                      required
                      value={batchForm.timeSlot}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                      placeholder="e.g. 7 PM – 9 PM"
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setEditingBatch(null)}
                    className="px-4 py-2 border border-borderLight hover:bg-white text-textPrimary font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white hover:bg-primaryHover font-black rounded-xl text-xs transition shadow-soft"
                  >
                    Save Batch Coordinates
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 text-xs">
                {batches.map(b => {
                  const course = courses.find(c => c.id === b.courseId);
                  return (
                    <div key={b.id} className="bg-white border border-borderLight p-5 rounded-2xl shadow-soft hover:shadow-premium transition flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-black text-primary uppercase tracking-wider block">Timetable Session</span>
                            <h4 className="text-xs font-black text-textPrimary heading mt-1">{course ? course.name : "Syllabus Course"}</h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/5 text-blue-500 border border-blue-500/10 font-bold text-[8px]">
                            {b.startDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 bg-sectionBg border border-borderLight rounded-xl font-semibold text-[10px] text-textSecondary">
                          <div>
                            <span className="text-[8px] font-bold block text-textSecondary uppercase tracking-wide">Lecture Timings</span>
                            <p className="text-textPrimary mt-1 flex items-center gap-1 leading-none">
                              <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> {b.timeSlot}
                            </p>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold block text-textSecondary uppercase tracking-wide">Zoom Meeting URL</span>
                            <a href={b.linkZoom} target="_blank" className="text-primary mt-1 block truncate hover:underline flex items-center gap-1 leading-none select-all">
                              <ExternalLink className="w-3 h-3 text-secondary shrink-0" /> Class Zoom link
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-borderLight pt-4 mt-4 font-bold">
                        <button
                          onClick={() => {
                            setEditingBatch(b);
                            setBatchForm({
                              id: b.id,
                              courseId: b.courseId,
                              trainerId: b.trainerId,
                              startDate: b.startDate,
                              timeSlot: b.timeSlot,
                              seatsTotal: b.seatsTotal.toString(),
                              seatsLeft: b.seatsLeft.toString(),
                              linkZoom: b.linkZoom
                            });
                          }}
                          className="flex-1 py-2 border border-borderLight hover:border-primary hover:text-primary rounded-xl text-center transition flex items-center justify-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Adjust Batch Coordinates
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STUDENTS */}
        {/* ======================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Cohort Enrolled Students
                </h3>
                <p className="text-xs text-textSecondary mt-1">Track student progress percentages and check registry enrollments.</p>
              </div>
            </div>

            <div className="border border-borderLight rounded-2xl overflow-hidden shadow-soft text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sectionBg border-b border-borderLight font-extrabold text-[10px] text-textSecondary uppercase tracking-wider">
                    <th className="p-4">Student</th>
                    <th className="p-4">Course Registry</th>
                    <th className="p-4 text-center">Progress Percentage</th>
                    <th className="p-4 text-right">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {enrollments.map((enr) => {
                    const student = students.find(s => s.id === enr.userId);
                    const course = courses.find(c => c.id === enr.courseId);
                    if (!student) return null;
                    return (
                      <tr key={enr.id} className="hover:bg-sectionBg/40 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {student.avatar || student.name[0]}
                            </div>
                            <div>
                              <strong className="text-textPrimary font-extrabold heading block">{student.name}</strong>
                              <span className="text-[9px] text-textSecondary">{student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-textSecondary">
                          {course ? course.name : "Syllabus Course Specialization"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center flex-col justify-center gap-1.5 w-32 mx-auto">
                            <div className="flex justify-between w-full text-[9px] font-bold text-textSecondary">
                              <span>Lessons</span>
                              <span>{enr.progress}%</span>
                            </div>
                            <div className="w-full bg-sectionBg h-1.5 rounded-full overflow-hidden border border-borderLight">
                              <div className="bg-successGreen h-full rounded-full" style={{ width: `${enr.progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right text-textSecondary font-mono">
                          {new Date(enr.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                  {enrollments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-textSecondary">No active student enrollments logged for your courses.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ASSIGNMENTS */}
        {/* ======================================================== */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderLight pb-4">
              <div>
                <h3 className="text-base font-extrabold heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Assignments & Submissions
                </h3>
                <p className="text-xs text-textSecondary mt-1">Issue assignments, review student files submissions, and publish grade feedback.</p>
              </div>
              {!editingAssignment && (
                <button
                  onClick={() => {
                    setEditingAssignment('new');
                    setAssignmentForm({
                      id: '',
                      courseId: courses[0]?.id || '',
                      title: '',
                      description: '',
                      dueDate: '15 July',
                      submissions: '[]'
                    });
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primaryHover transition flex items-center gap-1.5 shadow-soft"
                >
                  <PlusCircle className="w-4 h-4" /> Create Homework Lab
                </button>
              )}
            </div>

            {editingAssignment ? (
              <form onSubmit={handleSaveAssignment} className="space-y-4 bg-sectionBg border border-borderLight p-6 rounded-2xl animate-fade-up">
                <div className="flex justify-between items-center border-b border-borderLight pb-3 mb-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider">
                    {editingAssignment === 'new' ? 'New Assignment Details' : 'Edit Assignment'}
                  </h4>
                  <button type="button" onClick={() => setEditingAssignment(null)} className="p-1 rounded-full hover:bg-white text-textSecondary transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Target Course</label>
                    <select
                      value={assignmentForm.courseId}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, courseId: e.target.value }))}
                      className="glass-input bg-white text-textPrimary"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Due Date Deadline</label>
                    <input
                      type="text"
                      required
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      placeholder="e.g. 15 July"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Assignment Title</label>
                    <input
                      type="text"
                      required
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Spring Boot Securing Microservices Rest APIs"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Lab Instructions / Description</label>
                    <textarea
                      value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Outline variables, targets, and expected codes outcomes..."
                      rows={3}
                      className="glass-input resize-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setEditingAssignment(null)}
                    className="px-4 py-2 border border-borderLight hover:bg-white text-textPrimary font-bold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white hover:bg-primaryHover font-black rounded-xl text-xs transition shadow-soft"
                  >
                    Issue Assignment
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {assignments.map(a => {
                  const course = courses.find(c => c.id === a.courseId);
                  let submissionsList: any[] = [];
                  try {
                    submissionsList = JSON.parse(a.submissions);
                  } catch(e) {}
                  return (
                    <div key={a.id} className="border border-borderLight rounded-2xl p-5 space-y-4 text-xs shadow-soft bg-white">
                      <div className="flex justify-between items-start border-b border-borderLight pb-3">
                        <div>
                          <span className="text-[8px] font-black text-primary uppercase tracking-wider block">{course ? course.name : "Curriculum Course"}</span>
                          <h4 className="text-sm font-extrabold text-textPrimary heading mt-1">{a.title}</h4>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/5 border border-rose-500/10 text-[9px] font-bold text-rose-500">
                            Due: {a.dueDate}
                          </span>
                          <button
                            onClick={() => handleDeleteAssignment(a.id)}
                            className="text-textSecondary hover:text-dangerRed transition block text-right w-full text-[10px] font-bold hover:underline"
                          >
                            Remove Card
                          </button>
                        </div>
                      </div>

                      {a.description && (
                        <p className="text-textSecondary leading-relaxed">{a.description}</p>
                      )}

                      {/* Submissions List */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[9px] font-black text-textSecondary uppercase tracking-wider block">Student Submissions ({submissionsList.length})</span>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {submissionsList.map((sub: any, idx: number) => (
                            <div key={idx} className="bg-sectionBg border border-borderLight p-3.5 rounded-xl space-y-3 relative hover:shadow-soft transition">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-textPrimary block font-bold leading-none">{sub.studentName}</strong>
                                  <span className="text-[8px] text-textSecondary block mt-1">{sub.studentEmail}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                                  sub.status === 'Graded'
                                    ? 'bg-successGreen/5 text-successGreen border-successGreen/15'
                                    : 'bg-amber-500/5 text-amber-500 border-amber-500/15'
                                }`}>
                                  {sub.status}
                                </span>
                              </div>

                              {sub.grade && (
                                <div className="p-2.5 bg-white border border-borderLight rounded-lg text-[9px] text-textSecondary">
                                  <p className="text-textPrimary font-extrabold uppercase tracking-wide">Grade Awarded: <span className="text-primary">{sub.grade}</span></p>
                                  {sub.feedback && <p className="mt-1 leading-relaxed">Feedback: "{sub.feedback}"</p>}
                                </div>
                              )}

                              {/* Grade inputs */}
                              {sub.status !== 'Graded' && (
                                <button
                                  type="button"
                                  onClick={() => setGradingDetails({
                                    assignmentId: a.id,
                                    studentEmail: sub.studentEmail,
                                    grade: 'A+',
                                    feedback: 'Excellent work!'
                                  })}
                                  className="w-full py-1.5 bg-white border border-borderLight hover:border-primary hover:text-primary rounded-lg text-[9px] font-bold transition flex items-center justify-center gap-1"
                                >
                                  Grade Submission
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Inline grading overlay model */}
                {gradingDetails.assignmentId && (
                  <form onSubmit={handleGradeSubmission} className="bg-sectionBg border border-borderLight p-5 rounded-2xl space-y-3 text-xs shadow-premium max-w-sm absolute right-4 bottom-4 animate-fade-up z-20">
                    <div className="flex justify-between items-center border-b border-borderLight pb-2">
                      <strong className="font-extrabold text-[10px] text-textPrimary uppercase tracking-wider">Publish Marks & Feedback</strong>
                      <button type="button" onClick={() => setGradingDetails({ assignmentId: '', studentEmail: '', grade: '', feedback: '' })} className="p-1 text-textSecondary">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-textSecondary">Select Grade Rank</label>
                        <select
                          value={gradingDetails.grade}
                          onChange={(e) => setGradingDetails(prev => ({ ...prev, grade: e.target.value }))}
                          className="glass-input bg-white text-textPrimary font-bold"
                        >
                          <option value="A+">A+ (Perfect Mastery)</option>
                          <option value="A">A (Excellent)</option>
                          <option value="B">B (Good)</option>
                          <option value="C">C (Pass)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-textSecondary">Tutor Notes Feedback</label>
                        <input
                          type="text"
                          required
                          value={gradingDetails.feedback}
                          onChange={(e) => setGradingDetails(prev => ({ ...prev, feedback: e.target.value }))}
                          placeholder="Feedback comments..."
                          className="glass-input"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-primary text-white font-black hover:bg-primaryHover transition rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        Publish Marks <Send className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </form>
                )}

                {assignments.length === 0 && (
                  <div className="text-center py-10 bg-sectionBg border border-borderLight border-dashed rounded-2xl text-textSecondary text-xs">
                    <p>No active assignments posted yet. Click 'Create Homework Lab' to issue one.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: ATTENDANCE */}
        {/* ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" /> Attendance Registry Ledger
              </h3>
              <p className="text-xs text-textSecondary mt-1">Select batch, specify class date, and check present student registries.</p>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-5 text-xs text-textPrimary">
              <div className="grid gap-4 sm:grid-cols-2 bg-sectionBg border border-borderLight p-4.5 rounded-xl">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-textSecondary uppercase tracking-wide">Select Batch Timetable</label>
                  <select
                    value={selectedAttendanceBatch}
                    onChange={(e) => {
                      setSelectedAttendanceBatch(e.target.value);
                      setAttendanceRecords({});
                    }}
                    className="glass-input bg-white text-textPrimary font-semibold"
                  >
                    {batches.map(b => {
                      const course = courses.find(c => c.id === b.courseId);
                      return (
                        <option key={b.id} value={b.id}>{course ? course.name : "Syllabus Course"} ({b.startDate})</option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-textSecondary uppercase tracking-wide">Class Date</label>
                  <input
                    type="date"
                    required
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="glass-input font-bold"
                  />
                </div>
              </div>

              {/* Student Checklist list */}
              <div className="border border-borderLight rounded-2xl p-5 space-y-4 bg-white shadow-soft">
                <span className="text-[10px] font-black text-textSecondary uppercase tracking-wider block">Mark attendance checklist</span>
                <div className="divide-y divide-borderLight">
                  {(() => {
                    const batch = batches.find(b => b.id === selectedAttendanceBatch);
                    const courseEnrollments = enrollments.filter(enr => enr.courseId === batch?.courseId);
                    
                    if (courseEnrollments.length === 0) {
                      return <p className="text-xs text-textSecondary py-4">No enrolled learners registered for this batch's course.</p>;
                    }

                    return courseEnrollments.map(enr => {
                      const student = students.find(s => s.id === enr.userId);
                      if (!student) return null;
                      const isChecked = !!attendanceRecords[student.id];

                      return (
                        <div key={enr.id} className="py-3 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                              {student.avatar || student.name[0]}
                            </div>
                            <div>
                              <strong className="text-textPrimary font-bold">{student.name}</strong>
                              <span className="text-[9px] text-textSecondary block">{student.email}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttendanceRecords(prev => ({
                              ...prev,
                              [student.id]: !isChecked
                            }))}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition ${
                              isChecked
                                ? 'bg-successGreen/5 border-successGreen/25 text-successGreen hover:bg-successGreen/15'
                                : 'bg-rose-500/5 border-rose-500/25 text-rose-500 hover:bg-rose-500/15'
                            }`}
                          >
                            {isChecked ? 'Present' : 'Absent'}
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-black hover:bg-primaryHover hover:shadow-glowPurple transition rounded-xl text-xs uppercase tracking-wider"
              >
                Log Class Attendance Report
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: PROFILE */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-borderLight pb-4">
              <h3 className="text-base font-extrabold heading flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Tutor Professional Profile
              </h3>
              <p className="text-xs text-textSecondary mt-1">Configure credentials bio details shown on student course listing catalog pages.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs text-textPrimary">
              <div className="border border-borderLight rounded-2xl p-5 space-y-4 shadow-soft">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-primary border-b border-borderLight pb-2">Credentials Details</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Full Display Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Professional Email</label>
                    <input
                      type="email"
                      required
                      disabled
                      value={profileForm.email}
                      className="glass-input bg-sectionBg border-borderLight/30 text-textSecondary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Profile Initials Avatar</label>
                    <input
                      type="text"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Specialty Designation Credentials</label>
                    <input
                      type="text"
                      value={profileForm.specialty}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, specialty: e.target.value }))}
                      placeholder="e.g. Senior Java Full Stack Architect"
                      className="glass-input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="font-bold text-textSecondary uppercase tracking-wide">Biographical Summary</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Enter credentials bio..."
                      rows={4}
                      className="glass-input resize-none font-sans"
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

      </main>
    </div>
  );
}
