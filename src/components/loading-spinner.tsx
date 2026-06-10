import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions} ${className}`} aria-label="Loading...">
      {/* Outer Pink Arc */}
      <svg
        className="animate-spin absolute inset-0 w-full h-full text-accent"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDuration: '1.2s' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="95 120"
        />
      </svg>
      
      {/* Inner Purple Arc */}
      <svg
        className="animate-spin absolute w-[70%] h-[70%] text-primary"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="60 120"
        />
      </svg>
    </div>
  );
}
