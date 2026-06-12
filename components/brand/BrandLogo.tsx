'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Brand Identity: Atomic Light Label Edition
 * v1.0 | Implementation of the "ESG SUNSHINE" Logo with 3D Light effects.
 */
export const BrandLogo = ({ className, size = 'md' }: BrandLogoProps) => {
  const sizeMap = {
    sm: { box: 'h-16 w-auto', text: 'text-lg' },
    md: { box: 'h-24 w-auto', text: 'text-2xl' },
    lg: { box: 'h-32 w-auto', text: 'text-4xl' },
    xl: { box: 'h-48 w-auto', text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className={cn("relative flex items-center justify-center", currentSize.box)}>
        <img 
          src="/logo.png" 
          alt="ESGGO Logo" 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

    </div>
  );
};
