"use client";

import React from 'react';

interface ReserveSeatButtonProps {
  courseName: string;
  startDate: string;
  timeSlot: string;
}

export default function ReserveSeatButton({ courseName, startDate, timeSlot }: ReserveSeatButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-lead-modal', {
        detail: {
          source: `Batch Schedule: ${startDate}`,
          prefilledCourse: courseName,
          message: `Hi, I am interested in reserving a seat for the batch starting ${startDate} (${timeSlot}) for the ${courseName} course. Please contact me with details.`
        }
      }));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-[10px] text-white tracking-wider uppercase transition shadow-soft font-black"
    >
      Reserve Seat &rarr;
    </button>
  );
}
