'use client';


import { OmniComponentHeart } from '@esggo/types';
import React from 'react';

import { cn } from '@/lib/utils';

export interface OmniPremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  children: React.ReactNode;
  interactive?: boolean;
  active?: boolean;
}

export function OmniPremiumCard({
  children,
  className,
  interactive = true,
  active = false,
  ...props
}: OmniPremiumCardProps) {
  return (
    <div
      className={cn(
        'relative bg-white rounded-xl p-6 transition-all duration-300',
        'border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]',
        interactive && 'cursor-pointer hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.08)] hover:border-slate-200',
        active && 'ring-2 ring-[#003262] ring-offset-2 border-transparent',
        className
      )}
      {...props}
    >
      {/* Subtle top highlight to give a premium 3D feel without dark mode glassy effects */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
