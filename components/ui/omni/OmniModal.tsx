import { OmniComponentHeart } from '@esggo/types';
import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useOmniResonance } from './useOmniResonance';

export interface OmniModalProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function OmniModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  omniHeart: initialHeart,
}: OmniModalProps) {
  const omniHeart = useOmniResonance(initialHeart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-stark/80 transition-opacity" onClick={onClose} />

      <div
        className={cn(
          'relative w-full max-w-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl shadow-sm p-6',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between mb-6 border-b border-[var(--theme-border)] pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover: transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10">{children}</div>

        {/* Glow effect behind modal */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl -z-10 opacity-50" />
      </div>
    </div>,
    document.body
  );
}
