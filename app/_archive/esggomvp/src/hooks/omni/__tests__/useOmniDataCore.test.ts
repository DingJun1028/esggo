import { describe, expect, it, jest, beforeEach, afterEach, mock } from 'bun:test';
import { useOmniDataCore } from '../useOmniDataCore';

// Manual hook execution wrapper for testing without @testing-library/react
function renderHook(hookFn: () => any) {
  let result: any = { current: null };
  result.current = hookFn();
  return { result };
}

// Mock the react imports used in the hook
mock.module('react', () => ({
  useState: (initial: any) => [initial, mock()],
  useCallback: (fn: any, deps: any) => fn,
}));

// Mock the store
const mockUpdateDraftNodeData = mock();
const mockAddDraftNode = mock();
const mockSealNode = mock();
const mockRemoveDraftNode = mock();

mock.module('../../../store/omni/orchestrator', () => ({
  useOmniStore: () => ({
    draftNodes: [],
    sealedNodes: [],
    addDraftNode: mockAddDraftNode,
    updateDraftNodeData: mockUpdateDraftNodeData,
    sealNode: mockSealNode,
    removeDraftNode: mockRemoveDraftNode
  })
}));

// Mock createGenesisNode
mock.module('../../../utils/omni/trust-guard', () => ({
  createGenesisNode: mock((data: any, ref: any, method: any, creator: any) => ({
    uuid: 'test-uuid-123',
    version: '1.0.0',
    timestamp: 1234567890,
    evidence: { origin_id: ref, origin_hash: 'hash', extraction_method: method },
    lifecycle_events: [],
    data,
    isFrozen: false
  }))
}));

describe('useOmniDataCore', () => {
  let consoleErrorMock: any;

  beforeEach(() => {
    mockUpdateDraftNodeData.mockClear();
    mockAddDraftNode.mockClear();
    mockSealNode.mockClear();
    mockRemoveDraftNode.mockClear();

    consoleErrorMock = mock();
    console.error = consoleErrorMock;
  });

  describe('saveDraft', () => {
    it('should return true when updateDraftNodeData succeeds', () => {
      mockUpdateDraftNodeData.mockImplementation(() => { }); // Success case

      const { result } = renderHook(() => useOmniDataCore());

      const success = result.current.saveDraft('test-uuid-123', { field: 'value' });

      expect(mockUpdateDraftNodeData).toHaveBeenCalledWith(
        'test-uuid-123',
        { field: 'value' },
        'SYSTEM_AGENT',
        'Auto-Save'
      );
      expect(success).toBe(true);
      expect(consoleErrorMock).not.toHaveBeenCalled();
    });

    it('should return false and log error when updateDraftNodeData throws', () => {
      const testError = new Error('Database connection failed');
      mockUpdateDraftNodeData.mockImplementation(() => {
        throw testError;
      });

      const { result } = renderHook(() => useOmniDataCore());

      const success = result.current.saveDraft('test-uuid-123', { field: 'value' }, 'USER_123', 'Manual Save');

      expect(mockUpdateDraftNodeData).toHaveBeenCalledWith(
        'test-uuid-123',
        { field: 'value' },
        'USER_123',
        'Manual Save'
      );
      expect(success).toBe(false);
      expect(consoleErrorMock).toHaveBeenCalledWith('Failed to update draft', testError);
    });

    it('should correctly pass the default actorId and logReason when not provided', () => {
      mockUpdateDraftNodeData.mockImplementation(() => { });

      const { result } = renderHook(() => useOmniDataCore());

      const success = result.current.saveDraft('test-uuid-456', { amount: 1000 });

      expect(mockUpdateDraftNodeData).toHaveBeenCalledWith(
        'test-uuid-456',
        { amount: 1000 },
        'SYSTEM_AGENT',
        'Auto-Save'
      );
      expect(success).toBe(true);
    });
  });
});
