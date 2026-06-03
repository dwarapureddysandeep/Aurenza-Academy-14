import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leadService, courseService, siteService, companyService, staffService } from '../services/db';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { 
  Users, Briefcase, Award, TrendingUp, Search, Download, Trash, Plus, 
  Settings, LogOut, LayoutDashboard, Edit3, MessageSquare, Save, X, Phone, Mail, MapPin, Globe
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('');
  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for leads
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Company management states
  const [companyDetails, setCompanyDetails] = useState({
    name: 'Aurenza Academy',
    email: 'aurenzaacademy@gmail.com',
    phone: '+91 7013057827',
    address: 'Premium Apple Cyber Tower, Jubilee Hills, Hyderabad, India',
    social_links: { linkedin: '', instagram: '', youtube: '', twitter: '' },
    branding: { primary_color: '', accent_color: '', logo_url: '' }
  });

  // Staff management states
  const [staff, setStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'counselor',
    permissions: ['leads']
  });

  // Course Creator modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    duration: '',
    level: 'Beginner',
    price: '',
    categoryName: 'Full Stack Development',
    mentorName: '',
    mentorExperience: '',
    mentorAvatar: 'M',
    mentorBio: '',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  });

  // Testimonial Creator states
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5
  });

  // Load all admin datasets
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [leadList, courseList, testimonialList] = await Promise.all([
          leadService.getLeads(),
          courseService.getCourses(),
          siteService.getTestimonials()
        ]);
        setLeads(leadList);
        setCourses(courseList);
        setTestimonials(testimonialList);
        
        // Load company details
        const details = await companyService.getCompanyDetails();
        setCompanyDetails(details);
        
        // Load staff list if admin
        if (user.role === 'admin') {
          const staffList = await staffService.getStaff();
          setStaff(staffList);
        }
      } catch (err) {
        toast.error('Failed to load administrative datastores.');
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [user.role]);

  // Set default tab based on user role once loaded
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'placement_officer') {
        setActiveTab('placements');
      } else {
        setActiveTab('leads');
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8c00bd] border-t-transparent"></div>
          <p className="text-lg font-semibold text-[#5f5071]">Loading Administrator Panel...</p>
        </div>
      </div>
    );
  }

  // Update lead status
  const handleUpdateLeadStatus = async (leadId, newStatus, currentNotes = '') => {
    try {
      const updated = await leadService.updateLeadStatus(leadId, newStatus, currentNotes);
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Lead update failed.');
    }
  };

  // Update lead notes inline
  const handleUpdateLeadNotes = async (leadId, notes, currentStatus) => {
    try {
      await leadService.updateLeadStatus(leadId, currentStatus, notes);
      toast.success('Lead notes updated!');
    } catch (err) {
      toast.error('Notes update failed.');
    }
  };

  // Add course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name.trim()) return toast.error('Course name required');
    if (!newCourse.duration.trim()) return toast.error('Duration required');
    if (!newCourse.price) return toast.error('Pricing required');

    try {
      const courseObj = {
        name: newCourse.name,
        slug: newCourse.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        categoryId: 'cat-4',
        categoryName: newCourse.categoryName,
        duration: newCourse.duration,
        level: newCourse.level,
        price: Number(newCourse.price),
        rating: 4.8,
        reviewsCount: 1,
        image: newCourse.image,
        mentor: {
          name: newCourse.mentorName || 'Senior Advisor',
          experience: newCourse.mentorExperience || '5+ Years Exp',
          avatar: newCourse.mentorAvatar || 'S',
          bio: newCourse.mentorBio || 'Professional Academy Mentor'
        },
        syllabus: [
          { module: 'Module 1: Introduction Foundations', details: 'Core pillars and environment installations.' },
          { module: 'Module 2: Practice Projects', details: 'Compiling real-world workflows.' }
        ],
        faqs: [
          { q: 'Is there direct chat support?', a: 'Yes, full admissions dashboard chat support is provided.' }
        ]
      };

      const saved = await courseService.saveCourse(courseObj);
      setCourses(prev => [...prev, saved]);
      toast.success('Course published successfully in academy catalog!');
      setShowCourseModal(false);
      setNewCourse({
        name: '', duration: '', level: 'Beginner', price: '', categoryName: 'Full Stack Development',
        mentorName: '', mentorExperience: '', mentorAvatar: 'M', mentorBio: '',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
      });
    } catch (err) {
      toast.error('Failed to publish course.');
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Course deleted from catalog.');
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  // Add Testimonial
  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.name.trim()) return toast.error('Student name required');
    if (!newTestimonial.role.trim()) return toast.error('Job role/title required');
    if (!newTestimonial.quote.trim()) return toast.error('Testimonial quote required');

    try {
      const saved = await siteService.submitTestimonial(newTestimonial);
      setTestimonials(prev => [...prev, saved]);
      toast.success('New student review posted successfully!');
      setShowTestimonialModal(false);
      setNewTestimonial({ name: '', role: '', quote: '', rating: 5 });
    } catch (e) {
      toast.error('Failed to submit review.');
    }
  };

  // CSV Export using papaparse
  const handleExportCSV = () => {
    if (leads.length === 0) return toast.error('No leads available to export');
    
    // Format leads data for clean export
    const formattedData = leads.map(l => ({
      ID: l.id,
      Name: l.name,
      Email: l.email,
      Phone: l.phone,
      Course: l.course,
      Message: l.message,
      Status: l.status,
      Notes: l.notes,
      SubmittedAt: new Date(l.created_at).toLocaleString()
    }));

    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aurenza_leads_export_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads CSV file generated and downloaded successfully!');
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Metrics calculating
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  // ==========================================
  // NEW CALLBACKS FOR COMPANY & STAFF
  // ==========================================
  
  // Company details updates
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      await companyService.updateCompanyDetails(companyDetails);
      toast.success('Company settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update company settings.');
    }
  };

  // Staff CRUD actions
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim()) return toast.error('Name required');
    if (!newStaff.email.trim()) return toast.error('Email required');
    
    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStaff.email.trim())) {
      return toast.error('Please enter a valid email address');
    }

    if (!editingStaff && !newStaff.password.trim()) return toast.error('Password required');
    if (newStaff.password.trim() && newStaff.password.trim().length < 6) return toast.error('Password must be 6+ chars');

    try {
      if (editingStaff) {
        // Edit staff mode
        const updated = await staffService.updateStaff(editingStaff.id, newStaff);
        setStaff(prev => prev.map(s => s.id === editingStaff.id ? updated : s));
        toast.success('Staff details updated successfully!');
      } else {
        // Add staff mode
        const added = await staffService.addStaff(newStaff);
        setStaff(prev => [...prev, added]);
        toast.success('New staff member added successfully!');
      }
      setShowStaffModal(false);
      setEditingStaff(null);
      setNewStaff({ name: '', email: '', phone: '', password: '', role: 'counselor', permissions: ['leads'] });
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    }
  };

  const handleEditStaffClick = (staffMember) => {
    setEditingStaff(staffMember);
    setNewStaff({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      password: '', // blank password unless changing
      role: staffMember.role,
      permissions: staffMember.permissions || []
    });
    setShowStaffModal(true);
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await staffService.deleteStaff(staffId);
      setStaff(prev => prev.filter(s => s.id !== staffId));
      toast.success('Staff member removed successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to remove staff.');
    }
  };

  const handleTogglePermission = (perm) => {
    setNewStaff(prev => {
      const perms = [...prev.permissions];
      if (perms.includes(perm)) {
        return { ...prev, permissions: perms.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...perms, perm] };
      }
    });
  };

  // Dynamic tab routing by role
  const getTabsForRole = (role) => {
    switch (role) {
      case 'admin':
        return [
          { id: 'leads', label: 'Leads Kanban', icon: Users },
          { id: 'courses', label: 'Course Manager', icon: Briefcase },
          { id: 'testimonials', label: 'Student Reviews', icon: MessageSquare },
          { id: 'company', label: 'Company Settings', icon: Settings },
          { id: 'staff', label: 'Staff Management', icon: Award }
        ];
      case 'counselor':
        return [
          { id: 'leads', label: 'Leads Kanban', icon: Users },
          { id: 'courses', label: 'Course Manager', icon: Briefcase }
        ];
      case 'placement_officer':
        return [
          { id: 'placements', label: 'Placement Center', icon: Award }
        ];
      case 'staff':
        return [
          { id: 'leads', label: 'Leads Kanban', icon: Users }
        ];
      default:
        return [];
    }
  };

  const navTabs = getTabsForRole(user.role);

  return (
    <div className="min-h-screen bg-white bg-soft-radial font-sans text-appleDark pt-20 flex relative overflow-hidden">
      {/* Ambient background blob */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-applePurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-20 w-[350px] h-[350px] rounded-full bg-appleGlow/5 blur-[100px] pointer-events-none" />

      {/* 1. SIDEBAR */}
      <aside className="w-72 bg-white/75 border-r border-r-black/5 hidden md:flex flex-col justify-between py-8 px-5 relative z-10 backdrop-blur-md">
        <div className="space-y-8">
          {/* Admin Avatar Profile */}
          <div className="flex items-center gap-3.5 bg-appleGray/50 border border-black/5 rounded-2xl p-4 shadow-soft">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-apple-gradient text-white text-sm font-black shadow-soft">
              {user.avatar || 'AA'}
            </div>
            <div>
              <h4 className="text-sm font-black text-appleDark leading-tight tracking-tight">{user.name}</h4>
              <span className="text-[9px] font-black text-applePurple uppercase tracking-wider block mt-0.5">{user.role}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navTabs.map(tab => (
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

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition duration-300"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* 2. MAIN CONTENTS */}
      <main className="flex-1 p-6 md:p-10 max-w-[1300px] overflow-y-auto space-y-8 relative z-10">
        
        {/* EXECUTIVE METRICS DASHBOARD */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up">
          {[
            { label: 'Total Leads Captured', value: totalLeads, rate: 'High Priority', icon: Users },
            { label: 'New / Inbox Leads', value: newLeads, rate: `${((newLeads / (totalLeads || 1)) * 100).toFixed(0)}% of total`, icon: Search },
            { label: 'Admissions Converted', value: convertedLeads, rate: 'Placement Ready', icon: Award },
            { label: 'Leads Conversion Rate', value: `${conversionRate}%`, rate: 'Optimal Ratio', icon: TrendingUp }
          ].map((item, idx) => (
            <div key={idx} className="premium-card rounded-3xl p-6 shadow-soft flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-3xl font-black text-appleDark tracking-tight">{item.value}</p>
                <span className="text-[10px] font-bold text-applePurple uppercase tracking-wider">{item.rate}</span>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-applePurple border border-applePurple/10 shadow-soft">
                <item.icon size={16} />
              </span>
            </div>
          ))}
        </div>

        {/* LEADS TAB CONTAINER */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-up">
            
            {/* Filter actions header */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-3xl shadow-soft">
              {/* Search leads */}
              <div className="relative w-full md:max-w-[380px] flex items-center bg-appleGray border border-black/[0.03] rounded-2xl px-4 transition-all duration-300 focus-within:border-applePurple/20 focus-within:bg-white">
                <Search size={16} className="text-applePurple opacity-85 shrink-0" />
                <input
                  type="text"
                  placeholder="Search lead name or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none"
                />
              </div>

              {/* CSV Export & Filter chips */}
              <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-neutral-600 outline-none hover:border-applePurple transition"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition shadow-soft"
                >
                  <Download size={15} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Kanban columns board / table listing */}
            <div className="glass-panel p-6 rounded-[32px] shadow-soft overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/[0.03] text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    <th className="pb-4">Lead Name</th>
                    <th className="pb-4">Email & Phone</th>
                    <th className="pb-4">Course Track</th>
                    <th className="pb-4">Status & Transitions</th>
                    <th className="pb-4">Counselor Notes Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03] text-sm font-semibold text-neutral-500">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-appleGray/40 duration-300">
                      {/* Name */}
                      <td className="py-5">
                        <p className="font-extrabold text-appleDark tracking-tight">{lead.name}</p>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{new Date(lead.created_at).toLocaleDateString()}</span>
                      </td>

                      {/* Contact info */}
                      <td className="py-5">
                        <p className="text-appleDark">{lead.email}</p>
                        <p className="text-xs font-bold text-neutral-400 mt-0.5">{lead.phone}</p>
                      </td>

                      {/* Course */}
                      <td className="py-5 font-black text-appleDark tracking-tight">{lead.course}</td>

                      {/* Status chips inline triggers */}
                      <td className="py-5">
                        <div className="flex items-center gap-1.5">
                          {['New', 'Contacted', 'Converted', 'Closed'].map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleUpdateLeadStatus(lead.id, st, lead.notes)}
                              className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase border tracking-wider transition duration-300 ${
                                lead.status === st
                                  ? st === 'New' ? 'bg-blue-50 text-blue-600 border-blue-200'
                                    : st === 'Contacted' ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : st === 'Converted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    : 'bg-red-50 text-red-600 border-red-200'
                                  : 'bg-white text-neutral-400 border-black/5 hover:border-applePurple'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Notes logs */}
                      <td className="py-5 max-w-[280px]">
                        <input
                          type="text"
                          defaultValue={lead.notes}
                          onBlur={(e) => handleUpdateLeadNotes(lead.id, e.target.value, lead.status)}
                          placeholder="Log counseling updates..."
                          className="w-full bg-appleGray/45 rounded-xl border border-black/5 px-3 py-2 text-xs font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple focus:bg-white transition duration-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COURSE MANAGER TAB CONTAINER */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-appleDark tracking-tight">Course Catalog Manager</h1>
              <button
                type="button"
                onClick={() => setShowCourseModal(true)}
                className="flex items-center gap-2 rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition"
              >
                <Plus size={15} />
                Create New Program
              </button>
            </div>

            {/* Courses grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map(c => (
                <div key={c.id} className="premium-card rounded-3xl overflow-hidden shadow-soft flex flex-col justify-between">
                  <div className="relative h-44 bg-neutral-50 border-b border-black/5">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(c.id)}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-soft hover:bg-red-50 transition duration-300 border border-black/5"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-wider text-applePurple bg-applePurple/5 px-2.5 py-1 rounded-full border border-applePurple/10 inline-block animate-fade-up">
                      {c.categoryName}
                    </span>
                    <h3 className="text-[17px] font-black text-appleDark tracking-tight line-clamp-1">{c.name}</h3>
                    
                    <div className="flex justify-between text-xs font-bold text-neutral-400 border-t border-black/[0.03] pt-4">
                      <span>Level: <strong className="text-appleDark font-bold">{c.level}</strong></span>
                      <span>Investment: <strong className="text-appleDark font-bold">₹{c.price.toLocaleString()}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLACEMENTS TAB CONTAINER (Placement Officer / Counselor / Admin) */}
        {activeTab === 'placements' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-appleDark tracking-tight">Admissions Placement Center</h1>
                <p className="text-xs font-semibold text-neutral-400 mt-1">Track and manage placed students and career transitions</p>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition"
              >
                <Download size={15} />
                Export Placed Records
              </button>
            </div>

            {/* Placements metrics */}
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: 'Total Placed Candidates', value: `${convertedLeads + 42} Students`, color: 'text-emerald-500' },
                { label: 'Highest Package Offered', value: '₹42.5 LPA', color: 'text-applePurple' },
                { label: 'Average Annual CTC', value: '₹8.6 LPA', color: 'text-appleDark' }
              ].map((m, i) => (
                <div key={i} className="premium-card rounded-3xl p-6 shadow-soft space-y-1">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">{m.label}</span>
                  <span className={`text-3xl font-black ${m.color} tracking-tight`}>{m.value}</span>
                  <span className="text-[10px] font-bold text-neutral-400 block pt-1">Accredited Placement Partners</span>
                </div>
              ))}
            </div>

            {/* Converted candidates lists */}
            <div className="glass-panel p-6 rounded-[32px] shadow-soft space-y-4">
              <h2 className="text-lg font-black text-appleDark tracking-tight">Active Placement Readiness Tracker</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-black/[0.03] text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      <th className="pb-3">Placed Student</th>
                      <th className="pb-3">Registered Contact</th>
                      <th className="pb-3">Enrolled Career Track</th>
                      <th className="pb-3">Placement Status</th>
                      <th className="pb-3">Current CTC Figure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.03] text-sm font-semibold text-neutral-500">
                    {leads.filter(l => l.status === 'Converted').map(l => (
                      <tr key={l.id} className="hover:bg-appleGray/30 duration-300">
                        <td className="py-4 font-extrabold text-appleDark tracking-tight">{l.name}</td>
                        <td className="py-4 text-xs">
                          <p>{l.email}</p>
                          <p className="text-neutral-400 font-bold mt-0.5">{l.phone}</p>
                        </td>
                        <td className="py-4 font-bold text-applePurple">{l.course}</td>
                        <td className="py-4">
                          <span className="rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase px-2.5 py-1 tracking-wider inline-block">
                            Placed Ready
                          </span>
                        </td>
                        <td className="py-4 font-black text-appleDark">
                          ₹{l.course.includes('AI') || l.course.includes('Data') ? '9.8' : '7.5'} LPA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COMPANY SETTINGS TAB CONTAINER (Admin exclusive) */}
        {activeTab === 'company' && user.role === 'admin' && (
          <div className="space-y-6 animate-fade-up max-w-[800px]">
            <div>
              <h1 className="text-2xl font-black text-appleDark tracking-tight">Company Management</h1>
              <p className="text-xs font-semibold text-neutral-400 mt-1">Configure academy global details, social handles, and theme options</p>
            </div>

            <form onSubmit={handleUpdateCompany} className="glass-panel p-6 sm:p-8 rounded-[32px] shadow-soft space-y-6 text-xs font-black uppercase tracking-wider text-neutral-400">
              {/* Basic company information */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-appleDark tracking-tight border-b border-black/5 pb-2">Basic Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label>Academy Name</label>
                    <input
                      type="text"
                      value={companyDetails.name}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Support Phone Number</label>
                    <input
                      type="text"
                      value={companyDetails.phone}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label>Public Support Email</label>
                    <input
                      type="email"
                      value={companyDetails.email}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Corporate Head Address</label>
                    <input
                      type="text"
                      value={companyDetails.address}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-4 pt-4 border-t border-black/5">
                <h3 className="text-sm font-black text-appleDark tracking-tight border-b border-black/5 pb-2">Social Channels</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label>LinkedIn Link</label>
                    <input
                      type="url"
                      value={companyDetails.social_links.linkedin}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, linkedin: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Instagram Link</label>
                    <input
                      type="url"
                      value={companyDetails.social_links.instagram}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, instagram: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label>YouTube Channel</label>
                    <input
                      type="url"
                      value={companyDetails.social_links.youtube}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, youtube: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Twitter Channel</label>
                    <input
                      type="url"
                      value={companyDetails.social_links.twitter}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        social_links: { ...prev.social_links, twitter: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                </div>
              </div>

              {/* Branding assets */}
              <div className="space-y-4 pt-4 border-t border-black/5">
                <h3 className="text-sm font-black text-appleDark tracking-tight border-b border-black/5 pb-2">Branding Settings</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label>Primary Theme Color</label>
                    <input
                      type="text"
                      value={companyDetails.branding.primary_color || '#6A00FF'}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        branding: { ...prev.branding, primary_color: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Accent Interactive Color</label>
                    <input
                      type="text"
                      value={companyDetails.branding.accent_color || '#8A2EFF'}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        branding: { ...prev.branding, accent_color: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Academy Brand Logo URL</label>
                    <input
                      type="text"
                      value={companyDetails.branding.logo_url || '/aurenza-logo.jpeg'}
                      onChange={(e) => setCompanyDetails(prev => ({ 
                        ...prev, 
                        branding: { ...prev.branding, logo_url: e.target.value } 
                      }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 hover:-translate-y-0.5 mt-4"
              >
                Save Global Brand Settings
              </button>
            </form>
          </div>
        )}

        {/* STAFF MANAGEMENT TAB CONTAINER (Admin exclusive) */}
        {activeTab === 'staff' && user.role === 'admin' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-appleDark tracking-tight">Staff Management</h1>
                <p className="text-xs font-semibold text-neutral-400 mt-1">Manage institutional admins, academic counselors, and placement officers</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingStaff(null);
                  setNewStaff({ name: '', email: '', phone: '', password: '', role: 'counselor', permissions: ['leads'] });
                  setShowStaffModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition"
              >
                <Plus size={15} />
                Register Staff User
              </button>
            </div>

            {/* Staff list */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {staff.map(s => (
                <div key={s.id} className="premium-card rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-sm font-black text-applePurple border border-applePurple/10 shadow-soft">
                        {s.avatar || 'S'}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-appleDark tracking-tight leading-tight">{s.name}</h4>
                        <span className="rounded-full bg-purple-50 text-applePurple text-[9px] font-black uppercase px-2 py-0.5 tracking-wider inline-block mt-1">
                          {s.role}
                        </span>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditStaffClick(s)}
                        className="rounded-lg p-1.5 bg-neutral-50 border border-black/5 hover:text-applePurple hover:bg-purple-50 duration-300"
                        title="Edit staff details"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(s.id)}
                        disabled={s.email === 'aurenzaacademy@gmail.com'}
                        className="rounded-lg p-1.5 bg-neutral-50 border border-black/5 text-red-500 hover:bg-red-50 disabled:opacity-30 duration-300"
                        title="Remove staff member"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-neutral-500 font-semibold border-t border-black/[0.03] pt-4">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-neutral-400 shrink-0" />
                      <span>{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-neutral-400 shrink-0" />
                      <span>{s.phone || 'Not Logged'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Access Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {s.permissions && s.permissions.length > 0 ? (
                        s.permissions.map(p => (
                          <span key={p} className="rounded-full bg-appleGray border border-black/5 text-[9px] font-extrabold text-neutral-600 px-2 py-0.5 capitalize">
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-400">Limited Dashboard View</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB CONTAINER */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-appleDark tracking-tight">Reviews Manager</h1>
              <button
                type="button"
                onClick={() => setShowTestimonialModal(true)}
                className="flex items-center gap-2 rounded-xl bg-applePurple hover:bg-appleGlow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition"
              >
                <Plus size={15} />
                Add Review
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map(test => (
                <div key={test.id} className="premium-card rounded-3xl p-6 shadow-soft space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-applePurple/5 text-sm font-black text-applePurple border border-applePurple/10 shadow-soft">
                      {test.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-appleDark tracking-tight">{test.name}</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-neutral-500">“{test.quote}”</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSE CREATOR DIALOG MODAL */}
        {showCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-appleDark/30 px-4 py-6 backdrop-blur-md">
            <div className="relative w-full max-w-[600px] glass-panel rounded-[32px] p-6 sm:p-8 shadow-premium max-h-[85vh] overflow-y-auto animate-fade-up">
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="absolute right-5 top-5 text-neutral-400 hover:text-applePurple transition"
              >
                <X size={18} />
              </button>
              
              <h3 className="text-2xl font-black text-appleDark tracking-tight mb-6">Create New Program</h3>
              
              <form onSubmit={handleCreateCourse} className="space-y-4 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Program Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Angular Frontend Dev"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Duration (Months)</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 months"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Accredited Pricing (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 29999"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Difficulty Level</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark outline-none focus:border-applePurple transition duration-300"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Mentor Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Sandeep Dev"
                      value={newCourse.mentorName}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, mentorName: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">Mentor Experience Statement</label>
                    <input
                      type="text"
                      placeholder="e.g. 10+ Years Exp at Adobe"
                      value={newCourse.mentorExperience}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, mentorExperience: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400">Course Thumbnail URL</label>
                  <input
                    type="text"
                    value={newCourse.image}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark outline-none focus:border-applePurple transition duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 mt-4 hover:-translate-y-0.5"
                >
                  Publish Program to Site
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TESTIMONIAL CREATOR DIALOG MODAL */}
        {showTestimonialModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-appleDark/30 px-4 py-6 backdrop-blur-md">
            <div className="relative w-full max-w-[500px] glass-panel rounded-[32px] p-6 sm:p-8 shadow-premium animate-fade-up">
              <button
                type="button"
                onClick={() => setShowTestimonialModal(false)}
                className="absolute right-5 top-5 text-neutral-400 hover:text-applePurple transition"
              >
                <X size={18} />
              </button>
              
              <h3 className="text-2xl font-black text-appleDark tracking-tight mb-6">Add Student Review</h3>
              
              <form onSubmit={handleCreateTestimonial} className="space-y-4 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <div className="space-y-1.5">
                  <label className="text-neutral-400">Student Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400">Job Role / Placement Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Architect at Amazon"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400">Testimonial Quote</label>
                  <textarea
                    rows={4}
                    placeholder="Review quote text details..."
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white p-3 text-sm font-semibold text-appleDark outline-none focus:border-applePurple transition duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 mt-4 hover:-translate-y-0.5"
                >
                  Publish Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STAFF CREATOR/EDITOR DIALOG MODAL (Admin exclusive) */}
        {showStaffModal && user.role === 'admin' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-appleDark/30 px-4 py-6 backdrop-blur-md">
            <div className="relative w-full max-w-[550px] glass-panel rounded-[32px] p-6 sm:p-8 shadow-premium max-h-[85vh] overflow-y-auto animate-fade-up">
              <button
                type="button"
                onClick={() => {
                  setShowStaffModal(false);
                  setEditingStaff(null);
                }}
                className="absolute right-5 top-5 text-neutral-400 hover:text-applePurple transition"
              >
                <X size={18} />
              </button>
              
              <h3 className="text-2xl font-black text-appleDark tracking-tight mb-6">
                {editingStaff ? 'Edit Staff Credentials' : 'Add New Staff Member'}
              </h3>
              
              <form onSubmit={handleAddStaff} className="space-y-4 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Sharma"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. anand@aurenzaacademy.com"
                      value={newStaff.email}
                      disabled={editingStaff && editingStaff.email === 'aurenzaacademy@gmail.com'}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder={editingStaff ? 'Leave blank to keep same' : 'Minimum 6 characters'}
                      value={newStaff.password}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark placeholder-neutral-400 outline-none focus:border-applePurple transition duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label>Assigned Institutional Role</label>
                  <select
                    value={newStaff.role}
                    disabled={editingStaff && editingStaff.email === 'aurenzaacademy@gmail.com'}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-2xl border border-black/10 bg-appleGray/45 focus:bg-white px-5 py-3.5 text-sm font-semibold text-appleDark outline-none focus:border-applePurple transition duration-300"
                  >
                    <option value="admin">System Administrator</option>
                    <option value="counselor">Academic Counselor</option>
                    <option value="placement_officer">Placement Officer</option>
                    <option value="staff">Limited Support Staff</option>
                  </select>
                </div>

                {/* Permissions checkboxes */}
                <div className="space-y-2 border-t border-black/5 pt-4">
                  <span className="text-[10px] font-black text-appleDark uppercase tracking-wider block">Access Permissions & Capabilities</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'leads', label: 'Access Lead Records' },
                      { id: 'courses', label: 'Modify Course Catalogs' },
                      { id: 'testimonials', label: 'Manage Reviews' },
                      { id: 'company', label: 'Edit Company Settings' },
                      { id: 'staff', label: 'Manage Staff Directory' }
                    ].map(p => (
                      <label key={p.id} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-600 cursor-pointer lowercase tracking-normal">
                        <input
                          type="checkbox"
                          checked={newStaff.permissions.includes(p.id)}
                          onChange={() => handleTogglePermission(p.id)}
                          className="h-4.5 w-4.5 accent-applePurple rounded border-neutral-300 focus:ring-applePurple"
                        />
                        <span className="capitalize">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-applePurple hover:bg-appleGlow py-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition duration-300 mt-4 hover:-translate-y-0.5"
                >
                  {editingStaff ? 'Save Staff Updates' : 'Register Staff Account'}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
