"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProgressAction, generateCertificateAction } from '@/lib/actions';
import { Play, Award, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentActionsWidgetProps {
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  currentProgress: number;
  isCertIssued: boolean;
}

export default function StudentActionsWidget({
  userId,
  userName,
  courseId,
  courseName,
  currentProgress,
  isCertIssued
}: StudentActionsWidgetProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStudyStep = async () => {
    setLoading(true);
    const nextProgress = Math.min(currentProgress + 25, 100);
    const lastLesson = nextProgress === 100 
      ? "Syllabus Mastery Assessment (Complete)" 
      : `Module 3: Lesson Topic #${Math.floor(nextProgress / 10)}`;

    toast.loading("Recording study progression logs...", { id: "progress" });
    const res = await updateProgressAction(userId, courseId, nextProgress, lastLesson);
    setLoading(false);

    if (res.success) {
      toast.success(`Study logs verified! Progress: ${nextProgress}%`, { id: "progress" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to log progress.", { id: "progress" });
    }
  };

  const handleFastTrack = async () => {
    setLoading(true);
    toast.loading("Simulating final module exam completion...", { id: "progress" });
    const res = await updateProgressAction(userId, courseId, 100, "Syllabus Mastery Assessment (Complete)");
    setLoading(false);

    if (res.success) {
      toast.success("Final Exam Completed! 100% Progress.", { id: "progress" });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to log progress.", { id: "progress" });
    }
  };

  const handleClaimCertificate = async () => {
    setLoading(true);
    toast.loading("Verifying completion checks and issuing cryptographical certificate...", { id: "cert" });
    
    const res = await generateCertificateAction(userId, userName, courseId, courseName);
    setLoading(false);

    if (res.success) {
      toast.success(`Certificate Generated! ID: ${res.certificate?.certId}`, { id: "cert", duration: 5000 });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to issue certificate.", { id: "cert" });
    }
  };

  return (
    <div className="flex gap-2 shrink-0">
      
      {currentProgress < 100 ? (
        <>
          <button
            onClick={handleStudyStep}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white hover:text-applePink font-bold flex items-center gap-1 transition"
            title="Simulate 25% study progress"
          >
            <Play className="w-3 h-3 fill-current text-applePink" />
            Study
          </button>
          
          <button
            onClick={handleFastTrack}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-neutral-300 hover:text-white font-bold flex items-center gap-1 transition"
            title="Instantly complete 100%"
          >
            <Zap className="w-3 h-3 text-applePurple" />
            Exam
          </button>
        </>
      ) : !isCertIssued ? (
        <button
          onClick={handleClaimCertificate}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-applePurple to-applePink hover:shadow-neonPink text-white font-black flex items-center gap-1.5 transition animate-pulse"
        >
          <Award className="w-4 h-4 text-white" />
          Claim Certificate <Sparkles className="w-3 h-3 text-white" />
        </button>
      ) : (
        <div className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold flex items-center gap-1">
          ✓ Certified
        </div>
      )}

    </div>
  );
}
