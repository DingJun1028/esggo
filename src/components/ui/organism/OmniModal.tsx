'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useOmniTheme } from '../../../theme/OmniThemeProvider';

export interface OmniModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'default' | 'lg' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export function OmniModal({
  open,
  onClose,
  title,
  description,
  size = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  className,
}: OmniModalProps) {
  const { isMobile } = useOmniTheme();

  useEffect(() => {
    if (!closeOnEsc) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose, closeOnEsc]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'w-[400px] max-w-[90vw]',
    default: 'w-[600px] max-w-[90vw]',
    lg: 'w-[800px] max-w-[90vw]',
    fullscreen: 'w-full h-full max-w-none rounded-none',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-theme-bg-overlay backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div 
        className={cn(
          'relative bg-theme-bg-primary rounded-2xl shadow-xl z-10',
          'max-h-[85vh] overflow-hidden flex flex-col',
          sizeClasses[size],
          isMobile && size !== 'fullscreen' && 'mx-4 rounded-xl'
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-theme-divider">
            <div>
              {title && (
                <h2 className="text-h2 font-semibold text-theme-text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-body-sm text-theme-text-muted mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-theme-bg-tertiary"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-theme-text-secondary" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}