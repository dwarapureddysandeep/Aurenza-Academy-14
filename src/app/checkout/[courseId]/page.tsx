import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/actions';
import CheckoutWidget from '@/components/checkout-widget';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export const metadata = {
  title: "Secure Course Enrollment Checkout - Aurenza Academy",
  description: "Complete your professional IT & AI certification enrollments safely with Aurenza Academy's checkout portal."
};

export default async function CheckoutPage({ params }: PageProps) {
  const { courseId } = await params;

  // 1. Fetch course details by ID
  const course = await db.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    notFound();
  }

  // 2. Fetch authenticated session
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-sectionBg text-textPrimary py-16 px-4 sm:px-6 lg:px-8 font-sans relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Checkout Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest leading-none">
            Secure Payment Gateway
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary heading">
            Complete Your <span className="text-gradient-purple-pink">Program Registration</span>
          </h2>
          <p className="text-xs text-textSecondary leading-relaxed">
            Verify billing details, log in to your account, and complete transaction checkouts to activate your live classroom Zoom link.
          </p>
        </div>

        {/* Dynamic Interactive checkout panels */}
        <CheckoutWidget course={course} initialUser={user} />

      </div>
    </div>
  );
}
