"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, MessageSquare, Send, Bot, Shield, Fingerprint, ChevronDown, User, Zap, ShieldCheck, Target, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/context/app-context";
import { SPIRITS, SpiritType } from "@/lib/core/spirits";

type GapData = {
  id: string;
  type: 'evidence' | 'compliance' | 'data';
  title: { zh: string; en: string };
  current: number;
  target: number;
  unit: string;
  suggestion: { zh: string; en: string };
  actionLabel: { zh: string; en: string };
  action: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  spirit?: SpiritType;
  type: "regular" | "insight";
  gap?: GapData;
};

// Internal Gap Analysis Card Component
function GapAnalysisCard({ gap, language, onAction }: { gap: GapData; language: "zh" | "en"; onAction: (action: string) => void }) {
  const progress = (gap.current / gap.target) * 100;

  return (
    <div className="mt-4 p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Shield className="w-12 h-12 text-white" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">
          {language === 'zh' ? '治理缺口偵測' : 'Governance Gap Detected'}
        </span>
      </div>

      <h4 className="text-sm font-black text-white mb-1">{gap.title[language]}</h4>
      <p className="text-[11px] text-white/60 mb-4 leading-relaxed">{gap.suggestion[language]}</p>

      <div className="space-y-2 mb-5">
        <div className="flex justify-between text-[10px] font-bold text-white/40">
          <span>{language === 'zh' ? '當前進度' : 'Current Progress'}</span>
          <span>{gap.current}{gap.unit} / {gap.target}{gap.unit}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full rounded-full ${progress < 50 ? 'bg-red-500' : 'bg-amber-500'}`}
          />
        </div>
      </div>

      <button
        onClick={() => onAction(gap.action)}
        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
      >
        <Zap className="w-3 h-3" />
        {gap.actionLabel[language]}
      </button>
    </div>
  );
}

const SUGGESTIONS: Record<SpiritType, { zh: string; en: string; action?: string }[]> = {
  compliance: [
    { zh: "分析 Gnosis 數據缺口", en: "Analyze Gnosis gaps", action: "omni-src" },
    { zh: "檢查 ZKP 驗證狀態", en: "Check ZKP status", action: "vault" },
    { zh: "驗證 GRI 305 合規", en: "Verify GRI 305 compliance", action: "compliance" },
  ],
  harmony: [
    { zh: "查看員工滿意度趨勢", en: "View employee satisfaction", action: "dashboard" },
    { zh: "近期社區參與報告", en: "Recent community reports" },
    { zh: "DEI 多元化包容分析", en: "DEI inclusion analysis" },
  ],
  innovation: [
    { zh: "永續專利研發進度", en: "Sustainable R&D patents", action: "dashboard" },
    { zh: "新材料實驗數據彙整", en: "New material experimental data" },
    { zh: "碳捕捉技術效率分析", en: "Carbon capture efficiency" },
  ]
};

export function SpiritModal() {
  const { isSpiritOpen, setIsSpiritOpen, selectedSpirit, setSelectedSpirit, companyProfile, globalEsgData, language, setActiveView } = useAppContext();
  const currentSpirit = SPIRITS[selectedSpirit];
  const suggestions = SUGGESTIONS[selectedSpirit];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      spirit: selectedSpirit,
      content: language === "zh"
        ? `您好，我是${currentSpirit.name.zh}。我已深研 Gnosis 智核奧義。有什麼關於「${companyProfile.name}」的永續治理缺口需要我為您補齊嗎？`
        : `Hello, I am the ${currentSpirit.name.en}. I have studied the Gnosis core. Any sustainability gaps for "${companyProfile.name}" I can help fill?`,
      type: "regular"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSpiritSelector, setShowSpiritSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const userMsg = overrideInput || input;
    if (!userMsg.trim() || isTyping) return;

    setMessages([...messages, { role: "user", content: userMsg, type: "regular" }]);
    setInput("");
    setIsTyping(true);

    // LUI-to-GUI Command Parsing
    const lowerMsg = userMsg.toLowerCase();
    let actionTriggered = false;

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    let botResponse = "";
    let responseType: "regular" | "insight" = "regular";

    // Intent detection
    if (lowerMsg.includes("缺口") || lowerMsg.includes("gap") || lowerMsg.includes("補齊") || lowerMsg.includes("分析") || lowerMsg.includes("analyze")) {
      let detectedGap: GapData | undefined;

      if (globalEsgData.trustScore < 95) {
        detectedGap = {
          id: "gap-trust",
          type: "evidence",
          title: { zh: "ZKP 存證連貫性不足", en: "ZKP Evidence Fragmentation" },
          current: globalEsgData.trustScore,
          target: 95,
          unit: "%",
          suggestion: { zh: "目前部分範疇一數據缺乏鏈上 ZKP 存證，建議立即前往證據保險箱進行補簽。", en: "Some Scope 1 data lacks on-chain ZKP. Recommend immediate signing in Evidence Vault." },
          actionLabel: { zh: "立即前往存證", en: "Fix in Vault" },
          action: "vault"
        };
      } else if (globalEsgData.complianceRate < 95) {
        detectedGap = {
          id: "gap-comp",
          type: "compliance",
          title: { zh: "GRI 305 指標缺失", en: "GRI 305 Indicator Missing" },
          current: globalEsgData.complianceRate,
          target: 98,
          unit: "%",
          suggestion: { zh: "偵測到 GRI 305-1 與 305-2 數據源未完全對接，將影響最終報告生成。", en: "GRI 305-1 & 305-2 sources are not fully mapped. This affects automated reporting." },
          actionLabel: { zh: "前往追蹤器補齊", en: "Fill in Tracker" },
          action: "compliance"
        };
      } else if (globalEsgData.linkedSourcesCount < 5) {
        detectedGap = {
          id: "gap-data",
          type: "data",
          title: { zh: "數據鏈路覆蓋率低", en: "Low Data Source Coverage" },
          current: globalEsgData.linkedSourcesCount,
          target: 10,
          unit: " sources",
          suggestion: { zh: "目前僅連接了少數數據源。建議接入更多 ERP/IoT 節點以提升透明度。", en: "Limited data sources connected. Suggest linking more ERP/IoT nodes for transparency." },
          actionLabel: { zh: "擴展數據地圖", en: "Expand Data Map" },
          action: "omni-src"
        };
      }

      if (detectedGap) {
        botResponse = language === "zh"
          ? `根據 Gnosis 智核掃描，我為您識別到了一個關鍵的「${detectedGap.type === 'evidence' ? '信賴' : '合規'}」缺口。`
          : `Gnosis core scan identified a critical "${detectedGap.type}" gap for you.`;

        setMessages(prev => [...prev, {
          role: "assistant",
          spirit: selectedSpirit,
          content: botResponse,
          type: "insight",
          gap: detectedGap
        }]);
        setIsTyping(false);
        return;
      }
    }

    // Default Navigation intents
    if (lowerMsg.includes("數據") || lowerMsg.includes("data") || lowerMsg.includes("source")) {
      setActiveView("omni-src");
      botResponse = language === "zh"
        ? "收到，已為您切換至數據源地圖視圖。這裡展示了所有接入 Gnosis 的原始數據鏈路。"
        : "Received. I've switched to the Data Source Map view. It shows all raw data links connected to Gnosis.";
      actionTriggered = true;
    } else if (lowerMsg.includes("存證") || lowerMsg.includes("vault") || lowerMsg.includes("zkp")) {
      setActiveView("vault");
      botResponse = language === "zh"
        ? "正在前往證據保險箱。這裡存放了所有經過 ZKP 驗證的鏈上存證，確保數據的可信度。"
        : "Navigating to Evidence Vault. Here are all ZKP-verified on-chain proofs, ensuring data credibility.";
      actionTriggered = true;
      botResponse = language === "zh"
        ? "已切換至 SustainWrite 創研室。您可以開始撰寫或生成基於最新數據的永續報告。"
        : "Switched to SustainWrite Lab. You can start writing or generating reports based on the latest data.";
      actionTriggered = true;
    } else if (lowerMsg.includes("商情") || lowerMsg.includes("情報") || lowerMsg.includes("風險") || lowerMsg.includes("市場") || lowerMsg.includes("intelligence") || lowerMsg.includes("market") || lowerMsg.includes("risk")) {
      setActiveView("intelligence");
      botResponse = language === "zh"
        ? "正在開啟商情偵測中心。我已準備好為您分析全球市場風險與永續情資。"
        : "Opening Intelligence Detection Center. I'm ready to analyze global market risks and sustainability intelligence for you.";
      actionTriggered = true;
    }

    if (!actionTriggered) {
      if (selectedSpirit === 'compliance') {
        botResponse = language === "zh"
          ? `根據 GRI 305 標準，您的範疇一排放數據需要更細緻的專案證明。目前的 trustScore 為 ${globalEsgData.trustScore}%，建議在 Evidence Vault 中補齊 ZKP。`
          : `Per GRI 305, your Scope 1 emissions data needs project-level proof. Current trustScore is ${globalEsgData.trustScore}%. I recommend adding ZKP in Evidence Vault.`;
        responseType = "insight";
      } else {
        botResponse = language === "zh"
          ? `這是關於「${companyProfile.industry}」產業深層治理的重要面向。我建議對「${companyProfile.goals[0]}」目標進行雙重重大性分析。`
          : `This is a key aspect of deep governance for the ${companyProfile.industry} sector. I suggest double materiality analysis for "${companyProfile.goals[0]}".`;
        responseType = "insight";
      }
    }

    setMessages(prev => [...prev, {
      role: "assistant",
      spirit: selectedSpirit,
      content: botResponse,
      type: responseType
    }]);
    setIsTyping(false);

    // Auto-close modal if action was triggered (optional, maybe wait a bit)
    if (actionTriggered) {
      setTimeout(() => setIsSpiritOpen(false), 2000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isSpiritOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              onClick={() => setIsSpiritOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl h-[85vh] max-h-[750px] flex flex-col z-[101]"
            >
              <GlassCard className="h-full flex flex-col bg-white/95 border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-[2.5rem]">
                {/* Header with Spirit Selector */}
                <div className="p-6 md:p-8 bg-slate-900 text-white flex items-center justify-between relative rounded-t-[2.5rem] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95",
                        selectedSpirit === 'compliance' ? "bg-blue-600" :
                          selectedSpirit === 'harmony' ? "bg-emerald-600" :
                            "bg-purple-600"
                      )}
                      onClick={() => setShowSpiritSelector(!showSpiritSelector)}
                    >
                      <span className="text-2xl">{currentSpirit.avatar}</span>
                    </div>
                    <div className="cursor-pointer" onClick={() => setShowSpiritSelector(!showSpiritSelector)}>
                      <h3 className="text-xl font-black tracking-tight leading-tight flex items-center gap-2">
                        {currentSpirit.name[language]}
                        <ChevronDown className={cn("w-4 h-4 text-white/40 transition-all", showSpiritSelector && "rotate-180")} />
                      </h3>
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">{currentSpirit.title[language]}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSpiritOpen(false)}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-colors active:scale-90 relative z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <AnimatePresence>
                    {showSpiritSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-24 left-8 w-64 bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 space-y-2 z-50 overflow-hidden"
                      >
                        {(Object.keys(SPIRITS) as SpiritType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedSpirit(type);
                              setShowSpiritSelector(false);
                              setMessages(prev => [...prev, {
                                role: "assistant",
                                spirit: type,
                                content: language === "zh"
                                  ? `我是${SPIRITS[type].name.zh}，現在由我來接手指引。`
                                  : `I am the ${SPIRITS[type].name.en}, I will guide you from here.`,
                                type: "regular"
                              }]);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                              selectedSpirit === type ? "bg-slate-100 ring-1 ring-slate-200" : "hover:bg-slate-50"
                            )}
                          >
                            <span className="text-xl">{SPIRITS[type].avatar}</span>
                            <div className="text-left">
                              <div className="text-sm font-black text-slate-900">{SPIRITS[type].name[language]}</div>
                              <div className="text-[9px] font-bold text-slate-400">{SPIRITS[type].title[language]}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4",
                        msg.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                        msg.role === "user" ? "bg-slate-200 text-slate-600" :
                          cn("text-white",
                            msg.spirit === 'compliance' ? "bg-blue-600" :
                              msg.spirit === 'harmony' ? "bg-emerald-600" :
                                "bg-purple-600")
                      )}>
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl text-sm font-medium leading-relaxed max-w-[85%]",
                        msg.role === "user"
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none shadow-sm"
                      )}>
                        {msg.content}

                        {msg.type === "insight" && !msg.gap && (
                          <div className="mt-4 pt-4 border-t border-slate-200/50">
                            <div className="flex items-center gap-2 mb-3">
                              <Zap className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">快速操作捷徑</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => { setActiveView("vault"); setIsSpiritOpen(false); }}
                                className="bg-white hover:bg-slate-50 px-3 py-2 rounded-lg text-[10px] font-black text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 檢視 ZKP 存證
                              </button>
                              <button
                                onClick={() => { setActiveView("dashboard"); setIsSpiritOpen(false); }}
                                className="bg-white hover:bg-slate-50 px-3 py-2 rounded-lg text-[10px] font-black text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <Target className="w-3.5 h-3.5 text-sky-600" /> 績效指標中心
                              </button>
                            </div>
                          </div>
                        )}

                        {msg.gap && (
                          <GapAnalysisCard
                            gap={msg.gap}
                            language={language}
                            onAction={(action) => {
                              setActiveView(action as any);
                              setTimeout(() => setIsSpiritOpen(false), 800);
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-1.5 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2.5rem]">
                  {/* Suggestions Roll */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s[language])}
                        className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 shadow-sm shrink-0"
                      >
                        {s[language]}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="輸入指令、數據分析需求或永續諮詢..."
                      className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-5 pr-14 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-30 active:scale-90 shadow-lg shadow-slate-900/20"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
