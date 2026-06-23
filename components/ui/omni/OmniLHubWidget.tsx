'use client';

import { OmniComponentHeart } from '@esggo/types';
import React, { useState, useEffect } from 'react';

import { Sparkles, Terminal, Cpu } from 'lucide-react';
import { OmniBaseCard } from './OmniBaseCard';
import { Card } from '@/components/ui/v2/Card';

interface OmniLHubWidgetProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  title?: string;
  insights: string[];
  isProcessing?: boolean;
}

export const OmniLHubWidget: React.FC<OmniLHubWidgetProps> = ({
  title = 'L-Hub Swarm Intelligence',
  insights,
  isProcessing = false,
}) => {
  const [displayedInsights, setDisplayedInsights] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setDisplayedInsights([]);
      setCurrentIndex(0);
      return undefined;
    }

    if (currentIndex < insights.length) {
      const timer = setTimeout(() => {
        setDisplayedInsights((prev) => [...prev, insights[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 1000); // 模擬每條洞察需要 1 秒鐘的處理時間
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentIndex, insights, isProcessing]);

  return (
    <Card
      variant="glass"
      className="relative overflow-hidden border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-black/40 p-6"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />

      <div className="flex items-center justify-between mb-6 relative z-10 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
            <Cpu className="text-cyan-400" size={18} />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wide flex items-center gap-2">{title}</h3>
            <p className="text-xs text-cyan-400/70 font-mono tracking-widest uppercase mt-1">
              Multi-Agent Consensus
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="text-xs font-mono">Processing</span>
            <div className="flex gap-1">
              <span
                className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 relative z-10 font-mono text-sm">
        
          {displayedInsights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 text-slate-300"
            >
              <Terminal size={14} className="text-cyan-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">{insight}</span>
            </div>
          ))}
        

        {isProcessing && (
          <div
            className="flex items-center gap-3 text-cyan-500/50"
          >
            <Sparkles size={14} className="animate-spin" />
            <span>Analyzing evidence vault data...</span>
          </div>
        )}
      </div>
    </Card>
  );
};
