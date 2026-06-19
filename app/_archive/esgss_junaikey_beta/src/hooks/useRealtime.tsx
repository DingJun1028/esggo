/**
 * 🔄 Realtime Hook - 即時協作
 * 支援用戶存在追蹤、游標同步、即時資料更新
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// ==================== 類型定義 ====================

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: {
    x: number;
    y: number;
  };
  selection?: {
    start: number;
    end: number;
  };
  lastSeen: number;
  isActive: boolean;
}

export interface RealtimeChannel {
  id: string;
  name: string;
  type: 'room' | 'document' | 'board' | 'chat';
  collaborators: Collaborator[];
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export interface RealtimeState {
  channels: Record<string, RealtimeChannel>;
  currentChannel: string | null;
  collaborators: Collaborator[];
  
  // Channel 操作
  joinChannel: (channelId: string, type: RealtimeChannel['type'], channelName: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
  setCurrentChannel: (channelId: string | null) => void;
  
  // Presence 操作
  updatePresence: (data: Partial<Collaborator>) => Promise<void>;
  updateCursor: (position: { x: number; y: number }) => Promise<void>;
  updateSelection: (selection: { start: number; end: number }) => Promise<void>;
  
  // Broadcast
  broadcast: (event: string, payload: unknown) => Promise<void>;
  
  // 狀態
  setConnectionStatus: (channelId: string, status: RealtimeChannel['connectionStatus']) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (collaboratorId: string) => void;
  updateCollaborator: (collaboratorId: string, data: Partial<Collaborator>) => void;
}

// ==================== 顏色生成 ====================

const COLLABORATOR_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
];

const getRandomColor = () => COLLABORATOR_COLORS[Math.floor(Math.random() * COLLABORATOR_COLORS.length)];

// ==================== Zustand Store ====================

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  channels: {},
  currentChannel: null,
  collaborators: [],

  joinChannel: async (channelId, type, channelName) => {
    const existingChannel = get().channels[channelId];
    if (existingChannel?.isConnected) {
      return;
    }

    // 建立新 channel
    const newChannel: RealtimeChannel = {
      id: channelId,
      name: channelName,
      type,
      collaborators: [],
      isConnected: false,
      connectionStatus: 'connecting',
    };

    set((state) => ({
      channels: { ...state.channels, [channelId]: newChannel },
      currentChannel: channelId,
    }));

    try {
      // 監聽 presence 變化
      const channel = supabase.channel(`realtime:${channelId}`, {
        config: {
          presence: { key: channelId },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const collaborators: Collaborator[] = [];

          Object.entries(state).forEach(([key, presences]) => {
            (presences as unknown[]).forEach((presence: unknown) => {
              const p = presence as Collaborator;
              if (p.id) {
                collaborators.push({
                  ...p,
                  color: p.color || getRandomColor(),
                });
              }
            });
          });

          set((state) => ({
            channels: {
              ...state.channels,
              [channelId]: {
                ...state.channels[channelId],
                collaborators,
              },
            },
            collaborators,
          }));
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          newPresences.forEach((presence: unknown) => {
            const p = presence as Collaborator;
            get().addCollaborator({
              ...p,
              color: p.color || getRandomColor(),
              isActive: true,
            });
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          leftPresences.forEach((presence: unknown) => {
            const p = presence as Collaborator;
            get().removeCollaborator(p.id);
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // 追蹤自己的 presence
            await channel.track({
              id: 'current-user',
              name: 'Current User',
              color: getRandomColor(),
              lastSeen: Date.now(),
              isActive: true,
            });

            set((state) => ({
              channels: {
                ...state.channels,
                [channelId]: {
                  ...state.channels[channelId],
                  isConnected: true,
                  connectionStatus: 'connected',
                },
              },
            }));
          } else if (status === 'CLOSED' || status === 'TIMED_OUT') {
            set((state) => ({
              channels: {
                ...state.channels,
                [channelId]: {
                  ...state.channels[channelId],
                  isConnected: false,
                  connectionStatus: 'disconnected',
                },
              },
            }));
          }
        });

      // 儲存 channel 參考
      set((state) => ({
        channels: {
          ...state.channels,
          [channelId]: {
            ...state.channels[channelId],
            channel,
          },
        },
      }));
    } catch (error) {
      console.error('Failed to join channel:', error);
      set((state) => ({
        channels: {
          ...state.channels,
          [channelId]: {
            ...state.channels[channelId],
            connectionStatus: 'error',
          },
        },
      }));
    }
  },

  leaveChannel: async (channelId) => {
    const channel = get().channels[channelId];
    if (channel?.channel) {
      await channel.untrack();
      await supabase.removeChannel(channel.channel);
    }

    set((state) => {
      const { [channelId]: _, ...remainingChannels } = state.channels;
      return {
        channels: remainingChannels,
        currentChannel: state.currentChannel === channelId ? null : state.currentChannel,
        collaborators: state.collaborators.filter((c) => !c.id.startsWith(channelId)),
      };
    });
  },

  setCurrentChannel: (channelId) => {
    set({ currentChannel: channelId });
  },

  updatePresence: async (data) => {
    const { currentChannel, channels } = get();
    if (!currentChannel) return;

    const channel = channels[currentChannel]?.channel;
    if (channel) {
      await channel.track({
        ...data,
        lastSeen: Date.now(),
      });
    }
  },

  updateCursor: async (position) => {
    const { currentChannel, channels } = get();
    if (!currentChannel) return;

    const channel = channels[currentChannel]?.channel;
    if (channel) {
      await channel.track({
        cursor: position,
        lastSeen: Date.now(),
      });
    }
  },

  updateSelection: async (selection) => {
    const { currentChannel, channels } = get();
    if (!currentChannel) return;

    const channel = channels[currentChannel]?.channel;
    if (channel) {
      await channel.track({
        selection,
        lastSeen: Date.now(),
      });
    }
  },

  broadcast: async (event, payload) => {
    const { currentChannel, channels } = get();
    if (!currentChannel) return;

    const channel = channels[currentChannel]?.channel;
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
  },

  setConnectionStatus: (channelId, status) => {
    set((state) => ({
      channels: {
        ...state.channels,
        [channelId]: {
          ...state.channels[channelId],
          connectionStatus: status,
        },
      },
    }));
  },

  addCollaborator: (collaborator) => {
    set((state) => {
      const exists = state.collaborators.some((c) => c.id === collaborator.id);
      if (exists) {
        return {
          collaborators: state.collaborators.map((c) =>
            c.id === collaborator.id ? { ...c, ...collaborator } : c
          ),
        };
      }
      return {
        collaborators: [...state.collaborators, collaborator],
      };
    });
  },

  removeCollaborator: (collaboratorId) => {
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== collaboratorId),
    }));
  },

  updateCollaborator: (collaboratorId, data) => {
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === collaboratorId ? { ...c, ...data } : c
      ),
    }));
  },
}));

// ==================== Realtime Hook ====================

export interface UseRealtimeOptions {
  /** Channel ID */
  channelId: string;
  /** Channel Type */
  channelType: RealtimeChannel['type'];
  /** Channel Name */
  channelName: string;
  /** Auto connect */
  autoConnect?: boolean;
  /** User info */
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

