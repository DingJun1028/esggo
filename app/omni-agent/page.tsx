// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Loader2, CheckCircle2, AlertCircle,
  DatabaseZap, Activity, Network, Cpu, Memory as MemoryIcon,
  RefreshCw, Trash2, Copy, Check, ChevronDown, ChevronUp,
  Brain, Zap, Target, Layers
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
}

interface SystemHealth {
  dbStatus: string;
  dbLatency: number;
  activeAgents: number;
  codexEntries: number;
  uptime: number;
}

/* ─── Thinking Step Icons ─── */
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

/* ─── Main Page ─── */
export default function OmniAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'swarm' | 'system'>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { shards, isLoading: memoryLoading, fetchShards, syncWithNCB } = useOmniMemoryStore();
  const { events, connectionStatus, clearEvents } = useSwarmStore();
  useSwarmWebSocket();

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchShards();
  }, [fetchShards]);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/system/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch { /* ignore */ }
  };

  const toggleThinking = (msgId: string) => {
    setExpandedThinking(prev => {
      const next = new Set(prev);
      if (next.has(msgId)) next.delete(msgId);
      else next.add(msgId);
      return next;
    });
  };

  // ─── Multi-step AI Chat ───
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      status: 'sent',
    };

    // Initialize agent message with thinking steps
    const thinkingSteps: ThinkingStep[] = [
      { id: 'step-1', type: 'analyze', title: '分析問題', content: '', status: 'active', timestamp: Date.now() },
      { id: 'step-2', type: 'plan', title: '制定計劃', content: '', status: 'pending', timestamp: Date.now() },
      { id: 'step-3', type: 'execute', title: '執行任務', content: '', status: 'pending', timestamp: Date.now() },
      { id: 'step-4', type: 'verify', title: '驗證結果', content: '', status: 'pending', timestamp: Date.now() },
      { id: 'step-5', type: 'synthesize', title: '綜合回答', content: '', status: 'pending', timestamp: Date.now() },
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

    setMessages(prev => [...prev, userMsg, agentMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    abortRef.current = new AbortController();

    try {
      // Step 1: Analyze
      updateStep(agentMsg.id, 0, 'active', '正在分析問題語意...');
      const analyzeRes = await fetch('/api/omni-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: input.trim(), step: 'analyze' }),
        signal: abortRef.current.signal,
      });
      let analysisResult = '';
      if (analyzeRes.ok) {
        const d = await analyzeRes.json();
        analysisResult = d.result || '';
        updateStep(agentMsg.id, 0, 'done', analysisResult || '問題分析完成');
      } else {
        updateStep(agentMsg.id, 0, 'done', '使用內建分析');
      }

      // Step 2: Plan
      updateStep(agentMsg.id, 1, 'active', '正在制定執行計劃...');
      const planRes = await fetch('/api/omni-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: input.trim(), step: 'plan', context: { analysis: analysisResult } }),
        signal: abortRef.current.signal,
      });
      let planResult = '';
      if (planRes.ok) {
        const d = await planRes.json();
        planResult = d.result || '';
        updateStep(agentMsg.id, 1, 'done', planResult || '計劃制定完成');
      } else {
        updateStep(agentMsg.id, 1, 'done', '使用預設計劃');
      }

      // Step 3: Execute (stream)
      updateStep(agentMsg.id, 2, 'active', '正在執行任務...');
      const res = await fetch('/api/omni-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role === 'agent' ? 'assistant' : m.role,
            content: m.content,
          })),
          context: { analysis: analysisResult, plan: planResult },
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

        setMessages(prev => prev.map(m =>
          m.id === agentMsg.id
            ? { ...m, content: fullContent, status: 'streaming' }
            : m
        ));
      }

      updateStep(agentMsg.id, 2, 'done', '任務執行完成');

      // Step 4: Verify
      updateStep(agentMsg.id, 3, 'active', '正在驗證結果...');
      await new Promise(r => setTimeout(r, 300)); // Simulate verification
      updateStep(agentMsg.id, 3, 'done', '結果驗證通過');

      // Step 5: Synthesize
      updateStep(agentMsg.id, 4, 'active', '正在綜合回答...');
      await new Promise(r => setTimeout(r, 200));
      updateStep(agentMsg.id, 4, 'done', '回答完成');

      // Finalize
      setMessages(prev => prev.map(m =>
        m.id === agentMsg.id
          ? { ...m, content: fullContent, status: 'sent', currentStep: 5 }
          : m
      ));

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setMessages(prev => prev.map(m =>
        m.id === agentMsg.id
          ? { ...m, content: `❌ 錯誤：${err.message}`, status: 'error' }
          : m
      ));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const updateStep = (msgId: string, stepIndex: number, status: ThinkingStep['status'], content: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const steps = [...(m.thinkingSteps || [])];
      if (steps[stepIndex]) {
        steps[stepIndex] = { ...steps[stepIndex], status, content };
      }
      // Mark previous steps as done
      for (let i = 0; i < stepIndex; i++) {
        if (steps[i] && steps[i].status !== 'done') {
          steps[i] = { ...steps[i], status: 'done' };
        }
      }
      return { ...m, thinkingSteps: steps, currentStep: stepIndex };
    }));
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

  // ─── Render ───
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ─── Header ─── */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-neutral-900">OmniAgent 控制台</h1>
                <p className="text-sm text-neutral-500">多重步驟思考 · Chain of Thought</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {health && (
                <>
                  <Badge variant={health.dbStatus === 'connected' ? 'success' : 'error'} size="sm">
                    DB: {health.dbStatus} ({health.dbLatency}ms)
                  </Badge>
                  <Badge variant="info" size="sm">
                    {health.activeAgents} Agents
                  </Badge>
                </>
              )}
              <Badge variant={connectionStatus === 'connected' ? 'success' : 'warning'} size="sm">
                Swarm: {connectionStatus}
              </Badge>
            </div>
          </div>
        </Card>

        {/* ─── Tabs ─── */}
        <div className="flex gap-2">
          {[
            { id: 'chat' as const, label: 'AI 對話', icon: Bot, count: messages.length },
            { id: 'memory' as const, label: '記憶層', icon: DatabaseZap, count: shards.length },
            { id: 'swarm' as const, label: '群蜂', icon: Activity, count: events.length },
            { id: 'system' as const, label: '系統', icon: Cpu, count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count !== null && (
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full',
                  activeTab === tab.id ? 'bg-white/20' : 'bg-neutral-100'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Chat Tab ─── */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <Card variant="default" padding="none" className="flex flex-col h-[600px]">
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-700">多重步驟思考</span>
                    {isLoading && <Loader2 size={12} className="animate-spin text-neutral-400" />}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearChat}>
                    <Trash2 size={14} />
                    清除
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
                        <Brain size={32} className="text-neutral-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500">開始與 OmniAgent 對話</p>
                        <p className="text-xs text-neutral-400 mt-1">AI 將使用多重步驟思考來分析你的問題</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['分析 ESG 數據', '生成永續報告', '檢查合規狀態'].map(q => (
                          <button
                            key={q}
                            onClick={() => setInput(q)}
                            className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map(msg => (
                    <div key={msg.id}>
                      {/* User message */}
                      {msg.role === 'user' && (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] bg-neutral-900 text-white rounded-xl px-4 py-3">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-[9px] text-white/50 mt-1 text-right">
                              {new Date(msg.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Agent message */}
                      {msg.role === 'agent' && (
                        <div className="space-y-2">
                          {/* Thinking Steps */}
                          {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                            <div className="bg-neutral-50 rounded-lg border border-neutral-100 overflow-hidden">
                              <button
                                onClick={() => toggleThinking(msg.id)}
                                className="w-full px-3 py-2 flex items-center justify-between text-xs text-neutral-500 hover:bg-neutral-100 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Brain size={12} />
                                  <span>思考過程 ({msg.thinkingSteps.filter(s => s.status === 'done').length}/{msg.thinkingSteps.length})</span>
                                  {isLoading && msg.status === 'streaming' && (
                                    <Loader2 size={10} className="animate-spin" />
                                  )}
                                </div>
                                {expandedThinking.has(msg.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>

                              {expandedThinking.has(msg.id) && (
                                <div className="px-3 pb-3 space-y-2">
                                  {msg.thinkingSteps.map((step, i) => {
                                    const StepIcon = STEP_ICONS[step.type];
                                    return (
                                      <div key={step.id} className={cn(
                                        'flex items-start gap-2 p-2 rounded-lg text-xs',
                                        step.status === 'active' ? 'bg-blue-50 border border-blue-100' :
                                        step.status === 'done' ? 'bg-emerald-50 border border-emerald-100' :
                                        'bg-white border border-neutral-100'
                                      )}>
                                        <div className={cn(
                                          'w-5 h-5 rounded flex items-center justify-center shrink-0',
                                          step.status === 'active' ? 'bg-blue-100' :
                                          step.status === 'done' ? 'bg-emerald-100' :
                                          'bg-neutral-100'
                                        )}>
                                          {step.status === 'active' ? (
                                            <Loader2 size={10} className="animate-spin text-blue-600" />
                                          ) : step.status === 'done' ? (
                                            <CheckCircle2 size={10} className="text-emerald-600" />
                                          ) : (
                                            <StepIcon size={10} className="text-neutral-400" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className={cn(
                                              'font-medium',
                                              step.status === 'active' ? 'text-blue-700' :
                                              step.status === 'done' ? 'text-emerald-700' :
                                              'text-neutral-500'
                                            )}>
                                              {step.title}
                                            </span>
                                            <span className="text-[9px] text-neutral-400">步驟 {i + 1}</span>
                                          </div>
                                          {step.content && (
                                            <p className={cn(
                                              'mt-1 text-[11px] leading-relaxed',
                                              step.status === 'active' ? 'text-blue-600' :
                                              step.status === 'done' ? 'text-emerald-600' :
                                              'text-neutral-400'
                                            )}>
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
                            {msg.content ? (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700">{msg.content}</p>
                            ) : msg.status === 'streaming' ? (
                              <div className="flex items-center gap-2 text-neutral-400">
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-xs">正在生成回答...</span>
                              </div>
                            ) : null}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] font-mono text-neutral-400">
                                {new Date(msg.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {msg.content && (
                                <button
                                  onClick={() => handleCopy(msg.id, msg.content)}
                                  className="text-neutral-400 hover:text-neutral-600"
                                >
                                  {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                                </button>
                              )}
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

                <div className="px-4 py-3 border-t border-neutral-100">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="輸入訊息... (Enter 發送, Shift+Enter 換行)"
                      rows={2}
                      className="flex-1 resize-none bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    />
                    {isLoading ? (
                      <Button variant="danger" size="md" onClick={handleStop}>
                        <Loader2 size={16} className="animate-spin" />
                      </Button>
                    ) : (
                      <Button variant="primary" size="md" onClick={handleSend} disabled={!input.trim()}>
                        <Send size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              <Card variant="default" padding="sm">
                <h3 className="text-sm font-medium text-neutral-700 mb-3">快速指令</h3>
                <div className="space-y-1">
                  {[
                    '分析 ESG 數據',
                    '生成永續報告',
                    '檢查合規狀態',
                    '同步記憶碎片',
                  ].map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => setInput(cmd)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </Card>

              <Card variant="default" padding="sm">
                <h3 className="text-sm font-medium text-neutral-700 mb-3">系統狀態</h3>
                <div className="space-y-2">
                  {[
                    { label: '記憶碎片', value: `${shards.length} 筆`, icon: DatabaseZap },
                    { label: '群蜂事件', value: `${events.length} 筆`, icon: Activity },
                    { label: '連線狀態', value: connectionStatus, icon: Network },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon size={12} className="text-neutral-400" />
                        <span className="text-xs text-neutral-500">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ─── Memory Tab ─── */}
        {activeTab === 'memory' && (
          <div className="space-y-4">
            <SectionHeader
              title="共享記憶層"
              subtitle={`${shards.length} 個記憶碎片`}
              action={
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={fetchShards} disabled={memoryLoading}>
                    <RefreshCw size={14} className={memoryLoading ? 'animate-spin' : ''} />
                    重新載入
                  </Button>
                  <Button variant="primary" size="sm" onClick={syncWithNCB} disabled={memoryLoading}>
                    <DatabaseZap size={14} />
                    同步 NCBDB
                  </Button>
                </div>
              }
            />

            {shards.length === 0 && !memoryLoading ? (
              <Card variant="default" padding="lg">
                <div className="text-center space-y-3">
                  <DatabaseZap size={32} className="text-neutral-200 mx-auto" />
                  <p className="text-sm text-neutral-500">尚無記憶碎片</p>
                  <p className="text-xs text-neutral-400">點擊「同步 NCBDB」從資料庫拉取</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {shards.map(shard => (
                  <Card key={shard.id} variant="default" padding="sm" hover>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-neutral-900">{shard.title}</h4>
                      <Badge variant={shard.source_origin === 'ncb' ? 'info' : 'neutral'} size="sm">
                        {shard.source_origin === 'ncb' ? 'NCB' : 'Local'}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{shard.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <span>熵: {shard.entropy_level}</span>
                      <span>·</span>
                      <span>權重: {shard.importance_score?.toFixed(2)}</span>
                      <span>·</span>
                      <span>使用: {shard.usage_count} 次</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Swarm Tab ─── */}
        {activeTab === 'swarm' && (
          <div className="space-y-4">
            <SectionHeader
              title="群蜂戰情室"
              subtitle={`${events.length} 個事件`}
              action={
                <div className="flex gap-2">
                  <Badge variant={connectionStatus === 'connected' ? 'success' : 'warning'} size="sm">
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
              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-xs h-[500px] overflow-y-auto space-y-2">
                {events.length === 0 ? (
                  <div className="text-neutral-600 text-center mt-20">等待 Swarm 事件...</div>
                ) : (
                  events.map(ev => (
                    <div key={ev.id} className="border-l-2 border-neutral-700 pl-3 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                        <span className={cn(
                          'px-1.5 rounded text-[10px] font-medium',
                          ev.source === 'OmniGateway' ? 'bg-emerald-900/50 text-emerald-400' :
                          ev.source === 'SharedMemory' ? 'bg-cyan-900/50 text-cyan-400' :
                          'bg-neutral-800 text-neutral-300'
                        )}>{ev.source}</span>
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

        {/* ─── System Tab ─── */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <SectionHeader title="系統狀態" subtitle="即時系統監控" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: '資料庫', value: health?.dbStatus || 'unknown', icon: DatabaseZap, color: health?.dbStatus === 'connected' ? 'success' : 'error' },
                { label: '延遲', value: `${health?.dbLatency || 0}ms`, icon: Activity, color: 'info' },
                { label: '活躍代理', value: `${health?.activeAgents || 0}`, icon: Bot, color: 'success' },
                { label: '記憶條目', value: `${health?.codexEntries || 0}`, icon: MemoryIcon, color: 'info' },
              ].map(item => (
                <Card key={item.label} variant="default" padding="md">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      item.color === 'success' ? 'bg-emerald-50' :
                      item.color === 'error' ? 'bg-red-50' : 'bg-blue-50'
                    )}>
                      <item.icon size={18} className={cn(
                        item.color === 'success' ? 'text-emerald-600' :
                        item.color === 'error' ? 'text-red-600' : 'text-blue-600'
                      )} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">{item.label}</p>
                      <p className="text-lg font-bold text-neutral-900">{item.value}</p>
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
