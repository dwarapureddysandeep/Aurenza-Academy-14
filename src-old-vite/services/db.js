import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client if env variables exist
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const USE_LOCAL_DB = !supabase;

console.log(`[Aurenza Database] Running in ${USE_LOCAL_DB ? 'Local Persistent Storage fallback' : 'Supabase Cloud'} mode`);

// ==========================================
// SEED DATA CONFIGURATION
// ==========================================

const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Software Development', slug: 'software-development' },
  { id: 'cat-2', name: 'Frontend Development', slug: 'frontend-development' },
  { id: 'cat-3', name: 'Backend Development', slug: 'backend-development' },
  { id: 'cat-4', name: 'Full Stack Development', slug: 'full-stack-development' },
  { id: 'cat-5', name: 'Mobile App Development', slug: 'mobile-app-development' },
  { id: 'cat-6', name: 'Data Science', slug: 'data-science' },
  { id: 'cat-7', name: 'AI & Machine Learning', slug: 'ai-machine-learning' },
  { id: 'cat-8', name: 'Cyber Security', slug: 'cyber-security' },
  { id: 'cat-9', name: 'Cloud Computing', slug: 'cloud-computing' },
  { id: 'cat-10', name: 'DevOps', slug: 'devops' },
  { id: 'cat-11', name: 'Database Management', slug: 'database-management' },
  { id: 'cat-12', name: 'Aptitude & Interview Prep', slug: 'aptitude-interview-prep' },
  { id: 'cat-13', name: 'Career Bootcamps', slug: 'career-bootcamps' },
  { id: 'cat-14', name: 'UI/UX Design', slug: 'ui-ux-design' },
  { id: 'cat-15', name: 'Product Management', slug: 'product-management' },
  { id: 'cat-16', name: 'Digital Marketing', slug: 'digital-marketing' },
  { id: 'cat-17', name: 'MBA Foundations', slug: 'mba-foundations' },
  { id: 'cat-18', name: 'QA & Software Testing', slug: 'software-testing' },
  { id: 'cat-19', name: 'Blockchain Tech', slug: 'blockchain' },
  { id: 'cat-20', name: 'Game Development', slug: 'game-development' },
  { id: 'cat-21', name: 'Salesforce & CRM', slug: 'salesforce' },
  { id: 'cat-22', name: 'Business Analytics', slug: 'business-analytics' },
  { id: 'cat-23', name: 'Internet of Things (IoT)', slug: 'iot' },
  { id: 'cat-24', name: 'AR & VR Development', slug: 'ar-vr' },
  { id: 'cat-25', name: 'Embedded Systems', slug: 'embedded-systems' },
  { id: 'cat-26', name: 'RPA & Automation', slug: 'rpa-automation' },
  { id: 'cat-27', name: 'Ethical Hacking', slug: 'ethical-hacking' },
  { id: 'cat-28', name: 'Data Visualization', slug: 'data-visualization' }
];

