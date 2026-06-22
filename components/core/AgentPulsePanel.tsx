// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
  FileText,
  Save,
  Trash2,
  Copy,
  Check,
  Terminal,
  MessageSquare,
  DatabaseZap,
  Activity,
  Cpu,
  Brain,
  Zap,
  Target,
  Layers,
  Star,
  Heart,
  Settings,
  Bookmark,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Shield,
  Users,
  BookOpen,
  Globe,
  BarChart3,
  Volume2,
  VolumeX,
  Download,
  StickyNote,
  Archive,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// Agent Pulse — 萬能工具箱
// 整合：萬能筆記 + 我的最愛 + 超級管理員 + 萬能代理控制台 + 其他萬能系列
// ============================================================

type TabId = 'chat' | 'notes' | 'favorites' | 'admin' | 'omni' | 'tools';

interface Note {
  id: string;
  title: string;
  content: string;
  created: string;
}

interface Favorite {
  id: string;
  name: string;
  path: string;
  icon: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

const ADMIN_ITEMS = [
  { id: 'db', name: '資料庫管理', icon: DatabaseZap, description: 'Supabase 資料表/RLS 管理' },
  { id: 'users', name: '使用者管理', icon: Users, description: '帳號/權限/角色設定' },
  { id: 'audit', name: '稽核日誌', icon: Eye, description: '操作軌跡/安全稽核' },
  { id: 'reports', name: '報告歷史', icon: FileText, description: '已生成報告版本管理' },
  { id: 'settings', name: '系統設定', icon: Settings, description: '金鑰/環境/部署設定' },
  { id: 'sync', name: 'NCBDB 同步', icon: RefreshCw, description: '與 NCB 知識庫同步' },
];

const TOOLS_ITEMS = [
  { id: 'notes', name: '萬能筆記', icon: StickyNote, description: 'AI 筆記 + OmniTable 同步' },
  { id: 'vault', name: '證據金庫', icon: Shield, description: 'ZKP 封印 + 5T 驗證' },
  { id: 'gri', name: 'GRI 追蹤器', icon: BookOpen, description: '準則對齊/合規檢查' },
  { id: 'materiality', name: '材料性分析', icon: Layers, description: '重大主題評估矩陣' },
  { id: 'gri-tracker', name: 'GRI 對齊', icon: Globe, description: '24 段準則對齊管理' },
  { id: 'cbam', name: 'CBAM 計算', icon: BarChart3, description: '碳邊境申報計算' },
  { id: 'audit-verify', name: '稽核驗證', icon: CheckCircle2, description: '稽核軌跡驗證' },
  { id: 'health', name: '系統健檢', icon: Activity, description: '健康狀態/延遲監控' },
];

export default function AgentPulsePanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([
    { id: '1', name: '永續報告', path: '/sustain-write', icon: 'FileText' },
    { id: '2', name: '儀表板', path: '/dashboard', icon: 'BarChart3' },
    { id: '3', name: '學院', path: '/academy', icon: 'BookOpen' },
  ]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '╔══════════════════════════════════════════════════════════════╗',
    '║  OmniAgent Pulse — 萬能工具箱 v2.0                          ║',
    '║  輸入 "help" 查看可用指令                                    ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ db: 'connected', latency: 12, agents: 5 });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 載入筆記
  useEffect(() => {
    const saved = localStorage.getItem('omni_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // 儲存筆記
  const saveNote = useCallback(() => {
    if (messages.length < 2) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: messages[0]?.content?.slice(0, 30) || '新筆記',
      content: messages.map((m) => `[${m.role}] ${m.content}`).join('\n\n'),
      created: new Date().toLocaleDateString('zh-TW'),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('omni_notes', JSON.stringify(updated));
    setTerminalOutput((prev) => [...prev, `✅ 筆記已儲存: ${newNote.title}`, '']);
  }, [messages, notes]);

  const deleteNote = useCallback(
    (id: string) => {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      localStorage.setItem('omni_notes', JSON.stringify(updated));
    },
    [notes]
  );

  // AI 對話
  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = (text || input).trim();
      if (!messageText || isLoading) return;

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
      };
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        role: 'agent',
        content: '',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg, agentMsg]);
      setInput('');
      setIsLoading(true);

      // 模擬 AI 回應
      await new Promise((r) => setTimeout(r, 800));
      const response = generateAIResponse(messageText);
      setMessages((prev) =>
        prev.map((m) => (m.id === agentMsg.id ? { ...m, content: response } : m))
      );
      setIsLoading(false);
    },
    [input, isLoading]
  );

  function generateAIResponse(query: string): string {
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes('報告') || lowerQ.includes('生成')) {
      return `📊 永續報告生成指南：

1. 點擊「永續報告」→ 填寫公司資料
2. 確認 53 個單據完成度
3. 點擊「一鍵生成 24 萬字報告」
4. 下載 HTML 報告

目前系統已支援 24 段 × 53 單據 = 240,000 字完整報告。`;
    }
    if (lowerQ.includes('單據') || lowerQ.includes('完成度')) {
      return `📋 單據收集狀態：

🔴 基礎治理 (D): 14 個單據
🟢 環境面 (E): 18 個單據
🔵 社會面 (S): 15 個單據
🟡 資訊安全 (T): 6 個單據
🟣 治理面 (G): 16 個單據

共 53+ 個單據，必填約 40 個。在「永續撰寫」頁面可查看詳細進度。`;
    }
    if (lowerQ.includes('筆記') || lowerQ.includes('note')) {
      return `📝 萬能筆記功能：

• 點擊「儲存筆記」可將目前對話存為筆記
• 筆記會同步到 localStorage
• 可匯出為 Markdown 格式
• 背景同步至 OmniTable + NCBDB

您可以在任何頁面隨時呼叫我來整理筆記！`;
    }
    if (lowerQ.includes('系統') || lowerQ.includes('狀態')) {
      return `🖥️ 系統狀態：

✅ 資料庫: connected (12ms)
✅ 活躍代理: 5 個
✅ 記憶碎片: 已同步
✅ NCBDB: 已連線

您可以在「終端機」頁面輸入指令查看詳細資訊。`;
    }
    return `🤖 我可以協助您：

📊 永續報告 — 生成/下載 24 萬字報告
📋 單據管理 — 查看 53 個單據完成度
📝 萬能筆記 — 儲存/整理對話筆記
🔍 系統狀態 — 健康檢查/延遲監控
💡 知識問答 — ESG 法規/準則查詢

請輸入您的問題，我會盡力協助！`;
  }

  // 終端機
  const handleTerminal = useCallback(
    (cmd: string) => {
      setTerminalOutput((prev) => [...prev, `> ${cmd}`, '']);
      const lower = cmd.trim().toLowerCase();
      if (lower === 'help') {
        setTerminalOutput((prev) => [
          ...prev,
          '可用指令：',
          '  help — 顯示說明',
          '  status — 系統狀態',
          '  notes — 筆記列表',
          '  clear — 清除畫面',
          '',
        ]);
      } else if (lower === 'status') {
        setTerminalOutput((prev) => [
          ...prev,
          `DB: connected (${systemStatus.latency}ms)`,
          `Agents: ${systemStatus.agents}`,
          '',
        ]);
      } else if (lower === 'notes') {
        setTerminalOutput((prev) => [
          ...prev,
          `筆記數量: ${notes.length}`,
          ...notes.slice(0, 3).map((n) => `  - ${n.title}`),
          '',
        ]);
      } else if (lower === 'clear') {
        setTerminalOutput([
          '╔══════════════════════════════════════════════════════════════╗',
          '║  OmniAgent Pulse — 萬能工具箱 v2.0                          ║',
          '╚══════════════════════════════════════════════════════════════╝',
          '',
        ]);
      } else {
        setTerminalOutput((prev) => [...prev, `❌ 未知指令: ${cmd}，輸入 "help" 查看可用指令`, '']);
      }
      setTerminalInput('');
    },
    [notes, systemStatus]
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'chat', label: 'AI 對話', icon: MessageSquare },
    { id: 'notes', label: '筆記', icon: StickyNote, count: notes.length },
    { id: 'favorites', label: '最愛', icon: Heart, count: favorites.length },
    { id: 'admin', label: '管理', icon: Settings },
    { id: 'omni', label: 'Omni', icon: Bot },
    { id: 'tools', label: '工具', icon: Zap },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-neutral-900 text-white p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div>
            <p className="text-sm font-bold">Agent Pulse</p>
            <p className="text-[10px] text-neutral-400">
              萬能工具箱 · {notes.length} 筆記 · {favorites.length} 最愛
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
              activeTab === tab.id
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Chat */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[50vh]">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot size={32} className="mx-auto text-neutral-200 mb-2" />
                  <p className="text-xs text-neutral-500">開始對話或輸入問題</p>
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {['生成報告', '查看單據', '系統狀態'].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-[10px] px-2 py-1 bg-neutral-100 rounded-full text-neutral-600 hover:bg-neutral-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-xs',
                      msg.role === 'user'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    )}
                  >
                    {msg.content ||
                      (isLoading && msg.role === 'agent' && (
                        <Loader2 size={10} className="animate-spin inline" />
                      ))}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-2 border-t border-neutral-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="輸入訊息..."
                className="flex-1 text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-300"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50"
              >
                <Send size={14} />
              </button>
              <button
                onClick={saveNote}
                disabled={messages.length < 2}
                className="p-2 bg-neutral-100 rounded-lg disabled:opacity-50"
                title="儲存為筆記"
              >
                <Save size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-700">萬能筆記 ({notes.length})</p>
              <button
                onClick={saveNote}
                disabled={messages.length < 2}
                className="text-[10px] px-2 py-1 bg-cyan-600 text-white rounded disabled:opacity-50"
              >
                + 從對話建立
              </button>
            </div>
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <StickyNote size={24} className="mx-auto text-neutral-200 mb-2" />
                <p className="text-xs text-neutral-400">尚無筆記，從 AI 對話中儲存</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-2 bg-neutral-50 rounded-lg border border-neutral-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-neutral-800 truncate">{note.title}</p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-neutral-300 hover:text-red-500"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500">{note.created}</p>
                  <p className="text-[10px] text-neutral-600 mt-1 line-clamp-2">
                    {note.content.slice(0, 100)}...
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === 'favorites' && (
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-700 mb-2">我的最愛</p>
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-amber-500" />
                  <span className="text-xs text-neutral-700">{fav.name}</span>
                </div>
                <button
                  onClick={() => setFavorites((prev) => prev.filter((f) => f.id !== fav.id))}
                  className="text-neutral-300 hover:text-red-500"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <p className="text-[10px] text-neutral-400 mt-2">從左側導航列拖曳項目可加入最愛</p>
          </div>
        )}

        {/* Admin */}
        {activeTab === 'admin' && (
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-700 mb-2">超級管理員</p>
            {ADMIN_ITEMS.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <item.icon size={14} className="text-neutral-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-800">{item.name}</p>
                  <p className="text-[10px] text-neutral-500">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Omni Console */}
        {activeTab === 'omni' && (
          <div className="flex flex-col h-[50vh]">
            <div className="flex-1 overflow-y-auto p-2 bg-neutral-900 text-green-400 font-mono text-[10px]">
              {terminalOutput.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line || ' '}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-neutral-700 bg-neutral-900 flex gap-1">
              <span className="text-green-400 text-xs self-center">{'>'}</span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTerminal(terminalInput)}
                placeholder="輸入指令..."
                className="flex-1 bg-transparent text-green-400 text-xs outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>
        )}

        {/* Tools */}
        {activeTab === 'tools' && (
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-700 mb-2">萬能系列工具</p>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS_ITEMS.map((tool) => (
                <button
                  key={tool.id}
                  className="flex flex-col items-center gap-1 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <tool.icon size={16} className="text-neutral-600" />
                  <span className="text-[10px] font-medium text-neutral-700">{tool.name}</span>
                  <span className="text-[9px] text-neutral-400 text-center">
                    {tool.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
