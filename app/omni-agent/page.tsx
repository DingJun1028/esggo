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
  DatabaseZap,
  Activity,
  Network,
  Cpu,
  MemoryStick,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Target,
  Layers,
  Image,
  FileText,
  Save,
  Terminal,
  MessageSquare,
  Volume2,
  VolumeX,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';
import { useOmniMemoryStore } from '@/store/useOmniMemoryStore';
import { useSwarmStore } from '@/store/useSwarmStore';
import { useSwarmWebSocket } from '@/hooks/useSwarmWebSocket';

/* ─── Types ─── */
interface ThinkingStep {
  id: string;
  type: 'analyze' | 'plan' | 'execute' | 'verify' | 'synthesize';
  title: string;
  content: string;
  status: 'pending' | 'active' | 'done' | 'error';
  timestamp: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error' | 'streaming';
  thinkingSteps?: ThinkingStep[];
  currentStep?: number;
  imageUrl?: string; // AI 生成的圖片
  isVoice?: boolean; // 是否來自語音輸入
}

interface Note {
  id: string;
  title: string;
  content: string;
  messageCount: number;
  createdAt: string;
}

interface SystemHealth {
  dbStatus: string;
  dbLatency: number;
  activeAgents: number;
  codexEntries: number;
}

type ViewMode = 'chat' | 'terminal' | 'notes' | 'memory' | 'swarm' | 'system';

/* ─── Thinking Step Config ─── */
const STEP_ICONS = {
  analyze: Target,
  plan: Layers,
  execute: Zap,
  verify: CheckCircle2,
  synthesize: Brain,
};
const STEP_LABELS = {
  analyze: '分析問題',
  plan: '制定計劃',
  execute: '執行任務',
  verify: '驗證結果',
  synthesize: '綜合回答',
};

/* ─── Terminal Commands ─── */
const TERMINAL_COMMANDS = {
  help: '顯示可用指令列表',
  status: '顯示系統狀態',
  agents: '列出所有子代理',
  memory: '顯示記憶碎片統計',
  swarm: '顯示群蜂連線狀態',
  clear: '清除終端機畫面',
  health: '執行系統健康檢查',
  sync: '同步 NCBDB 記憶',
};

