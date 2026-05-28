import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            代理專區 Agents
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            代理專區用於支撐平台推廣、代理體系與獎勵運營機制。...
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 代理階級</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 推廣碼管理</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> GoodCoin 錢包</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 推廣績效追蹤</li>
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 代理招募</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 推廣追蹤</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 獎勵機制運作</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="頁面目標"
            variant="glow"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 建立平台外部擴散機制</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 支援代理制度與成長飛輪</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="解決的痛點"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 平台推廣缺乏制度化代理系統</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="目前成果"
            variant="glass"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已形成代理運營頁面概念</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已導入 GoodCoin 與階級系統設定</li>
            </ul>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
