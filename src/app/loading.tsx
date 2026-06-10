import React from 'react';
import LoadingSpinner from '@/components/loading-spinner';

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-4 bg-sectionBg/50">
      <LoadingSpinner size="xl" />
      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest animate-pulse">
        Securing session data...
      </p>
    </div>
  );
}
