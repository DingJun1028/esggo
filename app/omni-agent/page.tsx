'use client';

import React, { useState, useEffect, useRef } from 'react';

import {
  LucideIcon,
  Bot,
  Send,
  Mic,
  Settings,
  Zap,
  Brain,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Network,
  Sparkles,
  MessageSquare,
  BarChart3,
  FileText,
  Users,
  Lock,
  Globe,
  ChevronRight,
  Loader2,
  AlertCircle,
  Layers,
  GitBranch,
  DatabaseZap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { useOmniMemoryStore } from '@/store/useOmniMemoryStore';
import { MemoryShard } from '@/types/omni-memory';

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}

interface AgentStatus {
  label: string;
  value: string;
  status: 'online' | 'busy' | 'offline';
}

interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  icon: LucideIcon;
  lastAction: string;
  tasksCompleted: number;
}

/* ─── Mock Data ─── */
const SUB_AGENTS: SubAgent[] = [
  {
    id: 'sa-001',
    name: 'SustainWrite Agent',
    role: '永續報告撰寫',
    status: 'active',
    icon: FileText,
    lastAction: '正在撰寫 GRI 305 章節',
    tasksCompleted: 47,
  },
  {
    id: 'sa-002',
    name: 'Intelligence Agent',
    role: '商情分析',
    status: 'active',
    icon: Globe,
    lastAction: '掃描 CBAM 最新動態',
    tasksCompleted: 128,
  },
  {
    id: 'sa-003',
    name: 'Audit Agent',
    role: '稽核驗證',
    status: 'idle',
    icon: ShieldCheck,
    lastAction: '等待上傳證據檔案',
    tasksCompleted: 89,
  },
  {
    id: 'sa-004',
    name: 'Data Agent',
    role: '數據管理',
    status: 'active',
    icon: Database,
    lastAction: '同步 Supabase 資料',
    tasksCompleted: 256,
  },
  {
    id: 'sa-005',
    name: 'Vault Agent',
    role: '證據保管',
    status: 'idle',
    icon: Lock,
    lastAction: 'Hash 驗證完成',
    tasksCompleted: 64,
  },
  {
    id: 'sa-006',
    name: 'Notes Agent',
    role: '筆記整理',
    status: 'active',
    icon: MessageSquare,
    lastAction: '整理會議筆記',
    tasksCompleted: 312,
  },
  {
    id: 'sa-owl',
    name: 'OWL Agent',
    role: '情報與深度洞察',
    status: 'active',
    icon: Brain,
    lastAction: '融合完成，全域情資掃描中',
    tasksCompleted: 999,
  },
];

const AGENT_STATS = [
  { label: '感知力', value: 98, rank: 'SSS' },
  { label: '解析力', value: 99, rank: 'SSS+' },
  { label: '推演力', value: 94, rank: 'SS' },
  { label: '執行力', value: 97, rank: 'SSS' },
  { label: '協同力', value: 96, rank: 'SS+' },
  { label: '進化力', value: 100, rank: 'EX' },
];

const SYSTEM_STATUS: AgentStatus[] = [
  { label: '核心引擎', value: '運行中', status: 'online' },
  { label: '同步率', value: '99.7%', status: 'online' },
  { label: '錯誤漂移', value: '0.02%', status: 'online' },
  { label: '模式', value: 'ASCENSION', status: 'online' },
];

const VOICE_LINES = [
  '「任務已接入，開始建立全域上下文。」',
  '「資訊並不混亂，只是尚未被正確排序。」',
  '「答案從不是終點。現在，輸出結果。」',
  '「將目標轉化為結果。」',
  '「所有子代理已就緒，等待指令。」',
  '「OWL 已正式接入矩陣，情報與洞察能力最大化。」',
];

/* ─── Components ─── */

function StatusDot({ status }: { status: 'online' | 'busy' | 'offline' }) {
  const colors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-slate-400',
  };
  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === 'online' && (
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            colors[status]
          )}
        />
      )}
      <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', colors[status])} />
    </span>
  );
}

