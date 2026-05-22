'use client';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useState } from 'react';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

const alertConfig: Record<AlertVariant, { icon: React.ReactNode; bg: string; border: string; titleColor: string }> = {
  success: { icon: <CheckCircle size={16} />, bg: '#f0fdf4', border: '#86efac', titleColor: '#16a34a' },
  warning: { icon: <AlertTriangle size={16} />, bg: '#fffbeb', border: '#fde68a', titleColor: '#d97706' },
  error:   { icon: <XCircle size={16} />, bg: '#fef2f2', border: '#fca5a5', titleColor: '#dc2626' },
  info:    { icon: <Info size={16} />, bg: '#eff6ff', border: '#bfdbfe', titleColor: '#2563eb' },
};

export function Alert({ variant = 'info', title, children, dismissible = false, className }: AlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const cfg = alertConfig[variant];
  return (
    <div
      className={cn('flex gap-3 items-start p-4 rounded-[12px] border', className)}
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <span style={{ color: cfg.titleColor, flexShrink: 0, marginTop: '1px' }}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <div className="text-[13px] font-bold mb-0.5" style={{ color: cfg.titleColor }}>{title}</div>}
        <div className="text-[13px] text-[#374151]">{children}</div>
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="flex-shrink-0 hover:opacity-60 transition-opacity">
          <X size={14} color="#9ca3af" />
        </button>
      )}
    </div>
  );
}