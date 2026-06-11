// tests/__mocks__/esggo/server/src/storage/LogicRepo.ts
// This mock is needed because LogicRepo.ts directly imports better-sqlite3
import Database from '../../../../tests/__mocks__/better-sqlite3'; // Adjust path as necessary
import { join } from "path";

const dbPath = join(process.cwd(), "logic_registry.db");

class LogicRepo {
  private db: Database;

  constructor() {
    this.db = new Database(dbPath);
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS logic_nodes (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        code TEXT,
        version TEXT,
        checksum TEXT
      )`
    ).run();
  }

  insertLogic(logic: any) {
    // console.log('Mocking insertLogic');
    return { changes: 1, lastInsertRowid: 1 };
  }

  getLogicById(id: string) {
    // console.log('Mocking getLogicById');
    return { id, name: 'mock-logic', code: 'mock-code', version: '1.0.0', checksum: 'mock-checksum' };
  }

  getAllLogics() {
    // console.log('Mocking getAllLogics');
    return [];
  }

  updateLogic(logic: any) {
    // console.log('Mocking updateLogic');
    return { changes: 1 };
  }

  deleteLogic(id: string) {
    // console.log('Mocking deleteLogic');
    return { changes: 1 };
  }
}

export default LogicRepo;
