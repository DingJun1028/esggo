import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
  knowledgeSanctuaryService,
  BenchmarkDeconstruction,
} from '../../services/KnowledgeSanctuaryService';
import { useLocalization } from '../../contexts/LocalizationContext';

const KnowledgeSanctuary: React.FC = () => {
  const { t } = useLocalization();
  const [benchmarks, setBenchmarks] = useState<BenchmarkDeconstruction[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkDeconstruction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await knowledgeSanctuaryService.getTop10Deconstructions();
        setBenchmarks(data);
        if (data.length > 0) setSelectedBenchmark(data[0] || null);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[KnowledgeSanctuary] Failed to fetch benchmarks', { error })
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCapture = async (benchmark: BenchmarkDeconstruction) => {
    // One-click capture to task logic
    try {
      const task = await knowledgeSanctuaryService.convertToTask(benchmark.id);
      omniLogger.info(LogCategory.SYSTEM, '[KnowledgeSanctuary] Benchmark captured as task:', task);
      alert(`已成功將「${benchmark.company}」典範擷取至 Omni-Task Matrix`);
    } catch (error) {
      alert('擷取失敗');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );

  return (
    <div className="p-8 bg-slate-900/50 backdrop-blur-3xl min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-white tracking-widest uppercase">
            知識聖殿 <span className="text-cyan-400">Knowledge Sanctuary</span>
          </h2>
          <p className="text-slate-400 mt-2 text-lg">拆解全球永續典範，轉化為您企業的成長動能。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* List Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                典範閱覽室 <span className="text-cyan-500/50">Benchmarks</span>
              </h3>
              <div className="text-[10px] font-mono text-cyan-500/50">LATEST_V12</div>
            </div>
            {benchmarks.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(6, 182, 212, 0.08)' }}
                onClick={() => setSelectedBenchmark(b)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all duration-500 ${
                  selectedBenchmark?.id === b.id
                    ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 shadow-lg'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-black text-sm uppercase tracking-widest ${selectedBenchmark?.id === b.id ? 'text-cyan-400' : 'text-slate-200'}`}
                  >
                    {b.company}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500/50 transition-colors">
                    {b.year}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed uppercase tracking-wider font-bold">
                  {b.contextAnalysis.substring(0, 60)}...
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detail Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedBenchmark && (
                <motion.div
                  key={selectedBenchmark.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  className="bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
                >
                  {/* Abstract Background Element */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 to-transparent blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-2">
                          Detailed Reconstruction
                        </div>
                        <h4 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                          {selectedBenchmark.company}
                        </h4>
                        <div className="flex gap-3 mt-4">
                          <span className="px-4 py-1.5 bg-black/40 text-cyan-400 text-[9px] font-black rounded-xl border border-cyan-500/30 tracking-widest uppercase">
                            Global Exemplar
                          </span>
                          <span className="px-4 py-1.5 bg-black/40 text-emerald-400 text-[9px] font-black rounded-xl border border-emerald-500/30 tracking-widest uppercase">
                            {selectedBenchmark.notableMetric.label}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCapture(selectedBenchmark)}
                        className="group relative px-8 py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl overflow-hidden transition-all shadow-xl"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                        <span className="relative z-10 uppercase tracking-widest text-[11px]">
                          一鍵擷取典範至任務
                        </span>
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                          寫作脈絡與敘事手法 (Analysis)
                        </h5>
                        <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/30">
                          <p className="text-slate-300 leading-relaxed italic">
                            "{selectedBenchmark.contextAnalysis}"
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                            視覺化與表達 (Visualization)
                          </h5>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {selectedBenchmark.visualizationTechnique}
                          </p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
                          <div className="text-[10px] text-cyan-400 font-black mb-1">
                            關鍵揭露亮點
                          </div>
                          <div className="text-2xl font-black text-white">
                            {selectedBenchmark.notableMetric.value}
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            {selectedBenchmark.notableMetric.logic}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-700/50">
                      <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
                        4+1 協議對標認證 (Protocol Compliance)
                      </h5>
                      <div className="flex gap-4">
                        {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map(
                          t => (
                            <div key={t} className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
                                <span className="text-[10px] font-black">{t.charAt(0)}</span>
                              </div>
                              <span className="text-[9px] text-slate-500 uppercase tracking-tighter">
                                {t}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSanctuary;
