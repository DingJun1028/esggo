/**
 * ⚛️ OmniAgent Universal WIKI Script Implementer
 * v1.1.0 | #OmniCore #7Pillars #SSoT
 * 
 * 商業價值：自動化 WIKI 生態治理，確保「文檔即憲法」的技術誠信。
 */

import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const WIKI_DIR = './docs/wiki';
const ROOT_WIKI = './WIKI.md';
const GUIDELINES_PATH = './docs/wiki/Wiki-Guidelines.md';
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const PILLARS = [
  '1. 模組定位 (Core Purpose)',
  '2. 客戶旅程與 UX 體驗 (Customer Journey & UX)',
  '3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)',
  '4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)',
  '5. 功能項目解說和使用技術 (Features & Tech Stack)',
  '6. 品質達標與驗收紅線 (QA Red Lines)',
  '7. 矩陣關聯 (Matrix Connection)'
];

async function callGemini(prompt) {
  if (!API_KEY) throw new Error('Missing GEMINI_API_KEY');
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    })
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

function parseMetadata(content) {
  // Enhanced Regex Patterns
  const pathMatch = content.match(/路徑：\s*`?(.*?)`?(?:\s*\||$)/m);
  const roleMatch = content.match(/權限：\s*(.*?)(?:\s*\||$)/m);
  const journeyMatch = content.match(/所屬旅程：\s*(.*?)(?:\s*\||$)/m);
  
  // Try to match "# Title [EnglishName]" or "# Title"
  let displayName = 'Unknown';
  let englishName = 'unknown';
  const nameMatchFull = content.match(/^#\s+(.*?)\s+\[(.*?)\]/m);
  const nameMatchSimple = content.match(/^#\s+(.*)/m);

  if (nameMatchFull) {
    displayName = nameMatchFull[1].trim();
    englishName = nameMatchFull[2].trim();
  } else if (nameMatchSimple) {
    displayName = nameMatchSimple[1].trim();
    // Use kebab-case of displayName if englishName not found
    englishName = displayName.toLowerCase().replace(/\s+/g, '-');
  }

  return {
    path: pathMatch ? pathMatch[1].trim() : '',
    role: roleMatch ? roleMatch[1].trim() : 'ALL_USERS',
    journey: journeyMatch ? journeyMatch[1].trim() : 'Uncategorized',
    displayName,
    englishName
  };
}

async function implementWiki(filePath) {
  console.log(`[OmniWiki] Implementing: ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const template = fs.readFileSync(GUIDELINES_PATH, 'utf-8');
  
  const missingPillars = PILLARS.filter(p => !content.includes(p.split(' ')[0]));
  
  if (missingPillars.length === 0 && content.length > 500) {
    console.log(`[OmniWiki] ✅ ${path.basename(filePath)} is already robust.`);
    return content;
  }

  console.log(`[OmniWiki] 🛠️ Healing missing pillars: ${missingPillars.join(', ')}`);
  
  const prompt = `
你是一位專業的 ESG SaaS 架構師。
請根據「ESG GO 系統 WIKI 7 大標竿結構」，優化並補齊以下 WIKI 內容。
必須包含所有 7 個章節。如果內容缺失（例如第 7 章矩陣關聯），請基於 ESGGO 的 5T 誠信協議架構自動補齊專業且合理的內容。

【WIKI 撰寫規範】：
${template}

【當前 WIKI 內容】：
${content}

請直接輸出優化後的 Markdown，不要有任何廢話。
`;

  const optimized = await callGemini(prompt);
  if (optimized) {
    const cleaned = optimized.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    fs.writeFileSync(filePath, cleaned, 'utf-8');
    console.log(`[OmniWiki] ✨ Saved optimized version: ${filePath}`);
    return cleaned;
  }
  return content;
}

async function syncRootWiki() {
  console.log('[OmniWiki] 🔄 Synchronizing WIKI.md index...');
  const excludeFiles = ['Wiki-Guidelines.md', 'Wiki-New-Version-Analysis.md', 'Development-Workflow.md', 'JunAiKey.md', 'Swarm.md', 'Platform-Overview.md', 'System-Core-Architecture.md', '5T-Protocol.md'];
  const files = fs.readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !excludeFiles.includes(f));
  
  const journeyGroups = {};

  for (const file of files) {
    const content = fs.readFileSync(path.join(WIKI_DIR, file), 'utf-8');
    const meta = parseMetadata(content);
    if (!journeyGroups[meta.journey]) journeyGroups[meta.journey] = [];
    journeyGroups[meta.journey].push({
      file,
      ...meta
    });
  }

  let indexContent = '## 📖 Wiki 目錄導覽\n\n### 核心概念與架構\n*   [[WIKI 新版全解析]](docs/wiki/Wiki-New-Version-Analysis.md)\n*   [[WIKI 撰寫規範]](docs/wiki/Wiki-Guidelines.md)\n*   [[功能開發與 WIKI 規範]](docs/wiki/Development-Workflow.md)\n*   [[Jun.AI.Key 萬能元鑰]](docs/wiki/JunAiKey.md)\n*   [[Agent-Swarm 代理蜂群]](docs/wiki/Swarm.md)\n*   [[平台總覽]](docs/wiki/Platform-Overview.md)\n*   [[系統核心架構]](docs/wiki/System-Core-Architecture.md)\n*   [[5T-誠信協議]](docs/wiki/5T-Protocol.md)\n\n';

  const journeys = Object.keys(journeyGroups).sort();
  for (const j of journeys) {
    if (j === 'Uncategorized' || j === '核心概念' || j === '核心概念與架構') continue;
    indexContent += `### ${j}\n`;
    // Sort items by english name for consistency
    const items = journeyGroups[j].sort((a, b) => a.englishName.localeCompare(b.englishName));
    for (const item of items) {
      indexContent += `*   [[${item.englishName}-${item.displayName}]](docs/wiki/${item.file}) -> \`${item.path}\`\n`;
    }
    indexContent += '\n';
  }

  const rootContent = fs.readFileSync(ROOT_WIKI, 'utf-8');
  const newRoot = rootContent.replace(/## 📖 Wiki 目錄導覽[\s\S]*?---/, `${indexContent}---`);
  fs.writeFileSync(ROOT_WIKI, newRoot, 'utf-8');
  console.log('[OmniWiki] ✅ WIKI.md index synchronized.');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--sync-only')) {
    await syncRootWiki();
    return;
  }

  let files = fs.readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !['Wiki-Guidelines.md', 'Wiki-New-Version-Analysis.md', 'Development-Workflow.md'].includes(f));
  
  // Filter by specific files if provided (e.g., node script.mjs Profile.md)
  const specificFiles = args.filter(a => !a.startsWith('--'));
  if (specificFiles.length > 0) {
    files = files.filter(f => specificFiles.includes(f) || specificFiles.includes(path.join(WIKI_DIR, f)));
  }

  console.log(`[OmniWiki] Target files count: ${files.length}`);
  
  for (const file of files) {
    await implementWiki(path.join(WIKI_DIR, file));
    // Brief delay to avoid rate limiting
    if (files.length > 1) await new Promise(r => setTimeout(r, 2000));
  }
  
  await syncRootWiki();
  console.log('[OmniWiki] 🚀 All tasks completed.');
}

main().catch(console.error);
