import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ExternalLink, Activity, Clock } from 'lucide-react';
import { OmniBoundary, OmniLabel } from '../ui';
import { sustainabilityObserver, ESGNewsItem } from '../../services/SustainabilityObserverService';

/**
 * 📰 新聞聚合視窗 / News Aggregation View
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 展示偵測到的全球 ESG 新聞，提供即時影響力評分與語義標籤。
 * [EN] Displays detected global ESG news, providing real-time impact
 *      scores and semantic tags.
 */

export const NewsAggregationView: React.FC = memo(() => {
  const [news, setNews] = useState<ESGNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await sustainabilityObserver.fetchLatestNews();
        setNews(data);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <OmniBoundary title="Global ESG Feed" status={loading ? 'SYNCING' : 'READY'}>
      <div className="flex flex-col h-[400px]">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Live Impact Stream
            </span>
          </div>
          <Clock size={12} className="text-slate-600" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {news.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-[8px] font-bold text-cyan-400 uppercase">
                        {item.source}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[8px] px-1 border border-white/5 text-slate-600 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </OmniBoundary>
  );
});

NewsAggregationView.displayName = 'NewsAggregationView';
