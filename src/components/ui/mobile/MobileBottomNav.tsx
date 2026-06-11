'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileBottomNavProps, MobileBottomNavItem } from '@/types/omni-component';

export function MobileBottomNav({
  items,
  showLabels = true,
  className,
}: MobileBottomNavProps) {
  const [activeItem, setActiveItem] = useState<number>(0);

  return (
    <nav 
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-theme-mobile-nav-bg backdrop-blur-md border-t border-theme-border',
        'flex items-center justify-around px-2',
        'h-16 sm:h-[68px]',
        'pb-[env(safe-area-inset-bottom, 0px)]',
        className
      )}
      style={{ 
        height: `calc(64px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setActiveItem(index);
            item.onPress?.();
          }}
          className={cn(
            'flex flex-col items-center justify-center',
            'relative min-w-[48px] h-12',
            'rounded-lg transition-all duration-150',
            activeItem === index 
              ? 'text-theme-primary' 
              : 'text-theme-text-muted hover:text-theme-text-secondary'
          )}
          aria-label={item.label}
        >
          <div className="relative">
            {item.icon}
            {item.badge && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 text-[10px] bg-theme-accent text-theme-primary rounded-full flex items-center justify-center">
                {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>
          {showLabels && (
            <span className={cn(
              'text-[10px] font-bold uppercase mt-0.5',
              activeItem === index ? 'text-theme-primary' : 'text-theme-text-muted'
            )}>
              {item.label}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}