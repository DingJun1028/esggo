// Minimal ambient type declarations for the `pg` (node-postgres) module.
// Installed in place of `@types/pg` (unavailable offline). Once `@types/pg`
// is installed, delete this file so the real types take over.
declare module 'pg' {
  export type PoolClient = {
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
    release(): void;
    [key: string]: unknown;
  };

  export class Pool {
    constructor(options?: unknown);
    connect(): Promise<PoolClient>;
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
    end(): Promise<void>;
    on(event: string, listener: (...args: unknown[]) => void): void;
  }

  export class Client {
    constructor(options?: unknown);
    connect(): Promise<void>;
    query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
    end(): Promise<void>;
  }
}
