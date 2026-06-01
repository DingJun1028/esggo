import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';

export interface AtomicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
}

export const AtomicButton: React.FC<AtomicButtonProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_BTN_001',
      type: 'atom',
      version: '1.0.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Interaction Spec v2.0',
        intent: 'Action Trigger',
        governanceNode: 'UI_ACTION_CORE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantClasses = {
    default: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    primary: 'bg-[#06b6d4] text-[#020617] hover:bg-[#06b6d4]/90 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10',
    outline: 'border border-white/10 bg-transparent text-slate-300 hover:text-white hover:bg-white/10',
  }[variant];

  // 如果 className 中有自訂的 padding/size (如 !p-0, !w-10)，則不套用預設的 padding
  const hasCustomSize = className.includes('!p-') || className.includes('!w-');
  const defaultPadding = hasCustomSize ? '' : 'px-4 py-2 text-sm';

  return (
    <button className={`${baseClasses} ${variantClasses} ${defaultPadding} ${className}`} {...props}>
      {children}
    </button>
  );
};