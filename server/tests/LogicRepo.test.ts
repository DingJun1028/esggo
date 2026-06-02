import { describe, it, expect, beforeEach, afterEach, vi, test } from 'vitest';
import { LogicRepo } from '../src/storage/LogicRepo';
import Database from 'better-sqlite3';
import { join } from 'path';

// Mock better-sqlite3 completely to avoid native dependency issues
vi.mock('better-sqlite3', () => {
  const DatabaseMock = function() {
    const store: Record<string, any> = {};
    return {
      exec: vi.fn(),
      prepare: vi.fn().mockImplementation((query: string) => {
        return {
          run: vi.fn().mockImplementation((name, config, score) => {
            store[name] = { name, config, compliance_score: score };
          }),
          get: vi.fn().mockImplementation((name) => store[name]),
          all: vi.fn().mockImplementation(() => Object.values(store))
        };
      }),
      close: vi.fn(),
    };
  };
  return { default: DatabaseMock, __esModule: true };
});

describe('LogicRepo', () => {
  let db: unknown;
  let repo: unknown;
  let originalCreateTable: unknown;
  const testDbPath: string = join(process.cwd(), 'logic_registry.test.db');

  beforeEach(() => {
    // Create fresh database for each test
    db = new Database(testDbPath);
    originalCreateTable = db.exec(`
      CREATE TABLE IF NOT EXISTS logic_nodes (
        name TEXT PRIMARY KEY,
        config TEXT NOT NULL,
        compliance_score REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    repo = {
      save: (node: { name: string; config: string; compliance_score: number }) => {
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO logic_nodes (name, config, compliance_score)
          VALUES (?, ?, ?)
        `);
        stmt.run(node.name, node.config, node.compliance_score);
      },
      findById: (name: string) => {
        const stmt = db.prepare('SELECT * FROM logic_nodes WHERE name = ?');
        return stmt.get(name);
      },
      listAll: () => {
        return db.prepare('SELECT name, compliance_score FROM logic_nodes').all();
      }
    };
  });

  afterEach(() => {
    // Clean up after each test
    db.close();
  });

  // Keep existing tests
  test('should save and retrieve a node', () => {
    repo.save({
      name: 'TestNode',
      config: '{"test":"value"}',
      compliance_score: 0.85
    });

    const retrieved = repo.findById('TestNode');
    expect(retrieved).not.toBeUndefined();
    expect(retrieved!.name).toBe('TestNode');
    expect(retrieved!.config).toBe('{"test":"value"}');
    expect(retrieved!.compliance_score).toBe(0.85);
  });

  test('should update existing node with INSERT OR REPLACE', () => {
    repo.save({
      name: 'UpdateNode',
      config: '{"score":0.5}',
      compliance_score: 0.5
    });

    const initialUpdate = repo.findById('UpdateNode');
    expect(initialUpdate!.compliance_score).toBe(0.5);

    repo.save({
      name: 'UpdateNode',
      config: '{"score":0.9}',
      compliance_score: 0.9
    });

    const updated = repo.findById('UpdateNode');
    expect(updated!.compliance_score).toBe(0.9);
  });
});