const SEED_COURSES = [
  {
    id: 'course-java',
    name: 'Java Full Stack Development',
    slug: 'java-full-stack-development',
    categoryId: 'cat-4',
    categoryName: 'Full Stack Development',
    duration: '6 months',
    level: 'Beginner -> Advanced',
    price: 34999,
    rating: 4.8,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Dr. Ramesh Kumar',
      experience: '12+ Years Exp at Oracle & Amazon',
      avatar: 'R',
      bio: 'Ex-Amazon Senior Engineer specializing in high-performance Java systems and distributed microservices architecture.'
    },
    syllabus: [
      { module: 'Module 1: Core Java Programming', details: 'OOP principles, Collections Framework, Exception Handling, Multithreading & Stream API.' },
      { module: 'Module 2: Advanced Java & Database', details: 'JDBC, MySQL foundations, Hibernate ORM, and database connection pools.' },
      { module: 'Module 3: Enterprise Spring Framework', details: 'Spring Core, Spring Boot, Spring Data JPA, and RESTful Microservices.' },
      { module: 'Module 4: Frontend Integration', details: 'HTML5, CSS3, JavaScript ES6, and connecting React frontends with Spring Boot backends.' },
      { module: 'Module 5: Testing, Security & Cloud', details: 'JUnit testing, Spring Security, JWT, Docker, and AWS Elastic Beanstalk deployment.' }
    ],
    faqs: [
      { q: 'Are there any prerequisites for this course?', a: 'No, this course starts completely from scratch. Basic programming familiarity is helpful but not mandatory.' },
      { q: 'Is there a placement assistance guarantee?', a: 'Yes! We offer extensive mock interview sessions, resume polishing, and referrals with 500+ corporate hiring partners.' }
    ]
  },
  {
    id: 'course-frontend',
    name: 'Frontend Development (React & Next.js)',
    slug: 'frontend-development-react-nextjs',
    categoryId: 'cat-2',
    categoryName: 'Frontend Development',
    duration: '4 months',
    level: 'Beginner',
    price: 24999,
    rating: 4.9,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Sarah D\'Souza',
      experience: '8+ Years Exp at Adobe & Flipkart',
      avatar: 'S',
      bio: 'UI Architect focused on rendering optimization, custom animations, Framer Motion, and scalable frontend design systems.'
    },
    syllabus: [
      { module: 'Module 1: UI Core & Layouts', details: 'Semantic HTML5, CSS Flexbox & Grid, Responsive Design, and Tailwind CSS.' },
      { module: 'Module 2: Modern JavaScript (ES6+)', details: 'DOM manipulation, Asynchronous programming, Fetch API, and Functional structures.' },
      { module: 'Module 3: Deep React Foundations', details: 'Virtual DOM, JSX, State & Props, Custom Hooks, Context API, and State Managers.' },
      { module: 'Module 4: Modern Production Next.js', details: 'App Router, Server Actions, SSR vs SSG, Routing, SEO optimization, and Image components.' },
      { module: 'Module 5: State & Deployment', details: 'Zustand, React Query, Vercel optimization, and custom package components.' }
    ],
    faqs: [
      { q: 'Will I build real projects?', a: 'Absolutely! You will build 6 real-world web applications including a premium e-commerce portal and a SaaS dashboard.' }
    ]
  },
  {
    id: 'course-datascience',
    name: 'Data Science & Analytics',
    slug: 'data-science-analytics',
    categoryId: 'cat-6',
    categoryName: 'Data Science',
    duration: '6 months',
    level: 'Intermediate',
    price: 39999,
    rating: 4.7,
    reviewsCount: 254,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Aditya Sen',
      experience: '10+ Years Lead Data Scientist at Microsoft',
      avatar: 'A',
      bio: 'Mathematician turned Data Scientist. Expert in statistical modeling, neural networks, Big Data, and automated data pipelines.'
    },
    syllabus: [
      { module: 'Module 1: Python for Data Science', details: 'NumPy, Pandas, Matplotlib, Seaborn, and scripting pipelines.' },
      { module: 'Module 2: Advanced Statistics & SQL', details: 'Probability, Linear Algebra, Hypothesis Testing, SQL Joins, Aggregations, and CTEs.' },
      { module: 'Module 3: Machine Learning Core', details: 'Supervised Learning (Regression, Trees), Unsupervised (Clustering), and Scikit-Learn.' },
      { module: 'Module 4: Big Data & Spark', details: 'Hadoop ecosystems, PySpark DataFrame, and streaming aggregations.' },
      { module: 'Module 5: Visualization & Dashboards', details: 'Tableau dashboard setups, PowerBI modeling, and hosting Jupyter notebooks.' }
    ],
    faqs: [
      { q: 'Do I need a strong math background?', a: 'High school algebra is sufficient. We cover all necessary statistics, probability, and matrix math during the course.' }
    ]
  },
  {
    id: 'course-aiml',
    name: 'AI & Machine Learning Engineering',
    slug: 'ai-machine-learning-engineering',
    categoryId: 'cat-7',
    categoryName: 'AI & Machine Learning',
    duration: '5 months',
    level: 'Intermediate',
    price: 44999,
    rating: 4.9,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Dr. Vivek Sharma',
      experience: 'Ph.D. in AI, ex-Google Brain Scientist',
      avatar: 'V',
      bio: 'Researcher focused on NLP transformer models, generative architectures, and scaling neural network computing parameters.'
    },
    syllabus: [
      { module: 'Module 1: Mathematical Foundations', details: 'Calculus optimization, Gradient Descent, Vector Calculus, and Probability.' },
      { module: 'Module 2: Deep Learning & Neural Networks', details: 'Perceptrons, Backpropagation, MLP, and TensorFlow/PyTorch ecosystems.' },
      { module: 'Module 3: Computer Vision (CV)', details: 'CNNs, Image Segmentation, OpenCV, YOLO model object detection.' },
      { module: 'Module 4: Natural Language Processing (NLP)', details: 'LSTMs, Transformers, Attention mechanism, HuggingFace transformers, and LLM fine-tuning.' },
      { module: 'Module 5: MLOps & Production', details: 'MLflow model versioning, FastAPI deployment, Docker, and AWS SageMaker endpoints.' }
    ],
    faqs: [
      { q: 'Can I do this course part-time?', a: 'Yes! All lectures are live-streamed on weekends and recorded in 4K resolution for asynchronous self-paced review.' }
    ]
  },
  {
    id: 'course-aptitude',
    name: 'Aptitude & Interview Bootcamp',
    slug: 'aptitude-interview-bootcamp',
    categoryId: 'cat-12',
    categoryName: 'Aptitude & Interview Prep',
    duration: '2 months',
    level: 'All Levels',
    price: 9999,
    rating: 4.8,
    reviewsCount: 521,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Karan Mehra',
      experience: '7+ Years Quantitative Aptitude Coach',
      avatar: 'K',
      bio: 'Prepped over 15,000 students for CAT, GMAT, and placements at top product companies.'
    },
    syllabus: [
      { module: 'Module 1: Quantitative Aptitude', details: 'Percentage, Profit & Loss, Time & Work, Speed Distance, Permutations & Combinations.' },
      { module: 'Module 2: Logical Reasoning', details: 'Syllogisms, Blood Relations, Puzzles, Coding-Decoding, Seating Arrangements.' },
      { module: 'Module 3: Verbal Ability & Resume', details: 'Sentence correction, Reading comprehension, Vocabulary, and Resume grammar styling.' },
      { module: 'Module 4: Technical Mock Interviews', details: 'Coding patterns, System design basics, and behavioral interview methods.' }
    ],
    faqs: [
      { q: 'Are standard placement assessments covered?', a: 'Yes! We cover syllabus patterns of TCS NQT, Infosys, Capgemini, Accenture, and AMCAT.' }
    ]
  },
  {
    id: 'course-bootcamp',
    name: 'Career Transition Bootcamp',
    slug: 'career-transition-bootcamp',
    categoryId: 'cat-13',
    categoryName: 'Career Bootcamps',
    duration: '3 months',
    level: 'Beginner',
    price: 19999,
    rating: 4.6,
    reviewsCount: 172,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Priyanka Sen',
      experience: 'HR Director, 10+ Years in Tech Talent Acquisition',
      avatar: 'P',
      bio: 'Ex-Lead Recruiter specializing in career pivoting, non-tech to tech transitions, and salary negotiation skills.'
    },
    syllabus: [
      { module: 'Module 1: Tech Ecosystem Overview', details: 'Web technology stack, software development lifecycles, and role breakdowns.' },
      { module: 'Module 2: Essential Tech Stack', details: 'Git/GitHub versioning, Command Line, HTML/CSS markup, and visual designers.' },
      { module: 'Module 3: Personal Branding & LinkedIn', details: 'LinkedIn SEO indexing, networking outreach strategies, and portfolio building.' },
      { module: 'Module 4: Interview Communication', details: 'Elevator pitching, answering corporate scenarios, and portfolio case studies.' }
    ],
    faqs: [
      { q: 'Can non-technical graduates apply?', a: 'Absolutely! More than 65% of this bootcamp students are from non-technical disciplines.' }
    ]
  }
];

