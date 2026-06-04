"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const OmniMemorySync_1 = require("./OmniMemorySync");
const event_store_1 = require("../../../lib/omni-space/event-store");
(0, vitest_1.describe)('OmniMemorySync Retry Mechanism', () => {
    let sync;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.useFakeTimers();
        sync = new OmniMemorySync_1.OmniMemorySync();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
        vitest_1.vi.restoreAllMocks();
        event_store_1.OmniEventStore.eventBus.removeAllListeners();
    });
    (0, vitest_1.it)('should retry 3 times and then fail when syncToVectorDB keeps failing', async () => {
        const mockEvent = {
            id: 'test-id',
            omni_card_uuid: 'card-uuid',
            event_type: 'UPDATE',
            payload: { uuid: 'card-uuid', name: 'Test Card', status: 'todo', abilities: [], attributes: [] },
            source_platform: 'test',
            created_at: Date.now(),
            hash_lock: 'hash'
        };
        // Use spyOn to mock the private syncToVectorDB method
        const syncSpy = vitest_1.vi.spyOn(sync, 'syncToVectorDB').mockRejectedValue(new Error('Sync failed'));
        const consoleErrorSpy = vitest_1.vi.spyOn(console, 'error').mockImplementation(() => { });
        const consoleLogSpy = vitest_1.vi.spyOn(console, 'log').mockImplementation(() => { });
        // Emit the event
        event_store_1.OmniEventStore.eventBus.emit('event_saved', mockEvent);
        // Initial attempt (happens immediately after event)
        // We need to wait for the first execution
        await vitest_1.vi.advanceTimersByTimeAsync(0);
        (0, vitest_1.expect)(syncSpy).toHaveBeenCalledTimes(1);
        // Second attempt (after 2s delay)
        await vitest_1.vi.advanceTimersByTimeAsync(2000);
        (0, vitest_1.expect)(syncSpy).toHaveBeenCalledTimes(2);
        // Third attempt (after 4s delay)
        await vitest_1.vi.advanceTimersByTimeAsync(4000);
        (0, vitest_1.expect)(syncSpy).toHaveBeenCalledTimes(3);
        (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Max retries reached'));
    });
    (0, vitest_1.it)('should succeed on the second attempt', async () => {
        const mockEvent = {
            id: 'test-id-2',
            omni_card_uuid: 'card-uuid-2',
            event_type: 'UPDATE',
            payload: { uuid: 'card-uuid-2', name: 'Test Card 2', status: 'todo', abilities: [], attributes: [] },
            source_platform: 'test',
            created_at: Date.now(),
            hash_lock: 'hash'
        };
        let attempts = 0;
        const syncSpy = vitest_1.vi.spyOn(sync, 'syncToVectorDB').mockImplementation(async () => {
            attempts++;
            if (attempts === 1)
                throw new Error('First attempt fails');
            return Promise.resolve();
        });
        const consoleLogSpy = vitest_1.vi.spyOn(console, 'log').mockImplementation(() => { });
        event_store_1.OmniEventStore.eventBus.emit('event_saved', mockEvent);
        // First attempt fails
        await vitest_1.vi.advanceTimersByTimeAsync(0);
        (0, vitest_1.expect)(syncSpy).toHaveBeenCalledTimes(1);
        // Second attempt succeeds (after 2s delay)
        await vitest_1.vi.advanceTimersByTimeAsync(2000);
        (0, vitest_1.expect)(syncSpy).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(consoleLogSpy).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Successfully synchronized event test-id-2 to VectorDB on attempt 2.'));
    });
});
//# sourceMappingURL=OmniMemorySync.test.js.map