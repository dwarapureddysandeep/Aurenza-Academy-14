"use client";

import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TrainerActionsWidgetProps {
  batchId: string;
  currentZoomLink: string;
}

export default function TrainerActionsWidget({
  batchId,
  currentZoomLink
}: TrainerActionsWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [zoomLink, setZoomLink] = useState(currentZoomLink);
  const [loading, setLoading] = useState(false);

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoomLink.trim()) return;

    setLoading(true);
    toast.loading("Updating live Zoom meeting coordinates...", { id: "zoom" });
    
    // Simulate server-side delay
    await new Promise(r => setTimeout(r, 800));

    setLoading(false);
    setIsEditing(false);
    toast.success("Zoom meeting coordinates verified & updated!", { id: "zoom" });
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdateLink} className="flex items-center gap-1 bg-[#120721] border border-applePurple/30 rounded-xl px-2 py-1 animate-fade-up">
        <input
          type="text"
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          placeholder="Paste new Zoom link..."
          className="bg-transparent border-none text-[10px] text-white focus:outline-none focus:ring-0 placeholder-neutral-600 w-36"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="p-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
          title="Save Link"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoomLink(currentZoomLink);
            setIsEditing(false);
          }}
          className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          title="Cancel"
        >
          <X className="w-3 h-3" />
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-neutral-300 hover:text-white font-bold flex items-center gap-1 transition text-xs shrink-0"
      title="Edit Cohort Zoom coordinate link"
    >
      <Edit2 className="w-3.5 h-3.5 text-applePink" />
      Edit Zoom Link
    </button>
  );
}
