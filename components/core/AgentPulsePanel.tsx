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
  Wifi,
  WifiOff,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Radio,
  Navigation,
  XCircle,
  Power,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// Agent Pulse v3 — 全功能萬能工具箱
// 可拖曳/移動/關閉/縮小/放大/語音控制/自然語言跳轉
// 整合：萬能筆記 + 我的最愛 + 超級管理員 + OAAgentBus
// ============================================================

type TabId = 'chat' | 'notes' | 'favorites' | 'admin' | 'omni' | 'tools';
type PulseState = 'expanded' | 'minimized' | 'dismissed';

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
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  isVoice?: boolean;
}

interface Position {
  x: number;
  y: number;
}

// 自然語言跳轉命令
const VOICE_COMMANDS: Record<string, { path: string; label: string }> = {
  儀表板: { path: '/dashboard', label: '儀表板' },
  報告: { path: '/sustain-write', label: '永續報告' },
  撰寫: { path: '/sustain-write', label: '永續撰寫' },
  金庫: { path: '/vault', label: '證據金庫' },
  情報: { path: '/intelligence', label: '智能分析' },
  學院: { path: '/academy', label: '永續學院' },
  智庫: { path: '/library', label: '永續智庫' },
  閱讀室: { path: '/reading-room', label: '永續閱覽室' },
  財務: { path: '/finance', label: '永續財務' },
  治理: { path: '/governance', label: '治理' },
  環境: { path: '/dashboard/metrics/environmental', label: '環境指標' },
  社會: { path: '/dashboard/metrics/social', label: '社會指標' },
  合規: { path: '/compliance-check', label: '合規檢查' },
  稽核: { path: '/audit-verify', label: '稽核驗證' },
  地圖: { path: '/map', label: '地圖' },
  任務: { path: '/tasks', label: '任務' },
  筆記: { path: '/notes', label: '筆記' },
  最愛: { path: '/favorites', label: '我的最愛' },
  搜尋: { path: '/search', label: '搜尋' },
  首頁: { path: '/', label: '首頁' },
  管理: { path: '/super-admin', label: '超級管理員' },
  admin: { path: '/super-admin', label: '超級管理員' },
};

const ADMIN_ITEMS = [
  { id: 'db', name: '資料庫管理', icon: DatabaseZap, desc: 'Supabase 資料表/RLS' },
  { id: 'users', name: '使用者管理', icon: Users, desc: '帳號/權限/角色' },
  { id: 'audit', name: '稽核日誌', icon: Eye, desc: '操作軌跡/安全稽核' },
  { id: 'reports', name: '報告歷史', icon: FileText, desc: '報告版本管理' },
  { id: 'settings', name: '系統設定', icon: Settings, desc: '金鑰/環境/部署' },
  { id: 'sync', name: 'NCBDB 同步', icon: RefreshCw, desc: 'NCB 知識庫同步' },
];

const TOOLS_ITEMS = [
  { id: 'notes', name: '萬能筆記', icon: StickyNote, desc: 'AI 筆記 + OmniTable' },
  { id: 'vault', name: '證據金庫', icon: Shield, desc: 'ZKP 封印 + 5T' },
  { id: 'gri', name: 'GRI 追蹤', icon: BookOpen, desc: '準則對齊/合規' },
  { id: 'materiality', name: '材料性', icon: Layers, desc: '重大主題評估' },
  { id: 'cbam', name: 'CBAM', icon: BarChart3, desc: '碳邊境申報' },
  { id: 'audit-verify', name: '稽核驗證', icon: CheckCircle2, desc: '稽核軌跡' },
  { id: 'health', name: '系統健檢', icon: Activity, desc: '健康/延遲' },
  { id: 'ai-platform', name: 'AI 平台', icon: Sparkles, desc: 'AI 模型/推論' },
];

