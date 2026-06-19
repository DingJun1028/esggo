import React from 'react';
import { Upload, FileText, CheckCircle, Activity, Lock, ScanLine, ArrowRight } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { OmniTaskMatrix } from './OmniTaskMatrix';
import { EcosystemNodes } from './EcosystemNodes';
import { TrendPrediction } from './TrendPrediction';

// --- Constants ---
const SPAN_3 = 3;
const SPAN_4 = 4;
const SPAN_5 = 5;
const SPAN_6 = 6;
const ITEM_LIMIT = 5;

// --- Sub-Components wrapped in BentoCard contents ---

const SmartCaptureContent = React.memo(({ onUpload }: { onUpload: (file: File) => void }) => (
  <div className="flex flex-col items-center justify-center h-full relative group cursor-pointer p-4">
    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
    <ScanLine className="w-12 h-12 text-primary mb-4 animate-pulse-slow" />
    <h3 className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-2">OCR 智慧採集</h3>
    <p className="text-slate-500 text-xs text-center max-w-[200px]">
      將發票或證書拖放到此處。
      <br />
      [支援格式：PDF, JPG, PNG]
    </p>
    <div className="mt-8 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
      <Upload className="w-4 h-4 text-primary" />
      <span className="text-[10px] text-primary font-black uppercase tracking-wider">開始掃描</span>
    </div>
  </div>
));

const AssetStatusContent = React.memo(
  ({ carbonCredits, entropyEfficiency }: { carbonCredits: number; entropyEfficiency: number }) => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold">碳信用額總計</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {carbonCredits.toLocaleString()}
          </p>
        </div>
        <div className="self-end px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded text-[10px] font-bold">
          TALLYABLE
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 border-l-4 border-emerald-500 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-2 right-2">
          <Activity className="text-emerald-500 w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            負熵降減效率
          </h3>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
            {entropyEfficiency}%
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
          所有排放皆可追溯至範疇 1 與 2 (4T驗證)。
        </p>
      </div>
    </div>
  )
);

const VerificationConsoleContent = React.memo(() => (
  <div className="h-full flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">4T 驗證控制台</h3>
      <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 rounded">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        <span className="text-[9px] text-primary font-bold uppercase">Ready</span>
      </div>
    </div>

    <div className="space-y-4 flex-1">
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
        <div className="p-2 bg-emerald-500/20 rounded text-emerald-500">
          <FileText size={16} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-slate-400 uppercase">輸入來源</p>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-mono">
            invoice_2026_jan.pdf
          </p>
        </div>
        <CheckCircle className="text-emerald-500 w-4 h-4" />
      </div>

      <div className="flex items-center gap-2 text-slate-400 justify-center">
        <ArrowRight size={14} className="rotate-90" />
      </div>

      <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
        <p className="text-[9px] text-primary uppercase mb-2">提取數據</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-400">用電量</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white font-mono">
              1,240 <span className="text-xs text-slate-500">kWh</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">碳值</p>
            <p className="text-lg font-bold text-primary font-mono">
              0.618 <span className="text-xs text-primary/50">tCO2e</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <button className="mt-4 w-full py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
      執行雜湊鎖定
    </button>
  </div>
));

// Main Dashboard Component
const CarbonBentoDashboard: React.FC = () => {
  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#050505] p-6 text-slate-800 dark:text-slate-200 font-sans overflow-hidden flex flex-col">
      {/* Header / Nav */}
      <div className="flex justify-between items-center mb-6 h-[40px] shrink-0">
        <h1 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter flex items-center gap-2">
          <span className="text-primary">ESGss</span> CarbonVault
        </h1>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-mono text-slate-600 dark:text-slate-400">
            UUID: SESSION-2026-X99
          </div>
        </div>
      </div>

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 grid-rows-12 gap-4 flex-1 min-h-0">
        {/* A. Smart Capture (OCR) - Top Left */}
        <BentoCard
          title="OCR 智慧採集 (OCR Smart Capture)"
          gridSpan={4}
          className="row-span-6"
          icon={<ScanLine size={20} />}
        >
          <SmartCaptureContent onUpload={() => {}} />
        </BentoCard>

        {/* B. Asset Status - Top Right */}
        <BentoCard
          title="碳資產狀態 (Carbon Asset Status)"
          gridSpan={8}
          className="row-span-4"
          icon={<Activity size={20} />}
        >
          <AssetStatusContent carbonCredits={8850} entropyEfficiency={94.2} />
        </BentoCard>

        {/* E. Lock Indicator (moved to fit grid) */}
        <BentoCard
          title="系統安全 (System Security)"
          gridSpan={4}
          className="row-span-2"
          status="error"
          icon={<Lock size={20} />}
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                不可篡改 (TAMPER-PROOF)
              </p>
              <p className="text-xs text-slate-500">寫入已凍結 (Writes Frozen)</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
              <Lock size={16} />
            </div>
          </div>
        </BentoCard>

        {/* C. Data Log (Bottom Left) */}
        <BentoCard
          title="實時數據流 (Real-time Data Stream)"
          gridSpan={4} // Expanded from 3 to 4 for balance
          className="row-span-6"
          icon={<Activity size={20} />}
        >
          <div className="space-y-3 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    HASH_LOCK_GENERATED
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono break-all">0x8F3A...2B1C</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">UUID: LOG-{100 + i}</p>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* D. Verification Console (Center Bottom) */}
        <BentoCard
          title="驗證控制台 (Verification Console)"
          gridSpan={4} // Adjusted grid
          className="row-span-6"
          icon={<CheckCircle size={20} />}
        >
          <VerificationConsoleContent />
        </BentoCard>

        {/* F. Trend Prediction (Right Bottom) */}
        <div className="col-span-4 row-span-8 grid grid-rows-2 gap-4">
          {/* Split the remaining space */}
          <BentoCard title="生態節點 Ecosystem Nodes" gridSpan={1} className="row-span-1 h-full">
            <EcosystemNodes />
          </BentoCard>
          <BentoCard title="趨勢預測 Trend Prediction" gridSpan={1} className="row-span-1 h-full">
            <TrendPrediction />
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

export default CarbonBentoDashboard;
