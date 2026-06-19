import React, { memo } from 'react';
import '@/styles/DashboardEffects.css';

// ==================== TYPE DEFINITIONS ====================
type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

interface GlassPanelProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

interface MetricCardProps {
  readonly icon: IconComponent;
  readonly label: string;
  readonly value: string | number;
  readonly unit: string;
  readonly trend: string;
  readonly color?: string;
}

interface ModuleNodeProps {
  readonly name: string;
  readonly status: 'active' | 'idle';
  readonly icon: IconComponent;
}

// ==================== GLASS PANEL ====================
export const GlassPanel = memo<GlassPanelProps>(({ children, className = '' }) => (
  <div
    className={`bg-[#051C1A]/60 backdrop-blur-xl border border-[#FFD700]/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] glass-border-animate transition-all duration-500 ${className}`}
    role="region"
  >
    {children}
  </div>
));

GlassPanel.displayName = 'GlassPanel';

// ==================== METRIC CARD ====================
export const MetricCard = memo<MetricCardProps>(
  ({ icon: Icon, label, value, unit, trend, color = 'text-[#FFD700]' }) => (
    <GlassPanel className="p-4 flex flex-col gap-2 transition-all hover:border-[#FFD700]/50 group">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg bg-[#121212]/50 ${color}`} aria-hidden="true">
          <Icon size={20} />
        </div>
        <span className="text-[10px] text-emerald-400 font-mono" aria-label={`Trend: ${trend}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-1">
          <h3
            className="text-2xl font-bold text-white group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all"
            aria-label={`${label}: ${value} ${unit}`}
          >
            {value}
          </h3>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
    </GlassPanel>
  )
);

MetricCard.displayName = 'MetricCard';

// ==================== MODULE NODE ====================
export const ModuleNode = memo<ModuleNodeProps>(({ name, status, icon: Icon }) => {
  const isActive = status === 'active';

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="status"
      aria-label={`${name} module: ${status}`}
    >
      <div
        className={`
                    w-16 h-16 rounded-full flex items-center justify-center border-2 
                    transition-all duration-500
                    ${
                      isActive
                        ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_25px_rgba(255,215,0,0.4)] animate-pulse'
                        : 'border-gray-800 bg-gray-900/50'
                    }
                `}
        aria-hidden="true"
      >
        <Icon
          size={28}
          className={
            isActive ? 'text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]' : 'text-gray-600'
          }
        />
      </div>
      <span
        className={`
                    text-[10px] font-bold uppercase tracking-tighter
                    ${isActive ? 'text-[#FFD700]' : 'text-gray-500'}
                `}
      >
        {name}
      </span>
    </div>
  );
});

ModuleNode.displayName = 'ModuleNode';
