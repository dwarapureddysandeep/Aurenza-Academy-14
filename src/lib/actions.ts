"use server";

import { db } from './db';
import { signToken, verifyToken } from './jwt';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Password hashing simulation matching the old DB logic
function hashPassword(password: string): string {
  if (!password) return '';
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'aur_hash_' + Math.abs(hash).toString(16);
}

// ==========================================
// AUTHENTICATION SERVER ACTIONS
// ==========================================

export async function registerUser(formData: any) {
  try {
    const { name, email, password, phone } = formData;
    if (!name || !email || !password) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newUser = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashPassword(password),
        phone: phone || "",
        role: "STUDENT",
        avatar: initials,
        bio: "Aspiring Tech Professional",
        permissions: []
      }
    });

    // Create session token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    // Store in cookie (Next.js 15 requires awaiting cookies())
    const cookieStore = await cookies();
    cookieStore.set('aurenza_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        bio: newUser.bio
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Registration failed." };
  }
}

export async function loginUser(formData: any) {
  try {
    const { email, password } = formData;
    if (!email || !password) {
      return { success: false, error: "Please specify both email and password." };
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || user.password !== hashPassword(password)) {
      return { success: false, error: "Invalid email or password credentials." };
    }

    // Sign session
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Store cookie
    const cookieStore = await cookies();
    cookieStore.set('aurenza_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        permissions: user.permissions
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Authentication failed." };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('aurenza_session');
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('aurenza_session');
    if (!tokenCookie || !tokenCookie.value) return null;

    const payload = verifyToken(tokenCookie.value);
    if (!payload || !payload.userId) return null;

    const user = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      phone: user.phone,
      permissions: user.permissions
    };
  } catch (e) {
    return null;
  }
}

// ==========================================
// CRM LEADS SERVER ACTIONS
// ==========================================

export async function submitConsultationLead(formData: any) {
  try {
    const { name, email, phone, course, message } = formData;
    if (!name || !email || !phone || !course) {
      return { success: false, error: "Please fill in all required contact details." };
    }

    const newLead = await db.lead.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        course,
        message: message || "",
        status: "NEW",
        notes: ""
      }
    });

    console.log(`[LEAD DISPATCHED] Consultation booked by: ${name} (${email}) for course ${course}`);

    return { success: true, leadId: newLead.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit counseling request." };
  }
}

export async function submitCorporateLead(formData: any) {
  try {
    const { name, company, email, phone, size, message } = formData;
    if (!name || !company || !email || !phone || !size) {
      return { success: false, error: "Please populate all corporate form items." };
    }

    const corporateLead = await db.corporateLead.create({
      data: {
        name,
        company,
        email: email.toLowerCase(),
        phone,
        size,
        message: message || "",
        status: "New"
      }
    });

    return { success: true, leadId: corporateLead.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit enterprise consultation request." };
  }
}

export async function updateLeadStatusAction(leadId: string, status: any, notes: string = "") {
  try {
    const updated = await db.lead.update({
      where: { id: leadId },
      data: { status, notes }
    });
    return { success: true, lead: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update lead status." };
  }
}

// ==========================================
// COURSE MANAGEMENT ACTIONS
// ==========================================

export async function getCoursesAction() {
  try {
    const courses = await db.course.findMany();
    return { success: true, courses };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCourseBySlugAction(slug: string) {
  try {
    const course = await db.course.findUnique({
      where: { slug }
    });
    if (!course) return { success: false, error: "Course not found." };
    return { success: true, course };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveCourseAction(courseData: any) {
  try {
    const { id, name, price, duration, level, image, mentorName, mentorExp, mentorAvatar, mentorBio, categoryId } = courseData;
    
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const dataObj = {
      name,
      slug,
      price: parseFloat(price),
      duration,
      level,
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      mentorName,
      mentorExp,
      mentorAvatar: mentorAvatar || "M",
      mentorBio: mentorBio || "",
      categoryId: categoryId || "cat-7",
      syllabus: courseData.syllabus || JSON.stringify([]),
      faqs: courseData.faqs || JSON.stringify([])
    };

    let savedCourse;
    if (id) {
      savedCourse = await db.course.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedCourse = await db.course.create({
        data: dataObj
      });
    }

    return { success: true, course: savedCourse };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save course data." };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    await db.course.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete course." };
  }
}

// ==========================================
// STUDENT & CHECKOUT ACTIONS
// ==========================================

export async function enrollStudentAction(userId: string, courseId: string, price: number) {
  try {
    // 1. Create mock checkout payment
    const payment = await db.payment.create({
      data: {
        userId,
        courseId,
        amount: price,
        status: "Success",
        txId: `TXN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
      }
    });

    // 2. Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
        lastLesson: "Introduction"
      }
    });

    return { success: true, enrollment, payment };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to complete course purchase." };
  }
}

export async function updateProgressAction(userId: string, courseId: string, progress: number, lastLesson: string) {
  try {
    // Standard Prisma compound unique constraint matching @@unique([userId, courseId])
    // Mock proxy handles simple equals in findFirst / update
    const enrollment = await db.enrollment.findFirst({
      where: { userId, courseId }
    });

    if (!enrollment) {
      return { success: false, error: "Enrollment record not found." };
    }

    const updated = await db.enrollment.update({
      where: { id: enrollment.id },
      data: { progress, lastLesson }
    });

    return { success: true, enrollment: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save progress." };
  }
}

export async function generateCertificateAction(userId: string, userName: string, courseId: string, courseName: string) {
  try {
    const uniqueHash = `AUR-${courseId.replace('course-', '').toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    
    const cert = await db.certificate.create({
      data: {
        userId,
        courseId,
        name: userName,
        courseName,
        completionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        certId: uniqueHash
      }
    });
    return { success: true, certificate: cert };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate completion certificate." };
  }
}

// ==========================================
// AI ASSISTANT SERVER ACTIONS
// ==========================================

import { aiService } from './ai';

export async function getAIChatResponseAction(message: string) {
  try {
    return await aiService.getChatResponse(message);
  } catch (err: any) {
    return { text: "I'm sorry, I encountered an issue parsing your query. Please try again." };
  }
}

export async function analyzeResumeAction(resumeText: string, fileName: string = '') {
  try {
    return await aiService.analyzeResume(resumeText, fileName);
  } catch (err: any) {
    return {
      detectedSkills: ["Analytical Skills"],
      skillGaps: ["Advanced Framework Architecture"],
      detectedDomain: "Software Engineering",
      experienceLevel: "Entry Level",
      recommendedCourses: ["course-java"],
      suggestedCareerPath: "Full Stack Engineer",
      improvementSuggestion: "Unable to parse resume, displaying default path. Please try pasting the text directly.",
      roadmap: {
        title: "Software Engineering Path",
        steps: ["Introduction", "Full Stack Development", "Deployment"]
      }
    };
  }
}

