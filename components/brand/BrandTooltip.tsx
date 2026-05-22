'use client';
import React, { useState } from 'react';

interface BrandTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function BrandTooltip({ content, children, position = 'top' }: BrandTooltipProps) {
  const [visible, setVisible] = useState(false);

  const posStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-50 ${posStyles[position]} px-2.5 py-1.5 bg-[#0F172A] text-white text-xs rounded-lg whitespace-nowrap shadow-lg`}>
          {content}
        </div>
      )}
    </div>
  );
}