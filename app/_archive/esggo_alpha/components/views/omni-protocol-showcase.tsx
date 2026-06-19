"use client";

import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Search, 
  History, 
  Eye, 
  Lock, 
  Fingerprint, 
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROTOCOLS = [
  {
    id: "tangible",
    symbol: "T1",
    title: "可感知 (Tangible)",
    desc: "數據狀態即時可視化，確保揭露指標不再是抽象數字。",
    icon: Eye,
    color: "bg-blue-500",
    glow: "shadow-blue-500/40"
  },
  {
    id: "traceable",
    symbol: "T2",
    title: "可溯源 (Traceable)",
    desc: "每筆數據皆有完整來源鏈，從 ERP 到雲端存證節點一目了然。",
    icon: Search,
    color: "bg-emerald-500",
    glow: "shadow-emerald-500/40"
  },
  {
    id: "trackable",
    symbol: "T3",
    title: "可追蹤 (Trackable)",
    desc: "完整保存數據修改歷程，任何異動皆由 AI 自動記錄並生成對應憑證。",
    icon: History,
    color: "bg-sky-500",
    glow: "shadow-sky-500/40"
  },
  {
    id: "transparent",
    symbol: "T4",
    title: "透明 (Transparent)",
    desc: "開放查驗但不洩露隱私，對接國際標準指標集（如 GRI, SASB）。",
    icon: Zap,
    color: "bg-amber-500",
    glow: "shadow-amber-500/40"
  },
  {
    id: "trustworthy",
    symbol: "T5",
    title: "不可篡改 (Trustworthy)",
    desc: "基於 Hash Lock 與時間戳技術，確保數據一旦寫入即具備法律證據力。",
    icon: Lock,
    color: "bg-rose-500",
    glow: "shadow-rose-500/40"
  },
];

export function OmniProtocolShowcase() {
  return (
    <div className="space-y-12 py-10 font-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          <ShieldCheck className="w-3 h-3" />
          5T 誠信協議 + ZKP 安全治理體系
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          如何保障您的數據真實與隱私？
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium">
          ESG GO 平台將每一筆輸入的數據依次通過「五道協議門」，並透過零知識證明 (ZKP) 技術，在不揭露供應商機密的前提下，完成合規驗證。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {/* Connection Line */}
        <div className="absolute top-10 left-0 w-full h-0.5 bg-slate-100 hidden md:block z-0" />
        
        {PROTOCOLS.map((protocol, idx) => (
          <motion.div
            key={protocol.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center group"
          >
            <div className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 transition-all duration-500 group-hover:scale-110 shadow-2xl",
              protocol.color,
              protocol.glow
            )}>
              <protocol.icon className="w-10 h-10" />
            </div>
            
            <div className="text-center space-y-2 px-2 relative h-16">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{protocol.symbol} Gate</div>
              <h3 className="text-sm font-black text-slate-800">{protocol.title}</h3>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-slate-900 text-white text-[10px] p-3 rounded-xl shadow-xl leading-relaxed font-bold">
                  {protocol.desc}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-b-slate-900" />
              </div>
            </div>

            {idx < PROTOCOLS.length - 1 && (
              <div className="mt-4 md:absolute md:top-10 md:-right-4 md:-translate-y-1/2 text-slate-300 hidden md:block">
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <Fingerprint className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">零知識證明 (ZKP) 隱私遮罩</h3>
                <p className="text-emerald-400 text-sm font-black uppercase tracking-widest mt-1">Zero-Knowledge Proofs</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/70 leading-relaxed font-medium">
                在傳統審計中，您必須提交完整的原始單據（如採購發票、供應商名錄）。但在 ESG GO 中，系統僅會生成一個「證明 (Proof)」。
              </p>
              
              <ul className="space-y-4">
                {[
                  "證明您具備該筆數據，但無需透露數據細節 (Privacy)",
                  "證明數據符合 GRI 揭露門檻，但隱藏計算邏輯 (Compliance)",
                  "外部確信師僅需查驗「證明指紋」，即可完成核實 (Auditability)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                    <span className="text-sm font-bold text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">下圖：數據流向安全示意</div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
            </div>
            
            <div className="aspect-video bg-black/40 rounded-3xl flex items-center justify-center relative overflow-hidden group">
               {/* Animated visualization of ZKP */}
               <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/5 to-transparent" />
               <div className="relative z-10 flex items-center gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                      <Database className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div className="text-[9px] font-black opacity-40 uppercase">企業原始數據</div>
                  </div>
                  <motion.div 
                    animate={{ x: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-emerald-500"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-[10px] font-black">ZKP Prover</div>
                  </div>
                  <motion.div 
                    animate={{ x: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    className="text-emerald-500"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto border border-emerald-400/20">
                      <ShieldCheck className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div className="text-[9px] font-black opacity-40 uppercase">合規證明 (Proof)</div>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl flex items-center gap-4">
               <AlertTriangle className="w-6 h-6 text-amber-400" />
               <div className="text-[10px] font-bold text-white/60 leading-tight">
                 提示：所有 ZKP 證明皆存儲於 5T Audit Vault 中，不可逆轉、不可篡改。
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
