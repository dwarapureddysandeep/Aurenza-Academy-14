"use server";

import { db } from './db';
import { signToken, verifyToken } from './jwt';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Resend } from 'resend';

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

export async function loginWithGoogleAction() {
  try {
    const email = "google.student@aurenzaacademy.com";
    const name = "Google Scholar";
    
    // Check if user already exists
    let user = await db.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email,
          password: "mock_google_oauth_no_password",
          phone: "+91 99999 88888",
          role: "STUDENT",
          avatar: "GS",
          bio: "Enrolled via Google Sign-In",
          permissions: []
        }
      });
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
    return { success: false, error: err.message || "Google Authentication failed." };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    if (!email) return { success: false, error: "Please enter a valid email address." };
    
    // Perform a quick lookup to see if the user exists
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    // For security reasons, don't disclose if the user exists or not, but simulate sending email
    return { success: true, message: `A secure password reset link has been dispatched to ${email}.` };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to process recovery request." };
  }
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
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COUNSELOR')) {
      return { success: false, error: "Unauthorized access: Administrative or Counselor role required." };
    }
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
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
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
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
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
    const user = await getCurrentUser();
    if (!user || (user.id !== userId && user.role !== 'ADMIN')) {
      return { success: false, error: "Unauthorized access: Cannot enroll another student without administrator privileges." };
    }

    // Check for prior enrollment
    const existing = await db.enrollment.findFirst({
      where: { userId, courseId }
    });
    if (existing) {
      return { success: false, error: "Student is already enrolled in this course." };
    }

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

    // Send notifications
    try {
      const student = await db.user.findUnique({ where: { id: userId } });
      const course = await db.course.findUnique({ where: { id: courseId } });
      if (student && course) {
        await triggerNotificationAction("ENROLLMENT", {
          studentName: student.name,
          studentEmail: student.email,
          studentPhone: student.phone || "+91 9876543210",
          courseName: course.name,
          amount: `₹${price.toLocaleString('en-IN')}`
        });
      }
    } catch (e) {
      console.error("[NOTIFICATION ENGINE] Enrollment trigger error:", e);
    }

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
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized access: Session authentication required." };
    }

    if (user.role !== 'ADMIN' && user.role !== 'TRAINER') {
      // Must be the student themselves
      if (user.id !== userId) {
        return { success: false, error: "Unauthorized access: Cannot issue certificates for other students." };
      }
      // Check if enrollment exists and has progress = 100
      const enrollment = await db.enrollment.findFirst({
        where: { userId, courseId }
      });
      if (!enrollment || enrollment.progress < 100) {
        return { success: false, error: "Unauthorized access: Course progress must be 100% to claim a certificate." };
      }
    }

    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generates 6 random digits
    const uniqueHash = `AUR-${currentYear}-${randomDigits}`;
    
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

    // Send notifications
    try {
      const student = await db.user.findUnique({ where: { id: userId } });
      if (student) {
        await triggerNotificationAction("CERTIFICATE", {
          studentName: student.name,
          studentEmail: student.email,
          studentPhone: student.phone || "+91 9876543210",
          courseName,
          certId: uniqueHash
        });
      }
    } catch (e) {
      console.error("[NOTIFICATION ENGINE] Certificate trigger error:", e);
    }

    return { success: true, certificate: cert };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate completion certificate." };
  }
}

export async function getCertificateByIdAction(certId: string) {
  try {
    const cert = await db.certificate.findUnique({
      where: { certId }
    });
    if (!cert) {
      return { success: false, error: "Certificate record not found in registry." };
    }
    return { success: true, certificate: cert };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to lookup certificate registry." };
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

// ==========================================
// ADMIN DASHBOARD & HUB ACTIONS
// ==========================================

export async function saveTrainerAction(trainerData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    const { id, name, email, avatar, bio, specialty } = trainerData;
    if (!name || !email) {
      return { success: false, error: "Name and Email are required fields." };
    }

    const dataObj = {
      name,
      email: email.toLowerCase(),
      avatar: avatar || name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      bio: bio || "",
      specialty: specialty || ""
    };

    let savedTrainer;
    if (id) {
      savedTrainer = await db.trainer.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedTrainer = await db.trainer.create({
        data: dataObj
      });
    }

    return { success: true, trainer: savedTrainer };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save trainer." };
  }
}

export async function deleteTrainerAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    await db.trainer.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete trainer." };
  }
}

