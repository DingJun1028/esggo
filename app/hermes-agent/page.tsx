'use client';

import React, { useState } from 'react';
import { 
  Bot, Terminal, Cpu, Zap, Shield, Globe, Layers, Video, 
  Code, Database, Activity, ExternalLink, ChevronRight, 
  Download, FileJson, MessageSquare, Gauge, Plus, Copy,
  CheckCircle, ArrowRight, PlayCircle
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandTabs, BrandBadge, BrandCardHeader, 
  BrandStatusDot, BrandTable, BrandPageHeader 
} from '../../components/brand';

/**
 * Full-Stack Bidirectional TypeScript Models
 */
interface RepoModule {
  path: string;
  desc: string;
  status: 'Hot' | 'New' | 'Stable' | 'Research';
}

interface ReleaseNote {
  v: string;
  date: string;
  note: string;
}

interface QuickstartStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  command: string;
  isSnippet?: boolean;
}

const REPO_MODULES: RepoModule[] = [
  { path: 'hermes-gateway', desc: 'Node.js 網關 v0.14.0 (支持 VPS 部署)', status: 'Hot' },
  { path: 'vps_adapter', desc: 'Ubuntu 24.04 本地化執行與自動化安裝', status: 'New' },
  { path: 'acp_adapter', desc: 'Zed 編輯器上下文協議適配器', status: 'New' },
  { path: 'agent', desc: 'Auxiliary 輔助客戶端與 Nous 認證', status: 'Stable' },
  { path: 'tools/video_gen', desc: '統一影片生成工具 (Pluggable)', status: 'Hot' },
  { path: 'tinker-atropos', desc: 'RL 強化學習訓練環境子模組', status: 'Research' },
];

const RELEASE_HISTORY: ReleaseNote[] = [
  { v: 'v0.14.1', date: 'Today', note: 'ESG Integration: 3 New Skills & Live VPS Fallback' },
  { v: 'v0.14.0', date: '2 days ago', note: 'ACP Registry for Zed & Video Gen' },
  { v: 'v0.13.0', date: 'last week', note: '8 New Locales & Gateway l10n' },
];

const QUICKSTART_STEPS: QuickstartStep[] = [
  {
    id: 1,
    title: '1. Install Hermes Agent',
    icon: <Terminal size={18}/>,
    color: '#009E9D', // ESG Teal
    description: 'Set up the core Hermes CLI and initialize your workspace.',
    command: 'npm install -g @nousresearch/hermes\nhermes setup'
  },
  {
    id: 2,
    title: '2. Initialize Google Genkit',
    icon: <Layers size={18}/>,
    color: '#003262', // Berkeley Blue
    description: 'Configure Google Genkit to manage LLM interactions (Gemini 1.5 Pro).',
    command: "import { genkit } from 'genkit';\nimport { googleAI } from '@genkit-ai/googleai';\n\nconst ai = genkit({ plugins: [googleAI()] });",
    isSnippet: true
  },
  {
    id: 3,
    title: '3. ADK Integration (ESG Experts)',
    icon: <Globe size={18}/>,
    color: '#8B5CF6', // ESG Purple
    description: "Register specialized ESG agents using Google's Agent Development Kit.",
    command: "import { createAgent } from '@google/adk';\n\nconst esgResearcher = createAgent({\n  name: 'ESG_Researcher_Agent',\n  role: 'Sustainability Data Analyst'\n});",
    isSnippet: true
  },
  {
    id: 4,
    title: '4. Activate Agent Zero',
    icon: <Cpu size={18}/>,
    color: '#FDB515', // California Gold
    description: 'Enable system-level execution and sub-agent spawning for autonomous ops.',
    command: 'docker run -it -v $(pwd):/workspace agent0ai/agent-zero\n# AgentZ0 will now monitor and execute autonomously.'
  }
];

