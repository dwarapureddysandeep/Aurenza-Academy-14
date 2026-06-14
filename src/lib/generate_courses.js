const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  "cat-1": "Project Management",
  "cat-2": "Data Science",
  "cat-3": "AI & Machine Learning",
  "cat-4": "Cloud Computing",
  "cat-5": "DevOps",
  "cat-6": "Cyber Security",
  "cat-7": "Full Stack Development",
  "cat-8": "Digital Marketing"
};

const COURSES_TO_GENERATE = [
  // 6 Trending Courses explicitly added with precise IDs
  { name: "AWS Solutions Architect", cat: "cat-4", level: "Intermediate", id: "course-aws" },
  { name: "PMP Certification", cat: "cat-1", level: "Intermediate -> Advanced", id: "course-pmp" },
  { name: "Certified ScrumMaster (CSM)", cat: "cat-1", level: "Beginner", id: "course-csm" },
  { name: "Microsoft Azure Administrator", cat: "cat-4", level: "Intermediate", id: "course-azure" },
  { name: "Data Science & AI Bootcamp", cat: "cat-2", level: "Intermediate -> Advanced", id: "course-dsai" },
  { name: "DevOps Engineer Program", cat: "cat-5", level: "Intermediate", id: "course-devops" },

  // Remaining Flagship Certifications
  { name: "CSPO Certification", cat: "cat-1", level: "Beginner" },
  { name: "Leading SAFe 6.0 Certification", cat: "cat-1", level: "Intermediate" },
  { name: "ITIL Foundation Certification", cat: "cat-1", level: "Beginner" },
  { name: "PRINCE2 Certifications", cat: "cat-1", level: "Intermediate" },
  { name: "PSM Certification", cat: "cat-1", level: "Beginner" },
  { name: "SAFe 6.0 POPM Certification", cat: "cat-1", level: "Intermediate" },
  { name: "SAFe 6.0 Practice Consultant Certification", cat: "cat-1", level: "Advanced" },
  { name: "SAFe 6.0 Scrum Master Certification", cat: "cat-1", level: "Beginner" },
  { name: "SAFe 6.0 RTE Certification", cat: "cat-1", level: "Advanced" },
  { name: "ECBA Certification", cat: "cat-1", level: "Beginner" },
  { name: "CAPM Certification", cat: "cat-1", level: "Beginner" },
  { name: "PSPO Certification", cat: "cat-1", level: "Beginner" },
  { name: "PMI-ACP Certification", cat: "cat-1", level: "Intermediate" },
  { name: "ICP-ACC Certification", cat: "cat-1", level: "Intermediate" },
  { name: "Microsoft Power BI", cat: "cat-2", level: "Beginner" },
  { name: "A-CSM Certification", cat: "cat-1", level: "Advanced" },
  { name: "PgMP Certification", cat: "cat-1", level: "Advanced" },
  { name: "AWS Solutions Architect Associate Certification", cat: "cat-4", level: "Intermediate" },
  { name: "CBAP Certification", cat: "cat-1", level: "Advanced" },
  { name: "A-CSPO Certification", cat: "cat-1", level: "Advanced" },
  { name: "Lean Six Sigma Green Belt Certification", cat: "cat-1", level: "Intermediate" },
  { name: "SAFe 6.0 Agile Product Management", cat: "cat-1", level: "Advanced" },
  { name: "SAFe 6.0 Lean Portfolio Management", cat: "cat-1", level: "Advanced" },
  { name: "AWS Cloud Architect Master's Program", cat: "cat-4", level: "Intermediate -> Advanced" },
  { name: "CISSP Certification", cat: "cat-6", level: "Advanced" },
  { name: "SAFe 6.0 Advanced Scrum Master Certification", cat: "cat-1", level: "Advanced" },
  { name: "PSM-A Certification", cat: "cat-1", level: "Advanced" },
  { name: "SAFe 6.0 DevOps Certification", cat: "cat-5", level: "Intermediate" },
  { name: "PRINCE2 Foundation Certification", cat: "cat-1", level: "Beginner" },
  { name: "Agile Master's Program", cat: "cat-1", level: "Intermediate" },
  { name: "PSPO-A Certification", cat: "cat-1", level: "Advanced" },
  { name: "Azure Data Engineer Master's Program", cat: "cat-4", level: "Intermediate -> Advanced" },
  { name: "Project Management Master's Program", cat: "cat-1", level: "Intermediate -> Advanced" },
  { name: "PRINCE2 Agile Certifications", cat: "cat-1", level: "Intermediate" },
  { name: "Agile Excellence Master's Program", cat: "cat-1", level: "Intermediate -> Advanced" },
  { name: "Certified Scrum Developer Certification", cat: "cat-1", level: "Intermediate" }
];

const MENTORS = [
  { name: "Sanjay Shah (Agile SPC)", exp: "15+ Years at Deloitte & IBM", avatar: "SS", bio: "Enterprise Agile Transformation Coach specializing in SAFe and Scrum frameworks." },
  { name: "Ravi Shastri (Cloud Architect)", exp: "12+ Years at AWS & Cognizant", avatar: "RS", bio: "Senior Cloud Architect specializing in enterprise migration and serverless setups." },
  { name: "Sarah D'Souza (PMP Coach)", exp: "14+ Years Lead Consultant", avatar: "SD", bio: "Senior project manager and certified PMP instructor with 98% pass rates." },
  { name: "Dr. Ramesh Kumar", exp: "12+ Years Exp at Oracle & Amazon", avatar: "RK", bio: "Software architect and project delivery analyst." }
];

