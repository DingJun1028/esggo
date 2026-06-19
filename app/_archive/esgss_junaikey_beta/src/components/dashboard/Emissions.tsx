import React, { memo } from 'react';
import { Card } from '@/components/ui';
import { TrendingDown, TreeDeciduous, Factory } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
interface EmissionCardProps {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly value: string;
  readonly trend?: string;
  readonly subtitle?: string;
  readonly variant?: 'positive' | 'neutral' | 'pending';
}

// ==================== SUB-COMPONENTS ====================
const EmissionCard = memo<EmissionCardProps>(
  ({ icon: Icon, title, value, trend, subtitle, variant = 'neutral' }) => {
    const variantStyles = {
      positive: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100',
      neutral: 'bg-white dark:bg-slate-800',
      pending: 'bg-slate-50 border-dashed border-2',
    };

    const iconStyles = {
      positive: 'bg-emerald-100 dark:bg-emerald-800',
      neutral: 'bg-slate-100 dark:bg-slate-800',
      pending: 'bg-slate-100',
    };

    const iconColors = {
      positive: 'text-emerald-600 dark:text-emerald-300',
      neutral: 'text-slate-600 dark:text-slate-300',
      pending: 'text-slate-400',
    };

    if (variant === 'pending') {
      return (
        <Card className={variantStyles.pending}>
          <div className="text-center p-4">
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
        </Card>
      );
    }

    return (
      <Card className={`p-4 flex items-center space-x-4 ${variantStyles[variant]}`}>
        <div className={`p-3 ${iconStyles[variant]} rounded-full`} aria-hidden="true">
          <Icon className={`w-6 h-6 ${iconColors[variant]}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
          {trend && (
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <TrendingDown className="w-3 h-3 mr-1" aria-hidden="true" />
              <span>{trend}</span>
            </div>
          )}
          {subtitle && (
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <span>{subtitle}</span>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

EmissionCard.displayName = 'EmissionCard';

// ==================== MAIN COMPONENT ====================
export const Emissions = memo(() => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      role="region"
      aria-label="Carbon emissions tracking"
    >
      <EmissionCard
        icon={TreeDeciduous}
        title="碳抵換 (Carbon Offset)"
        value="1,240t"
        trend="較上月增加 5%"
        variant="positive"
      />

      <EmissionCard
        icon={Factory}
        title="範疇一排放 (Scope 1)"
        value="850t"
        subtitle="運營直接排放"
        variant="neutral"
      />

      <EmissionCard
        icon={Factory}
        title="範疇三 (Scope 3) 數據同步中..."
        value=""
        subtitle="預計 15 分鐘後完成"
        variant="pending"
      />
    </div>
  );
});

Emissions.displayName = 'Emissions';
