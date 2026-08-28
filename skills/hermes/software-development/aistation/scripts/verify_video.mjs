#!/usr/bin/env node
/**
 * AI Video Content Verification Script
 * Validates AI-generated video content against 7 quality gates
 */

import fs from 'fs';
import path from 'path';

const GATES = [
  { id: "01", name: "腳本匯入場景生成", check: (d) => d.scenes?.length >= 6 && d.scenes?.length <= 16 },
  { id: "02", name: "數據圖卡準確性", check: (d) => (d.dataCards||[]).every(c => c.value && c.year && c.source) },
  { id: "03", name: "視覺一致性", check: (d) => {
    const t = d.thresholds;
    if (!t || t.length <= 1) return true;
    return t.every(x => x.color === t[0].color && x.font === t[0].font);
  }},
  { id: "04", name: "AI B-roll人本感", check: (d) => !d.broll?.flagging?.some(f => ["機器感","恐懼","悲情"].includes(f)) },
  { id: "05", name: "品牌真實感", check: (d) => d.audio?.realVoiceRatio >= 0.25 && d.audio?.brollRatio >= 0.40 },
  { id: "06", name: "子影片切割", check: (d) => d.subVideos?.length === 4 && d.thresholdCard?.single },
  { id: "07", name: "最終定錨驗證", check: (d) => d.metrics?.completionRate >= 0.70 && d.metrics?.factErrorRate <= 0.01 }
];

export function verifyVideo(data) {
  const results = GATES.map(g => ({
    gate: g.id,
    name: g.name,
    pass: g.check(data),
    score: g.check(data) ? 100 : 0
  }));
  const avgScore = results.reduce((a, r) => a + r.score, 0) / results.length;
  return { results, avgScore, allPassed: results.every(r => r.pass) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) { console.error("Usage: node verify_video.mjs <data.json>"); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const result = verifyVideo(data);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.allPassed ? 0 : 1);
}