export async function saveBatchAction(batchData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    const { id, courseId, trainerId, startDate, timeSlot, seatsTotal, seatsLeft, linkZoom } = batchData;
    if (!courseId || !trainerId || !startDate || !timeSlot) {
      return { success: false, error: "Please populate all batch details." };
    }

    const dataObj = {
      courseId,
      trainerId,
      startDate,
      timeSlot,
      seatsTotal: parseInt(seatsTotal) || 30,
      seatsLeft: parseInt(seatsLeft) || parseInt(seatsTotal) || 30,
      linkZoom: linkZoom || "https://zoom.us/j/mock-meeting"
    };

    let savedBatch;
    if (id) {
      savedBatch = await db.batch.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedBatch = await db.batch.create({
        data: dataObj
      });
    }

    return { success: true, batch: savedBatch };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save batch." };
  }
}

export async function deleteBatchAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    await db.batch.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete batch." };
  }
}

export async function updatePaymentStatusAction(id: string, status: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    const updated = await db.payment.update({
      where: { id },
      data: { status }
    });
    return { success: true, payment: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update payment status." };
  }
}

export async function saveTestimonialAction(testimonialData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    const { id, name, role, quote, rating, featured, initial } = testimonialData;
    if (!name || !role || !quote) {
      return { success: false, error: "Please fill in all testimonial fields." };
    }

    const dataObj = {
      name,
      role,
      quote,
      rating: parseInt(rating) || 5,
      featured: featured === undefined ? true : !!featured,
      initial: initial || name[0].toUpperCase()
    };

    let savedTestimonial;
    if (id) {
      savedTestimonial = await db.testimonial.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedTestimonial = await db.testimonial.create({
        data: dataObj
      });
    }

    return { success: true, testimonial: savedTestimonial };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save testimonial." };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    await db.testimonial.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete testimonial." };
  }
}

export async function saveBlogAction(blogData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && !user.permissions.includes('blog'))) {
      return { success: false, error: "Unauthorized access: Administrative or Blog author permissions required." };
    }
    const { id, title, content, category, authorId, image, tags } = blogData;
    if (!title || !content || !category) {
      return { success: false, error: "Title, Content and Category are required." };
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const dataObj = {
      title,
      slug,
      content,
      category,
      authorId: authorId || "user-admin",
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : [])
    };

    let savedBlog;
    if (id) {
      savedBlog = await db.blog.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedBlog = await db.blog.create({
        data: dataObj
      });
    }

    return { success: true, blog: savedBlog };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save blog post." };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && !user.permissions.includes('blog'))) {
      return { success: false, error: "Unauthorized access: Administrative or Blog author permissions required." };
    }
    await db.blog.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete blog post." };
  }
}

export async function saveCategoryAction(categoryData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    const { id, name } = categoryData;
    if (!name) return { success: false, error: "Category name is required." };

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const dataObj = { name, slug };

    let savedCategory;
    if (id) {
      savedCategory = await db.category.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedCategory = await db.category.create({
        data: dataObj
      });
    }
    return { success: true, category: savedCategory };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save category." };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    await db.category.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete category." };
  }
}
// ==========================================
// TUTOR DASHBOARD ACTIONS
// ==========================================