// Helper mapping relevant Unsplash images to specific courses and categories
function getPremiumImageForCourse(name, catId) {
  const n = name.toLowerCase();
  
  if (n.includes('aws') || n.includes('amazon')) {
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"; // cloud architecture
  }
  if (n.includes('azure') || n.includes('microsoft')) {
    return "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80"; // enterprise infrastructure
  }
  if (n.includes('devops') || n.includes('docker') || n.includes('kubernetes')) {
    return "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80"; // devops pipeline
  }
  if (n.includes('java') || n.includes('full stack') || n.includes('frontend') || n.includes('react') || n.includes('scrum developer')) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"; // code IDE editor
  }
  if (n.includes('power bi')) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"; // dashboard
  }
  if (n.includes('data science') || n.includes('analysis') || n.includes('statistics')) {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"; // business graphs
  }
  if (n.includes('ai &') || n.includes('machine learning') || n.includes('artificial intelligence') || n.includes('deep learning')) {
    return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"; // neural connections
  }
  if (n.includes('cissp') || n.includes('security') || n.includes('hack') || n.includes('ethical')) {
    return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"; // security shields
  }
  if (n.includes('marketing') || n.includes('seo') || n.includes('adwords')) {
    return "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80"; // digital marketing boards
  }
  if (n.includes('pmp') || n.includes('scrummaster') || n.includes('csm') || n.includes('cspo') || n.includes('safe') || n.includes('itil') || n.includes('prince2') || n.includes('agile') || n.includes('scrum') || n.includes('project') || n.includes('portfolio') || n.includes('product owner')) {
    return "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"; // whiteboard scrum workshop
  }
  
  // Category Default Fallbacks
  switch (catId) {
    case 'cat-1': return "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"; // agile
    case 'cat-2': return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"; // data science
    case 'cat-3': return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"; // AI
    case 'cat-4': return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"; // cloud
    case 'cat-5': return "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80"; // DevOps
    case 'cat-6': return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"; // cyber sec
    case 'cat-7': return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"; // dev
    case 'cat-8': return "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80"; // digital marketing
    default: return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";
  }
}

function generateCourseData() {
  return COURSES_TO_GENERATE.map((c, index) => {
    const slug = c.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    // Fall back to slugified ID unless custom ID is explicitly declared
    const id = c.id || `course-${slug}`;
    const image = getPremiumImageForCourse(c.name, c.cat);
    const mentor = MENTORS[index % MENTORS.length];
    
    const isProgram = c.name.includes("Program") || c.name.includes("Bootcamp") || c.name.includes("Master's");
    const duration = isProgram ? "6 months" : (c.name.includes("Advanced") || c.name.includes("A-") || c.name.includes("RTE") || c.name.includes("CISSP") ? "2 months" : "6 weeks");
    const price = isProgram ? 39999 : (c.name.includes("Advanced") || c.name.includes("PgMP") || c.name.includes("CISSP") || c.name.includes("LSM") ? 29999 : 19999);
    const rating = parseFloat((4.7 + Math.random() * 0.25).toFixed(1));
    const reviewsCount = Math.floor(120 + Math.random() * 300);

    const syllabus = [
      { module: "Module 1: Framework Foundations", details: "Core principles, terminology, structural values, and roadmap alignments." },
      { module: "Module 2: Real-World Case Studies", details: "Practical implementation models, team collaboration frameworks, and simulator dry runs." },
      { module: "Module 3: Exam Readiness & Practice", details: "Full-length exam mock simulations, question logic reviews, and certified test blueprints." }
    ];

    const faqs = [
      { q: "Is the official certification exam fee included in the tuition?", a: "Yes! The standard registration, study materials, and first certification exam attempt fees are fully covered." },
      { q: "What is the training format?", a: "The course is delivered in weekend or weekday cohorts through live-interactive virtual bootcamps with 4K recording access." }
    ];

    return {
      id,
      name: c.name,
      slug,
      categoryId: c.cat,
      categoryName: CATEGORIES[c.cat],
      duration,
      level: c.level,
      price,
      rating,
      reviewsCount,
      image,
      mentorName: mentor.name,
      mentorExp: mentor.exp,
      mentorAvatar: mentor.avatar,
      mentorBio: mentor.bio,
      syllabus: JSON.stringify(syllabus),
      faqs: JSON.stringify(faqs),
      createdAt: new Date().toISOString()
    };
  });
}

// Generate the list
const generatedCourses = generateCourseData();

// Update db_mock.json
const dbMockPath = path.join(__dirname, '..', '..', 'prisma', 'db_mock.json');
if (fs.existsSync(dbMockPath)) {
  const data = JSON.parse(fs.readFileSync(dbMockPath, 'utf-8'));
  
  // Filter out any courses that overlap with our new generation list (to avoid duplicates)
  const existingNonOverlap = (data.courses || []).filter(c => {
    return !COURSES_TO_GENERATE.some(gc => (gc.id === c.id || gc.name === c.name));
  });
  
  data.courses = [...existingNonOverlap, ...generatedCourses];
  fs.writeFileSync(dbMockPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[GENERATOR] Successfully updated db_mock.json. Total courses: ${data.courses.length}`);
} else {
  console.log(`[GENERATOR] db_mock.json not found at ${dbMockPath}`);
}

// Write the array block to generated_array.json
const codeFile = path.join(__dirname, 'generated_array.json');
fs.writeFileSync(codeFile, JSON.stringify(generatedCourses, null, 2), 'utf-8');
console.log(`[GENERATOR] JSON array written to ${codeFile}`);
