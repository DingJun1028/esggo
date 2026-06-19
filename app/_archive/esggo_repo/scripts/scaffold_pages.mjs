import fs from 'fs/promises';
import path from 'path';

const WIKI_DIR = path.join(process.cwd(), '.wiki_temp');
const APP_DIR = path.join(process.cwd(), 'app');

async function scaffoldPages() {
  const files = await fs.readdir(WIKI_DIR);
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const content = await fs.readFile(path.join(WIKI_DIR, file), 'utf8');
    
    // Parse the markdown
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const routeMatch = content.match(/\*\*路徑：\*\*\s+`(\/[a-zA-Z0-9-]+)`/m);
    
    if (!titleMatch || !routeMatch) continue;
    
    const title = titleMatch[1].trim();
    const route = routeMatch[1].trim();
    
    // Skip root or editor as they are complex
    if (route === '/' || route === '/editor') continue;
    
    // Extract sections roughly
    const sections = content.split(/^##\s+/m).slice(1);
    
    let description = 'ESG GO 系統功能模組';
    const bentoBoxes = [];
    
    for (const section of sections) {
      const lines = section.split('\n');
      const sectionTitle = lines[0].trim();
      const sectionBody = lines.slice(1).join('\n').trim();
      
      if (sectionTitle.includes('功能定位')) {
        description = sectionBody.replace(/\n/g, ' ').substring(0, 150) + '...';
      }
      
      if (sectionTitle.length > 0 && sectionBody.length > 0) {
        bentoBoxes.push({
          title: sectionTitle,
          content: sectionBody.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^- /, '').trim())
        });
      }
    }
    
    // Create the React component code
    const pageCode = `import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';

export default function ${title.replace(/[^a-zA-Z0-9]/g, '') || 'Module'}Page() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            ${title}
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            ${description}
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${bentoBoxes.map((box, i) => `          <UniversalCard
            title="${box.title}"
            variant="${['default', 'glow', 'bordered', 'glass'][i % 4]}"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
${box.content.length > 0 ? box.content.map(item => `              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ${item.replace(/"/g, '&quot;')}</li>`).join('\n') : `              <li className="text-white/40 italic">參閱設計文件以獲取更多細節</li>`}
            </ul>
          </UniversalCard>`).join('\n')}
        </div>
      </div>
    </div>
  );
}
`;

    // Write to app/[route]/page.tsx
    const targetDir = path.join(APP_DIR, route.substring(1));
    await fs.mkdir(targetDir, { recursive: true });
    
    await fs.writeFile(path.join(targetDir, 'page.tsx'), pageCode, 'utf8');
    console.log(`Scaffolded ${route}`);
  }
}

scaffoldPages().catch(console.error);
