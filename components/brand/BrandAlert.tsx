'use client';
import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface BrandAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

const alertConfig = {
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-800', text: 'text-green-700', icon: 'text-green-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-800', text: 'text-amber-700', icon: 'text-amber-500' },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', title: 'text-red-800', text: 'text-red-700', icon: 'text-red-500' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-800', text: 'text-blue-700', icon: 'text-blue-500' },
};

export default function BrandAlert({ variant = 'info', title, children, dismissible = false, className = '' }: BrandAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.bg} ${config.border} p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon size={16} className={`${config.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <p className={`text-sm font-semibold ${config.title} mb-1`}>{title}</p>}
          <div className={`text-sm ${config.text}`}>{children}</div>
        </div>
        {dismissible && (
          <button onClick={() => setDismissed(true)} className="flex-shrink-0">
            <X size={14} className={config.text} />
          </button>
        )}
      </div>
    </div>
  );
}