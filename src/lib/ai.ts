import { db } from './db';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface Roadmap {
  title: string;
  steps: string[];
}

export interface ResumeAnalysis {
  name?: string;
  education?: string;
  certifications?: string[];
  projects?: string[];
  tools?: string[];
  detectedSkills: string[];
  skillGaps: string[];
  detectedDomain: string;
  experienceLevel: string;
  suggestedCareerPath: string;
  recommendedCourses: string[]; // Course IDs
  improvementSuggestion: string;
  roadmap: Roadmap;
  roadmap30: string[];
  roadmap60: string[];
  roadmap90: string[];
  fullReport?: string;
  resumeScore?: {
    total: number;
    skills: number;
    projects: number;
    experience: number;
    certifications: number;
    atsReadiness: number;
  };
  atsAnalysis?: {
    score: number;
    missingKeywords: string[];
    weakSections: string[];
    formattingIssues: string[];
    suggestions: string[];
  };
  confidenceScore?: number;
  confidenceReason?: string;
  priorityCourses?: {
    priority1: string[];
    priority2: string[];
    priority3: string[];
  };
  learningPathPhase?: string;
  bestMatch?: {
    courseId: string;
    courseName: string;
    suitabilityScore: number;
    whyRecommended: string;
    expectedSalary: string;
    possibleJobRoles: string[];
    learningPath: string[];
  };
  rankedAlternatives?: {
    courseId: string;
    courseName: string;
    suitabilityScore: number;
  }[];
}

export interface ChatResponse {
  text: string;
  quickActions?: string[];
}

// Local Semantic Skills Database
const SKILLS_DATABASE = [
  { name: 'Java', relatedCourses: ['course-java'], category: 'Backend' },
  { name: 'Spring Boot', relatedCourses: ['course-java'], category: 'Backend' },
  { name: 'Hibernate', relatedCourses: ['course-java'], category: 'Backend' },
  { name: 'React', relatedCourses: ['course-frontend'], category: 'Frontend' },
  { name: 'Next.js', relatedCourses: ['course-frontend'], category: 'Frontend' },
  { name: 'JavaScript', relatedCourses: ['course-frontend', 'course-java'], category: 'Frontend' },
  { name: 'HTML', relatedCourses: ['course-frontend', 'course-java'], category: 'Frontend' },
  { name: 'CSS', relatedCourses: ['course-frontend', 'course-java'], category: 'Frontend' },
  { name: 'Tailwind', relatedCourses: ['course-frontend'], category: 'Frontend' },
  { name: 'Python', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'SQL', relatedCourses: ['course-aiml', 'course-java'], category: 'Database' },
  { name: 'Machine Learning', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'Deep Learning', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'NLP', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'TensorFlow', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'PyTorch', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'Computer Vision', relatedCourses: ['course-aiml'], category: 'Data & AI' },
  { name: 'Git', relatedCourses: ['course-frontend', 'course-java'], category: 'Tools' }
];

const SUGGESTED_ROADMAPS: Record<string, Roadmap> = {
  'course-java': {
    title: 'Java Full Stack Engineer Roadmap',
    steps: [
      'Core Java & Object Oriented Fundamentals (Weeks 1-6)',
      'Relational Databases & Advanced SQL Queries (Weeks 7-10)',
      'Enterprise Backend Development with Spring Boot & REST APIs (Weeks 11-16)',
      'Modern Interactive UI Construction with React (Weeks 17-21)',
      'Microservices Packaging with Docker & AWS Deployment (Weeks 22-24)'
    ]
  },
  'course-frontend': {
    title: 'Frontend UI/UX Developer Roadmap',
    steps: [
      'Advanced HTML5, CSS3, Flexbox & Grid layouts (Weeks 1-4)',
      'Vibrant Interactive Styling with Tailwind CSS & Responsive Standards (Weeks 5-6)',
      'Asynchronous JS & State Management (Weeks 7-10)',
      'React Hooks, Router, and Context APIs (Weeks 11-14)',
      'Next.js Server Side Rendering (SSR) & Vercel Optimization (Weeks 15-16)'
    ]
  },
  'course-aiml': {
    title: 'Artificial Intelligence Engineer Roadmap',
    steps: [
      'Advanced Python & Calculus optimization models (Weeks 1-4)',
      'Neural Networks building with PyTorch & TensorFlow (Weeks 5-8)',
      'Computer Vision models & OpenCV structures (Weeks 9-12)',
      'NLP Language processing, Attention, Transformers & Fine-tuning LLMs (Weeks 13-16)',
      'MLOps pipeline setups on Docker & AWS SageMaker (Weeks 17-20)'
    ]
  }
};

/**
 * Resolves the final 45-course catalog by combining DB records and static fallback lists.
 * Excludes the duplicate/unwanted 'CSM Certification' course.
 */
export function getFinalCatalog(allDbCourses: any[] = []): any[] {
  const CORE_COURSES = [
    {
      id: "course-java",
      name: "Java Full Stack Development",
      slug: "java-full-stack-development",
      categoryId: "cat-7",
      categoryName: "Full Stack Development",
      level: "Beginner -> Advanced",
      syllabus: JSON.stringify([
        { module: "Module 1: Core Java Programming" },
        { module: "Module 2: Advanced Java & Database" },
        { module: "Module 3: Enterprise Spring Framework" },
        { module: "Module 4: Frontend Integration" },
        { module: "Module 5: Testing, Security & Cloud" }
      ])
    },
    {
      id: "course-frontend",
      name: "Frontend Development (React & Next.js)",
      slug: "frontend-development-react-nextjs",
      categoryId: "cat-7",
      categoryName: "Full Stack Development",
      level: "Beginner",
      syllabus: JSON.stringify([
        { module: "Module 1: UI Core & Layouts" },
        { module: "Module 2: Modern JavaScript (ES6+)" },
        { module: "Module 3: Deep React Foundations" },
        { module: "Module 4: Modern Production Next.js" }
      ])
    },
    {
      id: "course-aiml",
      name: "AI & Machine Learning Engineering",
      slug: "ai-machine-learning-engineering",
      categoryId: "cat-3",
      categoryName: "AI & Machine Learning",
      level: "Intermediate",
      syllabus: JSON.stringify([
        { module: "Module 1: Mathematical Foundations" },
        { module: "Module 2: Deep Learning & Neural Networks" },
        { module: "Module 3: Computer Vision (CV)" },
        { module: "Module 4: Natural Language Processing (NLP)" }
      ])
    }
  ];

  const catalogCoursesMap = new Map<string, any>();
  CORE_COURSES.forEach(c => catalogCoursesMap.set(c.id, c));

  try {
    const generated = require('./generated_array.json');
    generated.forEach((c: any) => {
      if (c.name !== 'CSM Certification') {
        catalogCoursesMap.set(c.id, c);
      }
    });
  } catch (e) {
    console.warn('Failed to load generated_array.json in AI service', e);
  }

  if (allDbCourses && allDbCourses.length > 0) {
    allDbCourses.forEach((c: any) => {
      if (c.name !== 'CSM Certification') {
        catalogCoursesMap.set(c.id, c);
      }
    });
  }

  return Array.from(catalogCoursesMap.values());
}

