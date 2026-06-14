"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle, FileText, ArrowRight, CheckCircle2, ChevronRight, Paperclip, UploadCloud, File, Calendar, Award, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import { getAIChatResponseAction, analyzeResumeAction } from '@/lib/actions';
import toast from 'react-hot-toast';
import LoadingSpinner from './loading-spinner';

interface Message {
  id: string;
  sender: 'auri' | 'user';
  text: string;
  quickActions?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  text?: string;
}

export default function AuriChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'auri',
      text: "Hello! I am Auri, your personal AI Career Counselor. I can recommend the perfect course for you, analyze your resume to highlight technical skill gaps, or help you generate an interactive career roadmap. Choose an option below to start!",
      quickActions: ['Recommend Courses', 'Analyze Resume', 'Career Roadmap', 'Book Free Counseling']
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'resume'>('chat');

  // Resume Diagnostics AI Tab States
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Split Input & File upload states for diagnostics tab
  const [diagFile, setDiagFile] = useState<any>(null); // { name, size, status, text, error }
  const [diagDragActive, setDiagDragActive] = useState(false);

  // Counselor Discovery Form States (No Resume Mode)
  const [isCounselorMode, setIsCounselorMode] = useState(false);
  const [counselorStep, setCounselorStep] = useState(1); // Steps 1, 2, 3
  const [counselorForm, setCounselorForm] = useState({
    name: '',
    experienceLevel: 'Entry Level / Fresher',
    education: '',
    currentRole: '',
    careerGoal: '',
    preferredTech: '',
    interestedDomain: 'Full Stack Development'
  });

  // Report dashboard active section tab
  const [activeReportTab, setActiveReportTab] = useState<'profile' | 'gaps' | 'courses' | 'roadmap'>('profile');

  // File Upload states for general chat turn
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diagFileInputRef = useRef<HTMLInputElement>(null);

  const [diagStatusStep, setDiagStatusStep] = useState<number>(0);
  const [viewingFileText, setViewingFileText] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const renderVisibleFileCard = (file: any, isDiag: boolean = false) => {
    if (!file) return null;
    const isUploading = file.status === 'uploading';
    const isError = file.status === 'error';
    const isSuccess = file.status === 'success';
    const displaySize = file.size ? formatSize(file.size) : '0 KB';
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toUpperCase().replace('.', '');
    
    return (
      <div 
        key={file.id || 'diag-file'}
        className={`p-3.5 rounded-2xl border flex flex-col gap-2 shadow-soft transition relative overflow-hidden ${
          isError 
            ? 'bg-red-50/50 border-red-200 text-red-600' 
            : isUploading 
              ? 'bg-neutral-50/50 border-neutral-200 text-neutral-500 animate-pulse' 
              : 'bg-primary/5 border-primary/20 text-primary'
        }`}
      >
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 shrink-0 text-primary" />
            <div className="min-w-0 space-y-0.5">
              <p className="text-[10px] font-black text-textPrimary truncate max-w-[150px]" title={file.name}>
                {file.name}
              </p>
              <span className="text-[8px] text-neutral-400 block font-bold uppercase tracking-wider">
                {fileExt} • {displaySize}
              </span>
            </div>
          </div>

          {!isUploading && (
            <div className="flex items-center gap-1.5 shrink-0">
              {isSuccess && file.text && (
                <button
                  type="button"
                  onClick={() => setViewingFileText(file.text)}
                  className="text-[8px] font-black uppercase tracking-wider text-primary hover:text-primaryHover bg-white border border-primary/20 px-1.5 py-0.5 rounded shadow-soft transition"
                >
                  View File
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (isDiag) {
                    setDiagFile(null);
                    setResumeText('');
                    setAnalysisResult(null);
                  } else {
                    removeFile(file.id);
                  }
                }}
                className="text-[8px] font-black uppercase tracking-wider text-neutral-400 hover:text-red-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded shadow-soft transition"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[8px] font-bold border-t border-neutral-200/50 pt-1.5">
          {isUploading ? (
            <>
              <span className="h-2.5 w-2.5 rounded-full border border-primary border-t-transparent animate-spin shrink-0"></span>
              <span className="text-neutral-500">Uploading & Parsing Document...</span>
            </>
          ) : isError ? (
            <>
              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
              <span className="text-red-500 truncate text-[8px]" title={file.error || 'Parsing failed.'}>
                Failed to parse file: {file.error || 'Unable to extract content.'}
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
              <span className="text-green-600">✓ Uploaded Successfully</span>
            </>
          )}
        </div>
      </div>
    );
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll chatbot to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, uploadedFiles]);

  // Hook global navbar actions
  useEffect(() => {
    const triggerResume = () => {
      setActiveTab('resume');
      setIsOpen(true);
    };
    window.addEventListener('auri-open-resume', triggerResume);
    return () => {
      window.removeEventListener('auri-open-resume', triggerResume);
    };
  }, []);

  // Main Chat Tab file uploads
  const handleFilesUpload = async (files: File[]) => {
    const supportedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    
    for (const file of files) {
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!supportedExtensions.includes(extension)) {
        toast.error(`Unsupported format: ${file.name}. Supports PDF, Word, RTF, or Text.`);
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large (Max 5MB): ${file.name}`);
        continue;
      }

      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newFileObj: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: extension,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFileObj]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/parse-document', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUploadedFiles(prev =>
            prev.map(f => (f.id === fileId ? { ...f, status: 'success', text: data.text } : f))
          );
          toast.success(`Uploaded & parsed ${file.name}`);
        } else {
          setUploadedFiles(prev =>
            prev.map(f => (f.id === fileId ? { ...f, status: 'error', error: data.error || 'Failed to extract text.' } : f))
          );
          toast.error(`Failed to parse ${file.name}: ${data.error || 'Check file structure.'}`);
        }
      } catch (err) {
        console.error('File parsing fetch error:', err);
        setUploadedFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, status: 'error', error: 'Network error.' } : f))
        );
        toast.error(`Network error uploading ${file.name}`);
      }
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(Array.from(e.dataTransfer.files));
    }
  };

  // Chat send action
  const handleSend = async (text: string) => {
    if (!text.trim() && uploadedFiles.every(f => f.status !== 'success')) return;
    
    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: text || `Analyze attached documents: ${uploadedFiles.map(f => f.name).join(', ')}`
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    if (text === 'Analyze Resume') {
      setIsTyping(false);
      setActiveTab('resume');
      return;
    }

    if (text === 'Book Free Counseling') {
      setIsTyping(false);
      window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { source: 'Auri Chatbot Prompt' } }));
      return;
    }

    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      text: msg.text
    }));

    const documentContext = uploadedFiles
      .filter(f => f.status === 'success' && f.text)
      .map(f => `[Document Content: ${f.name}]\n${f.text}`)
      .join('\n\n');

    try {
      const res = await getAIChatResponseAction(text, history, documentContext);
      if (res && res.text) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-a`,
            sender: 'auri',
            text: res.text,
            quickActions: res.quickActions
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-a`,
            sender: 'auri',
            text: "I'm sorry, I'm having trouble retrieving a response right now. Please try again."
          }
        ]);
      }
    } catch (err) {
      console.error("Chat response server action failed:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-a`,
          sender: 'auri',
          text: "I encountered a connection issue. Please refresh the page and try again."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // === RESUME DIAGNOSTICS UPLOAD AND ANALYTICS LOGIC ===
  const handleDiagFileUpload = async (file: File) => {
    const supportedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!supportedExtensions.includes(extension)) {
      toast.error(`Unsupported format: ${file.name}. Supports PDF, DOC, DOCX, TXT, or RTF.`);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File too large (Max 5MB)`);
      return;
    }

    setDiagFile({ name: file.name, size: file.size, status: 'uploading' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDiagFile({ name: file.name, size: file.size, status: 'success', text: data.text });
        setResumeText(data.text);
        toast.success(`Uploaded & parsed ${file.name}`);
      } else {
        setDiagFile({ name: file.name, size: file.size, status: 'error', error: data.error });
        toast.error(`Failed to parse file: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setDiagFile({ name: file.name, size: file.size, status: 'error', error: 'Network error.' });
      toast.error(`Network error uploading file.`);
    }
  };

  const handleDiagDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDiagDragActive(true);
  };

  const handleDiagDragLeave = () => {
    setDiagDragActive(false);
  };

  const handleDiagDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDiagDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDiagFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResumeSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let textToSubmit = resumeText;
    let fileName = diagFile?.name || '';
    let profile = null;

    if (isCounselorMode) {
      // Step validation checks
      if (counselorStep === 1) {
        if (!counselorForm.name.trim() || !counselorForm.education.trim()) {
          toast.error("Please fill in Name and Education details.");
          return;
        }
        setCounselorStep(2);
        return;
      }
      if (counselorStep === 2) {
        if (!counselorForm.currentRole.trim() || !counselorForm.careerGoal.trim()) {
          toast.error("Please fill in Job Role and Career Goal.");
          return;
        }
        setCounselorStep(3);
        return;
      }
      // Step 3 submission
      profile = counselorForm;
      textToSubmit = '';
    } else {
      // Validate that at least one of upload file or paste text is provided (FEATURE 8 Fix)
      const hasText = resumeText.trim().length > 10;
      const hasSuccessFile = diagFile && diagFile.status === 'success' && diagFile.text;
      
      if (!hasText && !hasSuccessFile) {
        toast.error("Please upload a resume, paste your resume, or start Career Counselor Mode.");
        return;
      }
      if (hasSuccessFile && !textToSubmit) {
        textToSubmit = diagFile.text;
      }
    }

    setParsing(true);
    setAnalysisResult(null);
    setDiagStatusStep(0);

    try {
      // Start sequential progression for the first few steps
      const progressPromise = (async () => {
        // Step 0: Uploading (0 - 350ms)
        await new Promise(r => setTimeout(r, 350));
        setDiagStatusStep(1); // Parsing Resume... (350 - 700ms)
        await new Promise(r => setTimeout(r, 350));
        setDiagStatusStep(2); // Analyzing Skills... (700 - 1050ms)
        await new Promise(r => setTimeout(r, 350));
        setDiagStatusStep(3); // Generating Recommendations... (1050ms+)
      })();

      const [result] = await Promise.all([
        analyzeResumeAction(textToSubmit, fileName, profile),
        progressPromise
      ]);

      // Complete!
      setDiagStatusStep(4); // Analysis Complete
      await new Promise(r => setTimeout(r, 250)); // small delay for UX satisfaction

      if (result) {
        setAnalysisResult(result);
        setActiveReportTab('profile'); // Reset active tab in result dashboard
        toast.success("Profile Diagnostics Complete!");
      } else {
        toast.error("Diagnostics failed. Please check your connection.");
      }
    } catch (err) {
      console.error("Diagnostics server action failed:", err);
      toast.error("An error occurred during resume diagnostics.");
    } finally {
      setParsing(false);
    }
  };

  const triggerDirectCounseling = (courseName: string) => {
    window.dispatchEvent(new CustomEvent('open-lead-modal', { 
      detail: { 
        source: 'Auri Resume Analyzer Recommendation',
        prefilledCourse: courseName 
      } 
    }));
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    let report = `==================================================
AURENZA ACADEMY - PROFILE DIAGNOSTICS & LEARNING ROADMAP
==================================================

CANDIDATE SUMMARY
-----------------
Name: ${analysisResult.name || 'Extracted Candidate'}
Domain: ${analysisResult.detectedDomain || 'Not specified'}
Experience Level: ${analysisResult.experienceLevel || 'Not specified'}
Education: ${analysisResult.education || 'Not specified'}
Current Role: ${counselorForm.currentRole || 'Not specified'}

RESUME SCORE ANALYSIS
---------------------
Overall Score: ${analysisResult.resumeScore?.total || 78}/100
- Skills score: ${analysisResult.resumeScore?.skills || 23}/30
- Projects score: ${analysisResult.resumeScore?.projects || 15}/20
- Experience score: ${analysisResult.resumeScore?.experience || 18}/20
- Certifications score: ${analysisResult.resumeScore?.certifications || 12}/15
- ATS Readiness score: ${analysisResult.resumeScore?.atsReadiness || 10}/15

ATS COMPATIBILITY ANALYSIS
--------------------------
ATS Score: ${analysisResult.atsAnalysis?.score || 82}%
Missing Keywords: ${(analysisResult.atsAnalysis?.missingKeywords || []).join(', ')}
Weak Sections: ${(analysisResult.atsAnalysis?.weakSections || []).join(', ')}
Formatting Issues: ${(analysisResult.atsAnalysis?.formattingIssues || []).join(', ')}
Suggestions for Improvement:
${(analysisResult.atsAnalysis?.suggestions || []).map((s: string) => `- ${s}`).join('\r\n')}

DIAGNOSTICS CONFIDENCE
----------------------
Confidence Score: ${analysisResult.confidenceScore || 85}%
Reason: ${analysisResult.confidenceReason || 'Based on input criteria.'}

LEARNING PATH PROGRESSION
-------------------------
Path Phase: ${analysisResult.learningPathPhase || 'Beginner → Intermediate → Advanced → Job Ready'}

RECOMMENDED UPSKILLING COURSES
------------------------------
${(() => {
  const p1 = analysisResult.priorityCourses?.priority1 || [];
  const p2 = analysisResult.priorityCourses?.priority2 || [];
  const p3 = analysisResult.priorityCourses?.priority3 || [];
  const fallback = analysisResult.recommendedCourses || [];
  
  let text = '';
  const mapName = (cid: string) => {
    if (cid === 'course-java') return "Java Full Stack Development";
    if (cid === 'course-frontend') return "Frontend Development (React & Next.js)";
    if (cid === 'course-aiml') return "AI & Machine Learning Engineering";
    if (cid === 'course-aws') return "AWS Solutions Architect";
    if (cid === 'course-azure') return "Microsoft Azure Administrator";
    if (cid === 'course-devops') return "DevOps Engineer Program";
    if (cid === 'course-microsoft-power-bi') return "Microsoft Power BI";
    if (cid === 'course-dsai') return "Data Science & AI Bootcamp";
    if (cid === 'course-csm') return "Certified ScrumMaster (CSM)";
    if (cid === 'course-pmp') return "PMP Certification";
    return "Aurenza Course";
  };
  
  if (p1.length > 0) text += `Priority 1 (Must Learn):\r\n${p1.map((c: string) => `- ${mapName(c)} (${c})`).join('\r\n')}\r\n\r\n`;
  if (p2.length > 0) text += `Priority 2 (Recommended):\r\n${p2.map((c: string) => `- ${mapName(c)} (${c})`).join('\r\n')}\r\n\r\n`;
  if (p3.length > 0) text += `Priority 3 (Optional):\r\n${p3.map((c: string) => `- ${mapName(c)} (${c})`).join('\r\n')}\r\n\r\n`;
  
  if (!text && fallback.length > 0) {
    text += `Recommended courses:\r\n${fallback.map((c: string) => `- ${mapName(c)} (${c})`).join('\r\n')}\r\n\r\n`;
  }
  return text || 'No matching programs.\r\n';
})()}
LEARNING ROADMAP MILESTONES
---------------------------
Month 1 (Days 1-30):
${(analysisResult.roadmap30 || []).map((step: string) => `- ${step}`).join('\r\n')}

Month 2 (Days 31-60):
${(analysisResult.roadmap60 || []).map((step: string) => `- ${step}`).join('\r\n')}

Month 3 (Days 61-90):
${(analysisResult.roadmap90 || []).map((step: string) => `- ${step}`).join('\r\n')}

==================================================
For career support, hotline support, and callback scheduling, contact:
📞 Hotline: +91 70130 57827
✉️ Support Email: info@aurenzaacademy.com
📍 Head Office: Gajuwaka, Visakhapatnam, India
==================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Aurenza_Career_Roadmap.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Skill Gap Report downloaded successfully!");
  };

  return (
    <div className="font-sans">
      
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-premium hover:scale-105 active:scale-95 transition-all duration-300 border border-white/10 hover:shadow-glowPurple bg-gradient-to-r from-primary to-secondary"
          title="Chat with Auri AI"
        >
          <Bot className="w-6 h-6 animate-float" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* 2. CHAT OVERLAY BOX CONTAINER */}
      {isOpen && (
        <div 
          onDragOver={activeTab === 'chat' ? handleDragOver : undefined}
          onDragLeave={activeTab === 'chat' ? handleDragLeave : undefined}
          onDrop={activeTab === 'chat' ? handleDrop : undefined}
          className="floating-chatbot border border-borderLight shadow-2xl bg-white flex flex-col relative animate-fade-up"
        >
          
          {/* Main Chat Drag & Drop Overlay */}
          {isDragging && activeTab === 'chat' && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] border-2 border-dashed border-primary z-40 flex flex-col items-center justify-center pointer-events-none">
              <UploadCloud className="w-12 h-12 text-primary animate-bounce" />
              <p className="text-sm font-black text-primary mt-2 heading">Drop Files Here</p>
              <p className="text-[10px] text-textSecondary mt-0.5">Supports PDF, Word, RTF, or Text</p>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary px-4.5 py-4 border-b border-borderLight flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/15 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold leading-none flex items-center gap-1.5 heading">
                  Auri AI Counselor
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                </h4>
                <p className="text-[10px] text-green-200 font-bold mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300"></span> Online Help Active
                </p>
              </div>
            </div>
            
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Tab menu */}
          <div className="flex border-b border-borderLight bg-sectionBg">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary bg-white' : 'text-textSecondary hover:text-primary'}`}
            >
              Counsellor Chat
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition ${activeTab === 'resume' ? 'text-primary border-b-2 border-primary bg-white' : 'text-textSecondary hover:text-primary'}`}
            >
              Resume Diagnostics AI
            </button>
          </div>

          {/* 3. ACTIVE TAB CONTENTS PANEL */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] min-h-[340px] bg-white">
            
            {activeTab === 'chat' ? (
              <>
                {/* Messages Loop */}
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div 
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap markdown-body ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-none font-medium' 
                          : 'bg-sectionBg border border-borderLight text-textPrimary rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Quick actions buttons mapping */}
                    {msg.sender === 'auri' && msg.quickActions && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-1">
                        {msg.quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(action)}
                            className="px-3 py-1.5 rounded-full bg-white border border-borderLight hover:border-primary hover:bg-primary/5 text-[10px] font-bold text-textSecondary hover:text-primary transition shadow-soft"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 bg-sectionBg border border-borderLight px-4 py-2.5 rounded-2xl rounded-bl-none max-w-[100px] justify-center animate-pulse">
                    <LoadingSpinner size="xs" />
                    <span className="text-[10px] font-extrabold text-primary">Auri...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            ) : (
              /* === RESUME DIAGNOSTICS AI TAB === */
              <div className="space-y-4 text-textSecondary animate-fade-up">
                
                {analysisResult ? (
                  /* DIAGNOSTICS COMPLETED RESULTS VIEW (FEATURE 7 Tabbed Report Cards) */
                  <div className="space-y-4">
                    {diagFile && renderVisibleFileCard(diagFile, true)}
                    <div className="p-3 bg-successGreen/5 border border-successGreen/20 rounded-2xl flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-successGreen shrink-0" />
                      <span className="text-xs font-bold text-successGreen">Screening diagnostics parsed successfully.</span>
                    </div>

                    {/* Dashboard Tab Menu */}
                    <div className="flex gap-1 border-b border-borderLight pb-2 overflow-x-auto scrollbar-none select-none">
                      {[
                        { id: 'profile', label: 'Summary' },
                        { id: 'gaps', label: 'Skill Gaps' },
                        { id: 'courses', label: 'Course Match' },
                        { id: 'roadmap', label: 'Timeline' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveReportTab(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition shrink-0 ${
                            activeReportTab === tab.id
                              ? 'bg-primary text-white shadow-soft'
                              : 'bg-sectionBg text-textSecondary hover:bg-neutral-100 hover:text-textPrimary'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Report Panels */}
                    {activeReportTab === 'profile' && (
                      <div className="space-y-4 animate-fade-up">
                        {/* Summary Card */}
                        <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-3 shadow-soft">
                          <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                            <GraduationCap className="w-4 h-4 text-primary" /> Candidate Summary
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="text-neutral-400 font-bold block">Name</span>
                              <strong className="text-textPrimary">{analysisResult.name || 'Extracted Candidate'}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 font-bold block">Experience</span>
                              <strong className="text-textPrimary">{analysisResult.experienceLevel || 'Entry Level'}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 font-bold block">Education</span>
                              <strong className="text-textPrimary">{analysisResult.education || 'Undergraduate'}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 font-bold block">Domain Focus</span>
                              <strong className="text-textPrimary truncate block">{analysisResult.detectedDomain || 'Software Eng.'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Learning Path Phase Visualization */}
                        {analysisResult.learningPathPhase && (
                          <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-2 shadow-soft">
                            <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Learning Path Phase
                            </h5>
                            <div className="text-[10px] text-textSecondary font-medium leading-relaxed bg-white border border-borderLight px-3 py-2.5 rounded-xl flex items-center justify-between flex-wrap gap-2">
                              {analysisResult.learningPathPhase.split('→').map((phase: string, idx: number, arr: any[]) => (
                                <React.Fragment key={idx}>
                                  <div className="flex items-center gap-1">
                                    <span className={`h-1.5 w-1.5 rounded-full ${idx === arr.length - 1 ? 'bg-green-500 animate-ping' : 'bg-primary'}`}></span>
                                    <span className="font-extrabold text-textPrimary">{phase.trim()}</span>
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <ChevronRight className="w-3 h-3 text-neutral-300 shrink-0" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resume Score Card with Breakdown */}
                        {analysisResult.resumeScore && (
                          <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-3 shadow-soft">
                            <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                              <Briefcase className="w-4 h-4 text-primary" /> Resume Score
                            </h5>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shrink-0 shadow-soft">
                                <span className="text-base font-black leading-none">{analysisResult.resumeScore.total}</span>
                                <span className="text-[7px] font-bold uppercase tracking-wider mt-0.5 opacity-80">Score</span>
                              </div>
                              <div className="flex-1 space-y-1.5 text-[9px]">
                                {[
                                  { label: "Skills", val: analysisResult.resumeScore.skills, max: 30 },
                                  { label: "Projects", val: analysisResult.resumeScore.projects, max: 20 },
                                  { label: "Experience", val: analysisResult.resumeScore.experience, max: 20 },
                                  { label: "Certifications", val: analysisResult.resumeScore.certifications, max: 15 },
                                  { label: "ATS Readiness", val: analysisResult.resumeScore.atsReadiness, max: 15 }
                                ].map((item, idx) => (
                                  <div key={idx} className="space-y-0.5">
                                    <div className="flex justify-between font-bold text-textSecondary">
                                      <span>{item.label}</span>
                                      <span>{item.val}/{item.max}</span>
                                    </div>
                                    <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${(item.val / item.max) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ATS Compatibility Analysis Card */}
                        {analysisResult.atsAnalysis && (
                          <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-3 shadow-soft">
                            <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                              <AlertCircle className="w-4 h-4 text-primary" /> ATS Compatibility
                            </h5>
                            <div className="space-y-2.5 text-[10px]">
                              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-borderLight">
                                <span className="font-bold text-textSecondary">ATS Score</span>
                                <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-black">{analysisResult.atsAnalysis.score}%</span>
                              </div>
                              {analysisResult.atsAnalysis.missingKeywords && analysisResult.atsAnalysis.missingKeywords.length > 0 && (
                                <div>
                                  <span className="text-neutral-400 font-bold block mb-1">Missing Keywords</span>
                                  <div className="flex flex-wrap gap-1">
                                    {analysisResult.atsAnalysis.missingKeywords.map((kw: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 rounded bg-red-50 text-red-500 text-[9px] font-bold border border-red-100">{kw}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {analysisResult.atsAnalysis.suggestions && analysisResult.atsAnalysis.suggestions.length > 0 && (
                                <div>
                                  <span className="text-neutral-400 font-bold block mb-1">ATS Optimization Suggestions</span>
                                  <ul className="list-disc list-inside space-y-1 text-textSecondary leading-normal">
                                    {analysisResult.atsAnalysis.suggestions.map((sug: string, i: number) => (
                                      <li key={i}>{sug}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Confidence Score Card */}
                        {analysisResult.confidenceScore !== undefined && (
                          <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-2 shadow-soft">
                            <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                              <CheckCircle2 className="w-4 h-4 text-primary" /> Diagnostics Confidence
                            </h5>
                            <div className="space-y-1.5 text-[10px]">
                              <div className="flex justify-between font-bold text-textSecondary">
                                <span>Confidence Rating</span>
                                <span>{analysisResult.confidenceScore}%</span>
                              </div>
                              <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-secondary" 
                                  style={{ width: `${analysisResult.confidenceScore}%` }}
                                ></div>
                              </div>
                              <p className="text-[9px] text-textSecondary leading-normal pt-1 italic">{analysisResult.confidenceReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Projects & Tools Card */}
                        <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-3 shadow-soft">
                          <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                            <Code2 className="w-4 h-4 text-primary" /> Stack & Projects
                          </h5>
                          <div className="space-y-2 text-[10px]">
                            {analysisResult.projects && analysisResult.projects.length > 0 && (
                              <div>
                                <span className="text-neutral-400 font-bold block mb-0.5">Projects Profile</span>
                                <ul className="list-disc list-inside space-y-0.5 text-textPrimary">
                                  {analysisResult.projects.map((p: string, idx: number) => (
                                    <li key={idx} className="truncate">{p}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {analysisResult.tools && analysisResult.tools.length > 0 && (
                              <div>
                                <span className="text-neutral-400 font-bold block mb-1">Developer Tools</span>
                                <div className="flex flex-wrap gap-1">
                                  {analysisResult.tools.map((t: string, idx: number) => (
                                    <span key={idx} className="px-2 py-0.5 rounded bg-neutral-200/60 text-textSecondary text-[9px] font-bold border border-neutral-300/30">{t}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1 bg-primary/5 p-3 rounded-2xl border border-primary/10">
                          <span className="text-[9px] font-black uppercase text-primary tracking-widest block">Senior Career Consultant Tip</span>
                          <p className="text-[10px] text-textSecondary leading-relaxed">{analysisResult.improvementSuggestion}</p>
                        </div>
                      </div>
                    )}

                    {activeReportTab === 'gaps' && (
                      <div className="space-y-3.5 animate-fade-up">
                        {/* Detected Skills */}
                        <div className="bg-successGreen/5 border border-successGreen/10 p-4 rounded-2xl space-y-2.5 shadow-soft">
                          <h5 className="text-xs font-black text-successGreen uppercase tracking-widest flex items-center gap-1.5 border-b border-successGreen/10 pb-1.5 leading-none">
                            <CheckCircle2 className="w-4 h-4 text-successGreen" /> Current Skills
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.detectedSkills.map((s: string, idx: number) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-successGreen/10 text-successGreen border border-successGreen/20 text-[9px] font-black uppercase tracking-wider">{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Skills Gap Card */}
                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl space-y-2.5 shadow-soft">
                          <h5 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-primary/10 pb-1.5 leading-none">
                            <AlertCircle className="w-4 h-4 text-primary" /> Target Skill Gaps
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.skillGaps.map((s: string, idx: number) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-wider">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeReportTab === 'courses' && (
                      <div className="space-y-4 animate-fade-up">
                        {analysisResult.bestMatch ? (
                          <>
                            {/* Best Match Card */}
                            <div className="bg-sectionBg border-2 border-primary/40 p-4.5 rounded-2xl space-y-3.5 shadow-soft relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                              {/* Background glow decorator */}
                              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>

                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <span className="bg-primary/15 text-primary text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-primary/20 inline-block">
                                    🎯 Best Match
                                  </span>
                                  <h4 className="text-xs font-black text-textPrimary leading-tight heading">
                                    {analysisResult.bestMatch.courseName}
                                  </h4>
                                </div>
                                <div className="bg-primary text-white px-2 py-1 rounded-xl text-center shrink-0 border border-primary/20 shadow-soft">
                                  <span className="text-[8px] font-bold block text-white/80 uppercase tracking-wide leading-none mb-0.5">Match</span>
                                  <strong className="text-xs font-black leading-none">{analysisResult.bestMatch.suitabilityScore}%</strong>
                                </div>
                              </div>

                              <div className="space-y-3.5 text-[10px] leading-relaxed border-t border-neutral-200/50 pt-3">
                                <p className="text-textSecondary">
                                  <strong className="text-textPrimary font-bold block mb-0.5">Why Recommended:</strong>
                                  {analysisResult.bestMatch.whyRecommended}
                                </p>

                                <div className="grid grid-cols-2 gap-3 bg-white/60 p-2 rounded-xl border border-neutral-200/30">
                                  <div>
                                    <span className="text-neutral-400 font-bold block text-[8px] uppercase tracking-wider">Target Roles</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {analysisResult.bestMatch.possibleJobRoles?.map((role: string, i: number) => (
                                        <span key={i} className="bg-neutral-100 text-neutral-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-neutral-200/40">
                                          {role}
                                        </span>
                                      )) || <strong className="text-textPrimary font-extrabold block">N/A</strong>}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-bold block text-[8px] uppercase tracking-wider">Expected Salary</span>
                                    <strong className="text-green-600 font-black text-xs block mt-1">
                                      {analysisResult.bestMatch.expectedSalary}
                                    </strong>
                                  </div>
                                </div>

                                {analysisResult.bestMatch.learningPath && analysisResult.bestMatch.learningPath.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-neutral-400 font-bold block text-[8px] uppercase tracking-wider">Sequential Learning Path</span>
                                    <div className="space-y-1 pl-2 border-l border-primary/20 ml-1">
                                      {analysisResult.bestMatch.learningPath.map((step: string, idx: number) => (
                                        <div key={idx} className="flex gap-1.5 items-start text-[9px] text-textSecondary">
                                          <span className="text-primary font-bold">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => triggerDirectCounseling(analysisResult.bestMatch.courseName)}
                                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primaryHover transition text-center text-[10px] font-black text-white flex items-center justify-center gap-1 shadow-soft hover:shadow-glowPurple"
                              >
                                Book Counseling Program <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Alternative Matches List */}
                            {analysisResult.rankedAlternatives && analysisResult.rankedAlternatives.length > 0 && (
                              <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-3 shadow-soft">
                                <h5 className="text-[10px] font-black text-textPrimary uppercase tracking-wider flex items-center gap-1 border-b border-borderLight pb-1.5 leading-none">
                                  📊 Other Relevant Courses
                                </h5>
                                <div className="space-y-1.5">
                                  {analysisResult.rankedAlternatives.map((alt: any) => (
                                    <div 
                                      key={alt.courseId} 
                                      onClick={() => triggerDirectCounseling(alt.courseName)}
                                      className="flex items-center justify-between p-2 bg-white hover:bg-neutral-50 border border-neutral-200/50 rounded-xl transition cursor-pointer group"
                                    >
                                      <div className="flex-1 min-w-0 pr-3">
                                        <h6 className="text-[9px] font-bold text-textPrimary group-hover:text-primary transition truncate">
                                          {alt.courseName}
                                        </h6>
                                        <span className="text-[8px] text-neutral-400">ID: {alt.courseId}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 shrink-0">
                                        <div className="w-16 bg-neutral-100 rounded-full h-1.5 overflow-hidden border border-neutral-200/30">
                                          <div 
                                            className="bg-primary h-full rounded-full" 
                                            style={{ width: `${alt.suitabilityScore}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-[8px] font-black text-neutral-600 w-8 text-right">
                                          {alt.suitabilityScore}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          /* Fallback rendering logic if bestMatch is not available */
                          (() => {
                            const renderCourseCard = (courseId: string, priorityLabel: string, priorityColor: string) => {
                              let courseName = courseId.replace('course-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                              if (courseId === 'course-java') courseName = "Java Full Stack Development";
                              if (courseId === 'course-frontend') courseName = "Frontend Development (React & Next.js)";
                              if (courseId === 'course-aiml') courseName = "AI & Machine Learning Engineering";
                              
                              let salaryRange = "INR 5-9 LPA";
                              let jobRoles = "Associate Software Engineer";
                              let reason = "This course covers foundational skills relevant to your target domain.";

                              if (courseId === 'course-java') {
                                salaryRange = "INR 6-12 LPA";
                                jobRoles = "Backend Engineer, Full Stack Developer, Java Consultant";
                                reason = "Enterprise-level microservices and React integration. Bridges missing spring boot, database, and system architecture skills.";
                              } else if (courseId === 'course-frontend') {
                                salaryRange = "INR 5-10 LPA";
                                jobRoles = "Frontend Developer, UI Specialist, React Engineer";
                                reason = "Advanced client-side rendering with React/Next.js. Bridges missing component styling and responsive layouts.";
                              } else if (courseId === 'course-aiml') {
                                salaryRange = "INR 8-15 LPA";
                                jobRoles = "AI Engineer, Machine Learning Developer, Data Architect";
                                reason = "Deep learning and NLP fine-tuning structures. Bridges missing PyTorch, MLOps, and model scaling skills.";
                              }

                              return (
                                <div key={courseId} className="bg-sectionBg border border-borderLight p-4 rounded-2xl space-y-2.5 shadow-soft">
                                  <div className="flex justify-between items-center">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${priorityColor}`}>
                                      {priorityLabel}
                                    </span>
                                    <span className="text-[9px] font-bold text-neutral-400">ID: {courseId}</span>
                                  </div>
                                  <h5 className="text-xs font-black text-textPrimary leading-tight heading border-b border-borderLight pb-1.5 flex items-center gap-1.5">
                                    <Award className="w-4.5 h-4.5 text-primary shrink-0" />
                                    {courseName}
                                  </h5>
                                  <div className="space-y-2 text-[10px] leading-relaxed">
                                    <p className="text-textSecondary">
                                      <strong className="text-textPrimary font-bold block mb-0.5">Consultant Recommendation:</strong>
                                      {reason}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 border-t border-neutral-200/50 pt-2 text-[9px]">
                                      <div>
                                        <span className="text-neutral-400 font-bold block">Target Roles</span>
                                        <strong className="text-textPrimary font-extrabold truncate block">{jobRoles}</strong>
                                      </div>
                                      <div>
                                        <span className="text-neutral-400 font-bold block">Expected Salary</span>
                                        <strong className="text-textPrimary font-extrabold block text-green-600">{salaryRange}</strong>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => triggerDirectCounseling(courseName)}
                                    className="w-full mt-2.5 py-2.5 rounded-[12px] bg-primary hover:bg-primaryHover transition text-center text-[10px] font-black text-white flex items-center justify-center gap-1 shadow-soft hover:shadow-glowPurple"
                                  >
                                    Book Counseling Program <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            };

                            const p1 = analysisResult.priorityCourses?.priority1 || [];
                            const p2 = analysisResult.priorityCourses?.priority2 || [];
                            const p3 = analysisResult.priorityCourses?.priority3 || [];
                            const fallbackList = analysisResult.recommendedCourses || [];
                            const items: React.ReactNode[] = [];

                            if (p1.length > 0) {
                              p1.forEach((cid: string) => {
                                items.push(renderCourseCard(cid, "Priority 1 (Must Learn)", "bg-red-50 text-red-500 border border-red-100"));
                              });
                            }
                            if (p2.length > 0) {
                              p2.forEach((cid: string) => {
                                items.push(renderCourseCard(cid, "Priority 2 (Recommended)", "bg-primary/10 text-primary border border-primary/20"));
                              });
                            }
                            if (p3.length > 0) {
                              p3.forEach((cid: string) => {
                                items.push(renderCourseCard(cid, "Priority 3 (Optional)", "bg-neutral-100 text-neutral-500 border border-neutral-200"));
                              });
                            }

                            if (items.length === 0 && fallbackList.length > 0) {
                              fallbackList.forEach((cid: string, i: number) => {
                                items.push(renderCourseCard(cid, i === 0 ? "Priority 1 (Must Learn)" : "Priority 2 (Recommended)", i === 0 ? "bg-red-50 text-red-500 border border-red-100" : "bg-primary/10 text-primary border border-primary/20"));
                              });
                            }

                            return items.length > 0 ? items : (
                              <div className="text-center py-6 text-xs text-textSecondary">
                                No course matches found for this domain criteria.
                              </div>
                            );
                          })()
                        )}
                      </div>
                    )}

                    {activeReportTab === 'roadmap' && (
                      <div className="space-y-3.5 animate-fade-up">
                        <div className="bg-sectionBg border border-borderLight p-4 rounded-2xl shadow-soft space-y-4">
                          <h5 className="text-xs font-black text-textPrimary uppercase tracking-widest text-primary flex items-center gap-1.5 border-b border-borderLight pb-1.5 leading-none">
                            <Calendar className="w-4 h-4 text-primary" /> Learning Milestones
                          </h5>
                          
                          {/* Visual Timeline */}
                          <div className="relative border-l border-borderLight pl-4 ml-2.5 space-y-4">
                            {/* 30 Day */}
                            {analysisResult.roadmap30 && (
                              <div className="relative text-[10px] text-textSecondary">
                                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white flex items-center justify-center"></span>
                                <strong className="text-textPrimary block mb-0.5 uppercase tracking-wide">Month 1 (Days 1-30)</strong>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {analysisResult.roadmap30.map((step: string, i: number) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* 60 Day */}
                            {analysisResult.roadmap60 && (
                              <div className="relative text-[10px] text-textSecondary">
                                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white flex items-center justify-center"></span>
                                <strong className="text-textPrimary block mb-0.5 uppercase tracking-wide">Month 2 (Days 31-60)</strong>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {analysisResult.roadmap60.map((step: string, i: number) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* 90 Day */}
                            {analysisResult.roadmap90 && (
                              <div className="relative text-[10px] text-textSecondary">
                                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white flex items-center justify-center"></span>
                                <strong className="text-textPrimary block mb-0.5 uppercase tracking-wide">Month 3 (Days 61-90)</strong>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {analysisResult.roadmap90.map((step: string, i: number) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Extended Text Report */}
                        {analysisResult.fullReport && (
                          <details className="bg-sectionBg border border-borderLight p-3.5 rounded-2xl shadow-soft group">
                            <summary className="text-[10px] font-black uppercase text-primary tracking-wider cursor-pointer list-none flex items-center justify-between">
                              Show Extended ATS Screening Report
                              <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition" />
                            </summary>
                            <div className="mt-3 bg-white border border-borderLight p-3 rounded-xl max-h-[180px] overflow-y-auto font-mono text-[9px] text-textPrimary leading-relaxed whitespace-pre-wrap">
                              {analysisResult.fullReport}
                            </div>
                          </details>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadReport}
                        className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primaryHover text-white text-center text-xs font-bold transition flex items-center justify-center gap-1 shadow-soft hover:shadow-glowPurple"
                      >
                        <FileText className="w-3.5 h-3.5" /> Download Report
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAnalysisResult(null);
                          setResumeText('');
                          setDiagFile(null);
                          setIsCounselorMode(false);
                          setCounselorStep(1);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-sectionBg hover:bg-white border border-borderLight text-center text-xs font-bold text-textPrimary transition"
                      >
                        Reset & Upload Again
                    </button>
                  </div>
                </div>
              ) : parsing ? (
                  /* SCANNING ANIMATION LOADER */
                  <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 animate-fade-up w-full">
                    {diagFile && (
                      <div className="w-full text-left">
                        {renderVisibleFileCard(diagFile, true)}
                      </div>
                    )}
                    <div className="relative w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary animate-pulse" />
                      <span className="absolute inset-0 rounded-full border border-primary border-t-transparent animate-spin"></span>
                    </div>
                    
                    <div className="w-full max-w-[240px] text-left space-y-2 bg-sectionBg border border-borderLight p-4.5 rounded-2xl shadow-soft">
                      {[
                        "Uploading...",
                        "Parsing Resume...",
                        "Analyzing Skills...",
                        "Generating Recommendations...",
                        "Analysis Complete"
                      ].map((stepText, idx) => {
                        const isDone = diagStatusStep > idx;
                        const isActive = diagStatusStep === idx;
                        
                        return (
                          <div key={idx} className="flex items-center gap-2 text-[10px]">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            ) : isActive ? (
                              <span className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0"></span>
                            ) : (
                              <span className="h-3.5 w-3.5 rounded-full border-2 border-neutral-200 shrink-0"></span>
                            )}
                            <span className={`font-bold ${isActive ? 'text-primary font-black scale-102' : isDone ? 'text-green-600' : 'text-neutral-300'}`}>
                              {stepText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : isCounselorMode ? (
                  /* === CAREER COUNSELORdiscovery FORM (No Resume Mode) === */
                  <div className="space-y-3.5 animate-fade-up">
                    <div className="flex items-center justify-between border-b border-borderLight pb-2">
                      <h5 className="text-xs font-black uppercase tracking-wider text-primary">Discovery Steps ({counselorStep}/3)</h5>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsCounselorMode(false);
                          setCounselorStep(1);
                        }}
                        className="text-[10px] text-textSecondary hover:text-red-500 font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleResumeSubmit();
                      }}
                      className="space-y-3"
                    >
                      {counselorStep === 1 && (
                        <div className="space-y-3 animate-fade-up">
                          <p className="text-[10px] text-textSecondary">Provide your basic profile credentials to tailor your recommended paths.</p>
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Your Name</label>
                            <input
                              type="text"
                              required
                              value={counselorForm.name}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Rohit Kumar"
                              className="bg-white border border-borderLight rounded-xl px-3 py-2 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Experience Level</label>
                            <select
                              value={counselorForm.experienceLevel}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                              className="bg-white border border-borderLight rounded-xl px-3 py-2.5 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            >
                              <option>Entry Level / Fresher</option>
                              <option>Mid Level / Experienced</option>
                              <option>Senior Level</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Current Education</label>
                            <input
                              type="text"
                              required
                              value={counselorForm.education}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, education: e.target.value }))}
                              placeholder="e.g. B.Tech Computer Science / MCA"
                              className="bg-white border border-borderLight rounded-xl px-3 py-2 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {counselorStep === 2 && (
                        <div className="space-y-3 animate-fade-up">
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Current Job Role</label>
                            <input
                              type="text"
                              required
                              value={counselorForm.currentRole}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, currentRole: e.target.value }))}
                              placeholder="e.g. Student / Junior System Engineer"
                              className="bg-white border border-borderLight rounded-xl px-3 py-2 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Target Career Goal</label>
                            <input
                              type="text"
                              required
                              value={counselorForm.careerGoal}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, careerGoal: e.target.value }))}
                              placeholder="e.g. AWS Cloud Engineer / Lead Java Developer"
                              className="bg-white border border-borderLight rounded-xl px-3 py-2 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {counselorStep === 3 && (
                        <div className="space-y-3 animate-fade-up">
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Preferred Technology</label>
                            <input
                              type="text"
                              required
                              value={counselorForm.preferredTech}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, preferredTech: e.target.value }))}
                              placeholder="e.g. Java, Python, SQL, Docker"
                              className="bg-white border border-borderLight rounded-xl px-3 py-2 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-neutral-400 block mb-1">Interested Domain</label>
                            <select
                              value={counselorForm.interestedDomain}
                              onChange={(e) => setCounselorForm(prev => ({ ...prev, interestedDomain: e.target.value }))}
                              className="bg-white border border-borderLight rounded-xl px-3 py-2.5 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans"
                            >
                              <option>Full Stack Development</option>
                              <option>Cloud Computing</option>
                              <option>DevOps</option>
                              <option>Data Analytics</option>
                              <option>AI & Machine Learning</option>
                              <option>Cyber Security</option>
                              <option>Testing</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {counselorStep > 1 && (
                          <button
                            type="button"
                            onClick={() => setCounselorStep(prev => prev - 1)}
                            className="flex-1 py-3 border border-borderLight bg-white rounded-xl text-center text-xs font-bold text-textSecondary transition hover:text-textPrimary"
                          >
                            Back
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-[2] py-3 bg-primary hover:bg-primaryHover text-white text-xs font-black rounded-xl transition text-center shadow-soft hover:shadow-glowPurple flex items-center justify-center gap-1.5"
                        >
                          {counselorStep === 3 ? (
                            <>
                              <Sparkles className="w-4 h-4" /> Run Discovery Map
                            </>
                          ) : (
                            "Continue"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* === DIAGNOSTICS INPUT ENTRY STATE === */
                  <div className="space-y-4 animate-fade-up">
                    
                    {/* File Upload Drag Area (FEATURE 1 Browse / Drag & Drop) */}
                    <div 
                      onDragOver={handleDiagDragOver}
                      onDragLeave={handleDiagDragLeave}
                      onDrop={handleDiagDrop}
                      onClick={() => diagFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4.5 text-center cursor-pointer transition ${
                        diagDragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-borderLight hover:border-primary/55 hover:bg-sectionBg'
                      }`}
                    >
                      <input
                        type="file"
                        ref={diagFileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleDiagFileUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.rtf"
                      />
                      <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs font-black text-textPrimary leading-none heading">Upload Resume Document</p>
                      <p className="text-[9px] text-textSecondary mt-1">Supports PDF, DOC, DOCX, TXT, RTF (Max 5MB)</p>
                    </div>

                    {/* File uploading progress card */}
                    {diagFile && renderVisibleFileCard(diagFile, true)}

                    {/* Manual Paste Textarea option */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-neutral-400 block tracking-wide">Or Paste Resume Text</label>
                      <textarea
                        rows={4}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste resume details... E.g.
Name: Rohit Kumar
Skills: SQL basics, Python syntax, Excel.
Goal: Become a Data Analyst."
                        className="bg-white border border-borderLight rounded-2xl p-3 text-xs text-textPrimary w-full focus:outline-none focus:border-primary/60 font-sans resize-none h-[110px]"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-1.5">
                      <button
                        type="button"
                        onClick={handleResumeSubmit}
                        className="w-full py-3 rounded-xl bg-primary hover:bg-primaryHover text-white text-xs font-black transition text-center shadow-soft hover:shadow-glowPurple flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" /> Start Profile Diagnosis
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCounselorMode(true);
                          setCounselorStep(1);
                        }}
                        className="w-full py-3 rounded-xl bg-sectionBg hover:bg-neutral-100 border border-borderLight text-center text-xs font-bold text-textPrimary transition"
                      >
                        No Resume? Try Counselor Discovery Mode
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Uploaded File Cards Panel (Only on Counsellor Chat Tab) */}
          {activeTab === 'chat' && uploadedFiles.length > 0 && (
            <div className="px-3.5 py-3.5 bg-sectionBg/80 border-t border-borderLight grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto z-10">
              {uploadedFiles.map(file => renderVisibleFileCard(file, false))}
            </div>
          )}

          {/* Footer Input Bar */}
          {activeTab === 'chat' && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="bg-sectionBg border-t border-borderLight px-3.5 py-3.5 flex items-center gap-2 relative z-10"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl border border-borderLight bg-white text-textSecondary hover:text-primary hover:border-primary/40 transition shrink-0"
                title="Upload document (PDF, Word, Text, RTF)"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) {
                    handleFilesUpload(Array.from(e.target.files));
                  }
                }}
                multiple
                accept=".pdf,.doc,.docx,.txt,.rtf"
                className="hidden"
              />

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={uploadedFiles.length > 0 ? "Ask Auri about attached files..." : "Ask Auri about courses..."}
                className="bg-white border border-borderLight rounded-xl px-4 py-2.5 text-xs text-textPrimary placeholder-neutral-400 focus:outline-none focus:border-primary/60 flex-1 font-sans"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() && !uploadedFiles.some(f => f.status === 'success')}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primaryHover hover:shadow-glowPurple transition disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* Document Text Viewer Modal */}
      {viewingFileText !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-borderLight w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-sectionBg px-4.5 py-3.5 border-b border-borderLight flex items-center justify-between text-textPrimary">
              <h5 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 leading-none">
                <FileText className="w-4 h-4 text-primary" /> Extracted Document Text
              </h5>
              <button
                type="button"
                onClick={() => setViewingFileText(null)}
                className="p-1 rounded-full hover:bg-neutral-200 text-textSecondary hover:text-textPrimary transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-[10px] text-textPrimary leading-relaxed whitespace-pre-wrap bg-neutral-50/50 selection:bg-primary/20">
              {viewingFileText || 'No text extracted from this file.'}
            </div>
            {/* Modal Footer */}
            <div className="bg-sectionBg px-4 py-3 border-t border-borderLight flex justify-end">
              <button
                type="button"
                onClick={() => setViewingFileText(null)}
                className="px-4 py-2 bg-primary hover:bg-primaryHover text-white text-xs font-bold rounded-xl transition shadow-soft"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
