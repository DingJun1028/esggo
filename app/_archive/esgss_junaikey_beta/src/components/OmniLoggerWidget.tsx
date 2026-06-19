import React, { memo, useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Bot,
  StickyNote,
  Sparkles,
  Activity,
  Loader2,
} from 'lucide-react';
import { omniLogger } from '@/services/omniLogger';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { ImpactCertificate } from './dashboard/ImpactCertificate';
import { LocalizationMatrix } from './debug/LocalizationMatrix';
import { motion } from 'framer-motion';

// ⚡ Bolt Optimization: Lazy load the heavy Log Viewer to reduce initial bundle size.
// It is only loaded when the user actually opens the log viewer modal.
const OmniLogViewer = lazy(() =>
  import('./OmniLogViewer').then(module => ({ default: module.OmniLogViewer }))
);

const TEXT = {
  LOGGER_TITLE: '全知系統助教 (Omni Assistant)',
  TAB_MONITOR: '即時監控',
  TAB_NOTE: '助手洞察',
  AI_INSIGHTS: 'AI 智慧 Qi 數據洞察',
  PREVIEW_TOOLS: '預覽工具 (Preview Mode)',
  BTN_LOG_VIEWER: '打開系統日誌',
  BTN_IMPACT_CERT: '影響力證書',
  BTN_MATRIX: '自主通典 (Matrix)',
  PLACEHOLDER_NOTE: '紀錄您的靈感與反思...',
};

