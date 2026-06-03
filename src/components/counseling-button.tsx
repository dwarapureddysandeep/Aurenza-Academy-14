"use client";

import React from 'react';

interface CounselingButtonProps {
  source: string;
  prefilledCourse?: string;
  className?: string;
  children: React.ReactNode;
}

export default function CounselingButton({
  source,
  prefilledCourse,
  className,
  children
}: CounselingButtonProps) {
  
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-lead-modal', {
        detail: {
          source,
          prefilledCourse
        }
      }));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