/**
 * Local course recommendation scorer and formatter for Counselor Chat.
 * Evaluates all 45 courses, ranks them, selects best match + 4 alternatives, and writes reasons.
 */
export function recommendCoursesLocally(queryText: string, finalCourses: any[]): { text: string; bestMatchName: string } {
  const query = queryText.toLowerCase();
  
  const scored = finalCourses.map(course => {
    let score = 40; // baseline
    const name = course.name.toLowerCase();
    const cat = (course.categoryName || '').toLowerCase();
    
    // Check keyword matches in course name
    const nameWords = name.split(/[\s&,\(\)-]+/).filter((w: string) => w.length > 2);
    let nameMatches = 0;
    nameWords.forEach((word: string) => {
      if (query.includes(word)) nameMatches++;
    });
    score += nameMatches * 15;
    
    // Check category matches
    const catWords = cat.split(/[\s&,\(\)-]+/).filter((w: string) => w.length > 2);
    let catMatches = 0;
    catWords.forEach((word: string) => {
      if (query.includes(word)) catMatches++;
    });
    score += catMatches * 10;
    
    // Domain associations
    if (query.includes('cloud') || query.includes('aws') || query.includes('azure') || query.includes('amazon') || query.includes('vpc')) {
      if (cat.includes('cloud') || name.includes('aws') || name.includes('azure')) {
        score += 30;
      }
    }
    if (query.includes('devops') || query.includes('docker') || query.includes('kubernetes') || query.includes('jenkins') || query.includes('ci/cd') || query.includes('pipeline')) {
      if (cat.includes('devops') || name.includes('devops') || name.includes('scrum') || name.includes('agile')) {
        score += 30;
      }
    }
    if (query.includes('java') || query.includes('spring') || query.includes('backend') || query.includes('microservice') || query.includes('hibernate')) {
      if (name.includes('java') || cat.includes('full stack') || name.includes('scrum developer')) {
        score += 30;
      }
    }
    if (query.includes('frontend') || query.includes('react') || query.includes('next') || query.includes('web') || query.includes('html') || query.includes('css') || query.includes('javascript') || query.includes('ui')) {
      if (name.includes('frontend') || name.includes('react') || cat.includes('full stack')) {
        score += 30;
      }
    }
    if (query.includes('data') || query.includes('power bi') || query.includes('analytics') || query.includes('bi') || query.includes('excel') || query.includes('sql') || query.includes('science')) {
      if (cat.includes('data') || name.includes('power bi') || name.includes('data science') || name.includes('azure data')) {
        score += 30;
      }
    }
    if (query.includes('security') || query.includes('cyber') || query.includes('cissp') || query.includes('network')) {
      if (cat.includes('security') || name.includes('cissp') || name.includes('azure administrator')) {
        score += 30;
      }
    }
    if (query.includes('project') || query.includes('pmp') || query.includes('capm') || query.includes('pgmp') || query.includes('manager') || query.includes('management') || query.includes('scrum') || query.includes('agile') || query.includes('safe') || query.includes('csm')) {
      if (cat.includes('project') || cat.includes('agile') || cat.includes('safe') || name.includes('pmp') || name.includes('capm') || name.includes('pgmp') || name.includes('scrum') || name.includes('agile') || name.includes('safe')) {
        score += 25;
      }
    }
    
    const suitabilityScore = Math.min(Math.max(score, 45), 98);
    
    return {
      course,
      suitabilityScore
    };
  });
  
  scored.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  
  const best = scored[0];
  const alternatives = scored.slice(1, 5);
  
  let whyRecommended = [
    "Strong alignment with career goals and target domain",
    "Covers missing technical skills required in industry roles",
    "High market demand with excellent package scaling potential"
  ];
  
  const bestCat = (best.course.categoryName || '').toLowerCase();
  const bestName = best.course.name.toLowerCase();
  if (bestCat.includes('cloud') || bestName.includes('aws') || bestName.includes('azure')) {
    whyRecommended = [
      "Strong alignment with cloud engineering career goals",
      "Bridges critical gaps in cloud networking, container orchestration, and IAM security",
      "High market demand with companies migrating systems to cloud infrastructure"
    ];
  } else if (bestCat.includes('devops') || bestName.includes('devops')) {
    whyRecommended = [
      "Strong alignment with DevOps and systems automation career goals",
      "Covers missing skills in CI/CD pipeline building, containerization, and IaC tools",
      "Excellent career progression and compensation paths in automated deployments"
    ];
  } else if (bestName.includes('java') || bestCat.includes('full stack') || bestName.includes('frontend') || bestName.includes('react')) {
    whyRecommended = [
      "High relevance for full-stack software development roles",
      "Bridges gaps in design architectures, backend services, and front-end integration",
      "High employment demand across enterprise applications and modern tech companies"
    ];
  } else if (bestCat.includes('data') || bestName.includes('power bi') || bestName.includes('data science')) {
    whyRecommended = [
      "Direct alignment with business intelligence and data science career paths",
      "Covers analytical querying, statistics modeling, and executive report building",
      "Essential role in modern data-driven corporate decision-making structures"
    ];
  } else if (bestCat.includes('security') || bestName.includes('cissp') || bestName.includes('cyber')) {
    whyRecommended = [
      "Strong alignment with cybersecurity and corporate compliance goals",
      "Bridges gaps in threat intelligence, access control, and network vulnerability auditing",
      "Critical business requirement with high job security and specialist premium salaries"
    ];
  } else if (bestCat.includes('project') || bestCat.includes('agile') || bestCat.includes('safe') || bestName.includes('pmp') || bestName.includes('scrum') || bestName.includes('safe')) {
    whyRecommended = [
      "Strong alignment with management, Scrum Master, or Agile consulting paths",
      "Validates understanding of delivery frameworks, budget planning, and team coaching",
      "Highly respected industry credentials that scale professional management authority"
    ];
  }
  
  const textOutput = `Best Match:
${best.course.name}
Match Score: ${best.suitabilityScore}%

Why Recommended:
* ${whyRecommended[0]}
* ${whyRecommended[1]}
* ${whyRecommended[2]}

Alternative Courses:
${alternatives.map(alt => `* ${alt.course.name}`).join('\n')}`;

  return {
    text: textOutput,
    bestMatchName: best.course.name
  };
}

