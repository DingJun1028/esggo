'use client';

import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StandardPage from '../../components/brand/StandardPage';
import { UniversalPageConfig } from '../../lib/page-config';
import { BookOpen } from 'lucide-react';

export default function WikiClientPage({ content }: { content: string }) {
  const pageConfig: UniversalPageConfig = {
    id: 'wiki-omni',
    title: 'ESGGO 系統智庫 (Wiki)',
    subtitle: 'System Architecture & 5T Protocol',
    icon: <BookOpen />,
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    isOXModule: true,
    griReference: 'OMNI-WIKI',
    sections: [
      {
        id: 'wiki-content',
        title: '知識庫內容',
        columns: 12,
        component: (
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#003262] prose-headings:text-[#003262] prose-a:text-[#009E9D] prose-code:text-[#003262] prose-code:bg-slate-100 prose-pre:bg-[#002244] prose-pre:text-slate-100 rounded-lg">
            <Markdown remarkPlugins={[remarkGfm]}>
              {content}
            </Markdown>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
