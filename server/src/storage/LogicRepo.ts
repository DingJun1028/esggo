import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'logic_registry.db');
const db = Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS logic_nodes (
    name TEXT PRIMARY KEY,
    config TEXT NOT NULL,
    compliance_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const LogicRepo = {
  save(node: { name: string; config: string; compliance_score: number }) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO logic_nodes (name, config, compliance_score)
      VALUES (?, ?, ?)
    `);
    stmt.run(node.name, node.config, node.compliance_score);
  },

  findById(name: string) {
    const stmt = db.prepare('SELECT * FROM logic_nodes WHERE name = ?');
    return stmt.get(name) as Record<string, any> | undefined;
  },

  listAll() {
    return db.prepare('SELECT name, compliance_score FROM logic_nodes').all() as Record<string, any>[];
  }
};