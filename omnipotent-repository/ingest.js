#!/usr/bin/env node
// omnipotent-repository/ingest.js
// 萬能元件心核 — 雙軌永恆刻印自動化腳本 (CommonJS)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const REPO_PATH = path.resolve(__dirname);
const TEMPLATES_DIR = path.join(REPO_PATH, 'templates');

function initInfrastructure() {
  if (!fs.existsSync(TEMPLATES_DIR)) fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  const gitignore = path.join(REPO_PATH, '.gitignore');
  if (!fs.existsSync(gitignore)) fs.writeFileSync(gitignore, 'node_modules/\n*.log\n.env\n');
  const metadataPath = path.join(REPO_PATH, 'metadata.json');
  if (!fs.existsSync(metadataPath)) {
    fs.writeFileSync(metadataPath, JSON.stringify({
      name: 'Omnipotent Repository', version: '1.0.0', created: new Date().toISOString(),
      description: '零算力專家模板永續資源庫', totalTemplates: 0, totalWords: 0, lastEngraved: null,
    }, null, 2));
  }
  console.log('[ 系統] 基礎設施初始化完成');
}

function countWords(text) {
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
}

function engraveTemplate(template) {
  const checksum = createHash('sha256').update(template.content).digest('hex').substring(0, 16);
  const purified = Object.freeze({
    ...template,
    uuid: template.uuid || `tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    version: template.version || '1.0.0',
    timestamp: template.timestamp || Date.now(),
    source_origin: template.source_origin || 'manual-engrave',
    algorithm_checksum: checksum,
    wordCount: countWords(template.content),
  });
  Object.freeze(purified.tags);
  Object.freeze(purified.evidence);

  const uuid = purified.uuid;
  const jsonString = JSON.stringify(purified, null, 2);

  console.log(`\n[ 刻印開始] UUID: ${uuid}`);
  console.log(`  標題: ${purified.title}`);
  console.log(`  字數: ${purified.wordCount}`);

  // Redis
  try {
    const Redis = require('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    const pipeline = redis.pipeline();
    pipeline.hset('omni:templates', uuid, jsonString);
    pipeline.hset('omni:metadata', uuid, JSON.stringify({
      title: purified.title, version: purified.version, tags: purified.tags,
      wordCount: purified.wordCount, checksum: purified.algorithm_checksum, timestamp: purified.timestamp,
    }));
    purified.tags.forEach(tag => pipeline.sadd(`tag:${tag}`, uuid));
    pipeline.incr('omni:template_count');
    pipeline.hincrby('omni:stats', 'totalWords', purified.wordCount);
    pipeline.exec().then(() => redis.quit());
    console.log('  [#量子刻印] Redis 快取層同步完成');
  } catch (e) {
    console.warn(`  ⚠ Redis 不可用: ${e.message}`);
  }

  // Git
  fs.writeFileSync(path.join(TEMPLATES_DIR, `${uuid}.json`), jsonString, 'utf8');
  try {
    execSync(`git -C ${REPO_PATH} add .`, { stdio: 'ignore' });
    const commitMsg = `Engrave: ${purified.title} [${uuid}] v${purified.version} | ${purified.wordCount} words`;
    const status = execSync(`git -C ${REPO_PATH} status --porcelain`).toString().trim();
    if (status) {
      execSync(`git -C ${REPO_PATH} commit -m "${commitMsg}"`, { stdio: 'ignore' });
      const hash = execSync(`git -C ${REPO_PATH} rev-parse --short HEAD`).toString().trim();
      console.log(`  [#記憶聖所] Git 鏈式日誌: ${hash}`);
    }
  } catch (e) {
    console.error(`  ✗ Git 刻印失敗: ${e.message}`);
  }

  // 元數據
  const metadataPath = path.join(REPO_PATH, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const meta = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    meta.totalTemplates = (meta.totalTemplates || 0) + 1;
    meta.totalWords = (meta.totalWords || 0) + purified.wordCount;
    meta.lastEngraved = new Date().toISOString();
    fs.writeFileSync(metadataPath, JSON.stringify(meta, null, 2));
  }

  console.log(`  [✓ 刻印完成] ${purified.title}`);
}

function main() {
  initInfrastructure();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════╗
║  萬能元件心核 — 永續資源庫刻印系統 v1.0          ║
╠══════════════════════════════════════════════════╣
║  node ingest.js --batch <dir/>    批量刻印        ║
║  node ingest.js --init-templates  初始化24段範本   ║
║  node ingest.js --search <tag>    標籤檢索        ║
║  node ingest.js --list            列出所有模板    ║
║  node ingest.js --stats           資源庫統計      ║
╚══════════════════════════════════════════════════╝`);
    return;
  }

  if (args[0] === '--init-templates') {
    console.log('[ 系統] 初始化 24 段預寫範本...');
    require('./init-templates');
  } else if (args[0] === '--batch' && args[1]) {
    const files = fs.readdirSync(args[1]).filter(f => f.endsWith('.json'));
    console.log(`[ 批量刻印] 發現 ${files.length} 個模板檔案\n`);
    for (const file of files) {
      try {
        engraveTemplate(JSON.parse(fs.readFileSync(path.join(args[1], file), 'utf8')));
      } catch (e) {
        console.error(`  ✗ ${file}: ${e.message}`);
      }
    }
  } else if (args[0] === '--search' && args[1]) {
    const Redis = require('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    redis.smembers(`tag:${args[1]}`).then(uuids => {
      redis.hmget('omni:templates', ...uuids).then(templates => {
        console.log(`[ 搜尋] "${args[1]}" 共 ${uuids.length} 個模板`);
        templates.forEach((t, i) => {
          if (t) { const p = JSON.parse(t); console.log(`  ${i+1}. ${p.title} (${p.wordCount} words)`); }
        });
        redis.quit();
      });
    });
  } else if (args[0] === '--list') {
    const Redis = require('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    redis.hkeys('omni:templates').then(keys => {
      redis.hgetall('omni:metadata').then(meta => {
        console.log(`[ 資源庫] 共 ${keys.length} 個模板`);
        keys.forEach(k => { const m = meta[k] ? JSON.parse(meta[k]) : {}; console.log(`  - ${m.title || k} (${m.wordCount || 0} words)`); });
        redis.quit();
      });
    });
  } else if (args[0] === '--stats') {
    const Redis = require('ioredis');
    const redis = new Redis({ host: '127.0.0.1', port: 6379 });
    redis.get('omni:template_count').then(count => {
      redis.hgetall('omni:stats').then(stats => {
        console.log(`[ 統計] 模板: ${count || 0} | 總字數: ${stats.totalWords || 0}`);
        redis.quit();
      });
    });
  } else if (args[0]) {
    if (!fs.existsSync(args[0])) { console.error(`✗ 檔案不存在: ${args[0]}`); return; }
    engraveTemplate(JSON.parse(fs.readFileSync(args[0], 'utf8')));
  }
}

main();
