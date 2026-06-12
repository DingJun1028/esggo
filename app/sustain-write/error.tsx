'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Bot, RefreshCw, AlertCircle } from 'lucide-react';

export default function SustainWriteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Karma Protocol: 觀果 (Observe Effect) - 捕捉並記錄 RAG/LLM 異常
    console.error('SustainWrite RAG Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center p-6 bg-slate-50/50">
      {/* 液態玻璃 (Liquid Glass) 容器 */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-white/60 border border-white/80 shadow-[0_8px_32px_rgba(99,166,176,0.1)] rounded-3xl p-8 max-w-md w-full text-center">
        
        {/* 背景裝飾光暈 */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--danger)]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-100 to-orange-50 flex items-center justify-center text-rose-500 mb-6 shadow-inner">
            <AlertCircle size={32} strokeWidth={2.5} />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">
            智能寫手連線中斷
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Gemini 模型或 5T 實證數據庫 (Vault) 暫時無法回應。這可能是因為 API 流量限制或是網路波動所致。
          </p>

          <div className="bg-white/50 backdrop-blur-sm border border-slate-100 p-3 rounded-xl w-full text-left mb-6">
            <span className="text-xs font-mono text-slate-400 block mb-1">Error Trace:</span>
            <span className="text-sm font-mono text-slate-600 break-words line-clamp-2">
              {error.message || 'RAG Retrieval Timeout / Inference Error'}
            </span>
          </div>

          <button
            onClick={reset}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 w-full bg-[var(--primary)] hover:bg-[#52939d] text-white rounded-xl font-medium transition-all shadow-[0_4px_12px_rgba(99,166,176,0.3)] hover:shadow-[0_6px_16px_rgba(99,166,176,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
            <span>重新喚醒 OmniAgent</span>
            
            {/* 掃光特效 */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shimmer"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
