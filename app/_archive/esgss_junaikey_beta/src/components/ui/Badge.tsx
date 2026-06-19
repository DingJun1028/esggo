import { cn } from '@/lib/utils.js';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'verified' | 'draft' | 'warning' | 'error';
  variant?: 'default' | 'outline' | 'secondary' | 'secondary-outline' | 'danger';
  children: React.ReactNode;
}

export function Badge({ status, variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors',
        {
          // Status based styles
          'bg-emerald-500/10 text-emerald-400': status === 'verified',
          'bg-slate-500/10 text-slate-400': status === 'draft',
          'bg-amber-500/10 text-amber-400': status === 'warning',
          'bg-red-500/10 text-red-400': status === 'error',

          // Variant based styles (if no status)
          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20': variant === 'default' && !status,
          'border border-gray-700 text-gray-400 bg-transparent': variant === 'outline' && !status,
          'bg-purple-500/10 text-purple-400': variant === 'secondary' && !status,
          'bg-red-500/10 text-red-400 border border-red-500/20': variant === 'danger' && !status,
        },
        className
      )}
      {...props}
    >
      {status && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          {
            'bg-emerald-400': status === 'verified',
            'bg-slate-400': status === 'draft',
            'bg-amber-400': status === 'warning',
            'bg-red-400': status === 'error',
          }
        )} />
      )}
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

export default Badge;