const SEED_TESTIMONIALS = [
  { id: 'test-1', initial: 'A', name: 'Ananya Sharma', role: 'Software Engineer', quote: 'Got placed at TCS with 8 LPA. The mentorship was unmatched.', rating: 5, featured: true },
  { id: 'test-2', initial: 'R', name: 'Rohit Verma', role: 'Data Analyst', quote: 'Aurenza changed my career path. Now working as a Data Analyst at Flipkart.', rating: 5, featured: true },
  { id: 'test-3', initial: 'P', name: 'Priya Patel', role: 'Full Stack Dev', quote: 'The full stack course is industry-grade. Highly recommended.', rating: 5, featured: true },
  { id: 'test-4', initial: 'K', name: 'Kunal Sen', role: 'Frontend Architect', quote: 'Mentorship was absolutely incredible, learned React inside and out in months!', rating: 5, featured: false }
];

// Simple secure encoding function representing password hashing
export const hashPassword = (password) => {
  if (!password) return '';
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'aur_hash_' + Math.abs(hash).toString(16);
};

// Default accounts with hashed passwords
const DEFAULT_ACCOUNTS = [
  { id: 'user-admin', email: 'aurenzaacademy@gmail.com', password: hashPassword('Aurenza@0210'), name: 'Aurenza Admin', phone: '+91 7013057827', role: 'admin', bio: 'Executive Academy Administrator', avatar: 'AA', permissions: ['leads', 'courses', 'testimonials', 'company', 'staff'] },
  { id: 'user-student', email: 'student@aurenzaacademy.com', password: hashPassword('Student@123'), name: 'Sandeep Kumar', phone: '+91 9876543210', role: 'student', bio: 'Aspiring Full Stack Engineer', avatar: 'SK' }
];