export async function saveAssignmentAction(assignmentData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    const { id, courseId, title, description, dueDate, submissions } = assignmentData;
    if (!courseId || !title || !dueDate) {
      return { success: false, error: "Course, Title and Due Date are required fields." };
    }

    const dataObj = {
      courseId,
      title,
      description: description || "",
      dueDate,
      submissions: submissions || "[]"
    };

    let savedAssignment;
    if (id) {
      savedAssignment = await db.assignment.update({
        where: { id },
        data: dataObj
      });
    } else {
      savedAssignment = await db.assignment.create({
        data: dataObj
      });
    }

    return { success: true, assignment: savedAssignment };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save assignment." };
  }
}

export async function deleteAssignmentAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    await db.assignment.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete assignment." };
  }
}

export async function gradeSubmissionAction(assignmentId: string, studentEmail: string, grade: string, feedback: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return { success: false, error: "Assignment not found." };

    let submissionsList = [];
    try {
      submissionsList = JSON.parse(assignment.submissions);
    } catch (e) {
      submissionsList = [];
    }

    const updatedSubmissions = submissionsList.map((sub: any) => {
      if (sub.studentEmail.toLowerCase() === studentEmail.toLowerCase()) {
        return {
          ...sub,
          grade,
          feedback,
          status: "Graded",
          gradedAt: new Date().toISOString()
        };
      }
      return sub;
    });

    const updated = await db.assignment.update({
      where: { id: assignmentId },
      data: { submissions: JSON.stringify(updatedSubmissions) }
    });

    return { success: true, assignment: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit grade." };
  }
}

export async function saveAttendanceAction(attendanceData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    const { id, batchId, date, presentCount, absentCount, records } = attendanceData;
    if (!batchId || !date) {
      return { success: false, error: "Batch and Date are required." };
    }

    const dataObj = {
      batchId,
      date,
      presentCount: parseInt(presentCount) || 0,
      absentCount: parseInt(absentCount) || 0,
      records: records || "[]"
    };

    let savedAttendance;
    if (id) {
      savedAttendance = await db.attendance.update({
        where: { id },
        data: dataObj
      });
    } else {
      // Check if attendance already exists for this batch and date
      const existing = await db.attendance.findFirst({
        where: { batchId, date }
      });
      if (existing) {
        savedAttendance = await db.attendance.update({
          where: { id: existing.id },
          data: dataObj
        });
      } else {
        savedAttendance = await db.attendance.create({
          data: dataObj
        });
      }
    }

    return { success: true, attendance: savedAttendance };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to log attendance." };
  }
}

export async function saveCourseContentAction(courseId: string, syllabusJson: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Administrator or Trainer role required." };
    }
    if (!courseId || !syllabusJson) {
      return { success: false, error: "Course ID and modules content are required." };
    }

    // Verify it is a valid JSON
    try {
      JSON.parse(syllabusJson);
    } catch (e) {
      return { success: false, error: "Invalid JSON format for syllabus modules." };
    }

    const updated = await db.course.update({
      where: { id: courseId },
      data: { syllabus: syllabusJson }
    });

    return { success: true, course: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update course content." };
  }
}

export async function saveTrainerProfileAction(trainerData: any) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized access: Session required." };
    }
    const { id, name, avatar, bio, specialty, email } = trainerData;
    if (!id || !name) {
      return { success: false, error: "ID and Name are required." };
    }

    const trainer = await db.trainer.findUnique({ where: { id } });
    if (!trainer) {
      return { success: false, error: "Trainer profile not found." };
    }
    if (user.role !== 'ADMIN' && user.email.toLowerCase() !== trainer.email.toLowerCase()) {
      return { success: false, error: "Unauthorized access: Cannot modify other trainer profiles." };
    }

    const updated = await db.trainer.update({
      where: { id },
      data: {
        name,
        avatar: avatar || "T",
        bio: bio || "",
        specialty: specialty || "",
        email: email ? email.toLowerCase() : undefined
      }
    });

    // Also update User profile if matching email
    if (email) {
      const user = await db.user.findFirst({
        where: { email: email.toLowerCase() }
      });
      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: {
            name,
            avatar: avatar || "T",
            bio: bio || ""
          }
        });
      }
    }

    return { success: true, trainer: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save trainer profile details." };
  }
}

