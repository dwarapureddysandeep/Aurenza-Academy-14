import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Singleton Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if PostgreSQL environment variable exists (excluding local mock values)
const hasDatabaseUrl = typeof process !== 'undefined' && 
                       !!process.env.DATABASE_URL && 
                       process.env.DATABASE_URL !== 'postgresql://postgres:postgres@localhost:5432/aurenza';

let prismaInstance: any;

if (hasDatabaseUrl) {
  try {
    prismaInstance = globalForPrisma.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
  } catch (err) {
    console.error('[Aurenza Database] Failed to initialize live Prisma Client, falling back to mock.', err);
    prismaInstance = null;
  }
}

export const USE_LOCAL_MOCK = process.env.USE_LOCAL_MOCK === 'false' ? false : !hasDatabaseUrl;
console.log(`[Aurenza Database] Mode: ${USE_LOCAL_MOCK ? 'OFFLINE LOCAL JSON FALLBACK' : 'LIVE SUPABASE POSTGRESQL'}`);

// ==========================================
// LOCAL FILE-BASED DATABASE STORAGE ENGINE
// ==========================================

const MOCK_DB_PATH = path.join(process.cwd(), 'prisma', 'db_mock.json');

// Default initial data for mock database (if file does not exist)
const DEFAULT_MOCK_DATA = {
  users: [
    {
      id: "user-admin",
      email: "info@aurenzaacademy.com",
      password: "aur_hash_aurenza_admin", // mock password representation
      name: "Aurenza Admin",
      phone: "+91 7013057827",
      role: "ADMIN",
      bio: "Executive Academy Administrator",
      avatar: "AA",
      permissions: ["leads", "courses", "testimonials", "company", "staff"],
      createdAt: new Date().toISOString()
    },
    {
      id: "user-student",
      email: "student@aurenzaacademy.com",
      password: "aur_hash_student_pass",
      name: "Sandeep Kumar",
      phone: "+91 9876543210",
      role: "STUDENT",
      bio: "Aspiring Full Stack Engineer",
      avatar: "SK",
      permissions: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "user-trainer",
      email: "trainer@aurenzaacademy.com",
      password: "aur_hash_trainer_pass",
      name: "Dr. Ramesh Kumar",
      phone: "+91 9999988888",
      role: "TRAINER",
      bio: "Ex-Amazon Senior Java Architect",
      avatar: "RK",
      permissions: [],
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: "cat-1", name: "Project Management", slug: "project-management" },
    { id: "cat-2", name: "Data Science", slug: "data-science" },
    { id: "cat-3", name: "AI & Machine Learning", slug: "ai-machine-learning" },
    { id: "cat-4", name: "Cloud Computing", slug: "cloud" },
    { id: "cat-5", name: "DevOps", slug: "devops" },
    { id: "cat-6", name: "Cyber Security", slug: "cyber-security" },
    { id: "cat-7", name: "Full Stack Development", slug: "full-stack" },
    { id: "cat-8", name: "Digital Marketing", slug: "digital-marketing" }
  ],
  courses: [
    {
      id: "course-java",
      name: "Java Full Stack Development",
      slug: "java-full-stack-development",
      categoryId: "cat-7",
      categoryName: "Full Stack Development",
      duration: "6 months",
      level: "Beginner -> Advanced",
      price: 34999,
      rating: 4.8,
      reviewsCount: 342,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      mentorName: "Dr. Ramesh Kumar",
      mentorExp: "12+ Years Exp at Oracle & Amazon",
      mentorAvatar: "R",
      mentorBio: "Ex-Amazon Senior Engineer specializing in high-performance Java systems.",
      syllabus: JSON.stringify([
        { module: "Module 1: Core Java Programming", details: "OOP principles, Collections Framework, Exception Handling, Multithreading & Stream API." },
        { module: "Module 2: Advanced Java & Database", details: "JDBC, MySQL foundations, Hibernate ORM, and database connection pools." },
        { module: "Module 3: Enterprise Spring Framework", details: "Spring Core, Spring Boot, Spring Data JPA, and RESTful Microservices." },
        { module: "Module 4: Frontend Integration", details: "HTML5, CSS3, JavaScript ES6, and connecting React frontends with Spring Boot." },
        { module: "Module 5: Testing, Security & Cloud", details: "JUnit testing, Spring Security, JWT, Docker, and AWS deployment." }
      ]),
      faqs: JSON.stringify([
        { q: "Are there any prerequisites for this course?", a: "No, this course starts completely from scratch. Basic programming familiarity is helpful but not mandatory." },
        { q: "Is there a placement assistance guarantee?", a: "Yes! We offer extensive mock interview sessions, resume polishing, and referrals with 500+ corporate hiring partners." }
      ]),
      createdAt: new Date().toISOString()
    },
    {
      id: "course-frontend",
      name: "Frontend Development (React & Next.js)",
      slug: "frontend-development-react-nextjs",
      categoryId: "cat-7",
      categoryName: "Full Stack Development",
      duration: "4 months",
      level: "Beginner",
      price: 24999,
      rating: 4.9,
      reviewsCount: 289,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
      mentorName: "Sarah D'Souza",
      mentorExp: "8+ Years Exp at Adobe & Flipkart",
      mentorAvatar: "S",
      mentorBio: "UI Architect focused on rendering optimization, custom animations, Framer Motion, and design systems.",
      syllabus: JSON.stringify([
        { module: "Module 1: UI Core & Layouts", details: "Semantic HTML5, CSS Flexbox & Grid, Responsive Design, and Tailwind CSS." },
        { module: "Module 2: Modern JavaScript (ES6+)", details: "DOM manipulation, Asynchronous programming, Fetch API, and Functional structures." },
        { module: "Module 3: Deep React Foundations", details: "Virtual DOM, JSX, State & Props, Custom Hooks, Context API, and State Managers." },
        { module: "Module 4: Modern Production Next.js", details: "App Router, Server Actions, SSR vs SSG, Routing, SEO optimization, and Image components." }
      ]),
      faqs: JSON.stringify([
        { q: "Will I build real projects?", a: "Absolutely! You will build 6 real-world web applications including a premium e-commerce portal and a SaaS dashboard." }
      ]),
      createdAt: new Date().toISOString()
    },
    {
      id: "course-aiml",
      name: "AI & Machine Learning Engineering",
      slug: "ai-machine-learning-engineering",
      categoryId: "cat-3",
      categoryName: "AI & Machine Learning",
      duration: "5 months",
      level: "Intermediate",
      price: 44999,
      rating: 4.9,
      reviewsCount: 198,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      mentorName: "Dr. Vivek Sharma",
      mentorExp: "Ph.D. in AI, ex-Google Brain Scientist",
      mentorAvatar: "V",
      mentorBio: "Researcher focused on NLP transformer models, generative architectures, and scaling neural network computing parameters.",
      syllabus: JSON.stringify([
        { module: "Module 1: Mathematical Foundations", details: "Calculus optimization, Gradient Descent, Vector Calculus, and Probability." },
        { module: "Module 2: Deep Learning & Neural Networks", details: "Perceptrons, Backpropagation, MLP, and TensorFlow/PyTorch ecosystems." },
        { module: "Module 3: Computer Vision (CV)", details: "CNNs, Image Segmentation, OpenCV, YOLO model object detection." },
        { module: "Module 4: Natural Language Processing (NLP)", details: "LSTMs, Transformers, Attention mechanism, HuggingFace transformers, and LLM fine-tuning." }
      ]),
      faqs: JSON.stringify([
        { q: "Can I do this course part-time?", a: "Yes! All lectures are live-streamed on weekends and recorded in 4K resolution for asynchronous self-paced review." }
      ]),
      createdAt: new Date().toISOString()
    },
    ...require('./generated_array.json')
  ],
  trainers: [
    { id: "trainer-1", name: "Dr. Ramesh Kumar", email: "trainer@aurenzaacademy.com", avatar: "RK", bio: "Ex-Amazon Senior Java Architect", specialty: "Java Full Stack & System Design", createdAt: new Date().toISOString() },
    { id: "trainer-2", name: "Sarah D'Souza", email: "sarah@aurenzaacademy.com", avatar: "SD", bio: "UI Architect & Framer Expert", specialty: "React, Next.js, and CSS Systems", createdAt: new Date().toISOString() }
  ],
  batches: [
    { id: "batch-1", courseId: "course-java", trainerId: "trainer-1", startDate: "June 15, 2026", timeSlot: "7:00 PM - 9:00 PM IST", seatsTotal: 30, seatsLeft: 22, linkZoom: "https://zoom.us/j/mock-java-meeting", createdAt: new Date().toISOString() },
    { id: "batch-2", courseId: "course-frontend", trainerId: "trainer-2", startDate: "June 10, 2026", timeSlot: "8:00 AM - 10:00 AM IST", seatsTotal: 25, seatsLeft: 18, linkZoom: "https://zoom.us/j/mock-frontend-meeting", createdAt: new Date().toISOString() }
  ],
  enrollments: [
    { id: "enr-1", userId: "user-student", courseId: "course-frontend", progress: 65, lastLesson: "Module 3: React Custom Hooks", enrolledAt: new Date().toISOString() }
  ],
  payments: [
    { id: "pay-1", userId: "user-student", courseId: "course-frontend", amount: 24999.0, status: "Success", txId: "TXN-MOCK-FED8237", date: new Date().toISOString() }
  ],
  leads: [
    { id: "lead-1", name: "Aarav Mehta", email: "aarav.mehta@gmail.com", phone: "+91 9123456789", course: "Java Full Stack Development", message: "Interested in evening weekend cohorts", status: "NEW", notes: "", createdAt: new Date().toISOString() },
    { id: "lead-2", name: "Esha Gupta", email: "esha.gupta@yahoo.com", phone: "+91 8234567890", course: "AI & Machine Learning Engineering", message: "Looking for scholarship opportunities", status: "CONTACTED", notes: "Called today, interested in AI course syllabus.", createdAt: new Date().toISOString() }
  ],
  corporateLeads: [],
  webinars: [
    { id: "webinar-1", title: "Mastering Generative AI & Large Language Models", description: "Learn how to build and fine-tune enterprise LLMs from scratch.", speaker: "Dr. Vivek Sharma", date: "June 05, 2026", time: "6:00 PM IST", link: "https://zoom.us/j/mock-webinar-ai", registrationsCount: 142, status: "Upcoming", createdAt: new Date().toISOString() }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "The Ultimate Next.js 15 App Router Migration Guide",
      slug: "nextjs-15-migration-guide",
      content: "Next.js 15 introduces dynamic improvements for server actions, styling caches, and compiling speeds. In this guide, we dive deep into how full-stack architects can upgrade existing apps seamlessly.",
      category: "Software Development",
      authorId: "user-admin",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      tags: ["Next.js", "React 19", "Web Development"],
      views: 310,
      createdAt: new Date().toISOString()
    }
  ],
  testimonials: [
    { id: "test-1", name: "Ananya Sharma", role: "Software Engineer at Microsoft", quote: "Got placed at Microsoft with 18 LPA. The intensive roadmap and 1-on-1 industry mock reviews completely changed my trajectory.", rating: 5, featured: true, initial: "A" },
    { id: "test-2", name: "Rohit Verma", role: "Data Scientist at Amazon", quote: "Highly structure-driven syllabus. I came from a non-CS engineering background, and within 6 months, pivoted into data engineering.", rating: 5, featured: true, initial: "R" }
  ],
  roadmaps: [],
  certificates: [
    { id: "cert-1", userId: "user-student", courseId: "course-frontend", name: "Sandeep Kumar", courseName: "Frontend Development (React & Next.js)", completionDate: "May 20, 2026", certId: "AUR-FED-2026-0047", createdAt: new Date().toISOString() }
  ],
  reviews: []
};

