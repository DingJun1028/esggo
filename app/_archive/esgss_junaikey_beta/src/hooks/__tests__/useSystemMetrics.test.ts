import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSystemMetrics } from '../useSystemMetrics';
import { junAiKeyClient } from '../../services/api/JunAiKey.Client';

// Mock junAiKeyClient
vi.mock('../../services/api/JunAiKey.Client', () => ({
  junAiKeyClient: {
    getMetrics: vi.fn(),
  },
}));

describe('useSystemMetrics Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch metrics on mount', async () => {
    const mockMetrics = {
      latency: 10,
      throughput: 1.5,
      aiStatus: 'active',
      boostSpaceStatus: 'idle',
      activeNodes: 5,
      cacheHitRate: 85,
    };
    (junAiKeyClient.getMetrics as any).mockResolvedValue(mockMetrics);

    const { result } = renderHook(() => useSystemMetrics(5000));

    // Wait for the initial fetch to complete
    await act(async () => {
        // Run timers to trigger the effect and promise resolution
        await vi.advanceTimersByTimeAsync(100);
    });

    expect(result.current.latency).toBe(10);
    expect(result.current.isLoading).toBe(false);
    expect(junAiKeyClient.getMetrics).toHaveBeenCalledTimes(1);
  });

  it('should NOT toggle isLoading on background refresh (Optimization Check)', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    const initialMetrics = { latency: 10, throughput: 1 };
    const secondMetrics = { latency: 20, throughput: 2 };

    // First call returns immediately
    (junAiKeyClient.getMetrics as any)
      .mockResolvedValueOnce(initialMetrics)
      // Second call returns a pending promise
      .mockReturnValueOnce(pendingPromise);

    const { result } = renderHook(() => useSystemMetrics(5000));

    // Wait for initial load
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(result.current.latency).toBe(10);
    expect(result.current.isLoading).toBe(false);

    // Advance time to trigger background refresh
    // We expect the hook to call getMetrics again
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(junAiKeyClient.getMetrics).toHaveBeenCalledTimes(2);

    // THIS IS THE KEY ASSERTION:
    // With current code, isLoading will be TRUE here.
    // The test expects FALSE, so it will FAIL until we apply the fix.
    expect(result.current.isLoading).toBe(false);

    // Resolve the promise to finish the cycle
    await act(async () => {
      resolvePromise(secondMetrics);
    });

    expect(result.current.latency).toBe(20);
    expect(result.current.isLoading).toBe(false);
  });
});
