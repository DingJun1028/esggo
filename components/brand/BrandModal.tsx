'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import BrandButton from './BrandButton';

interface BrandModalProps {
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

export default function BrandModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  icon,
}: BrandModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full ${sizeStyles[size]} bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col`}>
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-[#EBF2FA] flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-semibold text-[#0F172A] text-base">{title}</h2>
              {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
        {footer && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}