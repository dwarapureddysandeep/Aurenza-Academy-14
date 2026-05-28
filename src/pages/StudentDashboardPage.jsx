import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService, courseService } from '../services/db';
import { aiService } from '../services/aiService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  User, BookOpen, Award, ShieldAlert, Sparkles, Star, LogOut, LayoutDashboard, 
  Settings, Bell, Compass, ArrowRight, AwardIcon, FileText, CheckCircle 
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for profile editing
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    bio: ''
  });

  // State for Career Tools resume text
  const [resumeText, setResumeText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Load student records
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });

      const loadData = async () => {
        try {
          const [enrollList, payList, certList] = await Promise.all([
            studentService.getEnrollments(user.id),
            studentService.getPayments(user.id),
            studentService.getCertificates(user.id)
          ]);
          setEnrollments(enrollList);
          setPayments(payList);
          setCertificates(certList);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8c00bd] border-t-transparent"></div>
          <p className="text-lg font-semibold text-[#5f5071]">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) return toast.error('Name cannot be blank');
    
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Profile update failed.');
    }
  };

  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return toast.error('Please paste resume details first.');

    setAnalysisLoading(true);
    try {
      const result = await aiService.analyzeResume(resumeText);
      setAnalysisResult(result);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error('Resume analysis failed.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Simulate progress addition to test certificate generation
  const handleSimulateProgress = async (courseId, currentProgress) => {
    try {
      const nextProgress = Math.min(currentProgress + 20, 100);
      const lastLesson = nextProgress === 100 ? 'Module 5: Course Complete!' : 'Simulated Lesson Study';
      
      await studentService.updateCourseProgress(user.id, courseId, nextProgress, lastLesson);
      
      // Reload enrollments
      const updated = await studentService.getEnrollments(user.id);
      setEnrollments(updated);

      toast.success(`Progress simulated: ${nextProgress}%`);

      // If progress hits 100%, auto-generate certificate
      if (nextProgress === 100) {
        const targetEnroll = updated.find(e => e.course_id === courseId);
        await studentService.generateCertificate(user.id, user.name, courseId, targetEnroll.courses.name);
        const certList = await studentService.getCertificates(user.id);
        setCertificates(certList);
        toast.success(`Congratulations! Your certificate for ${targetEnroll.courses.name} has been generated!`);
      }
    } catch (err) {
      toast.error('Progress update failed.');
    }
  };

  return (
    <div className="min-h-screen bg-white bg-soft-radial font-sans text-appleDark pt-20 flex relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-20 w-[350px] h-[350px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />

      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white/75 border-r border-black/5 hidden md:flex flex-col justify-between py-8 px-5 relative z-10 backdrop-blur-md">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="flex items-center gap-3.5 bg-appleGray/50 border border-black/5 rounded-2xl p-4 shadow-soft">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-apple-gradient text-white text-sm font-black shadow-soft">
              {user.name ? user.name[0] : 'SK'}
            </div>
            <div>
              <h4 className="text-sm font-black text-appleDark leading-tight tracking-tight">{user.name}</h4>
              <span className="text-[9px] font-black text-applePurple uppercase tracking-wider">{user.role} Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'courses', label: 'My Courses', icon: BookOpen },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'career', label: 'Career Tools', icon: Compass },
              { id: 'profile', label: 'Edit Profile', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition duration-300 ${
                  activeTab === tab.id
                    ? 'bg-appleDark text-white shadow-soft'
                    : 'text-neutral-500 hover:bg-appleGray hover:text-appleDark'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out trigger */}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition duration-300"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* 2. DYNAMIC WORKSPACE PANEL */}
      <main className="flex-1 p-6 md:p-10 max-w-[1000px] overflow-y-auto relative z-10 relative">
        
        {/* DASHBOARD TAB CONTAINER */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-up">
            {/* Header greeting */}
            <div className="rounded-[32px] glass-panel p-8 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-appleDark tracking-tight">Welcome back, {user.name} 👋</h1>
                <p className="text-sm font-semibold text-neutral-400">
                  You are currently enrolled in {enrollments.length} professional program{enrollments.length > 1 ? 's' : ''}.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-center bg-white border border-black/5 rounded-2xl px-5 py-3 shadow-soft">
                  <p className="text-xl font-black text-applePurple">{enrollments.filter(e => e.progress === 100).length}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">Completed</p>
                </div>
                <div className="text-center bg-white border border-black/5 rounded-2xl px-5 py-3 shadow-soft">
                  <p className="text-xl font-black text-applePurple">{certificates.length}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">Certificates</p>
                </div>
              </div>
            </div>

            {/* In Progress Courses list grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-appleDark tracking-tight">Recent Studies</h3>
              <div className="grid gap-6">
                {enrollments.length === 0 ? (
                  <div className="text-center glass-panel rounded-3xl p-12 space-y-4">
                    <p className="text-sm font-bold text-neutral-400">You are not enrolled in any program yet.</p>
                    <Link to="/courses" className="inline-flex rounded-full bg-appleDark hover:bg-applePurple px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition duration-300">
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  enrollments.map(enr => (
                    <div
                      key={enr.id}
                      className="premium-card rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-applePurple bg-applePurple/5 px-2.5 py-1 rounded-full border border-applePurple/10">
                            {enr.courses.categoryName}
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-400">Joined: {new Date(enr.enrolled_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-xl font-black text-appleDark tracking-tight">{enr.courses.name}</h4>
                        
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-neutral-400 mb-1">
                            <span>Syllabus Progress</span>
                            <span className="text-appleDark font-bold">{enr.progress}%</span>
                          </div>
                          <div className="w-full bg-appleGray h-1.5 rounded-full overflow-hidden">
                            <div className="bg-applePurple h-full rounded-full transition-all duration-500" style={{ width: `${enr.progress}%` }}></div>
                          </div>
                          <span className="text-[11px] font-semibold text-neutral-400 block mt-2">Last Lesson: <strong className="text-neutral-600 font-bold">{enr.last_lesson}</strong></span>
                        </div>
                      </div>

                      {/* Simulations/Continue */}
                      <div className="flex gap-2 shrink-0">
                        {enr.progress < 100 && (
                          <button
                            type="button"
                            onClick={() => handleSimulateProgress(enr.course_id, enr.progress)}
                            className="rounded-xl border border-black/10 hover:border-applePurple px-4 py-2.5 text-xs font-bold text-neutral-500 hover:text-applePurple transition-all duration-300 bg-white shadow-soft"
                          >
                            Simulate Lesson
                          </button>
                        )}
                        <Link
                          to={`/courses/${enr.courses.slug}`}
                          className="rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 shadow-soft"
                        >
                          {enr.progress === 100 ? 'Review Syllabus' : 'Resume Lectures'}
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* MY COURSES TAB CONTAINER */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-up">
            <h1 className="text-2xl font-black text-appleDark tracking-tight">My Enrolled Programs</h1>
            <div className="grid gap-6">
              {enrollments.map(enr => (
                <div key={enr.id} className="premium-card rounded-3xl p-6 shadow-soft">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <img src={enr.courses.image} alt={enr.courses.name} className="h-20 w-32 rounded-2xl object-cover border border-black/5" />
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-applePurple bg-applePurple/5 px-2.5 py-1 rounded-full border border-applePurple/10 inline-block">{enr.courses.categoryName}</span>
                      <h3 className="text-lg font-black text-appleDark tracking-tight">{enr.courses.name}</h3>
                      <div className="flex items-center gap-6 text-xs font-semibold text-neutral-400">
                        <span>Duration: {enr.courses.duration}</span>
                        <span>Instructor: {enr.courses.mentor.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-black/[0.03] flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-semibold text-neutral-400 mb-1">
                        <span>Course Study Track</span>
                        <span className="text-appleDark font-bold">{enr.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-appleGray h-1.5 rounded-full overflow-hidden">
                        <div className="bg-applePurple h-full rounded-full transition-all duration-300" style={{ width: `${enr.progress}%` }}></div>
                      </div>
                    </div>
                    <Link to={`/courses/${enr.courses.slug}`} className="rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-3 text-xs font-bold text-white transition-all duration-300 shadow-soft">
                      Go To Class
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB CONTAINER */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-appleDark tracking-tight">My Degree Certificates</h1>
              <p className="text-sm font-semibold text-neutral-400">Your verified, shareable completions degrees from Aurenza Academy.</p>
            </div>

            <div className="grid gap-8">
              {certificates.length === 0 ? (
                <div className="text-center glass-panel rounded-3xl p-16 space-y-4">
                  <AwardIcon size={36} className="text-neutral-300 mx-auto" />
                  <h3 className="text-lg font-black text-appleDark tracking-tight">No Certificates Available</h3>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                    Complete 100% of the course modules in your enrollments to automatically generate graduation records.
                  </p>
                </div>
              ) : (
                certificates.map(cert => (
                  <div key={cert.id} className="glass-panel rounded-3xl p-8 shadow-premium space-y-6 max-w-[800px] mx-auto border-t-8 border-t-applePurple">
                    {/* Header completions logo */}
                    <div className="flex justify-between items-center pb-4 border-b border-black/[0.03]">
                      <div className="flex items-center gap-2">
                        <img src="/aurenza-logo.jpeg" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
                        <span className="font-extrabold text-sm text-appleDark tracking-tight">Aurenza <span className="text-applePurple">Academy</span></span>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 text-[9px] font-black tracking-wider text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle size={12} /> VERIFIED ACCREDITATION
                      </span>
                    </div>

                    {/* Certificate Statement Content */}
                    <div className="text-center space-y-4 py-4">
                      <span className="rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3.5 py-1 text-[9px] font-black tracking-wider uppercase inline-block">★ Graduate Completion Medal</span>
                      <p className="text-xs font-semibold text-neutral-400">This is to proudly certify that</p>
                      <h2 className="text-3xl font-black text-applePurple tracking-tight py-1">{cert.name}</h2>
                      <p className="text-xs font-semibold text-neutral-400 max-w-[500px] mx-auto leading-relaxed">
                        has successfully finished all modules and graduation criteria for the specialized training in
                      </p>
                      <h3 className="text-xl font-black text-appleDark tracking-tight">{cert.course_name}</h3>
                      <p className="text-[11px] font-bold text-neutral-400">Accredited on: {new Date(cert.completion_date).toLocaleDateString()}</p>
                    </div>

                    {/* Verification Details */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-black/[0.03] text-xs font-semibold text-neutral-400">
                      <div className="text-center sm:text-left">
                        <p>ID Reference: <strong className="text-appleDark font-bold">{cert.cert_id}</strong></p>
                        <p className="mt-0.5">Dual-Sync Backup: [Supabase Verified]</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success('Certificate download triggered! Saving AUR-Accreditation.pdf');
                        }}
                        className="rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-3 text-xs font-bold text-white transition-all duration-300 shadow-soft"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CAREER TOOLS TAB CONTAINER */}
        {activeTab === 'career' && (
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-appleDark tracking-tight">Career Tools & Resume Scoring</h1>
              <p className="text-sm font-semibold text-neutral-400">AI-powered resume analyzers and quantitative skillset mappings.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Form Input Paste */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 shadow-soft">
                <h3 className="text-base font-black text-appleDark tracking-tight flex items-center gap-2">
                  <FileText size={18} className="text-applePurple" /> Paste CV Credentials
                </h3>
                <p className="text-xs font-semibold text-neutral-400 leading-relaxed">
                  Paste your CV accomplishments, skills, and past jobs. Auri will scan them for gaps.
                </p>
                <form onSubmit={handleAnalyzeResume} className="space-y-4">
                  <textarea
                    rows={8}
                    placeholder="Paste resume text details here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={analysisLoading}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white p-4 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={analysisLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {analysisLoading ? 'Running AI Engine...' : 'Run Skill-Gap Analysis'}
                  </button>
                </form>
              </div>

              {/* Analysis Result display */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-soft">
                {analysisResult ? (
                  <div className="space-y-6">
                    <h3 className="text-base font-black text-appleDark tracking-tight">Analysis Results</h3>
                    
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white border border-black/5 p-4 shadow-soft">
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Detected Domain</p>
                          <p className="font-extrabold text-applePurple mt-1">{analysisResult.detectedDomain}</p>
                        </div>
                        <div className="rounded-2xl bg-white border border-black/5 p-4 shadow-soft">
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Experience Level</p>
                          <p className="font-extrabold text-applePurple mt-1">{analysisResult.experienceLevel}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="font-black text-appleDark">Detected Skillsets:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.detectedSkills.map(sk => (
                            <span key={sk} className="rounded-full bg-applePurple/5 border border-applePurple/10 px-3 py-1 text-[11px] font-bold text-applePurple">{sk}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="font-black text-red-600">Technical Skill Gaps:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.skillGaps.map(gp => (
                            <span key={gp} className="rounded-full bg-red-50 border border-red-100 px-3 py-1 text-[11px] font-bold text-red-600">{gp}</span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-applePurple/[0.02] border border-applePurple/10 p-4 space-y-2">
                        <p className="font-black text-appleDark flex items-center gap-1.5 text-xs">
                          <Award size={14} className="text-applePurple" /> OPTIMIZED ROADMAP: {analysisResult.roadmap.title}
                        </p>
                        <ul className="text-xs space-y-1.5 text-neutral-500 list-inside list-disc">
                          {analysisResult.roadmap.steps.map((st, idx) => (
                            <li key={idx} className="font-semibold">{st}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="font-black text-appleDark">Improvement Suggestion:</p>
                        <p className="text-xs font-semibold text-neutral-400 mt-1 leading-relaxed">{analysisResult.improvementSuggestion}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <Sparkles size={28} className="text-applePurple opacity-30 animate-pulse" />
                    <h3 className="text-base font-black text-appleDark tracking-tight">Await AI Analysis</h3>
                    <p className="text-xs font-semibold text-neutral-400 leading-relaxed">
                      Submit your resume details in the left panel to populate full gap matching outputs and study path roadmaps.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EDIT PROFILE TAB CONTAINER */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-[650px] mx-auto animate-fade-up">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-appleDark tracking-tight">Edit Student Profile</h1>
              <p className="text-sm font-semibold text-neutral-400">Update your bio, name, telephone, or other dashboard attributes.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="glass-panel p-8 rounded-3xl shadow-soft space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="profile-name" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  placeholder="Your Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-phone" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Phone Number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  placeholder="Your Phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-bio" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Biography</label>
                <textarea
                  id="profile-bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full rounded-2xl border border-black/10 bg-appleGray/40 focus:bg-white p-4 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:ring-2 focus:ring-applePurple/5 transition duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
