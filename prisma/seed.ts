import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seeder] Starting database seeding...');

  // 1. Clean Database
  console.log('[Seeder] Cleaning existing tables...');
  await prisma.review.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.corporateLead.deleteMany({});
  await prisma.webinar.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Default Accounts
  console.log('[Seeder] Seeding users...');
  const admin = await prisma.user.create({
    data: {
      id: "user-admin",
      name: "Aurenza Admin",
      email: "aurenzaacademy@gmail.com",
      password: "aur_hash_aurenza_admin", // Mock representation of hashed password
      phone: "+91 7013057827",
      role: "ADMIN",
      bio: "Executive Academy Administrator",
      avatar: "AA",
      permissions: ["leads", "courses", "testimonials", "company", "staff"],
    },
  });

  const student = await prisma.user.create({
    data: {
      id: "user-student",
      name: "Sandeep Kumar",
      email: "student@aurenzaacademy.com",
      password: "aur_hash_student_pass",
      phone: "+91 9876543210",
      role: "STUDENT",
      bio: "Aspiring Full Stack Engineer",
      avatar: "SK",
      permissions: [],
    },
  });

  const trainerUser = await prisma.user.create({
    data: {
      id: "user-trainer",
      name: "Dr. Ramesh Kumar",
      email: "trainer@aurenzaacademy.com",
      password: "aur_hash_trainer_pass",
      phone: "+91 9999988888",
      role: "TRAINER",
      bio: "Ex-Amazon Senior Java Architect",
      avatar: "RK",
      permissions: [],
    },
  });

  // 3. Seed Course Categories
  console.log('[Seeder] Seeding categories...');
  const pmCat = await prisma.category.create({ data: { id: "cat-1", name: "Project Management", slug: "project-management" } });
  const dsCat = await prisma.category.create({ data: { id: "cat-2", name: "Data Science", slug: "data-science" } });
  const aiCat = await prisma.category.create({ data: { id: "cat-3", name: "AI & Machine Learning", slug: "ai-machine-learning" } });
  const cloudCat = await prisma.category.create({ data: { id: "cat-4", name: "Cloud Computing", slug: "cloud" } });
  const devopsCat = await prisma.category.create({ data: { id: "cat-5", name: "DevOps", slug: "devops" } });
  const cyberCat = await prisma.category.create({ data: { id: "cat-6", name: "Cyber Security", slug: "cyber-security" } });
  const fsCat = await prisma.category.create({ data: { id: "cat-7", name: "Full Stack Development", slug: "full-stack" } });
  const mktCat = await prisma.category.create({ data: { id: "cat-8", name: "Digital Marketing", slug: "digital-marketing" } });

  // 4. Seed Course Mentors / Trainers
  console.log('[Seeder] Seeding trainers...');
  const trainer1 = await prisma.trainer.create({
    data: {
      id: "trainer-1",
      name: "Dr. Ramesh Kumar",
      email: "trainer@aurenzaacademy.com",
      avatar: "RK",
      bio: "Ex-Amazon Senior Java Architect specializing in distributed web engineering.",
      specialty: "Java Full Stack & System Design",
    },
  });

  const trainer2 = await prisma.trainer.create({
    data: {
      id: "trainer-2",
      name: "Sarah D'Souza",
      email: "sarah@aurenzaacademy.com",
      avatar: "SD",
      bio: "UI Architect focused on rendering optimization and custom animations.",
      specialty: "React, Next.js, and CSS Systems",
    },
  });

  // 5. Seed Core Courses
  console.log('[Seeder] Seeding courses...');
  const courseJava = await prisma.course.create({
    data: {
      id: "course-java",
      name: "Java Full Stack Development",
      slug: "java-full-stack-development",
      categoryId: fsCat.id,
      duration: "6 months",
      level: "Beginner -> Advanced",
      price: 34999.0,
      rating: 4.8,
      reviewsCount: 342,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      mentorName: "Dr. Ramesh Kumar",
      mentorExp: "12+ Years Exp at Oracle & Amazon",
      mentorAvatar: "R",
      mentorBio: "Ex-Amazon Senior Engineer specializing in high-performance Java systems and distributed architecture.",
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
    },
  });

  const courseFrontend = await prisma.course.create({
    data: {
      id: "course-frontend",
      name: "Frontend Development (React & Next.js)",
      slug: "frontend-development-react-nextjs",
      categoryId: fsCat.id,
      duration: "4 months",
      level: "Beginner",
      price: 24999.0,
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
    },
  });

  const courseAI = await prisma.course.create({
    data: {
      id: "course-aiml",
      name: "AI & Machine Learning Engineering",
      slug: "ai-machine-learning-engineering",
      categoryId: aiCat.id,
      duration: "5 months",
      level: "Intermediate",
      price: 44999.0,
      rating: 4.9,
      reviewsCount: 198,
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
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
    },
  });

  // 6. Seed Cohorts / Batches
  console.log('[Seeder] Seeding cohorts...');
  await prisma.batch.create({
    data: {
      id: "batch-1",
      courseId: courseJava.id,
      trainerId: trainer1.id,
      startDate: "June 15, 2026",
      timeSlot: "7:00 PM - 9:00 PM IST",
      seatsTotal: 30,
      seatsLeft: 22,
      linkZoom: "https://zoom.us/j/mock-java-meeting",
    },
  });

  await prisma.batch.create({
    data: {
      id: "batch-2",
      courseId: courseFrontend.id,
      trainerId: trainer2.id,
      startDate: "June 10, 2026",
      timeSlot: "8:00 AM - 10:00 AM IST",
      seatsTotal: 25,
      seatsLeft: 18,
      linkZoom: "https://zoom.us/j/mock-frontend-meeting",
    },
  });

  // 7. Seed Enrollments & Payments
  console.log('[Seeder] Seeding enrollments...');
  await prisma.enrollment.create({
    data: {
      id: "enr-1",
      userId: student.id,
      courseId: courseFrontend.id,
      progress: 65,
      lastLesson: "Module 3: React Custom Hooks",
    },
  });

  await prisma.payment.create({
    data: {
      id: "pay-1",
      userId: student.id,
      courseId: courseFrontend.id,
      amount: 24999.0,
      status: "Success",
      txId: "TXN-MOCK-FED8237",
    },
  });

  // 8. Seed Leads
  console.log('[Seeder] Seeding crm leads...');
  await prisma.lead.create({
    data: {
      id: "lead-1",
      name: "Aarav Mehta",
      email: "aarav.mehta@gmail.com",
      phone: "+91 9123456789",
      course: "Java Full Stack Development",
      message: "Interested in evening weekend cohorts",
      status: "NEW",
      notes: "",
    },
  });

  await prisma.lead.create({
    data: {
      id: "lead-2",
      name: "Esha Gupta",
      email: "esha.gupta@yahoo.com",
      phone: "+91 8234567890",
      course: "AI & Machine Learning Engineering",
      message: "Looking for scholarship opportunities",
      status: "CONTACTED",
      notes: "Called today, interested in AI course syllabus.",
    },
  });

  // 9. Seed Webinars
  console.log('[Seeder] Seeding webinars...');
  await prisma.webinar.create({
    data: {
      id: "webinar-1",
      title: "Mastering Generative AI & Large Language Models",
      description: "Learn how to build and fine-tune enterprise LLMs from scratch.",
      speaker: "Dr. Vivek Sharma",
      date: "June 05, 2026",
      time: "6:00 PM IST",
      link: "https://zoom.us/j/mock-webinar-ai",
      registrationsCount: 142,
      status: "Upcoming",
    },
  });

  // 10. Seed Blogs
  console.log('[Seeder] Seeding blogs...');
  await prisma.blog.create({
    data: {
      id: "blog-1",
      title: "The Ultimate Next.js 15 App Router Migration Guide",
      slug: "nextjs-15-migration-guide",
      content: "Next.js 15 introduces dynamic improvements for server actions, styling caches, and compiling speeds. In this guide, we dive deep into how full-stack architects can upgrade existing apps seamlessly.",
      category: "Software Development",
      authorId: admin.id,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      tags: ["Next.js", "React 19", "Web Development"],
      views: 310,
    },
  });

  // 11. Seed Testimonials & Certificates
  console.log('[Seeder] Seeding testimonials & certificates...');
  await prisma.testimonial.create({
    data: {
      id: "test-1",
      name: "Ananya Sharma",
      role: "Software Engineer at Microsoft",
      quote: "Got placed at Microsoft with 18 LPA. The intensive roadmap and 1-on-1 industry mock reviews completely changed my trajectory.",
      rating: 5,
      featured: true,
      initial: "A",
    },
  });

  await prisma.testimonial.create({
    data: {
      id: "test-2",
      name: "Rohit Verma",
      role: "Data Scientist at Amazon",
      quote: "Highly structure-driven syllabus. I came from a non-CS engineering background, and within 6 months, pivoted into data engineering.",
      rating: 5,
      featured: true,
      initial: "R",
    },
  });

  await prisma.certificate.create({
    data: {
      id: "cert-1",
      userId: student.id,
      courseId: courseFrontend.id,
      name: "Sandeep Kumar",
      courseName: "Frontend Development (React & Next.js)",
      completionDate: "May 20, 2026",
      certId: "AUR-FED-2026-0047",
    },
  });

  console.log('[Seeder] Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seeder] Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
