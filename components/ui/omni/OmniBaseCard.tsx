import { OmniComponentHeart } from '@esggo/types';
import React from 'react';
import { cn } from '../../../lib/utils';
import { useThemeStore } from '../../../lib/theme-store';

export interface OmniBaseCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'outline' | 'glow' | 'bordered';
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const OmniBaseCard = React.forwardRef<HTMLDivElement, OmniBaseCardProps>(
  (
    { className, padding = 'md', variant = 'default', title, subtitle, children, ...props },
    ref
  ) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const { omniTheme } = useThemeStore();

    const variants = {
      default: omniTheme === 'omnicore' 
        ? 'bg-[var(--theme-base)] border border-[var(--theme-border)] shadow-card'
        : 'bg-white border border-slate-200 shadow-sm text-slate-800',
      glass: omniTheme === 'omnicore'
        ? 'bg-slate-950/45 dark:bg-slate-950/45 light:bg-white/70 backdrop-blur-xl border border-white/15 dark:border-white/15 light:border-slate-900/15 shadow-glass saturate-150 text-slate-100'
        : 'bg-white border border-slate-200 shadow-sm text-slate-800',
      outline: omniTheme === 'omnicore'
        ? 'bg-transparent border-2 border-[var(--theme-border)]'
        : 'bg-transparent border-2 border-slate-200 text-slate-800',
      glow: omniTheme === 'omnicore'
        ? 'bg-[var(--theme-base)] border border-[var(--theme-primary)]/30 shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.1)]'
        : 'bg-white border border-slate-200 shadow-sm text-slate-800',
      bordered: omniTheme === 'omnicore'
        ? 'bg-white border border-slate-100 shadow-sm'
        : 'bg-white border border-slate-200 shadow-sm text-slate-800',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-normal',
          omniTheme === 'omnicore' ? 'text-[var(--theme-text)]' : '',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {(title || subtitle) && <OmniBaseCardHeader title={title} subtitle={subtitle} />}
        {children}
      </div>
    );
  }
);
OmniBaseCard.displayName = 'OmniBaseCard';

export function OmniBaseCardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4',
        className
      )}
    >
      <div>
        <h3 className="text-lg font-bold text-[var(--theme-text)] tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-[var(--theme-text-muted)] mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