// Ensure prisma folder exists
const prismaFolder = path.dirname(MOCK_DB_PATH);
if (!fs.existsSync(prismaFolder)) {
  fs.mkdirSync(prismaFolder, { recursive: true });
}

// Ensure mock db file exists
if (!fs.existsSync(MOCK_DB_PATH)) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(DEFAULT_MOCK_DATA, null, 2), 'utf-8');
}

// Read/write helpers for Mock Database
const readMockDb = (): any => {
  try {
    const content = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return DEFAULT_MOCK_DATA;
  }
};

const writeMockDb = (data: any) => {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// ==========================================
// METADATA PRISMA MODEL PROXIES
// ==========================================

const createMockModelProxy = (tableName: string) => {
  return {
    findMany: async (args?: any) => {
      const db = readMockDb();
      let list = db[tableName] || [];
      
      // Handle simple filtering: where { userId: 'xxx' } or where { email: 'xxx' }
      if (args?.where) {
        list = list.filter((item: any) => {
          for (const key in args.where) {
            const filterVal = args.where[key];
            if (typeof filterVal === 'object' && filterVal !== null) {
              // E.g. { equals: '...' }
              if ('equals' in filterVal && item[key] !== filterVal.equals) return false;
            } else if (item[key] !== filterVal) {
              return false;
            }
          }
          return true;
        });
      }
      return list;
    },

    findUnique: async (args: any) => {
      const db = readMockDb();
      const list = db[tableName] || [];
      const item = list.find((i: any) => {
        for (const key in args.where) {
          if (i[key] === args.where[key]) return true;
        }
        return false;
      });
      return item || null;
    },

    findFirst: async (args: any) => {
      const db = readMockDb();
      const list = db[tableName] || [];
      const item = list.find((i: any) => {
        if (!args?.where) return true;
        for (const key in args.where) {
          if (i[key] !== args.where[key]) return false;
        }
        return true;
      });
      return item || null;
    },

    create: async (args: any) => {
      const db = readMockDb();
      if (!db[tableName]) db[tableName] = [];
      
      const newRecord = {
        id: args.data.id || `${tableName.substring(0, 4)}-${Date.now()}`,
        ...args.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      db[tableName].push(newRecord);
      writeMockDb(db);
      return newRecord;
    },

    update: async (args: any) => {
      const db = readMockDb();
      const list = db[tableName] || [];
      const idx = list.findIndex((i: any) => {
        for (const key in args.where) {
          if (i[key] === args.where[key]) return true;
        }
        return false;
      });
      
      if (idx === -1) throw new Error(`Record to update not found in mock table: ${tableName}`);
      
      const updatedRecord = {
        ...list[idx],
        ...args.data,
        updatedAt: new Date().toISOString()
      };
      
      list[idx] = updatedRecord;
      db[tableName] = list;
      writeMockDb(db);
      return updatedRecord;
    },

    upsert: async (args: any) => {
      const db = readMockDb();
      const list = db[tableName] || [];
      const idx = list.findIndex((i: any) => {
        for (const key in args.where) {
          if (i[key] === args.where[key]) return true;
        }
        return false;
      });

      if (idx !== -1) {
        // Update
        const updated = {
          ...list[idx],
          ...args.update,
          updatedAt: new Date().toISOString()
        };
        list[idx] = updated;
        db[tableName] = list;
        writeMockDb(db);
        return updated;
      } else {
        // Create
        const created = {
          id: args.create.id || `${tableName.substring(0, 4)}-${Date.now()}`,
          ...args.create,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        list.push(created);
        db[tableName] = list;
        writeMockDb(db);
        return created;
      }
    },

    delete: async (args: any) => {
      const db = readMockDb();
      const list = db[tableName] || [];
      const idx = list.findIndex((i: any) => {
        for (const key in args.where) {
          if (i[key] === args.where[key]) return true;
        }
        return false;
      });

      if (idx === -1) throw new Error(`Record to delete not found in mock table: ${tableName}`);
      
      const deletedRecord = list[idx];
      db[tableName] = list.filter((_: any, index: number) => index !== idx);
      writeMockDb(db);
      return deletedRecord;
    },

    count: async (args?: any) => {
      const db = readMockDb();
      let list = db[tableName] || [];
      if (args?.where) {
        list = list.filter((item: any) => {
          for (const key in args.where) {
            if (item[key] !== args.where[key]) return false;
          }
          return true;
        });
      }
      return list.length;
    }
  };
};

// Interceptor Proxy mimicking Prisma client properties
export const mockPrismaProxy = new Proxy({}, {
  get: (target, propName: string) => {
    // Intercept database properties
    const mappedTables: Record<string, string> = {
      user: 'users',
      category: 'categories',
      course: 'courses',
      trainer: 'trainers',
      batch: 'batches',
      enrollment: 'enrollments',
      payment: 'payments',
      lead: 'leads',
      corporateLead: 'corporateLeads',
      webinar: 'webinars',
      blog: 'blogs',
      testimonial: 'testimonials',
      roadmap: 'roadmaps',
      certificate: 'certificates',
      review: 'reviews',
      assignment: 'assignments',
      attendance: 'attendances',
      notificationSetting: 'notificationSettings',
      notificationLog: 'notificationLogs'
    };

    if (propName in mappedTables) {
      return createMockModelProxy(mappedTables[propName]);
    }
    
    if (propName === '$connect' || propName === '$disconnect') {
      return async () => {};
    }

    return undefined;
  }
});

// Unified resilient database client proxy with automatic local JSON fallback
const createResilientDbProxy = () => {
  const liveDb = prismaInstance;
  const mockDb = mockPrismaProxy;

  return new Proxy({}, {
    get: (target, propName: string) => {
      if (USE_LOCAL_MOCK) {
        return (mockDb as any)[propName];
      }

      const liveModel = liveDb ? (liveDb as any)[propName] : null;
      const mockModel = (mockDb as any)[propName];

      if (!liveModel) {
        return mockModel;
      }

      if (typeof liveModel === 'function') {
        return async (...args: any[]) => {
          try {
            return await liveModel(...args);
          } catch (err) {
            console.error(`[Aurenza Database] Live query failed on ${propName}, falling back to mock:`, err);
            return typeof mockModel === 'function' ? await mockModel(...args) : mockModel;
          }
        };
      }

      // Wrap prisma model methods (findMany, findUnique, findFirst, create, update, delete, count, upsert, etc.)
      return new Proxy(liveModel, {
        get: (modelTarget, method: string) => {
          const liveMethod = modelTarget[method];
          const mockMethod = mockModel ? mockModel[method] : null;

          if (typeof liveMethod === 'function') {
            return async (...args: any[]) => {
              try {
                return await liveMethod.apply(modelTarget, args);
              } catch (err) {
                console.error(`[Aurenza Database] Live query failed on ${propName}.${method}, falling back to mock:`, err);
                if (mockMethod && typeof mockMethod === 'function') {
                  return await mockMethod(...args);
                }
                throw err;
              }
            };
          }
          return liveMethod;
        }
      });
    }
  });
};

export const db = createResilientDbProxy() as unknown as PrismaClient;
