import React, { useEffect } from 'react';
import { IAtomicComponent, atomicManager } from './atomic-core';
import { X } from 'lucide-react';
import { AtomicButton } from './AtomicButton';

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
  useEffect(() => {
    const atom: IAtomicComponent = {
      atomId: 'ATOM_MOD_001',
      type: 'atom',
      version: '1.0.0',
      core: { status: 'Trustworthy' } as any,
      reference: {
        specification: 'Overlays Spec v1.0',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-opacity duration-300" 
      />

      {/* Glass Container */}
      <div className={`relative w-full ${sizeClasses} rounded-2xl border border-white/10 bg-slate-900/90 text-slate-200 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#06b6d4]">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[70vh] text-xs font-medium text-slate-300 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footerActions && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-black/20">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};
