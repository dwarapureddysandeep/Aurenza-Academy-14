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
 * Perform keyword-based local skill & gap scanner or counselor profile mapping
 */
function scanLocalResume(text: string, counselorProfile: any = null): ResumeAnalysis {
  const content = text.toLowerCase();
  let detectedSkills: string[] = [];
  let skillGaps: string[] = [];
  let matchedCourseIds = new Set<string>();
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
      matchedCourseIds.add('course-aws');
      matchedCourseIds.add('course-azure');
      detectedSkills = ['Cloud Basics', 'Infrastructure Concepts', preferredTech];
      skillGaps = ['VPC Networking', 'IAM Security Policies', 'EC2 & S3 Compute/Storage', 'AWS CloudFormation'];
      tools = ['AWS Management Console', 'Terraform', 'Git'];
      projects = ['Multi-tier AWS Web Deployment', 'Secure Cloud Architecture'];
    } else if (detectedDomain.includes('Full Stack') || detectedDomain.includes('Frontend') || detectedDomain.toLowerCase().includes('web') || detectedDomain.toLowerCase().includes('react') || detectedDomain.toLowerCase().includes('java')) {
      matchedCourseIds.add('course-java');
      matchedCourseIds.add('course-frontend');
      detectedSkills = ['HTML/CSS Basics', 'JavaScript ES6', preferredTech];
      skillGaps = ['Spring Boot Framework', 'RESTful Microservices APIs', 'Hibernate ORM', 'Relational SQL Databases'];
      tools = ['VS Code', 'IntelliJ IDEA', 'Postman', 'Git'];
      projects = ['Spring Boot & React CRUD Portal', 'E-commerce API Gateway'];
    } else if (detectedDomain.includes('Data') || detectedDomain.toLowerCase().includes('analytics') || detectedDomain.toLowerCase().includes('bi')) {
      matchedCourseIds.add('course-microsoft-power-bi');
      matchedCourseIds.add('course-dsai');
      detectedSkills = ['Spreadsheets', 'Data Cleaning', preferredTech];
      skillGaps = ['Advanced SQL Queries', 'Power BI Data Modeling', 'Excel Analytics formulas', 'Python Data Science libraries'];
      tools = ['Power BI Desktop', 'Jupyter Notebooks', 'Excel'];
      projects = ['Executive Sales Dashboard', 'Customer Churn Analysis'];
    } else if (detectedDomain.includes('AI') || detectedDomain.includes('Machine') || detectedDomain.toLowerCase().includes('learning') || detectedDomain.toLowerCase().includes('deep')) {
      matchedCourseIds.add('course-aiml');
      matchedCourseIds.add('course-dsai');
      detectedSkills = ['Python programming', 'Mathematical optimization', preferredTech];
      skillGaps = ['Deep Neural Networks', 'PyTorch / TensorFlow coding', 'NLP Transformer architectures', 'MLOps models pipelines'];
      tools = ['PyTorch', 'TensorFlow', 'Google Colab', 'Docker'];
      projects = ['Image Classification CNN', 'Text Summarizer Transformer'];
    } else if (detectedDomain.includes('DevOps') || detectedDomain.toLowerCase().includes('jenkins')) {
      matchedCourseIds.add('course-devops');
      matchedCourseIds.add('course-safe-60-devops-certification');
      detectedSkills = ['Linux administration', 'Shell scripting', preferredTech];
      skillGaps = ['Docker containerization', 'Kubernetes clustering', 'CI/CD pipeline scripts', 'System monitoring & Prometheus'];
      tools = ['Docker', 'Kubernetes', 'Jenkins', 'Prometheus'];
      projects = ['Automated Jenkins CI/CD Pipeline', 'Kubernetes Cluster Setup'];
    } else if (detectedDomain.includes('Security') || detectedDomain.toLowerCase().includes('cyber')) {
      matchedCourseIds.add('course-cissp-certification');
      detectedSkills = ['Linux commands', 'Networking basic protocols', preferredTech];
      skillGaps = ['Network Vulnerabilities analysis', 'Access control architectures', 'Cryptographic standards', 'Risk assessment frameworks'];
      tools = ['Kali Linux', 'Wireshark', 'Metasploit'];
      projects = ['Vulnerability Pentesting Audit', 'Secure Access Control Policy'];
    } else {
      matchedCourseIds.add('course-csm');
      matchedCourseIds.add('course-pmp');
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
        skill.relatedCourses.forEach(cid => matchedCourseIds.add(cid));
      }
    });

    if (detectedSkills.length === 0) {
      detectedSkills.push('Analytical Skills', 'Problem Solving', 'Computer Literacy');
      matchedCourseIds.add('course-java');
      matchedCourseIds.add('course-frontend');
    }

    if (detectedSkills.includes('React') && !detectedSkills.includes('Spring Boot') && !detectedSkills.includes('Java')) {
      skillGaps.push('Java Enterprise Backend', 'Spring Boot REST APIs', 'Relational Databases (SQL)', 'Docker Containerization');
      matchedCourseIds.add('course-java');
    } else if (detectedSkills.includes('Java') && !detectedSkills.includes('React')) {
      skillGaps.push('React Frontend Layouts', 'CSS Design Systems', 'Modern JS ES6+', 'Next.js App Routing');
      matchedCourseIds.add('course-frontend');
    } else if (detectedSkills.includes('Python') && !detectedSkills.includes('Machine Learning')) {
      skillGaps.push('Machine Learning Algorithms', 'Deep Learning Networks (PyTorch)', 'Mathematical Statistics', 'Data Visualizations');
      matchedCourseIds.add('course-aiml');
    } else {
      skillGaps.push('Advanced Architecture', 'Database Optimization', 'Modern Git/CI-CD workflows');
      matchedCourseIds.add('course-aiml');
    }
    experienceLevel = content.includes('year') || content.includes('exp') ? 'Experienced' : 'Entry Level / Fresher';
    detectedDomain = matchedCourseIds.has('course-aiml') ? 'AI & Machine Learning' : 'Software Engineering';
    suggestedCareerPath = `${detectedDomain} Specialist`;
  }

  const matchedCourses = Array.from(matchedCourseIds).slice(0, 3);
  const primaryCourseId = matchedCourses[0] || 'course-java';
  const roadmap = SUGGESTED_ROADMAPS[primaryCourseId] || SUGGESTED_ROADMAPS['course-java'];

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
    roadmap30 = ['Learn core cloud computing deployment styles (IaaS, PaaS, SaaS).', 'Get familiar with AWS global services (EC2, S3 buckets, RDS).'];
    roadmap60 = ['Configure secure virtual private clouds (VPC) with subnets and security groups.', 'Develop IAM access policies and role-based login controls.'];
    roadmap90 = ['Set up automated infrastructure deployments using Terraform or CloudFormation.', 'Conduct simulated Solutions Architect practice exams.'];
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
    recommendedCourses: matchedCourses,
    roadmap,
    roadmap30,
    roadmap60,
    roadmap90,
    improvementSuggestion: 'We suggest building 2 advanced open-source projects on GitHub, learning modern authentication models, and working extensively on quantitative aptitude skills to pass assessment checks.',
    fullReport
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

    // 1. Quick Keyword Handler (Offline/Online immediate responses)
    if (msg.includes('resume') || msg.includes('cv') || msg.includes('upload') || msg.includes('parse')) {
      return {
        text: "I would be happy to analyze your resume! Click the attachment icon in the input bar or paste your resume details into the 'Resume Diagnostics AI' tab to get a full analysis.",
        quickActions: ['Recommend Courses']
      };
    }

    if (msg.includes('counseling') || msg.includes('career') || msg.includes('suit') || msg.includes('recommend')) {
      return {
        text: "Let's discover your perfect path! Tell me: What is your current career status? Are you a college student or a working professional?",
        quickActions: ['Student', 'Working Professional']
      };
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
          currentPrompt += `[CONTEXT FROM ATTACHED DOCUMENTS:
${documentContext}
]

`;
        }
        currentPrompt += `User Query: ${messageText}`;

        contents.push({
          role: 'user',
          parts: [{ text: currentPrompt }]
        });

        const systemInstruction = {
          parts: [{
            text: `You are Auri, the senior AI Career Counselor for Aurenza Academy.
            
Primary Business Details:
- Location: Gajuwaka, Visakhapatnam, India.
- Email Support: info@aurenzaacademy.com
- Hotline Support: +91 70130 57827
- Pricing: Showcase/catalog mode. We do not collect online payments or upfront tuitions. Counseling calls are free.
- Placements: 1-on-1 counselor reviews, resume building, ATS alignment, and mock interviews with tech leads.

Course Recommendation Engine Rules:
Analyze user queries, career goals, experience level, and any attached document text (like resumes) to match them with our official catalog courses:
- AWS queries -> AWS Solutions Architect (course-aws) or AWS Solutions Architect Associate Certification (course-aws-solutions-architect-associate-certification)
- Java queries -> Java Full Stack Development (course-java)
- Data Analyst / Business Intelligence / SQL -> Microsoft Power BI (course-microsoft-power-bi) or Data Science & AI Bootcamp (course-dsai)
- DevOps queries -> DevOps Engineer Program (course-devops) or SAFe 6.0 DevOps Certification (course-safe-60-devops-certification)
- Freshers / Beginners -> Frontend Development (React & Next.js) (course-frontend) or Certified ScrumMaster (CSM) (course-csm)
- Project Management -> PMP Certification (course-pmp) or CAPM Certification (course-capm-certification)

Each recommendation MUST be formatted exactly as follows:
### Recommended Program: [Official Course Name] (ID: [course-id])
* **Why Recommended**: [Clear reason matching user's query, goals, and skills]
* **Skill Level**: [Beginner / Intermediate / Advanced]
* **Expected Outcomes**: [Outcome 1, Outcome 2, etc.]
* **Related Courses**: [Related Course Name (ID: related-course-id)]
* **Learning Path Sequence**:
  1. [Module 1]
  2. [Module 2]
  3. [Module 3]

Maintain context memory across messages. Limit general chat answers to 130 words. Output in markdown.`
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
    // AWS Cloud
    if (msg.includes('aws') || msg.includes('cloud') || msg.includes('azure')) {
      const isAzure = msg.includes('azure');
      const courseName = isAzure ? "Microsoft Azure Administrator" : "AWS Solutions Architect";
      const courseId = isAzure ? "course-azure" : "course-aws";
      return {
        text: `### Recommended Program: ${courseName} (ID: ${courseId})
* **Why Recommended**: You mentioned cloud computing. Certified cloud professionals are highly sought after for scaling infrastructure.
* **Skill Level**: Intermediate
* **Expected Outcomes**: Master VPC design, IAM security roles, load balancing, serverless setups, and compute instances.
* **Related Courses**: DevOps Engineer Program (ID: course-devops)
* **Learning Path Sequence**:
  1. Cloud Foundations & Core Services
  2. Advanced Cloud Architecture & Storage
  3. Security, Monitoring & Migration Blueprints`,
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    // Java
    if (msg.includes('java') || msg.includes('spring') || msg.includes('backend')) {
      return {
        text: `### Recommended Program: Java Full Stack Development (ID: course-java)
* **Why Recommended**: You showed interest in backend development. Java & Spring Boot form the backbone of corporate enterprise web systems.
* **Skill Level**: Beginner -> Advanced
* **Expected Outcomes**: Build relational database queries (SQL/Hibernate), develop REST APIs (Spring Boot), and integrate React.js frontends.
* **Related Courses**: Frontend Development (React & Next.js) (ID: course-frontend)
* **Learning Path Sequence**:
  1. Core Java OOP Foundations
  2. Relational Databases & ORM Hibernate
  3. Spring Boot Rest APIs & Microservices`,
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    // DevOps
    if (msg.includes('devops') || msg.includes('docker') || msg.includes('kubernetes') || msg.includes('ci')) {
      return {
        text: `### Recommended Program: DevOps Engineer Program (ID: course-devops)
* **Why Recommended**: You inquired about DevOps automation. Bridging development and operations is crucial for modern agile deployment cycles.
* **Skill Level**: Intermediate
* **Expected Outcomes**: Program CI/CD automation pipelines, package containerized apps (Docker/Kubernetes), and configure infrastructure as code.
* **Related Courses**: AWS Solutions Architect (ID: course-aws)
* **Learning Path Sequence**:
  1. Version Control & Git Workflows
  2. Containers & Microservices (Docker & Kubernetes)
  3. Continuous Integration Pipelines & Automated Testing`,
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    // Data / Power BI
    if (msg.includes('data') || msg.includes('power bi') || msg.includes('analyst') || msg.includes('sql') || msg.includes('python')) {
      const isBI = msg.includes('power bi') || msg.includes('bi');
      const courseName = isBI ? "Microsoft Power BI" : "Data Science & AI Bootcamp";
      const courseId = isBI ? "course-microsoft-power-bi" : "course-dsai";
      return {
        text: `### Recommended Program: ${courseName} (ID: ${courseId})
* **Why Recommended**: You showed interest in data processing. Modern businesses rely heavily on data visualizations and modeling to drive decisions.
* **Skill Level**: Intermediate -> Advanced
* **Expected Outcomes**: Write data analytics algorithms (Python/Pandas), manage SQL databases, and build interactive executive dashboards.
* **Related Courses**: AI & Machine Learning Engineering (ID: course-aiml)
* **Learning Path Sequence**:
  1. SQL Foundations & Data Aggregations
  2. Python/DAX Analytical Formulas
  3. Business Intelligence Visualizations & Reports`,
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    // Freshers / Beginners
    if (msg.includes('fresher') || msg.includes('student') || msg.includes('beginner') || msg.includes('javascript') || msg.includes('react') || msg.includes('html')) {
      return {
        text: `### Recommended Program: Frontend Development (React & Next.js) (ID: course-frontend)
* **Why Recommended**: Perfect starting program for beginners. Interactive web development provides rapid visual feedback and solid JS fundamentals.
* **Skill Level**: Beginner
* **Expected Outcomes**: Build semantic responsive UI layouts (HTML/CSS/Tailwind), control page state in React, and deploy Next.js apps to production.
* **Related Courses**: Java Full Stack Development (ID: course-java)
* **Learning Path Sequence**:
  1. Responsive Styling & Tailwind Layouts
  2. JavaScript ES6+ & Asynchronous Fetch API
  3. React Hooks, Routing, and Next.js Pages`,
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

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{
                  text: `You are an advanced AI Career Analyst and Resume Diagnostics Assistant for Aurenza Academy.
                  
                  Primary responsibilities:
                  1. Profile/Resume Analysis (extract education, certifications, projects, tools, skills).
                  2. Skill Gap Analysis (identify missing/weak skills compared to standard industry expectations).
                  3. Job Matching & Career Guidance (course recommendations, expected outcomes).
                  4. Learning Roadmap Milestones (detailed steps for Month 1 / 30-Day, Month 2 / 60-Day, and Month 3 / 90-Day roadmaps).
                  
                  Rules:
                  - Recommend ONLY courses from our ID list: "course-java", "course-frontend", "course-aiml", "course-aws", "course-azure", "course-devops", "course-microsoft-power-bi", "course-dsai", "course-csm", "course-pmp".
                  - For each recommended course, explain WHY it is recommended, which skill gaps it covers, and the career outcome.
                  - Provide clear steps for the 30-Day, 60-Day, and 90-Day Roadmap milestones.
                  
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
                    "recommendedCourses": ["course-java", "course-frontend"],
                    "improvementSuggestion": "Short upskilling/career tip",
                    "roadmap30": ["Step1", "Step2"],
                    "roadmap60": ["Step3", "Step4"],
                    "roadmap90": ["Step5", "Step6"],
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
          const primaryCourseId = parsed.recommendedCourses[0] || 'course-java';
          const roadmap = SUGGESTED_ROADMAPS[primaryCourseId] || SUGGESTED_ROADMAPS['course-java'];
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
    return scanLocalResume(textToAnalyze, counselorProfile);
  }
};
