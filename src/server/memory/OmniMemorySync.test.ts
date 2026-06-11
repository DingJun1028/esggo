import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OmniMemorySync } from '@/src/server/memory/OmniMemorySync';
import { OmniEventStore } from '@/lib/omni-space/event-store';
import { OmniEvent } from '@/src/shared/types'; // Import OmniEvent

describe('OmniMemorySync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(OmniEventStore.eventBus, 'on');
    vi.spyOn(console, 'log');
  });

  it('should initialize and attach to event bus', () => {
    const sync = new OmniMemorySync();
    expect(sync).toBeDefined();
    expect(OmniEventStore.eventBus.on).toHaveBeenCalledWith('event_saved', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('[OmniMemorySync] Attached to Omni-Space event bus. Ready to encode episodic memories.');
  });

  it('should handle event saving', async () => {
    const sync = new OmniMemorySync();
    const mockEvent: OmniEvent = { // Type as OmniEvent
      id: 'test-event-id',
      omni_card_uuid: 'test-uuid', // Added missing required field
      event_type: 'TEST_EVENT',
      payload: { test: 'data' }, // Typed as Record<string, unknown> implicitly
      source_platform: 'test',
      created_at: Date.now(),
      hash_lock: 'test-hash',
    };
    
    // Mock the sync methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(sync as any, 'syncWithRetry').mockResolvedValue(undefined);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sync as any).handleEventSaved(mockEvent);
    expect(sync['syncWithRetry']).toHaveBeenCalled();
  });
});