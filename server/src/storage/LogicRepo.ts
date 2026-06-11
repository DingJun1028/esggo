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
  );
  
  CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    node_name TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const LogicRepo = {
  save(node: { name: string; config: string; compliance_score: number }) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO logic_nodes (name, config, compliance_score)
    `);
    stmt.run(node.name, node.config, node.compliance_score);
  },

  findById(name: string) {
    const stmt = db.prepare('SELECT * FROM logic_nodes WHERE name = ?');
    return stmt.get(name) as Record<string, any> | undefined;
  },

  listAll() {
    return db.prepare('SELECT name, compliance_score FROM logic_nodes').all() as Record<string, any>[];
  },

  // Log an action for audit purposes
  logAction(action: string, node_name: string | null = null, details: string | null = null) {
    const stmt = db.prepare('INSERT INTO audit_events (action, node_name, details) VALUES (?, ?, ?)');
    stmt.run(action, node_name ?? null, details ?? null);
  }
};