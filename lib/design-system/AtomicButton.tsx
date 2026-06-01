import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { cn } from '../utils';

export interface AtomicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
}

export const AtomicButton = React.forwardRef<HTMLButtonElement, AtomicButtonProps>(({
  variant = 'default',
  className,
  type = 'button',
  children,
  ...props
}, ref) => {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_BTN_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Interaction Spec v2.0.1',
        intent: 'Action Trigger',
        governanceNode: 'UI_ACTION_CORE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const baseClasses = 'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4]/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] overflow-hidden group backdrop-blur-md';

  const variantClasses = {
    default: 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 shadow-lg hover:shadow-xl',
    primary: 'bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-[#020617] border border-[#06b6d4]/50 hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] font-bold',
    ghost: 'bg-transparent text-slate-300 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10',
    outline: 'border border-[#06b6d4]/30 bg-[#06b6d4]/5 text-[#06b6d4] hover:bg-[#06b6d4]/20 hover:border-[#06b6d4]/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
  }[variant];

  // 如果 className 中有自訂的 padding/size (如 !p-0, !w-10)，則不套用預設的 padding
  const hasCustomSize = className?.includes('!p-') || className?.includes('!w-');
  const defaultPadding = hasCustomSize ? '' : 'px-5 py-2.5 text-sm';

  return (
    <button 
      ref={ref}
      type={type}
      className={cn(baseClasses, variantClasses, defaultPadding, className)} 
      {...props}
    >
      {/* 玻璃反光特效 (Glass reflection effect) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
});
AtomicButton.displayName = 'AtomicButton';