// Helper to write to LocalStorage
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
// Helper to read from LocalStorage
const getStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Initialize Local Database with seed data if empty
if (USE_LOCAL_DB) {
  if (!getStorage('aurenza_categories')) setStorage('aurenza_categories', SEED_CATEGORIES);
  if (!getStorage('aurenza_courses')) setStorage('aurenza_courses', SEED_COURSES);
  if (!getStorage('aurenza_testimonials')) setStorage('aurenza_testimonials', SEED_TESTIMONIALS);
  
  if (!getStorage('aurenza_users')) {
    setStorage('aurenza_users', DEFAULT_ACCOUNTS);
  } else {
    // Force make sure that the real admin credentials exist
    const users = getStorage('aurenza_users') || [];
    const adminIndex = users.findIndex(u => u.email.toLowerCase() === 'aurenzaacademy@gmail.com');
    if (adminIndex === -1) {
      // Remove any old 'admin@aurenzaacademy.com' admin user and add the new one
      const filtered = users.filter(u => u.email.toLowerCase() !== 'admin@aurenzaacademy.com');
      filtered.push({
        id: 'user-admin',
        email: 'aurenzaacademy@gmail.com',
        password: hashPassword('Aurenza@0210'),
        name: 'Aurenza Admin',
        phone: '+91 7013057827',
        role: 'admin',
        bio: 'Executive Academy Administrator',
        avatar: 'AA',
        permissions: ['leads', 'courses', 'testimonials', 'company', 'staff']
      });
      setStorage('aurenza_users', filtered);
    } else {
      // Ensure existing admin credentials have the correct password/role/permissions
      users[adminIndex].role = 'admin';
      users[adminIndex].password = hashPassword('Aurenza@0210');
      users[adminIndex].permissions = ['leads', 'courses', 'testimonials', 'company', 'staff'];
      setStorage('aurenza_users', users);
    }
  }

  if (!getStorage('aurenza_leads')) setStorage('aurenza_leads', [
    { id: 'lead-1', name: 'Aarav Mehta', email: 'aarav.mehta@gmail.com', phone: '+91 9123456789', course: 'Java Full Stack Development', message: 'Interested in evening weekend cohorts', status: 'New', notes: '', created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
    { id: 'lead-2', name: 'Esha Gupta', email: 'esha.gupta@yahoo.com', phone: '+91 8234567890', course: 'Data Science & Analytics', message: 'Looking for scholarship opportunities', status: 'Contacted', notes: 'Scheduled counseling callback for tomorrow', created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: 'lead-3', name: 'Rohan Joshi', email: 'rohan.joshi@outlook.com', phone: '+91 7345678901', course: 'AI & Machine Learning Engineering', message: 'Interested in custom corporate pricing', status: 'Converted', notes: 'Enrolled in AI Engineering course!', created_at: new Date(Date.now() - 12 * 3600000).toISOString() }
  ]);
  if (!getStorage('aurenza_enrollments')) setStorage('aurenza_enrollments', [
    { id: 'enr-1', user_id: 'user-student', course_id: 'course-java', progress: 68, last_lesson: 'Module 3: Enterprise Spring Framework', enrolled_at: '2026-03-10T09:00:00Z' },
    { id: 'enr-2', user_id: 'user-student', course_id: 'course-frontend', progress: 100, last_lesson: 'Module 5: State & Deployment (Complete)', enrolled_at: '2026-02-15T09:00:00Z' }
  ]);
  if (!getStorage('aurenza_payments')) setStorage('aurenza_payments', [
    { id: 'pay-1', user_id: 'user-student', course_id: 'course-java', amount: 34999, status: 'Success', date: '2026-03-10T09:05:00Z', tx_id: 'TXN-JFS9234A' },
    { id: 'pay-2', user_id: 'user-student', course_id: 'course-frontend', amount: 24999, status: 'Success', date: '2026-02-15T09:10:00Z', tx_id: 'TXN-FED8472B' }
  ]);
  if (!getStorage('aurenza_certificates')) setStorage('aurenza_certificates', [
    { id: 'cert-1', user_id: 'user-student', course_id: 'course-frontend', name: 'Sandeep Kumar', course_name: 'Frontend Development (React & Next.js)', completion_date: '2026-04-20', cert_id: 'AUR-FED-202604-0021' }
  ]);
  if (!getStorage('aurenza_session')) {
    // Empty session by default
  }
}

// ==========================================
// AUTHENTICATION CONTROLLERS
// ==========================================

export const authService = {
  signUp: async (email, password, name, phone) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, phone } } });
      if (error) throw error;
      await supabase.from('user_roles').insert({ user_id: data.user.id, role: 'student' });
      return data.user;
    } else {
      const users = getStorage('aurenza_users') || [];
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User with this email already exists.');
      }
      const newUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase(),
        password: hashPassword(password),
        name,
        phone,
        role: 'student',
        bio: 'Tech learner at Aurenza Academy',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      };
      users.push(newUser);
      setStorage('aurenza_users', users);
      
      // Auto sign-in and session setting
      setStorage('aurenza_session', newUser);
      return newUser;
    }
  },

  signIn: async (email, password) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).single();
      const userObj = { ...data.user, role: roleData?.role || 'student' };
      return userObj;
    } else {
      const users = getStorage('aurenza_users') || [];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== hashPassword(password)) {
        throw new Error('Invalid email or password.');
      }
      setStorage('aurenza_session', user);
      return user;
    }
  },

  signOut: async () => {
    if (!USE_LOCAL_DB) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('aurenza_session');
    }
    return true;
  },

  getCurrentUser: () => {
    if (!USE_LOCAL_DB) {
      return null;
    } else {
      return getStorage('aurenza_session');
    }
  },

  updateProfile: async (userId, updateData) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('profiles').update(updateData).eq('id', userId).select().single();
      if (error) throw error;
      return data;
    } else {
      const users = getStorage('aurenza_users') || [];
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found.');
      
      // If updating password, hash it!
      let updatedData = { ...updateData };
      if (updateData.password) {
        updatedData.password = hashPassword(updateData.password);
      }
      
      const updatedUser = { ...users[index], ...updatedData };
      users[index] = updatedUser;
      setStorage('aurenza_users', users);
      
      const currentSession = getStorage('aurenza_session');
      if (currentSession && currentSession.id === userId) {
        setStorage('aurenza_session', updatedUser);
      }
      return updatedUser;
    }
  }
};

