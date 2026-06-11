import fs from 'fs';
import path from 'path';

// This script reads config/navigation.ts and generates missing page.tsx files
// using the Cyan Sovereignty / LiquidGlass design system.

const navigationContent = fs.readFileSync(path.join(process.cwd(), 'config', 'navigation.ts'), 'utf-8');

// Regex to extract path, title, sub, icon
const itemsRegex = /{\s*id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*path:\s*['"]([^'"]+)['"],\s*icon:\s*['"]([^'"]+)['"](?:,\s*sub:\s*['"]([^'"]+)['"])?/g;

let match;
const pages = [];

while ((match = itemsRegex.exec(navigationContent)) !== null) {
  pages.push({
    id: match[1],
    title: match[2],
    path: match[3],
    icon: match[4],
    sub: match[5] || 'Overview'
  });
}

const getTemplate = (title, sub, icon, id) => {
  return `'use client';

import React from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { ${icon}, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ${id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, '')}Page() {
  return (
    <div className="min-h-screen p-4 md:p-8 w-full bg-[#020617] text-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <${icon} className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">${title}</h1>
              <p className="text-cyan-400 mt-1 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                ${sub}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <OmniBaseCard variant="glass" className="h-[400px] border-cyan-500/20 bg-black/40 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="z-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white">模組初始化中 (Module Initializing)</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  「${title}」模組的底層資料架構已對齊 5T 協議，功能正在進行最後的封裝與部署測試。
                </p>
              </div>
            </OmniBaseCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <OmniBaseCard variant="glow" title="5T Integrity Status" className="bg-black/60">
              <div className="space-y-4">
                {[
                  { label: 'Traceable', desc: '來源可溯' },
                  { label: 'Transparent', desc: '算法透明' },
                  { label: 'Tangible', desc: '指標具體' },
                  { label: 'Trustworthy', desc: '不可篡改' },
                  { label: 'Trackable', desc: '生命週期' }
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono text-sm text-slate-300">{t.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">{t.desc}</span>
                  </div>
                ))}
              </div>
            </OmniBaseCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
`;
};

console.log(\`Found \${pages.length} pages in navigation.ts\`);

let createdCount = 0;

pages.forEach(page => {
  // Skip root path
  if (page.path === '/') return;

  const targetDir = path.join(process.cwd(), 'app', page.path);
  const targetFile = path.join(targetDir, 'page.tsx');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (!fs.existsSync(targetFile)) {
    fs.writeFileSync(targetFile, getTemplate(page.title, page.sub, page.icon, page.id));
    console.log(\`Created: \${page.path}/page.tsx\`);
    createdCount++;
  }
});

console.log(\`Done. Created \${createdCount} missing pages.\`);
