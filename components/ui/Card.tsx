// components/ui/Card.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, hoverEffect = false, glow = false, children, ...props }, ref) => {
    const isHoverable = hover || hoverEffect;

    return (
      <div
        ref={ref}
        className={cn(
          // 液態玻璃基礎效果
          'relative rounded-card backdrop-blur-lg',
          'bg-white/60 border border-white/60',
          'shadow-glass',
          'p-card overflow-hidden',
         
          // Hover 效果
          isHoverable && 'transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:bg-white/80 hover:border-white/80',
         
          // 發光效果（用於重要卡片）
          glow && 'before:absolute before:inset-0 before:-z-10 before:rounded-card before:bg-gradient-to-r before:from-berkeley-blue/5 before:to-verified/5 before:blur-2xl',
         
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ title, subtitle, icon, className, children }: { title?: string; subtitle?: string; icon?: React.ReactNode; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex items-start justify-between mb-6", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {icon && <div className="text-berkeley-blue">{icon}</div>}
          {title && <h3 className="text-lg font-black text-berkeley-blue uppercase tracking-tight">{title}</h3>}
        </div>
        {subtitle && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative z-10", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-black text-berkeley-blue tracking-tight", className)}>{children}</h3>;
}