// ==========================================
// COURSE & CATEGORY CONTROLLERS
// ==========================================

export const courseService = {
  getCategories: async () => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    } else {
      return getStorage('aurenza_categories') || [];
    }
  },

  getCourses: async () => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('courses').select('*');
      if (error) throw error;
      return data;
    } else {
      return getStorage('aurenza_courses') || [];
    }
  },

  getCourseBySlug: async (slug) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('courses').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data;
    } else {
      const courses = getStorage('aurenza_courses') || [];
      const course = courses.find(c => c.slug === slug);
      if (!course) throw new Error('Course not found.');
      return course;
    }
  },

  saveCourse: async (courseObj) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('courses').upsert(courseObj).select().single();
      if (error) throw error;
      return data;
    } else {
      const courses = getStorage('aurenza_courses') || [];
      if (courseObj.id) {
        const index = courses.findIndex(c => c.id === courseObj.id);
        if (index !== -1) {
          courses[index] = { ...courses[index], ...courseObj };
        } else {
          courses.push(courseObj);
        }
      } else {
        courseObj.id = `course-${Date.now()}`;
        courseObj.slug = courseObj.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        courses.push(courseObj);
      }
      setStorage('aurenza_courses', courses);
      return courseObj;
    }
  },

  deleteCourse: async (id) => {
    if (!USE_LOCAL_DB) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const courses = getStorage('aurenza_courses') || [];
      const filtered = courses.filter(c => c.id !== id);
      setStorage('aurenza_courses', filtered);
      return true;
    }
  }
};

