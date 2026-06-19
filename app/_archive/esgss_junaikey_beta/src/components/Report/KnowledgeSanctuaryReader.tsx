import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Layout,
  Clock,
  Search,
  Bookmark,
  Target,
} from 'lucide-react';
import {
  knowledgeSanctuaryService,
  BenchmarkDeconstruction,
  EnterpriseYearbook,
} from '@/services/KnowledgeSanctuaryService';

export const KnowledgeSanctuaryReader: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkDeconstruction[]>([]);
  const [yearbooks, setYearbooks] = useState<EnterpriseYearbook[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkDeconstruction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const b = await knowledgeSanctuaryService.getTop10Deconstructions();
      const y = await knowledgeSanctuaryService.get7YearYearbook();
      setBenchmarks(b);
      setYearbooks(y);
    };
    loadData();
  }, []);

  const handleConvertToTask = async (id: string) => {
    const task = await knowledgeSanctuaryService.convertToTask(id);
    alert(`已成功擷取典範！建立新任務：「${task.title}」`);
    // In a real app, this would dispatch to a task manager
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                永續智慧聖殿 (Knowledge Sanctuary)
              </h2>
              <p className="text-xs text-slate-400">全球典範閱覽室與美台 Top 10 深度解構</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="搜尋典範企業、指標或手法..."
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Split */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Top 10 Benchmarks */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
              美台 Top 10 深度解構
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarks
              .filter(b => b.company.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(b => (
                <motion.div
                  key={b.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedBenchmark(b)}
                  className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded uppercase">
                      {b.company}
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-600 group-hover:text-emerald-400 transition-colors"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mb-2">
                    {b.notableMetric.label}: {b.notableMetric.value}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {b.contextAnalysis}
                  </p>
                </motion.div>
              ))}
          </div>
        </section>

        {/* 7 Year Yearbook */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
              全台 7 年企業年鑑趨勢
            </h3>
          </div>
          <div className="space-y-3">
            {yearbooks.map(y => (
              <div
                key={y.year}
                className="flex gap-4 p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50"
              >
                <div className="text-lg font-black text-slate-600">{y.year}</div>
                <div className="flex-1">
                  <p className="text-xs text-slate-300 mb-2">{y.trendSummary}</p>
                  <div className="flex flex-wrap gap-2">
                    {y.keyPivotPoints.map((p, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Benchmark Detail Overlay */}
      <AnimatePresence>
        {selectedBenchmark && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute inset-0 bg-slate-950 z-20 flex flex-col p-8"
          >
            <button
              onClick={() => setSelectedBenchmark(null)}
              className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>

            <div className="mb-8">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mb-2 block">
                Benchmark Deconstruction • {selectedBenchmark.year}
              </span>
              <h3 className="text-3xl font-black text-white">{selectedBenchmark.company}</h3>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  脈絡分析 (Context Analysis)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  {selectedBenchmark.contextAnalysis}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  視覺化手法 (Technique)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  {selectedBenchmark.visualizationTechnique}
                </p>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                  標竿指標 (Notable Metric)
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    {selectedBenchmark.notableMetric.label}
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {selectedBenchmark.notableMetric.value}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">
                  邏輯：{selectedBenchmark.notableMetric.logic}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleConvertToTask(selectedBenchmark.id)}
              className="mt-8 w-full py-4 bg-emerald-500 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 group"
            >
              <Target size={18} />
              一鍵擷取至我的任務 (One-Click to Task)
              <div className="ml-2 px-2 py-0.5 bg-slate-950/20 rounded text-[10px]">
                Min. Effort
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
