import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import WikiClient from './WikiClient';

// ═══════════════════════════════════════════════════════════════
// WIKI Knowledge Base — Server Component (reads filesystem)
// Passes data to WikiClient for interactive search/filter
// ═══════════════════════════════════════════════════════════════

interface WikiFile {
  slug: string;
  title: string;
  category: string;
  hashLock: string;
}

function getWikiFiles(): WikiFile[] {
  const wikiDir = path.join(process.cwd(), 'wiki', 'wiki');
  try {
    const files = fs.readdirSync(wikiDir).filter(file => file.endsWith('.md'));
    return files.map(file => {
      const slug = file.replace(/\.md$/, '');
      const title = slug.replace(/-/g, ' ');
      const hashLock = `0x${crypto.createHash('md5').update(slug).digest('hex').slice(0, 8)}...`;

      let category = 'general';
      const lower = slug.toLowerCase();
      if (lower.includes('gri') || lower.includes('tcfd') || lower.includes('csrd') || lower.includes('esg')) category = 'standard';
      else if (lower.includes('api') || lower.includes('dev') || lower.includes('code') || lower.includes('test')) category = 'development';
      else if (lower.includes('deploy') || lower.includes('vps') || lower.includes('docker') || lower.includes('ci')) category = 'devops';
      else if (lower.includes('guide') || lower.includes('manual') || lower.includes('使用') || lower.includes('tutorial')) category = 'guide';
      else if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('style')) category = 'design';

      return { slug, title, category, hashLock };
    });
  } catch {
    return [];
  }
}

export default function WikiIndexPage() {
  const files = getWikiFiles();
  return <WikiClient files={files} />;
}