export function useRealtime(options: UseRealtimeOptions) {
  const {
    channelId,
    channelType,
    channelName,
    autoConnect = true,
    userId,
    userName,
    userAvatar,
  } = options;

  const {
    isConnected,
    connectionStatus,
    collaborators,
    joinChannel,
    leaveChannel,
    updateCursor,
    updateSelection,
    updatePresence,
    broadcast,
  } = useRealtimeChannel(channelId);

  const { isOnline } = useRealtimeOnline();

  // 連線
  useEffect(() => {
    if (autoConnect && channelId && isOnline) {
      joinChannel(channelId, channelType, channelName);

      return () => {
        leaveChannel(channelId);
      };
    }
  }, [autoConnect, channelId, channelType, channelName, isOnline, joinChannel, leaveChannel]);

  // 更新 presence
  useEffect(() => {
    if (isConnected && userId) {
      updatePresence({
        id: userId,
        name: userName || 'Anonymous',
        avatar: userAvatar,
      });
    }
  }, [isConnected, userId, userName, userAvatar, updatePresence]);

  return {
    isConnected,
    connectionStatus,
    collaborators,
    collaboratorsCount: collaborators.length,
    updateCursor,
    updateSelection,
    updatePresence,
    broadcast,
  };
}

// ==================== Channel Hook ====================