export const OmniLoggerWidget = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'note'>('monitor');
  const [previewTarget, setPreviewTarget] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [logStats, setLogStats] = useState(omniLogger.getStats());

  // 📡 Connect to Real-time Qi Data
  const REFRESH_INTERVAL_MS = 3000;
  const metrics = useSystemMetrics(REFRESH_INTERVAL_MS);

  // ⚡ Bolt Optimization: Use subscription instead of polling to reduce main thread overhead
  useEffect(() => {
    // Throttle update to avoid UI thrashing
    let lastUpdate = 0;
    const THROTTLE_MS = 1000;
    let timeoutId: NodeJS.Timeout;

    const handleUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_MS) {
        setLogStats(omniLogger.getStats());
        lastUpdate = now;
      } else {
        // Ensure the trailing update happens
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setLogStats(omniLogger.getStats());
          lastUpdate = Date.now();
        }, THROTTLE_MS - (now - lastUpdate));
      }
    };

    const unsubscribe = omniLogger.subscribe(handleUpdate);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // ⚡ Constants for Qi Data Thresholds
  const LATENCY_THRESHOLD_MS = 150;
  const CACHE_HIT_THRESHOLD_PCT = 80;
  const THROUGHPUT_THRESHOLD_GBS = 2.0;
  const INSIGHTS_LIMIT = 4;

  // 🧠 Derived Insights from Qi Data (useMemo avoids cascading renders)
  const insights = useMemo(() => {
    const list = [
      '💡 系統正處於平衡狀態，準備進行深度掃描。',
      '🎯 全知座標已對齊全球主要基準文件。',
    ];

    if (metrics.latency > LATENCY_THRESHOLD_MS)
      list.unshift('⚠️ 偵測到網路延遲波動，建議檢查 API 閾值。');
    if (metrics.cacheHitRate > CACHE_HIT_THRESHOLD_PCT)
      list.unshift('🚀 MCP 快取命中率極佳，系統運行流暢。');
    if (metrics.throughput > THROUGHPUT_THRESHOLD_GBS)
      list.unshift('🔥 數據吞吐量處於高峰期，正在優化分片分發。');
    if (logStats.errors > 0) list.unshift(`⚡ 偵測到 ${logStats.errors} 個運行異常，已自動隔離。`);

    return list.slice(0, INSIGHTS_LIMIT);
  }, [metrics.latency, metrics.cacheHitRate, metrics.throughput, logStats.errors]);

  // Optional: Auto-expand note tab if there are urgent insights (simulated)
  useEffect(() => {
    // Could open on mount or event
  }, []);

  return (
    <>
      {/* Floating Widget - Draggable Container */}
      {/* Uses motion.div for seamless dragging interaction */}
      <motion.div
        className="fixed z-50 flex flex-col items-end gap-2"
        initial={{ bottom: 24, right: 24 }} // Initial position (bottom-6 right-6)
        drag
        dragMomentum={true}
        dragElastic={0.1} // Adds a slight elastic feel when hitting boundaries
        dragConstraints={{
          left: -window.innerWidth + 100,
          right: 0,
          top: -window.innerHeight + 100,
          bottom: 0,
        }}
        whileDrag={{ cursor: 'grabbing', scale: 1.05 }}
        whileHover={{ cursor: 'grab' }}
        style={{ touchAction: 'none' }} // Prevents browser scrolling while dragging
      >
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="w-80 bg-neutral-900/90 border border-[#00FFFF]/30 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden animate-in slide-in-from-right-10 fade-in duration-300">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
              <button
                // Prevent drag propagation on interactive elements
                onPointerDown={e => e.stopPropagation()}
                onClick={() => setActiveTab('monitor')}
                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'monitor' ? 'bg-[#00FFFF]/10 text-[#00FFFF]' : 'text-gray-400 hover:text-white'}`}
              >
                <Activity size={14} />
                {TEXT.TAB_MONITOR}
              </button>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={() => setActiveTab('note')}
                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'note' ? 'bg-[#00FFFF]/10 text-[#00FFFF]' : 'text-gray-400 hover:text-white'}`}
              >
                <Bot size={14} />
                {TEXT.TAB_NOTE}
              </button>
            </div>

            {/* Content Area */}
            {/* Stop propagation for all inner interactions to prevent accidental drags */}
            <div
              className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto cursor-auto"
              onPointerDown={e => e.stopPropagation()}
            >
              {/* MONITOR TAB */}
              {activeTab === 'monitor' && (
                <div className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                      <div className="text-gray-500">延遲 (Latency)</div>
                      <div className="text-[#00FFFF] font-bold text-lg">{metrics.latency}ms</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                      <div className="text-gray-500">吞吐量 (Throughput)</div>
                      <div className="text-emerald-400 font-bold text-lg">
                        {metrics.throughput.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                      <div className="text-gray-500">快取命中 (Cache)</div>
                      <div className="text-amber-400 font-bold text-lg">
                        {metrics.cacheHitRate}%
                      </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                      <div className="text-gray-500">錯誤 (Errors)</div>
                      <div className="text-rose-400 font-bold text-lg">{logStats.errors}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full py-2 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 border border-[#00FFFF]/30 rounded text-[#00FFFF] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Bug size={14} />
                    {TEXT.BTN_LOG_VIEWER}
                  </button>

                  {/* Preview Tools */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-mono">
                      {TEXT.PREVIEW_TOOLS}
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => setPreviewTarget('impactCrypto')}
                        className="w-full px-3 py-1.5 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 border border-[#00FFFF]/30 rounded text-[#00FFFF] text-xs font-mono transition-colors text-left flex items-center gap-2"
                      >
                        <span>📄</span> {TEXT.BTN_IMPACT_CERT}
                      </button>
                      <button
                        onClick={() => setPreviewTarget('matrix-view')}
                        className="w-full px-3 py-1.5 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 border border-[#00FFFF]/30 rounded text-[#00FFFF] text-xs font-mono transition-colors text-left flex items-center gap-2"
                      >
                        <span>📜</span> {TEXT.BTN_MATRIX}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTE TAB */}
              {activeTab === 'note' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#00FFFF] mb-2">
                    <Sparkles size={16} className="animate-pulse" />
                    <span className="font-semibold">{TEXT.AI_INSIGHTS}</span>
                  </div>

                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer text-xs text-gray-200 leading-relaxed"
                    >
                      {insight}
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <textarea
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                      placeholder={TEXT.PLACEHOLDER_NOTE}
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFFF] transition-colors resize-none h-24"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Floating Toggle Button */}
        {/* Drag Handle primarily acts on this button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-[#00FFFF]/20 hover:bg-[#00FFFF]/30 border border-[#00FFFF]/50 text-[#00FFFF] p-4 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] flex items-center justify-center backdrop-blur-md"
          title={TEXT.LOGGER_TITLE}
        >
          {activeTab === 'note' && isExpanded ? (
            <Bot size={24} className="animate-bounce text-[#00FFFF]" />
          ) : (
            <Activity size={24} />
          )}

          {/* Badge for Errors */}
          {logStats.errors > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse font-bold border border-black">
              {logStats.errors}
            </span>
          )}

          {/* Badge for Insights (Active Connection Indicator) */}
          {!isExpanded && (
            <span className="absolute -top-1 -left-1 bg-emerald-500 text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-black font-bold animate-pulse">
              Qi
            </span>
          )}
        </button>
      </motion.div>

      {/* Full Log Viewer Modal (Lazy Loaded) */}
      {isOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#00FFFF] animate-spin" />
                <span className="text-[#00FFFF] text-xs font-mono">Loading Log Viewer...</span>
              </div>
            </div>
          }
        >
          <OmniLogViewer onClose={() => setIsOpen(false)} />
        </Suspense>
      )}

      {/* Impact Certificate Preview Modal */}
      {previewTarget === 'impactCrypto' && (
        <ImpactCertificate
          missionTitle="ESG-APAC-2026 Strategic Optimization"
          xpGained={1250}
          impactGained={850}
          synergy={2.4}
          onClose={() => setPreviewTarget(null)}
        />
      )}

      {/* Localization Matrix Modal */}
      {previewTarget === 'matrix-view' && (
        <LocalizationMatrix onClose={() => setPreviewTarget(null)} />
      )}
    </>
  );
});
OmniLoggerWidget.displayName = 'OmniLoggerWidget';
