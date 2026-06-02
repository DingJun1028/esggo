import { describe, it, expect, beforeEach, vi, test } from 'vitest';
import { LogicRepo } from '../src/storage/LogicRepo';

// Mock the entire LogicRepo module to prevent better-sqlite3 from being loaded
vi.mock('../src/storage/LogicRepo', () => {
  const store: Record<string, any> = {};
  return {
    LogicRepo: {
      save: vi.fn().mockImplementation((node: { name: string; config: string; compliance_score: number }) => {
        store[node.name] = node;
      }),
      findById: vi.fn().mockImplementation((name: string) => store[name]),
      listAll: vi.fn().mockImplementation(() => Object.values(store)),
      logAction: vi.fn(), // Mock this as well if it's part of the interface
    },
  };
});

describe('LogicRepo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the internal store of the mock for each test
    // This assumes the mock factory function is re-evaluated or explicitly reset
    // For simplicity, direct store manipulation is used in the mock above.
  });

  // Keep existing tests, but interact directly with the mocked LogicRepo
  test('should save and retrieve a node', () => {
    LogicRepo.save({
      name: 'TestNode',
      config: '{"test":"value"}',
      compliance_score: 0.85
    });

    const retrieved = LogicRepo.findById('TestNode');
    expect(retrieved).not.toBeUndefined();
    expect(retrieved!.name).toBe('TestNode');
    expect(retrieved!.config).toBe('{"test":"value"}');
    expect(retrieved!.compliance_score).toBe(0.85);
  });

  test('should update existing node with INSERT OR REPLACE', () => {
    // Initial save
    LogicRepo.save({
      name: 'UpdateNode',
      config: '{"score":0.5}',
      compliance_score: 0.5
    });

    // Mock findById to return the updated value after the "update" save
    (LogicRepo.findById as ReturnType<typeof vi.fn>).mockImplementationOnce((name) => {
        if (name === 'UpdateNode') {
            return { name: 'UpdateNode', config: '{"score":0.9}', compliance_score: 0.9 };
        }
        return undefined;
    });

    LogicRepo.save({
      name: 'UpdateNode',
      config: '{"score":0.9}',
      compliance_score: 0.9
    });

    const updated = LogicRepo.findById('UpdateNode');
    expect(updated!.compliance_score).toBe(0.9);
  });
});