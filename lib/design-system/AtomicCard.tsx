/**
 * ⚛️ AtomicCard - Universal Bento Container
 * v1.0 | #BentoGrid #LiquidGlass #T3Tangible
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface AtomicCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children?: React.ReactNode;
  hoverEffect?: 'lift' | 'glow' | 'none';
  glassIntensity?: 'light' | 'medium' | 'heavy';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const AtomicCard = React.forwardRef<HTMLDivElement, AtomicCardProps>(({ 
  children, 
  className = '', 
  hoverEffect = 'lift',
  glassIntensity = 'medium',
  padding = 'lg',
  ...props 
}, ref) => {
  
  const baseStyles = "relative overflow-hidden border border-[var(--at-border)] shadow-[var(--at-shadow)] rounded-[2rem]";
  
  const glassStyles = {
    light: "bg-[var(--at-bg-glass)] backdrop-blur-sm",
    medium: "bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)]",
    heavy: "bg-[var(--at-bg-card)]/90 backdrop-blur-2xl"
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8 md:p-10"
  };

  const hoverVariants = {
    lift: { y: -4, transition: { duration: 0.3, ease: "easeOut" } },
    glow: { 
      y: -2, 
      boxShadow: "0 10px 40px var(--at-accent-glow)", 
      borderColor: "var(--at-accent)",
      transition: { duration: 0.3 } 
    },
    none: {}
  };

  return (
    <motion.div
      ref={ref as any}
      whileHover={hoverEffect}
      variants={{
        lift: hoverVariants.lift,
        glow: hoverVariants.glow,
        none: hoverVariants.none
      }}
      className={`${baseStyles} ${glassStyles[glassIntensity]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {/* Subtle top inner glow for glass realism */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
});

AtomicCard.displayName = 'AtomicCard';
