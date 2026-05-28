import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface OmniEvent {
  id: string;
  type: 'TRACE' | 'COMPUTE' | 'SEAL' | 'MEMORY';
  payload: string;
  timestamp: string;
  integrity_hash?: string;
  user_email?: string;
}

export function useOmniRealtime() {
  const { user } = useAuth();
  const [events, setEvents] = useState<OmniEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase.channel('omni-resonance-room');

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState).flat();
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('[OmniRealtime] User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('[OmniRealtime] User left:', leftPresences);
      })
      .on('broadcast', { event: 'omni_event' }, ({ payload }) => {
        setEvents((prev) => [payload as OmniEvent, ...prev].slice(0, 50));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsStreaming(true);
          // 註冊在線狀態
          if (user) {
            await channel.track({
              user_id: user.uid,
              email: user.email,
              online_at: new Date().toISOString(),
            });
          } else {
            // Anonymous tracking for demo
            await channel.track({
              user_id: `anon_${Math.floor(Math.random()*1000)}`,
              email: 'Anonymous Commander',
              online_at: new Date().toISOString(),
            });
          }
        } else {
          setIsStreaming(false);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  // 廣播給所有在同頻道的節點
  const emitEvent = async (event: Omit<OmniEvent, 'id' | 'timestamp'>) => {
    const newEvent: OmniEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      user_email: user?.email || 'Anonymous Commander'
    };
    
    // Optimistic UI update
    setEvents((prev) => [newEvent, ...prev].slice(0, 50));

    // 廣播至 Realtime channel
    await supabase.channel('omni-resonance-room').send({
      type: 'broadcast',
      event: 'omni_event',
      payload: newEvent
    });

    // 寫入 NoCodeBackend (NCBDB) 遙測與證據追蹤
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
    } catch (error) {
      console.error('[OmniRealtime] Failed to sync telemetry to NCBDB:', error);
    }
  };

  return { events, isStreaming, onlineUsers, emitEvent };
}