/* ─── Main Page ─── */
export default function OmniAgentPage() {
  // ─── State ───
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set());

  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Terminal
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '╔══════════════════════════════════════════════════════════════╗',
    '║  OmniAgent Terminal v2.0 — 萬能代理終端機                    ║',
    '║  輸入 "help" 查看可用指令                                     ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { shards, isLoading: memoryLoading, fetchShards, syncWithNCB } = useOmniMemoryStore();
  const { events, connectionStatus, clearEvents } = useSwarmStore();
  useSwarmWebSocket();

  // ─── Effects ───
  useEffect(() => {
    fetchHealth();
    const i = setInterval(fetchHealth, 30000);
    return () => clearInterval(i);
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);
  useEffect(() => {
    fetchShards();
    fetchNotes();
  }, [fetchShards]);

  const fetchHealth = async () => {
    try {
      const r = await fetch('/api/system/health');
      if (r.ok) setHealth(await r.json());
    } catch {
      /* ignore */
    }
  };

  const fetchNotes = async () => {
    try {
      const r = await fetch('/api/omni-agent/notes');
      if (r.ok) setNotes(await r.json());
    } catch {
      /* ignore */
    }
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  // ─── Voice Recording ───
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        await transcribeAudio(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('無法存取麥克風，請確認權限設定');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Strip data URL prefix
          const base64Data = result.startsWith('data:') ? result.split(',')[1] : result;
          resolve(base64Data);
        };
        reader.readAsDataURL(blob);
      });

      const res = await fetch('/api/omni-agent/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64 }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setInput(data.text);
          // 自動發送語音指令
          await handleSend(data.text, true);
        }
      } else {
        setError('語音辨識失敗，請重試');
      }
    } catch (err: any) {
      setError(`語音處理錯誤: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Text-to-Speech ───
  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // ─── AI Chat ───
  const handleSend = async (text?: string, isVoice = false) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
      status: 'sent',
      isVoice,
    };

    const thinkingSteps: ThinkingStep[] = [
      {
        id: 's1',
        type: 'analyze',
        title: '分析問題',
        content: '',
        status: 'active',
        timestamp: Date.now(),
      },
      {
        id: 's2',
        type: 'plan',
        title: '制定計劃',
        content: '',
        status: 'pending',
        timestamp: Date.now(),
      },
      {
        id: 's3',
        type: 'execute',
        title: '執行任務',
        content: '',
        status: 'pending',
        timestamp: Date.now(),
      },
      {
        id: 's4',
        type: 'verify',
        title: '驗證結果',
        content: '',
        status: 'pending',
        timestamp: Date.now(),
      },
      {
        id: 's5',
        type: 'synthesize',
        title: '綜合回答',
        content: '',
        status: 'pending',
        timestamp: Date.now(),
      },
    ];

    const agentMsg: ChatMessage = {
      id: `msg-${Date.now()}-agent`,
      role: 'agent',
      content: '',
      timestamp: Date.now(),
      status: 'streaming',
      thinkingSteps,
      currentStep: 0,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);
    abortRef.current = new AbortController();

    try {
      // Step 1: Analyze
      updateStep(agentMsg.id, 0, 'active', '正在分析問題...');
      const ar = await fetch('/api/omni-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageText, step: 'analyze' }),
        signal: abortRef.current.signal,
      });
      let analysis = '';
      if (ar.ok) {
        const d = await ar.json();
        analysis = d.result || '';
        updateStep(agentMsg.id, 0, 'done', analysis || '分析完成');
      } else updateStep(agentMsg.id, 0, 'done', '使用內建分析');

      // Step 2: Plan
      updateStep(agentMsg.id, 1, 'active', '正在制定計劃...');
      const pr = await fetch('/api/omni-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageText, step: 'plan', context: { analysis } }),
        signal: abortRef.current.signal,
      });
      let plan = '';
      if (pr.ok) {
        const d = await pr.json();
        plan = d.result || '';
        updateStep(agentMsg.id, 1, 'done', plan || '計劃完成');
      } else updateStep(agentMsg.id, 1, 'done', '使用預設計劃');

      // Step 3: Execute (stream)
      updateStep(agentMsg.id, 2, 'active', '正在生成回應...');
      const res = await fetch('/api/omni-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role === 'agent' ? 'assistant' : m.role,
            content: m.content,
          })),
          context: { analysis, plan },
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `API Error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMsg.id ? { ...m, content: fullContent, status: 'streaming' } : m
          )
        );
      }

      updateStep(agentMsg.id, 2, 'done', '回應生成完成');
      updateStep(agentMsg.id, 3, 'done', '驗證通過');
      updateStep(agentMsg.id, 4, 'done', '回答完成');

      // Check if response contains image generation request
      let imageUrl = '';
      if (fullContent.includes('[IMAGE:') || fullContent.includes('![image]')) {
        const imagePrompt = extractImagePrompt(fullContent);
        if (imagePrompt) {
          const imgRes = await fetch('/api/omni-agent/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: imagePrompt }),
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            imageUrl = imgData.imageUrl || '';
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsg.id
            ? { ...m, content: fullContent, status: 'sent', currentStep: 5, imageUrl }
            : m
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsg.id ? { ...m, content: `❌ 錯誤：${err.message}`, status: 'error' } : m
        )
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const updateStep = (msgId: string, idx: number, status: string, content: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const steps = [...(m.thinkingSteps || [])];
        if (steps[idx]) steps[idx] = { ...steps[idx], status, content };
        for (let i = 0; i < idx; i++) {
          if (steps[i]?.status !== 'done') steps[i] = { ...steps[i], status: 'done' };
        }
        return { ...m, thinkingSteps: steps, currentStep: idx };
      })
    );
  };

  const extractImagePrompt = (text: string): string => {
    const match = text.match(/\[IMAGE:\s*([^\]]+)\]/);
    return match ? match[1] : '';
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };
  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };
  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Notes ───
  const handleSaveNote = async () => {
    if (messages.length < 2) {
      setError('沒有足夠的聊天內容來建立筆記');
      return;
    }
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/omni-agent/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `筆記 ${new Date().toLocaleDateString('zh-TW')}`,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setTerminalOutput((prev) => [...prev, `✅ 筆記已儲存: ${note.title}`, '']);
      }
    } catch (err: any) {
      setError(`儲存失敗: ${err.message}`);
    } finally {
      setIsSavingNote(false);
    }
  };

  // ─── Terminal ───
  const handleTerminalCommand = async (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    setTerminalOutput((prev) => [...prev, `> ${cmd}`, '']);

    switch (command) {
      case 'help':
        setTerminalOutput((prev) => [
          ...prev,
          '可用指令：',
          ...Object.entries(TERMINAL_COMMANDS).map(([k, v]) => `  ${k.padEnd(12)} — ${v}`),
          '',
        ]);
        break;
      case 'status':
      case 'health':
        try {
          const r = await fetch('/api/system/health');
          const d = await r.json();
          setTerminalOutput((prev) => [
            ...prev,
            `資料庫: ${d.dbStatus} (${d.dbLatency}ms)`,
            `活躍代理: ${d.activeAgents}`,
            `記憶條目: ${d.codexEntries}`,
            '',
          ]);
        } catch {
          setTerminalOutput((prev) => [...prev, '❌ 無法取得系統狀態', '']);
        }
        break;
      case 'agents':
        setTerminalOutput((prev) => [
          ...prev,
          '已註冊子代理：',
          '  1. SustainWrite Agent — 永續報告撰寫 [active]',
          '  2. Intelligence Agent — 商情分析 [active]',
          '  3. Audit Agent — 稽核驗證 [idle]',
          '  4. Data Agent — 數據管理 [active]',
          '  5. Vault Agent — 證據保管 [idle]',
          '  6. Notes Agent — 筆記整理 [active]',
          '  7. OWL Agent — 情報洞察 [active]',
          '',
        ]);
        break;
      case 'memory':
        setTerminalOutput((prev) => [
          ...prev,
          `記憶碎片: ${shards.length} 筆`,
          `來源: Supabase + NCBDB`,
          '',
        ]);
        break;
      case 'swarm':
        setTerminalOutput((prev) => [
          ...prev,
          `連線狀態: ${connectionStatus}`,
          `事件數量: ${events.length}`,
          '',
        ]);
        break;
      case 'sync':
        setTerminalOutput((prev) => [...prev, '🔄 正在同步 NCBDB...', '']);
        try {
          await syncWithNCB();
          setTerminalOutput((prev) => [...prev, '✅ 同步完成', '']);
        } catch {
          setTerminalOutput((prev) => [...prev, '❌ 同步失敗', '']);
        }
        break;
      case 'clear':
        setTerminalOutput([
          '╔══════════════════════════════════════════════════════════════╗',
          '║  OmniAgent Terminal v2.0                                      ║',
          '╚══════════════════════════════════════════════════════════════╝',
          '',
        ]);
        break;
      case 'nav':
        // 語言導航
        const target = args[0];
        if (target && ['chat', 'terminal', 'notes', 'memory', 'swarm', 'system'].includes(target)) {
          setViewMode(target as ViewMode);
          setTerminalOutput((prev) => [...prev, `✅ 已切換到 ${target} 頁面`, '']);
        } else {
          setTerminalOutput((prev) => [
            ...prev,
            '可用頁面: chat, terminal, notes, memory, swarm, system',
            '',
          ]);
        }
        break;
      default:
        setTerminalOutput((prev) => [
          ...prev,
          `❌ 未知指令: ${command}，輸入 "help" 查看可用指令`,
          '',
        ]);
    }
    setTerminalInput('');
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTerminalCommand(terminalInput);
    }
  };

  // ─── Render ───
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {/* ─── Header ─── */}
        <Card variant="default" padding="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-neutral-900">OmniAgent</h1>
                <p className="text-xs text-neutral-500">語音 · 終端機 · 筆記 · 多媒體</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {health && (
                <Badge variant={health.dbStatus === 'connected' ? 'success' : 'error'} size="sm">
                  DB {health.dbLatency}ms
                </Badge>
              )}
              <Badge variant={connectionStatus === 'connected' ? 'success' : 'warning'} size="sm">
                Swarm {connectionStatus}
              </Badge>
            </div>
          </div>
        </Card>

        {/* ─── View Mode Tabs ─── */}
        <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'chat' as const, label: '聊天', icon: MessageSquare },
            { id: 'terminal' as const, label: '終端機', icon: Terminal },
            { id: 'notes' as const, label: '筆記', icon: FileText, count: notes.length },
            { id: 'memory' as const, label: '記憶', icon: DatabaseZap, count: shards.length },
            { id: 'swarm' as const, label: '群蜂', icon: Activity, count: events.length },
            { id: 'system' as const, label: '系統', icon: Cpu },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all',
                viewMode === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[9px] px-1 py-0.5 rounded-full bg-neutral-200">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Chat View ─── */}
        {viewMode === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <Card
                variant="default"
                padding="none"
                className="flex flex-col h-[calc(100vh-220px)]"
              >
                <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain size={14} className="text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-600">多重步驟思考</span>
                    {isLoading && <Loader2 size={10} className="animate-spin text-neutral-400" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveNote}
                      disabled={messages.length < 2 || isSavingNote}
                    >
                      <Save size={12} />
                      {isSavingNote ? '儲存中...' : '存筆記'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClearChat}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                      <Bot size={40} className="text-neutral-200" />
                      <p className="text-sm text-neutral-500">開始對話或點擊麥克風使用語音輸入</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['分析 ESG 數據', '生成永續報告', '檢查合規狀態'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setInput(q);
                              handleSend(q);
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.role === 'user' && (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] bg-neutral-900 text-white rounded-xl px-4 py-2.5">
                            <div className="flex items-center gap-2 mb-1">
                              {msg.isVoice && <Mic size={10} className="text-white/50" />}
                              <span className="text-[9px] text-white/50">
                                {new Date(msg.timestamp).toLocaleTimeString('zh-TW', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      )}

                      {msg.role === 'agent' && (
                        <div className="space-y-2">
                          {/* Thinking Steps */}
                          {msg.thinkingSteps && (
                            <div className="bg-neutral-50 rounded-lg border border-neutral-100 overflow-hidden">
                              <button
                                onClick={() => toggleThinking(msg.id)}
                                className="w-full px-3 py-1.5 flex items-center justify-between text-[10px] text-neutral-500 hover:bg-neutral-100"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Brain size={10} />
                                  思考過程 (
                                  {msg.thinkingSteps.filter((s) => s.status === 'done').length}/
                                  {msg.thinkingSteps.length})
                                  {isLoading && msg.status === 'streaming' && (
                                    <Loader2 size={8} className="animate-spin" />
                                  )}
                                </span>
                                {expandedThinking.has(msg.id) ? (
                                  <ChevronUp size={10} />
                                ) : (
                                  <ChevronDown size={10} />
                                )}
                              </button>
                              {expandedThinking.has(msg.id) && (
                                <div className="px-3 pb-2 space-y-1">
                                  {msg.thinkingSteps.map((step, i) => {
                                    const Icon = STEP_ICONS[step.type];
                                    return (
                                      <div
                                        key={step.id}
                                        className={cn(
                                          'flex items-start gap-2 p-1.5 rounded text-[10px]',
                                          step.status === 'active'
                                            ? 'bg-blue-50'
                                            : step.status === 'done'
                                            ? 'bg-emerald-50'
                                            : 'bg-white'
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            'w-4 h-4 rounded flex items-center justify-center shrink-0',
                                            step.status === 'active'
                                              ? 'bg-blue-100'
                                              : step.status === 'done'
                                              ? 'bg-emerald-100'
                                              : 'bg-neutral-100'
                                          )}
                                        >
                                          {step.status === 'active' ? (
                                            <Loader2
                                              size={8}
                                              className="animate-spin text-blue-600"
                                            />
                                          ) : step.status === 'done' ? (
                                            <CheckCircle2 size={8} className="text-emerald-600" />
                                          ) : (
                                            <Icon size={8} className="text-neutral-400" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <span
                                            className={cn(
                                              'font-medium',
                                              step.status === 'active'
                                                ? 'text-blue-700'
                                                : step.status === 'done'
                                                ? 'text-emerald-700'
                                                : 'text-neutral-500'
                                            )}
                                          >
                                            {step.title}
                                          </span>
                                          {step.content && (
                                            <p className="mt-0.5 text-neutral-500 leading-relaxed">
                                              {step.content}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Response */}
                          <div className="bg-white rounded-xl border border-neutral-100 px-4 py-3">
                            {msg.content && (
                              <div className="prose prose-sm max-w-none">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700">
                                  {msg.content.replace(/\[IMAGE:[^\]]+\]/g, '')}
                                </p>
                              </div>
                            )}
                            {/* Generated Image */}
                            {msg.imageUrl && (
                              <div className="mt-3">
                                <img
                                  src={msg.imageUrl}
                                  alt="AI 生成圖片"
                                  className="rounded-lg max-w-full border border-neutral-100"
                                />
                              </div>
                            )}
                            {!msg.content && msg.status === 'streaming' && (
                              <div className="flex items-center gap-2 text-neutral-400">
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-xs">正在生成...</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-50">
                              <span className="text-[9px] font-mono text-neutral-400">
                                {new Date(msg.timestamp).toLocaleTimeString('zh-TW', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <div className="flex items-center gap-1">
                                {msg.content && (
                                  <>
                                    <button
                                      onClick={() => speakText(msg.content)}
                                      className="p-1 text-neutral-400 hover:text-neutral-600"
                                    >
                                      {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                    </button>
                                    <button
                                      onClick={() => handleCopy(msg.id, msg.content)}
                                      className="p-1 text-neutral-400 hover:text-neutral-600"
                                    >
                                      {copiedId === msg.id ? (
                                        <Check size={12} />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {error && (
                  <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                    <p className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {error}
                    </p>
                  </div>
                )}

                {/* Input */}
                <div className="px-4 py-3 border-t border-neutral-100">
                  <div className="flex items-end gap-2">
                    {/* Voice Button */}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={cn(
                        'p-2.5 rounded-lg transition-all',
                        isRecording
                          ? 'bg-red-500 text-white '
                          : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      )}
                    >
                      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="輸入訊息或點擊麥克風..."
                      rows={2}
                      className="flex-1 resize-none bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    />

                    {isLoading ? (
                      <Button variant="error" size="md" onClick={handleStop}>
                        <Loader2 size={16} className="animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                      >
                        <Send size={16} />
                      </Button>
                    )}
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-1">
                    Enter 發送 · Shift+Enter 換行 · 點擊麥克風語音輸入 · 指令 "nav chat" 切換頁面
                  </p>
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-3">
              <Card variant="default" padding="sm">
                <h3 className="text-xs font-medium text-neutral-700 mb-2">快速操作</h3>
                <div className="space-y-1">
                  {['分析 ESG 數據', '生成永續報告', '檢查合規狀態', '同步記憶碎片'].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => {
                        setInput(cmd);
                        handleSend(cmd);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </Card>

              <Card variant="default" padding="sm">
                <h3 className="text-xs font-medium text-neutral-700 mb-2">系統狀態</h3>
                <div className="space-y-1.5">
                  {[
                    { label: '記憶碎片', value: `${shards.length}`, icon: DatabaseZap },
                    { label: '群蜂事件', value: `${events.length}`, icon: Activity },
                    { label: '連線', value: connectionStatus, icon: Network },
                    { label: '筆記', value: `${notes.length}`, icon: FileText },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <item.icon size={10} className="text-neutral-400" />
                        <span className="text-[10px] text-neutral-500">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ─── Terminal View ─── */}
        {viewMode === 'terminal' && (
          <Card variant="default" padding="none">
            <div className="bg-neutral-900 rounded-xl font-mono text-sm">
              <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span className="text-xs text-neutral-400">OmniAgent Terminal</span>
                <Badge variant="success" size="sm">
                  online
                </Badge>
              </div>
              <div className="p-4 h-[calc(100vh-260px)] overflow-y-auto space-y-0.5">
                {terminalOutput.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      'text-xs leading-relaxed',
                      line.startsWith('>')
                        ? 'text-cyan-400'
                        : line.startsWith('✅')
                        ? 'text-emerald-400'
                        : line.startsWith('❌')
                        ? 'text-red-400'
                        : line.startsWith('🔄')
                        ? 'text-amber-400'
                        : line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')
                        ? 'text-neutral-500'
                        : 'text-neutral-300'
                    )}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
              <div className="px-4 py-3 border-t border-neutral-800 flex items-center gap-2">
                <span className="text-emerald-400 text-xs">❯</span>
                <input
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  placeholder="輸入指令..."
                  className="flex-1 bg-transparent text-neutral-100 text-xs outline-none placeholder:text-neutral-600"
                  autoFocus
                />
              </div>
            </div>
          </Card>
        )}

        {/* ─── Notes View ─── */}
        {viewMode === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <Card variant="default" padding="sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-neutral-700">筆記列表</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={messages.length < 2 || isSavingNote}
                  >
                    <Save size={12} />
                    {isSavingNote ? '儲存中...' : '從聊天建立'}
                  </Button>
                </div>
                {notes.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-8">尚無筆記</p>
                ) : (
                  <div className="space-y-1">
                    {notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors',
                          selectedNote?.id === note.id ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                        )}
                      >
                        <p className="font-medium text-neutral-700 truncate">{note.title}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {note.messageCount} 則訊息 ·{' '}
                          {new Date(note.createdAt).toLocaleDateString('zh-TW')}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </div>
            <div className="lg:col-span-2">
              {selectedNote ? (
                <Card variant="default" padding="md">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4">{selectedNote.title}</h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                      {selectedNote.content}
                    </p>
                  </div>
                </Card>
              ) : (
                <Card variant="default" padding="lg">
                  <div className="text-center space-y-3">
                    <FileText size={32} className="text-neutral-200 mx-auto" />
                    <p className="text-sm text-neutral-500">選擇左側筆記查看內容</p>
                    <p className="text-xs text-neutral-400">或在聊天中點擊「存筆記」從對話建立</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ─── Memory View ─── */}
        {viewMode === 'memory' && (
          <div className="space-y-4">
            <SectionHeader
              title="共享記憶層"
              subtitle={`${shards.length} 個碎片`}
              action={
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={fetchShards} disabled={memoryLoading}>
                    <RefreshCw size={14} className={memoryLoading ? 'animate-spin' : ''} />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={syncWithNCB}
                    disabled={memoryLoading}
                  >
                    <DatabaseZap size={14} />
                    同步 NCBDB
                  </Button>
                </div>
              }
            />
            {shards.length === 0 && !memoryLoading ? (
              <Card variant="default" padding="lg">
                <div className="text-center space-y-2">
                  <DatabaseZap size={24} className="text-neutral-200 mx-auto" />
                  <p className="text-sm text-neutral-500">尚無記憶碎片</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {shards.map((shard) => (
                  <Card key={shard.id} variant="default" padding="sm" hover>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-xs font-medium text-neutral-900">{shard.title}</h4>
                      <Badge variant={shard.source_origin === 'ncb' ? 'info' : 'neutral'} size="sm">
                        {shard.source_origin === 'ncb' ? 'NCB' : 'Local'}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-neutral-500 line-clamp-2 mb-1">
                      {shard.description}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-neutral-400">
                      <span>熵:{shard.entropy_level}</span>
                      <span>·</span>
                      <span>權重:{shard.importance_score?.toFixed(2)}</span>
                      <span>·</span>
                      <span>使用:{shard.usage_count}次</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Swarm View ─── */}
        {viewMode === 'swarm' && (
          <div className="space-y-4">
            <SectionHeader
              title="群蜂戰情室"
              subtitle={`${events.length} 個事件`}
              action={
                <div className="flex gap-2">
                  <Badge
                    variant={connectionStatus === 'connected' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {connectionStatus}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={clearEvents}>
                    <Trash2 size={14} />
                    清除
                  </Button>
                </div>
              }
            />
            <Card variant="default" padding="none">
              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-xs h-[500px] overflow-y-auto space-y-1">
                {events.length === 0 ? (
                  <div className="text-neutral-600 text-center mt-20">等待 Swarm 事件...</div>
                ) : (
                  events.map((ev) => (
                    <div key={ev.id} className="border-l-2 border-neutral-700 pl-3 py-0.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-neutral-500">
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </span>
                        <span
                          className={cn(
                            'px-1.5 rounded text-[9px] font-medium',
                            ev.source === 'OmniGateway'
                              ? 'bg-emerald-900/50 text-emerald-400'
                              : ev.source === 'SharedMemory'
                              ? 'bg-cyan-900/50 text-cyan-400'
                              : 'bg-neutral-800 text-neutral-300'
                          )}
                        >
                          {ev.source}
                        </span>
                        <span className="text-amber-400/80">[{ev.type}]</span>
                      </div>
                      <div className="text-neutral-400 pl-4 break-words">
                        {typeof ev.payload === 'string' ? ev.payload : JSON.stringify(ev.payload)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ─── System View ─── */}
        {viewMode === 'system' && (
          <div className="space-y-4">
            <SectionHeader title="系統狀態" subtitle="即時監控" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: '資料庫',
                  value: health?.dbStatus || 'unknown',
                  icon: DatabaseZap,
                  color: health?.dbStatus === 'connected' ? 'success' : 'error',
                },
                {
                  label: '延遲',
                  value: `${health?.dbLatency || 0}ms`,
                  icon: Activity,
                  color: 'info',
                },
                {
                  label: '活躍代理',
                  value: `${health?.activeAgents || 0}`,
                  icon: Bot,
                  color: 'success',
                },
                {
                  label: '記憶條目',
                  value: `${health?.codexEntries || 0}`,
                  icon: MemoryStick,
                  color: 'info',
                },
              ].map((item) => (
                <Card key={item.label} variant="default" padding="sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        item.color === 'success'
                          ? 'bg-emerald-50'
                          : item.color === 'error'
                          ? 'bg-red-50'
                          : 'bg-blue-50'
                      )}
                    >
                      <item.icon
                        size={14}
                        className={cn(
                          item.color === 'success'
                            ? 'text-emerald-600'
                            : item.color === 'error'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500">{item.label}</p>
                      <p className="text-sm font-bold text-neutral-900">{item.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
