// tests/__mocks__/better-sqlite3.ts
export default class Database {
  constructor(filename: string, options?: any) {
    // console.log(`Mocking Database constructor with filename: ${filename}`);
  }
  prepare(sql: string) {
    // console.log(`Mocking prepare with SQL: ${sql}`);
    return {
      run: () => ({ changes: 1, lastInsertRowid: 1 }),
      get: () => ({}),
      all: () => [],
    };
  }
  close() {
    // console.log('Mocking close');
  }
  transaction(fn: (...args: any[]) => any) {
    return () => fn();
  }
}
