// components/ui/v2/Modal.tsx
'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  icon,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-sm border border-neutral-200 max-h-[90vh] flex flex-col',
          sizeStyles[size]
        )}
      >
        <div className="flex items-start justify-between p-5 border-b border-neutral-100">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-semibold text-neutral-900 text-base">{title}</h2>
              {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
        {footer && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// BrandModal compatibility - default export
export default function BrandModalCompat(props: ModalProps) {
  return <Modal {...props} />;
}
