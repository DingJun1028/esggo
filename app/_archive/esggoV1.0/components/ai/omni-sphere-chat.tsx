"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { GoogleGenAI, GenerateContentResponse, ThinkingLevel, Part } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Volume2,
  Mic,
  Image as ImageIcon,
  Video,
  Search,
  MapPin,
  Brain,
  Paperclip,
  X
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

interface Message {
  role: "user" | "model";
  text: string;
  parts?: Part[];
}

export function OmniSphereChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "您好！我是您的 Omni 數據智慧助理。很高興能協助您探索 ESG 治理與「5T 協議」的深層洞察。請問有什麼我可以幫您的嗎？" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const result = reader.result as string | null;
          if (result) {
            const base64Audio = result.split(',')[1];
            if (base64Audio) {
              await handleTranscription(base64Audio);
            }
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic Error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (base64Audio: string) => {
    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{
          parts: [
            { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
            { text: "請將這段語音轉錄為文字。" }
          ]
        }]
      });
      setInput(response.text || "");
    } catch (error) {
      console.error("Transcription Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const parts: Part[] = [];
    if (selectedImage) {
      const base64 = selectedImage.split(',')[1];
      if (base64) {
        parts.push({
          inlineData: {
            data: base64,
            mimeType: "image/png"
          }
        });
      }
    }
    if (input.trim()) {
      parts.push({ text: input });
    }

    const userMessage: Message = { role: "user", text: input, parts };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const userKey = typeof window !== 'undefined' ? localStorage.getItem("esggo_geminiApiKey") : null;
      const finalKey = userKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      const dynamicAi = new GoogleGenAI({ apiKey: finalKey });

      const isComplex = (input?.length || 0) > 50 || !!selectedImage || input?.includes("戰略") || input?.includes("分析");
      setIsThinking(isComplex);

      const tools = [];
      if (useSearch) tools.push({ googleSearch: {} });
      if (useMaps) tools.push({ googleMaps: {} });

      const response = await dynamicAi.models.generateContent({
        model: isComplex ? "gemini-1.5-pro" : "gemini-1.5-flash",
        contents: messages.concat(userMessage).map(m => ({
          role: m.role,
          parts: m.parts || [{ text: m.text }]
        })),
        config: {
          systemInstruction: "你是一個專業的 ESG 與「家道系統」專家。你的任務是協助用戶理解公共利益、隱性治理與社會解法生態系。請用專業、溫暖且富有啟發性的語氣回答。",
          ...(isComplex ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } } : {}),
          ...(tools.length > 0 ? { tools } : {})
        }
      });

      const modelText = response.text || "抱歉，我現在無法回答這個問題。";
      setMessages(prev => [...prev, { role: "model", text: modelText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: "model", text: "抱歉，連線發生錯誤，請稍後再試。" }]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <GlassCard className="flex flex-col h-[600px] overflow-hidden border-none shadow-minimal bg-white">
      {/* Header */}
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-surface-container/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-teal-start/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-teal-start" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface uppercase tracking-tight">Omni 數據助理</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Professional ESG Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isThinking && (
            <Badge variant="optimal" styleType="soft" className="bg-primary-teal-start/10 text-primary-teal-start border border-primary-teal-start/20">
              <Brain className="w-3 h-3 mr-1" /> Thinking...
            </Badge>
          )}
          <div className="w-2 h-2 rounded-full bg-primary-teal-start" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-surface-container" : "bg-primary-teal-start"}`}>
                  {m.role === "user" ? <User className="w-4 h-4 text-on-surface" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-4 rounded-lg text-sm leading-relaxed ${m.role === "user" ? "bg-surface-container text-on-surface rounded-tr-none border border-black/5" : "bg-primary-teal-start/10 text-on-surface rounded-tl-none border border-primary-teal-start/20"}`}>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-primary-teal-start/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary-teal-start animate-spin" />
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest italic">數據矩陣深度合成中...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-black/5 bg-surface-container/30">
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <Image
              src={selectedImage}
              alt="Selected"
              width={80}
              height={80}
              className="object-cover rounded-lg border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg snappy-transition ${isRecording ? 'bg-lethal text-white' : 'hover:bg-black/5 text-on-surface-variant'}`}
            title="語音輸入"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant snappy-transition"
            title="上傳圖片"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => setUseSearch(!useSearch)}
            className={`p-2 rounded-lg snappy-transition ${useSearch ? 'bg-primary-teal-start text-white' : 'hover:bg-black/5 text-on-surface-variant'}`}
            title="搜尋增強"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setUseMaps(!useMaps)}
            className={`p-2 rounded-lg snappy-transition ${useMaps ? 'bg-primary-teal-start text-white' : 'hover:bg-black/5 text-on-surface-variant'}`}
            title="地圖增強"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isRecording ? "正在聆聽..." : "輸入您的問題..."}
            className="w-full pl-4 pr-12 py-3 bg-white border border-black/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-on-surface focus:border-primary-teal-start transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-teal-start hover:text-primary-teal-start/80 disabled:text-on-surface-variant/20 snappy-transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function Map_Pin(props: any) {
  return <MapPin {...props} />;
}

