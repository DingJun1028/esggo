'use client';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  icon?: React.ReactNode;
  iconGradient?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tags?: string[];
  className?: string;
}

export function PageHeader({
  icon, iconGradient = 'linear-gradient(135deg, #003262, #3b7ea1)',
  title, subtitle, actions, tags, className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: iconGradient }}
          >
            <span className="text-white">{icon}</span>
          </div>
        )}
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a2e] leading-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-[#6b7280] mt-0.5">{subtitle}</p>}
          {tags && tags.length > 0 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-[5px] bg-[#eff6ff] text-[#2563eb] text-[11px] font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}