"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/lib/context/app-context";
import { SPIRITS, SpiritEngine, SpiritType } from "@/lib/core/spirits";
import {
  Sparkles,
  Send,
  MessageSquare,
  Globe,
  Database,
  Activity,
  Plus,
  Search,
  Target,
  User,
  Zap,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { chatWithESGAssistant } from "@/app/actions";

export function AIChatView() {
  const {
    globalEsgData,
    companyProfile,
    todoCount,
    setActiveView,
    selectedSpirit,
    setSelectedSpirit,
    language
  } = useAppContext();

  const [mounted, setMounted] = useState(false);
  const currentSpirit = SPIRITS[selectedSpirit];

  const [messages, setMessages] = useState([
    {
      role: "ai",
      spirit: selectedSpirit,
      content: language === "zh"
        ? `您好！我是${currentSpirit.name.zh}。我已載入「${companyProfile?.name}」的上下文資訊。您可以針對${selectedSpirit === 'compliance' ? '數據合規與審計' : selectedSpirit === 'harmony' ? '社會責任與共榮' : '創新轉型與氣候風險'}向我提問。`
        : `Hello! I am the ${currentSpirit.name.en}. I have loaded the context for "${companyProfile?.name}". You can ask me about ${selectedSpirit === 'compliance' ? 'compliance and auditing' : selectedSpirit === 'harmony' ? 'social responsibility' : 'innovation and climate risks'}.`,
      type: "regular",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSpiritSelector, setShowSpiritSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, {
      role: "user",
      spirit: null,
      content: userMsg,
      type: "regular",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } as any]);

    setIsTyping(true);

    try {
      // Prepare history for AI
      const history = messages.map(m => ({
        role: (m.role === 'ai' ? 'ai' : m.role === 'user' ? 'user' : 'system') as any,
        content: m.content
      }));

      const globalContext = `
Company Name: ${companyProfile?.name}
Industry: ${companyProfile?.industry}
Key Goals: ${companyProfile?.goals?.join(", ") || "None"}
Trust Score: ${globalEsgData?.trustScore}%
`.trim();

      const aiResponse = await chatWithESGAssistant(
        [...history, { role: 'user', content: userMsg }],
        selectedSpirit,
        language,
        false, // auditMode default false here
        globalContext
      );

      setMessages(prev => [...prev, {
        role: "ai",
        spirit: selectedSpirit,
        content: aiResponse.text,
        type: aiResponse.text.length > 100 ? "insight" : "regular", // Heuristic for insight
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } as any]);
    } catch (error) {
      console.error("AI Chat failed:", error);
      setMessages(prev => [...prev, {
        role: "ai",
        spirit: selectedSpirit,
        content: language === "zh" ? "抱歉，我的思考核心暫時無法連線，請稍後再試。" : "Sorry, my thinking core is temporarily offline. Please try again later.",
        type: "regular",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } as any]);
    }

    setIsTyping(false);
  }, [input, isTyping, selectedSpirit, companyProfile, globalEsgData, language, messages]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Header with Spirit Selector */}
      <header className="flex items-center justify-between mb-8 px-4 relative z-50">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95",
              selectedSpirit === 'compliance' ? "bg-blue-900 shadow-blue-900/20" :
                selectedSpirit === 'harmony' ? "bg-emerald-900 shadow-emerald-900/20" :
                  "bg-purple-900 shadow-purple-900/20"
            )}
            onClick={() => setShowSpiritSelector(!showSpiritSelector)}
          >
            <span className="text-2xl">{currentSpirit.avatar}</span>
          </div>
          <div className="cursor-pointer group" onClick={() => setShowSpiritSelector(!showSpiritSelector)}>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {currentSpirit.name[language]}
                <ChevronDown className={cn("w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-all", showSpiritSelector && "rotate-180")} />
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {currentSpirit.title[language]} • Deep-Context Engine
            </p>
          </div>
        </div>

        {/* Spirit Dropdown Selector */}
        <AnimatePresence>
          {showSpiritSelector && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-16 left-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/50 p-4 space-y-2"
            >
              {(Object.keys(SPIRITS) as SpiritType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedSpirit(type);
                    setShowSpiritSelector(false);
                    // Add switch message
                    setMessages(prev => [...prev, {
                      role: "ai",
                      spirit: type,
                      content: language === "zh"
                        ? `我是${SPIRITS[type].name.zh}，現在由我來接手指引。`
                        : `I am the ${SPIRITS[type].name.en}, I will guide you from here.`,
                      type: "regular",
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    } as any]);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                    selectedSpirit === type ? "bg-slate-50 ring-1 ring-slate-100" : "hover:bg-slate-50/50"
                  )}
                >
                  <span className="text-xl">{SPIRITS[type].avatar}</span>
                  <div className="text-left">
                    <div className="text-sm font-black text-slate-900">{SPIRITS[type].name[language]}</div>
                    <div className="text-[10px] font-bold text-slate-400">{SPIRITS[type].title[language]}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <Badge className={cn(
            "hidden sm:flex items-center gap-1.5 py-1.5 px-3 border-none shadow-sm",
            selectedSpirit === 'compliance' ? "bg-blue-50 text-blue-700" :
              selectedSpirit === 'harmony' ? "bg-emerald-50 text-emerald-700" :
                "bg-purple-50 text-purple-700"
          )}>
            <Globe className="w-4 h-4" /> {companyProfile.industry} 專家模式
          </Badge>
          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <GlassCard className="flex-1 min-h-0 flex flex-col mb-2 overflow-hidden border-slate-100 shadow-sm">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn(
                "flex gap-3 md:gap-5",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg",
                msg.role === "ai"
                  ? cn("shadow-slate-900/10",
                    msg.spirit === 'compliance' ? "bg-blue-900" :
                      msg.spirit === 'harmony' ? "bg-emerald-900" :
                        "bg-purple-900")
                  : "bg-slate-900 shadow-slate-900/10"
              )}>
                {msg.role === "ai" ? (
                  <span className="text-sm md:text-lg">{SPIRITS[msg.spirit as SpiritType]?.avatar || "✨"}</span>
                ) : (
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
              </div>
              <div className={cn(
                "flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%]",
                msg.role === "user" ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "p-4 md:p-5 rounded-3xl text-sm font-medium leading-relaxed",
                  msg.role === "ai"
                    ? "bg-slate-50 text-slate-800 border border-slate-100/60 rounded-tl-none shadow-sm"
                    : "bg-slate-900 text-white rounded-tr-none shadow-md shadow-slate-900/20"
                )}>
                  {msg.content}

                  {msg.type === "insight" && (
                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className={cn("w-4 h-4",
                          selectedSpirit === 'compliance' ? "text-blue-600" :
                            selectedSpirit === 'harmony' ? "text-emerald-600" :
                              "text-purple-600")} />
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">快速捷徑</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveView("vault")}
                          className="bg-white/80 hover:bg-white px-3 py-2 rounded-lg text-[10px] font-black text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 檢視 ZKP 存證
                        </button>
                        <button
                          onClick={() => setActiveView("profile")}
                          className="bg-white/80 hover:bg-white px-3 py-2 rounded-lg text-[10px] font-black text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Target className="w-3.5 h-3.5 text-sky-600" /> 前往目標管理
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                  {msg.role === "ai" ? SPIRITS[msg.spirit as SpiritType]?.name[language] : "You"} • {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg",
                selectedSpirit === 'compliance' ? "bg-blue-900 shadow-blue-900/10" :
                  selectedSpirit === 'harmony' ? "bg-emerald-900 shadow-emerald-900/10" :
                    "bg-purple-900 shadow-purple-900/10"
              )}>
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2 border border-slate-100/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/80 rounded-full border border-slate-200/50">
                  <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                  <span className="text-[8px] font-black text-slate-400 tracking-tighter uppercase">V8.1 SEAL Security Active</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-5 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={language === "zh" ? "輸入您的詢問 (如: 分析溫室氣體數據)..." : "Enter your query (e.g. Analyze greenhouse gas data)..."}
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={cn(
                "h-12 w-12 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:scale-100 active:scale-90",
                selectedSpirit === 'compliance' ? "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700" :
                  selectedSpirit === 'harmony' ? "bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700" :
                    "bg-purple-600 shadow-purple-500/20 hover:bg-purple-700"
              )}
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3">
            <button onClick={() => { }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> 常用問項</button>
            <button onClick={() => setActiveView("compliance")} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> 即時指標</button>
            <button onClick={() => setActiveView("ncbdb")} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> 數據溯源</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