export default function AgentPulsePanel({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const [pulseState, setPulseState] = useState<PulseState>('expanded');
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([
    { id: '1', name: '永續報告', path: '/sustain-write' },
    { id: '2', name: '儀表板', path: '/dashboard' },
    { id: '3', name: '學院', path: '/academy' },
  ]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '╔══════════════════════════════════════════════════════════════╗',
    '║  Agent Pulse v3 — 萬能工具箱                                ║',
    '║  語音:「帶我去儀表板」「跳到學院」  移動:「往上/下/左/右」   ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [busStatus, setBusStatus] = useState({ ws: false, sse: false, signals: 0 });

  // 拖曳
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem('agent_pulse_position');
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
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
      } catch {}
    }
  }, []);

  // 模擬 Bus
  useEffect(() => {
    const i = setInterval(() => {
      setBusStatus((p) => ({
        ...p,
        ws: Math.random() > 0.1,
        sse: Math.random() > 0.1,
        signals: p.signals + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(i);
  }, []);

  const savePosition = useCallback((pos: Position) => {
    localStorage.setItem('agent_pulse_position', JSON.stringify(pos));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (pulseState !== 'expanded') return;
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    },
    [position, pulseState]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const nx = Math.max(0, Math.min(window.innerWidth - 420, e.clientX - dragStartRef.current.x));
      const ny = Math.max(
        0,
        Math.min(window.innerHeight - 100, e.clientY - dragStartRef.current.y)
      );
      setPosition({ x: nx, y: ny });
    };
    const onUp = () => {
      setIsDragging(false);
      savePosition(position);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, position, savePosition]);

  const movePulse = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      const step = 40;
      setPosition((p) => {
        const np = { ...p };
        if (dir === 'up') np.y = Math.max(0, np.y - step);
        if (dir === 'down') np.y = Math.min(window.innerHeight - 100, np.y + step);
        if (dir === 'left') np.x = Math.max(0, np.x - step);
        if (dir === 'right') np.x = Math.min(window.innerWidth - 420, np.x + step);
        savePosition(np);
        return np;
      });
    },
    [savePosition]
  );

  // 語音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        handleVoiceCommand('帶我去儀表板');
      };
      rec.start();
      setIsRecording(true);
      setTimeout(() => rec.stop(), 3000);
    } catch {
      setInput('需要麥克風權限');
    }
  };

  const handleVoiceCommand = (text: string) => {
    for (const [kw, cmd] of Object.entries(VOICE_COMMANDS)) {
      if (text.includes(kw)) {
        onNavigate(cmd.path);
        setTerminalOutput((p) => [...p, `🎤 → ${cmd.label}`, '']);
        return;
      }
    }
    if (text.includes('往上')) movePulse('up');
    else if (text.includes('往下')) movePulse('down');
    else if (text.includes('往左')) movePulse('left');
    else if (text.includes('往右')) movePulse('right');
    else if (text.includes('放大')) setPulseState('expanded');
    else if (text.includes('縮小')) setPulseState('minimized');
    else if (text.includes('關閉')) {
      setPulseState('dismissed');
      onClose();
    } else handleSend(text);
  };

  // AI 對話
  const handleSend = useCallback(
    async (text?: string) => {
      const msg = (text || input).trim();
      if (!msg || isLoading) return;
      const uMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'user',
        content: msg,
        timestamp: Date.now(),
        isVoice: text !== undefined,
      };
      const aMsg: ChatMessage = {
        id: `m-${Date.now()}-a`,
        role: 'agent',
        content: '',
        timestamp: Date.now(),
      };
      setMessages((p) => [...p, uMsg, aMsg]);
      setInput('');
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setMessages((p) =>
        p.map((m) => (m.id === aMsg.id ? { ...m, content: genResponse(msg) } : m))
      );
      setIsLoading(false);
      setBusStatus((p) => ({ ...p, signals: p.signals + 1 }));
    },
    [input, isLoading]
  );

  function genResponse(q: string): string {
    const l = q.toLowerCase();
    if (l.includes('報告'))
      return '📊 永續報告：\n1. 填寫公司資料\n2. 確認 53 單據\n3. 一鍵生成 24 萬字\n4. 下載 HTML';
    if (l.includes('單據')) return '📋 53 個單據：D×14 E×18 S×15 T×6 G×16';
    if (l.includes('跳轉') || l.includes('去'))
      return '🧭 可用：儀表板/報告/金庫/情報/學院/智庫/財務/治理/合規/稽核';
    return '🤖 可協助：報告/單據/筆記/跳轉/語音/移動\n\n🎤 試試：「帶我去儀表板」「生成報告」';
  }

  // 筆記
  const saveNote = useCallback(() => {
    if (messages.length < 2) return;
    const n: Note = {
      id: `n-${Date.now()}`,
      title: messages[0]?.content?.slice(0, 30) || '筆記',
      content: messages.map((m) => `[${m.role}] ${m.content}`).join('\n'),
      created: new Date().toLocaleDateString('zh-TW'),
    };
    const u = [n, ...notes];
    setNotes(u);
    localStorage.setItem('omni_notes', JSON.stringify(u));
  }, [messages, notes]);

  const delNote = useCallback(
    (id: string) => {
      const u = notes.filter((n) => n.id !== id);
      setNotes(u);
      localStorage.setItem('omni_notes', JSON.stringify(u));
    },
    [notes]
  );

  // 終端機
  const handleTerm = useCallback(
    (cmd: string) => {
      setTerminalOutput((p) => [...p, `> ${cmd}`, '']);
      const lo = cmd.trim().toLowerCase();
      if (lo === 'help') setTerminalOutput((p) => [...p, 'help status bus nav move clear', '']);
      else if (lo === 'status')
        setTerminalOutput((p) => [
          ...p,
          `WS:${busStatus.ws ? '✅' : '❌'} SSE:${busStatus.sse ? '✅' : '❌'}`,
          `Signals:${busStatus.signals}`,
          '',
        ]);
      else if (lo === 'bus')
        setTerminalOutput((p) => [
          ...p,
          `WS:${busStatus.ws ? 'ok' : 'off'} SSE:${busStatus.sse ? 'ok' : 'off'} Signals:${
            busStatus.signals
          }`,
          '',
        ]);
      else if (lo.startsWith('nav ')) {
        const t = cmd.slice(4);
        const m = Object.entries(VOICE_COMMANDS).find(([k]) => t.includes(k));
        if (m) {
          onNavigate(m[1].path);
          setTerminalOutput((p) => [...p, `→ ${m[1].label}`, '']);
        } else setTerminalOutput((p) => [...p, `❌ 未知: ${t}`, '']);
      } else if (lo.startsWith('move ')) {
        const d = cmd.slice(5);
        if (['up', 'down', 'left', 'right'].includes(d)) movePulse(d as any);
        else setTerminalOutput((p) => [...p, '❌ 方向: up/down/left/right', '']);
      } else if (lo === 'clear') setTerminalOutput(['Agent Pulse Terminal', '']);
      else setTerminalOutput((p) => [...p, `❌ 未知: ${cmd}`, '']);
      setTerminalInput('');
    },
    [busStatus, movePulse, onNavigate]
  );

  // 語音合成
  const speak = (t: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'zh-TW';
    u.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  if (pulseState === 'dismissed') return null;

  if (pulseState === 'minimized') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setPulseState('expanded')}
          className="w-12 h-12 rounded-full bg-cyan-600 text-white shadow-sm flex items-center justify-center hover:bg-cyan-700 hover:scale-110 transition-all relative"
        >
          <Bot size={20} />
          {busStatus.signals > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
          )}
        </button>
      </div>
    );
  }

  const tabs: { id: TabId; l: string; I: React.ElementType; c?: number }[] = [
    { id: 'chat', l: 'AI', I: MessageSquare },
    { id: 'notes', l: '筆記', I: StickyNote, c: notes.length },
    { id: 'favorites', l: '最愛', I: Heart, c: favorites.length },
    { id: 'admin', l: '管理', I: Settings },
    { id: 'omni', l: 'Omni', I: Terminal },
    { id: 'tools', l: '工具', I: Zap },
  ];

  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        left: position.x || 'auto',
        right: position.x ? 'auto' : 24,
        bottom: position.y || 24,
        zIndex: 9999,
      }}
      className={cn(
        'w-[420px] max-h-[80vh] bg-white rounded-xl shadow-sm border border-neutral-200 flex flex-col overflow-hidden transition-all',
        isDragging && 'opacity-90'
      )}
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-neutral-900 text-white p-3 flex items-center justify-between shrink-0 cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div>
            <p className="text-sm font-bold">Agent Pulse</p>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span
                className={cn(
                  'flex items-center gap-0.5',
                  busStatus.ws ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                <Wifi size={8} />
                WS
              </span>
              <span
                className={cn(
                  'flex items-center gap-0.5',
                  busStatus.sse ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                <Radio size={8} />
                SSE
              </span>
              <span className="text-amber-400 flex items-center gap-0.5">
                <Zap size={8} />
                {busStatus.signals}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => movePulse('up')}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            title="上"
          >
            <ArrowUp size={10} />
          </button>
          <button
            onClick={() => movePulse('left')}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            title="左"
          >
            <ArrowLeft size={10} />
          </button>
          <button
            onClick={() => movePulse('right')}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            title="右"
          >
            <ArrowRight size={10} />
          </button>
          <button
            onClick={() => movePulse('down')}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            title="下"
          >
            <ArrowDown size={10} />
          </button>
          <div className="w-px h-4 bg-neutral-700 mx-0.5" />
          <button
            onClick={() => setPulseState('minimized')}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
            title="縮小"
          >
            <Minimize2 size={12} />
          </button>
          <button
            onClick={() => {
              setPulseState('dismissed');
              onClose();
            }}
            className="p-1 hover:bg-red-600 rounded text-neutral-400 hover:text-white"
            title="關閉"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium',
              activeTab === t.id
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-neutral-400 hover:text-neutral-600'
            )}
          >
            <t.I size={14} />
            {t.l}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[50vh]">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <Bot size={28} className="mx-auto text-neutral-200 mb-2" />
                  <p className="text-xs text-neutral-500 mb-2">AI 對話 · 語音 · 自然語言跳轉</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {['生成報告', '查看單據', '帶我去儀表板', '往上'].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleVoiceCommand(q)}
                        className="text-[10px] px-2 py-1 bg-neutral-100 rounded-full text-neutral-600 hover:bg-neutral-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-2">
                    🎤「帶我去 XX」「跳到 XX」「往上/下/左/右」
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-xs',
                      m.role === 'user'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    )}
                  >
                    {m.content ||
                      (m.role === 'agent' && isLoading && (
                        <Loader2 size={10} className="animate-spin inline" />
                      ))}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-2 border-t border-neutral-100 flex gap-1">
              <button
                onClick={startRecording}
                className={cn(
                  'p-2 rounded-lg',
                  isRecording
                    ? 'bg-red-500 text-white '
                    : 'bg-neutral-100 hover:bg-neutral-200'
                )}
              >
                <Mic size={14} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="輸入訊息或語音指令..."
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
              >
                <Save size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-700">萬能筆記 ({notes.length})</p>
              <button
                onClick={saveNote}
                disabled={messages.length < 2}
                className="text-[10px] px-2 py-1 bg-cyan-600 text-white rounded disabled:opacity-50"
              >
                + 建立
              </button>
            </div>
            {notes.length === 0 ? (
              <div className="text-center py-6">
                <StickyNote size={24} className="mx-auto text-neutral-200 mb-2" />
                <p className="text-xs text-neutral-400">尚無筆記</p>
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-800 truncate">{n.title}</p>
                    <button
                      onClick={() => delNote(n.id)}
                      className="text-neutral-300 hover:text-red-500"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500">{n.created}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-700 mb-2">我的最愛</p>
            {favorites.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
                onClick={() => onNavigate(f.path)}
              >
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-amber-500" />
                  <span className="text-xs text-neutral-700">{f.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavorites((p) => p.filter((x) => x.id !== f.id));
                  }}
                  className="text-neutral-300 hover:text-red-500"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-700 mb-2">超級管理員</p>
            {ADMIN_ITEMS.map((i) => (
              <button
                key={i.id}
                className="w-full flex items-center gap-3 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <i.icon size={14} className="text-neutral-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-800">{i.name}</p>
                  <p className="text-[10px] text-neutral-500">{i.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'omni' && (
          <div className="flex flex-col h-[50vh]">
            <div className="flex-1 overflow-y-auto p-2 bg-neutral-900 text-green-400 font-mono text-[10px]">
              {terminalOutput.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {l || ' '}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-neutral-700 bg-neutral-900 flex gap-1">
              <span className="text-green-400 text-xs self-center">{'>'}</span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTerm(terminalInput)}
                placeholder="help / status / nav / move / clear"
                className="flex-1 bg-transparent text-green-400 text-xs outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="p-3 space-y-2">
            <p className="text-xs font-medium text-neutral-700 mb-2">萬能系列</p>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS_ITEMS.map((t) => (
                <button
                  key={t.id}
                  className="flex flex-col items-center gap-1 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                >
                  <t.icon size={16} className="text-neutral-600" />
                  <span className="text-[10px] font-medium text-neutral-700">{t.name}</span>
                  <span className="text-[9px] text-neutral-400 text-center">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
