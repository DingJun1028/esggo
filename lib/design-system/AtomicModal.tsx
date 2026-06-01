import React, { useEffect, useId } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { X } from 'lucide-react';
import { cn } from '../utils';

export interface AtomicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const AtomicModal: React.FC<AtomicModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = 'md',
}) => {
  const titleId = useId();

  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_MOD_001',
      type: 'atom',
      version: '1.1.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Overlays Spec v1.1',
        intent: 'Intervention Dialog',
        governanceNode: 'UI_INTERACTION_CORE'
      }
    };
    atomicManager?.registerAtom?.(atom);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }[size];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop (深邃毛玻璃) */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md transition-opacity duration-500 animate-in fade-in" 
        aria-hidden="true"
      />

      {/* Glass Container (液態玻璃主體) */}
      <div className={cn(
        'relative w-full rounded-2xl border border-white/10 bg-[#020617]/70 text-slate-200',
        'backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col',
        'transition-all duration-300 animate-in zoom-in-95 fade-in',
        sizeClasses
      )}>
        
        {/* 頂部極光裝飾 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-70 shadow-[0_0_15px_rgba(6,182,212,1)]" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
          <h3 id={titleId} className="text-sm font-black uppercase tracking-widest text-[#06b6d4] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" aria-hidden="true" />
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 hover:rotate-90 duration-300"
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="relative px-6 py-6 overflow-y-auto max-h-[70vh] text-[13px] font-medium text-slate-300 leading-relaxed custom-scrollbar bg-gradient-to-b from-white/5 to-transparent">
          {children}
        </div>

        {/* Footer */}
        {footerActions && (
          <div className="relative flex items-center justify-end gap-3 px-6 py-5 border-t border-white/10 bg-[#020617]/80 backdrop-blur-xl">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};
