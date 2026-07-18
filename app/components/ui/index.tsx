/**
 * OmniCore Design System — Shared UI Components
 * app/components/ui/index.ts
 *
 * 10 Principles:
 * 1. Consistency — Every module uses the same visual language
 * 2. Feedback — Loading, error, empty states always shown
 * 3. Accessibility — ARIA labels, keyboard nav, focus rings
 * 4. Responsive — Mobile-first, works on all screen sizes
 * 5. Dark Mode — Native support via class strategy
 * 6. Type Safety — No `any`, explicit interfaces
 * 7. Composability — Small pieces compose into complex UIs
 * 8. Performance — Lazy loading, minimal re-renders
 * 9. WHW — Why/How/What documented for each component
 * 10. Teaching — Each component is a learning example
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// Design Tokens
// ═══════════════════════════════════════════════════════════════

export const tokens = {
  teal: '#009EB0',
  gold: '#D4AF37',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  green: '#10B981',
  red: '#EF4444',
  amber: '#F59E0B',
  cyan: '#06B6D4',
} as const;

// ═══════════════════════════════════════════════════════════════
// StatusDot — Inline status indicator
// Why: Users need instant visual feedback on item health
// How: Green/red dot with glow shadow
// What: <StatusDot ok={true} /> or <StatusDot status="healthy" />
// ═══════════════════════════════════════════════════════════════

interface StatusDotProps {
  ok?: boolean;
  status?: 'healthy' | 'degraded' | 'offline' | 'active' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function StatusDot({ ok, status, size = 'md', label }: StatusDotProps) {
  const resolvedStatus = status ?? (ok ? 'healthy' : 'error');
  const colorMap: Record<string, string> = {
    healthy: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
    active: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
    degraded: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
    offline: 'bg-gray-400',
    error: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]',
  };
  const sizeMap: Record<string, string> = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block rounded-full ${sizeMap[size]} ${colorMap[resolvedStatus]}`}
        role="status"
        aria-label={label || resolvedStatus}
      />
      {label && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      )}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// Badge — Categorization label
// Why: Visual classification of items by type/status/severity
// How: Colored pill with text
// What: <Badge color="teal">Active</Badge>
// ═══════════════════════════════════════════════════════════════

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, color = 'teal', size = 'sm' }: BadgeProps) {
  const colorMap: Record<string, string> = {
    teal: 'bg-[#009EB0]/15 text-[#009EB0]',
    gold: 'bg-[#D4AF37]/15 text-[#D4AF37]',
    blue: 'bg-[#3B82F6]/15 text-[#3B82F6]',
    green: 'bg-emerald-500/15 text-emerald-500',
    red: 'bg-red-500/15 text-red-500',
    gray: 'bg-gray-500/15 text-gray-500',
    purple: 'bg-purple-500/15 text-purple-500',
    amber: 'bg-amber-500/15 text-amber-500',
    cyan: 'bg-cyan-500/15 text-cyan-500',
  };
  const sizeMap: Record<string, string> = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };
  return (
    <span
      className={`inline-block font-semibold rounded-md ${sizeMap[size]} ${colorMap[color] || colorMap.teal}`}
    >
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// Card — Container with accent border
// Why: Consistent card layout across all modules
// How: White/dark bg, left accent border, hover shadow
// What: <Card title="Name" icon="📦" accent="teal">content</Card>
// ═══════════════════════════════════════════════════════════════

interface CardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  accent?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Card({ title, icon, children, accent = 'teal', action, className = '' }: CardProps) {
  const borderMap: Record<string, string> = {
    teal: 'border-l-[#009EB0]',
    gold: 'border-l-[#D4AF37]',
    blue: 'border-l-[#3B82F6]',
    purple: 'border-l-[#8B5CF6]',
    green: 'border-l-emerald-500',
    red: 'border-l-red-500',
  };
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 border-l-4 ${
        borderMap[accent] || borderMap.teal
      } p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MetricRow — Key-value display row
// Why: Consistent data display in dashboards
// How: Flex row with label left, value right, bottom border
// What: <MetricRow label="CPU" value="45%" />
// ═══════════════════════════════════════════════════════════════

interface MetricRowProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function MetricRow({ label, value, sub }: MetricRowProps) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200">
          {value}
        </span>
        {sub && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">{sub}</span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ProgressBar — Visual progress indicator
// Why: Show completion/loading progress
// How: Colored bar with percentage, auto-red at >80%
// What: <ProgressBar percent={65} color="teal" />
// ═══════════════════════════════════════════════════════════════

interface ProgressBarProps {
  percent: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({ percent, color = 'teal', height = 'h-2', showLabel = false }: ProgressBarProps) {
  const colorMap: Record<string, string> = {
    teal: 'bg-[#009EB0]',
    gold: 'bg-[#D4AF37]',
    blue: 'bg-[#3B82F6]',
    red: 'bg-red-500',
    green: 'bg-emerald-500',
  };
  const clamped = Math.min(100, Math.max(0, percent));
  const barColor = clamped > 80 ? colorMap.red : colorMap[color] || colorMap.teal;
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 dark:text-gray-400">Progress</span>
          <span className="font-mono">{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Skeleton — Loading placeholder
// Why: Prevent layout shift during data fetch
// How: Animated gray bars matching content shape
// What: <Skeleton lines={3} /> or <Skeleton type="card" />
// ═══════════════════════════════════════════════════════════════

interface SkeletonProps {
  lines?: number;
  type?: 'text' | 'card' | 'chart' | 'table';
  className?: string;
}

export function Skeleton({ lines = 3, type = 'text', className = '' }: SkeletonProps) {
  if (type === 'card') {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" style={{ width: `${85 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }
  if (type === 'chart') {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 ${className}`}>
        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
        <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          style={{ width: `${90 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EmptyState — No data placeholder
// Why: Guide users when content is unavailable
// How: Icon + message + optional CTA button
// What: <EmptyState icon="📭" message="No items" onAction={() => {}} />
// ═══════════════════════════════════════════════════════════════

interface EmptyStateProps {
  icon?: string;
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '📭', message, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{message}</p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-[#009EB0] text-white rounded-lg hover:bg-[#007d8f] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ErrorBanner — Error feedback
// Why: Users must know when something fails
// How: Yellow/red banner with message and retry button
// What: <ErrorBanner message="Failed to load" onRetry={() => {}} />
// ═══════════════════════════════════════════════════════════════

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning';
}

export function ErrorBanner({ message, onRetry, severity = 'error' }: ErrorBannerProps) {
  const styles = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
  };
  return (
    <div className={`px-4 py-3 border rounded-lg text-xs flex items-center justify-between ${styles[severity]}`}>
      <div className="flex items-center gap-2">
        <span>{severity === 'error' ? '✕' : '⚠'}</span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-semibold underline hover:no-underline"
        >
          重試
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Spinner — Loading indicator
// Why: Visual feedback during async operations
// How: CSS-animated circle
// What: <Spinner size="md" />
// ═══════════════════════════════════════════════════════════════

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Spinner({ size = 'md', color = '#009EB0' }: SpinnerProps) {
  const sizeMap: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  return (
    <div
      className={`${sizeMap[size]} border-2 border-t-transparent rounded-full animate-spin`}
      style={{ borderColor: `${color} transparent transparent transparent` }}
      role="status"
      aria-label="Loading"
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// TabBar — Module tab navigation
// Why: Consistent tab switching across modules
// How: Horizontal button group with active state
// What: <TabBar tabs={[{id:'a',label:'A',icon:'x'}]} active="a" onChange={setTab} />
// ═══════════════════════════════════════════════════════════════

interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
            active === tab.id
              ? 'bg-[#009EB0] text-white shadow-lg shadow-[#009EB0]/25'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                active === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SearchInput — Search with debounce
// Why: Fast content filtering without overwhelming backend
// How: Input with debounced onChange callback
// What: <SearchInput onSearch={(q) => setQuery(q)} placeholder="Search..." />
// ═══════════════════════════════════════════════════════════════

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchInput({ onSearch, placeholder = 'Search...', debounceMs = 300 }: SearchInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009EB0]/50 focus:border-[#009EB0] transition-all"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// useFetch — Data fetching hook with loading/error states
// Why: Eliminate repetitive fetch+loading+error boilerplate
// How: Wraps fetch with useState for data, loading, error
// What: const { data, loading, error, refetch } = useFetch('/api/x')
// ═══════════════════════════════════════════════════════════════

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string, options?: RequestInit & { interval?: number }): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
    if (options?.interval) {
      const poll = setInterval(fetchData, options.interval);
      return () => clearInterval(poll);
    }
  }, [fetchData, options?.interval]);

  return { data, loading, error, refetch: fetchData };
}
