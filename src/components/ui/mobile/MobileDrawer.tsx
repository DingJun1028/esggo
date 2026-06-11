'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useOmniTheme } from '../../theme/OmniThemeProvider';

export interface MobileDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  width?: number | string;
}

export function MobileDrawer({
  open,
  onClose,
  side = 'left',
  width = 280,
  children,
  className,
}: MobileDrawerProps) {
  const { isMobile } = useOmniTheme();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="absolute inset-0 bg-theme-bg-overlay backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className={cn(
          'absolute bottom-0 h-screen bg-theme-bg-secondary',
          'transition-transform duration-300 ease-in-out',
          side === 'left' ? 'left-0' : 'right-0',
          className
        )}
        style={{ width }}
      >
        <div className="flex items-center justify-end p-4 border-b border-theme-divider">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-theme-bg-tertiary"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-theme-text-secondary" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-60px)] p-4">
          {children}
        </div>
      </div>
    </div>
  );
}