import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';

export default function DigitalTwinPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            數位分身 Digital Twin
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            Digital Twin 是企業治理知識的數位映射中心，負責承載企業價值觀、知識資產與治理記憶。...
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 道德 DNA 滑桿</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> RAG 知識倉庫</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 主權帳本</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 治理知識映射</li>
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
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 建立企業專屬治理知識庫</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 保留長期 ESG 記憶與脈絡</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 讓 AI 更貼近企業文化與價值</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="頁面目標"
            variant="glow"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 建立企業可持續的知識分身</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 讓 AI 生成更具主權性與一致性</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 強化知識的持久化與治理性</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="解決的痛點"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> ESG 知識散落</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 每次寫報告都重新找資料</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> AI 難理解企業歷史脈絡</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="目前成果"
            variant="glass"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已具備道德 DNA 與 RAG 模組設計</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已形成主權帳本追蹤邏輯</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 已成為平台差異化核心能力之一</li>
            </ul>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