// ==========================================
// LEADS & Capture CONTROLLERS
// ==========================================

export const leadService = {
  getLeads: async () => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return getStorage('aurenza_leads') || [];
    }
  },

  submitLead: async (leadData) => {
    const newLead = {
      id: `lead-${Date.now()}`,
      ...leadData,
      status: 'New',
      notes: '',
      created_at: new Date().toISOString()
    };

    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('leads').insert(newLead).select().single();
      if (error) throw error;
      
      // OPTIONAL: Call Resend via edge function if connected
      try {
        await supabase.functions.invoke('send-lead-email', { body: newLead });
      } catch (err) {
        console.warn('Edge email function invoked, failed or not running in local test mode.', err.message);
      }
      
      return data;
    } else {
      const leads = getStorage('aurenza_leads') || [];
      leads.unshift(newLead);
      setStorage('aurenza_leads', leads);
      
      // Simulate Email logging to console
      console.log(`[EMAIL DISPATCH] Lead capture triggered:
      To Admin: aurenzaacademy@gmail.com
      Alert: New Lead capture! Name: ${newLead.name}, Email: ${newLead.email}, Phone: ${newLead.phone}, Course: ${newLead.course}
      
      To Student: ${newLead.email}
      Subject: Welcome to Aurenza Academy!
      Content: Dear ${newLead.name}, thank you for choosing Aurenza. Our counselor will contact you shortly.`);
      
      return newLead;
    }
  },

  updateLeadStatus: async (leadId, status, notes = '') => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('leads').update({ status, notes }).eq('id', leadId).select().single();
      if (error) throw error;
      return data;
    } else {
      const leads = getStorage('aurenza_leads') || [];
      const index = leads.findIndex(l => l.id === leadId);
      if (index === -1) throw new Error('Lead not found.');
      leads[index] = { ...leads[index], status, notes };
      setStorage('aurenza_leads', leads);
      return leads[index];
    }
  }
};

// ==========================================
// STUDENT ACTIONS & PORTALS
// ==========================================

