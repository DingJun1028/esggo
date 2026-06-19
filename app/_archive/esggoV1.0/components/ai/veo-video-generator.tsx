"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Video, Loader2, Play, Download, X, Sparkles, Hash, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export function VeoVideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState<number | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setVideoUrl(null);
    setProgress(0);
    setStatus("正在喚醒 Veo 3 引擎...");

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 95));
      }, 2000);

      let operation = await (ai.models as any).generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A high-quality, cinematic ESG strategy visualization: ${prompt}`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9',
          seed: seed !== "" ? seed : undefined
        }
      });

      setStatus("影片生成中，請稍候片刻...");

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await (ai.operations as any).getVideosOperation({ operation: operation });
      }

      clearInterval(progressInterval);
      setProgress(100);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus("正在下載生成內容...");
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
          },
        });
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
        toast.success("影片生成成功！");
      }
    } catch (error) {
      console.error("Veo Error:", error);
      setStatus("生成失敗，請檢查 API 金鑰與網路後重試。");
      toast.error("影片生成失敗，請稍後重試。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setSeed("");
    setVideoUrl(null);
    toast.info("已清除輸入內容");
  };

  return (
    <GlassCard className="p-6 bg-slate-900 text-white border-none shadow-minimal overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-stitch-gold/10 rounded-full blur-[60px]" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stitch-gold/20 flex items-center justify-center">
            <Video className="w-6 h-6 text-stitch-gold" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">Veo 3 影片生成</h3>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-stitch-gold animate-pulse" />
              <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-black">Cinematic ESG Visualization</p>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-stitch-gold" />
      </div>

      <div className="space-y-4 relative z-10">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述您想生成的 ESG 場景或視覺 (例如: 未來智慧森林、水資源循環系統)..."
            className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-stitch-gold/50 transition-all outline-none resize-none placeholder:text-white/20"
          />
          <AnimatePresence>
            {prompt && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 bottom-3 p-1.5 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg transition-colors"
                title="清除內容"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1 flex items-center gap-1.5">
              <Hash className="w-3 h-3" /> 隨機種子 (Seed)
            </label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="留空則隨機生成"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-stitch-gold/50 transition-all outline-none"
            />
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 group shadow-inner">
          <AnimatePresence mode="wait">
            {videoUrl ? (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full"
              >
                <video src={videoUrl} controls className="w-full h-full object-cover" />
                <button
                  onClick={() => setVideoUrl(null)}
                  className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-stitch-gold animate-spin" />
                  </div>
                  <svg className="absolute top-0 left-0 w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="188.4"
                      strokeDashoffset={188.4 - (188.4 * progress) / 100}
                      className="text-stitch-gold transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>
                <p className="text-xs text-white/80 font-bold mb-1 tracking-tight">{status}</p>
                <p className="text-[10px] text-white/30 font-black">{Math.round(progress)}% COMPLETED</p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex items-center justify-center flex-col gap-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-2xl">
                  <Video className="w-8 h-8 text-white/10" />
                </div>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Ready for Generation</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 bg-stitch-gold text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-[0_10px_20px_rgba(255,184,0,0.15)]"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {isGenerating ? "正在生成精采畫面..." : "啟動電影級生成 (Start Generation)"}
        </button>
      </div>
    </GlassCard>
  );
}
