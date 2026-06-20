// components/ui/v2/StatusDot.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'inactive' | 'warning' | 'error' | 'pending' | 'verified';

interface StatusDotProps {
  status?: StatusType;
  label?: string;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  colorClassName?: string;
  sizeClassName?: string;
  borderClassName?: string;
  shadowClassName?: string;
  labelClassName?: string;
  dotOnly?: boolean;
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  active: { color: 'bg-emerald-500', label: '運行中' },
  inactive: { color: 'bg-slate-400', label: '離線' },
  warning: { color: 'bg-amber-500', label: '警告' },
  error: { color: 'bg-red-500', label: '錯誤' },
  pending: { color: 'bg-blue-400', label: '等待中' },
  verified: { color: 'bg-neutral-700', label: '已驗證' },
};

export function StatusDot({
  status,
  label,
  pulse = false,
  size = 'sm',
  colorClassName,
  sizeClassName,
  borderClassName,
  shadowClassName,
  labelClassName,
  dotOnly = false,
}: StatusDotProps) {
  const config = status && statusConfig[status] ? statusConfig[status] : null;
  const defaultDotSize = size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  const finalDotSize = sizeClassName || defaultDotSize;
  const finalDotColor = colorClassName || (config ? config.color : 'bg-gray-400');

  const dotContent = (
    <div className="relative flex-shrink-0">
      <div className={cn(finalDotSize, 'rounded-full', finalDotColor, borderClassName, shadowClassName)} />
      {pulse && (
        <div className={cn('absolute inset-0', finalDotSize, 'rounded-full', finalDotColor, 'animate-ping opacity-50')} />
      )}
    </div>
  );

  if (dotOnly) {
    return dotContent;
  }

  return (
    <div className="flex items-center gap-1.5">
      {dotContent}
      {(label !== undefined || config?.label) && (
        <span className={cn('text-xs text-slate-600', labelClassName)}>{label ?? config?.label}</span>
      )}
    </div>
  );
}

export default StatusDot;
