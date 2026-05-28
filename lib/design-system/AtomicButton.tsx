/**
 * ⚛️ AtomicButton - Universal Atomic Component
 * v1.1 | #ReferencePrinciple #T3Tangible
 */

import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { omniCore } from '../omni-core';

interface AtomicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 's' | 'm' | 'l';
}

/**
 * 參照原則實作：組件在掛載時向原子庫註冊。
 */
export const AtomicButton: React.FC<AtomicButtonProps> = ({ 
  variant = 'primary', 
  size = 'm',
  children,
  className,
  ...props 
}) => {
  useEffect(() => {
    // 參照原則：組件自我宣告與誠信鏈接
    const atom: IAtomicComponent = {
      atomId: 'ATOM_BTN_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' } as any, // 簡化展示
      reference: {
        specification: 'InfoOne Atomic Spec v8.5',
        intent: 'Primary Action Trigger',
        governanceNode: 'UI_INTERACTION_CORE'
      }
    };
    atomicManager.registerAtom(atom);
  }, []);

  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[var(--at-accent)] text-[var(--at-bg-card)] hover:opacity-90 shadow-[var(--at-shadow)]",
    secondary: "bg-transparent border border-[var(--at-border)] text-[var(--at-text-main)] hover:bg-[var(--at-bg-primary)]",
    ghost: "bg-transparent text-[var(--at-text-sub)] hover:text-[var(--at-text-main)] hover:bg-[var(--at-bg-primary)]"
  };

  const sizes = {
    s: "px-3 py-1.5 text-xs",
    m: "px-4 py-2 text-sm",
    l: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
