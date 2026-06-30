import React from 'react';

const TK = (v: string) => `var(${v})`;

interface CardProps { children: React.ReactNode; className?: string; variant?: 'default' | 'highlight' | 'success' | 'warning' | 'error'; onClick?: () => void; }
interface CardHeaderProps { title: string; subtitle?: string; icon?: React.ReactNode; action?: React.ReactNode; }
interface MetricCardProps { label: string; value: string | number; unit?: string; change?: number; trend?: 'up' | 'down' | 'neutral'; icon?: React.ReactNode; }
interface BadgeProps { children: React.ReactNode; variant?: 'teal' | 'gold' | 'blue' | 'success' | 'warning' | 'error' | 'muted'; size?: 'sm' | 'md'; }
interface ButtonProps { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; onClick?: () => void; disabled?: boolean; className?: string; }
interface SectionProps { title?: string; subtitle?: string; children: React.ReactNode; className?: string; }

export function SolidCard({ children, className = '', variant = 'default', onClick }: CardProps) {
  const b = variant === 'highlight' ? TK('--accent-teal') : variant === 'success' ? TK('--accent-green') : variant === 'warning' ? TK('--accent-gold') : variant === 'error' ? TK('--accent-green') : 'transparent';
  return (
    <div onClick={onClick} className={`solid-card ${className}`} style={{ background: TK('--bg-secondary'), border: `1px solid ${TK('--border-color')}`, borderRadius: '8px', padding: '20px', marginBottom: '16px', borderLeft: b !== 'transparent' ? `4px solid ${b}` : undefined, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s, transform 0.15s', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,158,176,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && <span style={{ color: TK('--accent-teal'), fontSize: '18px' }}>{icon}</span>}
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: TK('--text-primary') }}>{title}</h3>
          {subtitle && <p style={{ margin: '2px 0 0', fontSize: '13px', color: TK('--text-secondary') }}>{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function MetricCard({ label, value, unit, change, trend, icon }: MetricCardProps) {
  return (
    <SolidCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '12px', color: TK('--text-secondary'), marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: TK('--accent-teal'), lineHeight: 1.2 }}>
            {value}{unit && <span style={{ fontSize: '14px', fontWeight: 400, color: TK('--text-secondary'), marginLeft: '4px' }}>{unit}</span>}
          </div>
          {change !== undefined && (
            <div style={{ fontSize: '13px', color: trend === 'up' ? TK('--accent-green') : trend === 'down' ? TK('--accent-green') : TK('--text-muted'), marginTop: '4px', fontWeight: 500 }}>
              {trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '\u2192'} {Math.abs(change)}% vs 上期
            </div>
          )}
        </div>
        {icon && <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'color-mix(in srgb, var(--accent-teal) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TK('--accent-teal') }}>{icon}</div>}
      </div>
    </SolidCard>
  );
}

export function Badge({ children, variant = 'teal', size = 'sm' }: BadgeProps) {
  const c: Record<string, string> = { teal: TK('--accent-teal'), gold: TK('--accent-gold'), blue: TK('--accent-blue'), success: TK('--accent-green'), warning: TK('--accent-gold'), error: TK('--accent-green'), muted: TK('--text-secondary') };
  const base = c[variant] || c.teal;
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: size === 'sm' ? '2px 8px' : '4px 12px', borderRadius: '4px', fontSize: size === 'sm' ? '11px' : '12px', fontWeight: 600, background: `color-mix(in srgb, ${base} 18%, transparent)`, color: base, lineHeight: 1.4 }}>{children}</span>;
}

export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className }: ButtonProps) {
  const s: Record<string, React.CSSProperties> = { primary: { background: TK('--accent-teal'), color: '#FFF', border: 'none', boxShadow: '0 2px 4px color-mix(in srgb, var(--accent-teal) 40%, transparent)' }, secondary: { background: TK('--bg-secondary'), color: TK('--text-primary'), border: `1px solid ${TK('--border-color')}` }, ghost: { background: 'transparent', color: TK('--accent-teal'), border: 'none' }, danger: { background: TK('--accent-green'), color: '#FFF', border: 'none' } };
  const p: Record<string, string> = { sm: '6px 12px', md: '8px 16px', lg: '12px 24px' };
  const f: Record<string, string> = { sm: '13px', md: '14px', lg: '16px' };
  return <button onClick={onClick} disabled={disabled} className={`solid-btn ${className}`} style={{ ...(s[variant] || s.primary), borderRadius: '6px', padding: p[size], fontSize: f[size], fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'opacity 0.2s, box-shadow 0.2s', fontFamily: 'inherit' }}>{children}</button>;
}

export function Section({ title, subtitle, children, className }: SectionProps) {
  return (
    <section className={className} style={{ marginBottom: '32px' }}>
      {title && <div style={{ marginBottom: '16px', borderBottom: `2px solid ${TK('--accent-teal')}`, paddingBottom: '8px' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: TK('--accent-teal') }}>{title}</h2>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: '14px', color: TK('--text-secondary') }}>{subtitle}</p>}
      </div>}
      {children}
    </section>
  );
}

export function Grid({ children, columns = 3, gap = 16, style }: { children: React.ReactNode; columns?: number; gap?: number; style?: React.CSSProperties }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${columns <= 2 ? '280px' : '240px'}, 1fr))`, gap: `${gap}px`, ...style }} className="solid-grid">{children}</div>;
}

export function Divider() { return <hr style={{ border: 'none', borderTop: `1px solid ${TK('--border-color')}`, margin: '24px 0' }} />; }

export function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: TK('--border-color'), overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: color || TK('--accent-teal'), borderRadius: '4px', transition: 'width 0.3s ease' }} /></div>;
}
