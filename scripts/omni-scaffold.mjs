import fs from 'fs';
import path from 'path';

/**
 * OmniScaffold: ESGGO WIKI-Driven Development Generator
 * v1.0.0 | Commanded by OmniAgent
 */

const WIKI_DIR = './docs/wiki';
const APP_DIR = './app';
const LIB_DIR = './lib';
const TEST_DIR = './tests';

function parseWiki(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const nameMatch = content.match(/# (.*?) \[(.*?)\]/);
  const pathMatch = content.match(/路徑： `\/(.*?)`/);
  const techMatch = content.match(/使用的技術： (.*?)\./);
  
  // Extract Quality Red Lines
  const redLines = [];
  const redLinesMatch = content.match(/🚨 (.*?)\n/g);
  if (redLinesMatch) {
    redLinesMatch.forEach(line => redLines.push(line.replace('🚨 ', '').trim()));
  }

  return {
    displayName: nameMatch ? nameMatch[1] : 'Unknown',
    englishName: nameMatch ? nameMatch[2] : 'unknown',
    routePath: pathMatch ? pathMatch[1] : 'unknown',
    techStack: techMatch ? techMatch[1] : 'React, Tailwind',
    redLines: redLines
  };
}

function generatePageCode(meta) {
  return `'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { ShieldCheck, Search, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ${meta.displayName} Page
 * Generated from WIKI: docs/wiki/${meta.englishName}.md
 */
export default function ${meta.englishName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            OmniCore 5T 認證模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
            <ShieldCheck className="text-cyan-core" /> ${meta.displayName} ${meta.englishName}
          </h1>
          <p className="text-lg text-white/60">
            自動化生成的 5T 誠信模組。基於 WIKI 規範與液態玻璃視覺 DNA。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UniversalCard variant="glow" title="5T 誠信狀態">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles size={16} /> 數據已 Hash 鎖定
            </div>
          </UniversalCard>
        </div>

        <UniversalCard variant="bordered" title="操作面板">
          <div className="p-8 text-center space-y-6">
            <UniversalButton 
              variant="primary" 
              size="lg" 
              onClick={handleAction}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : '執行 5T 掃描'}
            </UniversalButton>
          </div>
        </UniversalCard>

        {/* 品質紅線自我檢測清單 */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xs font-black uppercase text-white/30 tracking-widest mb-4">品質驗收紅線 (QA Red Lines)</h3>
          <ul className="space-y-2">
            ${meta.redLines.map(line => `<li className="text-xs text-rose-400/70 flex items-center gap-2">🚨 ${line}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </div>
  );
}
`;
}

async function run() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/omni-scaffold.mjs <wiki-filename>');
    process.exit(1);
  }

  const wikiFile = args[0].endsWith('.md') ? args[0] : `${args[0]}.md`;
  const wikiPath = path.join(WIKI_DIR, wikiFile);

  if (!fs.existsSync(wikiPath)) {
    console.error(`Error: WIKI file not found at ${wikiPath}`);
    process.exit(1);
  }

  console.log(`[OmniScaffold] Reading WIKI: ${wikiPath}...`);
  const meta = parseWiki(wikiPath);
  
  const targetDir = path.join(APP_DIR, meta.routePath);
  const pageFile = path.join(targetDir, 'page.tsx');

  console.log(`[OmniScaffold] Generating Page: ${pageFile}...`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(pageFile, generatePageCode(meta));

  console.log(`[OmniScaffold] Done! ✨`);
}

run();
