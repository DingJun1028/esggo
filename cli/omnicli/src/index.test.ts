import { beforeAll, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const src = join(__dirname, 'index.ts');

function run(args: string[]): { stdout: string; stderr: string; status: number } {
  const result = spawnSync('npx', ['tsx', src, ...args], { encoding: 'utf-8', shell: true });
  return { stdout: result.stdout?.trim() ?? '', stderr: result.stderr?.trim() ?? '', status: result.status ?? 0 };
}

beforeAll(() => {
  const build = spawnSync('npx', ['tsx', src, '--version'], { encoding: 'utf-8', shell: true });
  if (build.status !== 0) throw new Error('CLI build failed');
});

describe('omnicli', () => {
  it('--version prints 0.1.0', () => {
    const { stdout } = run(['--version']);
    expect(stdout).toBe('0.1.0');
  });
  it('gateway status --dry-run prints dry-run message', () => {
    const { stdout } = run(['gateway', 'status', '--dry-run']);
    expect(stdout).toContain('DRY-RUN');
    expect(stdout).toContain('gateway status');
  });
  it('route list --dry-run prints traceable source', () => {
    const { stdout } = run(['route', 'list', '--dry-run']);
    expect(stdout).toContain('DRY-RUN');
    expect(stdout).toContain('route list');
  });
  it('auth check --dry-run prints Bearer message', () => {
    const { stdout } = run(['auth', 'check', '--dry-run']);
    expect(stdout).toContain('DRY-RUN');
    expect(stdout).toContain('Bearer');
  });
});

describe('omnicli --live gateway fallback', () => {
  it('gateway status --live without gateway returns BLOCKER', () => {
    const { stdout } = run(['gateway', 'status', '--live']);
    expect(stdout).toContain('BLOCKER');
  });
  it('auth check --live without gateway returns BLOCKER', () => {
    const { stdout } = run(['auth', 'check', '--live']);
    expect(stdout).toContain('BLOCKER');
  });
});
