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

  return {
    detectedSkills,
    skillGaps,
    detectedDomain,
    experienceLevel: content.includes('year') || content.includes('exp') ? 'Mid Level' : 'Entry Level / Fresher',
    recommendedCourses: matchedCourses,
    suggestedCareerPath: `${detectedDomain} Specialist`,
    roadmap,
    improvementSuggestion: 'We suggest building 2 advanced open-source projects on GitHub, learning modern authentication models, and working extensively on quantitative aptitude skills to pass assessment checks.'
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

    if (GEMINI_API_KEY) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `You are Auri, the premium AI Career Counselor for Aurenza Academy. Aurenza Academy offers elite certifications in Java Full Stack Development, Frontend React/Next.js, and AI & Machine Learning Engineering. Be extremely motivating, supportive, professional, and guide suggestions to our courses. Keep responses under 130 words. Message: ${messageText}` }]
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
                  text: `Analyze this resume content. Provide a JSON response matching exactly this format:
                  {
                    "detectedSkills": ["Skill1", "Skill2"],
                    "skillGaps": ["Gap1", "Gap2"],
                    "detectedDomain": "Domain Name",
                    "experienceLevel": "Entry/Mid/Senior",
                    "suggestedCareerPath": "Job Title",
                    "recommendedCourses": ["course-java", "course-frontend"],
                    "improvementSuggestion": "Detailed tip here"
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
