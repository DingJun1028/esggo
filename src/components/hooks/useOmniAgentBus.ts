'use client';

import { useEffect, useState, useCallback } from 'react';
import { omniAgentBus, IMiaoDeNotification } from '@/services/OmniAgentBus';
import { useOmniTheme } from '@/theme/OmniThemeProvider';

export interface UseOmniAgentBusOptions {
  autoSubscribe?: boolean;
}

export function useOmniAgentBus(options: UseOmniAgentBusOptions = {}) {
  const { autoSubscribe = true } = options;
  const { theme } = useOmniTheme();
  const [latestWill, setLatestWill] = useState('');
  const [notifications, setNotifications] = useState<IMiaoDeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!autoSubscribe) return;

    setIsConnected(true);

    const subscription = omniAgentBus.observeSupremeWill().subscribe({
      next: (will: string) => {
        setLatestWill(will);
        // Create notification artifact
        const artifact: IMiaoDeNotification = {
          uuid: `🪞-${Date.now()}`,
          essence: will,
          miaoDeUtility: () => `律之道: ${will.substring(0, 20)}...`,
          isUnimpeded: true,
        };
        Object.freeze(artifact);
        setNotifications((prev) => [artifact, ...prev].slice(0, 20));
      },
      error: (err: any) => {
        console.error('OmniAgentBus connection error:', err);
        setIsConnected(false);
      },
    });

    return () => {
      subscription.unsubscribe();
      setIsConnected(false);
    };
  }, [autoSubscribe]);

  const broadcastWill = useCallback((will: string) => {
    omniAgentBus.broadcastSupremeWill(will);
  }, []);

  return {
    latestWill,
    notifications,
    isConnected,
    broadcastWill,
    theme,
  };
}
