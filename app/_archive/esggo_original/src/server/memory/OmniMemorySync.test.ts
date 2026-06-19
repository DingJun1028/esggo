import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OmniMemorySync } from './OmniMemorySync';
import { OmniEventStore } from '../../../lib/omni-space/event-store';
import { OmniEvent } from '../../../types/omni-card';

describe('OmniMemorySync Retry Mechanism', () => {
  let sync: OmniMemorySync;

  beforeEach(() => {
    vi.useFakeTimers();
    sync = new OmniMemorySync();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    OmniEventStore.eventBus.removeAllListeners();
  });

  it('should retry 3 times and then fail when syncToVectorDB keeps failing', async () => {
    const mockEvent: OmniEvent = {
      id: 'test-id',
      omni_card_uuid: 'card-uuid',
      event_type: 'UPDATE',
      payload: { uuid: 'card-uuid', name: 'Test Card', status: 'todo', abilities: [], attributes: [] } as any,
      source_platform: 'test',
      created_at: Date.now(),
      hash_lock: 'hash'
    };

    // Use spyOn to mock the private syncToVectorDB method
    const syncSpy = vi.spyOn(sync as any, 'syncToVectorDB').mockRejectedValue(new Error('Sync failed'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Emit the event
    OmniEventStore.eventBus.emit('event_saved', mockEvent);

    // Initial attempt (happens immediately after event)
    // We need to wait for the first execution
    await vi.advanceTimersByTimeAsync(0); 
    expect(syncSpy).toHaveBeenCalledTimes(1);

    // Second attempt (after 2s delay)
    await vi.advanceTimersByTimeAsync(2000);
    expect(syncSpy).toHaveBeenCalledTimes(2);

    // Third attempt (after 4s delay)
    await vi.advanceTimersByTimeAsync(4000);
    expect(syncSpy).toHaveBeenCalledTimes(3);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Max retries reached'));
  });

  it('should succeed on the second attempt', async () => {
    const mockEvent: OmniEvent = {
      id: 'test-id-2',
      omni_card_uuid: 'card-uuid-2',
      event_type: 'UPDATE',
      payload: { uuid: 'card-uuid-2', name: 'Test Card 2', status: 'todo', abilities: [], attributes: [] } as any,
      source_platform: 'test',
      created_at: Date.now(),
      hash_lock: 'hash'
    };

    let attempts = 0;
    const syncSpy = vi.spyOn(sync as any, 'syncToVectorDB').mockImplementation(async () => {
      attempts++;
      if (attempts === 1) throw new Error('First attempt fails');
      return Promise.resolve();
    });

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    OmniEventStore.eventBus.emit('event_saved', mockEvent);

    // First attempt fails
    await vi.advanceTimersByTimeAsync(0);
    expect(syncSpy).toHaveBeenCalledTimes(1);

    // Second attempt succeeds (after 2s delay)
    await vi.advanceTimersByTimeAsync(2000);
    expect(syncSpy).toHaveBeenCalledTimes(2);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Successfully synchronized event test-id-2 to Cognitive Memory on attempt 2.'));
  });
});
