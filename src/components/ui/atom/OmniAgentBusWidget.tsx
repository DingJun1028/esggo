'use client';

import { useEffect, useState } from 'react';
import { useOmniTheme } from '../../theme/OmniThemeProvider';
import { cn } from '@/lib/utils';
import { useTouchGesture } from '../../hooks/useTouchGesture';
import type { IMiaoDeNotification } from '../../../services/OmniAgentBus';

export interface OmniAgentBusWidgetProps {
  will: string;
  notifications?: IMiaoDeNotification[];
  showHistory?: boolean;
  onWillChange?: (will: string) => void;
}

export function OmniAgentBusWidget({
  will,
  notifications = [],
  showHistory = false,
  onWillChange,
}: OmniAgentBusWidgetProps) {
  const { theme, isMobile } = useOmniTheme();
  const [activeNotifications, setActiveNotifications] = useState(notifications);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveNotifications(prev => [...notifications, ...prev].slice(0, 20));
  }, [notifications]);

  const { ref: touchRef } = useTouchGesture(
    () => setIsExpanded(!isExpanded),
    () => {
      // Long press cycles through themes
      const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(theme as 'light' | 'dark' | 'system');
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      // Would trigger theme change via context
    }
  );

  return (
    <div
      ref={touchRef as any}
      className={cn(
        'omni-card-glass rounded-xl p-4 transition-all duration-300',
        isMobile ? 'w-full' : 'w-80',
        isExpanded ? 'max-h-96' : 'max-h-48',
        'overflow-hidden'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-caption font-bold uppercase text-theme-text-muted">
          OmniAgent Bus
        </span>
        <div className={cn(
          'w-2 h-2 rounded-full',
          'bg-theme-success animate-pulse'
        )} />
      </div>

      <div className="space-y-2">
        <div className="text-body font-medium text-theme-text-primary truncate">
          {will || '等待意志同步...'}
        </div>

        {showHistory && isExpanded && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {activeNotifications.map((notification, idx) => (
              <div
                key={idx}
                className="text-caption-sm text-theme-text-muted truncate"
              >
                🪞 {notification.uuid}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}