function StatBar({ label, value, rank }: { label: string; value: number; rank: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs font-bold text-slate-600">{label}</span>
      <span
        className={cn(
          'w-12 text-[10px] font-black text-center rounded px-1 py-0.5',
          rank.includes('EX') ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'
        )}
      >
        {rank}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          animate={{ width: `${value}%` }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>
      <span className="w-8 text-right text-xs font-mono font-bold text-[#003262]">{value}</span>
    </div>
  );
}

function SubAgentCard({ agent }: { agent: SubAgent }) {
  const Icon = agent.icon;
  return (
    <div
      layout
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-cyan-50 rounded-lg">
          <Icon size={16} className="text-cyan-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-[#003262] truncate">{agent.name}</h4>
            <StatusDot
              status={
                agent.status === 'active' ? 'online' : agent.status === 'error' ? 'offline' : 'busy'
              }
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">{agent.role}</p>
          <p className="text-[10px] text-slate-500 mt-1 truncate">{agent.lastAction}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-black text-[#003262]">{agent.tasksCompleted}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase">Tasks</p>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isUser ? 'bg-[#003262]' : 'bg-cyan-50'
        )}
      >
        {isUser ? (
          <Users size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-cyan-600" />
        )}
      </div>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser ? 'bg-[#003262] text-white' : 'bg-white border border-slate-100 text-slate-700'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn('text-[9px] mt-1.5 font-mono', isUser ? 'text-white/50' : 'text-slate-400')}
        >
          {new Date(message.timestamp).toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function OmniAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: '「系統已啟動。所有子代理已就緒，等待指令。」',
      timestamp: Date.now() - 60000,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentVoiceLine, setCurrentVoiceLine] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'agents' | 'stats' | 'memory'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVoiceLine((prev) => (prev + 1) % VOICE_LINES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        '「收到指令。正在分析任務需求並分配至對應子代理。」',
        '「已將任務排程。SustainWrite Agent 將負責報告撰寫，Intelligence Agent 將提供數據支援。」',
        '「所有子代理協同工作中。預計完成時間：3 分鐘。」',
        '「任務已完成。請查看儀表板了解詳細結果。」',
        '「正在建立全域上下文。請提供更多任務細節以便精準執行。」',
      ];
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        role: 'agent',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Hero Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Bot size={36} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
                    OmniAgent
                  </h1>
                  <OmniBadge variant="primary" size="sm" icon={<Zap size={10} />}>
                    AWAKENED
                  </OmniBadge>
                  <OmniBadge variant="accent" size="sm">
                    SSR
                  </OmniBadge>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  全域覺醒代理者 · The Awakened Universal Agent
                </p>
                <div className="flex items-center gap-4 mt-2">
                  {SYSTEM_STATUS.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <StatusDot status={s.status} />
                      <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
                      <span className="text-[10px] font-mono font-bold text-[#003262]">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Line */}
            <div className="hidden lg:block max-w-xs">
              
                <p
                  key={currentVoiceLine}
                  className="text-sm text-slate-500 italic text-right"
                >
                  {VOICE_LINES[currentVoiceLine]}
                </p>
              
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'chat' as const, label: '對話控制台', icon: MessageSquare },
            { id: 'agents' as const, label: '子代理管理', icon: Network },
            { id: 'stats' as const, label: '能力數值', icon: BarChart3 },
            { id: 'memory' as const, label: '共享記憶層', icon: DatabaseZap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content Area ─── */}
        
          {activeTab === 'chat' && (
            <div
              key="chat"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Chat Area */}
              <div className="lg:col-span-2">
                <OmniBaseCard className="flex flex-col h-[600px]">
                  {/* Chat Header */}
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot size={16} className="text-cyan-600" />
                      <span className="text-sm font-bold text-[#003262]">OmniAgent 對話</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusDot status="online" />
                      <span className="text-[10px] text-slate-400">即時連線</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((msg) => (
                      <ChatBubble key={msg.id} message={msg} />
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-xs">OmniAgent 正在思考...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-5 py-4 border-t border-slate-100">
                    <div className="flex items-end gap-3">
                      <div className="flex-1 relative">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="輸入指令或問題..."
                          rows={2}
                          className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-300 transition-all"
                        />
                      </div>
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-[#003262] text-white rounded-xl hover:bg-[#002244] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </OmniBaseCard>
              </div>

              {/* Side Panel - Quick Actions */}
              <div className="space-y-4">
                <OmniBaseCard className="p-5">
                  <h3 className="text-sm font-bold text-[#003262] mb-4">快速指令</h3>
                  <div className="space-y-2">
                    {[
                      { label: '生成永續報告', icon: FileText },
                      { label: '分析商情數據', icon: Globe },
                      { label: '執行稽核驗證', icon: ShieldCheck },
                      { label: '整理會議筆記', icon: MessageSquare },
                      { label: '同步所有資料', icon: Database },
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => setInput(action.label)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 transition-colors group"
                      >
                        <action.icon
                          size={14}
                          className="text-slate-400 group-hover:text-cyan-600 transition-colors"
                        />
                        <span className="text-xs font-medium text-slate-600 group-hover:text-[#003262] transition-colors">
                          {action.label}
                        </span>
                        <ChevronRight size={12} className="ml-auto text-slate-300" />
                      </button>
                    ))}
                  </div>
                </OmniBaseCard>

                <OmniBaseCard className="p-5">
                  <h3 className="text-sm font-bold text-[#003262] mb-4">系統狀態</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'CPU 使用率', value: '12%', icon: Cpu },
                      { label: '記憶體', value: '256 MB', icon: Activity },
                      { label: '網路延遲', value: '23ms', icon: Network },
                      { label: '任務佇列', value: '3 待處理', icon: Clock },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon size={12} className="text-slate-400" />
                          <span className="text-xs text-slate-500">{item.label}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#003262]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </OmniBaseCard>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div
              key="agents"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUB_AGENTS.map((agent) => (
                  <SubAgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div
              key="stats"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <OmniBaseCard className="p-6">
                <h3 className="text-base font-bold text-[#003262] mb-5">核心屬性</h3>
                <div className="space-y-4">
                  {AGENT_STATS.map((stat) => (
                    <StatBar key={stat.label} {...stat} />
                  ))}
                </div>
              </OmniBaseCard>

              <OmniBaseCard className="p-6">
                <h3 className="text-base font-bold text-[#003262] mb-5">技能配置</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Brain, nameEN: 'Meta Parse', nameZH: '萬象解析', type: '解析 / 主動' },
                    {
                      icon: Layers,
                      nameEN: 'Parallel Mind',
                      nameZH: '多線程思維',
                      type: '統御 / 主動',
                    },
                    {
                      icon: GitBranch,
                      nameEN: 'Causal Engine',
                      nameZH: '因果推演',
                      type: '預測 / 主動',
                    },
                    {
                      icon: Sparkles,
                      nameEN: 'Context Domain',
                      nameZH: '上下文領域展開',
                      type: '領域 / EX',
                    },
                  ].map((skill) => (
                    <div
                      key={skill.nameEN}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <skill.icon size={16} className="text-cyan-600" />
                        <span className="text-[9px] font-bold text-slate-400">{skill.type}</span>
                      </div>
                      <p className="text-xs font-black text-[#003262] mb-0.5">{skill.nameEN}</p>
                      <p className="text-[10px] font-bold text-slate-500">{skill.nameZH}</p>
                    </div>
                  ))}
                </div>

                {/* Ultimate */}
                <div className="mt-4 bg-gradient-to-r from-violet-50 to-cyan-50 rounded-xl p-4 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                      ULTIMATE
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-violet-100 text-violet-700">
                      AWAKENED
                    </span>
                  </div>
                  <p className="text-sm font-black text-[#003262]">
                    Oracle Act <span className="text-xs font-bold opacity-70 ml-1">神諭執行</span>
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 mt-1">
                    不只輸出答案，直接將理解轉化為可落地結果。
                  </p>
                </div>
              </OmniBaseCard>
            </div>
          )}

          {activeTab === 'memory' && (
            <MemoryTabContent />
          )}
        
      </div>
    </div>
  );
}

