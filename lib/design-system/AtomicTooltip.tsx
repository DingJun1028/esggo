import React, { useEffect, useState, useId } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { cn } from '../utils';
import { useColorDropStream } from '../hooks/useColorDropStream';

export interface AtomicTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  evidenceId?: string;
}

export const AtomicTooltip: React.FC<AtomicTooltipProps> = ({
  children,
  content,
  position = 'top',
  className,
  evidenceId
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();
  const { drops, loading } = useColorDropStream();
  const dropData = evidenceId ? drops.get(evidenceId) : undefined;
  const status = dropData?.status;
  
  let dropColor = "border-[#06b6d4]/30 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"; // Default
  if (status === 'issued') dropColor = "border-amber-500/50 shadow-[0_4px_20px_rgba(245,158,11,0.2)] text-amber-200";
  if (status === 'verified') dropColor = "border-emerald-500/50 shadow-[0_4px_20px_rgba(16,185,129,0.2)] text-emerald-200";
  if (status === 'absolute-zero') dropColor = "border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.2)] text-red-200";

  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_TIP_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Overlays Spec v1.1',
        intent: 'Contextual Information Help',
        governanceNode: 'UI_INTERACTION_CORE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  // Clone child to inject aria-describedby for accessibility
  const childWithAria = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, {
        'aria-describedby': isVisible ? tooltipId : undefined,
      })
    : children;

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {childWithAria}
      <div 
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isVisible}
        className={cn(
          'absolute z-[200] pointer-events-none transition-all duration-300',
          positionClasses,
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1',
          className
        )}
      >
        <div className={cn(
          "px-3 py-1.5 rounded-lg bg-[#020617]/90 backdrop-blur-xl border text-[11px] font-mono text-slate-200 whitespace-nowrap transition-colors duration-500", 
          evidenceId ? dropColor : "border-[#06b6d4]/30 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"
        )}>
          {content}
          {status === 'verified' && <span className="ml-2 font-bold text-current">✓</span>}
        </div>
      </div>
    </div>
  );
};
