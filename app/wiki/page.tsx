import React from 'react';
import fs from 'fs';
import path from 'path';
import WikiClientPage from './WikiClientPage';

export const metadata = {
  title: 'ESGGO Wiki | OmniCore',
  description: 'ESGGO System Architecture and 5T Governance Protocol',
};

export default function WikiPage() {
  // Read WIKI.md from project root
  const wikiFilePath = path.join(process.cwd(), 'WIKI.md');
  let wikiContent = '';
  try {
    wikiContent = fs.readFileSync(wikiFilePath, 'utf8');
  } catch (err) {
    wikiContent = '# Error\nCould not load WIKI.md content.';
  }

  return (
    <WikiClientPage content={wikiContent} />
  );
}
