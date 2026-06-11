const fs = require('fs');
const path = require('path');

// Read navigation.ts content and extract paths and titles
const navFile = fs.readFileSync(path.join(__dirname, '../config/navigation.ts'), 'utf8');

const regex = /id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*path:\s*'([^']+)',\s*icon:\s*'([^']+)',\s*sub:\s*'([^']+)'/g;
let match;
const pages = [];

while ((match = regex.exec(navFile)) !== null) {
  pages.push({
    id: match[1],
    title: match[2],
    route: match[3],
    icon: match[4],
    sub: match[5]
  });
}

console.log(`Found ${pages.length} pages to generate.`);

const appDir = path.join(__dirname, '../app');

pages.forEach(p => {
  if (p.route === '/') return; // skip dashboard

  const pageDir = path.join(appDir, p.route.replace(/^\//, ''));
  const pagePath = path.join(pageDir, 'page.tsx');

  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  let shouldWrite = true;
  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf8');
    // Keep existing complex pages, overwrite placeholders or empty files
    if (content.length > 800 && !content.includes('UniversalEmptyState')) {
      shouldWrite = false;
    }
  }

  if (shouldWrite) {
    const componentName = p.route.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-./g, x => x[1].toUpperCase())).join('') + 'Page';
    const iconName = p.icon;

    const content = `'use client';

import React from 'react';
import { UniversalCard, UniversalEmptyState } from '@/components/ui/universal';
import { ${iconName} } from 'lucide-react';

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-core/10 flex items-center justify-center border border-cyan-core/30">
              <${iconName} className="text-cyan-core" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">${p.title}</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-1">${p.sub}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UniversalCard 
              variant="glass" 
              title="功能實作區" 
              subtitle="The Universal UI component for this feature."
            >
              <UniversalEmptyState 
                icon={<${iconName} size={40} className="text-slate-600" />}
                title="${p.title} 模組開發中"
                description="This module is currently being built following the 5T Integrity Protocol."
                action={{
                  label: "查看規格文件",
                  onClick: () => window.location.href = '/wiki'
                }}
              />
            </UniversalCard>
          </div>
          
          <div className="space-y-6">
            <UniversalCard 
              variant="outline" 
              title="模組資訊" 
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">模組 ID</span>
                  <span className="text-cyan-400 font-mono text-sm">${p.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">路由</span>
                  <span className="text-emerald-soul font-mono text-sm">${p.route}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">5T 驗證狀態</span>
                  <span className="text-amber-400 font-mono text-sm">Pending</span>
                </div>
              </div>
            </UniversalCard>
          </div>
        </div>

      </div>
    </div>
  );
}
`;
    fs.writeFileSync(pagePath, content);
    console.log(`Generated page: ${p.route}`);
  } else {
    console.log(`Skipped existing complex page: ${p.route}`);
  }
});
