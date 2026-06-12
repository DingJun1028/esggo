'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideText?: boolean;
}

/**
 * Brand Identity: Atomic Light Label Edition
 * v1.0 | Implementation of the "ESG SUNSHINE" Logo with 3D Light effects.
 */
export const BrandLogo = ({ className, size = 'md', hideText = false }: BrandLogoProps) => {
  const sizeMap = {
    sm: { box: 'h-16 w-auto', text: 'text-lg' },
    md: { box: 'h-24 w-auto', text: 'text-2xl' },
    lg: { box: 'h-32 w-auto', text: 'text-4xl' },
    xl: { box: 'h-48 w-auto', text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className={cn("relative flex items-center justify-center", currentSize.box, hideText && "mx-auto")}>
        <img 
          src="/logo.png" 
          alt="ESGGO Logo" 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      {!hideText && (
        <div className="flex flex-col">
          <span className={cn("font-black tracking-tight text-slate-900 dark:text-white drop-shadow-md", currentSize.text)}>
            ESGGO
          </span>
          <span className="text-sm font-black text-cyan-700 dark:text-cyan-300 tracking-widest uppercase drop-shadow-sm">
            善向永續
          </span>
        </div>
      )}
    </div>
  );
};
