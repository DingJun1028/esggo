// src/components/ui/LiveRegion.tsx
import React from 'react';

export interface LiveRegionProps {
  message: string;
  assertive?: boolean;
  className?: string;
}

/**
 * Screen-reader-only live region component for accessibility announcements.
 * Renders an aria-live region that announces changes to screen reader users.
 *
 * @param message - Text to announce to screen readers
 * @param assertive - If true, uses aria-live="assertive" for critical updates (default: false)
 *
 * @example
 * <LiveRegion message={statusMessage} />
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  assertive = false,
  className = '',
}) => {
  if (!message) return null;

  return (
    <div
      className={`sr-only ${className}`}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};
