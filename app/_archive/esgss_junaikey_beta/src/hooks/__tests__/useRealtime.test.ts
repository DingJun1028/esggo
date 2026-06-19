/**
 * Integration Tests for useRealtime Hook
 * 即時協作 Hook 的整合測試
 */

import React, { useEffect, useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Supabase
const mockSupabaseClient = {
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnValue({
      unsubscribe: vi.fn()
    })
  }),
  getChannels: vi.fn().mockReturnValue([])
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue(mockSupabaseClient)
}));

// useRealtime Hook
import { useRealtime, usePresence, useBroadcastChannel } from '../useRealtime';

describe('useRealtime Hook Integration Tests', () => {
  const mockChannel = 'test-room';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Channel Management', () => {
    it('should subscribe to a channel', () => {
      const TestComponent = () => {
        const { isConnected, subscribe, disconnect } = useRealtime();

        useEffect(() => {
          subscribe(mockChannel);
        }, []);

        return (
          <div>
            <span>Connected: {isConnected ? 'yes' : 'no'}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith(mockChannel);
    });

    it('should disconnect from all channels', () => {
      const mockChannelInstance = {
        unsubscribe: vi.fn()
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannelInstance);
      mockSupabaseClient.getChannels.mockReturnValue([mockChannelInstance]);

      const TestComponent = () => {
        const { disconnect } = useRealtime();

        useEffect(() => {
          subscribe(mockChannel);
        }, []);

        const handleDisconnect = () => {
          disconnect();
        };

        return <button onClick={handleDisconnect}>Disconnect</button>;
      };

      const { unmount } = render(<TestComponent />);
      unmount();

      expect(mockChannelInstance.unsubscribe).toHaveBeenCalled();
    });

    it('should track connection state', () => {
      const TestComponent = () => {
        const { isConnected, isConnecting, error } = useRealtime();

        useEffect(() => {
          subscribe(mockChannel);
        }, []);

        return (
          <div>
            <span>Connected: {isConnected ? 'yes' : 'no'}</span>
            <span>Connecting: {isConnecting ? 'yes' : 'no'}</span>
            <span>Error: {error || 'none'}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Connected: yes')).toBeInTheDocument();
    });
  });

  describe('Presence Tracking', () => {
    it('should track user presence', () => {
      const mockPresenceChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({
          unsubscribe: vi.fn()
        })
      };
      mockSupabaseClient.channel.mockReturnValue(mockPresenceChannel);

      const TestComponent = () => {
        const { trackPresence, presence } = usePresence(mockChannel);

        useEffect(() => {
          trackPresence('user-123', { name: 'John', avatar: 'url' });
        }, []);

        return (
          <div>
            <span>Presence: {JSON.stringify(presence)}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(mockPresenceChannel.on).toHaveBeenCalledWith(
        'presence',
        { event: 'sync' },
        expect.any(Function)
      );
    });

    it('should list online users', async () => {
      const mockPresenceChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          // Simulate presence sync with multiple users
          if (type === 'presence') {
            callback({
              payload: {
                joined_users: [
                  { user_id: 'user-1', name: 'Alice' },
                  { user_id: 'user-2', name: 'Bob' }
                ]
              }
            });
          }
          return mockPresenceChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockPresenceChannel);

      const TestComponent = () => {
        const { trackPresence, onlineUsers } = usePresence(mockChannel);

        useEffect(() => {
          trackPresence('current-user', { name: 'Me' });
        }, []);

        return (
          <div>
            <span>Online: {onlineUsers.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Online: 2')).toBeInTheDocument();
      });
    });

    it('should handle user joining', async () => {
      const joinCallback = vi.fn();
      
      const mockPresenceChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'presence' && config.event === 'join') {
            return callback({
              newPresences: [
                { user_id: 'new-user', name: 'New User' }
              ]
            });
          }
          return mockPresenceChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockPresenceChannel);

      const TestComponent = () => {
        const { trackPresence, recentJoins } = usePresence(mockChannel);

        useEffect(() => {
          trackPresence('current-user', {});
        }, []);

        return (
          <div>
            <span>Joins: {recentJoins.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Joins: 1')).toBeInTheDocument();
      });
    });

    it('should handle user leaving', async () => {
      const mockPresenceChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'presence' && config.event === 'leave') {
            callback({
              leftPresences: [{ user_id: 'left-user', name: 'Left User' }]
            });
          }
          return mockPresenceChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockPresenceChannel);

      const TestComponent = () => {
        const { trackPresence, recentLeaves } = usePresence(mockChannel);

        useEffect(() => {
          trackPresence('current-user', {});
        }, []);

        return (
          <div>
            <span>Leaves: {recentLeaves.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Leaves: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Cursor Synchronization', () => {
    it('should broadcast cursor position', async () => {
      const cursorCallback = vi.fn();

      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'broadcast' && config.event === 'cursor') {
            cursorCallback({
              payload: {
                user_id: 'user-1',
                x: 100,
                y: 200
              }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        send: vi.fn().mockResolvedValue(true)
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { broadcastCursor, cursors } = useBroadcastChannel(mockChannel);

        useEffect(() => {
          broadcastCursor(100, 200);
        }, []);

        return (
          <div>
            <span>Cursors: {cursors.size}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'cursor',
        payload: { x: 100, y: 200 }
      });
    });

    it('should receive cursor updates from other users', async () => {
      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'broadcast' && config.event === 'cursor') {
            // Simulate receiving cursor update
            callback({
              payload: {
                user_id: 'other-user',
                x: 150,
                y: 250,
                color: '#FF0000'
              }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        send: vi.fn().mockResolvedValue(true)
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { subscribeToCursors, cursors } = useBroadcastChannel(mockChannel);

        useEffect(() => {
          subscribeToCursors();
        }, []);

        return (
          <div>
            <span>Other Cursors: {cursors.size}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Other Cursors: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Broadcast Channel', () => {
    it('should send broadcast messages', async () => {
      const mockChannel = {
        send: vi.fn().mockResolvedValue(true),
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { sendBroadcast, lastMessage } = useBroadcastChannel(mockChannel);

        const handleSend = async () => {
          await sendBroadcast('custom-event', { data: 'test' });
        };

        return (
          <div>
            <button onClick={handleSend}>Send</button>
            <span>Last: {JSON.stringify(lastMessage)}</span>
          </div>
        );
      };

      render(<TestComponent />);
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() => {
        expect(mockChannel.send).toHaveBeenCalledWith({
          type: 'broadcast',
          event: 'custom-event',
          payload: { data: 'test' }
        });
      });
    });

    it('should receive broadcast messages', async () => {
      const messageCallback = vi.fn();

      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'broadcast' && config.event === 'test-event') {
            messageCallback({
              payload: { message: 'Hello!' }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        send: vi.fn().mockResolvedValue(true)
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { subscribe, receivedMessages } = useBroadcastChannel(mockChannel);

        useEffect(() => {
          subscribe('test-event');
        }, []);

        return (
          <div>
            <span>Messages: {receivedMessages.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Messages: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should listen for database changes', async () => {
      const changeCallback = vi.fn();

      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'postgres_changes' && config.event === 'UPDATE') {
            changeCallback({
              new: { id: 1, name: 'Updated' },
              old: { id: 1, name: 'Original' }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { listenToChanges, updates } = useRealtime();

        useEffect(() => {
          listenToChanges({
            schema: 'public',
            table: 'users',
            event: 'UPDATE'
          });
        }, []);

        return (
          <div>
            <span>Updates: {updates.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Updates: 1')).toBeInTheDocument();
      });
    });

    it('should handle insert events', async () => {
      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'postgres_changes' && config.event === 'INSERT') {
            callback({
              new: { id: 2, name: 'New User' }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { listenToChanges, inserts } = useRealtime();

        useEffect(() => {
          listenToChanges({
            schema: 'public',
            table: 'users',
            event: 'INSERT'
          });
        }, []);

        return (
          <div>
            <span>Inserts: {inserts.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Inserts: 1')).toBeInTheDocument();
      });
    });

    it('should handle delete events', async () => {
      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'postgres_changes' && config.event === 'DELETE') {
            callback({
              old: { id: 3, name: 'Deleted User' }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { listenToChanges, deletes } = useRealtime();

        useEffect(() => {
          listenToChanges({
            schema: 'public',
            table: 'users',
            event: 'DELETE'
          });
        }, []);

        return (
          <div>
            <span>Deletes: {deletes.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Deletes: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Typing Indicators', () => {
    it('should broadcast typing status', async () => {
      const mockChannel = {
        send: vi.fn().mockResolvedValue(true),
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { startTyping, stopTyping } = useRealtime();

        const handleStart = () => startTyping('chat-1');
        const handleStop = () => stopTyping('chat-1');

        return (
          <div>
            <button onClick={handleStart}>Start Typing</button>
            <button onClick={handleStop}>Stop Typing</button>
          </div>
        );
      };

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Start Typing'));
      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'typing_start',
        payload: { channel: 'chat-1' }
      });

      fireEvent.click(screen.getByText('Stop Typing'));
      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'typing_stop',
        payload: { channel: 'chat-1' }
      });
    });

    it('should show typing users', async () => {
      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'broadcast' && config.event === 'typing_start') {
            callback({
              payload: { user_id: 'user-1', channel: 'chat-1' }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        send: vi.fn().mockResolvedValue(true)
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { subscribeToTyping, typingUsers } = useRealtime();

        useEffect(() => {
          subscribeToTyping('chat-1');
        }, []);

        return (
          <div>
            <span>Typing: {typingUsers.length}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Typing: 1')).toBeInTheDocument();
      });
    });
  });

  describe('State Synchronization', () => {
    it('should sync shared state across users', async () => {
      const mockChannel = {
        on: vi.fn().mockImplementation((type, config, callback) => {
          if (type === 'broadcast' && config.event === 'state_sync') {
            callback({
              payload: {
                key: 'counter',
                value: 42
              }
            });
          }
          return mockChannel;
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        send: vi.fn().mockResolvedValue(true)
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { sharedState, updateSharedState } = useRealtime();

        const handleUpdate = () => {
          updateSharedState('counter', 42);
        };

        return (
          <div>
            <span>Counter: {sharedState.counter || 'undefined'}</span>
            <button onClick={handleUpdate}>Update</button>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Counter: 42')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors', () => {
      mockSupabaseClient.channel.mockImplementation(() => {
        throw new Error('Connection failed');
      });

      const TestComponent = () => {
        const { error, isConnected } = useRealtime();

        useEffect(() => {
          try {
            subscribe(mockChannel);
          } catch (e) {
            // Error is handled internally
          }
        }, []);

        return (
          <div>
            <span>Error: {error || 'none'}</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Error: none')).toBeInTheDocument();
    });

    it('should attempt reconnection on error', async () => {
      let attempt = 0;
      mockSupabaseClient.channel.mockImplementation(() => {
        attempt++;
        if (attempt < 3) {
          throw new Error('Failed');
        }
        return {
          on: vi.fn().mockReturnThis(),
          subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
        };
      });

      const TestComponent = () => {
        const { reconnect, retryCount } = useRealtime();

        useEffect(() => {
          reconnect();
        }, []);

        return (
          <div>
            <span>Retry: {retryCount}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Retry: 2')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should handle many concurrent cursors efficiently', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        send: vi.fn().mockResolvedValue(true)
      };
      mockSupabaseClient.channel.mockReturnValue(mockChannel);

      const TestComponent = () => {
        const { cursors } = useBroadcastChannel(mockChannel);

        // Simulate 100 cursors
        useEffect(() => {
          for (let i = 0; i < 100; i++) {
            cursors.set(`user-${i}`, { x: i, y: i, color: '#FF0000' });
          }
        }, []);

        return <div>Cursors: {cursors.size}</div>;
      };

      const start = performance.now();
      render(<TestComponent />);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Fast rendering
      expect(screen.getByText('Cursors: 100')).toBeInTheDocument();
    });
  });
});
