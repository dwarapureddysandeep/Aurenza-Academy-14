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
  { name: "CSM Certification", cat: "cat-1", level: "Beginner" },
  { name: "PMP Certification", cat: "cat-1", level: "Intermediate -> Advanced" },
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

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531535934202-f0d45367ed9b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
];

function generateCourseData() {
  return COURSES_TO_GENERATE.map((c, index) => {
    const slug = c.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    const id = `course-${slug}`;
    const image = UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length];
    const mentor = MENTORS[index % MENTORS.length];
    
    const isProgram = c.name.includes("Program");
    const duration = isProgram ? "6 months" : (c.name.includes("Advanced") || c.name.includes("A-") ? "2 months" : "6 weeks");
    const price = isProgram ? 39999 : (c.name.includes("Advanced") || c.name.includes("PgMP") || c.name.includes("CISSP") ? 29999 : 19999);
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
    return !COURSES_TO_GENERATE.some(gc => gc.name === c.name);
  });
  
  data.courses = [...existingNonOverlap, ...generatedCourses];
  fs.writeFileSync(dbMockPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[GENERATOR] Successfully updated db_mock.json. Total courses: ${data.courses.length}`);
} else {
  console.log(`[GENERATOR] db_mock.json not found at ${dbMockPath}`);
}

// Write the array block to a temporary file so we can view it and copy into db.ts
const codeFile = path.join(__dirname, 'generated_array.json');
fs.writeFileSync(codeFile, JSON.stringify(generatedCourses, null, 2), 'utf-8');
console.log(`[GENERATOR] JSON array written to ${codeFile}`);
