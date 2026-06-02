import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { cn } from '../utils';

export interface AtomicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassIntensity?: 'low' | 'medium' | 'high';
  hoverEffect?: 'none' | 'glow' | 'lift';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const AtomicCard = React.forwardRef<HTMLDivElement, AtomicCardProps>(({
  glassIntensity = 'medium',
  hoverEffect = 'none',
  padding = 'md',
  className,
  children,
  ...props
}, ref) => {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_CRD_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' },
      reference: {
        specification: 'Layout Core Spec v1.0.1',
        intent: 'Bento Grid Container',
        governanceNode: 'UI_LAYOUT_ENGINE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const glassClasses = {
    low: 'bg-[#020617]/40 backdrop-blur-md border border-white/5',
    medium: 'bg-[#020617]/60 backdrop-blur-lg border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]',
    high: 'bg-[#020617]/80 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
  }[glassIntensity];

  const hoverClasses = {
    none: '',
    glow: 'hover:border-[#06b6d4]/30 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 group',
    lift: 'hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(6,182,212,0.25)] hover:border-[#06b6d4]/40 transition-all duration-500 ease-out group',
  }[hoverEffect];

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div 
      ref={ref}
      className={cn("rounded-xl relative overflow-hidden", glassClasses, hoverClasses, paddingClasses, className)} 
      {...props}
    >
      {children}
    </div>
  );
});
AtomicCard.displayName = 'AtomicCard';