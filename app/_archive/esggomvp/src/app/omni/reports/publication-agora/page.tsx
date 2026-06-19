'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Share2, Globe, ExternalLink, Download, Eye, MessageSquare, Zap } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { OmniEsgCell } from '@/components/omni/cards/OmniEsgCell';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';

interface PublicReport {
  id: string;
  title: { tw: string; en: string };
  date: string;
  views: number;
}

const publicReports: PublicReport[] = [
  { id: 'PUB-001', title: { tw: '2024 環境影響摘要', en: '2024 Environment Impact Summary' }, date: '2026-01-20', views: 1240 },
  { id: 'PUB-002', title: { tw: '永續供應鏈白皮書', en: 'Sustainable Supply Chain Whitepaper' }, date: '2025-11-15', views: 856 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function PublicationAgoraPage() {
  const { locale } = useLanguage();
  const langKey = locale === 'en' ? 'en' : 'tw';

  return (
    <div className="min-h-screen bg-omni-surface text-omni-text-main p-8">
      <PageHeader
        title={langKey === 'tw' ? '發布廣場' : 'Publication Agora'}
        subtitle={langKey === 'tw' ? '與世界分享您的永續實踐成果。讓每一項 5T 資產成為社會共鳴的頻率。' : 'Sharing your sustainability achievements with the world. Resonating through 5T assets.'}
        category="PUBLIC DISCLOSURE"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <Globe className="text-omni-primary" />
              {langKey === 'tw' ? '公開永續資產庫' : 'Public Sustanability Assets'}
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {publicReports.map((report, idx) => (
                <div key={report.id} className="relative group">
                  <OmniEsgCell
                    id={report.id}
                    mode="list"
                    label={report.title[langKey]}
                    value="VERIFIED"
                    subValue={`PUBLISHED: ${report.date} | VIEWS: ${report.views}`}
                    category={idx % 2 === 0 ? 'environmental' : 'social'}
                    sentientState={{
                      entropy: 0.05,
                      harmony: 0.95,
                      resonance: 92,
                      phase: 'PUBLISH'
                    }}
                    onClick={() => { }}
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-4 pr-4">
                    <button className="flex items-center gap-2 bg-omni-primary text-white px-6 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-omni-primary/20 hover:scale-105 active:scale-95">
                      <Download size={14} /> {langKey === 'tw' ? '下載 PDF' : 'Download'}
                    </button>
                    <button className="flex items-center gap-2 border border-omni-glass-border text-omni-primary backdrop-blur-md hover:bg-omni-primary/5 px-6 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95">
                      <ExternalLink size={14} /> {langKey === 'tw' ? '線上查看' : 'View Online'}
                    </button>
                    <button className="p-2 text-omni-text-muted hover:text-omni-primary transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <LiquidGlassContainer className="p-8 h-fit space-y-8 border-l-4 border-l-omni-primary">
            <div>
              <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                <Zap size={18} className="text-omni-accent" />
                {langKey === 'tw' ? '發布指南' : 'Publication Guide'}
              </h2>
              <ul className="space-y-6">
                {[
                  { tw: '遵守 GRI/SASB 最新揭露準則。', en: 'Follow latest GRI/SASB disclosure guidelines.' },
                  { tw: '確保 5T 協議數據封印完整。', en: 'Ensure 5T protocol data seals are complete.' },
                  { tw: '多渠道一鍵發布設定。', en: 'Multi-channel one-click publishing setup.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-sm text-omni-text-sub font-medium leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-omni-primary shrink-0" />
                    {item[langKey]}
                  </li>
                ))}
              </ul>
            </div>
          </LiquidGlassContainer>
        </div>
      </div>
    </div>
  );
}