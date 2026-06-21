#!/usr/bin/env node
// omnipotent-repository/ingest.ts
// 萬能元件心核 — 雙軌永恆刻印自動化腳本
// 使用方式: node ingest.ts <template.json> | --batch <dir/> | --init-templates | --search <tag> | --list | --stats

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

// ==========================================
//  環境組態配置
// ==========================================
const REPO_PATH = path.resolve(__dirname);
const TEMPLATES_DIR = path.join(REPO_PATH, 'templates');

// ==========================================
//  聖典契約型別定義
// ==========================================
interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  readonly source_origin: string;
  evidence: Record<string, any>;
}

interface IExpertTemplate extends IComponentCore {
  readonly tags: string[];
  readonly title: string;
  readonly content: string;
  readonly algorithm_checksum?: string;
  readonly wordCount: number;
  readonly griAlignment: string[];
}

// ==========================================
//  基礎設施自動初始化
// ==========================================
function initInfrastructure() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  const gitignore = path.join(REPO_PATH, '.gitignore');
  if (!fs.existsSync(gitignore)) {
    fs.writeFileSync(gitignore, 'node_modules/\n*.log\n.env\n');
  }

  const metadataPath = path.join(REPO_PATH, 'metadata.json');
  if (!fs.existsSync(metadataPath)) {
    const initialMeta = {
      name: 'Omnipotent Repository',
      version: '1.0.0',
      created: new Date().toISOString(),
      description: '零算力專家模板永續資源庫',
      totalTemplates: 0,
      totalWords: 0,
      lastEngraved: null,
    };
    fs.writeFileSync(metadataPath, JSON.stringify(initialMeta, null, 2));
  }
}

// ==========================================
//  本質提純與防篡改鎖定
// ==========================================
function purifyAndFreeze(template: IExpertTemplate): Readonly<IExpertTemplate> {
  const checksum = createHash('sha256').update(template.content).digest('hex').substring(0, 16);

  const purified: IExpertTemplate = {
    ...template,
    uuid: template.uuid || `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    version: template.version || '1.0.0',
    timestamp: template.timestamp || Date.now(),
    source_origin: template.source_origin || 'manual-engrave',
    algorithm_checksum: checksum,
    wordCount: countWords(template.content),
  };

  Object.freeze(purified);
  Object.freeze(purified.tags);
  Object.freeze(purified.evidence);

  return purified;
}

function countWords(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
}

// ==========================================
//  雙軌永恆刻印
// ==========================================
async function engraveTemplate(template: IExpertTemplate): Promise<void> {
  const purified = purifyAndFreeze(template);
  const uuid = purified.uuid;
  const jsonString = JSON.stringify(purified, null, 2);

  console.log(`\n[ 刻印開始] UUID: ${uuid}`);
  console.log(`  標題: ${purified.title}`);
  console.log(`  字數: ${purified.wordCount}`);
  console.log(`  標籤: ${purified.tags.join(', ')}`);

  // 階段一：Redis 記憶快取層
  try {
    const { default: Redis } = await import('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });

    const pipeline = redis.pipeline();
    pipeline.hset('omni:templates', uuid, jsonString);
    pipeline.hset('omni:metadata', uuid, JSON.stringify({
      title: purified.title,
      version: purified.version,
      tags: purified.tags,
      wordCount: purified.wordCount,
      checksum: purified.algorithm_checksum,
      timestamp: purified.timestamp,
    }));
    for (const tag of purified.tags) {
      pipeline.sadd(`tag:${tag}`, uuid);
    }
    pipeline.incr('omni:template_count');
    pipeline.hincrby('omni:stats', 'totalWords', purified.wordCount);
    await pipeline.exec();
    await redis.quit();

    console.log(`  [#量子刻印] Redis 快取層同步完成`);
  } catch (e: any) {
    console.warn(`  ⚠ Redis 不可用，跳過快取層: ${e.message}`);
  }

  // 階段二：Git 持久刻印層
  const filePath = path.join(TEMPLATES_DIR, `${uuid}.json`);
  fs.writeFileSync(filePath, jsonString, 'utf8');

  try {
    execSync(`git -C ${REPO_PATH} add .`, { stdio: 'ignore' });
    const commitMsg = `Engrave: ${purified.title} [${uuid}] v${purified.version} | ${purified.wordCount} words`;
    const status = execSync(`git -C ${REPO_PATH} status --porcelain`).toString().trim();
    if (status) {
      execSync(`git -C ${REPO_PATH} commit -m "${commitMsg}"`, { stdio: 'ignore' });
      const hash = execSync(`git -C ${REPO_PATH} rev-parse --short HEAD`).toString().trim();
      console.log(`  [#記憶聖所] Git 鏈式日誌刻印完成: ${hash}`);
    } else {
      console.log(`  [ 無需提交] 內容無變更`);
    }
  } catch (e: any) {
    console.error(`  ✗ Git 刻印失敗: ${e.message}`);
  }

  // 階段三：更新元數據
  const metadataPath = path.join(REPO_PATH, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const meta = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    meta.totalTemplates = (meta.totalTemplates || 0) + 1;
    meta.totalWords = (meta.totalWords || 0) + purified.wordCount;
    meta.lastEngraved = new Date().toISOString();
    fs.writeFileSync(metadataPath, JSON.stringify(meta, null, 2));
  }

  console.log(`  [✓ 刻印完成] ${purified.title}\n`);
}

// ==========================================
//  批量刻印
// ==========================================
async function engraveBatch(dirPath: string): Promise<void> {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  console.log(`[ 批量刻印] 發現 ${files.length} 個模板檔案\n`);
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      await engraveTemplate(JSON.parse(content));
    } catch (e: any) {
      console.error(`  ✗ 檔案解析失敗: ${file} - ${e.message}`);
    }
  }
}

