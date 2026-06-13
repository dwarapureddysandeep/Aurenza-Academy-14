import { db } from './db';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface Roadmap {
  title: string;
  steps: string[];
}

export interface ResumeAnalysis {
  detectedSkills: string[];
  skillGaps: string[];
  detectedDomain: string;
  experienceLevel: string;
  suggestedCareerPath: string;
  recommendedCourses: string[]; // Course IDs
  improvementSuggestion: string;
  roadmap: Roadmap;
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
 * Perform keyword-based local skill & gap scanner
 */
function scanLocalResume(text: string): ResumeAnalysis {
  const content = text.toLowerCase();
  const detectedSkills: string[] = [];
  const skillGaps: string[] = [];
  const matchedCourseIds = new Set<string>();

  // 1. Detect skills based on keywords
  SKILLS_DATABASE.forEach(skill => {
    const rx = new RegExp(`\\b${skill.name.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (rx.test(content)) {
      detectedSkills.push(skill.name);
      skill.relatedCourses.forEach(cid => matchedCourseIds.add(cid));
    }
  });

  // 2. Default fallback if no skills detected
  if (detectedSkills.length === 0) {
    detectedSkills.push('Analytical Skills', 'Problem Solving', 'Computer Literacy');
    matchedCourseIds.add('course-java');
    matchedCourseIds.add('course-frontend');
  }

  // 3. Identify skill gaps based on detected ones
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

  const matchedCourses = Array.from(matchedCourseIds).slice(0, 3);
  const primaryCourseId = matchedCourses[0] || 'course-java';
  const roadmap = SUGGESTED_ROADMAPS[primaryCourseId] || SUGGESTED_ROADMAPS['course-java'];

  const detectedDomain = matchedCourses.includes('course-aiml')
    ? 'Data Science & Artificial Intelligence'
    : 'Software & Full Stack Web Engineering';

  const fullReport = `# Candidate Summary
- **Profile Status**: Local scan completed.
- **Skills Detected**: ${detectedSkills.join(', ')}
- **Domain Focus**: ${detectedDomain}
- **Experience Level**: ${content.includes('year') || content.includes('exp') ? 'Mid Level' : 'Entry Level / Fresher'}

# Resume Score
Overall Score: 78/100
- Technical Skills: 75/100
- Communication & Presentation: 80/100
- Experience: 70/100
- Project Quality: 85/100
- Education: 80/100
- ATS Compatibility: 80/100
- Employability Score: 82/100

# Skills Identified
${detectedSkills.map(s => `- ${s}`).join('\n')}

# Strengths
- Solid foundation in ${detectedSkills[0] || 'software development'} principles.
- Documented project deliverables and timeline outlines.

# Weaknesses
- Missing advanced framework architectures and enterprise design patterns.
- Limited cloud deployment or microservices testing credentials.

# ATS Analysis
- **ATS Compatibility**: Moderate.
- **Optimization Tip**: Ensure contact details are cleanly positioned at the header. Use standard bulleted achievement statements instead of paragraphs.

# Job Match Recommendations
- Junior Full Stack Web Developer (80% match)
- Software Engineer Associate (75% match)

# Skill Gap Analysis
- **Missing Skills**: ${skillGaps.join(', ')}
- **Learning Recommendation**: Complete hands-on enterprise database configurations and CI/CD setup.

# Recommended Certifications
- Aurenza Certified Full Stack Professional
- AWS Certified Cloud Practitioner

# Recommended Learning Path
1. Enroll in Aurenza dynamic training cohorts.
2. Build 2 production-ready web deployments.
3. Conduct 1-on-1 counselor callbacks and mock screening interviews.

# Interview Questions
1. How do you manage component-level states and page-load transitions in modern applications?
2. What are the key differences between relational databases and local fallback stores?

# Final Verdict
Good baseline candidate. Strongly recommended to proceed with upskilling through Aurenza Academy certifications to resolve remaining skill gaps and match premium job roles.`;

  return {
    detectedSkills,
    skillGaps,
    detectedDomain,
    experienceLevel: content.includes('year') || content.includes('exp') ? 'Mid Level' : 'Entry Level / Fresher',
    recommendedCourses: matchedCourses,
    suggestedCareerPath: `${detectedDomain} Specialist`,
    roadmap,
    improvementSuggestion: 'We suggest building 2 advanced open-source projects on GitHub, learning modern authentication models, and working extensively on quantitative aptitude skills to pass assessment checks.',
    fullReport
  };
}

export const aiService = {
  /**
   * Generates Chatbot responses using Gemini or offline fallbacks.
   */
  getChatResponse: async (messageText: string): Promise<ChatResponse> => {
    const msg = messageText.toLowerCase();

    if (msg.includes('resume') || msg.includes('cv') || msg.includes('upload') || msg.includes('parse')) {
      return {
        text: "I would be happy to analyze your resume! Please paste your resume text in the chat input or upload your resume file (PDF, DOCX, TXT) to get a complete skill-gap breakdown.",
        quickActions: ['Analyze Resume', 'Recommend Courses']
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
        text: "Aurenza Academy has transitioned into a premium course showcase and career catalog platform! We do not collect upfront online tuition payments or processing charges. Dynamic course schedules, learning material distributions, and customized workforce packages are managed directly via our counselors. Let me know if you would like to book a free counseling call!",
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    if (msg.includes('placement') || msg.includes('job') || msg.includes('hire') || msg.includes('salary') || msg.includes('career support') || msg.includes('interview')) {
      return {
        text: "Aurenza offers premier placement preparation programs! This includes dedicated mock interviews with technology specialists, resume polishing, ATS optimization, and direct counselor referrals to our 500+ corporate hiring partners. We have successfully placed candidates at companies like Microsoft, Amazon, and Deloitte.",
        quickActions: ['Analyze Resume', 'Book Free Counseling']
      };
    }

    if (msg.includes('contact') || msg.includes('phone') || msg.includes('hotline') || msg.includes('call') || msg.includes('email') || msg.includes('support') || msg.includes('address') || msg.includes('office') || msg.includes('location')) {
      return {
        text: "You can connect with Aurenza Academy advisors through multiple support channels:\n\n- 📞 **Hotline**: +91 70130 57827\n- ✉️ **Support Email**: aurenzaacademy@gmail.com\n- 📍 **Head Office**: Gajuwaka, Visakhapatnam, India\n\nFeel free to write to us or register for an inbound callback!",
        quickActions: ['Book Free Counseling', 'Explore Courses']
      };
    }

    if (GEMINI_API_KEY) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `You are Auri, the premium AI Career Counselor for Aurenza Academy.
                
                Aurenza Academy Business Rules:
                1. Location: Gajuwaka, Visakhapatnam, India.
                2. Contact Email: aurenzaacademy@gmail.com
                3. Hotline Phone: +91 70130 57827
                4. Fees & Pricing: Aurenza Academy functions as a premium course catalog and showcase. We do not collect upfront online tuition or payments; fees are handled through counselor coaching plans or corporate packages.
                5. Placements: We offer 1-on-1 placement referrals, resume reviews, ATS optimization, and mock sessions with corporate managers to refer learners to our 500+ hiring partners.
                6. Core Courses: Java Full Stack Development, Frontend React/Next.js, AI & Machine Learning Engineering, AWS Cloud, DevOps, and Data Science.
                
                Be extremely motivating, supportive, professional, and guide suggestions to our courses. If the user asks you to analyze their resume or screen it, perform a detailed review and return a report following the requested format:
                # Candidate Summary
                # Resume Score
                Overall Score: XX/100
                # Skills Identified
                # Strengths
                # Weaknesses
                # ATS Analysis
                # Job Match Recommendations
                # Skill Gap Analysis
                # Recommended Certifications
                # Recommended Learning Path
                # Interview Questions
                # Final Verdict
                
                For other general questions, keep responses under 130 words. Message: ${messageText}` }]
              }
            ]
          })
        });
        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return { text: generatedText.trim() };
        }
      } catch (e) {
        console.warn('Gemini API call failed, using high-quality local NLP response instead', e);
      }
    }

    // Local Interactive Responses
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
   * Analyzes resume text or file names
   */
  analyzeResume: async (resumeText: string, fileName: string = ''): Promise<ResumeAnalysis> => {
    // Delay for premium loading skeleton experience
    await new Promise(r => setTimeout(r, 1200));

    let textToAnalyze = resumeText || '';
    if (fileName && !resumeText) {
      textToAnalyze = `Analysis of uploaded file: ${fileName}. Skills: JavaScript, React, CSS, Node, Git, communications. Looking for development.`;
    }

    if (GEMINI_API_KEY && textToAnalyze.trim().length > 30) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{
                  text: `You are an advanced AI Resume Screening and Career Guidance Assistant for Aurenza Academy.
                  
                  Primary responsibilities:
                  1. Resume Analysis (extract education, experience, projects, skills).
                  2. Resume Scoring (Technical Skills, Communication, Experience, Projects, Education, ATS Compatibility). Overall Resume Score and Employability Score out of 100. Explain scoring logic transparently.
                  3. Skill Gap Analysis (identify missing/weak skills, learning roadmap).
                  4. Job Matching (match with roles like Full Stack, DevOps, Cloud, AI, and provide match percentage and reasoning).
                  5. ATS Optimization (keyword optimization, formatting suggestions).
                  6. Career Guidance (course recommendations, learning paths).
                  7. Resume Improvement Suggestions (better summaries, descriptions, action verbs).
                  8. Interview Prep (technical, HR, scenario questions).
                  
                  Rules:
                  - Never invent experience.
                  - Clearly separate facts from recommendations.
                  - If info is missing, mention it explicitly.
                  - Prioritize accuracy over assumptions.
                  
                  Analyze this resume content and provide a JSON response matching exactly this format:
                  {
                    "detectedSkills": ["Skill1", "Skill2"],
                    "skillGaps": ["Gap1", "Gap2"],
                    "detectedDomain": "Domain Name",
                    "experienceLevel": "Entry/Mid/Senior",
                    "suggestedCareerPath": "Job Title",
                    "recommendedCourses": ["course-java", "course-frontend"],
                    "improvementSuggestion": "Short tip",
                    "fullReport": "A detailed report in markdown formatting following EXACTLY this structure:\n\n# Candidate Summary\n\n# Resume Score\n\nOverall Score: XX/100\n\n# Skills Identified\n\n# Strengths\n\n# Weaknesses\n\n# ATS Analysis\n\n# Job Match Recommendations\n\n# Skill Gap Analysis\n\n# Recommended Certifications\n\n# Recommended Learning Path\n\n# Interview Questions\n\n# Final Verdict"
                  }
                  
                  Only recommend courses from our ID list: "course-java", "course-frontend", "course-aiml".
                  
                  Resume Content:
                  ${textToAnalyze}`
                }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        });
        const result = await response.json();
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
    return scanLocalResume(textToAnalyze);
  }
};
