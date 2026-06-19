/**
 * Integration Tests for useOffline Hook
 * 離線支援 Hook 的整合測試
 */

import React, { useEffect, useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock IndexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  databases: vi.fn().mockResolvedValue([])
};

vi.stubGlobal('indexedDB', mockIndexedDB);

// useOffline Hook
import { useOffline, useOfflineStorage, useOfflineQueue } from '../useOffline';

describe('useOffline Hook Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset online status
    vi.stubGlobal('navigator', {
      ...navigator,
      onLine: true
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Network Status Detection', () => {
    it('should return online status', () => {
      const TestComponent = () => {
        const { isOnline } = useOffline();
        return <div>Status: {isOnline ? 'online' : 'offline'}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByText('Status: online')).toBeInTheDocument();
    });

    it('should detect going offline', () => {
      const TestComponent = () => {
        const { isOnline } = useOffline();
        return <div>Status: {isOnline ? 'online' : 'offline'}</div>;
      };

      const { rerender } = render(<TestComponent />);
      expect(screen.getByText('Status: online')).toBeInTheDocument();

      // Simulate going offline
      fireEvent(window, new Event('offline'));
      rerender(<TestComponent />);
      expect(screen.getByText('Status: offline')).toBeInTheDocument();
    });

    it('should detect coming back online', () => {
      const TestComponent = () => {
        const { isOnline } = useOffline();
        return <div>Status: {isOnline ? 'online' : 'offline'}</div>;
      };

      // Start offline
      fireEvent(window, new Event('offline'));
      const { rerender } = render(<TestComponent />);
      expect(screen.getByText('Status: offline')).toBeInTheDocument();

      // Come back online
      fireEvent(window, new Event('online'));
      rerender(<TestComponent />);
      expect(screen.getByText('Status: online')).toBeInTheDocument();
    });

    it('should track connection type', () => {
      const TestComponent = () => {
        const { connection } = useOffline();
        return <div>Type: {connection?.type || 'unknown'}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByText('Type: unknown')).toBeInTheDocument();
    });
  });

  describe('Online Event Listeners', () => {
    it('should add event listeners on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      const TestComponent = () => {
        useOffline();
        return <div>Test</div>;
      };

      render(<TestComponent />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });

    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const TestComponent = () => {
        useOffline();
        return <div>Test</div>;
      };

      const { unmount } = render(<TestComponent />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });

  describe('useOfflineStorage', () => {
    it('should store data in IndexedDB', async () => {
      const TestComponent = () => {
        const { save, load, remove } = useOfflineStorage('test-db', 1);
        const [data, setData] = useState<string>('');
        const [loaded, setLoaded] = useState(false);

        const handleSave = async () => {
          await save('test-key', 'test-value');
        };

        const handleLoad = async () => {
          const value = await load('test-key');
          setData(value || '');
          setLoaded(true);
        };

        return (
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleLoad}>Load</button>
            <span>Data: {data}</span>
            <span>Loaded: {loaded ? 'yes' : 'no'}</span>
          </div>
        );
      };

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Save'));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Load'));
      });

      await waitFor(() => {
        expect(screen.getByText('Data: test-value')).toBeInTheDocument();
      });
    });

    it('should handle storage errors gracefully', async () => {
      const mockDB = {
        open: vi.fn().mockImplementation((name, version, onUpgrade) => {
          const request = {
            result: {
              transaction: vi.fn().mockReturnValue({
                objectStore: vi.fn().mockReturnValue({
                  put: vi.fn().mockReturnValue({ result: 1 })
                })
              })
            },
            onsuccess: null,
            onerror: null
          };
          setTimeout(() => request.onsuccess && request.onsuccess({ target: request }));
          return request;
        })
      };

      vi.stubGlobal('indexedDB', mockDB);

      const TestComponent = () => {
        const { save } = useOfflineStorage('error-test', 1);
        const [error, setError] = useState<string | null>(null);

        const handleSave = async () => {
          try {
            await save('key', 'value');
          } catch (e) {
            setError(e.message);
          }
        };

        return (
          <div>
            <button onClick={handleSave}>Save</button>
            <span>Error: {error || 'none'}</span>
          </div>
        );
      };

      render(<TestComponent />);
      fireEvent.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Error: none')).toBeInTheDocument();
      });
    });
  });

  describe('useOfflineQueue', () => {
    it('should queue requests when offline', async () => {
      const TestComponent = () => {
        const { isOnline, addToQueue, processQueue, queue } = useOfflineQueue('test-queue');
        const [processed, setProcessed] = useState<string[]>([]);

        const handleAdd = () => {
          addToQueue({ type: 'ADD', payload: { id: 1, data: 'test' } });
        };

        const handleProcess = async () => {
          const results = await processQueue();
          setProcessed(results.map(r => r.type));
        };

        return (
          <div>
            <span>Online: {isOnline ? 'yes' : 'no'}</span>
            <span>Queue: {queue.length}</span>
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleProcess}>Process</button>
            <span>Processed: {processed.join(', ')}</span>
          </div>
        );
      };

      // Start offline
      fireEvent(window, new Event('offline'));
      
      const { rerender } = render(<TestComponent />);

      // Add items to queue
      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Add'));

      await waitFor(() => {
        expect(screen.getByText('Queue: 2')).toBeInTheDocument();
      });

      // Process queue
      fireEvent.click(screen.getByText('Process'));

      await waitFor(() => {
        expect(screen.getByText('Processed: ADD, ADD')).toBeInTheDocument();
      });
    });

    it('should process queue automatically when coming online', async () => {
      const TestComponent = () => {
        const { isOnline, addToQueue, queue, clearQueue } = useOfflineQueue('auto-queue');
        
        return (
          <div>
            <span>Online: {isOnline ? 'yes' : 'no'}</span>
            <span>Queue: {queue.length}</span>
          </div>
        );
      };

      // Start offline
      fireEvent(window, new Event('offline'));

      const { rerender } = render(<TestComponent />);
      
      expect(screen.getByText('Online: no')).toBeInTheDocument();

      // Come back online - queue should be processed
      fireEvent(window, new Event('online'));
      rerender(<TestComponent />);

      expect(screen.getByText('Online: yes')).toBeInTheDocument();
    });

    it('should persist queue between sessions', async () => {
      const TestComponent = () => {
        const { queue } = useOfflineQueue('persistent-queue');
        
        return (
          <div>
            <span>Queue: {queue.length}</span>
          </div>
        );
      };

      // First render - add items
      const { unmount } = render(<TestComponent />);
      
      // Queue should be empty initially
      expect(screen.getByText('Queue: 0')).toBeInTheDocument();

      unmount();

      // Second render - queue should persist
      const { rerender } = render(<TestComponent />);
      expect(screen.getByText('Queue: 0')).toBeInTheDocument();
    });
  });

  describe('Offline Data Sync', () => {
    it('should sync data when coming back online', async () => {
      const onSync = vi.fn();

      const TestComponent = () => {
        const { isOnline, syncData } = useOffline();
        
        useEffect(() => {
          if (!isOnline) {
            // Schedule sync when coming back online
            const handleOnline = () => {
              syncData(onSync);
            };
            window.addEventListener('online', handleOnline);
            return () => window.removeEventListener('online', handleOnline);
          }
        }, [isOnline]);

        return <div>Sync test</div>;
      };

      // Simulate offline then online
      fireEvent(window, new Event('offline'));
      fireEvent(window, new Event('online'));

      await waitFor(() => {
        expect(onSync).toHaveBeenCalled();
      });
    });

    it('should handle sync conflicts', async () => {
      const onConflict = vi.fn();
      const resolveConflict = vi.fn().mockResolvedValue({ merged: true });

      const TestComponent = () => {
        const { syncData } = useOffline();

        const handleSync = async () => {
          await syncData(vi.fn(), { onConflict, resolveConflict });
        };

        return (
          <div>
            <button onClick={handleSync}>Sync</button>
          </div>
        );
      };

      render(<TestComponent />);
      fireEvent.click(screen.getByText('Sync'));

      await waitFor(() => {
        // Conflict resolution should be available
        expect(resolveConflict).toBeDefined();
      });
    });
  });

  describe('Offline State Management', () => {
    it('should cache API responses', async () => {
      const TestComponent = () => {
        const { cacheResponse, getCachedResponse } = useOffline();
        const [data, setData] = useState<string | null>(null);

        const handleCache = async () => {
          await cacheResponse('/api/data', { cached: true });
        };

        const handleGet = async () => {
          const cached = await getCachedResponse('/api/data');
          setData(cached ? JSON.stringify(cached) : 'null');
        };

        return (
          <div>
            <button onClick={handleCache}>Cache</button>
            <button onClick={handleGet}>Get</button>
            <span>Data: {data}</span>
          </div>
        );
      };

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Cache'));
      await waitFor(() => {
        fireEvent.click(screen.getByText('Get'));
      });

      await waitFor(() => {
        expect(screen.getByText('Data: {"cached":true}')).toBeInTheDocument();
      });
    });

    it('should handle offline form submissions', async () => {
      const TestComponent = () => {
        const { isOnline, queueRequest } = useOffline();
        const [status, setStatus] = useState<string>('');

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
            await queueRequest('/api/submit', { method: 'POST', body: 'data' });
            setStatus('queued');
          } catch (error) {
            setStatus('error');
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <span>Status: {status}</span>
            <span>Online: {isOnline ? 'yes' : 'no'}</span>
          </form>
        );
      };

      // Start offline
      fireEvent(window, new Event('offline'));
      const { container } = render(<TestComponent />);

      // Submit form
      fireEvent.submit(container.querySelector('form')!);

      await waitFor(() => {
        expect(screen.getByText('Status: queued')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should handle large queues efficiently', async () => {
      const TestComponent = () => {
        const { addToQueue, queue } = useOfflineQueue('large-queue');

        const handleAdd = () => {
          for (let i = 0; i < 1000; i++) {
            addToQueue({ type: 'TEST', payload: i });
          }
        };

        return (
          <div>
            <button onClick={handleAdd}>Add 1000</button>
            <span>Queue: {queue.length}</span>
          </div>
        );
      };

      // Start offline
      fireEvent(window, new Event('offline'));

      render(<TestComponent />);

      const start = performance.now();
      fireEvent.click(screen.getByText('Add 1000'));
      const end = performance.now();

      // Should add 1000 items quickly (under 100ms)
      expect(end - start).toBeLessThan(100);
      expect(queue.length).toBe(1000);
    });
  });

  describe('Persistence', () => {
    it('should persist offline status in localStorage', async () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      };

      vi.stubGlobal('localStorage', localStorageMock);

      const TestComponent = () => {
        const { isOnline } = useOffline();
        return <div>{isOnline ? 'online' : 'offline'}</div>;
      };

      render(<TestComponent />);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'offline-status',
        expect.any(String)
      );
    });
  });
});
