'use client';
import { cn } from '@/lib/cn';
import { designTokens } from '@/lib/design-tokens';

// ─── Generic Badge ──────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const badgeVariants: Record<string, string> = {
  default:  'bg-[#f3f4f6] text-[#374151]',
  primary:  'bg-[#dbeafe] text-[#2563eb]',
  success:  'bg-[#dcfce7] text-[#16a34a]',
  warning:  'bg-[#fef3c7] text-[#92400e]',
  danger:   'bg-[#fee2e2] text-[#dc2626]',
  info:     'bg-[#eff6ff] text-[#2563eb]',
  purple:   'bg-[#ede9fe] text-[#7c3aed]',
  muted:    'bg-[#f9fafb] text-[#9ca3af]',
  outline:  'bg-transparent border border-current text-[#374151]',
};

const badgeSizes: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-[12px]',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-[6px] font-semibold', badgeVariants[variant], badgeSizes[size], className)}>
      {children}
    </span>
  );
}

// ─── GRI Tag Badge ───────────────────────────────────────────────────────────
export function GRIBadge({ code, className }: { code: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb]', className)}>
      {code}
    </span>
  );
}

// ─── 5T Protocol Badge ───────────────────────────────────────────────────────
type T5Key = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

const t5Labels: Record<T5Key, string> = {
  T1: '可感知',
  T2: '可溯源',
  T3: '可追蹤',
  T4: '透明',
  T5: '不可篡改',
};

export function T5Badge({ protocol, className }: { protocol: T5Key; className?: string }) {
  const t5Colors: Record<T5Key, string> = {
    T1: designTokens.colors.t1Color,
    T2: designTokens.colors.t2Color,
    T3: designTokens.colors.t3Color,
    T4: designTokens.colors.t4Color,
    T5: designTokens.colors.t5Color,
  };
  const color = t5Colors[protocol];
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px]', className)}
      style={{ background: `${color}12`, border: `1px solid ${color}30` }}
    >
      <span style={{ fontWeight: 800, color }} className="text-[11px]">{protocol}</span>
      <span style={{ color: '#374151' }}>{t5Labels[protocol]}</span>
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
type StatusType = 'verified' | 'pending' | 'failed' | 'reviewing' | 'draft' | 'active' | 'inactive';

const statusMap: Record<StatusType, { label: string; variant: BadgeProps['variant'] }> = {
  verified:  { label: '已驗證', variant: 'success' },
  pending:   { label: '待驗證', variant: 'warning' },
  failed:    { label: '驗算失敗', variant: 'danger' },
  reviewing: { label: '審核中', variant: 'info' },
  draft:     { label: '草稿', variant: 'muted' },
  active:    { label: '啟用中', variant: 'success' },
  inactive:  { label: '停用', variant: 'muted' },
};

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  const { label, variant } = statusMap[status];
  return <Badge variant={variant} className={className}>{label}</Badge>;
}