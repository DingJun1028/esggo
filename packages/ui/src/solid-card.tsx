import React from 'react';
import { DESIGN_TOKENS as TOKENS } from '@esggo/shared';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'gold' | 'blue' | 'success' | 'warning' | 'error' | 'muted';
  size?: 'sm' | 'md';
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SolidCard({ children, className = '', variant = 'default', onClick }: CardProps) {
  const borderLeftColor =
    variant === 'highlight' ? TOKENS.teal :
    variant === 'success' ? TOKENS.success :
    variant === 'warning' ? TOKENS.warning :
    variant === 'error' ? TOKENS.error :
    'transparent';

  return (
    <div
      onClick={onClick}
      className={`solid-card ${className}`}
      style={{
        background: TOKENS.surface,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '16px',
        borderLeft: borderLeftColor !== 'transparent' ? `4px solid ${borderLeftColor}` : undefined,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s, transform 0.15s',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,158,176,0.15)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && <span style={{ color: TOKENS.teal, fontSize: '18px' }}>{icon}</span>}
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: TOKENS.textPrimary }}>{title}</h3>
          {subtitle && <p style={{ margin: '2px 0 0', fontSize: '13px', color: TOKENS.textSecondary }}>{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function MetricCard({ label, value, unit, change, trend, icon }: MetricCardProps) {
  const trendColor =
    trend === 'up' ? TOKENS.success :
    trend === 'down' ? TOKENS.error :
    TOKENS.textMuted;

  const trendIcon = trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '\u2192';

  return (
    <SolidCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '12px', color: TOKENS.textSecondary, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: TOKENS.teal, lineHeight: 1.2 }}>
            {value}
            {unit && <span style={{ fontSize: '14px', fontWeight: 400, color: TOKENS.textSecondary, marginLeft: '4px' }}>{unit}</span>}
          </div>
          {change !== undefined && (
            <div style={{ fontSize: '13px', color: trendColor, marginTop: '4px', fontWeight: 500 }}>
              {trendIcon} {Math.abs(change)}% vs 上期
            </div>
          )}
        </div>
        {icon && (
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${TOKENS.teal}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TOKENS.teal }}>
            {icon}
          </div>
        )}
      </div>
    </SolidCard>
  );
}

export function Badge({ children, variant = 'teal', size = 'sm' }: BadgeProps) {
  const tokenColors: Record<string, { base: string }> = {
    teal: { base: TOKENS.teal },
    gold: { base: TOKENS.gold },
    blue: { base: TOKENS.zkpBlue },
    success: { base: TOKENS.success },
    warning: { base: TOKENS.warning },
    error: { base: TOKENS.error },
    muted: { base: TOKENS.textSecondary },
  };

  const c = tokenColors[variant] || tokenColors.teal;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: '4px',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 600,
        background: `${c.base}18`,
        color: c.base,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className }: ButtonProps) {
  const bgColors: Record<string, string> = {
    primary: TOKENS.teal,
    secondary: TOKENS.surface,
    ghost: 'transparent',
    danger: TOKENS.error,
  };

  const textColors: Record<string, string> = {
    primary: '#FFFFFF',
    secondary: TOKENS.textPrimary,
    ghost: TOKENS.teal,
    danger: '#FFFFFF',
  };

  const paddings: Record<string, string> = {
    sm: '6px 12px',
    md: '8px 16px',
    lg: '12px 24px',
  };

  const fontSizes: Record<string, string> = {
    sm: '13px',
    md: '14px',
    lg: '16px',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`solid-btn ${className}`}
      style={{
        background: bgColors[variant],
        color: textColors[variant],
        border: variant === 'secondary' ? `1px solid ${TOKENS.border}` : variant === 'ghost' ? 'none' : 'none',
        borderRadius: '6px',
        padding: paddings[size],
        fontSize: fontSizes[size],
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s, box-shadow 0.2s',
        boxShadow: variant === 'primary' ? '0 2px 4px rgba(0,158,176,0.25)' : 'none',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

export function Section({ title, subtitle, children, className }: SectionProps) {
  return (
    <section className={className} style={{ marginBottom: '32px' }}>
      {title && (
        <div style={{ marginBottom: '16px', borderBottom: `2px solid ${TOKENS.teal}`, paddingBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: TOKENS.teal }}>{title}</h2>
          {subtitle && <p style={{ margin: '4px 0 0', fontSize: '14px', color: TOKENS.textSecondary }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Grid({ children, columns = 3, gap = 16, style }: { children: React.ReactNode; columns?: number; gap?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        ...style,
      }}
      className="solid-grid"
    >
      {children}
    </div>
  );
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${TOKENS.border}`, margin: '24px 0' }} />;
}

export function ProgressBar({ value, max = 100, color = TOKENS.teal }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: TOKENS.border, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
    </div>
  );
}

export { TOKENS as SOLID_CARD_TOKENS };
