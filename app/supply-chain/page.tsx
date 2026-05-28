import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';

export default function SupplyChainPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            供應鏈透明 Supply Chain
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            供應鏈透明頁負責供應商 ESG 評估、承諾追蹤與風險透明化管理。...
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 供應商名單</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG 評分</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 風險等級</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 承諾書追蹤</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 在地採購狀態</li>
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 供應商篩選</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG 風險管理</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 在地採購與承諾追蹤</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="頁面目標"
            variant="glow"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 建立供應鏈透明治理機制</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 幫助企業辨識供應鏈風險</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="解決的痛點"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 供應鏈風險不透明</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 承諾文件與評分紀錄難整合</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="目前成果"
            variant="glass"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已建立 Suppliers 邏輯資料設計</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已形成供應鏈頁面核心功能架構</li>
            </ul>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