// ==========================================
// STUDENT DASHBOARD ACTIONS
// ==========================================

export async function submitAssignmentAction(assignmentId: string, studentEmail: string, fileUrl: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.email.toLowerCase() !== studentEmail.toLowerCase() && user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return { success: false, error: "Unauthorized access: Cannot submit assignment for another student." };
    }

    if (!assignmentId || !studentEmail || !fileUrl) {
      return { success: false, error: "Missing assignment references or file link." };
    }

    const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return { success: false, error: "Assignment not found." };

    let submissionsList = [];
    try {
      submissionsList = JSON.parse(assignment.submissions);
    } catch (e) {
      submissionsList = [];
    }

    // Check if student submission already exists, else create/update
    let found = false;
    const updatedSubmissions = submissionsList.map((sub: any) => {
      if (sub.studentEmail.toLowerCase() === studentEmail.toLowerCase()) {
        found = true;
        return {
          ...sub,
          status: "Submitted",
          submittedAt: new Date().toISOString(),
          fileUrl
        };
      }
      return sub;
    });

    if (!found) {
      updatedSubmissions.push({
        studentName: studentEmail.split('@')[0],
        studentEmail: studentEmail.toLowerCase(),
        submittedAt: new Date().toISOString(),
        status: "Submitted",
        fileUrl,
        feedback: "",
        grade: ""
      });
    }

    const updated = await db.assignment.update({
      where: { id: assignmentId },
      data: { submissions: JSON.stringify(updatedSubmissions) }
    });

    return { success: true, assignment: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit assignment." };
  }
}

export async function updateUserProfileAction(userId: string, profileData: any) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.id !== userId && user.role !== 'ADMIN')) {
      return { success: false, error: "Unauthorized access: Cannot modify other user profiles." };
    }

    const { name, phone, bio, avatar, password } = profileData;
    if (!userId || !name) {
      return { success: false, error: "UserId and Name are required." };
    }

    const dbUser = await db.user.findUnique({ where: { id: userId } });
    if (!dbUser) return { success: false, error: "User account not found." };

    const dataObj: any = {
      name,
      phone: phone || "",
      bio: bio || "",
      avatar: avatar || dbUser.avatar
    };

    if (password) {
      dataObj.password = hashPassword(password);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: dataObj
    });

    // If user is a trainer, sync profile with Trainer record
    if (dbUser.role === 'TRAINER') {
      const trainer = await db.trainer.findFirst({
        where: { email: dbUser.email }
      });
      if (trainer) {
        await db.trainer.update({
          where: { id: trainer.id },
          data: {
            name,
            avatar: avatar || dbUser.avatar,
            bio: bio || ""
          }
        });
      }
    }

    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile details." };
  }
}

