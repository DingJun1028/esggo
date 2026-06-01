import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';

export interface AtomicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassIntensity?: 'low' | 'medium' | 'high';
  hoverEffect?: 'none' | 'glow' | 'lift';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const AtomicCard: React.FC<AtomicCardProps> = ({
  glassIntensity = 'medium',
  hoverEffect = 'none',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_CRD_001',
      type: 'atom',
      version: '1.0.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Layout Core Spec v1.0',
        intent: 'Bento Grid Container',
        governanceNode: 'UI_LAYOUT_ENGINE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const glassClasses = {
    low: 'bg-white/5 backdrop-blur-sm border border-white/5',
    medium: 'bg-white/5 backdrop-blur-[12px] border border-white/10',
    high: 'bg-white/10 backdrop-blur-[16px] border border-white/20',
  }[glassIntensity];

  const hoverClasses = {
    none: '',
    glow: 'hover:border-white/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300',
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
  }[hoverEffect];

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div className={`rounded-xl relative overflow-hidden ${glassClasses} ${hoverClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};