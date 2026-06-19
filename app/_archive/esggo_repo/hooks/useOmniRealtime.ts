import { useState, useEffect, useMemo, useCallback } from 'react';
import { IOmniRealtimeService, OmniEvent } from '../lib/realtime/IOmniRealtimeService';
import { useServices } from '../contexts/ServiceContext';
import { useAuthStore } from '@/src/client/store/useAuthStore';

export function useOmniRealtime(injectedService?: IOmniRealtimeService) {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<OmniEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<unknown[]>([]);
  const { omniRealtimeService } = useServices();

  // 優先使用外部參數注入 (方便針對此 Hook 單元測試)，其次使用全域 Context 提供的 Service
  const service = useMemo(() => injectedService || omniRealtimeService, [injectedService, omniRealtimeService]);

  useEffect(() => {
    service.connect(user, {
      onPresenceSync: (users) => setOnlineUsers(users),
      onEventReceived: (event) => setEvents((prev) => [event, ...prev].slice(0, 50)),
      onStatusChange: (status) => setIsStreaming(status),
    });

    return () => {
      service.disconnect();
    };
  }, [user, service]);

  const emitEvent = useCallback(async (event: Omit<OmniEvent, 'id' | 'timestamp'>) => {
    // 委託 Service 處理發送邏輯，並進行樂觀更新 (Optimistic UI Update)
    const newEvent = await service.emitEvent(event, user);
    setEvents((prev) => [newEvent, ...prev].slice(0, 50));
  }, [service, user]);

  return { events, isStreaming, onlineUsers, emitEvent };
}