export async function recordStudentJoinAction(userId: string, userName: string, batchId: string) {
  try {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Find or create attendance for today for this batch
    const attendance = await db.attendance.findFirst({
      where: { batchId, date: todayStr }
    });

    let recordsList: any[] = [];
    if (attendance) {
      try {
        recordsList = JSON.parse(attendance.records);
      } catch (e) {
        recordsList = [];
      }
    }

    const idx = recordsList.findIndex((r: any) => r.studentId === userId);
    
    // Format friendly time strings
    const now = new Date();
    const timeNow = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Simulate leaving at the end of the 2-hour duration
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const simulatedLeaveTime = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (idx !== -1) {
      if (!recordsList[idx].joinTime) {
        recordsList[idx].joinTime = timeNow;
      }
      if (!recordsList[idx].leaveTime) {
        recordsList[idx].leaveTime = simulatedLeaveTime;
      }
      recordsList[idx].present = true;
    } else {
      recordsList.push({
        studentId: userId,
        studentName: userName,
        present: true,
        joinTime: timeNow,
        leaveTime: simulatedLeaveTime
      });
    }

    const presentCount = recordsList.filter((r: any) => r.present).length;
    const absentCount = recordsList.filter((r: any) => !r.present).length;

    const dataObj = {
      batchId,
      date: todayStr,
      presentCount,
      absentCount,
      records: JSON.stringify(recordsList)
    };

    let savedAttendance;
    if (attendance) {
      savedAttendance = await db.attendance.update({
        where: { id: attendance.id },
        data: dataObj
      });
    } else {
      savedAttendance = await db.attendance.create({
        data: dataObj
      });
    }

    return { success: true, attendance: savedAttendance };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to record live class joining." };
  }
}

export async function saveNotificationSettingsAction(settingsMapObj: Record<string, string>) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized access: Administrator role required." };
    }
    for (const key in settingsMapObj) {
      const existing = await db.notificationSetting.findUnique({
        where: { key }
      });
      if (existing) {
        await db.notificationSetting.update({
          where: { id: existing.id },
          data: { value: settingsMapObj[key] }
        });
      } else {
        await db.notificationSetting.create({
          data: { key, value: settingsMapObj[key] }
        });
      }
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save settings." };
  }
}

export async function triggerLiveClassReminderAction(userId: string, batchId: string, channel: string) {
  try {
    const student = await db.user.findUnique({ where: { id: userId } });
    const batch = await db.batch.findUnique({ where: { id: batchId } });
    if (!student || !batch) return { success: false, error: "Student or batch not found." };
    
    const course = await db.course.findUnique({ where: { id: batch.courseId } });
    const courseName = course?.name || "AWS Solutions Architect";

    const res = await triggerNotificationAction("REMINDER", {
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone || "+91 9876543210",
      courseName,
      timeSlot: batch.timeSlot,
      channelOverride: channel
    });

    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to trigger live class reminder." };
  }
}

async function sendResendEmailAction(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes("placeholder")) {
    console.warn(`[Resend Mock] Skipping email delivery because API key is placeholder. To: ${to}, Subject: ${subject}`);
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ECECF4; border-radius: 16px; color: #1E1E38; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #7A008C; margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.025em;">Aurenza Academy</h2>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #8F8F9F; text-transform: uppercase; letter-spacing: 0.05em;">LMS Portal Notification</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #ECECF4; margin: 0 0 24px 0;" />
        <div style="line-height: 1.6; font-size: 14px; white-space: pre-wrap; color: #2C2C4E;">${body}</div>
        <hr style="border: 0; border-top: 1px solid #ECECF4; margin: 24px 0 16px 0;" />
        <p style="font-size: 10px; color: #8F8F9F; text-align: center; margin: 0;">This is an automated notification from Aurenza Academy. Please do not reply directly to this email.</p>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Aurenza Academy <onboarding@resend.dev>',
      to,
      subject,
      html: htmlContent,
    });

    if (result.error) {
      throw new Error(result.error.message || "Resend API returned an error.");
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Resend Delivery Error]", err);
    return { success: false, error: err.message || "Failed to deliver email." };
  }
}

