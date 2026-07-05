import type { ComponentConfig, ComponentSize, ComponentVariant } from '../index';
import { cn, variantClasses, sizeClasses } from '../ui/utils';

export interface DataCardProps extends ComponentConfig {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  icon?: React.ReactNode;
}

export function DataCard({ title, value, unit, trend, trendValue, icon, className }: DataCardProps) {
  const trendColors: Record<string, string> = { up: 'text-success', down: 'text-lethal', flat: 'text-textSecondary' };
  const trendIcons: Record<string, string> = { up: '↑', down: '↓', flat: '→' };

  return (
    <div className={cn('bg-surface border border-borderColor rounded-lg p-4 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-textSecondary">{title}</span>
        {icon && <span className="text-textSecondary">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-textPrimary">{value}</span>
        {unit && <span className="text-xs text-textSecondary">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className={cn('text-xs font-medium mt-1', trendColors[trend])}>
          {trendIcons[trend]} {trendValue}
        </div>
      )}
    </div>
  );
}

export interface MetricCardProps extends ComponentConfig {
  title: string;
  metrics: Array<{ label: string; value: string | number; unit?: string }>;
}

export function MetricCard({ title, metrics, className }: MetricCardProps) {
  return (
    <div className={cn('bg-surface border border-borderColor rounded-lg p-4 shadow-sm', className)}>
      <h4 className="text-sm font-semibold text-textPrimary mb-3">{title}</h4>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-xs text-textSecondary">{m.label}</span>
            <span className="text-sm font-mono text-textPrimary">
              {m.value} {m.unit && <span className="text-textSecondary">{m.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ProofBadgeProps extends ComponentConfig {
  hash: string;
  label?: string;
}

export function ProofBadge({ hash, label = 'ZKP', className }: ProofBadgeProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 bg-primary px-2 py-1 rounded border border-borderColor/50 text-[10px] text-textSecondary font-mono', className)}>
      <Lock size={10} className="text-accentGold" />
      {label}: {hash.substring(0, 8)}...
    </div>
  );
}
