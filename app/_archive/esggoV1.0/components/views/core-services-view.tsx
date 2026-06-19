"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ServiceExplanationCard } from "@/components/ui/service-explanation-card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  GitBranch,
  Bot,
  Copy,
  Edit3,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

export function CoreServicesView() {
  return (
    <div className="space-y-12 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-stitch-text tracking-tight mb-2">
          核心服務組件 UI 範本彙整 (Core Services UI Templates)
        </h1>
        <p className="text-stitch-muted mb-8 text-sm">
          展示系統核心 UI 組件與數據驅動渲染邏輯，涵蓋動態表單、可配置儀表板與數據驗證流程之樣式與操作。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ServiceExplanationCard
            title="Sentient UI 視覺系統"
            description="基於 Glassmorphism 與極端簡約主義之設計語言，強調透明感與高品質微動畫的用戶環境。"
            icon={<LayoutDashboard className="w-6 h-6" />}
            features={["Glassmorphism", "Minimalist", "動態反饋"]}
            color="var(--color-stitch-gold)"
          />
          <ServiceExplanationCard
            title="OmniAPI 數據對接"
            description="無縫集成企業 ERP/CRM 數據來源，實現零時差 ESG 數據同步與重大性指標計算。"
            icon={<GitBranch className="w-6 h-6" />}
            features={["自動化對接", "即時更新", "數據校驗"]}
            color="var(--color-stitch-teal-start)"
          />
        </div>
      </div>

      {/* 1. 儀表板摘要資訊卡 (Dashboard Hero Card) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-stitch-text flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-stitch-teal-start" />
          1. 儀表板摘要資訊卡 (Dashboard Hero Card)
        </h2>
        <GlassCard className="p-8 border-l-4 border-l-stitch-teal-start">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-stitch-text mb-1">
                2025 永續報告撰寫總體進度
              </h3>
              <p className="text-stitch-muted font-medium">
                Aurora Green Manufacturing | 9 structured chapters
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="optimal" styleType="soft">GRI</Badge>
              <Badge variant="optimal" styleType="soft">ESRS</Badge>
              <Badge variant="optimal" styleType="soft">IFRS S1</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest">關鍵數據 (Key Metrics)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stitch-shallow-gray p-4 rounded-lg border border-stitch-border">
                  <p className="text-[10px] text-stitch-muted mb-1 uppercase font-bold tracking-wider">已生成章節</p>
                  <p className="text-2xl font-bold text-stitch-text">7<span className="text-sm text-stitch-muted font-normal">/9</span></p>
                </div>
                <div className="bg-stitch-shallow-gray p-4 rounded-lg border border-stitch-border">
                  <p className="text-[10px] text-stitch-muted mb-1 uppercase font-bold tracking-wider">預估頁數</p>
                  <p className="text-2xl font-bold text-stitch-text">218</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest">撰寫基調 (Writing Posture)</h4>
              <div className="bg-stitch-shallow-gray p-4 rounded-lg border border-stitch-border h-[88px] flex items-center">
                <p className="text-sm text-stitch-text">
                  <span className="font-bold text-stitch-teal-start">專業商務</span> | 語氣中性且遵循合規規範，強調數據之真實透明與分析深度。
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-stitch-border pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-stitch-text">2025 永續報告草案 v7</h4>
                  <Badge variant="optimal" styleType="solid">已完成</Badge>
                </div>
                <p className="text-sm text-stitch-muted">
                  77% 的內容已準備就緒，包含最新的環境面指標與治理架構說明。
                </p>
              </div>
              <button className="px-4 py-2 bg-stitch-text text-white rounded-lg text-sm font-bold hover:bg-stitch-text/90 transition-all duration-200 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                更新即時生成預覽
              </button>
            </div>
            <div className="w-full bg-stitch-shallow-gray rounded-full h-1.5">
              <div className="bg-gradient-to-r from-stitch-teal-start to-stitch-teal-end h-1.5 rounded-full" style={{ width: '77%' }}></div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 2. 雙語內容預覽卡 (Bilingual Content Preview Card) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-stitch-text flex items-center gap-2">
          <FileText className="w-5 h-5 text-stitch-teal-start" />
          2. 雙語內容預覽卡 (Bilingual Content Preview Card)
        </h2>
        <GlassCard className="p-8 border-l-4 border-l-stitch-teal-start">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 border-b border-stitch-border pb-6">
            <div>
              <h3 className="text-xl font-bold text-stitch-text mb-2">
                封面故事與董事長致詞 <span className="text-stitch-muted font-normal">/ Cover Story & Chair Statement</span>
              </h3>
              <p className="text-sm text-stitch-text bg-stitch-shallow-gray p-3 rounded-lg border border-stitch-border inline-block">
                <span className="font-bold text-stitch-teal-start">撰寫策略：</span>以宏觀視角展示企業在不確定環境下的氣候韌性與韌性發展。
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-stitch-muted bg-stitch-shallow-gray px-3 py-1.5 rounded-lg border border-stitch-border">
              <span>2 Pages</span>
              <span className="text-stitch-border">|</span>
              <span className="text-stitch-optimal font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> generated</span>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-bold text-stitch-text uppercase tracking-widest text-[10px]">雙語對譯預覽 / Bilingual Preview</h4>
              <Badge variant="critical" styleType="soft">待人工終審</Badge>
              <span className="text-[10px] text-stitch-muted font-bold uppercase tracking-widest">當前版本 v1</span>
            </div>
            <button className="text-xs font-bold text-stitch-teal-start hover:text-stitch-teal-end flex items-center gap-1 transition-colors uppercase tracking-widest">
              <Edit3 className="w-4 h-4" /> 進入編輯器
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stitch-shallow-gray p-5 rounded-lg border border-stitch-border relative group">
              <Badge className="absolute -top-3 left-4 bg-stitch-text text-white border-none shadow-sm capitalize">繁體中文</Badge>
              <p className="text-stitch-text text-sm leading-relaxed mt-2">
                在過去的一年中，我們始終堅持深耕永續藍圖，將環境、社會與治理（ESG）原則深度融入企業的核心營運。面對全球氣候變遷帶來的嚴峻挑戰，我們不僅致力於減少碳足跡，更積極投入綠色創新技術的研究開發，以確保在轉型過程中持續創造長遠價值。
              </p>
            </div>
            <div className="bg-stitch-shallow-gray p-5 rounded-lg border border-stitch-border relative group">
              <Badge className="absolute -top-3 left-4 bg-stitch-text text-white border-none shadow-sm font-mono text-[10px]">FORMAL UK ENGLISH</Badge>
              <p className="text-stitch-text text-sm leading-relaxed mt-2 font-serif italic text-stitch-muted">
                Over the past year, we have steadfastly advanced our sustainability blueprint, deeply integrating Environmental, Social, and Governance (ESG) principles into the core of our corporate operations. In the face of severe global climate challenges, we are not only dedicated to carbon reduction but also active in green tech innovation.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 3. 合規缺失檢查卡 (Readiness Checklist Card) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-stitch-text flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-stitch-critical" />
          3. 合規缺失檢查卡 (Readiness Checklist Card)
        </h2>
        <GlassCard className="p-8 border-l-4 border-l-stitch-critical">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-stitch-text mb-2">
                缺失項目清單 <span className="text-stitch-muted font-normal">/ Missing disclosures</span>
              </h3>
              <p className="text-sm text-stitch-muted">
                系統偵測到 1 項關鍵指標尚未完成數據匯入，這將影響匯出報告的合規性。
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stitch-muted font-bold uppercase tracking-widest">合規評分:</span>
                <span className="text-2xl font-bold text-stitch-text">24<span className="text-sm text-stitch-muted font-normal">/30</span></span>
              </div>
              <Badge variant="lethal" styleType="solid" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> 立即行動
              </Badge>
            </div>
          </div>

          <div className="bg-stitch-lethal/5 border border-stitch-lethal/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertCircle className="w-5 h-5 text-stitch-lethal" />
              </div>
              <div>
                <h4 className="font-bold text-stitch-lethal text-sm">GRI 305-1: 直接 (範疇一) 溫室氣體排放</h4>
                <p className="text-sm text-stitch-lethal/80 mt-1">
                  目前的數據庫中缺少 2024 年第四季的燃料使用數據，請回填數據或上傳對應憑證。
                </p>
                <button className="mt-3 text-xs font-bold text-stitch-lethal hover:underline uppercase tracking-widest">
                  解決此問題
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 4. 專案階段進程卡 (Lifecycle Stage Card) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-stitch-text flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-stitch-optimal" />
          4. 專案生命週期進程卡 (Lifecycle Stage Card)
        </h2>
        <GlassCard className="p-8 border-l-4 border-l-stitch-optimal">
          <div className="flex justify-between items-center mb-6 border-b border-stitch-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stitch-optimal/10 flex items-center justify-center text-stitch-optimal font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-stitch-text">
                啟動規劃 <span className="text-stitch-muted text-sm font-normal ml-2">Stage 1</span>
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-stitch-muted uppercase tracking-widest font-bold mb-1">主責單位 (Owner)</p>
              <p className="text-[10px] font-bold text-stitch-teal-start bg-stitch-teal-start/10 px-3 py-1 rounded-full uppercase tracking-widest">永續發展室 / 行政管理部</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest mb-2">本階段目標 (Task)</h4>
              <p className="text-stitch-text text-sm leading-relaxed bg-stitch-shallow-gray p-4 rounded-lg border border-stitch-border h-full">
                確立撰寫策略與揭露準則基準，並同步完成年度重大性議題之利害關係人調查與分析報告。
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest mb-2">階段產出物 (Deliverable)</h4>
              <div className="bg-stitch-shallow-gray p-4 rounded-lg border border-stitch-border h-full flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-stitch-border shadow-minimal">
                  <FileText className="w-5 h-5 text-stitch-teal-start" />
                </div>
                <div>
                  <p className="font-bold text-stitch-text text-sm">專案章程與合規清單</p>
                  <p className="text-[10px] text-stitch-muted mt-0.5 uppercase font-bold tracking-wider">Project Charter & Standards List</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
