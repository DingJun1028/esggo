/**
 * cli/oa-cli/src/audit.ts — §20.5 規則 5 / §20.6 驗收：OmniTag 合約率稽核
 *
 * 掃描 .ts 檔的 OmniTag 標頭註釋 (如 `[agent:25][squad:5T驗算]...`)，
 * 對齊 verifyOmniTagContract 邏輯校驗合約率，目標 100%。
 * 零外部依賴（僅 fs + path）。
 *
 * [agent:25][squad:5T驗算][lifecycle:active][p2][platform:esggo][best-practice:结界]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';

export interface AuditResult {
  scanned: number;
  tagged: number;
  compliant: number;
  rate: number; // 0..1
  violations: Array<{ file: string; issues: string[] }>;
}

// ── OmniTag 標頭解析（對齊 §20.3 語法）──
const TAG_RE = /\[([a-z]+):([^\]]+)\]/g;

export function parseOmniTagHeader(content: string): Record<string, string> | null {
  // 只掃前 30 行（標頭註釋區）
  const head = content.split('\n').slice(0, 30).join('\n');
  const tags: Record<string, string> = {};
  let m: RegExpExecArray | null;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(head)) !== null) {
    // 保留完整標籤值 (含 namespace 前綴)，如 agent:25 / best-practice:结界
    tags[m[1]] = `${m[1]}:${m[2]}`;
  }
  // §20.3 簡寫: [p0]~[p3] 無冒號，對齊 priority 維度
  const P_RE = /\[p([0-3])\]/g;
  let pm: RegExpExecArray | null;
  P_RE.lastIndex = 0;
  while ((pm = P_RE.exec(head)) !== null) {
    tags['p'] = `p${pm[1]}`;
  }
  if (Object.keys(tags).length === 0) return null;
  return tags;
}

// ── 合約校驗（對齊 §20.5 規則 1：必備三枚）──
export function checkTagCompliance(tags: Record<string, string>): string[] {
  const violations: string[] = [];
  if (!tags['agent'] || !/^agent:(0?[1-9]|[12][0-9]|30)$/.test(tags['agent'])) {
    violations.push('Missing/invalid [agent:*] (agent:01~agent:30)');
  }
  if (!tags['lifecycle']) {
    violations.push('Missing [lifecycle:*]');
  }
  if (!tags['p']) {
    violations.push('Missing [p*] (p0/p1/p2/p3)');
  }
  return violations;
}

function walkTsFiles(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTsFiles(full, acc);
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts') && !entry.endsWith('.d.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

export function auditOmniTags(rootDirs: string[]): AuditResult {
  const files = rootDirs.flatMap((d) => walkTsFiles(d));
  let tagged = 0;
  let compliant = 0;
  const violations: Array<{ file: string; issues: string[] }> = [];

  for (const f of files) {
    const content = readFileSync(f, 'utf8');
    const tags = parseOmniTagHeader(content);
    if (!tags) continue;
    tagged++;
    const issues = checkTagCompliance(tags);
    if (issues.length === 0) {
      compliant++;
    } else {
      violations.push({ file: relative(process.cwd(), f), issues });
    }
  }

  const rate = tagged === 0 ? 1 : compliant / tagged;
  return { scanned: files.length, tagged, compliant, rate, violations };
}

// ── §20.6 驗收：缺失者當週煉金補標 ──────────────────────────
// 依檔案路徑推測陣列歸屬 (對齊 §20.4 路由表)。
export function suggestOmniTag(filePath: string): Record<string, string> | null {
  const p = filePath.replace(/\\/g, '/');
  let squad: string | null = null;
  let priority = 'p2';
  if (p.includes('/agents/') || p.includes('/agents/')) squad = '智庫聖所';
  else if (p.includes('/lib/') || p.includes('/api/') || p.includes('/core/')) squad = '符文契約';
  else if (p.includes('/cli/') || p.includes('/deploy') || p.includes('/cron')) squad = '光之羽翼';
  else if (p.includes('/test') || p.includes('.test.') || p.includes('lint')) squad = '煉金熵減';
  else if (p.includes('omnitag') || p.includes('five-t') || p.includes('verif')) squad = '5T驗算';
  if (!squad) return null;
  const agentNum = squad === '智庫聖所' ? 3
    : squad === '符文契約' ? 9
    : squad === '光之羽翼' ? 15
    : squad === '煉金熵減' ? 21
    : 27;
  return {
    agent: `agent:${agentNum}`,
    squad,
    lifecycle: 'active',
    p: priority,
    platform: 'esggo',
    'best-practice': '结界',
  };
}

/**
 * 為未帶標頭的 .ts 檔自動補標 (§20.6 煉金補標)。
 * @param dryRun 僅回傳建議，不寫入檔案
 * @returns 實際寫入的檔案清單 (dryRun 時為空)
 */
export function applyHeader(
  filePath: string,
  dryRun = true,
): { file: string; header: string; written: boolean } {
  const content = readFileSync(filePath, 'utf8');
  if (parseOmniTagHeader(content)) {
    return { file: filePath, header: '', written: false }; // 已帶標籤
  }
  const tags = suggestOmniTag(filePath);
  if (!tags) {
    return { file: filePath, header: '', written: false }; // 無法推測
  }
  const header = `// [${tags.agent}][squad:${tags.squad}][lifecycle:${tags.lifecycle}][${tags.p}][platform:${tags.platform}][best-practice:${tags['best-practice']}]\n`;
  if (!dryRun) {
    writeFileSync(filePath, header + content, 'utf8');
  }
  return { file: filePath, header, written: !dryRun };
}

