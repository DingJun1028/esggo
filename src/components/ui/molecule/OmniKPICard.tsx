'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useOmniTheme } from '../../theme/OmniThemeProvider';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import type { TDimension } from '@/types/omni-component';

export interface OmniKPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  griRef?: string;
  source?: string;
  loading?: boolean;
}

const OmniKPICard = forwardRef<HTMLDivElement, OmniKPICardProps>(
  ({ 
    title, 
    value, 
    unit,
    change,
    trend = 'neutral',
    icon: Icon,
    griRef,
    source,
    loading,
    className, 
    ...props 
  }, ref) => {
    const { isMobile } = useOmniTheme();

    const trendColor = trend === 'up' ? 'text-theme-success' : trend === 'down' ? 'text-theme-error' : 'text-theme-text-muted';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

    return (
      <div
        className={cn(
          'omni-card-glass flex flex-col gap-3',
          isMobile ? 'min-h-[120px]' : 'min-h-[140px]',
          'hover:translate-y-[-2px] transition-transform',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className="text-caption font-bold uppercase text-theme-text-muted">
            {title}
          </span>
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-theme-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-theme-primary" />
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-theme-bg-tertiary rounded w-3/4" />
            <div className="h-4 bg-theme-bg-tertiary rounded w-1/2" />
          </div>
        ) : (
          <>
            <div className="font-mono">
              <span className="text-2xl font-bold text-theme-text-primary">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
              {unit && (
                <span className="text-body text-theme-text-muted ml-1">
                  {unit}
                </span>
              )}
            </div>
            
            {change !== undefined && TrendIcon && (
              <div className={cn('flex items-center gap-1', trendColor)}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-caption font-medium">
                  {Math.abs(change)}%
                </span>
              </div>
            )}
            
            <div className="text-caption text-theme-text-muted">
              {griRef && <span>{griRef}</span>}
              {source && <span>{griRef ? ' • ' : ''}{source}</span>}
            </div>
          </>
        )}
      </div>
    );
  }
);

OmniKPICard.displayName = 'OmniKPICard';

export { OmniKPICard };