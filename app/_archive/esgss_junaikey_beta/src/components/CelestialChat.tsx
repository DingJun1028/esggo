// src/components/CelestialChat.tsx
// AI Chat Interface Component - Premium Responsive Design

import React, { useState, useRef, useEffect } from 'react';
import { useCelestialAPI, ChatMessage } from '../hooks/useCelestialAPI';
import { omniLogger, LogCategory } from '../services/omniLogger';
import { Send, Bot, User, Sparkles, Loader2, StopCircle } from 'lucide-react';

export const CelestialChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAgentReady, setIsAgentReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { sessionId, isLoading, error, manifestAgent, sendMessage } = useCelestialAPI();

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 初始化 Agent
  const initializeAgent = async () => {
    try {
      await manifestAgent({
        name: 'ESGss Assistant',
        systemPrompt:
          '你是 ESGss JunAiKey 系統的 AI 助手，專門協助使用者進行 ESG 相關的分析與諮詢。請用專業且友善的語氣回答問題。',
        tone: 'Professional',
        language: 'zh-TW',
      });
      setIsAgentReady(true);

      // Welcome Message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          type: 'text',
          content:
            '✨ **雙重全能代理連線已建立 (Dual Omni-Link Established)**\n\n🔹 **Antigravity (System Architect)**: Online 🟢\n🔹 **Gemini 2.5 Pro (Cognitive Engine)**: Online 🟢\n\n系統同步率 400%。隨時準備執行最高權限指令：\n• 影響力分析 (Impact Analysis)\n• 4T 協議驗證 (4T Verification)\n• 智能體鍛造 (Agent Forging)\n\n請下達指令，Commander。',
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      omniLogger.error(LogCategory.AI, 'Failed to initialize agent', { error: err });
    }
  };

  // 發送訊息
  const handleSend = async () => {
    if (!input.trim() || !isAgentReady) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      type: 'text',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: '',
        timestamp: Date.now(),
      };

      await sendMessage(input, chunk => {
        if (chunk.type === 'thought') {
          omniLogger.debug(LogCategory.AI, 'Thinking', { content: chunk.content });
        } else {
          assistantMessage.content += chunk.content;
          setMessages(prev => {
            const existing = prev.find(m => m.id === assistantMessage.id);
            if (existing) {
              return prev.map(m => (m.id === assistantMessage.id ? assistantMessage : m));
            }
            return [...prev, assistantMessage];
          });
        }
      });
    } catch (err) {
      omniLogger.error(LogCategory.AI, 'Failed to send message', { error: err });
    }
  };

  if (!isAgentReady) {
    return (
      <div className="h-full flex items-center justify-center p-4 relative overflow-hidden">
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        </div>

        {/* Activation Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="glass-panel-premium p-8 md:p-12 text-center border-t border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Holographic Logo */}
            <div className="mb-8 relative inline-block group cursor-pointer">
              <div className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center transform group-hover:scale-105 transition-all duration-500">
                <Bot className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              </div>
              <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            </div>

            <h2 className="text-3xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-2 tracking-wide">
              CELESTIAL <span className="font-bold text-cyan-400">CONNECT</span>
            </h2>
            <p className="text-slate-400 text-sm mb-8 tracking-wider uppercase">
              全知邏輯節點 v7.0 (Omniscient Logic Node)
            </p>

            <button
              onClick={initializeAgent}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl text-cyan-100 font-medium tracking-wide shadow-[0_0_20px_rgba(8,145,178,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    <span className="animate-pulse">正在初始化神經連結...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                    初始化連結 (Initialize Connection)
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>

            {error && (
              <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg backdrop-blur-sm">
                <p className="text-rose-300 text-xs">⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-cyan-900/10 to-transparent" />
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Glass Header */}
      <div className="relative z-20 h-16 glass-panel-premium border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <h1 className="text-sm font-medium text-slate-200 tracking-wider">
            CELESTIAL <span className="text-slate-500">|</span>{' '}
            <span className="text-cyan-400">ESGss 智能助手</span>
          </h1>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">ID: {sessionId?.slice(0, 8)}...</div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 custom-scrollbar scroll-smooth"
        ref={scrollContainerRef}
      >
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] group relative`}>
              {/* Avatar */}
              <div
                className={`absolute -top-3 ${msg.role === 'user' ? '-right-2' : '-left-2'} p-1.5 rounded-lg border border-white/10 shadow-lg z-20 ${msg.role === 'user' ? 'bg-indigo-900/80' : 'bg-cyan-900/80 backdrop-blur-md'}`}
              >
                {msg.role === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-cyan-300" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`rounded-2xl p-5 shadow-xl border relative z-10 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600/90 to-purple-700/90 text-white border-white/10 rounded-tr-sm'
                    : 'bg-slate-900/60 backdrop-blur-xl text-slate-200 border-white/5 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-sm font-light">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Timestamp */}
                <div
                  className={`text-[10px] mt-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-60 transition-opacity ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {msg.role === 'assistant' && <Sparkles className="w-2 h-2 text-cyan-400" />}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs text-cyan-400/80">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-20 p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

          <div className="relative flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 p-2 shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Message Celestial Intelligence..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-slate-500 px-4 py-3 focus:outline-none text-sm font-light"
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-lg transition-all duration-300 ${
                !input.trim() || isLoading
                  ? 'bg-white/5 text-slate-600'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105'
              }`}
            >
              {isLoading ? (
                <StopCircle className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