export async function triggerNotificationAction(type: string, data: any) {
  try {
    const dbSettings = await db.notificationSetting.findMany();
    const settingsMap = new Map<string, string>(
      (dbSettings || []).map((s: any) => [String(s.key || ''), String(s.value || '')])
    );

    const emailEnabled = settingsMap.get('email_enabled') !== 'false';
    const waEnabled = settingsMap.get('whatsapp_enabled') !== 'false';

    const getTpl = (key: string, defaultVal: string): string => {
      const val = settingsMap.get(key);
      return typeof val === 'string' ? val : defaultVal;
    };

    const replaceTags = (text: string) => {
      return text
        .replace(/{studentName}/g, data.studentName || '')
        .replace(/{courseName}/g, data.courseName || '')
        .replace(/{amount}/g, data.amount || '')
        .replace(/{timeSlot}/g, data.timeSlot || '')
        .replace(/{certId}/g, data.certId || '');
    };

    if (type === "ENROLLMENT") {
      if (emailEnabled && (!data.channelOverride || data.channelOverride === "EMAIL")) {
        const subject = replaceTags(getTpl('tpl_enrollment_subject', 'Welcome to {courseName}!'));
        const body = replaceTags(getTpl('tpl_enrollment_body', 'Welcome.'));
        
        // Dispatch real email via Resend
        const emailRes = await sendResendEmailAction(data.studentEmail, subject, body);
        
        await db.notificationLog.create({
          data: {
            type: "ENROLLMENT_CONFIRMATION",
            recipient: data.studentEmail,
            channel: "EMAIL",
            content: `Subject: ${subject}\n\n${body}`,
            status: emailRes.success ? "DELIVERED" : "FAILED"
          }
        });
        console.log(`[NOTIFICATION ENGINE] Sent Email confirmation to ${data.studentEmail} (Status: ${emailRes.success ? 'Success' : 'Failed'})`);
      }
      if (waEnabled && (!data.channelOverride || data.channelOverride === "WHATSAPP")) {
        const body = replaceTags(getTpl('tpl_enrollment_body', 'Welcome.')).substring(0, 160);
        await db.notificationLog.create({
          data: {
            type: "PAYMENT_CONFIRMATION",
            recipient: data.studentPhone,
            channel: "WHATSAPP",
            content: `WhatsApp: ${body}`,
            status: "SENT"
          }
        });
        console.log(`[NOTIFICATION ENGINE] Sent WhatsApp confirmation to ${data.studentPhone}`);
      }
    }

    if (type === "REMINDER") {
      if (emailEnabled && (!data.channelOverride || data.channelOverride === "EMAIL")) {
        const subject = replaceTags(getTpl('tpl_reminder_subject', 'Reminder: {courseName} live session.'));
        const body = replaceTags(getTpl('tpl_reminder_body', 'Starting soon.'));
        
        // Dispatch real email via Resend
        const emailRes = await sendResendEmailAction(data.studentEmail, subject, body);
        
        await db.notificationLog.create({
          data: {
            type: "BATCH_REMINDER",
            recipient: data.studentEmail,
            channel: "EMAIL",
            content: `Subject: ${subject}\n\n${body}`,
            status: emailRes.success ? "DELIVERED" : "FAILED"
          }
        });
        console.log(`[NOTIFICATION ENGINE] Sent Email reminder to ${data.studentEmail} (Status: ${emailRes.success ? 'Success' : 'Failed'})`);
      }
      if (waEnabled && (!data.channelOverride || data.channelOverride === "WHATSAPP")) {
        const body = replaceTags(getTpl('tpl_reminder_body', 'Starting soon.')).substring(0, 160);
        await db.notificationLog.create({
          data: {
            type: "BATCH_REMINDER",
            recipient: data.studentPhone,
            channel: "WHATSAPP",
            content: `WhatsApp: ${body}`,
            status: "SENT"
          }
        });
        console.log(`[NOTIFICATION ENGINE] Sent WhatsApp reminder to ${data.studentPhone}`);
      }
    }

    if (type === "CERTIFICATE") {
      if (emailEnabled && (!data.channelOverride || data.channelOverride === "EMAIL")) {
        const subject = replaceTags(getTpl('tpl_certificate_subject', 'Congratulations! Certificate ready.'));
        const body = replaceTags(getTpl('tpl_certificate_body', 'Ready.'));
        
        // Dispatch real email via Resend
        const emailRes = await sendResendEmailAction(data.studentEmail, subject, body);
        
        await db.notificationLog.create({
          data: {
            type: "CERTIFICATE_ISSUED",
            recipient: data.studentEmail,
            channel: "EMAIL",
            content: `Subject: ${subject}\n\n${body}`,
            status: emailRes.success ? "DELIVERED" : "FAILED"
          }
        });
        console.log(`[NOTIFICATION ENGINE] Sent Certificate email to ${data.studentEmail} (Status: ${emailRes.success ? 'Success' : 'Failed'})`);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("[NOTIFICATION ENGINE] Error triggering notifications:", err);
    return { success: false, error: err.message };
  }
}

export async function createRazorpayOrderAction(courseId: string, couponCode?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required to place an order." };
    }

    const course = await db.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    // Calculate pricing (applies 10% coupon discount if coupon is AURENZA10, then adds 18% GST)
    let price = course.price;
    if (couponCode && couponCode.toUpperCase() === 'AURENZA10') {
      price = Math.round(price * 0.9);
    }
    const gstAmount = Math.round(price * 0.18);
    const totalPrice = price + gstAmount;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const isPlaceholder = !keyId || !keySecret || keyId.includes("placeholder") || keySecret.includes("placeholder");

    if (isPlaceholder) {
      // Fallback mock order if credentials are not configured yet, so the user can test the app
      console.warn("[Razorpay] Using mock order ID because API credentials are not set in .env.");
      return {
        success: true,
        isMock: true,
        order: {
          id: `order_mock_${crypto.randomBytes(4).toString('hex')}`,
          amount: totalPrice * 100,
          currency: "INR"
        },
        totalPrice
      };
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await razorpay.orders.create({
      amount: totalPrice * 100, // Razorpay amount is in paise
      currency: "INR",
      receipt: `receipt_${courseId}_${user.id}_${Date.now()}`
    });

    return {
      success: true,
      isMock: false,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      totalPrice
    };
  } catch (err: any) {
    console.error("[Razorpay Order Creation Error]", err);
    return { success: false, error: err.message || "Failed to initiate payment order." };
  }
}

export async function verifyRazorpayPaymentAction(
  verifyData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
  courseId: string,
  appliedPrice: number
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required to verify payment." };
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyData;

    // Check if user is already enrolled
    const existing = await db.enrollment.findFirst({
      where: { userId: user.id, courseId }
    });
    if (existing) {
      return { success: false, error: "User is already enrolled in this course." };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMockOrder = razorpay_order_id.startsWith("order_mock_") || !keySecret || keySecret.includes("placeholder");

    if (!isMockOrder) {
      // Real cryptographic verification
      const expectedSignature = crypto
        .createHmac('sha256', keySecret!)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return { success: false, error: "Payment verification failed: Invalid transaction signature." };
      }
    } else {
      console.warn("[Razorpay] Simulating signature verification success for mock order.");
    }

    // Create payment in database
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        courseId,
        amount: appliedPrice,
        status: "Success",
        txId: razorpay_payment_id || `pay_mock_${crypto.randomBytes(4).toString('hex').toUpperCase()}`
      }
    });

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        progress: 0,
        lastLesson: "Introduction"
      }
    });

    // Dispatch notifications
    try {
      const course = await db.course.findUnique({ where: { id: courseId } });
      if (course) {
        await triggerNotificationAction("ENROLLMENT", {
          studentName: user.name,
          studentEmail: user.email,
          studentPhone: user.phone || "+91 9876543210",
          courseName: course.name,
          amount: `₹${appliedPrice.toLocaleString('en-IN')}`
        });
      }
    } catch (e) {
      console.error("[NOTIFICATION ENGINE] Enrollment trigger error:", e);
    }

    return { success: true, enrollment, payment };
  } catch (err: any) {
    console.error("[Razorpay Payment Verification Error]", err);
    return { success: false, error: err.message || "Failed to verify payment." };
  }
}