export default function HermesAgentPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'quickstart' | 'architecture' | 'tools' | 'research' | 'releases'>('overview');
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      
      {/* Stitch-Style Header */}
      <BrandPageHeader 
        title="OmniHermes Agent 系統 ☤"
        subtitle="超越單純對話的自主代理：具備閉環學習、記憶固化與跨平台調度的 ESG 治理核心"
        eyebrow="v0.14.1 · Self-Improving Agent"
        icon={<Bot size={32} />}
        actions={
          <div className="flex items-center gap-3">
            <BrandBadge variant="blue" size="md" dot>v0.14.0 Stable</BrandBadge>
            <BrandStatusDot status="active" label="Runtime Online" pulse />
          </div>
        }
      />

      {/* Main Tabs */}
      <BrandTabs 
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
        tabs={[
          { id: 'overview', label: '總覽', icon: <Activity size={14}/> },
          { id: 'quickstart', label: '快速上手', icon: <Zap size={14}/> },
          { id: 'architecture', label: '系統架構', icon: <Layers size={14}/> },
          { id: 'tools', label: '工具箱', icon: <Terminal size={14}/> },
          { id: 'research', label: '技術研究', icon: <Database size={14}/> },
          { id: 'releases', label: '版本紀錄', icon: <Activity size={14}/> },
        ]}
      />

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in">
            <div className="lg:col-span-8 space-y-6">
              <BrandCard padding="lg">
                <BrandCardHeader title="核心能力 (Core Pillars)" subtitle="定義自主代理的四大維度" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {[
                    { icon: <Activity size={20} />, t: '閉環學習', d: '透過經驗創造 Skill，並在任務中持續自我優化。' },
                    { icon: <Database size={20} />, t: '方言記憶', d: '具備 FTS5 歷史對話搜尋與 LLM 長期記憶摘要。' },
                    { icon: <Globe size={20} />, t: '20+ 平台閘道', d: '一個進程同時驅動 Telegram, Discord, Slack 等。' },
                    { icon: <Layers size={20} />, t: '七大後端', d: '支持 Docker, SSH, Singularity, Modal 與 Daytona。' },
                  ].map(item => (
                    <div key={item.t} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-all group">
                      <div className="text-blue-700 mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div className="font-bold text-slate-800 text-sm mb-1">{item.t}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.d}</div>
                    </div>
                  ))}
                </div>
              </BrandCard>

              <BrandCard padding="lg" className="bg-[#003262]/5 border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003262] mb-1">新特性: ACP ADAPTER</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      v0.14.0 引入了 Zed 編輯器的 ACP 註冊元數據，讓 Hermes 能直接作為 Zed 的 AI 後端，實時同步代碼上下文。
                    </p>
                    <BrandButton variant="ghost" size="sm" className="mt-3 p-0 h-auto text-blue-700 font-bold hover:bg-transparent">
                      查看開發文檔 <ArrowRight size={14} className="ml-1" />
                    </BrandButton>
                  </div>
                </div>
              </BrandCard>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <BrandCard padding="lg">
                <BrandCardHeader title="快速部署" />
                <div className="mt-4 space-y-4">
                  <div className="p-3 bg-slate-900 rounded-lg font-mono text-[10px] text-emerald-400 border border-slate-800 relative group">
                    <code>curl -fsSL https://hermes.ai/install.sh | bash</code>
                    <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                      <Copy size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    * 支持 Ubuntu, macOS 與 WSL2 環境。<br/>
                    * 自動安裝 Node.js 22, Python 3.11 與所需工具。
                  </p>
                  <BrandButton variant="primary" fullWidth size="sm">
                    <Download size={14} className="mr-2" /> 下載離線套件
                  </BrandButton>
                </div>
              </BrandCard>

              <BrandCard padding="lg">
                <BrandCardHeader title="實時指標" />
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'Uptime', value: '99.98%', icon: <Activity size={12}/> },
                    { label: 'Latency', value: '142ms', icon: <Gauge size={12}/> },
                    { label: 'Token/sec', value: '85', icon: <Zap size={12}/> },
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {stat.icon} {stat.label}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </BrandCard>
            </div>
          </div>
        )}

        {activeTab === 'quickstart' && (
          <div className="max-w-5xl mx-auto fade-in">
            <BrandCard padding="lg">
              <BrandCardHeader 
                title="Hermes Agent + ESG GO Quickstart" 
                subtitle="從零開始構建您的 5T 誠信代理蜂群"
              />
              
              <div className="mt-8 flex flex-col md:flex-row gap-8">
                {/* Left: Progress Stepper */}
                <div className="w-full md:w-64 flex-shrink-0">
                  <div className="sticky top-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Installation Steps</h4>
                    <div className="space-y-6">
                      {QUICKSTART_STEPS.map((step, idx) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm cursor-pointer transition-all hover:scale-110`}
                              style={{ backgroundColor: step.color }}
                              onClick={() => {
                                // In a real app, this would change the active step
                                // For now, we just scroll to it
                                document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                            >
                              {step.icon}
                            </div>
                            {idx < QUICKSTART_STEPS.length - 1 && (
                              <div className="w-[2px] h-full bg-slate-100 my-2" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p className="text-sm font-bold text-slate-800">{step.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Step Details */}
                <div className="flex-1 space-y-12">
                  {QUICKSTART_STEPS.map((step) => (
                    <div key={step.id} id={`step-${step.id}`} className="scroll-mt-24">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-[#003262] flex items-center gap-2">
                          <span style={{ color: step.color }}>{step.icon}</span>
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                      </div>

                      <div className="relative group/code">
                        <pre className="p-4 bg-[#1e1e1e] rounded-lg border border-slate-800 font-mono text-sm overflow-x-auto text-[#d4d4d4] leading-relaxed shadow-inner">
                          {step.isSnippet ? (
                            <code>
                              {step.command.split('\n').map((line, i) => {
                                if (line.startsWith('import') || line.startsWith('const')) {
                                  const parts = line.split(' ');
                                  return (
                                    <span key={i}>
                                      <span className="text-[#569cd6]">{parts[0]}</span> {parts.slice(1).join(' ')}
                                      {'\n'}
                                    </span>
                                  );
                                }
                                return line + '\n';
                              })}
                            </code>
                          ) : (
                            <code>
                              {step.command.split('\n').map((line, i) => (
                                <span key={i}>
                                  {line.startsWith('#') ? <span className="text-[#6a9955]">{line}</span> : line}
                                  {'\n'}
                                </span>
                              ))}
                            </code>
                          )}
                        </pre>
                        <button 
                          onClick={() => handleCopy(step.id, step.command)}
                          className="absolute top-3 right-3 p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/40 hover:text-white transition-all opacity-0 group-hover/code:opacity-100"
                        >
                          {copied === step.id ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      
                      <div className="mt-4 flex gap-3">
                        {!step.isSnippet && (
                          <BrandButton 
                            variant="primary" 
                            size="sm" 
                            onClick={() => {
                              showToast?.(`執行指令: ${step.command.split('\n')[0]}`, 'info');
                            }}
                          >
                            <PlayCircle size={14} className="mr-2" /> 執行指令 (Execute)
                          </BrandButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                    <PlayCircle size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">準備好進行實測了嗎？</h5>
                    <p className="text-xs text-slate-500">進入調度中心啟動您的第一個 5T 任務</p>
                  </div>
                </div>
                <BrandButton variant="secondary" onClick={() => window.location.href='/hermes-orchestrator'}>
                  前往調度中心 <ChevronRight size={16} className="ml-1" />
                </BrandButton>
              </div>
            </BrandCard>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6 fade-in">
            <BrandCard padding="none">
              <BrandCardHeader title="代碼模組地圖 (Source Map)" subtitle="Hermes 代理核心的架構分層" />
              <div className="mt-4">
                <BrandTable 
                  columns={[
                    { key: 'path', label: '模組路徑', render: (v) => <code className="font-bold text-blue-700">{v}</code> },
                    { key: 'desc', label: '功能定義' },
                    { key: 'status', label: '當前狀態', render: (v) => (
                      <BrandBadge 
                        variant={v === 'Hot' ? 'error' : v === 'New' ? 'gold' : v === 'Research' ? 'purple' : 'success'} 
                        size="xs"
                      >
                        {v}
                      </BrandBadge>
                    )}
                  ]}
                  data={REPO_MODULES}
                />
              </div>
            </BrandCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <BrandCard padding="lg">
                  <BrandCardHeader title="系統流轉層 (Runtime)" />
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                    底層基於 Node.js 22 與 Python 3.11 混合架構，確保了高效的 I/O 處理與強大的數據運算能力。
                    所有執行均在受控的 Sandbox 中進行，支援 5T 完整性簽章。
                  </p>
               </BrandCard>
               <BrandCard padding="lg">
                  <BrandCardHeader title="認證與安全" />
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                    整合 Nous Research 認證體系，每一筆指令均附帶 Actor ID 與 Policy Guard 決策雜湊，
                    符合 Berkeley Academy 最嚴苛的治理標準。
                  </p>
               </BrandCard>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
            <BrandCard padding="lg" hover>
              <Video size={24} className="text-purple-500 mb-4" />
              <h4 className="font-bold text-slate-800">video_generate</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                v0.14.0 統一了影片生成接口，支持多供應商插件（如 Luma, Kling），支援 ESG 視覺化簡報生成。
              </p>
            </BrandCard>
            <BrandCard padding="lg" hover>
              <Code size={24} className="text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-800">agent-browser v0.26</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                強化了瀏覽器自動化能力，支持長期空閒守護進程，提升網路數據抓取與 GRI 標竿比對效率。
              </p>
            </BrandCard>
            <BrandCard padding="lg" hover>
              <Shield size={24} className="text-emerald-500 mb-4" />
              <h4 className="font-bold text-slate-800">Secure Sandbox</h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                硬化容器隔離技術，支持唯讀根文件系統與命名空間隔離，確保 5T 數據處理過程不被外部污染。
              </p>
            </BrandCard>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
            <BrandCard padding="lg" className="border-l-4 border-l-purple-500">
               <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Advanced RL</p>
               <h4 className="font-bold text-slate-800 text-lg mb-3">Trajectory Compression</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 專為訓練下一代工具調用模型設計。Hermes 能將複雜的任務解決軌跡（Trajectories）壓縮為高效的訓練樣本，並匯出為 ShareGPT 格式，助力企業建立專屬私有 ESG 模型。
               </p>
            </BrandCard>
            <BrandCard padding="lg" className="border-l-4 border-l-emerald-500">
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Model Training</p>
               <h4 className="font-bold text-slate-800 text-lg mb-3">Atropos Integration</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 整合 `tinker-atropos` 環境，支持在多步 Web 研究任務中進行強化學習（RL）環境模擬與數據生成，讓 Agent 具備自我演進的邏輯推理能力。
               </p>
            </BrandCard>
          </div>
        )}

        {activeTab === 'releases' && (
          <BrandCard padding="none" className="fade-in">
            <BrandCardHeader title="版本發佈軌跡" subtitle="持續進化的系統核心" />
            <div className="mt-4">
              <BrandTable 
                columns={[
                  { key: 'v', label: '版本', render: (v) => <span className="font-bold text-blue-700">{v}</span> },
                  { key: 'date', label: '更新時間', render: (v) => <span className="text-slate-400">{v}</span> },
                  { key: 'note', label: '主要變動', render: (v) => <BrandBadge variant="outline" size="xs">{v}</BrandBadge> }
                ]}
                data={RELEASE_HISTORY}
              />
            </div>
          </BrandCard>
        )}
      </div>

      {/* Stitch Footer Branding */}
      <BrandCard padding="sm" className="bg-white border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot size={18} className="text-[#003262]" />
            <span className="text-[10px] font-bold text-[#003262] uppercase tracking-[0.2em] font-mono">
              OMNIHERMES-AGENT SYSTEM v0.14.1
            </span>
          </div>
          <div className="flex gap-4">
            <a href="https://hermes-agent.nousresearch.com/docs/" target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 font-bold hover:text-blue-700 flex items-center gap-1.5 transition-colors">
              <Terminal size={12} /> DOCUMENTATION
            </a>
            <a href="https://discord.gg/NousResearch" target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 font-bold hover:text-blue-700 flex items-center gap-1.5 transition-colors">
              <MessageSquare size={12} /> DISCORD
            </a>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
