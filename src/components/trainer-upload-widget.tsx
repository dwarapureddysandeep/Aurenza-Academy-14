"use client";

import React, { useState } from 'react';
import { FileText, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

interface TrainerUploadWidgetProps {
  batches: any[];
}

export default function TrainerUploadWidget({ batches }: TrainerUploadWidgetProps) {
  const [resourceName, setResourceName] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(batches[0]?.courseId || '');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceName.trim()) {
      toast.error("Please specify a resource name.");
      return;
    }

    toast.success("Study materials uploaded and synced directly with student portals!");
    setResourceName('');
    setRecordingUrl('');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="bg-[#0E061A]/85 border border-white/[0.08] p-6 rounded-[28px] backdrop-blur-xl space-y-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-applePurple/10 px-3 py-0.5 text-[9px] font-bold text-applePink uppercase">
          <FileText className="w-3.5 h-3.5" /> PDF Materials Vault
        </span>

        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Resource Name</label>
            <input
              type="text"
              required
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              placeholder="e.g. Spring Boot Securing Microservices.pdf"
              className="glass-input text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Cohort Class</label>
            <select 
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="glass-input text-xs bg-[#0E061A] text-white"
            >
              {batches.map((b: any) => (
                <option key={b.id} value={b.courseId} className="bg-[#0E061A]">
                  {b.course?.name || "Specialization"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Lecture Recording URL</label>
            <input
              type="text"
              value={recordingUrl}
              onChange={(e) => setRecordingUrl(e.target.value)}
              placeholder="e.g. https://youtube.com/rec-vault-id"
              className="glass-input text-xs"
            />
          </div>

          <div className="border border-dashed border-white/[0.1] rounded-2xl p-6 text-center text-xs text-neutral-500 hover:border-applePink/40 transition">
            <p className="font-bold text-neutral-400">Drag & Drop Lecture Files</p>
            <p className="text-[9px] mt-1 text-neutral-600">Supports PDF, DOCX, ZIP files up to 25MB.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-applePurple to-applePink hover:shadow-neonPink text-xs font-black text-white transition text-center mt-2"
          >
            Upload & Notify Students →
          </button>
        </form>
      </div>

      {/* AI Assistant Callout */}
      <div className="bg-[#120721]/50 border border-applePurple/25 p-5 rounded-[24px] space-y-3 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-applePurple/15 px-2.5 py-0.5 text-[9px] font-bold text-applePink uppercase">
          <Bot className="w-3.5 h-3.5" /> Auri AI Helper
        </span>
        <h4 className="text-xs font-bold text-white leading-none">Automate quiz generations?</h4>
        <p className="text-[10px] text-neutral-400 leading-normal">
          Let Auri generate a set of custom, week-by-week homework assignments based on your active Spring Boot or React Next.js syllabus modules automatically.
        </p>
      </div>
    </div>
  );
}