// ==========================================
//  主程式入口
// ==========================================
async function main() {
  initInfrastructure();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════╗
║  萬能元件心核 — 永續資源庫刻印系統 v1.0          ║
╠══════════════════════════════════════════════════╣
║  node ingest.ts <template.json>   刻印單個模板    ║
║  node ingest.ts --batch <dir/>    批量刻印        ║
║  node ingest.ts --init-templates  初始化24段範本   ║
║  node ingest.ts --search <tag>    標籤檢索        ║
║  node ingest.ts --list            列出所有模板    ║
║  node ingest.ts --stats           資源庫統計      ║
╚══════════════════════════════════════════════════╝
`);
    return;
  }

  if (args[0] === '--init-templates') {
    console.log('[ 系統] 初始化 24 段預寫範本...');
    const { initAllTemplates } = await import('./init-templates');
    await initAllTemplates();
  } else if (args[0] === '--batch' && args[1]) {
    await engraveBatch(args[1]);
  } else if (args[0] === '--search' && args[1]) {
    const { default: Redis } = await import('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    const uuids = await redis.smembers(`tag:${args[1]}`);
    const templates = await redis.hmget('omni:templates', ...uuids);
    console.log(`[ 搜尋] 標籤 "${args[1]}" 共 ${uuids.length} 個模板:`);
    templates.forEach((t, i) => {
      if (t) {
        const p = JSON.parse(t);
        console.log(`  ${i+1}. [${p.uuid}] ${p.title} (${p.wordCount} words)`);
      }
    });
    await redis.quit();
  } else if (args[0] === '--list') {
    const { default: Redis } = await import('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    const keys = await redis.hkeys('omni:templates');
    const meta = await redis.hgetall('omni:metadata');
    console.log(`[ 資源庫] 共 ${keys.length} 個模板:`);
    keys.forEach(k => {
      const m = meta[k] ? JSON.parse(meta[k]) : {};
      console.log(`  - ${m.title || k} (${m.wordCount || 0} words) [${(m.tags || []).join(', ')}]`);
    });
    await redis.quit();
  } else if (args[0] === '--stats') {
    const { default: Redis } = await import('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    const count = await redis.get('omni:template_count');
    const stats = await redis.hgetall('omni:stats');
    console.log(`[ 統計] 模板總數: ${count || 0} | 總字數: ${stats.totalWords || 0}`);
    await redis.quit();
  } else {
    const filePath = args[0];
    if (!fs.existsSync(filePath)) { console.error(`✗ 檔案不存在: ${filePath}`); return; }
    const content = fs.readFileSync(filePath, 'utf8');
    await engraveTemplate(JSON.parse(content));
  }
}

main().catch(console.error);
