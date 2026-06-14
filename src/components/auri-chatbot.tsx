"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle, FileText, ArrowRight, CheckCircle2, ChevronRight, Paperclip, UploadCloud, File } from 'lucide-react';
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

  // Resume Parsing States (Pasted tab)
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // File Upload & Session Memory States
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFilesUpload = async (files: File[]) => {
    const supportedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.pptx', '.ppt'];
    
    for (const file of files) {
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!supportedExtensions.includes(extension)) {
        toast.error(`Unsupported format: ${file.name}. Supports PDF, Word, PowerPoint, or Text.`);
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

  const handleSend = async (text: string) => {
    if (!text.trim() && uploadedFiles.every(f => f.status !== 'success')) return;
    
    // Add user message
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

    // Compile message history
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      text: msg.text
    }));

    // Compile active document contexts
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

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setParsing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeResumeAction(resumeText, 'pasted_resume.txt');
      if (result) {
        setAnalysisResult(result);
        toast.success("Resume Diagnostics Complete!");
      } else {
        toast.error("Failed to analyze resume. Please check your network and try again.");
      }
    } catch (err) {
      console.error("Resume analysis failed:", err);
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="floating-chatbot border border-borderLight shadow-2xl bg-white flex flex-col relative animate-fade-up"
        >
          
          {/* Drag & Drop Overlay Visuals */}
          {isDragging && activeTab === 'chat' && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] border-2 border-dashed border-primary z-40 flex flex-col items-center justify-center pointer-events-none">
              <UploadCloud className="w-12 h-12 text-primary animate-bounce" />
              <p className="text-sm font-black text-primary mt-2 heading">Drop Files Here</p>
              <p className="text-[10px] text-textSecondary mt-0.5">Supports PDF, Word, PowerPoint, or Text</p>
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
              /* AI RESUME DIAGNOSTIC TAB (PASTE METHOD) */
              <div className="space-y-4 text-textSecondary animate-fade-up">
                
                {analysisResult ? (
                  /* DIAGNOSTICS COMPLETED RESULTS VIEW */
                  <div className="space-y-4">
                    <div className="p-3 bg-successGreen/5 border border-successGreen/25 rounded-2xl flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-successGreen shrink-0" />
                      <span className="text-xs font-bold text-successGreen">Analysis complete. Profile matched.</span>
                    </div>

                    <div className="space-y-3.5">
                      {/* Domain and Experience */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-sectionBg border border-borderLight p-2.5 rounded-xl text-center">
                          <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">Experience Level</p>
                          <p className="text-xs text-textPrimary font-extrabold mt-0.5">{analysisResult.experienceLevel}</p>
                        </div>
                        <div className="bg-sectionBg border border-borderLight p-2.5 rounded-xl text-center">
                          <p className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">Target Domain</p>
                          <p className="text-xs text-textPrimary font-extrabold mt-0.5 truncate">{analysisResult.suggestedCareerPath.split(' ')[0]}</p>
                        </div>
                      </div>

                      {/* Detected Badges */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-successGreen">Detected Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.detectedSkills.map((s: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded bg-successGreen/5 text-successGreen border border-successGreen/10 text-[9px] font-bold">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Skill Gaps BADGES */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-primary" /> High Priority Skill Gaps
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.skillGaps.map((s: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Program */}
                      <div className="bg-sectionBg border border-borderLight p-3.5 rounded-2xl space-y-2 shadow-soft">
                        <p className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none">Recommended Career Booster</p>
                        <h5 className="text-xs font-black text-textPrimary heading flex items-center gap-1.5 mt-1">
                          {analysisResult.roadmap.title}
                        </h5>
                        <button
                          type="button"
                          onClick={() => triggerDirectCounseling(analysisResult.roadmap.title.split(' Roadmap')[0])}
                          className="w-full mt-2 py-2.5 rounded-[14px] bg-primary hover:bg-primaryHover transition text-center text-[10px] font-black text-white flex items-center justify-center gap-1.5 shadow-soft hover:shadow-glowPurple"
                        >
                          Book Counseling for program <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Dynamic Roadmap Steps */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Suggested Study Timeline</p>
                        <div className="border-l border-borderLight pl-3 space-y-2 ml-1">
                          {analysisResult.roadmap.steps.slice(0, 3).map((step: string, i: number) => (
                            <div key={i} className="relative text-[10px] text-textSecondary">
                              <span className="absolute -left-[16px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white"></span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed AI Report */}
                      {analysisResult.fullReport && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Detailed AI Screening Report</p>
                          <div className="bg-sectionBg border border-borderLight p-3.5 rounded-2xl max-h-[220px] overflow-y-auto font-mono text-[9px] text-textPrimary leading-relaxed whitespace-pre-wrap">
                            {analysisResult.fullReport}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setAnalysisResult(null);
                          setResumeText('');
                        }}
                        className="w-full py-2.5 rounded-xl bg-sectionBg hover:bg-white border border-borderLight text-center text-xs font-bold text-textPrimary transition"
                      >
                        Reset & Upload Again
                      </button>
                    </div>
                  </div>
                ) : parsing ? (
                  /* SCANNING ANIMATION LOADER */
                  <div className="flex flex-col items-center justify-center text-center py-16 space-y-6">
                    <div className="relative w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary animate-pulse" />
                      <span className="absolute inset-0 rounded-full border border-primary border-t-transparent animate-spin"></span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-textPrimary leading-none heading">Scanning Resume Semantics...</h4>
                      <p className="text-[10px] text-textSecondary max-w-[200px] leading-normal mx-auto">
                        Extracting technical expertise and contrasting with corporate certification syllabi.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* SUBMIT FORM VIEW */
                  <form onSubmit={handleResumeSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs text-textSecondary leading-normal">
                        Paste your current resume content (or describe your skills) below. Auri AI will identify your gaps and build custom syllabus roadmaps.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <textarea
                        required
                        rows={6}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text here... E.g.
Name: Rohit Kumar
Skills: JavaScript, HTML, CSS, React basics.
Experience: Fresh Graduate looking for entry software developer roles..."
                        className="glass-input text-xs sm:text-sm resize-none h-[180px] font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-[14px] bg-primary hover:bg-primaryHover transition text-center text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-soft hover:shadow-glowPurple"
                    >
                      <FileText className="w-4 h-4" /> Start Profile Diagnosis
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>

          {/* Uploaded File Cards Panel */}
          {activeTab === 'chat' && uploadedFiles.length > 0 && (
            <div className="px-3.5 py-2.5 bg-sectionBg/80 border-t border-borderLight flex flex-wrap gap-2 max-h-[120px] overflow-y-auto z-10">
              {uploadedFiles.map(file => {
                const isUploading = file.status === 'uploading';
                const isError = file.status === 'error';
                
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition shadow-soft ${
                      isError 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : isUploading 
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-500 animate-pulse' 
                          : 'bg-primary/5 border-primary/10 text-primary'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[80px]" title={file.name}>{file.name}</span>
                    {isUploading ? (
                      <LoadingSpinner size="xs" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="hover:text-red-500 text-textSecondary transition ml-1"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
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
              {/* Attachment trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl border border-borderLight bg-white text-textSecondary hover:text-primary hover:border-primary/40 transition shrink-0"
                title="Upload document (PDF, Word, Text, PowerPoint)"
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
                accept=".pdf,.doc,.docx,.txt,.pptx,.ppt"
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

    </div>
  );
}
