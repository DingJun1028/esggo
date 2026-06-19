'use client';

import React, { useState, useEffect, useRef } from 'react';

import {
  MessageSquare,
  Send,
  Mic,
  Paperclip,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Globe,
  Zap,
  ShieldCheck,
  FileText,
  ChevronRight,
  X,
  Minimize2,
  Maximize2,
  Smile,
  Image,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'read';
  agent?: { name: string; avatar: string };
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/* ─── Mock Data ─── */
const FAQS: FAQ[] = [
  {
    id: 'faq-001',
    question: '如何開始使用 ESGGO？',
    answer:
      '註冊帳號後，您可以透過新手引導快速上手。首先設定組織資訊，然後上傳 ESG 數據，系統將自動進行 5T 驗證。',
    category: '入門',
  },
  {
    id: 'faq-002',
    question: '5T 協議是什麼？',
    answer:
      '5T 協議是 ESGGO 的數據誠信框架，包含 Tangible（真）、Traceable（善）、Trackable（美）、Transparent（信）、Trustworthy（通）五個維度。',
    category: '功能',
  },
  {
    id: 'faq-003',
    question: '如何生成永續報告？',
    answer:
      '選擇報告模板（GRI/SASB/TCFD），上傳相關數據，AI 將自動生成報告草稿。您可以進行編輯後一鍵導出。',
    category: '報告',
  },
  {
    id: 'faq-004',
    question: 'ZKP 驗證如何運作？',
    answer:
      '零知識證明（ZKP）允許在不揭露原始數據的情況下證明數據的真實性。系統會自動為您的數據生成 ZKP 證明。',
    category: '技術',
  },
  {
    id: 'faq-005',
    question: '如何邀請團隊成員？',
    answer: '在管理後台的「用戶管理」中，點擊「邀請成員」，輸入電子郵件即可發送邀請。',
    category: '團隊',
  },
  {
    id: 'faq-006',
    question: '資料安全如何保障？',
    answer:
      '所有數據均採用 AES-256 加密存儲，並透過 SHA-256 雜湊鎖定確保不可篡改。我們遵循 GDPR 與台灣個資法。',
    category: '安全',
  },
];

const QUICK_REPLIES = ['如何開始使用？', '5T 協議說明', '報告生成教學', '聯絡真人客服'];

/* ─── Components ─── */

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-slate-50 rounded-full px-3 py-1 text-[10px] text-slate-400">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('flex gap-2 my-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isUser ? 'bg-[#003262]' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
        )}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-white" />
        )}
      </div>
      <div className={cn('max-w-[70%]')}>
        {message.agent && <p className="text-[9px] text-slate-400 mb-0.5">{message.agent.name}</p>}
        <div
          className={cn(
            'rounded-2xl px-3 py-2',
            isUser
              ? 'bg-[#003262] text-white'
              : 'bg-white border border-slate-100 text-slate-700 shadow-sm'
          )}
        >
          <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={cn('text-[9px] text-slate-300 mt-1', isUser ? 'text-right' : 'text-left')}>
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

function TypingIndicator() {
  return (
    <div className="flex gap-2 my-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl px-3 py-2 shadow-sm">
        <div className="flex gap-1">
          <span
            className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-001',
      role: 'system',
      content: '歡迎使用 ESGGO 客服中心。平均響應時間 < 1 分鐘。',
      timestamp: Date.now() - 60000,
    },
    {
      id: 'agent-001',
      role: 'agent',
      content:
        '您好！我是 ESGGO 客服助手。請問有什麼可以幫您？您可以選擇下方快速問題，或直接輸入您的問題。',
      timestamp: Date.now() - 50000,
      agent: { name: 'ESGGO 客服', avatar: '🤖' },
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFAQ, setShowFAQ] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
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
        '感謝您的提問！根據我們的知識庫，我找到了相關資訊。請查看以下說明，如果還有其他問題，請隨時告訴我。',
        '這是一個很好的問題！讓我為您詳細說明。您可以參考我們的教學文件，或者我可以為您安排專人解說。',
        '我已經將您的問題記錄下來。如果需要更深入的協助，我可以為您轉接真人客服。',
      ];

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        role: 'agent',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        agent: { name: 'ESGGO 客服', avatar: '🤖' },
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

  const handleQuickReply = (reply: string) => {
    setInput(reply);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                <MessageSquare size={20} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
              </span>
            </div>
            <div>
              <h1 className="text-lg font-black text-[#003262]">客服聊天</h1>
              <p className="text-[10px] text-slate-400">平均響應時間 &lt; 1 分鐘 · 24/7 在線</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <Phone size={16} className="text-slate-400" />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <Mail size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <Minimize2 size={16} className="text-slate-400" />
              ) : (
                <Maximize2 size={16} className="text-slate-400" />
              )}
            </button>
          </div>
        </header>

        {/* ─── Chat Area ─── */}
        
          {isExpanded && (
            <div
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            >
              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-1">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-slate-50">
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="text-[10px] font-medium px-2.5 py-1 bg-slate-50 text-slate-500 rounded-full hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Toggle */}
              <div className="px-4 py-2 border-t border-slate-50">
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-cyan-600 transition-colors"
                >
                  <FileText size={12} />
                  常見問題
                  <ChevronRight
                    size={10}
                    className={cn('transition-transform', showFAQ && 'rotate-90')}
                  />
                </button>
                
                  {showFAQ && (
                    <div
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {FAQS.map((faq) => (
                          <button
                            key={faq.id}
                            onClick={() => {
                              setInput(faq.question);
                              setShowFAQ(false);
                            }}
                            className="text-left p-2 bg-slate-50 rounded-lg hover:bg-cyan-50 transition-colors"
                          >
                            <p className="text-[10px] font-medium text-[#003262]">{faq.question}</p>
                            <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                              {faq.answer}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="輸入您的問題..."
                      rows={2}
                      className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 pr-20"
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                        <Paperclip size={14} className="text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                        <Mic size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 bg-[#003262] text-white rounded-xl hover:bg-[#002244] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        

        {/* ─── Contact Options ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            {
              icon: Phone,
              title: '電話支援',
              desc: '02-1234-5678',
              sub: '週一至週五 09:00-18:00',
              color: 'text-emerald-600',
            },
            {
              icon: Mail,
              title: '電子郵件',
              desc: 'support@esggo.com',
              sub: '24 小時內回覆',
              color: 'text-blue-600',
            },
            {
              icon: Globe,
              title: '線上資源',
              desc: 'docs.esggo.com',
              sub: '完整 API 文檔與教學',
              color: 'text-violet-600',
            },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.title}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-slate-100 p-4 text-left hover:shadow-md transition-all"
              >
                <Icon size={20} className={cn('mb-2', option.color)} />
                <h4 className="text-sm font-bold text-[#003262]">{option.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{option.desc}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{option.sub}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
