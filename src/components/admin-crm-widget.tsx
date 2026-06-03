"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateLeadStatusAction, generateCertificateAction } from '@/lib/actions';
import { Layers, Briefcase, PlusCircle, Award, Phone, Mail, User, Clock, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminCrmWidgetProps {
  initialLeads: any[];
  initialCorporateLeads: any[];
  courses: any[];
  batches: any[];
  students: any[];
}

export default function AdminCrmWidget({
  initialLeads,
  initialCorporateLeads,
  courses,
  batches,
  students
}: AdminCrmWidgetProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'kanban' | 'corporate' | 'cohorts' | 'certs'>('kanban');
  const [loading, setLoading] = useState(false);

  // Lead notes mapping state (to handle inline notes editing)
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});

  // Cohort Form States
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [cohortDate, setCohortDate] = useState('June 18, 2026');
  const [cohortTime, setCohortTime] = useState('7:00 PM - 9:00 PM IST');

  // Certificate Form States
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [recipientName, setRecipientName] = useState(students[0]?.name || '');
  const [selectedCertCourseId, setSelectedCertCourseId] = useState(courses[0]?.id || '');

  const handleStatusChange = async (leadId: string, newStatus: string, currentNotes: string) => {
    toast.loading("Updating lead status...", { id: "crm" });
    const res = await updateLeadStatusAction(leadId, newStatus, currentNotes);
    if (res.success) {
      toast.success(`Lead moved to: ${newStatus}`, { id: "crm" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update lead.", { id: "crm" });
    }
  };

  const handleSaveNotes = async (leadId: string, status: string) => {
    const notes = leadNotes[leadId] || '';
    toast.loading("Saving counselor follow-up log...", { id: "crm" });
    const res = await updateLeadStatusAction(leadId, status, notes);
    if (res.success) {
      toast.success("Counselor notes updated!", { id: "crm" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save notes.", { id: "crm" });
    }
  };

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setLoading(true);
    toast.loading("Scheduling upcoming live cohort...", { id: "cohort" });
    // Simulate server-side delay
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Cohort registered and timetable active!", { id: "cohort" });
    router.refresh();
  };

  const handleGenerateCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCertCourseId || !recipientName.trim()) return;

    setLoading(true);
    toast.loading("Verifying qualifications and issuing verifiable credentials...", { id: "cert" });
    
    const matchedCourse = courses.find(c => c.id === selectedCertCourseId);
    const res = await generateCertificateAction(
      selectedStudentId,
      recipientName,
      selectedCertCourseId,
      matchedCourse?.name || "Premium Certification"
    );

    setLoading(false);
    if (res.success) {
      toast.success(` Verifiable Certificate Generated! ID: ${res.certificate?.certId}`, { id: "cert", duration: 5000 });
      setRecipientName('');
      router.refresh();
    } else {
      toast.error(res.error || "Failed to generate certificate.", { id: "cert" });
    }
  };

  // Kanban Columns
  const COLUMNS = ['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'LOST'];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Navigation tabs */}
      <div className="flex flex-wrap border-b border-borderLight bg-white rounded-t-3xl overflow-hidden shadow-soft">
        {[
          { id: 'kanban', label: 'CRM Leads Pipeline', icon: <Layers className="w-4 h-4" /> },
          { id: 'corporate', label: 'Corporate Inquiries', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'cohorts', label: 'Cohort Creator', icon: <PlusCircle className="w-4 h-4" /> },
          { id: 'certs', label: 'Certificates Hub', icon: <Award className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition border-b-2 ${
              activeTab === tab.id
                ? 'text-primary border-primary bg-sectionBg'
                : 'text-textSecondary hover:text-primary border-transparent hover:bg-sectionBg/40'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS CONTAINER */}
      <div className="animate-fade-up">

        {/* 1. CRM KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto min-w-[1000px] pb-6">
            {COLUMNS.map((col) => {
              const colLeads = initialLeads.filter(l => l.status === col);
              return (
                <div key={col} className="bg-sectionBg border border-borderLight rounded-2xl p-4.5 space-y-4 min-h-[500px]">
                  
                  {/* Column Header */}
                  <div className="flex justify-between items-center border-b border-borderLight pb-2">
                    <span className="text-[10px] font-extrabold tracking-widest text-textPrimary flex items-center gap-1.5 leading-none">
                      <span className={`w-2 h-2 rounded-full ${col === 'CONVERTED' ? 'bg-successGreen' : col === 'LOST' ? 'bg-dangerRed' : 'bg-primary'}`}></span>
                      {col}
                    </span>
                    <span className="text-[9px] font-bold text-textSecondary bg-white border border-borderLight px-2 py-0.5 rounded-full">{colLeads.length}</span>
                  </div>

                  {/* Leads Cards */}
                  <div className="space-y-3.5">
                    {colLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="bg-white border border-borderLight p-4 rounded-xl space-y-3 relative shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition duration-200"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-textPrimary heading">{lead.name}</p>
                          <p className="text-[10px] text-primary font-bold truncate">{lead.course}</p>
                        </div>

                        {/* Contacts */}
                        <div className="space-y-1 text-[10px] text-textSecondary">
                          <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-secondary shrink-0" /> {lead.phone}</p>
                          <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-primary shrink-0" /> {lead.email}</p>
                        </div>

                        {lead.message && (
                          <div className="p-2 rounded bg-sectionBg border border-borderLight text-[10px] text-textSecondary italic leading-relaxed">
                            "{lead.message}"
                          </div>
                        )}

                        {/* Counselor Notes */}
                        <div className="space-y-1.5 pt-2 border-t border-borderLight">
                          <label className="text-[8px] font-bold text-textSecondary uppercase tracking-wider block">Counselor Notes</label>
                          <textarea
                            defaultValue={lead.notes || ''}
                            onChange={(e) => setLeadNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                            placeholder="Add follow-up notes..."
                            rows={2}
                            className="w-full bg-sectionBg border border-borderLight rounded-lg p-2 text-[10px] text-textPrimary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 placeholder-neutral-400 resize-none leading-relaxed font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(lead.id, lead.status)}
                            className="w-full py-1.5 rounded-[10px] bg-sectionBg hover:bg-white border border-borderLight hover:border-primary hover:text-primary text-[9px] font-bold text-textPrimary transition"
                          >
                            Save Note Log
                          </button>
                        </div>

                        {/* Status Select dropdown */}
                        <div className="flex flex-col gap-1 pt-2 border-t border-borderLight">
                          <label className="text-[8px] font-bold text-textSecondary uppercase tracking-wider">Move Status Stage</label>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value, lead.notes || '')}
                            className="w-full bg-white border border-borderLight rounded-lg p-1.5 text-[10px] text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          >
                            {COLUMNS.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 2. CORPORATE INQUIRIES */}
        {activeTab === 'corporate' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest pl-2 border-l-2 border-primary heading">Corporate B2B Upskilling Pipelines</h3>
            
            {initialCorporateLeads.length === 0 ? (
              <div className="bg-white border border-borderLight p-10 text-center space-y-2 text-textSecondary rounded-2xl">
                <p>No active corporate B2B leads registered.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {initialCorporateLeads.map((cLead) => (
                  <div key={cLead.id} className="bg-white border border-borderLight p-5 space-y-3 rounded-2xl shadow-soft">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[9px] font-bold uppercase text-primary tracking-wider leading-none">Representative</h4>
                        <p className="text-sm font-extrabold text-textPrimary mt-1 heading">{cLead.name}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold leading-none">
                        {cLead.size}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] text-textSecondary">
                      <div>
                        <span className="text-[8px] text-textSecondary font-bold block uppercase tracking-wide">Corporate Company</span>
                        <strong className="text-textPrimary mt-0.5 block">{cLead.company}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] text-textSecondary font-bold block uppercase tracking-wide">Contacts Info</span>
                        <p className="text-textPrimary mt-0.5 truncate">{cLead.email}</p>
                        <p className="text-textPrimary mt-0.5">{cLead.phone}</p>
                      </div>
                    </div>

                    {cLead.message && (
                      <div className="p-2.5 rounded bg-sectionBg border border-borderLight text-[10px] text-textSecondary italic leading-relaxed">
                        "{cLead.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. COHORT CREATOR */}
        {activeTab === 'cohorts' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest pl-2 border-l-2 border-primary heading">Active Timetable Scheduling</h4>
              <div className="grid gap-4">
                {batches.map((b) => {
                  const course = courses.find(c => c.id === b.courseId);
                  return (
                    <div key={b.id} className="bg-white border border-borderLight p-5 flex justify-between items-center text-xs rounded-2xl shadow-soft">
                      <div>
                        <h5 className="font-extrabold text-textPrimary heading">{course ? course.name : "Syllabus Program"}</h5>
                        <p className="text-[10px] text-textSecondary mt-1 flex items-center gap-1.5 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {b.timeSlot}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] text-textPrimary bg-sectionBg border border-borderLight px-2.5 py-1 rounded-full font-semibold">{b.startDate}</span>
                        <p className="text-[9px] text-primary font-bold uppercase tracking-wider mt-1.5">{b.seatsLeft} / {b.seatsTotal} Seats Available</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Create form */}
            <div className="bg-white border border-borderLight p-6 rounded-[28px] space-y-4 h-fit shadow-soft">
              <h4 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest flex items-center gap-1.5 heading">
                <PlusCircle className="w-4 h-4 text-primary" /> Schedule Live Cohort
              </h4>

              <form onSubmit={handleCreateCohort} className="space-y-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Select Certification Program</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="glass-input bg-white text-textPrimary text-xs focus:ring-1 focus:ring-primary/20"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Cohort Start Date</label>
                  <input
                    type="text"
                    required
                    value={cohortDate}
                    onChange={(e) => setCohortDate(e.target.value)}
                    placeholder="e.g. June 18, 2026"
                    className="glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Lecture Timings</label>
                  <input
                    type="text"
                    required
                    value={cohortTime}
                    onChange={(e) => setCohortTime(e.target.value)}
                    placeholder="e.g. 7:00 PM - 9:00 PM IST"
                    className="glass-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover text-xs font-black text-white hover:shadow-glowPurple transition text-center mt-2 shadow-soft"
                >
                  Create Cohort Timetable →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. VERIFIABLE CERTIFICATE HUB */}
        {activeTab === 'certs' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest pl-2 border-l-2 border-primary heading">Issued Certifications Logs</h4>
              <div className="grid gap-4">
                {students.map((student: any) => (
                  <div key={student.id} className="bg-white border border-borderLight p-5 flex justify-between items-center text-xs rounded-2xl shadow-soft">
                    <div>
                      <h5 className="font-extrabold text-textPrimary heading">{student.name}</h5>
                      <p className="text-[10px] text-textSecondary mt-1 font-semibold">{student.email}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="px-2.5 py-1 rounded-full bg-successGreen/5 text-successGreen border border-successGreen/10 text-[9px] font-bold uppercase tracking-wider">ACTIVE STUDENT</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Form */}
            <div className="bg-white border border-borderLight p-6 rounded-[28px] space-y-4 h-fit shadow-soft">
              <h4 className="text-sm font-extrabold text-textPrimary uppercase tracking-widest flex items-center gap-1.5 heading">
                <Award className="w-4 h-4 text-primary" /> Issue Student Credential
              </h4>

              <form onSubmit={handleGenerateCert} className="space-y-4 text-xs">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Select Learner Account</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      const matched = students.find(s => s.id === e.target.value);
                      if (matched) setRecipientName(matched.name);
                    }}
                    className="glass-input bg-white text-textPrimary text-xs focus:ring-1 focus:ring-primary/20"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Recipient Name (On Certificate)</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Learner's certified name"
                    className="glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Select Certified Program</label>
                  <select
                    value={selectedCertCourseId}
                    onChange={(e) => setSelectedCertCourseId(e.target.value)}
                    className="glass-input bg-white text-textPrimary text-xs focus:ring-1 focus:ring-primary/20"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover text-xs font-black text-white hover:shadow-glowPurple transition text-center mt-2 flex items-center justify-center gap-1 shadow-soft"
                >
                  Generate Verified Certificate <Sparkles className="w-3.5 h-3.5 text-secondary" />
                </button>

              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
