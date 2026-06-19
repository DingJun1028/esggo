import React, { useState } from 'react';
import {
  Schedule,
  Input,
  Psychology,
  Description,
  NotificationsActive,
  VerifiedUser,
  Extension,
  NearMe,
  PanTool,
  AddCircle,
  RemoveCircle,
  Refresh,
  Download,
  History as MuiHistory,
  Sync,
  Verified,
  CallSplit,
  Settings,
  MoreVert as MoreVertical,
  PlayArrow as Play,
} from '@mui/icons-material';
import {
  Clock,
  Cpu,
  FileText,
  Bell,
  ShieldCheck,
  Puzzle,
  MousePointer2,
  Hand,
  Plus,
  Minus,
  RotateCcw,
  Download as DownloadIcon,
  History as HistoryIcon,
  RefreshCw,
  Search,
  CheckCircle2,
  GitBranch,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ⚡ Smart Workflow Designer (Service 4.3)
 * --------------------------------------------------
 * "Node-based Automation & 5T Lifecycle Designer" for DingJun Hong.
 * Features: Visual Canvas, Component Library, Inspector Panel.
 */
export const SmartWorkflowDesigner = () => {
  const [selectedNode, setSelectedNode] = useState('ai-action');

  return (
    <div className="bg-[#102222] text-white h-screen font-display flex flex-col overflow-hidden selection:bg-[#0ab8b2]/20">
      {/* Top Header Navigation Overlay */}
      <header className="flex items-center justify-between px-8 py-4 backdrop-blur-3xl bg-[#111818]/60 border-b border-[#283939] z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 text-[#0ab8b2]">
            <div className="size-9 bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 rounded-xl flex items-center justify-center shadow-lg">
              <svg fill="currentColor" viewBox="0 0 48 48" className="size-6">
                <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" />
              </svg>
            </div>
            <h2 className="text-white text-lg font-black tracking-tight leading-none uppercase">
              ESGss JunAiKey
            </h2>
          </div>
          <nav className="hidden xl:flex items-center gap-10">
            {['控制面板', '智能工作流', '數據分析', '系統設置'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${i === 1 ? 'text-[#0ab8b2]' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 size-4 group-focus-within:text-[#0ab8b2] transition-colors" />
            <input
              className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-64 outline-none focus:ring-1 focus:ring-[#0ab8b2]/40"
              placeholder="搜尋工作流或組件 Search..."
            />
          </div>
          <button className="bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#111818] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95">
            <DownloadIcon size={14} /> 發佈流程 Publish
          </button>
          <div className="size-10 rounded-full border border-[#0ab8b2]/30 p-0.5 overflow-hidden">
            <div
              className="size-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Component Library */}
        <aside className="w-80 bg-[#111818] border-r border-[#283939] flex flex-col p-8 z-40">
          <div className="mb-10">
            <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-[#0ab8b2] uppercase mb-4 opacity-60">
              <span>首頁 Home</span> <span className="text-white/20">/</span>{' '}
              <span>智能工作流 Workflow</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white mb-2">組件庫 Library</h1>
            <p className="text-[#9cbab9] text-xs font-light italic">
              拖拽組件以串連自動化節點 <br />
              Drag components to build flow
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-10 custom-scrollbar pr-2">
            {[
              {
                title: '觸發器 Triggers',
                items: [
                  { label: '定時觸發器', icon: Schedule },
                  { label: '數據錄入觸發', icon: Input },
                ],
              },
              {
                title: '自動化操作 Actions',
                items: [
                  { label: 'AI 智算分析', icon: Psychology },
                  { label: '自動生成報告', icon: Description },
                  { label: '即時預警通知', icon: NotificationsActive },
                ],
              },
              {
                title: '生命週期 5T Hooks',
                items: [{ label: '5T 追溯性核驗', icon: VerifiedUser, specialized: true }],
              },
            ].map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {(section.items as any[]).map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-grab active:cursor-grabbing transition-all ${item.specialized ? 'bg-[#0ab8b2]/10 border-[#0ab8b2]/30 text-[#0ab8b2]' : 'bg-[#283939]/40 border-transparent text-white/80 hover:border-[#0ab8b2]/50 hover:bg-[#283939]/60'}`}
                    >
                      <item.icon className="size-5" />
                      <span className="text-[11px] font-black tracking-tight">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-[#283939]">
            <button className="w-full h-14 bg-[#283939] hover:bg-[#344b4b] text-white rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95 shadow-xl">
              <Extension className="size-5 text-[#0ab8b2]" /> 導入新插件 Import
            </button>
          </div>
        </aside>

        {/* Center: Canvas Area */}
        <section className="flex-1 relative bg-[#0d0d0d] overflow-hidden flex flex-col">
          {/* Canvas Dots Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #0ab8b2 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Canvas Floating Toolbar */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-3 backdrop-blur-3xl bg-white/[0.03] rounded-[2rem] border border-white/10 shadow-2xl">
            <button className="p-3 bg-white/5 hover:bg-[#0ab8b2] hover:text-[#111818] rounded-xl text-[#0ab8b2] transition-all">
              <NearMe fontSize="small" />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <div className="flex gap-2">
              {[PanTool, AddCircle, RemoveCircle, Refresh].map((Icon, i) => (
                <button
                  key={i}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 transition-all"
                >
                  <Icon fontSize="small" />
                </button>
              ))}
            </div>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button className="flex items-center gap-3 bg-[#0ab8b2]/10 text-[#0ab8b2] px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#0ab8b2]/30 active:scale-95 transition-all">
              <DownloadIcon size={12} /> 導出畫布 Export
            </button>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 relative overflow-hidden group">
            {/* Visual Title / Meta */}
            <div className="absolute top-12 left-12 space-y-2 pointer-events-none isolate z-10">
              <h2 className="text-5xl font-black tracking-tighter text-white opacity-80">
                4.3 智能工作流
              </h2>
              <p className="text-[#9cbab9] text-xl font-light italic opacity-60">
                設計與管理自動化流程，集成{' '}
                <span className="text-[#0ab8b2] font-black not-italic">5T</span> 生命週期鉤子
              </p>
            </div>

            <div className="absolute top-12 right-12 z-10">
              <button className="flex items-center gap-3 bg-[#283939] hover:bg-[#344b4b] px-6 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
                <MuiHistory sx={{ fontSize: 16 }} /> 版本歷史 History
              </button>
            </div>

            {/* SVG Connection Lines (Liquid Path Simulation) */}
            <svg className="absolute inset-0 size-full pointer-events-none">
              <defs>
                <linearGradient id="liquid-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ab8b2" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0ab8b2" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0ab8b2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                d="M 300 350 C 450 350, 450 450, 600 450"
                stroke="url(#liquid-flow)"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-[0_0_8px_#0ab8b2]"
              />
              <path
                d="M 850 450 C 950 450, 950 400, 1100 400"
                stroke="#0ab8b2"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                className="opacity-40"
              />
            </svg>

            {/* Nodes Library Simulation */}

            {/* Node 1: Trigger */}
            <motion.div
              drag
              initial={{ x: 140, y: 280 }}
              className="absolute backdrop-blur-3xl bg-[#111818]/80 rounded-[2.5rem] border border-white/10 p-8 w-72 shadow-2xl group cursor-move hover:ring-2 hover:ring-[#0ab8b2]/40 transition-all active:scale-95"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 rounded-2xl flex items-center justify-center text-[#0ab8b2]">
                  <Schedule />
                </div>
                <span className="bg-[#0ab8b2] text-[#111818] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                  5T Verified
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black tracking-tight text-white group-hover:text-[#0ab8b2] transition-colors">
                  每日結算觸發器
                </h4>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">
                  執行時間: 每日 23:59 (HKT)
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">
                  追溯碼 Trace: 5T-X921
                </span>
                <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              </div>
            </motion.div>

            {/* Node 2: AI Action (Selected) */}
            <motion.div
              drag
              initial={{ x: 550, y: 380 }}
              className="absolute backdrop-blur-3xl bg-[#111818]/90 rounded-[3rem] border-2 border-[#0ab8b2] p-10 w-96 shadow-[0_0_80px_rgba(10,184,178,0.1)] group cursor-move z-20"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="size-16 bg-[#0ab8b2]/20 border-2 border-[#0ab8b2]/40 rounded-3xl flex items-center justify-center text-[#0ab8b2] shadow-[0_0_20px_rgba(10,184,178,0.2)]">
                  <Psychology sx={{ fontSize: 32 }} />
                </div>
                <div className="flex gap-2">
                  <span className="bg-white/5 text-white/60 text-[9px] px-3 py-1 rounded-full uppercase font-black border border-white/10">
                    AI Model v4
                  </span>
                  <span className="bg-[#0ab8b2] text-[#111818] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    5T Hook
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <h4 className="text-2xl font-black tracking-tight text-white">碳足跡智能計算</h4>
                <p className="text-white/40 text-xs font-light leading-relaxed mb-4">
                  分析模型: <span className="text-white font-bold">ESG-Bert-L3</span> <br />
                  可信度閾值 Confidence: <span className="text-[#0ab8b2] font-black">98.2%</span>
                </p>

                <div className="bg-[#0d0d0d]/80 rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40 leading-none">分析進度 Dynamic Analysis</span>
                    <span className="text-[#0ab8b2] leading-none">74%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden relative p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '74%' }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="h-full bg-[#0ab8b2] rounded-full shadow-[0_0_10px_#0ab8b2]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                  追溯性驗證已激活 Life-Validated
                </span>
                <Verified className="text-[#0ab8b2] size-5" />
              </div>
            </motion.div>

            {/* Node 3: Condition Split */}
            <motion.div
              drag
              initial={{ x: 1050, y: 320 }}
              className="absolute backdrop-blur-3xl bg-[#111818]/60 rounded-[2.5rem] border border-white/5 p-8 w-64 opacity-50 group cursor-move hover:opacity-100 transition-opacity"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40">
                  <CallSplit />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black tracking-tight text-white/80">合規性條件分流</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest uppercase">
                  檢查排放標準 Review...
                </p>
              </div>
            </motion.div>
          </div>

          {/* Canvas Bottom Status Bar */}
          <footer className="h-14 bg-[#111818] border-t border-[#283939] px-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-white/40 leading-none">
                  系統良好 Healthy: JunAiKey Core v2.4
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/20">
                <Sync className="size-4 animate-spin-slow" />
                <span className="leading-none">同步狀態: 剛剛 Just Now</span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <span className="text-[#0ab8b2] font-black italic">
                5T 生命周期钩子 (5T Lifecycle Hooks) 標準受控中
              </span>
              <span className="text-white/20 border-l border-white/10 pl-10 h-6 flex items-center">
                畫布座標: X:1240 Y:840
              </span>
            </div>
          </footer>
        </section>

        {/* Right Sidebar: Inspector Panel */}
        <aside className="w-96 bg-[#111818] border-l border-[#283939] flex flex-col p-10 overflow-y-auto z-40">
          <div className="mb-10 space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tighter">節點配置 Inspector</h3>
            <p className="text-[#9cbab9] text-xs font-light italic uppercase tracking-widest">
              編輯組件參數 Edit Properties
            </p>
          </div>

          <div className="space-y-12 flex-1">
            <AnimatePresence mode="wait">
              {selectedNode === 'ai-action' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-12"
                >
                  <div className="bg-[#0ab8b2]/5 border border-[#0ab8b2]/20 rounded-3xl p-8 space-y-4 shadow-inner">
                    <div className="flex items-center gap-5 mb-2">
                      <div className="size-12 rounded-2xl bg-[#0ab8b2] text-[#111818] flex items-center justify-center shadow-lg">
                        <Psychology />
                      </div>
                      <span className="text-white font-black text-lg tracking-tight">
                        碳足跡智能計算
                      </span>
                    </div>
                    <p className="text-[11px] font-light leading-relaxed text-[#9cbab9]">
                      使用者 AI 模型負責實時追蹤並核算所有 5T
                      節點的數據完整度，確保審計鏈條不可篡改。
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                        節點名稱 Node Name
                      </label>
                      <input
                        className="w-full h-14 bg-[#283939]/40 border border-white/5 rounded-2xl px-6 text-sm font-black text-[#0ab8b2] focus:ring-1 focus:ring-[#0ab8b2] outline-none transition-all"
                        type="text"
                        defaultValue="碳足跡智能計算"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                        AI 模型選擇 Model Selector
                      </label>
                      <div className="relative group">
                        <select className="w-full h-14 bg-[#283939]/40 border border-white/5 rounded-2xl px-6 text-sm font-black text-white/80 appearance-none focus:ring-1 focus:ring-[#0ab8b2] outline-none cursor-pointer">
                          <option>ESG-Bert-L3 (精準模式)</option>
                          <option>FastCompute-V2 (快速模式)</option>
                        </select>
                        <ChevronRight
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90"
                          size={16}
                        />
                      </div>
                    </div>

                    <div className="space-y-6 pt-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                        5T 鉤子設置 Lifecycle Hooks
                      </label>
                      <div className="space-y-4">
                        {[
                          { label: '啟用可追溯性 (Traceability)', active: true },
                          { label: '啟用透明度 (Transparency)', active: true },
                          { label: '信任驗證 (Trust)', active: false },
                        ].map((hook, i) => (
                          <label
                            key={i}
                            className={`flex items-center justify-between p-6 rounded-3xl transition-all cursor-pointer border ${hook.active ? 'bg-[#0ab8b2]/5 border-[#0ab8b2]/30 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                          >
                            <span className="text-[11px] font-black tracking-tight">
                              {hook.label}
                            </span>
                            <div
                              className={`size-6 rounded-lg border flex items-center justify-center transition-all ${hook.active ? 'bg-[#0ab8b2] border-[#0ab8b2]' : 'bg-transparent border-white/20'}`}
                            >
                              {hook.active && <CheckCircle2 size={14} className="text-[#111818]" />}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 space-y-4">
            <button className="w-full h-16 bg-[#0ab8b2] text-[#111818] rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
              保存設置 Save Settings
            </button>
            <button className="w-full h-16 bg-white/5 text-red-400 font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl border border-white/5 hover:bg-red-400/10 transition-all active:scale-95">
              刪除節點 Delete Node
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
