'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

/**
 * Brand Identity: Atomic Light Label Edition
 * v1.0 | Implementation of the "ESG SUNSHINE" Logo with 3D Light effects.
 */
export const BrandLogo = ({ className, size = 'md', withText = true }: BrandLogoProps) => {
  const sizeMap = {
    sm: { box: 'w-10 h-10', icon: 24, text: 'text-lg' },
    md: { box: 'w-16 h-16', icon: 40, text: 'text-2xl' },
    lg: { box: 'w-24 h-24', icon: 64, text: 'text-4xl' },
    xl: { box: 'w-32 h-32', icon: 80, text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className={cn("relative flex items-center justify-center", currentSize.box)}>
        {/* SVG Icon Implementation based on image_17.png structure */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,255,255,0.15)]"
        >
          <defs>
            {/* Aqua Cyan Spectrum (Outer Flame / Center Dot) */}
            <linearGradient id="aquaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#008BA3" /> {/* Shadow */}
              <stop offset="100%" stopColor="#00FFFF" /> {/* Highlight */}
            </linearGradient>
            
            {/* Eternal Gold Spectrum (Inner Flame) */}
            <linearGradient id="goldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A000" /> {/* Shadow */}
              <stop offset="100%" stopColor="#FFD700" /> {/* Highlight */}
            </linearGradient>
          </defs>

          {/* Outer Flame Structure (Simplified Flame Shape) */}
          <motion.path
            d="M50 5C30 20 20 45 20 65C20 85 35 95 50 95C65 95 80 85 80 65C80 45 70 20 50 5Z"
            fill="url(#aquaGradient)"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Inner Flame Structure */}
          <motion.path
            d="M50 25C40 35 35 50 35 65C35 80 42 88 50 88C58 88 65 80 65 65C65 50 60 35 50 25Z"
            fill="url(#goldGradient)"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          />

          {/* Central Dot (Rational Core) */}
          <motion.circle
            cx="50" cy="65" r="6"
            fill="url(#aquaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={cn("font-black tracking-tighter text-aqua-cyan-midtone", currentSize.text)}>
              ESG
            </span>
            <span className={cn("font-black tracking-tight text-eternal-gold-midtone ml-1", currentSize.text)}>
              SUNSHINE
            </span>
          </div>
          <span className="text-[10px] font-black text-aqua-cyan-midtone uppercase tracking-[0.3em] leading-tight">
            善向永續
          </span>
        </div>
      )}
    </div>
  );
};
