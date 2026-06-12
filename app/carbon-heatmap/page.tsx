'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, UploadCloud, ShieldCheck, FileSpreadsheet, Activity, AlertTriangle } from 'lucide-react';

export default function CarbonHeatmapPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = () => {
    setIsUploading(true);
    
    // 模擬上傳與 OmniMatrix 解式、策式分析
    setTimeout(() => {
      setIsUploading(false);
      setAnalyzing(true);
      
      setTimeout(() => {
        setAnalyzing(false);
        setResult({
          totalEmissions: '14,205.4',
          unit: 'tCO2e',
          anomalies: [
            { id: 1, facility: '高雄一廠 (Kh-01)', scope: 'Scope 2', issue: '用電量環比暴增 340%', status: '需盤查' },
            { id: 2, facility: '供應商 (Vendor-A)', scope: 'Scope 3', issue: '數據格式錯亂 (已由 OmniJules 修復)', status: '已修復' }
          ],
          recommendation: '建議針對高雄一廠的冷卻水塔耗電進行設備巡檢，並由 OmniNexus 啟動供應商資料重新對齊程序。'
        });
      }, 2500);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-6"
        >
          <Flame size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">Carbon Heatmap Matrix</span>
        </motion.div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-orange-300 to-rose-300 mb-4 tracking-tight">
          碳排熱點智能解析
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          將供應商或各廠區的原始混亂數據上傳，OmniMatrix 將自動執行「解式」對齊，並精準抓出碳排異常熱點。
        </p>
      </div>

      {!result && !analyzing && !isUploading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div 
            onClick={handleUpload}
            className="border-2 border-dashed border-rose-500/30 bg-[#020617]/50 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-rose-400/60 hover:bg-rose-500/5 transition-all group"
          >
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud size={40} className="text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">上傳碳排數據源 (Excel/CSV)</h3>
            <p className="text-slate-400 text-sm">支援所有混亂格式，AI 自動清洗與對齊</p>
          </div>
        </motion.div>
      )}

      {(isUploading || analyzing) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto text-center py-20"
        >
          <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-t-2 border-rose-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-orange-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            <Activity size={40} className="text-rose-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isUploading ? '正在上傳與抽取數據...' : 'OmniMatrix 策式分析中...'}
          </h3>
          <p className="text-slate-400 text-sm">
            {isUploading ? '加密傳輸中，遵守 5T 安全協議' : '尋找異常熱點並啟動 Karma 數據修復...'}
          </p>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#020617]/60 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <p className="text-rose-400 font-bold uppercase tracking-widest text-sm mb-2">總計碳排估算</p>
              <div className="text-5xl font-black text-white mb-2">
                {result.totalEmissions} <span className="text-xl text-slate-500 font-normal">{result.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm mt-4">
                <ShieldCheck size={16} /> 數據已完成 5T 封印驗證
              </div>
            </div>

            <div className="bg-[#020617]/60 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8">
              <p className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-4">智庫綜合建議 (策式)</p>
              <p className="text-slate-300 leading-relaxed font-medium">
                {result.recommendation}
              </p>
            </div>
          </div>

          <div className="bg-[#020617]/40 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <AlertTriangle className="text-amber-400" size={24} />
              <h3 className="text-xl font-bold text-white">發現異常熱點 ({result.anomalies.length})</h3>
            </div>
            <div className="divide-y divide-white/5">
              {result.anomalies.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                      <FileSpreadsheet size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.facility}</h4>
                      <p className="text-sm text-slate-400">{item.scope} · {item.issue}</p>
                    </div>
                  </div>
                  <div>
                    {item.status === '已修復' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wider">
                        JULES {item.status}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold tracking-wider">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center pt-6">
            <button 
              onClick={() => setResult(null)}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              重新上傳另一份數據
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