export const studentService = {
  getEnrollments: async (userId) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('enrollments').select('*, courses(*)').eq('user_id', userId);
      if (error) throw error;
      return data;
    } else {
      const enrollments = getStorage('aurenza_enrollments') || [];
      const courses = getStorage('aurenza_courses') || [];
      return enrollments
        .filter(e => e.user_id === userId)
        .map(e => ({
          ...e,
          courses: courses.find(c => c.id === e.course_id)
        }));
    }
  },

  enrollInCourse: async (userId, courseId, amountPaid = 24999) => {
    const newEnrollment = {
      id: `enr-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      progress: 0,
      last_lesson: 'Introduction to Course',
      enrolled_at: new Date().toISOString()
    };

    const newPayment = {
      id: `pay-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      amount: amountPaid,
      status: 'Success',
      date: new Date().toISOString(),
      tx_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    if (!USE_LOCAL_DB) {
      await supabase.from('payments').insert(newPayment);
      const { data, error } = await supabase.from('enrollments').insert(newEnrollment).select().single();
      if (error) throw error;
      return data;
    } else {
      // Enroll
      const enrollments = getStorage('aurenza_enrollments') || [];
      if (enrollments.some(e => e.user_id === userId && e.course_id === courseId)) {
        return enrollments.find(e => e.user_id === userId && e.course_id === courseId);
      }
      enrollments.push(newEnrollment);
      setStorage('aurenza_enrollments', enrollments);

      // Log payment
      const payments = getStorage('aurenza_payments') || [];
      payments.push(newPayment);
      setStorage('aurenza_payments', payments);

      return newEnrollment;
    }
  },

  getPayments: async (userId) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('payments').select('*, courses(*)').eq('user_id', userId);
      if (error) throw error;
      return data;
    } else {
      const payments = getStorage('aurenza_payments') || [];
      const courses = getStorage('aurenza_courses') || [];
      return payments
        .filter(p => p.user_id === userId)
        .map(p => ({
          ...p,
          courses: courses.find(c => c.id === p.course_id)
        }));
    }
  },

  getCertificates: async (userId) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('certificates').select('*').eq('user_id', userId);
      if (error) throw error;
      return data;
    } else {
      const certificates = getStorage('aurenza_certificates') || [];
      return certificates.filter(c => c.user_id === userId);
    }
  },

  generateCertificate: async (userId, userName, courseId, courseName) => {
    const newCertificate = {
      id: `cert-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      name: userName,
      course_name: courseName,
      completion_date: new Date().toISOString().substring(0, 10),
      cert_id: `AUR-${courseId.replace('course-', '').toUpperCase()}-${new Date().toISOString().substring(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('certificates').insert(newCertificate).select().single();
      if (error) throw error;
      return data;
    } else {
      const certificates = getStorage('aurenza_certificates') || [];
      if (certificates.some(c => c.user_id === userId && c.course_id === courseId)) {
        return certificates.find(c => c.user_id === userId && c.course_id === courseId);
      }
      certificates.push(newCertificate);
      setStorage('aurenza_certificates', certificates);
      return newCertificate;
    }
  },

  updateCourseProgress: async (userId, courseId, progress, lastLesson) => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('enrollments')
        .update({ progress, last_lesson: lastLesson })
        .match({ user_id: userId, course_id: courseId })
        .select().single();
      if (error) throw error;
      return data;
    } else {
      const enrollments = getStorage('aurenza_enrollments') || [];
      const index = enrollments.findIndex(e => e.user_id === userId && e.course_id === courseId);
      if (index === -1) throw new Error('Enrollment not found.');
      
      const updated = { ...enrollments[index], progress, last_lesson: lastLesson };
      enrollments[index] = updated;
      setStorage('aurenza_enrollments', enrollments);
      return updated;
    }
  }
};

// ==========================================
// TESTIMONIALS & NEWSLETTER CONTROLLERS
// ==========================================

export const siteService = {
  getTestimonials: async () => {
    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (error) throw error;
      return data;
    } else {
      return getStorage('aurenza_testimonials') || [];
    }
  },

  submitTestimonial: async (testimonialData) => {
    const newTestimonial = {
      id: `test-${Date.now()}`,
      initial: testimonialData.name[0].toUpperCase(),
      featured: false,
      ...testimonialData
    };

    if (!USE_LOCAL_DB) {
      const { data, error } = await supabase.from('testimonials').insert(newTestimonial).select().single();
      if (error) throw error;
      return data;
    } else {
      const testimonials = getStorage('aurenza_testimonials') || [];
      testimonials.push(newTestimonial);
      setStorage('aurenza_testimonials', testimonials);
      return newTestimonial;
    }
  },

  submitNewsletter: async (email) => {
    if (!USE_LOCAL_DB) {
      const { error } = await supabase.from('newsletters').insert({ email, created_at: new Date().toISOString() });
      if (error) throw error;
      return true;
    } else {
      const newsletters = getStorage('aurenza_newsletters') || [];
      if (!newsletters.includes(email)) {
        newsletters.push(email);
        setStorage('aurenza_newsletters', newsletters);
      }
      return true;
    }
  }
};