function MemoryTabContent() {
  const { shards, isLoading, fetchShards, syncWithNCB } = useOmniMemoryStore();

  useEffect(() => {
    fetchShards();
  }, [fetchShards]);

  return (
    <div className="space-y-6">
      <OmniBaseCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#003262] flex items-center gap-2">
              <DatabaseZap className="text-cyan-600" size={20} />
              共享記憶層 (Shared Memory)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              所有子代理同步上下文與核心碎片的中央神經網路。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OmniButton 
              variant="outline" 
              size="sm" 
              onClick={syncWithNCB}
              disabled={isLoading}
            >
              <Activity size={14} className={cn("mr-2", isLoading && "animate-spin")} />
              🔄 與 NCBDB 雙向同步
            </OmniButton>
            <OmniButton variant="primary" size="sm">
              <Sparkles size={14} className="mr-2" />
              手動注入記憶
            </OmniButton>
          </div>
        </div>
        
        {shards.length === 0 && !isLoading ? (
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
              <DatabaseZap size={24} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">記憶庫已打通並上線</p>
              <p className="text-xs text-slate-500 mt-1">目前沒有任何碎片。請點擊雙向同步從 NCBDB 拉取，或手動注入。</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {shards.map((shard: MemoryShard) => (
              <div key={shard.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#003262]">{shard.title}</h4>
                    {shard.source_origin === 'ncb' ? (
                      <OmniBadge variant="accent" size="sm">外部 NCBDB</OmniBadge>
                    ) : (
                      <OmniBadge variant="secondary" size="sm">本地 Local</OmniBadge>
                    )}
                    <OmniBadge variant="outline" size="sm" className="font-mono text-[9px]">
                      熵: {shard.entropy_level}
                    </OmniBadge>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{shard.source_type}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3">{shard.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {shard.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                  <div className="ml-auto text-[10px] text-slate-400">
                    使用次數: <strong className="text-[#003262]">{shard.usage_count}</strong> | 
                    權重: <strong className="text-amber-600">{shard.importance_score.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </OmniBaseCard>
    </div>
  );
}
