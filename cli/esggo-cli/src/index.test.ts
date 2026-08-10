import { beforeAll, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const src = join(__dirname, 'index.ts');
const tsxBin = process.platform === 'win32' ? 'tsx.cmd' : 'tsx';

function run(args: string[]): { stdout: string; stderr: string; status: number } {
  const result = spawnSync(tsxBin, [src, ...args], { encoding: 'utf-8', shell: true });
  return { stdout: result.stdout?.trim() ?? '', stderr: result.stderr?.trim() ?? '', status: result.status ?? 0 };
}

beforeAll(() => {
  const build = spawnSync(tsxBin, [src, '--version'], { encoding: 'utf-8', shell: true });
  if (build.status !== 0) throw new Error('CLI build failed');
});

describe('esggo-cli', () => {
  it('--version prints 0.1.0', () => {
    const { stdout } = run(['--version']);
    expect(stdout).toBe('0.1.0');
  });
  it('status --dry-run prints dry-run message', () => {
    const { stdout } = run(['status', '--dry-run']);
    expect(stdout).toContain('DRY-RUN');
    expect(stdout).toContain('esggo status');
  });
  it('data get --dry-run prints traceable source', () => {
    const { stdout } = run(['data', 'get', 'entropy', '--dry-run']);
    expect(stdout).toContain('DRY-RUN');
    expect(stdout).toContain('data get');
  });
  it('data set --dry-run prints hash lock message', () => {
    const { stdout } = run(['data', 'set', 'entropy', '0.05', '--dry-run']);
    expect(stdout).toContain('DRY-RUN');
    expect(stdout).toContain('Hash Lock');
  });
});

describe.skip('esggo-cli --live gateway fallback', () => {
  it('status --live probes gateway and reports (BLOCKER if down, JSON if up)', { timeout: 15000 }, () => {
    const { stdout } = run(['status', '--live']);
    expect(stdout).toMatch(/BLOCKER|閘門|gateway|8420|hash_lock/);
  });
  it('data get --live probes gateway and reports (BLOCKER if down, JSON if up)', { timeout: 15000 }, () => {
    const { stdout } = run(['data', 'get', 'entropy', '--live']);
    expect(stdout).toMatch(/BLOCKER|閘門|gateway|8420|hash_lock/);
  });
});