// ==========================================
// COMPANY MANAGEMENT CONTROLLERS
// ==========================================

const DEFAULT_COMPANY = {
  name: 'Aurenza Academy',
  email: 'aurenzaacademy@gmail.com',
  phone: '+91 7013057827',
  address: 'Premium Apple Cyber Tower, Jubilee Hills, Hyderabad, India',
  social_links: {
    linkedin: 'https://linkedin.com/company/aurenza-academy',
    instagram: 'https://instagram.com/aurenza_academy',
    youtube: 'https://youtube.com/c/aurenza_academy',
    twitter: 'https://twitter.com/aurenza_academy'
  },
  branding: {
    primary_color: '#6A00FF',
    accent_color: '#8A2EFF',
    logo_url: '/aurenza-logo.jpeg'
  }
};

// Initialize default company details
if (USE_LOCAL_DB && !getStorage('aurenza_company')) {
  setStorage('aurenza_company', DEFAULT_COMPANY);
}

export const companyService = {
  getCompanyDetails: async () => {
    if (!USE_LOCAL_DB) {
      return DEFAULT_COMPANY;
    } else {
      return getStorage('aurenza_company') || DEFAULT_COMPANY;
    }
  },
  updateCompanyDetails: async (companyDetails) => {
    if (!USE_LOCAL_DB) {
      return companyDetails;
    } else {
      setStorage('aurenza_company', companyDetails);
      return companyDetails;
    }
  }
};

// ==========================================
// STAFF MANAGEMENT CONTROLLERS
// ==========================================

export const staffService = {
  getStaff: async () => {
    const users = getStorage('aurenza_users') || [];
    // Staff are users whose role is admin, counselor, staff, or placement_officer
    return users.filter(u => ['admin', 'counselor', 'staff', 'placement_officer'].includes(u.role));
  },
  addStaff: async (staffData) => {
    const users = getStorage('aurenza_users') || [];
    if (users.some(u => u.email.toLowerCase() === staffData.email.toLowerCase())) {
      throw new Error('Email already registered');
    }
    const newStaff = {
      id: `staff-${Date.now()}`,
      name: staffData.name,
      email: staffData.email.toLowerCase(),
      phone: staffData.phone,
      password: hashPassword(staffData.password),
      role: staffData.role,
      bio: `${staffData.role.toUpperCase()} team member`,
      avatar: staffData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      permissions: staffData.permissions || []
    };
    users.push(newStaff);
    setStorage('aurenza_users', users);
    return newStaff;
  },
  updateStaff: async (staffId, updateData) => {
    const users = getStorage('aurenza_users') || [];
    const index = users.findIndex(u => u.id === staffId);
    if (index === -1) throw new Error('Staff user not found');
    
    // Don't let editing email of primary administrator to prevent locks
    if (users[index].email === 'aurenzaacademy@gmail.com' && updateData.email !== 'aurenzaacademy@gmail.com') {
      throw new Error('Cannot change email of primary administrator.');
    }

    // Check if password is being updated, hash it if it changed
    let password = users[index].password;
    if (updateData.password && updateData.password !== users[index].password) {
      password = hashPassword(updateData.password);
    }
    
    users[index] = {
      ...users[index],
      ...updateData,
      password
    };
    setStorage('aurenza_users', users);
    return users[index];
  },
  deleteStaff: async (staffId) => {
    const users = getStorage('aurenza_users') || [];
    const staff = users.find(u => u.id === staffId);
    if (staff && staff.email === 'aurenzaacademy@gmail.com') {
      throw new Error('Cannot delete primary administrator.');
    }
    const filtered = users.filter(u => u.id !== staffId);
    setStorage('aurenza_users', filtered);
    return true;
  }
};
