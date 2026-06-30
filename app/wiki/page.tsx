import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { OmniBaseCard } from '@/components/omni-base-card';

export default function WikiIndexPage() {
  const wikiDir = path.join(process.cwd(), 'wiki', 'wiki');
  let files: string[] = [];
  
  try {
    files = fs.readdirSync(wikiDir).filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error("Failed to read wiki directory:", error);
  }

  return (
    <div className="min-h-[calc(100vh-52px)] p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accentTeal flex items-center justify-center text-2xl text-white shadow-[0_0_15px_rgba(0,158,176,0.6)]">
          📚
        </div>
        <div>
          <h1 className="font-['Montserrat',sans-serif] text-3xl font-bold text-accentTeal">WIKI 知識庫</h1>
          <div className="text-sm text-textSecondary mt-1">產品開發級 · 共 {files.length} 篇知識資產</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => {
          const slug = file.replace(/\.md$/, '');
          const title = slug.replace(/-/g, ' ');

          return (
            <Link key={slug} href={`/wiki/${encodeURIComponent(slug)}`}>
              <OmniBaseCard 
                variant="liquid-glass" 
                className="h-full flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg !p-5"
                statusIndicator="trustworthy"
                hashLock={`0x${Math.random().toString(16).slice(2,10)}...`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accentTeal/10 flex items-center justify-center text-accentTeal font-bold">
                    W
                  </div>
                  <span className="text-[10px] text-accentTeal bg-accentTeal/10 px-2 py-1 rounded-full font-bold">
                    OmniCore Asset
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-textPrimary mb-2 line-clamp-2 leading-tight">
                  {title}
                </h2>
                
                <div className="mt-auto pt-4 border-t border-borderColor/30 flex items-center justify-between text-xs text-textSecondary">
                  <span>Markdown 格式</span>
                  <span className="font-['Fira_Code',monospace]">5T 封印完成</span>
                </div>
              </OmniBaseCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
