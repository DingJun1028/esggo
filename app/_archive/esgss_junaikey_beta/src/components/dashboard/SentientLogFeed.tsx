import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';

interface SentientLog {
  id: string;
  timestamp: string;
  source: 'AGENCY' | 'OMNIMIND' | 'UCC_ENGINE' | 'AI_REASONER' | 'SENTINEL';
  type: 'INFO' | 'ACTION' | 'THOUGHT' | 'ALERT' | 'SUCCESS';
  content: string;
  meta?: any;
}

const SentientLogFeed: React.FC = () => {
  const [logs, setLogs] = useState<SentientLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulated sentient log injection
  useEffect(() => {
    const logPool: Partial<SentientLog>[] = [
      {
        source: 'AGENCY',
        type: 'ACTION',
        content: '檢測到心跳脈衝。正在啟動全系統健康掃描。',
      },
      {
        source: 'OMNIMIND',
        type: 'THOUGHT',
        content:
          '正在分析共鳴模式... 穩定性 98.4%。範疇 3 數據中存在潛在熵增。',
      },
      {
        source: 'AI_REASONER',
        type: 'INFO',
        content: '產生遞歸子任務：「校準碳強度指標」。深度：2。',
      },
      {
        source: 'SENTINEL',
        type: 'ALERT',
        content: '「Legacy_Asset_V1」中檢測到數據完整性不匹配。正在嘗試自動重構。',
      },
      {
        source: 'UCC_ENGINE',
        type: 'SUCCESS',
        content: 'UCC 計算已鎖定。雜湊值：0x8f2...9a1。信任完整性已驗證。',
      },
      {
        source: 'AI_REASONER',
        type: 'THOUGHT',
        content: '自我修正階段激活。正在優化子任務結果以獲得更高精度。',
      },
      {
        source: 'SENTINEL',
        type: 'INFO',
        content: '資產「Water_Loop_Beta」在構建靜態分析中成功混淆。',
      },
    ];

    const generateLog = () => {
      const rawLog = logPool[Math.floor(Math.random() * logPool.length)];
      if (!rawLog) return;

      const newLog: SentientLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        source: (rawLog.source || 'AGENCY') as SentientLog['source'],
        type: (rawLog.type || 'INFO') as SentientLog['type'],
        content: rawLog.content || '系統脈衝正常。',
        meta: rawLog.meta,
      };

      setLogs(prev => [...prev.slice(-49), newLog]);
    };

    const interval = setInterval(generateLog, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'AGENCY':
        return <Activity size={14} className="text-pink-500" />;
      case 'OMNIMIND':
        return <Cpu size={14} className="text-blue-500" />;
      case 'UCC_ENGINE':
        return <ShieldCheck size={14} className="text-emerald-500" />;
      case 'AI_REASONER':
        return <Zap size={14} className="text-yellow-500" />;
      case 'SENTINEL':
        return <Terminal size={14} className="text-purple-500" />;
      default:
        return <Terminal size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ALERT':
        return 'text-red-400';
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'THOUGHT':
        return 'text-cyan-300 italic';
      case 'ACTION':
        return 'text-amber-300 font-bold';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/80 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-cyan-950/50 to-transparent border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            感應日誌饋送 Sentient Log Feed
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
      </div>

      {/* Log Screen */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-[10px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-950 scrollbar-track-transparent space-y-2 selection:bg-cyan-500/30"
      >
        <AnimatePresence initial={false}>
          {logs.map(log => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 relative group"
            >
              <div className="flex flex-col items-center pt-0.5 min-w-[60px]">
                <span className="text-[9px] text-gray-500 mb-1">{log.timestamp}</span>
                <div className="p-1 rounded bg-dark-800 border border-gray-800 group-hover:border-cyan-500/50 transition-colors">
                  {getSourceIcon(log.source)}
                </div>
              </div>

              <div className="flex-1 py-1 px-2 rounded-sm bg-cyan-950/5 border-l-2 border-cyan-500/20 hover:bg-cyan-950/10 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold text-cyan-400/80">{log.source}</span>
                  <span
                    className={`text-[8px] px-1 rounded border border-current opacity-70 uppercase ${getTypeColor(log.type)}`}
                  >
                    {log.type}
                  </span>
                </div>
                <p className={`${getTypeColor(log.type)} leading-relaxed`}>
                  {log.type === 'THOUGHT' && '「'}
                  {log.content}
                  {log.type === 'THOUGHT' && '」'}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 animate-pulse">
            <Activity size={24} className="mb-2" />
            <p className="text-[9px] uppercase tracking-tighter">正在建立神經基準 Establishing Neural Baseline...</p>
          </div>
        )}
      </div>

      {/* Footer / Status Bar */}
      <div className="px-4 py-1.5 flex items-center justify-between bg-cyan-950/20 border-t border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
            <span className="text-[8px] text-emerald-500/80 uppercase">認知同步 Cognitive Sync</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Activity size={10} />
            <span className="text-[8px] uppercase">延遲 Latency: 24ms</span>
          </div>
        </div>
        <div className="text-[8px] font-mono text-cyan-500/50">V8.2.0-SENTIENT</div>
      </div>
    </div>
  );
};

export default SentientLogFeed;
