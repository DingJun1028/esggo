'use client';
import React from 'react';

type StatusType = 'active' | 'inactive' | 'warning' | 'error' | 'pending' | 'verified';

interface BrandStatusDotProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  active: { color: 'bg-green-500', label: '運行中' },
  inactive: { color: 'bg-slate-400', label: '離線' },
  warning: { color: 'bg-amber-500', label: '警告' },
  error: { color: 'bg-red-500', label: '錯誤' },
  pending: { color: 'bg-blue-400', label: '等待中' },
  verified: { color: 'bg-[#003262]', label: '已驗證' },
};

export default function BrandStatusDot({
  status,
  label,
  pulse = false,
  size = 'sm',
}: BrandStatusDotProps) {
  const config = statusConfig[status];
  const dotSize = size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex-shrink-0">
        <div className={`${dotSize} rounded-full ${config.color}`} />
        {pulse && (
          <div className={`absolute inset-0 ${dotSize} rounded-full ${config.color} animate-ping opacity-50`} />
        )}
      </div>
      {(label !== undefined) && (
        <span className="text-xs text-slate-600">{label ?? config.label}</span>
      )}
    </div>
  );
}