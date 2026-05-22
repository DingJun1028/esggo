'use client';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {icon && (
        <div className="w-14 h-14 rounded-[16px] bg-[#f3f4f6] flex items-center justify-center mb-4 text-[#9ca3af]">
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-bold text-[#374151] mb-1">{title}</h3>
      {description && <p className="text-[13px] text-[#9ca3af] max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}