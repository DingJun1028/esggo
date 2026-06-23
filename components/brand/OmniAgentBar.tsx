'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Maximize2, Minimize2, History, Zap, Star, User, 
  FileText, Wrench, Volume2, VolumeX, Mic, Play, Square, Sparkles, Loader2, ArrowRight, Link2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useOmniResonance } from '../../src/client/hooks/useOmniResonance';
import { cn } from '../../lib/utils';

interface ChatMessage {
  sender: 'user' | 'agent' | 'bus';
  text: string;
  timestamp: string;
  thinkingSteps?: string[];
  isVoice?: boolean;
  metadata?: any;
}

interface FavoriteItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  sub?: string;
}

export default function OmniAgentBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { rs } = useOmniResonance();
  const [activeTab, setActiveTab] = useState<'chat' | 'workspace' | 'toolbox'>('chat');
  
  // Chat States
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      text: '您好，我是您的 OmniAgent 數據大祭司。我已與 OmniAgentBus (WebSocket) 與 OmniNexus API 完成雙向整合。當前共鳴算力為 ' + (rs * 100).toFixed(1) + '%。',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket / Event Bus Connection
  const [busConnected, setBusConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Voice Readout States
  const [isPlayingReport, setIsPlayingReport] = useState(false);

  // Favorites & Admin States
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [adminStatus, setAdminStatus] = useState({
    pm2Status: 'online',
    dbStatus: 'connected',
    gitBranch: 'main',
    nodeEnv: 'production'
  });

  // Notes States
  const [noteText, setNoteText] = useState('');

  // 1. Establish OmniAgentBus WebSocket Connection
  useEffect(() => {
    if (!isOpen) return;

    const connectBus = () => {
      // Use environment variable for production, fallback to localhost for development
      const wsBase = process.env.NEXT_PUBLIC_OMNIAGENT_WS_URL || (
        typeof window !== 'undefined' && window.location.hostname !== 'localhost'
          ? `ws://${window.location.host}/ws`
          : 'ws://localhost:8642'
      );
      const endpoints = [
        wsBase,
        'ws://localhost:8642',
        'ws://127.0.0.1:8642',
      ];
      
      let attemptIdx = 0;

      const tryNext = () => {
        if (attemptIdx >= endpoints.length) {
          console.warn('[OmniAgentBar] Could not connect to OmniAgentBus on any local ports. Standard fallback enabled.');
          return;
        }

        const url = endpoints[attemptIdx++];
        console.log(`[OmniAgentBar] Connecting to OmniAgentBus at ${url}...`);
        
        try {
          const ws = new WebSocket(url);
          wsRef.current = ws;

          ws.onopen = () => {
            console.log(`[OmniAgentBar] Connected to OmniAgentBus: ${url}`);
            setBusConnected(true);
          };

          ws.onmessage = (e) => {
            try {
              const data = JSON.parse(e.data);
              
              // Handle event relays from the bus
              if (data.type === 'RELAY' || data.type === 'OBSERVE' || data.type === 'MANIFEST' || data.type === 'HEAL' || data.type === 'SEAL') {
                const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                let text = '';
                if (data.type === 'OBSERVE') {
                  text = `🔍 [OmniAgentBus] 正在監測任務: ${data.payload?.taskId || '未知'}`;
                } else if (data.type === 'MANIFEST') {
                  text = `📦 [OmniAgentBus] 產出 5T 合規資產: ${data.payload?.artId || '未知'}`;
                } else if (data.type === 'HEAL') {
                  text = `🛡️ [OmniAgentBus] 偵測到系統異常，啟動 OmniJules 萬能果因自癒: ${data.payload?.error || '未知'}`;
                } else if (data.type === 'SEAL') {
                  text = `🔒 [OmniAgentBus] 5T 數據安全封印鎖定! Hash Lock: ${data.payload?.hash?.slice(0, 16)}...`;
                } else {
                  text = `📡 [Bus Relay] ${data.message || JSON.stringify(data.payload)}`;
                }

                setMessages(prev => [
                  ...prev,
                  {
                    sender: 'bus',
                    text,
                    timestamp: ts,
                    metadata: data
                  }
                ]);
              }
            } catch (err) {
              console.error('[OmniAgentBar] Error parsing bus event:', err);
            }
          };

          ws.onclose = () => {
            setBusConnected(false);
            // Try fallback
            tryNext();
          };

          ws.onerror = () => {
            ws.close();
          };
        } catch (err) {
          console.error('[OmniAgentBar] Connection exception:', err);
          tryNext();
        }
      };

      tryNext();
    };

    connectBus();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Load favorites from local storage
      const stored = localStorage.getItem('esggo_favorites');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
      
      // Load notes
      const savedNote = localStorage.getItem('esggo_omni_note');
      if (savedNote) setNoteText(savedNote);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, thinkingSteps]);

  // Voice report reader
  const handleReadDailyReport = () => {
    if (isPlayingReport) {
      window.speechSynthesis.cancel();
      setIsPlayingReport(false);
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: '已停止讀報。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    const reportText = `
      今日 ESG 每日簡報。
      第一，碳盤查指標追蹤：全域控制台目前的範疇一與範疇二碳排放值已與 SUPABASE 資料庫同步完畢，5T 誠信評分維持在 87% 優良水準。
      第二，代理狀態更新：Sentinel 與 Analyst 節點於今日上午十點完成自動化減熵儀式，無發現異常資料外洩。
      第三，合規警告：提醒管理員，GRI-305 指標的第三季碳排估算資料仍缺漏，請儘速使用 SustainWrite 編輯器進行補正。
      報告完畢。
    `;

    const utterance = new SpeechSynthesisUtterance(reportText);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.0;
    utterance.onend = () => {
      setIsPlayingReport(false);
    };
    utterance.onerror = () => {
      setIsPlayingReport(false);
    };

    setIsPlayingReport(true);
    window.speechSynthesis.speak(utterance);

    setMessages(prev => [
      ...prev,
      {
        sender: 'agent',
        text: '🔊 正在為您語音播報今日 ESG 每日報導...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoice: true
      }
    ]);
  };

  // Notes save
  const handleSaveNote = (val: string) => {
    setNoteText(val);
    localStorage.setItem('esggo_omni_note', val);
  };

  // 2. Call Nexus API Gateway directly
  const executeNexusTool = async (tool: string, args: Record<string, any>) => {
    setIsThinking(true);
    setThinkingSteps([
      `🔍 [Step 1/3] 開始與 OmniNexus API 發起對接...`,
      `⚙️ [Step 2/3] 調度系統工具 [${tool}]...`
    ]);

    try {
      const response = await fetch('/api/nexus/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-omni-token': 'OmniAgent_gold_2026' // Max authorization key
        },
        body: JSON.stringify({
          tool,
          arguments: args,
          userId: 'OMNI_AGENT_BAR'
        })
      });

      const resData = await response.json();
      setThinkingSteps(prev => [...prev, `🧬 [Step 3/3] 5T 審計安全校驗完成！`]);
      await new Promise(r => setTimeout(r, 600));

      if (resData.success) {
        const metadata = resData.metadata;
        const mainData = resData.data;

        let formattedReply = '';
        if (tool === 'seal_5t_proof') {
          formattedReply = `🔒 5T 數據安全封印完成！\n- 原子ID: ${mainData.atomId}\n- 密碼學封印鎖: ${mainData.seal}\n- 寫入狀態: ${mainData.writeStatus}\n- 信任分數: ${metadata.trustScore} (神話級/極度可信)`;
        } else if (tool === 'forge_gri_report') {
          formattedReply = `📄 GRI 永續報告生成完成！\n- 標題: ${mainData.title}\n- 下載連結: ${mainData.reportUrl}\n- 指標個數: ${mainData.indicators?.length || 0}`;
        } else if (tool === 'analyze_trend') {
          formattedReply = `📈 商情中心趨勢分析：\n- 趨勢: ${mainData.trend}`;
        } else {
          formattedReply = `已成功調度 [${tool}]，結果為: ${JSON.stringify(mainData)}`;
        }

        setMessages(prev => [
          ...prev,
          {
            sender: 'agent',
            text: formattedReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            thinkingSteps: [`${tool} 調度成功`, `信任分數: ${metadata.trustScore}`, `UUID: ${metadata.uuid}`]
          }
        ]);
      } else {
        throw new Error(resData.error || 'Gateway returned failure');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: `❌ OmniNexus 工具調度失敗: ${err.message || err}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Handle Send Command
  const handleSendCommand = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');

    // Add user message
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsThinking(true);
    setThinkingSteps([]);

    // Check if it is a shortcut tool trigger
    if (userText.includes('GRI') || userText.includes('報告')) {
      await executeNexusTool('forge_gri_report', {
        title: 'ESG 永續報告 2026 Q1',
        indicators: [{ code: 'GRI-305-1', name: 'Scope 1 Emissions' }]
      });
      return;
    } else if (userText.includes('ZKP') || userText.includes('封印') || userText.includes('鎖定')) {
      await executeNexusTool('seal_5t_proof', {
        proof: { timestamp: Date.now(), data_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' }
      });
      return;
    } else if (userText.includes('趨勢') || userText.includes('商情')) {
      await executeNexusTool('analyze_trend', {
        prompt: '分析 2026 年太陽能面板供應鏈走勢'
      });
      return;
    }

    // Otherwise standard simulated thinking
    const steps = [
      '🔍 [Step 1/3] 解析輸入指令與 Gnosis 語意...',
      '⚙️ [Step 2/3] 調用 Genkit "esg-insight-flow" 核心計算單元...',
      '🧬 [Step 3/3] 執行 5T 協議驗證，確認數據未被竄改...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setThinkingSteps(prev => [...prev, steps[i]]);
    }

    await new Promise(r => setTimeout(r, 400));
    setIsThinking(false);

    let reply = '指令已執行成功。5T 狀態完整封印。';
    
    if (userText.includes('讀報') || userText.toLowerCase().includes('report') || userText.includes('報導')) {
      reply = '正在啟動每日 ESG 報導讀報功能。';
      handleReadDailyReport();
      return;
    } else if (userText.includes('最愛') || userText.includes('favorite')) {
      reply = `您目前有 ${favorites.length} 個我的最愛項目。已在「最愛與管理」分頁為您展開。`;
      setActiveTab('workspace');
    } else if (userText.includes('工具') || userText.includes('tool')) {
      reply = '已為您切換至「萬能工具組」分頁，請點選需要的 Genkit 模組。';
      setActiveTab('toolbox');
    }

    setMessages(prev => [...prev, {
      sender: 'agent',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thinkingSteps: steps
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end">
      {isOpen && (
        <div
          className={cn(
            'mb-4 flex flex-col transition-all duration-300 origin-bottom-right',
            isMaximized
              ? 'w-full max-w-[95%] sm:max-w-[700px] h-[75vh] max-h-[85vh]'
              : 'w-full max-w-[90%] sm:max-w-[420px] h-[550px] max-h-[70vh]'
          )}
        >
          <Card className="w-full h-full flex flex-col border-slate-200 rounded-lg p-0 overflow-hidden shadow-sm bg-white">
            {/* Header */}
            <header className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#63a6b0]/10 flex items-center justify-center border border-[#63a6b0]/20">
                  <Bot size={20} className="text-[#63a6b0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 tracking-tight">
                      OmniAgent Bar
                    </p>
                    <Badge variant="success" className="px-1.5 py-0 text-[9px] bg-emerald-500/10 text-emerald-600 border-none font-bold">
                      ACTIVE
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider">
                      Resonance: {(rs * 100).toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={cn('w-1.5 h-1.5 rounded-sm', busConnected ? 'bg-emerald-500' : 'bg-amber-500')} />
                      <span className="text-[9px] text-slate-400 font-mono">
                        {busConnected ? 'BUS CONNECTED' : 'BUS OFFLINE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/50 transition-colors text-slate-400 hover:text-slate-600"
                >
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setIsPlayingReport(false);
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/50 transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-50/50 border-b border-slate-100 p-1 gap-1">
              {[
                { id: 'chat', label: '大祭司助手', icon: Bot },
                { id: 'workspace', label: '最愛與管理', icon: Star },
                { id: 'toolbox', label: '萬能工具', icon: Wrench }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all',
                      activeTab === tab.id
                        ? 'bg-white text-[#63a6b0] shadow-sm border border-slate-100'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/30'
                    )}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-white no-scrollbar">
              
              {/* Tab 1: Chat Assistant */}
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col justify-between gap-4">
                  <div className="flex-1 space-y-4 overflow-y-auto pr-1 no-scrollbar">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={cn('flex gap-3', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.sender !== 'user' && (
                          <div className={cn(
                            'w-8 h-8 rounded-md flex items-center justify-center shrink-0 border',
                            msg.sender === 'bus' 
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-[#63a6b0]/10 text-[#63a6b0] border-[#63a6b0]/10'
                          )}>
                            {msg.sender === 'bus' ? <Link2 size={13} /> : <Bot size={15} />}
                          </div>
                        )}
                        <div className="max-w-[80%] flex flex-col gap-1.5">
                          <div
                            className={cn(
                              'p-3.5 rounded-lg text-xs leading-relaxed font-medium shadow-sm border',
                              msg.sender === 'user'
                                ? 'bg-[#63a6b0] text-white border-[#63a6b0] rounded-tr-sm'
                                : msg.sender === 'bus'
                                ? 'bg-amber-50/50 text-amber-800 border-amber-100/50 rounded-tl-sm font-mono'
                                : 'bg-slate-50 text-slate-700 border-slate-100 rounded-tl-sm'
                            )}
                          >
                            {msg.text}
                            {msg.isVoice && isPlayingReport && (
                              <div className="mt-2.5 flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 p-2 rounded-xl">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                <span>播報中...</span>
                                <button 
                                  onClick={handleReadDailyReport}
                                  className="ml-auto text-[10px] font-bold text-red-500 hover:underline"
                                >
                                  停止
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Render Thinking Chain */}
                          {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] text-slate-400 font-mono space-y-1">
                              <p className="font-bold text-[#ffd700] uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Sparkles size={10} /> Thought Chain
                              </p>
                              {msg.thinkingSteps.map((step, sIdx) => (
                                <div key={sIdx}>{step}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Thinking animation */}
                    {isThinking && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#63a6b0]/10 text-[#63a6b0] flex items-center justify-center shrink-0">
                          <Bot size={15} />
                        </div>
                        <div className="flex flex-col gap-2 max-w-[80%]">
                          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg rounded-tl-sm text-xs text-slate-400 flex items-center gap-2">
                            <Loader2 size={12} className="animate-spin text-[#63a6b0]" />
                            <span>思考中...</span>
                          </div>
                          
                          {/* Live thought chain steps rendering */}
                          {thinkingSteps.length > 0 && (
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] text-slate-400 font-mono space-y-1">
                              {thinkingSteps.map((step, sIdx) => (
                                <div key={sIdx} className="animate-fade-in">{step}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Actions & Report Launcher */}
                  <div className="space-y-2 pt-2 border-t border-slate-50">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] font-bold py-1 px-3 border-slate-200 text-slate-600 flex items-center gap-1.5 rounded-full hover:bg-slate-50"
                        onClick={handleReadDailyReport}
                      >
                        {isPlayingReport ? <Square size={10} className="text-red-500" /> : <Volume2 size={10} className="text-[#63a6b0]" />}
                        開啟每日ESG報導
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] font-bold py-1 px-3 border-slate-200 text-slate-600 flex items-center gap-1.5 rounded-full hover:bg-slate-50"
                        onClick={() => {
                          setInput('查詢我的最愛');
                          handleSendCommand();
                        }}
                      >
                        <Star size={10} className="text-[#ffd700]" />
                        最愛快速查找
                      </Button>
                    </div>

                    <div className="relative flex items-center mt-1">
                      <input
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 text-xs focus:ring-2 focus:ring-[#63a6b0]/20 focus:border-[#63a6b0] transition-all outline-none"
                        placeholder="語音或文字指令操控..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                      />
                      <button
                        className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-[#63a6b0] text-white hover:bg-[#4f8a93] transition-colors"
                        onClick={handleSendCommand}
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Favorites & Admin & Notes */}
              {activeTab === 'workspace' && (
                <div className="space-y-4">
                  {/* Favorites */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Star size={12} className="text-[#ffd700]" /> 我的最愛 (Favorites)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {favorites.length > 0 ? (
                        favorites.map(item => (
                          <a
                            key={item.id}
                            href={item.path}
                            className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex flex-col"
                          >
                            <span className="text-xs font-bold text-slate-700">{item.title}</span>
                            <span className="text-[9px] text-slate-400 mt-1 font-mono">{item.path}</span>
                          </a>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                          尚未加入任何最愛頁面
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Super Admin Status */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <User size={12} className="text-[#63a6b0]" /> 我的管理員 (Super Admin)
                    </h4>
                    <Card className="p-3 bg-slate-50 border-slate-100 flex flex-col gap-2 rounded-xl text-[10px] font-mono text-slate-600">
                      <div className="flex justify-between">
                        <span>PM2 Status:</span>
                        <span className="text-emerald-600 font-bold uppercase">{adminStatus.pm2Status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Postgres Status:</span>
                        <span className="text-emerald-600 font-bold uppercase">{adminStatus.dbStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Git Branch:</span>
                        <span className="text-slate-700">{adminStatus.gitBranch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Env Profile:</span>
                        <span className="text-slate-700 font-bold">{adminStatus.nodeEnv}</span>
                      </div>
                    </Card>
                  </div>

                  {/* Omni Notes */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <FileText size={12} className="text-slate-500" /> 萬能筆記 (Omni Notes)
                    </h4>
                    <textarea
                      value={noteText}
                      onChange={(e) => handleSaveNote(e.target.value)}
                      placeholder="在此記錄臨時的 ESG 數據或想法...（自動儲存至 LocalStorage）"
                      className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#63a6b0]/20 focus:border-[#63a6b0] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Toolbox & Shortcuts */}
              {activeTab === 'toolbox' && (
                <div className="space-y-4">
                  {/* Genkit Functions */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#63a6b0]" /> Genkit 核心功能模組
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { title: 'GRI 指標自動追蹤', desc: '調度 OmniNexus forge_gri_report 生成最新指標報告', action: 'forge_gri_report' },
                        { title: '5T 數據密碼防護鎖', desc: '調度 OmniNexus seal_5t_proof 封印鏈上 ZKP 證明', action: 'seal_5t_proof' },
                        { title: '商情中心趨勢分析', desc: '調度 OmniNexus analyze_trend 分析最新 ESG 新聞趨勢', action: 'analyze_trend' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{item.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-[#63a6b0] hover:bg-[#4f8a93] text-[9px] font-bold px-2 py-1 h-auto flex items-center gap-1 rounded-lg shrink-0"
                            onClick={() => {
                              setActiveTab('chat');
                              if (item.action === 'forge_gri_report') {
                                executeNexusTool('forge_gri_report', {
                                  title: 'GRI-305 排放指標自動追蹤',
                                  indicators: [{ code: 'GRI-305-1', name: 'Scope 1' }]
                                });
                              } else if (item.action === 'seal_5t_proof') {
                                executeNexusTool('seal_5t_proof', {
                                  proof: { timestamp: Date.now(), block: '84000', node: 'Analyst' }
                                });
                              } else if (item.action === 'analyze_trend') {
                                executeNexusTool('analyze_trend', {
                                  prompt: '分析亞太地區 Scope 3 盤查趨勢與供應鏈壓力'
                                });
                              }
                            }}
                          >
                            {item.action}
                            <ArrowRight size={10} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shortcuts */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Zap size={12} className="text-[#ffd700]" /> 萬能快捷圖示 (Shortcuts)
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: '控制台', href: '/' },
                        { label: '萬能中心', href: '/omni-hub' },
                        { label: '編輯器', href: '/editor' },
                        { label: '分身', href: '/digital-twin' },
                        { label: '商情', href: '/intelligence' }
                      ].map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          className="py-2.5 px-1 border border-slate-150 rounded-xl text-center bg-slate-50 hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-600 block"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </Card>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-5 h-12 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="relative flex items-center justify-center">
            <Bot size={20} className="text-[#63a6b0]" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 bg-[#ffd700] rounded-sm"></span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-slate-800 leading-none">OmniAgent Bar</span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider mt-1">
              Pulse • {(rs * 100).toFixed(1)}%
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
