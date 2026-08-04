import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { OmniBaseCard } from '@/components/omni-base-card';

// Ensure this runs purely on the server to read the file system
export const dynamicParams = true; // allow dynamic slugs not covered by generateStaticParams

interface WikiPageProps {
  params: {
    slug: string;
  };
}

export default function WikiPage({ params }: WikiPageProps) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  const baseDir = path.resolve(process.cwd(), 'wiki', 'wiki');
  const filePath = path.resolve(baseDir, `${decodedSlug}.md`);
  
  let content = '';
  let error = '';

  try {
    if (!filePath.startsWith(baseDir + path.sep)) {
      throw new Error('Invalid file path');
    }
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    error = '查無此 WIKI 文件。請確認檔名是否正確。';
    console.error("Error reading wiki file:", err);
  }

  const title = decodedSlug.replace(/-/g, ' ');

  return (
    <div className="min-h-[calc(100vh-52px)] p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/wiki" className="inline-flex items-center text-sm font-semibold text-accentTeal hover:text-accentTeal/80 transition-colors">
          ← 返回 WIKI 知識庫總覽
        </Link>
      </div>

      <OmniBaseCard 
        variant="liquid-glass" 
        className="!p-8 md:!p-12"
        statusIndicator="trustworthy"
        hashLock={`0x${crypto.createHash('md5').update(decodedSlug).digest('hex').slice(0, 8)}...`}
      >
        <div className="border-b border-borderColor/30 pb-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-textPrimary leading-tight">
              {title}
            </h1>
            <span className="shrink-0 text-xs text-accentTeal bg-accentTeal/10 px-3 py-1.5 rounded-full font-bold ml-4">
              5T 驗算通過
            </span>
          </div>
          <div className="text-sm text-textSecondary font-['Fira_Code',monospace]">
            Source: /wiki/{decodedSlug}.md
          </div>
        </div>

        {error ? (
          <div className="text-red-500 font-bold bg-red-500/10 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <article className="prose dark:prose-invert prose-teal max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        )}
      </OmniBaseCard>
    </div>
  );
}