export function useRealtimeChannel(channelId: string) {
  const {
    channels,
    joinChannel,
    leaveChannel,
    updateCursor,
    updateSelection,
    updatePresence,
    broadcast,
  } = useRealtimeStore();

  const channel = channels[channelId];
  const isConnected = channel?.isConnected || false;
  const connectionStatus = channel?.connectionStatus || 'disconnected';
  const collaborators = channel?.collaborators || [];

  return {
    isConnected,
    connectionStatus,
    collaborators,
    joinChannel: useCallback(
      (type: RealtimeChannel['type'], channelName: string) =>
        joinChannel(channelId, type, channelName),
      [channelId, joinChannel]
    ),
    leaveChannel: useCallback(() => leaveChannel(channelId), [channelId, leaveChannel]),
    updateCursor,
    updateSelection,
    updatePresence,
    broadcast,
  };
}

// ==================== Online Status Hook ====================

export function useRealtimeOnline() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}

// ==================== Cursor Tracking Hook ====================

export function useCursorTracking(containerRef: React.RefObject<HTMLElement>) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { updateCursor } = useRealtimeStore();
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPosition({ x, y });

      // 節流更新
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        updateCursor({ x, y });
        throttleRef.current = null;
      }, 50);
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [containerRef, updateCursor]);

  return { cursorPosition };
}

// ==================== Broadcast Hook ====================

export function useBroadcast(channelId: string, eventName: string) {
  const { broadcast } = useRealtimeStore();

  const send = useCallback(
    (payload: unknown) => {
      broadcast(`${channelId}:${eventName}`, payload);
    },
    [channelId, eventName, broadcast]
  );

  return { send };
}

// ==================== Presence Hook ====================

export function usePresence(channelId: string) {
  const { collaborators } = useRealtimeChannel(channelId);

  const activeCollaborators = useMemo(
    () => collaborators.filter((c) => c.isActive),
    [collaborators]
  );

  const inactiveCollaborators = useMemo(
    () => collaborators.filter((c) => !c.isActive),
    [collaborators]
  );

  const collaboratorsById = useMemo(
    () => Object.fromEntries(collaborators.map((c) => [c.id, c])),
    [collaborators]
  );

  return {
    collaborators,
    activeCollaborators,
    inactiveCollaborators,
    collaboratorsById,
    getCollaborator: (id: string) => collaboratorsById[id],
    isUserActive: (id: string) => collaboratorsById[id]?.isActive || false,
  };
}

// ==================== 即時協作指示器 ====================

export const RealtimeIndicator: React.FC<{ channelId: string }> = ({ channelId }) => {
  const { isConnected, connectionStatus, collaborators } = useRealtimeChannel(channelId);

  if (!isConnected) return null;

  return (
    <div className="flex items-center gap-2">
      {/* 連線狀態指示器 */}
      <div
        className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected'
            ? 'bg-green-500'
            : connectionStatus === 'connecting'
              ? 'bg-yellow-500 animate-pulse'
              : 'bg-red-500'
        }`}
      />

      {/* 協作者頭像 */}
      {collaborators.length > 0 && (
        <div className="flex -space-x-2">
          {collaborators.slice(0, 5).map((collaborator) => (
            <div
              key={collaborator.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: collaborator.color }}
              title={collaborator.name}
            >
              {collaborator.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {collaborators.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
              +{collaborators.length - 5}
            </div>
          )}
        </div>
      )}

      {/* 在線人數 */}
      <span className="text-sm text-gray-500">
        {collaborators.length} 人在線
      </span>
    </div>
  );
};

export default useRealtime;
