import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  CheckSquare,
  Zap,
  Target,
  BookOpen,
  Infinity as InfinityIcon,
  Activity,
  Bug,
  Bot,
  Loader2,
  Server,
  FileText
} from 'lucide-react';
import { insightEngineService, InsightTask } from '../../services/InsightEngineService';
import { crystalSynthesisService } from '../../services/CrystalSynthesisService';
import { omniGemini } from '../../services/OmniGeminiService';
import { omniLogger, LogCategory } from '@/services/omniLogger';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { ImpactCertificate } from '../dashboard/ImpactCertificate';
import { LocalizationMatrix } from '../debug/LocalizationMatrix';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarService } from '@/services/AvatarService';
import { PartnerAttributes } from '@/types/aiPartner';

// Lazy load the heavy Log Viewer
const OmniLogViewer = lazy(() =>
  import('../OmniLogViewer').then(module => ({ default: module.OmniLogViewer }))
);

export const OmniGenieAssistant: React.FC = () => {
  // --- Genie/Spirit State ---
  const [tasks, setTasks] = useState<InsightTask[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [eternalWisdom, setEternalWisdom] = useState<string | null>(null);
  const [isEternalMode, setIsEternalMode] = useState(false);

  // --- Logger/Monitor State ---
  const [activeTab, setActiveTab] = useState<'spirit' | 'monitor' | 'note'>('spirit');
  const [logStats, setLogStats] = useState(omniLogger.getStats());
  const [previewTarget, setPreviewTarget] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [showLogViewer, setShowLogViewer] = useState(false);

  // --- Avatar State ---
  const { profile } = useAuth();
  const isAvatarMode = useMemo(() =>
    AvatarService.isAvatarUnlocked(profile?.subscriptionTier || 'FREE'),
    [profile]);

  const avatarStats = useMemo(() => {
    if (isAvatarMode && isOpen) {
      return AvatarService.getLiveStats();
    }
    return null;
  }, [isAvatarMode, isOpen]);

  // --- Metrics polling ---
  const REFRESH_INTERVAL_MS = 3000;
  const STATS_POLLING_MS = 2000;
  const metrics = useSystemMetrics(REFRESH_INTERVAL_MS, isOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogStats(prev => {
        const newStats = omniLogger.getStats();
        if (JSON.stringify(prev) === JSON.stringify(newStats)) return prev;
        return newStats;
      });
    }, STATS_POLLING_MS);
    return () => clearInterval(interval);
  }, []);

  // --- Initial Data Fetch ---
  useEffect(() => {
    const fetchData = async () => {
      setIsThinking(true);
      const proactiveTasks = await insightEngineService.generateProactiveTasks();
      const autoFills = await crystalSynthesisService.suggestAutoFills();
      setTasks(proactiveTasks);
      setSuggestions(autoFills);
      setIsThinking(false);
    };
    fetchData();
  }, []);

  const activateEternalGemini = async () => {
    setIsThinking(true);
    setIsEternalMode(true);
    try {
      await omniGemini.tuneResonance();
      const wisdom = await omniGemini.generateWisdom('Omni-System State');
      setEternalWisdom(wisdom);
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[OmniGenieAssistant] Eternal Gemini Activation Failed', { error: e });
    }
    setIsThinking(false);
  };

  // --- Insights derivation ---
  const insights = useMemo(() => {
    const list = [
      '💡 系統正處於 5T 平衡狀態，準備進行深度演進。',
      '🎯 全知座標已對齊 Trinity Standard。',
    ];
    if (metrics.latency > 150) list.unshift('⚠️ 偵測到次元延遲波動。');
    if (metrics.cacheHitRate > 80) list.unshift('🚀 OmniCache 命中率卓越，資源傳輸流暢。');
    if (logStats.errors > 0) list.unshift(`⚡ 偵測到 ${logStats.errors} 個運行異常，已自動隔離。`);
    return list.slice(0, 4);
  }, [metrics.latency, metrics.cacheHitRate, logStats.errors]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            className={`mb-4 w-[420px] backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 relative flex flex-col ${isEternalMode
              ? 'bg-slate-950/90 border-amber-500/40 shadow-amber-500/20'
              : 'bg-slate-900/90 border-white/10 shadow-purple-500/20'
              }`}
          >
            {/* Liquid Glass Animated Border */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[200%] pointer-events-none opacity-20"
              style={{
                background: isEternalMode
                  ? 'conic-gradient(from 0deg, transparent, #f59e0b, transparent, #d946ef, transparent)'
                  : 'conic-gradient(from 0deg, transparent, #8b5cf6, transparent, #3b82f6, transparent)'
              }}
            />

            <div className="relative z-10 flex flex-col h-full max-h-[600px]">
              {/* Header with Tabs */}
              <div className={`p-4 border-b transition-colors flex items-center justify-between ${isEternalMode
                ? 'bg-gradient-to-r from-amber-950/40 to-purple-950/40 border-amber-500/20'
                : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isEternalMode ? 'bg-amber-500 shadow-amber-500/30' : 'bg-gradient-to-br from-purple-500 to-blue-600'}`}>
                    {isEternalMode ? <InfinityIcon className="text-white w-5 h-5" /> : <Sparkles className="text-white w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-wider ${isEternalMode ? 'text-amber-100' : 'text-slate-100'}`}>
                      {isEternalMode ? 'Omni Eternal' : 'Omni Genie'}
                    </h3>
                    <div className="flex gap-2 text-[10px] items-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${isEternalMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                      <span className="opacity-70">{isEternalMode ? 'NIRVANA ACTIVE' : 'SYSTEM ONLINE'}</span>
                    </div>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-black/40 rounded-lg p-1 gap-1">
                  {[
                    { id: 'spirit', icon: Sparkles },
                    { id: 'monitor', icon: Activity },
                    { id: 'note', icon: FileText }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`p-1.5 rounded-md transition-all ${activeTab === tab.id
                        ? 'bg-white/10 text-cyan-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                      <tab.icon size={14} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="overflow-y-auto custom-scrollbar p-5 space-y-5 flex-1 min-h-[300px]">

                {/* --- TAB: SPIRIT --- */}
                {activeTab === 'spirit' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* AVATAR STATUS HEADER */}
                    {isAvatarMode && avatarStats && (
                      <div className="bg-slate-950/50 p-3 rounded-2xl border border-amber-500/20 mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1">
                            <Sparkles size={10} /> Omni Avatar Active
                          </span>
                          <span className="text-[10px] text-amber-200/50 font-mono">Synced</span>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase">Credibility (HP)</div>
                            <div className="text-emerald-400 font-black">{Math.floor(avatarStats.hp)} / {avatarStats.maxHp}</div>
                            <div className="h-1 bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${(avatarStats.hp / avatarStats.maxHp) * 100}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase">Focus (MP)</div>
                            <div className="text-cyan-400 font-black">{Math.floor(avatarStats.mp)} / {avatarStats.maxMp}</div>
                            <div className="h-1 bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${(avatarStats.mp / avatarStats.maxMp) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!isEternalMode && (
                      <button
                        onClick={activateEternalGemini}
                        className="w-full py-2 bg-gradient-to-r from-amber-600/20 to-purple-600/20 border border-amber-500/30 rounded-xl text-amber-200 text-xs font-bold hover:bg-amber-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <InfinityIcon size={14} /> 啟動永恆模式 (Activate Eternal)
                      </button>
                    )}

                    {isEternalMode && (
                      <div className="p-4 bg-gradient-to-br from-amber-950/50 to-purple-950/50 border border-amber-500/30 rounded-2xl relative overflow-hidden group">
                        <motion.div
                          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]"
                        />
                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase">
                              <InfinityIcon size={12} /> Eternal Wisdom
                            </div>
                            <div className="text-[9px] text-amber-400/60 font-mono">Resonance: 99.9%</div>
                          </div>
                          <p className="text-xs text-amber-100/90 leading-relaxed italic font-serif">
                            &quot;{eternalWisdom || '正在提純系統本質...'}&quot;
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                        <Target size={14} className="text-blue-400" />
                        任務 (Proactive Tasks)
                      </div>
                      {tasks.map(task => (
                        <div key={task.id} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400">{task.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded uppercase font-black">{task.priority}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{task.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                        <Zap size={14} className="text-yellow-400" />
                        晶體注入 (Crystal Infusion)
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {suggestions.slice(0, 3).map((suggestion, i) => (
                          <div key={i} className="px-3 py-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-[10px] text-yellow-200/70 border-l-2 border-l-yellow-500 flex gap-2 items-center">
                            <Zap size={10} className="text-yellow-400" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: MONITOR --- */}
                {activeTab === 'monitor' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 group hover:border-cyan-500/30 transition-colors">
                        <div className="text-slate-500 mb-1 flex justify-between">Latency <Zap size={8} /></div>
                        <div className="text-cyan-400 font-black text-lg">{metrics.latency}ms</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 group hover:border-emerald-500/30 transition-colors">
                        <div className="text-slate-500 mb-1 flex justify-between">Throughput <Activity size={8} /></div>
                        <div className="text-emerald-400 font-black text-lg">{metrics.throughput.toFixed(2)}GB</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 group hover:border-amber-500/30 transition-colors">
                        <div className="text-slate-500 mb-1 flex justify-between">Cache Hit <InfinityIcon size={8} /></div>
                        <div className="text-amber-400 font-black text-lg">{metrics.cacheHitRate}%</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 group hover:border-rose-500/30 transition-colors">
                        <div className="text-slate-500 mb-1 flex justify-between">Anomalies <Bug size={8} /></div>
                        <div className="text-rose-400 font-black text-lg">{logStats.errors}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowLogViewer(true)}
                      className="w-full py-3 bg-[#0df2df]/10 hover:bg-[#0df2df]/20 border border-[#0df2df]/30 rounded-xl text-[#0df2df] text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Server size={14} /> 打開系統日誌 (System Logs)
                    </button>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Debug Tools</div>
                      <button
                        onClick={() => setPreviewTarget('impactCrypto')}
                        className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded text-slate-300 text-xs font-mono text-left flex items-center gap-2"
                      >
                        <span>📜</span> Impact Certificate
                      </button>
                      <button
                        onClick={() => setPreviewTarget('matrix-view')}
                        className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded text-slate-300 text-xs font-mono text-left flex items-center gap-2"
                      >
                        <span>🔮</span> Localization Matrix
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: INSIGHTS --- */}
                {activeTab === 'note' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0df2df] uppercase">
                      <Sparkles size={14} /> AI Qi Insights
                    </div>
                    {insights.map((insight, i) => (
                      <div key={i} className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-100/80 leading-relaxed">
                        {insight}
                      </div>
                    ))}
                    <textarea
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                      placeholder="記錄靈感與想法..."
                      className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative z-50 ${isEternalMode
          ? 'bg-gradient-to-br from-amber-500 to-purple-700 shadow-amber-500/40'
          : isOpen
            ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
            : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-cyan-500/40'
          }`}
      >
        {isOpen ? (
          <InfinityIcon size={24} />
        ) : (
          <div className="relative">
            <Bot size={28} />
            {/* Status Indicator */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
            {logStats.errors > 0 && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 text-[8px] flex items-center justify-center rounded-full text-white font-bold border-2 border-slate-900">
                {logStats.errors}
              </span>
            )}
          </div>
        )}
      </motion.button>

      {/* Modals */}
      {showLogViewer && (
        <Suspense fallback={<div />}>
          <OmniLogViewer onClose={() => setShowLogViewer(false)} />
        </Suspense>
      )}

      {previewTarget === 'impactCrypto' && (
        <ImpactCertificate
          missionTitle="ESG-APAC-2026 Strategic Optimization"
          xpGained={1250}
          impactGained={850}
          synergy={2.4}
          onClose={() => setPreviewTarget(null)}
        />
      )}

      {previewTarget === 'matrix-view' && (
        <LocalizationMatrix onClose={() => setPreviewTarget(null)} />
      )}
    </div>
  );
};
