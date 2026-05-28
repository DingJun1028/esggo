import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            任務中心 Tasks
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            任務中心是跨部門 ESG 協作與治理執行的工作看板。...
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 任務清單</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 優先級管理</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 進度追蹤</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 負責人與截止日</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 5T 一致性檢查</li>
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 任務分派</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 跨部門協作</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 進度追蹤</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="頁面目標"
            variant="glow"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 讓 ESG 工作具備可執行性</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 建立跨模組落地治理機制</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="解決的痛點"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG 任務跨部門易失控</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 進度難同步</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="目前成果"
            variant="glass"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已建立 Tasks 邏輯資料結構</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已形成任務看板頁面定位</li>
            </ul>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
