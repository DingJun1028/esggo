'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  Bot,
  Send,
  Mic,
  Paperclip,
  Sparkles,
  Brain,
  ShieldCheck,
  TrendingUp,
  FileText,
  Globe,
  Zap,
  MessageSquare,
  Settings,
  X,
  ChevronRight,
  Lightbulb,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  User,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  actions?: {
    label: string;
    icon: LucideIcon;
    action: string;
  }[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  prompt: string;
}

interface ContextItem {
  id: string;
  type: 'file' | 'data' | 'report' | 'evidence';
  name: string;
  status: 'loaded' | 'processing' | 'error';
}

/* ─── Mock Data ─── */
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'qa-001',
    label: '碳盤查分析',
    icon: TrendingUp,
    color: 'text-emerald-600',
    prompt: '請分析我公司的碳排放數據，並提供減排建議',
  },
  {
    id: 'qa-002',
    label: 'GRI 報告撰寫',
    icon: FileText,
    color: 'text-blue-600',
    prompt: '請協助我撰寫 GRI G4 永續報告書',
  },
  {
    id: 'qa-003',
    label: '合規檢查',
    icon: ShieldCheck,
    color: 'text-amber-600',
    prompt: '請檢查我們公司是否符合最新的 ESG 合規要求',
  },
  {
    id: 'qa-004',
    label: '供應鏈風險',
    icon: Globe,
    color: 'text-rose-600',
    prompt: '請分析我們供應鏈的潛在風險',
  },
  {
    id: 'qa-005',
    label: '5T 驗證',
    icon: Zap,
    color: 'text-cyan-600',
    prompt: '請執行 5T 協議驗證',
  },
  {
    id: 'qa-006',
    label: 'AI 洞察',
    icon: Lightbulb,
    color: 'text-violet-600',
    prompt: '請根據我們的 ESG 數據提供智能洞察',
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'sys-001',
    role: 'system',
    content: 'AI 助手已啟動。所有對話均受 5T 協議保護。',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'bot-001',
    role: 'assistant',
    content:
      '您好！我是您的 ESG AI 助手。我可以協助您進行碳盤查分析、GRI 報告撰寫、合規檢查等工作。請問有什麼可以幫您？',
    timestamp: Date.now() - 50000,
    actions: [
      { label: '碳盤查分析', icon: TrendingUp, action: 'carbon' },
      { label: 'GRI 報告', icon: FileText, action: 'gri' },
      { label: '合規檢查', icon: ShieldCheck, action: 'compliance' },
    ],
  },
];

/* ─── Components ─── */

function ChatBubble({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction?: (action: string) => void;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 flex items-center gap-2">
          <ShieldCheck size={12} className="text-cyan-500" />
          <span className="text-[10px] text-slate-500">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 my-4', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
          isUser ? 'bg-[#003262]' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
        )}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn('max-w-[75%] group')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-[#003262] text-white'
              : 'bg-white border border-slate-100 text-slate-700 shadow-sm'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.actions.map((action) => (
              <button
                key={action.action}
                onClick={() => onAction?.(action.action)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all"
              >
                <action.icon size={12} className="text-cyan-500" />
                {action.label}
                <ChevronRight size={10} className="text-slate-300" />
              </button>
            ))}
          </div>
        )}

        {/* Timestamp & Actions */}
        <div
          className={cn(
            'flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser ? 'justify-end' : 'justify-start'
          )}
        >
          <span className="text-[9px] text-slate-300">
            {new Date(message.timestamp).toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </span>
          {!isUser && (
            <>
              <button className="p-1 hover:bg-slate-50 rounded transition-colors">
                <Copy size={10} className="text-slate-300" />
              </button>
              <button className="p-1 hover:bg-slate-50 rounded transition-colors">
                <ThumbsUp size={10} className="text-slate-300" />
              </button>
              <button className="p-1 hover:bg-slate-50 rounded transition-colors">
                <ThumbsDown size={10} className="text-slate-300" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ action, onClick }: { action: QuickAction; onClick: () => void }) {
  const Icon = action.icon;
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-100 p-4 text-left hover:shadow-md transition-all group"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'
        )}
      >
        <Icon size={18} className={action.color} />
      </div>
      <h4 className="text-sm font-bold text-[#003262] mb-1">{action.label}</h4>
      <p className="text-[10px] text-slate-400 line-clamp-2">{action.prompt}</p>
    </motion.button>
  );
}

