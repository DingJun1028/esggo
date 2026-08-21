import { describe, it, expect } from 'vitest';
import {
  parseOmniTagHeader,
  checkTagCompliance,
  auditOmniTags,
} from './audit';

describe('§20.5 規則 5 / §20.6 驗收：OmniTag 合約率稽核', () => {
  it('parseOmniTagHeader extracts tags from header comment', () => {
    const content = `/**
 * [agent:25][squad:5T驗算][lifecycle:active][p2][platform:esggo][best-practice:结界]
 */
export const x = 1;`;
    const tags = parseOmniTagHeader(content);
    expect(tags).not.toBeNull();
    // parser 保留 namespace 前綴 (對齊 checkTagCompliance 期望)
    expect(tags!['agent']).toBe('agent:25');
    expect(tags!['squad']).toBe('squad:5T驗算');
    expect(tags!['lifecycle']).toBe('lifecycle:active');
    expect(tags!['p']).toBe('p2');
  });

  it('parseOmniTagHeader returns null when no tag', () => {
    expect(parseOmniTagHeader('const x = 1;')).toBeNull();
  });

  it('parseOmniTagHeader ignores tags beyond first 30 lines', () => {
    const lines = Array.from({ length: 40 }, (_, i) => `// line ${i}`);
    lines.push('* [agent:25][squad:5T驗算][lifecycle:active][p2]');
    expect(parseOmniTagHeader(lines.join('\n'))).toBeNull();
  });

  it('checkTagCompliance passes required triad', () => {
    const v = checkTagCompliance({ agent: 'agent:25', lifecycle: 'active', p: 'p2' });
    expect(v).toEqual([]);
  });

  it('checkTagCompliance fails missing triad', () => {
    const v = checkTagCompliance({ lifecycle: 'active' });
    expect(v.length).toBeGreaterThan(0);
    expect(v.some((x) => x.includes('agent'))).toBe(true);
  });

  it('auditOmniTags scans real project files and finds tagged ones', () => {
    // vitest cwd = cli/oa-cli, 用相對於此的專案路徑
    const result = auditOmniTags(['../src/lib', './src']);
    // 至少有 omnitag-contract.ts + omnitag.ts 帶標籤
    expect(result.tagged).toBeGreaterThanOrEqual(2);
    // 所有帶標籤的都應合約 (這些檔案標頭格式正確)
    expect(result.compliant).toBe(result.tagged);
    expect(result.rate).toBe(1);
  });
});
