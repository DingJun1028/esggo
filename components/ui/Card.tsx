'use client';
import { cn } from '@/lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'gradient' | 'accent' | 'bordered';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const cardVariants: Record<string, string> = {
  default:  'bg-white border border-[#e5e7eb]',
  subtle:   'bg-[#f8f9fb] border border-[#e5e7eb]',
  gradient: 'bg-gradient-to-br from-[#003262] to-[#1d4ed8] border-transparent text-white',
  accent:   'bg-white border-l-4 border-[#003262] border-t border-r border-b border-[#e5e7eb]',
  bordered: 'bg-white border-2 border-[#003262]',
};

const cardPaddings: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-7',
};

export function Card({ children, className, variant = 'default', hover = false, padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[14px]',
        cardVariants[variant],
        cardPaddings[padding],
        hover && 'cursor-pointer transition-shadow duration-200 hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, border = true }: { children: React.ReactNode; className?: string; border?: boolean }) {
  return (
    <div className={cn('px-5 py-3.5 bg-[#f9fafb]', border && 'border-b border-[#f3f4f6]', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ children, className, border = true }: { children: React.ReactNode; className?: string; border?: boolean }) {
  return (
    <div className={cn('px-5 py-4', border && 'border-t border-[#f3f4f6]', className)}>
      {children}
    </div>
  );
}