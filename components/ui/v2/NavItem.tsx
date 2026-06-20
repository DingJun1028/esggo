// components/ui/v2/NavItem.tsx
'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}

export function NavItem({ icon, label, href, active, badge, onClick, className }: NavItemProps) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
        active
          ? 'bg-berkeley-blue text-white'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
        className
      )}
      onClick={onClick}
    >
      {icon && <span className={cn('w-5 h-5', active ? 'text-white' : 'text-neutral-400')}>{icon}</span>}
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className={cn(
          'px-1.5 py-0.5 rounded-full text-xs font-bold',
          active ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
        )}>
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export function NavSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-6', className)}>
      <p className="px-3 mb-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
