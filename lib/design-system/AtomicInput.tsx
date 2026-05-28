/**
 * ⚛️ AtomicInput - Universal Atomic Component
 * v1.1 | #ReferencePrinciple #T3Tangible
 */

import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';

interface AtomicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AtomicInput: React.FC<AtomicInputProps> = ({ 
  label, 
  error,
  className,
  ...props 
}) => {
  useEffect(() => {
    // 參照原則：組件自動註冊至原子管理庫
    const atom: IAtomicComponent = {
      atomId: 'ATOM_INP_001',
      type: 'atom',
      version: '1.0.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'InfoOne Atomic Spec v8.5',
        intent: 'Data Capture Atom',
        governanceNode: 'UI_INPUT_SECURITY'
      }
    };
    atomicManager.registerAtom(atom);
  }, []);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-[var(--at-text-sub)] tracking-wide uppercase">
          {label}
        </label>
      )}
      <input 
        className={`
          bg-[var(--at-bg-card)] 
          border border-[var(--at-border)] 
          text-[var(--at-text-main)] 
          rounded-md px-3 py-2 text-sm 
          focus:ring-2 focus:ring-[var(--at-accent)] focus:border-transparent 
          transition-all placeholder:text-[var(--at-text-sub)]
          ${error ? 'border-red-500' : ''}
          ${className || ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
