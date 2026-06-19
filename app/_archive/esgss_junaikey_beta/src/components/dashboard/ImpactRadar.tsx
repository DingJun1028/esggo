import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Zap, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { OmniBoundary, OmniIndicator, OmniLabel } from '../ui';
import { sustainabilityObserver, ESGNewsItem } from '../../services/SustainabilityObserverService';

/**
 * 🛰️ 衝擊雷達 / Impact Radar
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 脈衝式偵測波紋 UI，動態展示全球事件對 ESG 指標的即時衝擊。
 * [EN] Pulse-wave detection UI, dynamically displaying real-time impact
 *      of global events on ESG metrics.
 */

export const ImpactRadar: React.FC = memo(() => {
  const [news, setNews] = useState<ESGNewsItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      const data = await sustainabilityObserver.fetchLatestNews();
      setNews(data);
    };
    loadNews();
  }, []);

  const activeNews = news[activeIndex];

  return (
    <OmniBoundary title="Impact Radar" status={news.length > 0 ? 'READY' : 'SYNCING'}>
      <div className="relative h-64 flex flex-col items-center justify-center overflow-hidden">
        {/* Pulse Waves Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map(id => (
            <motion.div
              key={id}
              className="absolute border border-cyan-500/30 rounded-full"
              initial={{ width: 0, height: 0, opacity: 0.5 }}
              animate={{
                width: ['0%', '150%'],
                height: ['0%', '150%'],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: id * 1.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* Central Core */}
        <div className="z-10 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.2)] text-center max-w-[80%]">
          <AnimatePresence mode="wait">
            {activeNews ? (
              <motion.div
                key={activeNews.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center gap-2">
                  <OmniLabel term="Resonance" size="sm" className="text-cyan-400" />
                  <span className="text-[10px] text-slate-500 font-mono">{activeNews.source}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                  {activeNews.title}
                </h3>
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    {activeNews.impactScore > 0 ? (
                      <TrendingUp size={14} className="text-green-400" />
                    ) : (
                      <TrendingDown size={14} className="text-red-400" />
                    )}
                    <span
                      className={`text-xs font-black ${activeNews.impactScore > 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {(activeNews.impactScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <OmniIndicator type="ENVIRONMENTAL" level={Math.abs(activeNews.impactScore)} />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Radar className="text-slate-600 animate-spin-slow" size={32} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Scanning Global Grid...
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 flex gap-1.5 z-20">
          {news.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeIndex ? 'bg-cyan-400 w-4' : 'bg-slate-700'}`}
              aria-label={`Go to news ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </OmniBoundary>
  );
});

ImpactRadar.displayName = 'ImpactRadar';
