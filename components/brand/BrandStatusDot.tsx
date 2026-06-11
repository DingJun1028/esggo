import React from 'react';
import { cn } from '../../lib/utils'; // Assuming cn is omnily available

type StatusType = 'active' | 'inactive' | 'warning' | 'error' | 'pending' | 'verified';

interface BrandStatusDotProps {
  status?: StatusType; // Make optional, as custom color can be passed via colorClassName
  label?: string;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  colorClassName?: string;   // New: Override dot color
  sizeClassName?: string;    // New: Override dot size
  borderClassName?: string;  // New: Add border styles to dot
  shadowClassName?: string;  // New: Add shadow styles to dot
  labelClassName?: string;   // New: Add custom styles to label
  dotOnly?: boolean;         // New: Render only the dot, no label container
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  active: { color: 'bg-emerald-500', label: '運行中' }, // Changed to emerald-500 as per spec
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
  colorClassName,
  sizeClassName,
  borderClassName,
  shadowClassName,
  labelClassName,
  dotOnly = false,
}: BrandStatusDotProps) {
  const config = status && statusConfig[status] ? statusConfig[status] : null;
  const defaultDotSize = size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  const finalDotSize = sizeClassName || defaultDotSize;
  const finalDotColor = colorClassName || (config ? config.color : 'bg-gray-400'); // Default to gray if no status or color provided

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
        <span className={cn("text-xs text-slate-600", labelClassName)}>{label ?? config?.label}</span>
      )}
    </div>
  );
}