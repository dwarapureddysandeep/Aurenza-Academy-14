import { useState, useRef, useEffect } from 'react';
import { useLeadModal } from '../context/ModalContext';
import { aiService } from '../services/aiService';
import { useDropzone } from 'react-dropzone';
import { Bot, X, Send, FileText, Upload, Sparkles, Award, Star, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuriChatbot() {
  const { openModal } = useLeadModal();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'auri',
      text: 'Hello! I am Auri, your personal AI Career assistant. I can recommend the perfect course for you, analyze your resume to highlight skill gaps, or help you generate an interactive career roadmap. Select an option below to start!',
      quickActions: ['Recommend Courses', 'Analyze Resume', 'Career Roadmap', 'Placement Guidance']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzerMode, setAnalyzerMode] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, analyzerMode]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('File size exceeds 2MB limit.');
    }

    setLoading(true);
    setMessages(prev => [
      ...prev,
      { id: `user-file-${Date.now()}`, sender: 'user', text: `Uploaded resume: ${file.name}` }
    ]);

    try {
      const result = await aiService.analyzeResume(null, file.name);
      setAnalysisResult(result);
      setMessages(prev => [
        ...prev,
        {
          id: `auri-analysis-${Date.now()}`,
          sender: 'auri',
          text: `Resume Analyzed Successfully!\n\n**Detected Domain:** ${result.detectedDomain}\n**Experience Level:** ${result.experienceLevel}\n**Suggested Path:** ${result.suggestedCareerPath}\n\nI found matching skill gaps and created an optimized learning roadmap for you.`,
          analysis: result
        }
      ]);
      setAnalyzerMode(false);
    } catch (e) {
      toast.error('Could not analyze resume. Try pasting the text instead.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleSendText = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setInputText('');
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: query }]);
    setLoading(true);

    try {
      const response = await aiService.getChatResponse(query);
      setMessages(prev => [
        ...prev,
        {
          id: `auri-${Date.now()}`,
          sender: 'auri',
          text: response.text,
          quickActions: response.quickActions
        }
      ]);
    } catch (err) {
      toast.error('AI assistant offline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'Analyze Resume') {
      setAnalyzerMode(true);
    } else if (action === 'Recommend Courses') {
      handleSendText('counseling');
    } else if (action === 'Career Roadmap') {
      handleSendText('I want an interactive career roadmap');
    } else if (action === 'Placement Guidance') {
      handleSendText('placement opportunities');
    } else if (action === 'Book Free Counseling') {
      openModal();
    } else if (action === 'Explore Courses') {
      window.location.hash = 'courses';
      setIsOpen(false);
    } else {
      handleSendText(action);
    }
  };

  const handleAnalyzePastedText = async () => {
    if (!resumeText.trim()) return toast.error('Please paste resume text first.');
    
    setLoading(true);
    setMessages(prev => [
      ...prev,
      { id: `user-paste-${Date.now()}`, sender: 'user', text: 'Pasted resume text for analysis.' }
    ]);
    setAnalyzerMode(false);

    try {
      const result = await aiService.analyzeResume(resumeText);
      setAnalysisResult(result);
      setMessages(prev => [
        ...prev,
        {
          id: `auri-analysis-${Date.now()}`,
          sender: 'auri',
          text: `Resume Analyzed Successfully!\n\n**Detected Domain:** ${result.detectedDomain}\n**Experience Level:** ${result.experienceLevel}\n**Suggested Path:** ${result.suggestedCareerPath}\n\nI found matching skill gaps and created an optimized learning roadmap for you.`,
          analysis: result
        }
      ]);
      setResumeText('');
    } catch (e) {
      toast.error('Resume parsing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Widget — Vision Pro Glassmorphic Orb */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full vision-orb-btn text-white relative outline-none"
        aria-label="Toggle career assistant chat"
        whileTap={{ scale: 0.95 }}
      >
        <div className="vision-orb-glow"></div>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot size={26} className="animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8A2EFF] text-white border border-white shadow-soft text-[10px] font-bold">
          <Star size={10} fill="currentColor" />
        </span>
      </motion.button>

      {/* Chat Window Panel — Apple Vision Pro Frosted Glass Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-26 right-6 z-40 flex h-[590px] w-[calc(100vw-48px)] sm:w-[410px] flex-col overflow-hidden rounded-[30px] vision-glass-panel vision-glow-border shadow-premium backdrop-blur-3xl"
          >
            {/* Ambient Rotating Purple Background Glow */}
            <div className="auri-pulsing-orb -top-20 -right-20 w-52 h-52 pointer-events-none opacity-45"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/5 bg-white/20 px-5 py-4.5 text-appleDark">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-applePurple/15 text-applePurple shadow-inner">
                  <Bot size={20} />
                </span>
                <div>
                  <h3 className="font-extrabold text-[15px] flex items-center gap-1.5 leading-none text-appleDark">
                    Auri AI <Sparkles size={13} fill="currentColor" className="text-[#8A2EFF] animate-bounce" />
                  </h3>
                  <span className="text-[10px] font-black text-applePurple uppercase tracking-wider mt-1 block">Aurenza Executive Counselor</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-black/5 text-neutral-500 transition duration-300"
                aria-label="Minimize Chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto bg-transparent p-4 space-y-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] font-semibold leading-relaxed shadow-soft ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#6A00FF] to-[#8A2EFF] text-white rounded-tr-none border border-[#6A00FF]/10'
                            : 'bg-white/80 text-appleDark border border-black/5 rounded-tl-none backdrop-blur-md'
                        }`}
                      >
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                        ))}

                        {/* Resume analysis summary display */}
                        {msg.analysis && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-3 border-t border-black/5 space-y-3.5 text-appleDark text-xs"
                          >
                            <div>
                              <p className="font-extrabold text-applePurple uppercase tracking-wider text-[10px]">✓ Detected Skills</p>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {msg.analysis.detectedSkills.map(sk => (
                                  <span key={sk} className="rounded-full bg-purple-50/70 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-black text-applePurple border border-purple-100">{sk}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="font-extrabold text-red-500 uppercase tracking-wider text-[10px]">✗ Skill Gaps & Focus Area</p>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {msg.analysis.skillGaps.map(gp => (
                                  <span key={gp} className="rounded-full bg-red-50/70 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-black text-red-600 border border-red-100">{gp}</span>
                                ))}
                              </div>
                            </div>
                            
                            {/* Suggested Path & Roadmap Details */}
                            <div className="rounded-2xl bg-white border border-black/5 p-3.5 space-y-2 shadow-sm">
                              <p className="font-black text-appleDark flex items-center gap-1.5">
                                <Award size={14} className="text-[#8A2EFF]" /> Recommended Path:
                              </p>
                              <p className="font-black text-[12px] text-applePurple leading-tight">{msg.analysis.roadmap.title}</p>
                              
                              <div className="space-y-1.5 pt-1.5 border-t border-neutral-100">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Learning Milestones:</p>
                                <ul className="text-[10.5px] space-y-1.5 text-neutral-500 list-none pl-0">
                                  {msg.analysis.roadmap.steps.slice(0, 3).map((st, idx) => (
                                    <li key={idx} className="flex gap-1.5 items-start">
                                      <span className="h-4 w-4 shrink-0 flex items-center justify-center rounded-full bg-purple-50 text-[8px] font-black text-applePurple mt-0.5">{idx + 1}</span>
                                      <span className="truncate">{st}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="pt-1.5">
                              <button
                                type="button"
                                onClick={() => openModal(msg.analysis.roadmap.title)}
                                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6A00FF] to-[#8A2EFF] py-3 text-xs font-black text-white hover:opacity-90 shadow-soft transition-all duration-300"
                              >
                                Enroll in this path <ArrowRight size={13} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Chips */}
                    {msg.quickActions && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickActions.map(action => (
                          <motion.button
                            key={action}
                            type="button"
                            onClick={() => handleQuickAction(action)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="rounded-full border border-black/5 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 text-[12px] font-bold text-applePurple shadow-soft transition hover:border-[#8A2EFF] hover:bg-purple-50/50"
                          >
                            {action}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* AI Typing loader */}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none border border-black/5 bg-white px-4 py-3 shadow-soft flex items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-applePurple"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-applePurple delay-150"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-applePurple delay-300"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Drawer for Resume Analyzer */}
              <AnimatePresence>
                {analyzerMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="rounded-2xl border border-black/5 bg-white/90 backdrop-blur-md p-4 space-y-4 shadow-premium"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-appleDark text-[13px] flex items-center gap-1.5">
                        <FileText size={16} className="text-applePurple animate-pulse" /> Resume Analyzer
                      </h4>
                      <button
                        type="button"
                        onClick={() => setAnalyzerMode(false)}
                        className="text-neutral-400 hover:text-neutral-600 transition"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Dropzone Upload */}
                    <div
                      {...getRootProps()}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive ? 'border-applePurple bg-purple-50/50' : 'border-neutral-200 bg-white/70 hover:border-applePurple'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload size={22} className="text-applePurple mb-1.5 animate-bounce" />
                      <p className="text-[11px] font-black text-appleDark">Drag & drop resume file</p>
                      <p className="text-[9px] font-bold text-neutral-400 mt-0.5">Supports PDF, DOCX, TXT (Max 2MB)</p>
                    </div>

                    <div className="text-center text-[10px] font-black text-neutral-400">OR PASTE CONTENT</div>

                    {/* Paste Option */}
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        placeholder="Paste resume text details here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleAnalyzePastedText}
                        className="w-full rounded-xl bg-gradient-to-r from-[#6A00FF] to-[#8A2EFF] py-2.5 text-xs font-black text-white hover:opacity-90 shadow-soft transition-all duration-300"
                      >
                        Analyze Text
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input Bar */}
            <div className="border-t border-black/5 bg-white/20 p-3.5 flex gap-2 backdrop-blur-md">
              <input
                type="text"
                placeholder="Ask Auri about career roadmaps or courses..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                disabled={loading || analyzerMode}
                className="flex-1 rounded-full border border-neutral-200/80 px-4 py-3 text-xs font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple bg-white/80 transition duration-300"
              />
              <motion.button
                type="button"
                onClick={() => handleSendText()}
                disabled={!inputText.trim() || loading || analyzerMode}
                whileTap={{ scale: 0.9 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#6A00FF] to-[#8A2EFF] text-white shadow-soft transition hover:opacity-95 disabled:opacity-50"
                aria-label="Send Message"
              >
                <Send size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
