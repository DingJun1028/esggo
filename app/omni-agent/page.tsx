'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Terminal, Cpu, Zap, Shield, Globe, Layers, Video, 
  Code, Database, Activity, ExternalLink, ChevronRight, 
  Download, FileJson, MessageSquare, Gauge, Plus, Copy,
  CheckCircle, ArrowUpRight, PlayCircle, Hash, Lock, Activity as ActivityIcon, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { UniversalPageConfig } from '../../lib/page-config';

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
  { path: 'omniagent-gateway', desc: 'Node.js 網關 v0.14.0 (支持 VPS 部署)', status: 'Hot' },
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
    title: '1. Install OmniAgent Agent',
    icon: <Terminal size={18}/>,
    color: '#009E9D', // ESG Teal
    description: 'Set up the core OmniAgent CLI and initialize your workspace.',
    command: 'npm install -g @nousresearch/omniagent\nomniagent setup'
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

export default function OmniAgentAgentPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'quickstart' | 'architecture' | 'tools' | 'research' | 'releases'>('overview');
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pageConfig: UniversalPageConfig = {
    id: 'omniagent-agent',
    title: 'OmniAgent Agent 系統 ☤',
    subtitle: '超越單純對話的自主代理：具備閉環學習、記憶固化與跨平台調度的 ESG 治理核心。',
    icon: <Bot size={32} className="text-berkeley-blue" />,
    griReference: 'Agent System / oX',
    activeT5Tags: ['T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'download', label: '下載離線套件', icon: <Download size={16}/>, onClick: () => alert('正在準備離線套件...') },
      { id: 'status', label: '系統狀態', icon: <Activity size={16}/>, variant: 'secondary', onClick: () => alert('Agent Runtime: Online') }
    ],

    kpis: [
      { key: 'uptime', label: 'Uptime', value: '99.98', unit: '%', icon: <Activity size={18}/> },
      { key: 'latency', label: 'Latency', value: '142', unit: 'ms', icon: <Gauge size={18}/> },
      { key: 'tps', label: 'Token/sec', value: '85', icon: <Zap size={18}/>, verified: true },
    ],

    sections: [
      {
        id: 'nav',
        title: '功能導覽',
        columns: 12,
        component: (
          <Tabs 
            active={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            tabs={[
              { key: 'overview', label: '總覽', icon: <Activity size={14}/> },
              { key: 'quickstart', label: '快速上手', icon: <Zap size={14}/> },
              { key: 'architecture', label: '系統架構', icon: <Layers size={14}/> },
              { key: 'tools', label: '工具箱', icon: <Terminal size={14}/> },
              { key: 'research', label: '技術研究', icon: <Database size={14}/> },
              { key: 'releases', label: '版本紀錄', icon: <Activity size={14}/> },
            ]}
            variant="pills"
          />
        )
      },
      {
        id: 'main-view',
        title: activeTab.toUpperCase(),
        columns: 12,
        component: (
          <div className="min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
                <div className="lg:col-span-8 space-y-8">
                  <Card className="p-8 bg-white/60 border-white/80 shadow-glass">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center">
                        <ActivityIcon size={20} />
                      </div>
                      <h4 className="text-sm font-black text-berkeley-blue uppercase tracking-tight">核心能力 (Core Pillars)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { icon: <ActivityIcon size={24} />, t: '閉環學習', d: '透過經驗創造 Skill，並在任務中持續自我優化。' },
                        { icon: <Database size={24} />, t: '方言記憶', d: '具備 FTS5 歷史對話搜尋與 LLM 長期記憶摘要。' },
                        { icon: <Globe size={24} />, t: '20+ 平台閘道', d: '一個進程同時驅動 Telegram, Discord, Slack 等。' },
                        { icon: <Layers size={24} />, t: '七大後端', d: '支持 Docker, SSH, Singularity, Modal 與 Daytona。' },
                      ].map(item => (
                        <div key={item.t} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:border-berkeley-blue/30 transition-all group shadow-sm hover:shadow-md">
                          <div className="text-berkeley-blue mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                          <div className="font-black text-slate-800 text-sm mb-2">{item.t}</div>
                          <div className="text-xs text-slate-500 leading-relaxed font-medium">{item.d}</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-8 bg-berkeley-blue/5 border-berkeley-blue/10 shadow-sm relative overflow-hidden">
                    <div className="flex items-start gap-6 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-berkeley-blue text-california-gold flex items-center justify-center shadow-lg">
                        <Zap size={32} fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-berkeley-blue mb-2 uppercase tracking-tight">新特性: ACP ADAPTER</h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          v0.14.0 引入了 Zed 編輯器的 ACP 註冊元數據，讓 OmniAgent 能直接作為 Zed 的 AI 後端，實時同步代碼上下文，實現 5T 等級的協同開發。
                        </p>
                        <Button variant="glass" size="sm" className="mt-5 px-6 rounded-xl text-berkeley-blue font-black border-berkeley-blue/20">
                          查看開發文檔 <ArrowUpRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                    <Bot size={140} className="absolute -bottom-10 -right-10 text-berkeley-blue/5 rotate-12" />
                  </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <Card className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">快速部署 (Quick Deploy)</h4>
                      <div className="p-4 bg-black/40 rounded-2xl font-mono text-[11px] text-emerald-400 border border-white/5 relative group shadow-inner">
                        <code>curl -fsSL https://omniagent.ai/install.sh | bash</code>
                        <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-blue-100/50 leading-relaxed font-medium">
                        * 支持 Ubuntu, macOS 與 WSL2 環境。<br/>
                        * 自動安裝 Node.js 22, Python 3.11 與所需工具。
                      </p>
                      <Button variant="primary" className="w-full h-12 bg-blue-600 hover:bg-blue-500 border-none shadow-lg rounded-xl font-black">
                        <Download size={18} className="mr-3" /> 下載離線套件
                      </Button>
                    </div>
                    <Terminal size={120} className="absolute -bottom-10 -right-10 text-white/5" />
                  </Card>

                  <Card className="p-8 bg-white/60 border-white/80 shadow-glass">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-berkeley-blue mb-6">實時指標</h4>
                    <div className="space-y-5">
                      {[
                        { label: 'Uptime', value: '99.98%', icon: <ActivityIcon size={14}/> },
                        { label: 'Latency', value: '142ms', icon: <Gauge size={14}/> },
                        { label: 'Token/sec', value: '85', icon: <Zap size={14}/> },
                      ].map(stat => (
                        <div key={stat.label} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0">
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <span className="text-berkeley-blue/40">{stat.icon}</span> {stat.label}
                          </div>
                          <span className="text-sm font-mono font-black text-berkeley-blue">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'quickstart' && (
              <div className="max-w-5xl mx-auto animate-in fade-in">
                <Card className="p-10 bg-white/60 border-white/80 shadow-glass">
                  <div className="mb-10 text-center">
                    <h3 className="text-2xl font-black text-berkeley-blue mb-2 tracking-tight">OmniAgent Agent + ESG GO Quickstart</h3>
                    <p className="text-sm text-slate-500 font-medium">從零開始構建您的 5T 誠信代理蜂群</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-12">
                    {/* Left: Progress Stepper */}
                    <div className="w-full md:w-64 flex-shrink-0">
                      <div className="sticky top-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Installation Steps</h4>
                        <div className="space-y-10">
                          {QUICKSTART_STEPS.map((step, idx) => (
                            <div key={step.id} className="flex gap-5 group cursor-pointer" onClick={() => document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transition-all group-hover:scale-110"
                                  style={{ backgroundColor: step.color }}
                                >
                                  {step.icon}
                                </div>
                                {idx < QUICKSTART_STEPS.length - 1 && (
                                  <div className="w-0.5 h-12 bg-slate-100 mt-2" />
                                )}
                              </div>
                              <div className="pt-2">
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-berkeley-blue transition-colors">{step.title.split('. ')[1]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Step Details */}
                    <div className="flex-1 space-y-16">
                      {QUICKSTART_STEPS.map((step) => (
                        <div key={step.id} id={`step-${step.id}`} className="scroll-mt-24">
                          <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                               <Badge style={{ backgroundColor: step.color }} className="text-white border-none px-3 py-1 text-[10px]">STEP {step.id}</Badge>
                               <h3 className="text-xl font-black text-berkeley-blue tracking-tight">{step.title.split('. ')[1]}</h3>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.description}</p>
                          </div>

                          <div className="relative group/code">
                            <pre className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 font-mono text-sm overflow-x-auto text-blue-50 leading-relaxed shadow-xl">
                              {step.isSnippet ? (
                                <code>
                                  {step.command.split('\n').map((line, i) => {
                                    if (line.startsWith('import') || line.startsWith('const')) {
                                      const parts = line.split(' ');
                                      return (
                                        <span key={i}>
                                          <span className="text-blue-400">{parts[0]}</span> {parts.slice(1).join(' ')}
                                          {'\n'}
                                        </span>
                                      );
                                    }
                                    return <span key={i} className="text-slate-300">{line + '\n'}</span>;
                                  })}
                                </code>
                              ) : (
                                <code>
                                  {step.command.split('\n').map((line, i) => (
                                    <span key={i}>
                                      {line.startsWith('#') ? <span className="text-emerald-500/60 italic">{line}</span> : <span className="text-emerald-400 font-bold">{line}</span>}
                                      {'\n'}
                                    </span>
                                  ))}
                                </code>
                              )}
                            </pre>
                            <button 
                              onClick={() => handleCopy(step.id, step.command)}
                              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all opacity-0 group-hover/code:opacity-100"
                            >
                              {copied === step.id ? <CheckCircle size={16} className="text-verified" /> : <Copy size={16} />}
                            </button>
                          </div>
                          
                          <div className="mt-6 flex gap-4">
                            {!step.isSnippet && (
                              <Button 
                                variant="glass" 
                                size="sm" 
                                className="h-10 px-5 rounded-xl text-berkeley-blue font-black border-berkeley-blue/20"
                                onClick={() => alert(`執行指令: ${step.command.split('\n')[0]}`)}
                              >
                                <PlayCircle size={16} className="mr-2" /> 執行指令 (Execute)
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-16 p-10 bg-berkeley-blue rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-california-gold shadow-inner border border-white/10">
                        <PlayCircle size={32} fill="currentColor" />
                      </div>
                      <div>
                        <h5 className="font-black text-lg uppercase tracking-tight">準備好進行實測了嗎？</h5>
                        <p className="text-sm text-blue-100/70 font-medium">進入調度中心啟動您的第一個 5T 任務</p>
                      </div>
                    </div>
                    <Button variant="glass" className="w-full md:w-auto px-10 h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black relative z-10" onClick={() => window.location.href='/omniagent-orchestrator'}>
                      前往調度中心 <ChevronRight size={20} className="ml-2" />
                    </Button>
                    <ActivityIcon size={200} className="absolute -bottom-20 -right-20 text-white/5" />
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-8 animate-in fade-in">
                <DataTable 
                  columns={[
                    { key: 'path', header: '模組路徑', render: (v: any) => <code className="font-black text-berkeley-blue">{v}</code> },
                    { key: 'desc', header: '功能定義' },
                    { key: 'status', header: '當前狀態', render: (v: any) => (
                      <Badge 
                        variant={v === 'Hot' ? 'error' : v === 'New' ? 'warning' : v === 'Research' ? 'primary' : 'verified'} 
                        className="px-3 py-1 font-black tracking-widest uppercase text-[9px]"
                      >
                        {v}
                      </Badge>
                    )}
                  ]}
                  data={REPO_MODULES as any[]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Card className="p-8 bg-white/60 border-white/80 shadow-glass">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center">
                            <Gauge size={20} />
                         </div>
                         <h4 className="text-sm font-black text-berkeley-blue uppercase tracking-tight">系統流轉層 (Runtime)</h4>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        底層基於 Node.js 22 與 Python 3.11 混合架構，確保了高效的 I/O 處理與強大的數據運算能力。
                        所有執行均在受控的 Sandbox 中進行，支援 5T 完整性簽章。
                      </p>
                   </Card>
                   <Card className="p-8 bg-white/60 border-white/80 shadow-glass">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center">
                            <Shield size={20} />
                         </div>
                         <h4 className="text-sm font-black text-berkeley-blue uppercase tracking-tight">認證與安全</h4>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        整合 Nous Research 認證體系，每一筆指令均附帶 Actor ID 與 Policy Guard 決策雜湊，
                        符合 Berkeley Academy 最嚴苛的治理標準與 oX 安全協議。
                      </p>
                   </Card>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in">
                <Card hoverEffect className="p-8 bg-white/60 border-white/80 shadow-glass group">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Video size={32} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">video_generate</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    v0.14.0 統一了影片生成接口，支持多供應商插件（如 Luma, Kling），支援 ESG 視覺化簡報生成。
                  </p>
                </Card>
                <Card hoverEffect className="p-8 bg-white/60 border-white/80 shadow-glass group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Code size={32} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">agent-browser v0.26</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    強化了瀏覽器自動化能力，支持長期空閒守護進程，提升網路數據抓取與 GRI 標竿比對效率。
                  </p>
                </Card>
                <Card hoverEffect className="p-8 bg-white/60 border-white/80 shadow-glass group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Shield size={32} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">Secure Sandbox</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    硬化容器隔離技術，支持唯讀根文件系統與命名空間隔離，確保 5T 數據處理過程不被外部污染。
                  </p>
                </Card>
              </div>
            )}

            {activeTab === 'releases' && (
              <div className="animate-in fade-in">
                <DataTable 
                  columns={[
                    { key: 'v', header: '版本', render: (v: any) => <span className="font-black text-berkeley-blue">{v}</span> },
                    { key: 'date', header: '更新時間', render: (v: any) => <span className="text-slate-400 font-bold text-xs uppercase">{v}</span> },
                    { key: 'note', header: '主要變動', render: (v: any) => <Badge variant="verified" className="px-3 py-1 font-medium">{v}</Badge> }
                  ]}
                  data={RELEASE_HISTORY}
                />
              </div>
            )}
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative h-full">
      <StandardPage config={pageConfig} />
      
      {/* Stitch Footer Branding */}
      <motion.div 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="mt-12 p-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-glass flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center">
            <Bot size={24} />
          </div>
          <span className="text-[11px] font-black text-berkeley-blue uppercase tracking-[0.3em] font-mono">
            OMNIAGENT-AGENT SYSTEM v0.14.1
          </span>
        </div>
        <div className="flex gap-8">
          <a href="https://omniagent-agent.nousresearch.com/docs/" target="_blank" rel="noreferrer" className="text-[11px] text-slate-400 font-black hover:text-berkeley-blue flex items-center gap-2 transition-all uppercase tracking-widest">
            <Terminal size={14} /> DOCUMENTATION
          </a>
          <a href="https://discord.gg/NousResearch" target="_blank" rel="noreferrer" className="text-[11px] text-slate-400 font-black hover:text-berkeley-blue flex items-center gap-2 transition-all uppercase tracking-widest">
            <MessageSquare size={14} /> DISCORD
          </a>
        </div>
      </motion.div>
    </div>
  );
}
