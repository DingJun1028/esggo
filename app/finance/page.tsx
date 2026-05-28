import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            永續財務 Finance
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            永續財務頁用於把 ESG 議題轉換成財務分析語言，協助企業衡量永續投資效益與風險衝擊。...
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UniversalCard
            title="功能定位"
            variant="default"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="text-white/40 italic">參閱設計文件以獲取更多細節</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="功能說明"
            variant="glow"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="text-white/40 italic">參閱設計文件以獲取更多細節</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="主要內容"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG ROI 分析</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> TCFD 財務影響評估</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 碳價壓力測試</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 投資回收期估算</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="使用方式"
            variant="glass"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="text-white/40 italic">參閱設計文件以獲取更多細節</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="使用場景"
            variant="default"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 綠色投資效益評估</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 財務風險與氣候衝擊分析</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG 與 CFO 對話情境</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="頁面目標"
            variant="glow"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 建立 ESG 與財務的橋接能力</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 支援策略與投資判斷</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="解決的痛點"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG 與財務常被分開看待</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 投資回報缺少量化說明</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="目前成果"
            variant="glass"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已規劃 Finance ROI 結構</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已形成永續財務頁面定位</li>
            </ul>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