function ContextPanel({ contexts }: { contexts: ContextItem[] }) {
  if (contexts.length === 0) return null;

  return (
    <div className="border-t border-slate-100 p-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">上下文</p>
      <div className="flex flex-wrap gap-2">
        {contexts.map((ctx) => (
          <div
            key={ctx.id}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg text-[10px]"
          >
            {ctx.status === 'loaded' ? (
              <CheckCircle2 size={10} className="text-emerald-500" />
            ) : ctx.status === 'processing' ? (
              <RefreshCw size={10} className="text-amber-500 animate-spin" />
            ) : (
              <AlertTriangle size={10} className="text-rose-500" />
            )}
            <span className="text-slate-600">{ctx.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 my-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <span
            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [contexts, setContexts] = useState<ContextItem[]>([
    { id: 'ctx-001', type: 'data', name: '碳排放數據 2025', status: 'loaded' },
    { id: 'ctx-002', type: 'report', name: 'GRI 報告草稿', status: 'loaded' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content:
            '根據您的碳排放數據分析，我發現以下幾個關鍵洞察：\n\n1. **Scope 1 直接排放**：450.2 tCO₂e，較去年下降 5.2%\n2. **Scope 2 能源排放**：1,284 tCO₂e，主要來自電力使用\n3. **Scope 3 供應鏈排放**：需要更多數據才能完整分析\n\n**建議**：\n- 加速再生能源轉型，可降低 Scope 2 排放 30%\n- 建立供應鏈碳排數據收集機制\n- 設定科學基礎減碳目標 (SBTi)',
          actions: [
            { label: '生成報告', icon: FileText, action: 'report' },
            { label: '深入分析', icon: Brain, action: 'deep' },
            { label: '5T 驗證', icon: ShieldCheck, action: '5t' },
          ],
        },
        {
          content:
            '我已為您檢查 GRI G4 合規狀態：\n\n✅ **已完成**：GRI 2-1 組織概況、GRI 3-1 重大主題分析\n⚠️ **待補強**：GRI 305-1 直接排放、GRI 302-1 能源消耗\n❌ **缺失**：GRI 413-1 社區影響評估\n\n**下一步建議**：\n1. 上傳 Scope 1/2/3 排放數據\n2. 補充社區參與相關文件\n3. 執行 5T 協議驗證',
          actions: [
            { label: '上傳數據', icon: Paperclip, action: 'upload' },
            { label: '查看缺失', icon: Target, action: 'missing' },
          ],
        },
        {
          content:
            '5T 協議驗證結果：\n\n✅ **T1 Tangible (真)**：數據已具體化，KPI 完整\n✅ **T2 Traceable (善)**：來源可追溯，evidence_id 已標註\n✅ **T3 Trackable (美)**：生命週期已記錄\n⚠️ **T4 Transparent (信)**：部分算法需公開\n✅ **T5 Trustworthy (通)**：Hash Lock 已完成\n\n**整體評分：87/100**',
          actions: [
            { label: '查看詳情', icon: Eye, action: 'detail' },
            { label: '修復問題', icon: Zap, action: 'fix' },
          ],
        },
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        status: 'sent',
        actions: response.actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  const handleActionClick = (action: string) => {
    const actionPrompts: Record<string, string> = {
      carbon: '請分析我公司的碳排放數據',
      gri: '請協助撰寫 GRI 報告',
      compliance: '請檢查合規狀態',
      report: '請生成 ESG 報告',
      deep: '請進行深度分析',
      '5t': '請執行 5T 驗證',
      upload: '我要上傳數據',
      missing: '請顯示缺失項目',
      detail: '請顯示詳細資訊',
      fix: '請修復問題',
    };
    if (actionPrompts[action]) {
      setInput(actionPrompts[action]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                  <Bot size={24} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
                </span>
              </div>
              <div>
                <h1 className="text-lg font-black text-[#003262]">ESG AI 助手</h1>
                <p className="text-[10px] text-slate-400">即時回應 · 5T 協議保護 · 上下文感知</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowContext(!showContext)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showContext ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-50 text-slate-400'
                )}
              >
                <Paperclip size={16} />
              </button>
              <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* ─── Main Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <OmniBaseCard className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} onAction={handleActionClick} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
              </div>

              {/* Context Panel */}
              <AnimatePresence>
                {showContext && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ContextPanel contexts={contexts} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="輸入您的問題或指令..."
                      rows={2}
                      className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-300 transition-all pr-20"
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Paperclip size={14} className="text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Mic size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-3 bg-[#003262] text-white rounded-xl hover:bg-[#002244] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[9px] text-slate-300 mt-2 text-center">
                  回應時間 &lt; 3s · 5T 協議保護 · 零幻覺保證
                </p>
              </div>
            </OmniBaseCard>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="space-y-4">
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                快速操作
              </h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 transition-colors group"
                  >
                    <action.icon
                      size={14}
                      className={cn(action.color, 'group-hover:scale-110 transition-transform')}
                    />
                    <span className="text-xs font-medium text-slate-600">{action.label}</span>
                    <ChevronRight
                      size={10}
                      className="ml-auto text-slate-300 group-hover:text-slate-400 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </OmniBaseCard>

            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Brain size={14} className="text-violet-500" />
                模型狀態
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'AI 模型', value: 'Gemini 2.0 Flash', status: 'online' },
                  { label: '回應速度', value: '< 3s', status: 'online' },
                  { label: '上下文窗口', value: '128K tokens', status: 'online' },
                  { label: '5T 驗證', value: '已啟用', status: 'online' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Clock size={14} className="text-blue-500" />
                最近對話
              </h3>
              <div className="space-y-2">
                {[
                  { title: '碳盤查分析', time: '10 分鐘前' },
                  { title: 'GRI 報告撰寫', time: '1 小時前' },
                  { title: '合規檢查', time: '3 小時前' },
                ].map((item) => (
                  <button
                    key={item.title}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-[10px] font-medium text-slate-600">{item.title}</span>
                    <span className="text-[9px] text-slate-300">{item.time}</span>
                  </button>
                ))}
              </div>
            </OmniBaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