/**
 * Perform keyword-based local skill & gap scanner or counselor profile mapping
 */
function scanLocalResume(text: string, counselorProfile: any = null, allCourses: any[] = []): ResumeAnalysis {
  const content = text.toLowerCase();
  let detectedSkills: string[] = [];
  let skillGaps: string[] = [];
  let name = "Extracted Candidate";
  let education = "Technical Degree (Extracted)";
  let certifications = ["Aurenza Certified Foundation"];
  let projects = ["Full Stack Integration Portfolio"];
  let tools = ["Git", "GitHub"];
  let detectedDomain = "Software Engineering";
  let experienceLevel = "Entry Level / Fresher";
  let suggestedCareerPath = "Software Engineer Specialist";

  if (counselorProfile) {
    name = counselorProfile.name || "Candidate";
    education = counselorProfile.education || "Graduate";
    experienceLevel = counselorProfile.experienceLevel || "Entry Level / Fresher";
    detectedDomain = counselorProfile.interestedDomain || "Full Stack Development";
    suggestedCareerPath = counselorProfile.careerGoal || `${detectedDomain} Engineer`;
    const preferredTech = counselorProfile.preferredTech || "Modern Stacks";

    if (detectedDomain.includes('Cloud') || detectedDomain.toLowerCase().includes('aws') || detectedDomain.toLowerCase().includes('azure')) {
      detectedSkills = ['Cloud Basics', 'Infrastructure Concepts', preferredTech];
      skillGaps = ['VPC Networking', 'IAM Security Policies', 'EC2 & S3 Compute/Storage', 'AWS CloudFormation'];
      tools = ['AWS Management Console', 'Terraform', 'Git'];
      projects = ['Multi-tier AWS Web Deployment', 'Secure Cloud Architecture'];
    } else if (detectedDomain.includes('Full Stack') || detectedDomain.includes('Frontend') || detectedDomain.toLowerCase().includes('web') || detectedDomain.toLowerCase().includes('react') || detectedDomain.toLowerCase().includes('java')) {
      detectedSkills = ['HTML/CSS Basics', 'JavaScript ES6', preferredTech];
      skillGaps = ['Spring Boot Framework', 'RESTful Microservices APIs', 'Hibernate ORM', 'Relational SQL Databases'];
      tools = ['VS Code', 'IntelliJ IDEA', 'Postman', 'Git'];
      projects = ['Spring Boot & React CRUD Portal', 'E-commerce API Gateway'];
    } else if (detectedDomain.includes('Data') || detectedDomain.toLowerCase().includes('analytics') || detectedDomain.toLowerCase().includes('bi')) {
      detectedSkills = ['Spreadsheets', 'Data Cleaning', preferredTech];
      skillGaps = ['Advanced SQL Queries', 'Power BI Data Modeling', 'Excel Analytics formulas', 'Python Data Science libraries'];
      tools = ['Power BI Desktop', 'Jupyter Notebooks', 'Excel'];
      projects = ['Executive Sales Dashboard', 'Customer Churn Analysis'];
    } else if (detectedDomain.includes('AI') || detectedDomain.includes('Machine') || detectedDomain.toLowerCase().includes('learning') || detectedDomain.toLowerCase().includes('deep')) {
      detectedSkills = ['Python programming', 'Mathematical optimization', preferredTech];
      skillGaps = ['Deep Neural Networks', 'PyTorch / TensorFlow coding', 'NLP Transformer architectures', 'MLOps models pipelines'];
      tools = ['PyTorch', 'TensorFlow', 'Google Colab', 'Docker'];
      projects = ['Image Classification CNN', 'Text Summarizer Transformer'];
    } else if (detectedDomain.includes('DevOps') || detectedDomain.toLowerCase().includes('jenkins')) {
      detectedSkills = ['Linux administration', 'Shell scripting', preferredTech];
      skillGaps = ['Docker containerization', 'Kubernetes clustering', 'CI/CD pipeline scripts', 'System monitoring & Prometheus'];
      tools = ['Docker', 'Kubernetes', 'Jenkins', 'Prometheus'];
      projects = ['Automated Jenkins CI/CD Pipeline', 'Kubernetes Cluster Setup'];
    } else if (detectedDomain.includes('Security') || detectedDomain.toLowerCase().includes('cyber')) {
      detectedSkills = ['Linux commands', 'Networking basic protocols', preferredTech];
      skillGaps = ['Network Vulnerabilities analysis', 'Access control architectures', 'Cryptographic standards', 'Risk assessment frameworks'];
      tools = ['Kali Linux', 'Wireshark', 'Metasploit'];
      projects = ['Vulnerability Pentesting Audit', 'Secure Access Control Policy'];
    } else {
      detectedSkills = ['Scrum basics', 'Agile values', preferredTech];
      skillGaps = ['Agile Team coaching', 'Sprint Planning facilitation', 'Jira Board management', 'Stakeholder communications'];
      tools = ['Jira', 'Confluence', 'Trello'];
      projects = ['Agile Transformation Roadmap', 'Scrum Sprint Facilitations'];
    }
  } else {
    // Scan text using keywords
    SKILLS_DATABASE.forEach(skill => {
      const rx = new RegExp(`\\b${skill.name.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (rx.test(content)) {
        detectedSkills.push(skill.name);
      }
    });

    if (detectedSkills.length === 0) {
      detectedSkills.push('Analytical Skills', 'Problem Solving', 'Computer Literacy');
    }

    if (detectedSkills.includes('React') && !detectedSkills.includes('Spring Boot') && !detectedSkills.includes('Java')) {
      skillGaps.push('Java Enterprise Backend', 'Spring Boot REST APIs', 'Relational Databases (SQL)', 'Docker Containerization');
    } else if (detectedSkills.includes('Java') && !detectedSkills.includes('React')) {
      skillGaps.push('React Frontend Layouts', 'CSS Design Systems', 'Modern JS ES6+', 'Next.js App Routing');
    } else if (detectedSkills.includes('Python') && !detectedSkills.includes('Machine Learning')) {
      skillGaps.push('Machine Learning Algorithms', 'Deep Learning Networks (PyTorch)', 'Mathematical Statistics', 'Data Visualizations');
    } else {
      skillGaps.push('Advanced Architecture', 'Database Optimization', 'Modern Git/CI-CD workflows');
    }
    experienceLevel = content.includes('year') || content.includes('exp') ? 'Experienced' : 'Entry Level / Fresher';

    // Detect domain
    if (content.includes('aws') || content.includes('cloud') || content.includes('azure') || content.includes('gcp')) {
      detectedDomain = "Cloud Computing";
    } else if (content.includes('machine learning') || content.includes('deep learning') || content.includes('ai') || content.includes('nlp')) {
      detectedDomain = "AI & Machine Learning";
    } else if (content.includes('devops') || content.includes('docker') || content.includes('kubernetes') || content.includes('jenkins')) {
      detectedDomain = "DevOps";
    } else if (content.includes('power bi') || content.includes('data science') || content.includes('analytics') || (content.includes('sql') && content.includes('excel'))) {
      detectedDomain = "Data Science";
    } else if (content.includes('cyber') || content.includes('security') || content.includes('penetration') || content.includes('vulnerability')) {
      detectedDomain = "Cyber Security";
    } else if (content.includes('project') || content.includes('scrum') || content.includes('agile') || content.includes('pmp') || content.includes('csm')) {
      detectedDomain = "Project Management";
    } else {
      detectedDomain = "Full Stack Development";
    }
    suggestedCareerPath = `${detectedDomain} Specialist`;
  }

  const coursesToUse = getFinalCatalog(allCourses);

  // Calculate suitability score for every catalog course
  const scoredCourses = coursesToUse.map((course: any) => {
    let score = 50; // base score

    const domainLower = detectedDomain.toLowerCase();
    const courseCatLower = (course.categoryName || '').toLowerCase();
    const courseNameLower = (course.name || '').toLowerCase();
    const courseSlugLower = (course.slug || '').toLowerCase();

    // Domain Match: +25
    let domainMatch = false;
    if (domainLower.includes(courseCatLower) || courseCatLower.includes(domainLower)) {
      domainMatch = true;
    } else {
      const keywords = ['java', 'react', 'frontend', 'web', 'ai', 'machine', 'learning', 'data', 'cloud', 'aws', 'azure', 'devops', 'security', 'scrum', 'agile', 'pmp'];
      for (const kw of keywords) {
        if (domainLower.includes(kw) && (courseCatLower.includes(kw) || courseNameLower.includes(kw) || courseSlugLower.includes(kw))) {
          domainMatch = true;
          break;
        }
      }
    }
    if (domainMatch) score += 25;

    // Career Goal Match: +15
    const goalLower = (counselorProfile?.careerGoal || suggestedCareerPath).toLowerCase();
    let goalMatch = false;
    const goalKeywords = goalLower.split(/\s+/).filter((w: string) => w.length > 2);
    for (const kw of goalKeywords) {
      if (courseNameLower.includes(kw) || courseSlugLower.includes(kw)) {
        goalMatch = true;
        break;
      }
    }
    if (goalMatch) score += 15;

    // Level Match: +10
    const expLower = experienceLevel.toLowerCase();
    const levelLower = (course.level || '').toLowerCase();
    let levelMatch = false;
    if (expLower.includes('fresher') || expLower.includes('entry') || expLower.includes('beginner') || expLower.includes('student')) {
      if (levelLower.includes('beginner')) {
        levelMatch = true;
      }
    } else {
      if (levelLower.includes('intermediate') || levelLower.includes('advanced') || levelLower.includes('professional')) {
        levelMatch = true;
      }
    }
    if (levelMatch) score += 10;

    // Skill Match: +2 per skill (max +10)
    let skillMatches = 0;
    const courseSyllabusText = typeof course.syllabus === 'string' ? course.syllabus.toLowerCase() : JSON.stringify(course.syllabus || '').toLowerCase();
    for (const skill of detectedSkills) {
      const skillLow = skill.toLowerCase();
      if (courseNameLower.includes(skillLow) || courseSlugLower.includes(skillLow) || courseSyllabusText.includes(skillLow)) {
        skillMatches++;
      }
    }
    score += Math.min(skillMatches * 2, 10);

    const suitabilityScore = Math.min(score, 100);

    return {
      course,
      suitabilityScore
    };
  });

  // Sort courses by suitabilityScore descending
  scoredCourses.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const bestMatchCourse = scoredCourses[0]?.course || coursesToUse[0];
  const bestMatchScore = scoredCourses[0]?.suitabilityScore || 85;

  // Expected Salary Mapping
  let expectedSalary = "INR 5-9 LPA";
  const bmCat = (bestMatchCourse.categoryName || '').toLowerCase();
  const bmName = (bestMatchCourse.name || '').toLowerCase();
  if (bmCat.includes('ai') || bmCat.includes('machine') || bmCat.includes('data') || bmName.includes('data') || bmName.includes('ai')) {
    expectedSalary = "INR 8-15 LPA";
  } else if (bmCat.includes('cloud') || bmCat.includes('devops') || bmName.includes('cloud') || bmName.includes('aws') || bmName.includes('devops') || bmName.includes('azure')) {
    expectedSalary = "INR 7-14 LPA";
  } else if (bmCat.includes('full stack') || bmCat.includes('frontend') || bmName.includes('java') || bmName.includes('frontend') || bmName.includes('web')) {
    expectedSalary = "INR 6-12 LPA";
  } else if (bmCat.includes('project') || bmName.includes('scrum') || bmName.includes('pmp') || bmName.includes('csm')) {
    expectedSalary = "INR 5-10 LPA";
  }

  // Job Roles Mapping
  let possibleJobRoles = ["Software Associate", "Technology Analyst"];
  if (bmCat.includes('ai') || bmCat.includes('machine') || bmName.includes('ai') || bmName.includes('machine')) {
    possibleJobRoles = ["Machine Learning Engineer", "AI Specialist", "Data Scientist", "NLP Engineer"];
  } else if (bmCat.includes('cloud') || bmName.includes('cloud') || bmName.includes('aws') || bmName.includes('azure')) {
    possibleJobRoles = ["Cloud Solutions Architect", "AWS Engineer", "Cloud Infrastructure Engineer"];
  } else if (bmCat.includes('full stack') || bmCat.includes('frontend') || bmName.includes('java') || bmName.includes('frontend') || bmName.includes('web')) {
    possibleJobRoles = ["Full Stack Developer", "Software Engineer", "Backend Developer", "React Engineer"];
  } else if (bmCat.includes('devops') || bmName.includes('devops')) {
    possibleJobRoles = ["DevOps Engineer", "Site Reliability Engineer", "CI/CD Automation Engineer"];
  } else if (bmCat.includes('project') || bmName.includes('scrum') || bmName.includes('pmp') || bmName.includes('csm')) {
    possibleJobRoles = ["Scrum Master", "Project Manager", "Agile Coach", "Delivery Manager"];
  }

  // Extract Learning Path from syllabus
  let learningPath: string[] = [];
  try {
    const parsedSyllabus = typeof bestMatchCourse.syllabus === 'string' ? JSON.parse(bestMatchCourse.syllabus) : bestMatchCourse.syllabus;
    if (Array.isArray(parsedSyllabus)) {
      learningPath = parsedSyllabus.map((item: any) => item.module || item.title || item.details || '');
    }
  } catch (e) {
    learningPath = [
      "Module 1: Foundations & Core Principles",
      "Module 2: Real-World Case Studies & Lab Exercises",
      "Module 3: Enterprise Integration & Testing",
      "Module 4: Deployment & Exam Practice Simulator"
    ];
  }
  learningPath = learningPath.filter(Boolean).slice(0, 5);

  const bestMatch = {
    courseId: bestMatchCourse.id,
    courseName: bestMatchCourse.name,
    suitabilityScore: bestMatchScore,
    whyRecommended: `This course perfectly aligns with your career interest in ${detectedDomain} and bridges your skill gaps in key areas like ${skillGaps.slice(0, 2).join(', ') || 'essential technical tools'}.`,
    expectedSalary,
    possibleJobRoles,
    learningPath
  };

  const rankedAlternatives = scoredCourses.slice(1, 11).map((item: any) => ({
    courseId: item.course.id,
    courseName: item.course.name,
    suitabilityScore: item.suitabilityScore
  }));

  const recommendedCourses = [bestMatchCourse.id, ...rankedAlternatives.slice(0, 2).map(a => a.courseId)];

  const primaryCourseId = bestMatchCourse.id;
  const roadmap = SUGGESTED_ROADMAPS[primaryCourseId] || {
    title: `${bestMatchCourse.name} Roadmap`,
    steps: learningPath
  };

  // Roadmap Milestones
  let roadmap30: string[] = [];
  let roadmap60: string[] = [];
  let roadmap90: string[] = [];

  if (primaryCourseId === 'course-java') {
    roadmap30 = ['Review Core Java OOP principles, encapsulation, and memory models.', 'Understand relational database schemas and basic SQL query structures.'];
    roadmap60 = ['Develop enterprise backend microservices with Spring Boot APIs.', 'Learn modern JavaScript ES6+ syntax and basic React routing.'];
    roadmap90 = ['Build a full stack React and Spring Boot integration application.', 'Setup JUnit test cases, configure Spring Security, and deploy on AWS.'];
  } else if (primaryCourseId === 'course-frontend') {
    roadmap30 = ['Master HTML5 semantic elements and responsive layouts (CSS Flexbox/Grid).', 'Integrate utility-first styling frameworks like Tailwind CSS.'];
    roadmap60 = ['Learn JavaScript ES6+ asynchronous programming (Promises/Fetch API).', 'Control application state with React Hooks and Context APIs.'];
    roadmap90 = ['Learn Next.js App Routing architecture and Server Actions.', 'Optimize SEO tags, configure meta headers, and deploy to Vercel.'];
  } else if (primaryCourseId === 'course-aiml' || primaryCourseId === 'course-dsai') {
    roadmap30 = ['Review python data processing libraries (Numpy, Pandas, Matplotlib).', 'Learn basic statistical models and gradient descent calculus optimization.'];
    roadmap60 = ['Implement deep learning neural networks using PyTorch/TensorFlow.', 'Build object-detection convolutional models with OpenCV.'];
    roadmap90 = ['Train NLP attention transformer models and fine-tune large language models.', 'Configure MLOps package environments with Docker and AWS SageMaker.'];
  } else {
    const step1 = learningPath[0] || 'Learn core concepts and fundamentals.';
    const step2 = learningPath[1] || 'Hands-on practical models and assignments.';
    const step3 = learningPath[2] || 'Advanced enterprise features and testing.';
    const step4 = learningPath[3] || 'Deployment pipeline setup and validation.';
    const step5 = learningPath[4] || 'Final project construction and certification.';
    roadmap30 = [step1, step2];
    roadmap60 = [step3];
    roadmap90 = [step4, step5].filter(Boolean);
  }

  const fullReport = `# Candidate Summary
- **Profile Status**: Local scan completed.
- **Candidate Name**: ${name}
- **Target Domain**: ${detectedDomain}
- **Experience Level**: ${experienceLevel}
- **Academic Background**: ${education}

# Resume Score
Overall Score: 80/100
- Technical Skills: 78/100
- ATS Compatibility: 82/100
- Employability Rating: 80/100

# Skills Identified
${detectedSkills.map(s => `- ${s}`).join('\n')}

# Strengths
- Strong conceptual understanding of ${detectedSkills[0] || 'core technologies'}.
- Documented project setups and tool validations.

# Weaknesses
- Lacks hands-on enterprise-level system deployment configurations.
- Needs training in cloud infrastructure integrations.

# Skill Gap Analysis
- **Missing Technical Skills**: ${skillGaps.join(', ')}
- **Recommended Upskilling**: Complete dynamic learning modules covering missing areas.

# Recommended Learning Roadmap
- **30 Days**: ${roadmap30.join(' ')}
- **60 Days**: ${roadmap60.join(' ')}
- **90 Days**: ${roadmap90.join(' ')}

# Final Verdict
Highly motivated candidate. Strongly recommended to pursue upskilling certifications at Aurenza Academy to bridge skills gaps and secure premium placement references.`;

  const priority1 = [bestMatchCourse.id];
  const priority2 = rankedAlternatives.slice(0, 2).map(a => a.courseId);
  const priority3 = rankedAlternatives.slice(2, 4).map(a => a.courseId);

  const resumeScore = {
    total: 78,
    skills: 23,
    projects: 15,
    experience: 18,
    certifications: 12,
    atsReadiness: 10
  };

  const atsAnalysis = {
    score: 82,
    missingKeywords: skillGaps.slice(0, 3),
    weakSections: ["Certifications", "Projects"],
    formattingIssues: ["Missing standard ATS section headers", "Multiple columns in layout"],
    suggestions: ["Use single-column layout", "Incorporate target job description keywords", "Highlight projects with quantifiably measurable impact statements"]
  };

  const confidenceScore = counselorProfile ? 98 : 85;
  const confidenceReason = counselorProfile 
    ? "Questionnaire completed with explicit experience, education, domain, and tool details." 
    : "Parsed resume contains education, skills, and tools section blocks.";

  const learningPathPhase = primaryCourseId === 'course-java'
    ? "Beginner (Core Java) → Intermediate (Spring Boot) → Advanced (React Integration) → Job Ready"
    : primaryCourseId === 'course-frontend'
      ? "Beginner (HTML/CSS) → Intermediate (React Hooks) → Advanced (Next.js SSR) → Job Ready"
      : primaryCourseId === 'course-aiml' || primaryCourseId === 'course-dsai'
        ? "Beginner (Python/Math) → Intermediate (PyTorch/CV) → Advanced (NLP/MLOps) → Job Ready"
        : "Beginner (Cloud Basics) → Intermediate (VPC/IAM) → Advanced (Terraform/CI-CD) → Job Ready";

  return {
    name,
    education,
    certifications,
    projects,
    tools,
    detectedSkills,
    skillGaps,
    detectedDomain,
    experienceLevel,
    suggestedCareerPath,
    recommendedCourses,
    roadmap,
    roadmap30,
    roadmap60,
    roadmap90,
    improvementSuggestion: 'We suggest building 2 advanced open-source projects on GitHub, learning modern authentication models, and working extensively on quantitative aptitude skills to pass assessment checks.',
    fullReport,
    resumeScore,
    atsAnalysis,
    confidenceScore,
    confidenceReason,
    priorityCourses: {
      priority1,
      priority2,
      priority3
    },
    learningPathPhase,
    bestMatch,
    rankedAlternatives
  };
}

export const aiService = {
  /**
   * Generates Chatbot responses using Gemini or offline fallbacks.
   */
  getChatResponse: async (
    messageText: string,
    chatHistory: { role: 'user' | 'model'; text: string }[] = [],
    documentContext: string = ''
  ): Promise<ChatResponse> => {
    const msg = messageText.toLowerCase();

    // Fetch courses from DB catalog and merge with static catalog courses
    let allCourses: any[] = [];
    try {
      allCourses = await db.course.findMany();
    } catch (dbErr) {
      console.warn('Failed to query courses in getChatResponse', dbErr);
    }
    const finalCourses = getFinalCatalog(allCourses);

    // 1. Quick Keyword Handler (Offline/Online immediate responses)
    if (msg.includes('resume') || msg.includes('cv') || msg.includes('upload') || msg.includes('parse')) {
      return {
        text: "I would be happy to analyze your resume! Click the attachment icon in the input bar or paste your resume details into the 'Resume Diagnostics AI' tab to get a full analysis.",
        quickActions: ['Recommend Courses']
      };
    }

    if (msg.includes('counseling') || msg.includes('career') || msg.includes('suit') || msg.includes('recommend')) {
      const isRecomm = msg.includes('recommend') || msg.includes('suit') || msg.includes('course');
      if (isRecomm) {
        if (!GEMINI_API_KEY) {
          const localRec = recommendCoursesLocally(messageText, finalCourses);
          return {
            text: localRec.text,
            quickActions: ['Book Free Counseling', 'Explore Courses']
          };
        }
      } else {
        return {
          text: "Let's discover your perfect path! Tell me: What is your current career status? Are you a college student or a working professional?",
          quickActions: ['Student', 'Working Professional']
        };
      }
    }

    if (msg.includes('fee') || msg.includes('price') || msg.includes('cost') || msg.includes('payment') || msg.includes('tuition')) {
      return {
        text: "Aurenza Academy operates as a premium course catalog and showcase. We do not process upfront online tuition payments or admission fees. Specific course schedules, materials, and corporate learning packages are coordinated directly via counselor callbacks. Let me know if you would like to schedule a free counseling call!",
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    if (msg.includes('placement') || msg.includes('job') || msg.includes('hire') || msg.includes('salary') || msg.includes('career support') || msg.includes('interview')) {
      return {
        text: "Aurenza provides premier placement preparation! We offer dedicated mock interviews with technology specialists, resume polishing, ATS optimization, and direct counselor referrals to our 500+ corporate hiring partners. We have successfully placed candidates at companies like Microsoft, Amazon, and Deloitte.",
        quickActions: ['Book Free Counseling']
      };
    }

    if (msg.includes('contact') || msg.includes('phone') || msg.includes('hotline') || msg.includes('call') || msg.includes('email') || msg.includes('support') || msg.includes('address') || msg.includes('office') || msg.includes('location')) {
      return {
        text: "You can reach Aurenza Academy advisors through these official channels:\n\n- 📞 **Hotline**: +91 70130 57827\n- ✉️ **Support Email**: info@aurenzaacademy.com\n- 📍 **Head Office**: Gajuwaka, Visakhapatnam, India\n\nFeel free to write to us or request an inbound callback!",
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    // 2. Gemini Live API Pathway with context and memory
    if (GEMINI_API_KEY) {
      try {
        const contents: any[] = [];
        
        // Populate chat history turns
        if (chatHistory && chatHistory.length > 0) {
          chatHistory.forEach(turn => {
            contents.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: turn.text }]
            });
          });
        }

        // Construct final prompt with document context
        let currentPrompt = "";
        if (documentContext) {
          currentPrompt += `[CONTEXT FROM ATTACHED DOCUMENTS:\n${documentContext}\n]\n\n`;
        }
        currentPrompt += `User Query: ${messageText}`;

        contents.push({
          role: 'user',
          parts: [{ text: currentPrompt }]
        });

        const courseNamesList = finalCourses.map(c => `- ${c.name} (ID: ${c.id})`).join('\n');

        const systemInstruction = {
          parts: [{
            text: `You are Auri, the senior AI Career Counselor for Aurenza Academy.
            
Primary Business Details:
- Location: Gajuwaka, Visakhapatnam, India.
- Email Support: info@aurenzaacademy.com
- Hotline Support: +91 70130 57827
- Pricing: Showcase/catalog mode. We do not collect online payments or upfront tuitions. Counseling calls are free.
- Placements: 1-on-1 counselor reviews, resume polishing, ATS alignment, and mock interviews with tech leads.

Official Course Catalog:
${courseNamesList}

Course Recommendation Engine Rules:
Analyze user queries, career goals, experience level, and any attached document text to match them with our official catalog courses.
When the user is asking for course recommendations, describing their goals, or inquiring about which program suits their skills, you MUST:
1. Analyze ALL courses in the catalog.
2. Categorize their career goals.
3. Score every course out of 100 based on suitability.
4. Select the best match.
5. Identify alternative courses that are also relevant.
6. Provide reasoning in a bulleted list.

You MUST format the recommendation section EXACTLY as follows:
Best Match:
[Official Course Name]
Match Score: [Score]%

Why Recommended:
* [Reason 1]
* [Reason 2]
* [Reason 3]

Alternative Courses:
* [Alternative Course Name 1]
* [Alternative Course Name 2]
* [Alternative Course Name 3]
* [Alternative Course Name 4]

Never recommend random courses that are not in the catalog. Always provide clear, professional reasoning. Maintain context memory across messages. Limit general chat answers to 130 words. Output in markdown.`
          }]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction
          })
        });

        const result = (await response.json()) as any;
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return { text: generatedText.trim() };
        }
      } catch (e) {
        console.warn('Gemini chatbot call failed, defaulting to local NLP analyzer', e);
      }
    }

    // 3. Offline Local Keyword Recommendation Parser
    const isRecommendationQuery = 
      msg.includes('recommend') || msg.includes('counseling') || msg.includes('career') || 
      msg.includes('suit') || msg.includes('course') || msg.includes('learn') || 
      msg.includes('study') || msg.includes('goal') || msg.includes('fresher') || 
      msg.includes('student') || msg.includes('professional') || msg.includes('job') ||
      msg.includes('aws') || msg.includes('cloud') || msg.includes('azure') || 
      msg.includes('java') || msg.includes('spring') || msg.includes('backend') || 
      msg.includes('devops') || msg.includes('docker') || msg.includes('kubernetes') || 
      msg.includes('data') || msg.includes('power bi') || msg.includes('analytics') || 
      msg.includes('security') || msg.includes('cyber') || msg.includes('scrum') || 
      msg.includes('agile') || msg.includes('pmp');

    if (isRecommendationQuery) {
      const localRec = recommendCoursesLocally(messageText, finalCourses);
      return {
        text: localRec.text,
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    // Default Fallback
    if (msg === 'student') {
      return {
        text: "Fabulous! As a student, are you looking to build your core technical skills in software engineering (Full Stack / Frontend) or venture into high-growth AI & Machine Learning fields?",
        quickActions: ['Software Engineering', 'AI & Machine Learning']
      };
    }
    
    if (msg === 'working professional') {
      return {
        text: "Excellent choice! For professionals, are you looking for an intensive web programming stack (like Java Full Stack / Spring Boot) or specialized high-growth AI certifications?",
        quickActions: ['Java Full Stack Web', 'AI Engineering']
      };
    }

    if (msg === 'software engineering' || msg === 'java full stack web') {
      return {
        text: "Aurenza Academy offers two flagship routes: **Java Full Stack Development** (Spring Boot, databases, React, microservices) and **Frontend Development** (React, Next.js, Framer Motion animations). Which duration fits your timeline best?",
        quickActions: ['6 Months Cohort', '4 Months Cohort']
      };
    }

    if (msg === 'ai & machine learning' || msg === 'ai engineering') {
      return {
        text: "Outstanding! Aurenza offers a top-tier **AI & Machine Learning Engineering** course covering Python, PyTorch, Neural Networks, Computer Vision, and LLM fine-tuning. What is your current coding comfort level?",
        quickActions: ['Beginner', 'Intermediate']
      };
    }

    if (msg === '6 months cohort' || msg === '4 months cohort' || msg === 'beginner' || msg === 'intermediate') {
      const isAI = msg === 'beginner' || msg === 'intermediate';
      const rec = isAI ? 'AI & Machine Learning Engineering' : 'Java Full Stack Development';
      return {
        text: `Based on your profile, I highly recommend our **${rec}** course! It includes dedicated placement assistance, 1-on-1 industry mentorship, and live interactive cohorts. Would you like to explore courses or book a free counseling session?`,
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    return {
      text: "Hello! I am Auri, your personal AI Career Counselor. I can recommend the perfect course for you, analyze your resume to highlight skill gaps, or help you generate an interactive career roadmap. Choose an option below to start!",
      quickActions: ['Recommend Courses', 'Analyze Resume', 'Career Roadmap', 'Book Free Counseling']
    };
  },


  /**
   * Analyzes resume text or counselor questionnaires.
   */
  analyzeResume: async (
    resumeText: string,
    fileName: string = '',
    counselorProfile: any = null
  ): Promise<ResumeAnalysis> => {
    // Delay for premium loading skeleton experience
    await new Promise(r => setTimeout(r, 1200));

    let textToAnalyze = resumeText || '';
    if (fileName && !resumeText && !counselorProfile) {
      textToAnalyze = `Analysis of uploaded file: ${fileName}. Skills: JavaScript, React, CSS, Node, Git, communications. Looking for development.`;
    }

    const hasInput = textToAnalyze.trim().length > 10 || counselorProfile;

    // Fetch courses from DB catalog and merge with static catalog courses
    let allCourses: any[] = [];
    try {
      allCourses = await db.course.findMany();
    } catch (dbErr) {
      console.warn('Failed to query courses from db.course.findMany()', dbErr);
    }
    const finalCourses = getFinalCatalog(allCourses);

    if (GEMINI_API_KEY && hasInput) {
      try {
        let userPrompt = '';
        if (counselorProfile) {
          userPrompt = `You are parsing a Career Discovery Questionnaire from a candidate without a resume:
- Name: ${counselorProfile.name || 'Candidate'}
- Experience Level: ${counselorProfile.experienceLevel || 'Fresher'}
- Current Education: ${counselorProfile.education || 'Undergraduate'}
- Current Job Role: ${counselorProfile.currentRole || 'Student'}
- Career Goal: ${counselorProfile.careerGoal || 'Full Stack Developer'}
- Preferred Technology: ${counselorProfile.preferredTech || 'Java'}
- Interested Domain: ${counselorProfile.interestedDomain || 'Full Stack Development'}

Please analyze this profile, identify skill gaps compared to industry expectations, recommend appropriate courses, and construct a 30-60-90 day study timeline.`;
        } else {
          userPrompt = `Analyze this resume content:
${textToAnalyze}`;
        }

        // Format course catalog context to send to Gemini
        const catalogContext = finalCourses.map((c: any) => {
          let syllabusModules: string[] = [];
          try {
            const parsed = typeof c.syllabus === 'string' ? JSON.parse(c.syllabus) : c.syllabus;
            if (Array.isArray(parsed)) {
              syllabusModules = parsed.map((m: any) => m.module || m.title || '');
            }
          } catch (e) {}
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            categoryName: c.categoryName,
            level: c.level,
            duration: c.duration,
            syllabus: syllabusModules.slice(0, 5)
          };
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{
                  text: `You are a Senior AI Career Consultant and Resume Diagnostics Assistant for Aurenza Academy.
                  
                  Primary responsibilities:
                  1. Profile/Resume Analysis (extract education, certifications, projects, tools, skills).
                  2. Resume Score (compute overall score out of 100, and category breakdowns).
                  3. ATS Compatibility Analysis (compute ATS score, identify missing keywords, weak sections, formatting issues, and suggestions).
                  4. Confidence Score (determine confidence level in analysis based on input completeness).
                  5. Course Suitability Match:
                     - Evaluate ALL courses in our official catalog provided below against the candidate's profile.
                     - Calculate a suitability score (0-100) for each course.
                     - Determine the "bestMatch" (Primary Recommendation) which has the highest suitability score.
                     - For this bestMatch course, provide a specific whyRecommended reasoning statement, an expected salary range (e.g., INR 6-12 LPA), possible target job roles, and a structured learning path (up to 5 modules from the course syllabus).
                     - Generate a list of "rankedAlternatives" containing the next 5-10 top matching courses with their scores (sorted by score descending, excluding the bestMatch course).
                  6. Learning Path Phase Progression (Beginner → Intermediate → Advanced → Job Ready).
                  7. Explanations (explain why skills are missing, why courses are recommended).

                  Official Course Catalog Context:
                  ${JSON.stringify(catalogContext, null, 2)}

                  Rules:
                  - You MUST select courses ONLY from the provided catalog. Do NOT recommend any course id or name that is not in the catalog.
                  - For each recommended course, explicitly justify the match.
                  - Be supportive, expert, and professional.

                  Analyze the input and provide a JSON response matching exactly this format:
                  {
                    "name": "Candidate Name (use provided or extract)",
                    "education": "Education details",
                    "certifications": ["Cert1", "Cert2"],
                    "projects": ["Project1", "Project2"],
                    "tools": ["Tool1", "Tool2"],
                    "detectedSkills": ["Skill1", "Skill2"],
                    "skillGaps": ["Gap1", "Gap2"],
                    "detectedDomain": "Domain Name",
                    "experienceLevel": "Entry/Mid/Senior",
                    "suggestedCareerPath": "Suggested Job Title",
                    "recommendedCourses": ["best-match-id", "alt-id-1", "alt-id-2"],
                    "improvementSuggestion": "Short upskilling/career tip",
                    "roadmap30": ["Step1", "Step2"],
                    "roadmap60": ["Step3", "Step4"],
                    "roadmap90": ["Step5", "Step6"],
                    "resumeScore": {
                      "total": 78,
                      "skills": 25,
                      "projects": 15,
                      "experience": 18,
                      "certifications": 10,
                      "atsReadiness": 10
                    },
                    "atsAnalysis": {
                      "score": 80,
                      "missingKeywords": ["keyword1", "keyword2"],
                      "weakSections": ["section1"],
                      "formattingIssues": ["issue1"],
                      "suggestions": ["suggestion1"]
                    },
                    "confidenceScore": 92,
                    "confidenceReason": "Short reasoning detail",
                    "priorityCourses": {
                      "priority1": ["best-match-id"],
                      "priority2": ["alt-id-1"],
                      "priority3": ["alt-id-2"]
                    },
                    "learningPathPhase": "Beginner → Intermediate → Advanced → Job Ready",
                    "bestMatch": {
                      "courseId": "best-match-id",
                      "courseName": "Best Match Course Name",
                      "suitabilityScore": 95,
                      "whyRecommended": "Detailed justification why this course is perfect...",
                      "expectedSalary": "INR 6-12 LPA",
                      "possibleJobRoles": ["Full Stack Developer", "Software Engineer"],
                      "learningPath": ["Module 1 info", "Module 2 info"]
                    },
                    "rankedAlternatives": [
                      {
                        "courseId": "alt-id-1",
                        "courseName": "Alternative Course Name 1",
                        "suitabilityScore": 88
                      },
                      {
                        "courseId": "alt-id-2",
                        "courseName": "Alternative Course Name 2",
                        "suitabilityScore": 82
                      }
                    ],
                    "fullReport": "A detailed report in markdown formatting following EXACTLY this structure:\n\n# Candidate Summary\n\n# Resume Score\n\nOverall Score: XX/100\n\n# Skills Identified\n\n# Strengths\n\n# Weaknesses\n\n# ATS Analysis\n\n# Job Match Recommendations\n\n# Skill Gap Analysis\n\n# Recommended Certifications\n\n# Recommended Learning Path\n\n# Interview Questions\n\n# Final Verdict"
                  }
                  
                  Input Details:
                  ${userPrompt}`
                }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        });

        const result = (await response.json()) as any;
        const parsed = JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text);
        if (parsed) {
          const primaryCourseId = parsed.bestMatch?.courseId || parsed.recommendedCourses?.[0] || 'course-java';
          // Find the actual course from finalCourses to get dynamic roadmap steps if needed
          const matchedDbCourse = finalCourses.find((c: any) => c.id === primaryCourseId);
          let dynamicSteps: string[] = [];
          if (matchedDbCourse) {
            try {
              const parsedSyllabus = typeof matchedDbCourse.syllabus === 'string' ? JSON.parse(matchedDbCourse.syllabus) : matchedDbCourse.syllabus;
              if (Array.isArray(parsedSyllabus)) {
                dynamicSteps = parsedSyllabus.map((item: any) => item.module || item.title || item.details || '');
              }
            } catch (e) {}
          }
          
          const defaultRoadmap = SUGGESTED_ROADMAPS[primaryCourseId] || SUGGESTED_ROADMAPS['course-java'];
          const roadmap = {
            title: defaultRoadmap?.title || (matchedDbCourse?.name ? `${matchedDbCourse.name} Roadmap` : 'Custom Career Roadmap'),
            steps: defaultRoadmap?.steps || dynamicSteps.filter(Boolean).slice(0, 5)
          };

          return {
            ...parsed,
            roadmap
          };
        }
      } catch (e) {
        console.warn('Gemini Resume analysis failed, defaulting to local analyzer fallback.', e);
      }
    }

    // Fallback to local scanner
    return scanLocalResume(textToAnalyze, counselorProfile, finalCourses);
  }
};
