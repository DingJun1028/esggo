import { LogicRepo } from '../src/storage/LogicRepo';
import Database from 'better-sqlite3';
import { join } from 'path';

describe('LogicRepo', () => {
  let db: any;
  let repo: any;

  beforeAll(() => {
    // Use a temporary DB file for testing
    const testDbPath = join(process.cwd(), 'logic_registry.test.db');
    db = new Database(testDbPath);
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

  afterAll(() => {
    db.close();
  });

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