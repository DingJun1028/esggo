'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const modalSizes: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', className }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-5"
      onClick={onClose}
    >
      <div
        className={cn('bg-white rounded-[20px] w-full shadow-2xl flex flex-col max-h-[90vh]', modalSizes[size], className)}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#f3f4f6] flex-shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-[#1a1a2e]">{title}</h2>
            {subtitle && <p className="text-[12px] text-[#6b7280] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors"
          >
            <X size={14} color="#374151" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-7 py-5 border-t border-[#f3f4f6] flex gap-3 justify-end flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}