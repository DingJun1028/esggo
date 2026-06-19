"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ServiceExplanationCard } from "@/components/ui/service-explanation-card";
import {
  Bot,
  Send,
  Sparkles,
  BrainCircuit,
  Activity,
  BookOpen,
  ChevronRight,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  Paperclip,
  MessageSquare,
  Image as ImageIcon,
  History,
  Globe,
  FileText,
  ChevronDown,
  CheckCircle,
  Brain,
  ArrowUpRight,
  Search,
  LayoutDashboard,
  Database,
  ShieldCheck as VerifiedIcon,
  BarChart2,
  Loader2,
  Mic,
  Square,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { OmniService } from "@/lib/services/omni-service";
import { AlignmentDashboard } from "./alignment-dashboard";
import { AuditTraceView } from "./audit-trace-view";
import { IOmniHeart } from "@/lib/omni-heart";

import {
  PERSONAS,
  CAPABILITIES,
  BEST_PRACTICES,
  TOOLBOX,
  ESG_DATA,
} from "@/lib/data/omni-data";
import { useAppContext } from "@/lib/context/app-context";

export interface AlignmentData {
  standardId: string;
  readinessPercent: number;
  gapAnalysis: string;
  recommendation: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  type: "text" | "chart" | "image" | "alignment";
  alignmentData?: AlignmentData | null | undefined;
  mediaUrl?: string | undefined;
  mediaAlt?: string | undefined;
  omniHeart?: IOmniHeart | undefined;
}

export function OmniView() {
  const { isOmniOpen, setIsOmniOpen, activePersonaId, setActivePersonaId, geminiApiKey } = useAppContext();
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [selectedHeart, setSelectedHeart] = useState<IOmniHeart | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const activePersona =
    PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0]!;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: activePersona?.greeting || "Hello, I am Omni.",
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPersonaDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup media streams on unmount to prevent memory and hardware resource leaks
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handlePersonaChange = (personaId: string) => {
    setActivePersonaId(personaId);
    setIsPersonaDropdownOpen(false);
    const newPersona = PERSONAS.find((p) => p.id === personaId) || PERSONAS[0];
    if (newPersona) {
      setMessages([
        {
          role: "assistant",
          content: newPersona.greeting,
          type: "text",
        },
      ]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("無法啟動核閱指令錄音，請檢查瀏覽器設定。");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(",")[1];
        const mimeType = blob.type.split(";")[0] || "audio/webm";

        try {
          const transcription = await OmniService.transcribeAudio(base64data || "", mimeType);
          if (transcription) {
            setInput((prev) => (prev ? prev + " " + transcription : transcription));
          }
        } catch (err) {
          console.error("Transcription service error:", err);
        } finally {
          setIsLoading(false);
        }
      };
    } catch (error) {
      console.error("Transcription error:", error);
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const newUserMsg: ChatMessage = { role: "user", content: text, type: "text" };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    // Check for special UI triggers
    const isChartRequest =
      text.includes("圖表") || text.includes("分析") || text.includes("數據");
    const isImageRequest =
      text.includes("圖片") ||
      text.includes("生成") ||
      text.includes("視覺化") ||
      text.includes("影像");
    const isAlignmentRequest =
      text.includes("GRI") || text.includes("SASB") || text.includes("對標") || text.includes("合規");

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model" as const,
        content: msg.content
      }));

      // Call Omni Flow via unified service with streaming support
      const partialAssistantMsg: ChatMessage = {
        role: "assistant",
        content: "",
        type: isAlignmentRequest ? "alignment" : isChartRequest ? "chart" : isImageRequest ? "image" : "text",
      };
      setMessages((prev) => [...prev, partialAssistantMsg]);

      const stream = await OmniService.callFlow("omniFlow", {
        text,
        persona: {
          name: activePersona?.name || "Omni",
          title: activePersona?.title || "Assistant",
          description: activePersona?.description || ""
        },
        history: chatHistory.map(m => ({
          role: m.role,
          content: [{ text: m.content }]
        })),
      }, true);

      if (stream instanceof ReadableStream) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                accumulatedContent += data || "";
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  const lastIdx = newMsgs.length - 1;
                  if (newMsgs[lastIdx] && newMsgs[lastIdx].role === "assistant") {
                    newMsgs[lastIdx] = { ...newMsgs[lastIdx], content: accumulatedContent };
                  }
                  return newMsgs;
                });
              } catch (e) {
                // Skip partial/malformed JSON chunks in the stream
              }
            }
          }
        }
      } else {
        // Standard non-streaming fallback (if stream is not available)
        const response = stream as string;
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          if (newMsgs[lastIdx] && newMsgs[lastIdx].role === "assistant") {
            newMsgs[lastIdx] = { ...newMsgs[lastIdx], content: response };
          }
          return newMsgs;
        });
      }

      let alignmentResult: AlignmentData | null = null;
      if (isAlignmentRequest) {
        alignmentResult = await OmniService.callFlow("alignmentAssistantFlow", {
          standardId: text.includes("305") ? "GRI-305-1" : text.includes("302") ? "GRI-302-1" : "SASB-RR-FC"
        });
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          if (newMsgs[lastIdx] && newMsgs[lastIdx].role === "assistant") {
            newMsgs[lastIdx] = { ...newMsgs[lastIdx], alignmentData: alignmentResult };
          }
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Omni Engine Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，Omni 專業數據核心目前因 API 限制或連線不穩定。請稍後再試。",
          type: "text",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSealReport = async () => {
    setIsSealing(true);
    try {
      const zkHeart = await OmniService.generateZkProof("Omni_Report_Seal", "ESG_Compliance");
      setIsSealing(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `## 🔒 OMNI ZK-PRIVACY SEALED\n\n報告已成功進行零知識證明封裝。數據摘要、溯源鏈結及 5T 指標特徵已寫入不可篡改存證庫。\n\n**Seal Hash:** \`${zkHeart.A_Tagging.hash_lock}\`\n\n**協議狀態:** 100% 存證驗證通過。`,
        type: "text",
        omniHeart: zkHeart
      }]);
    } catch (err) {
      console.error("Sealing failed:", err);
      setIsSealing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* Omni Professional Interface */}
      <div className="flex flex-col flex-1 shadow-2xl overflow-hidden border border-outline-variant bg-background rounded-3xl md:rounded-[40px]">
        <div className="p-5 md:p-8 border-b border-outline-variant flex items-center justify-between bg-background/95 backdrop-blur-2xl z-20">
          <div className="flex items-center gap-8 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
              className="flex items-center gap-3 md:gap-5 hover:bg-surface-container/80 active:bg-surface-container p-2 md:p-4 md:-ml-4 rounded-xl md:rounded-2xl transition-all text-left group border border-transparent hover:border-outline-variant"
            >
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${activePersona.gradient} flex items-center justify-center shadow-minimal transition-transform duration-500 group-hover:scale-105 group-active:scale-95 shrink-0`}
              >
                <activePersona.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black text-on-surface tracking-tighter flex items-center gap-2 md:gap-4 font-headline uppercase leading-none">
                  {activePersona.name}
                  <ChevronDown
                    className={`w-6 h-6 text-on-surface-variant/40 transition-transform duration-300 ${isPersonaDropdownOpen ? "rotate-180" : ""}`}
                  />
                </h2>
                <div className="flex items-center gap-4 mt-2.5">
                  <p className={`text-[11px] font-black uppercase tracking-[0.2em] font-headline px-3 py-1 rounded-full ${activePersona.bgColor}/10 ${activePersona.textColor} border border-${activePersona.bgColor}/20`}>
                    {activePersona.title}
                  </p>
                  <span className="flex items-center gap-2 text-[11px] text-primary font-black uppercase tracking-[0.2em] font-headline">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    PROFESSIONAL_LINK_ACTIVE
                  </span>
                </div>
              </div>
            </button>

            {/* Persona Dropdown */}
            <AnimatePresence>
              {isPersonaDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full left-0 mt-6 w-96 bg-background rounded-[32px] shadow-massive border border-outline-variant overflow-hidden z-50 p-4 flex flex-col gap-3 backdrop-blur-3xl"
                >
                  {PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaChange(persona.id)}
                      className={cn(
                        "w-full flex items-start gap-5 p-5 rounded-[20px] transition-all text-left hover:bg-surface-container group border border-transparent hover:border-outline-variant",
                        activePersonaId === persona.id && "bg-surface-container/80 border-outline-variant shadow-inner"
                      )}
                    >
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${persona.gradient} flex items-center justify-center flex-shrink-0 mt-1 shadow-minimal`}
                      >
                        <persona.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-black text-on-surface text-sm font-headline uppercase tracking-wider">
                          {persona.name}
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-1.5 font-bold leading-relaxed">
                          {persona.description}
                        </p>
                      </div>
                      {activePersonaId === persona.id && (
                        <div className={cn("ml-auto mt-2", persona.textColor)}>
                          <div className="w-2 h-2 rounded-full bg-current shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="hidden lg:flex px-6 py-3 rounded-full bg-surface-container text-[11px] font-black text-on-surface-variant items-center gap-3 border border-outline-variant font-headline uppercase tracking-[0.2em] shadow-minimal">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Cora CLOUD CORE ACTIVE
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-background relative custom-scrollbar">
          {(messages?.length || 0) === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12"
            >
              <ServiceExplanationCard
                title="Cora 專業核閱引擎"
                description="連結 5T + ZKP 存證核心，提供具備法律追溯力之 ESG 專業諮詢與數據全路徑監控。"
                icon={<ShieldCheck className="w-7 h-7" />}
                features={["5T 專業存證", "ZKP 隱私護盾", "數據自動核實"]}
                color="var(--color-primary)"
                actionText="啟動數據分析"
                onAction={() => handleSend("請啟動數據專業分析")}
              />
              <ServiceExplanationCard
                title="Cora 預言對標器"
                description="基於 Cora Prophetic Engine 深度對齊全球 GRI/SASB 標準，自動推演產業風險並產出改進戰略。"
                icon={<BrainCircuit className="w-7 h-7" />}
                features={["國際專業標竿對齊", "Prophetic 風險分析", "戰略自動演化"]}
                color="var(--color-primary)"
                actionText="執行標竿對標"
                onAction={() => handleSend("請協助執行國際標竿對標分析")}
              />
            </motion.div>
          )}

          {(messages?.length || 0) === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12"
            >
              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.25em] flex items-center gap-4 font-headline text-on-surface">
                  <ShieldCheck className="w-5 h-5 text-primary" /> 核心數據工具
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {TOOLBOX.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleSend(`啟動：${tool.label}`)}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center gap-4 p-6 rounded-[28px] bg-background border border-outline-variant hover:border-primary hover:shadow-massive transition-all group disabled:opacity-50 active:scale-95"
                      >
                        <div className="p-4 rounded-2xl bg-surface-container group-hover:bg-primary/5 transition-colors shadow-inner">
                          <Icon className="w-8 h-8 text-on-surface-variant group-hover:text-primary" />
                        </div>
                        <span className="text-[11px] font-black text-on-surface uppercase tracking-widest font-headline">{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.25em] flex items-center gap-4 font-headline">
                  <Wrench className="w-5 h-5 text-primary" /> 專業最佳實踐
                </h3>
                <div className="space-y-4">
                  {BEST_PRACTICES.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSend(`分析實踐：${item.title}`)}
                        disabled={isLoading}
                        className={`w-full text-left p-5 rounded-[24px] bg-background border border-outline-variant hover:border-primary hover:shadow-massive transition-all group disabled:opacity-50 active:scale-[0.98]`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            className={cn(
                              "text-xs font-black text-on-surface flex items-center gap-3 font-headline uppercase tracking-wide transition-colors whitespace-nowrap overflow-hidden text-ellipsis",
                              `group-hover:${activePersona.textColor}`
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {item.title}
                          </span>
                          <ChevronRight
                            className={cn("w-5 h-5 text-on-surface-variant/40 transition-transform group-hover:translate-x-1", `group-hover:${activePersona.textColor}`)}
                          />
                        </div>
                        <p className="text-[11px] text-on-surface-variant font-bold leading-relaxed line-clamp-1">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.25em] flex items-center gap-4 font-headline">
                  <BrainCircuit className="w-5 h-5 text-primary" /> 核心分析矩陣
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {CAPABILITIES.map((cap) => (
                    <button
                      key={cap.id}
                      onClick={() =>
                        handleSend(`詳細說明專業能力：${cap.title}`)
                      }
                      disabled={isLoading}
                      className={cn(
                        "w-full flex items-start justify-between p-5 rounded-[24px] bg-background border border-outline-variant hover:border-primary transition-all group disabled:opacity-50 h-full active:scale-[0.98]",
                        `hover:${activePersona.textColor}`
                      )}
                    >
                      <div className="text-left flex-1 mr-4">
                        <span
                          className={cn("text-xs font-black block text-on-surface group-hover:text-inherit mb-1.5 font-headline uppercase tracking-wide", `group-hover:${activePersona.textColor}`)}
                        >
                          {cap.title}
                        </span>
                        <span className="text-[11px] text-on-surface-variant font-bold leading-relaxed block">
                          {cap.desc}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 flex-shrink-0 mt-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={i}
              className={`flex gap-6 md:gap-10 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={cn(
                  "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-minimal transition-transform",
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : `bg-gradient-to-br ${activePersona.gradient} text-white`
                )}
              >
                {msg.role === "user" ? (
                  <span className="font-black text-2xl font-headline">U</span>
                ) : (
                  <activePersona.icon className="w-6 h-6 md:w-8 md:h-8" />
                )}
              </div>
              <div
                className={`max-w-[85%] md:max-w-[75%] flex flex-col gap-4 ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={cn(
                    "p-6 md:p-8 text-base md:text-xl leading-relaxed shadow-minimal",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-[32px] rounded-tr-none font-black"
                      : "bg-surface-container border border-outline-variant text-on-surface rounded-[40px] rounded-tl-none font-bold"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="markdown-body prose prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-pre:bg-background prose-pre:text-on-surface prose-pre:border prose-pre:border-outline-variant prose-pre:rounded-2xl prose-strong:font-black">
                      <Markdown>{msg.content || "正在執行 Omni 數據指令..."}</Markdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* ZKP Verification UI */}
                {msg.omniHeart && (
                  <div className="w-full flex flex-col gap-3 mt-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-md">
                      <div className="p-2 rounded-full bg-primary text-white">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface font-headline">
                          Omni ZKP Sealed
                        </p>
                        <p className="text-[11px] font-bold text-on-surface-variant truncate max-w-[200px]">
                          Hash: {msg.omniHeart.A_Tagging.hash_lock}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedHeart(msg.omniHeart!)}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/80 transition-all font-headline"
                      >
                        Verify Proof
                      </button>
                    </div>
                  </div>
                )}

                {/* Multimodal Content */}
                {msg.type === "image" && msg.mediaUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl md:rounded-[40px] overflow-hidden border border-outline-variant shadow-minimal w-full max-w-2xl mt-6 relative h-[250px] md:h-[450px] group transition-all"
                  >
                    <Image
                      src={msg.mediaUrl}
                      alt={msg.mediaAlt || "Generated Professional Data Model"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <p className="text-white text-sm font-black uppercase tracking-widest">{msg.mediaAlt}</p>
                    </div>
                  </motion.div>
                )}

                {msg.type === "chart" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 md:p-10 bg-background rounded-3xl md:rounded-[40px] border border-outline-variant shadow-minimal w-full max-w-2xl h-[300px] md:h-[450px] flex flex-col mt-6"
                  >
                    <h4 className="text-[11px] font-black text-on-surface mb-10 text-center uppercase tracking-[0.3em] font-headline">
                      Omni 數據專業核閱分析
                    </h4>
                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart
                          data={ESG_DATA}
                          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="8 8"
                            stroke="var(--color-outline-variant)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            stroke="var(--color-on-surface-variant)"
                            tick={{
                              fontSize: 11,
                              fill: "var(--color-on-surface)",
                              fontWeight: 900,
                              fontFamily: 'Inter'
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="var(--color-on-surface-variant)"
                            tick={{
                              fontSize: 11,
                              fill: "var(--color-on-surface)",
                              fontWeight: 900,
                              fontFamily: 'Inter'
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "var(--color-surface-container-high)" }}
                            contentStyle={{
                              borderRadius: "24px",
                              border: "1px solid var(--color-outline-variant)",
                              boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                              padding: "20px",
                              fontFamily: 'Inter',
                              fontWeight: 900,
                              background: 'var(--color-background)'
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#000"
                            radius={[12, 12, 0, 0]}
                            maxBarSize={60}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {msg.type === "alignment" && msg.alignmentData && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl mt-6 space-y-4"
                  >
                    <AlignmentDashboard
                      standardId={msg.alignmentData.standardId || "GRI-305-1"}
                      readiness={msg.alignmentData.readinessPercent}
                      gapAnalysis={msg.alignmentData.gapAnalysis}
                      recommendation={msg.alignmentData.recommendation}
                    />
                    <button
                      onClick={handleSealReport}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors w-full justify-center group shadow-xl"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-white/80 group-hover:scale-110 transition-transform" />
                      Seal with OMNI ZK-Privacy
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {isSealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-32 h-32 mx-auto mb-8 relative"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                  <ShieldCheck className="w-full h-full text-primary relative z-10" />
                  {/* ZK Floating Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-20, 20],
                        x: [-20, 20],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      className="absolute w-1 h-1 bg-primary rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                    />
                  ))}
                </motion.div>
                <h2 className="text-2xl font-black text-white tracking-[0.3em] uppercase mb-2 font-headline">
                  ZK_PRIVACY_SEALING
                </h2>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Generating Proof & Locking 5T Traceability Hash
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 md:p-12 border-t border-outline-variant bg-background z-10">
          <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={() => handleSend("分析當前數據圖表")}
                disabled={isLoading}
                className={cn(
                  "p-3 md:p-5 hover:bg-surface-container active:bg-surface-container-high active:scale-95 rounded-xl md:rounded-2xl transition-all disabled:opacity-50 group border border-transparent hover:border-outline-variant flex-1 md:flex-none flex justify-center",
                  `hover:${activePersona.textColor}`
                )}
                title="數據分析可視化"
              >
                <BarChart2 className="w-7 h-7 text-on-surface-variant group-hover:text-on-surface" />
              </button>
              <button
                onClick={() => handleSend("生成當前數據脈絡之視覺化影像")}
                disabled={isLoading}
                className={cn(
                  "p-3 md:p-5 hover:bg-surface-container active:bg-surface-container-high active:scale-95 rounded-xl md:rounded-2xl transition-all disabled:opacity-50 group border border-transparent hover:border-outline-variant flex-1 md:flex-none flex justify-center",
                  `hover:${activePersona.textColor}`
                )}
                title="影像生成核閱"
              >
                <ImageIcon className="w-7 h-7 text-on-surface-variant group-hover:text-on-surface" />
              </button>
            </div>
            <div className="relative w-full flex-1 flex items-center bg-surface-container/50 border border-outline-variant rounded-2xl md:rounded-[32px] shadow-sm focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary focus-within:bg-background transition-all duration-500">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                disabled={isLoading}
                placeholder={isRecording ? "正在接收數據指令..." : `Enter ${activePersona.name} directive...`}
                className="w-full bg-transparent pl-5 md:pl-8 pr-4 py-4 md:py-8 text-base md:text-2xl text-on-surface focus:outline-none placeholder:text-on-surface-variant/30 font-black disabled:opacity-50"
              />
              <div className="flex items-center pr-3 md:pr-6 gap-2 md:gap-4">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="p-4 text-error hover:bg-error/5 rounded-2xl transition-all animate-pulse"
                    title="終止錄音"
                  >
                    <Square className="w-7 h-7 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={isLoading}
                    className="p-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-2xl transition-all disabled:opacity-50"
                    title="啟動指令輸入"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                )}
                <button
                  onClick={() => handleSend(input)}
                  disabled={isLoading || (!input.trim() && !isRecording)}
                  className={cn(
                    "p-5 md:p-6 text-white rounded-2xl transition-all shadow-massive hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                    "bg-primary"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6 md:w-8 md:h-8" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] font-black text-on-surface-variant/30 mt-8 font-headline uppercase tracking-[0.3em]">
            PROFESSIONAL TRUST IN DATA. DIRECT PROVER VERIFICATION. Omni ENGINE v5.0
          </p>
        </div>
      </div>

      {/* Audit Trace Overlay */}
      <AnimatePresence>
        {selectedHeart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedHeart(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedHeart(null)}
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-background shadow-xl flex items-center justify-center text-on-surface hover:scale-110 transition-transform z-10 font-black border border-outline-variant"
                >
                  ✕
                </button>
                {selectedHeart && (
                  <AuditTraceView forensicMeta={{
                    sourceHash: selectedHeart.A_Tagging.hash_lock,
                    agentChain: selectedHeart.C_Tag.trace_path,
                    timestamp: new Date().toISOString(),
                    integritySeal: selectedHeart.uuid,
                    confidence: 0.99
                  }} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
