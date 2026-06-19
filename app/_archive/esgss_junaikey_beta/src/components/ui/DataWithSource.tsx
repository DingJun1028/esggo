/**
 * 數據追溯性組件 - 為所有數據點添加來源標註
 * 實現：證據通到底 + 有理有據
 */
import React, { useState } from 'react';
import { Info, ExternalLink, FileText, Database, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DataSource {
  type: 'api' | 'calculation' | 'blockchain' | 'manual' | 'third-party';
  timestamp: number;
  verifiedBy?: string;
  url?: string;
  hash?: string;
  formula?: string;
  dependencies?: string[];
}

export interface TrackedDataPoint {
  value: number | string;
  label: string;
  unit?: string;
  source: DataSource;
  evidenceChain?: EvidenceStep[];
}

export interface EvidenceStep {
  step: number;
  type: string;
  description: string;
  timestamp: number;
  hash?: string;
  formula?: string;
  verifiedBy?: string;
}

interface DataWithSourceProps {
  data: TrackedDataPoint;
  children: React.ReactNode;
  showIcon?: boolean;
}

/**
 * 帶來源標註的數據顯示組件
 * 使用方式：包裹任何數據展示元素
 */
export const DataWithSource: React.FC<DataWithSourceProps> = ({
  data,
  children,
  showIcon = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getSourceIcon = () => {
    switch (data.source.type) {
      case 'blockchain':
        return <Database className="w-3 h-3" />;
      case 'calculation':
        return <Calculator className="w-3 h-3" />;
      case 'api':
      case 'third-party':
        return <ExternalLink className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const getSourceLabel = () => {
    const labels = {
      api: 'API數據',
      calculation: '計算結果',
      blockchain: '區塊鏈驗證',
      manual: '人工錄入',
      'third-party': '第三方數據',
    };
    return labels[data.source.type];
  };

  return (
    <div className="relative inline-block group">
      {/* 主要數據展示 */}
      <div className="flex items-center gap-2">
        {children}

        {/* 來源圖標 */}
        {showIcon && (
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-[#00FFFF]/50 hover:text-[#00FFFF] transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tooltip：數據來源詳情 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full mt-2 left-0 min-w-[280px] bg-slate-900/98 backdrop-blur-xl border border-[#00FFFF]/30 rounded-lg p-4 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            {/* 標題 */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#00FFFF]/20">
              {getSourceIcon()}
              <span className="text-[#00FFFF] font-bold text-sm">{getSourceLabel()}</span>
            </div>

            {/* 詳細信息 */}
            <div className="space-y-2 text-xs">
              {/* 時間戳 */}
              <div className="flex justify-between">
                <span className="text-[#00FFFF]/80">更新時間:</span>
                <span className="text-cyan-50 font-mono">
                  {new Date(data.source.timestamp).toLocaleString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* 驗證者 */}
              {data.source.verifiedBy && (
                <div className="flex justify-between">
                  <span className="text-[#00FFFF]/80">驗證:</span>
                  <span className="text-emerald-400">{data.source.verifiedBy}</span>
                </div>
              )}

              {/* Hash（區塊鏈） */}
              {data.source.hash && (
                <div className="flex justify-between">
                  <span className="text-[#00FFFF]/80">Hash:</span>
                  <span className="text-cyan-50 font-mono text-[10px]">
                    {data.source.hash.slice(0, 10)}...
                  </span>
                </div>
              )}

              {/* 計算公式 */}
              {data.source.formula && (
                <div className="mt-2 pt-2 border-t border-[#00FFFF]/20">
                  <span className="text-[#00FFFF]/80 block mb-1">計算公式:</span>
                  <code className="text-cyan-50 bg-slate-950/50 px-2 py-1 rounded text-[10px] block">
                    {data.source.formula}
                  </code>
                </div>
              )}

              {/* 依賴項 */}
              {data.source.dependencies && data.source.dependencies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#00FFFF]/20">
                  <span className="text-[#00FFFF]/80 block mb-1">依賴數據:</span>
                  <ul className="text-cyan-50 text-[10px] space-y-0.5">
                    {data.source.dependencies.map((dep, idx) => (
                      <li key={idx}>• {dep}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* URL鏈接 */}
              {data.source.url && (
                <div className="mt-2">
                  <a
                    href={data.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00FFFF] hover:text-[#00FFFF]/80 flex items-center gap-1 text-[10px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    查看原始數據
                  </a>
                </div>
              )}
            </div>

            {/* 證據鏈指示 */}
            {data.evidenceChain && data.evidenceChain.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#00FFFF]/20">
                <div className="text-[#00FFFF] text-[10px] flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  完整證據鏈 ({data.evidenceChain.length} 步驟)
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 使用示例：
 *
 * const cpuData: TrackedDataPoint = {
 *   value: 12.5,
 *   label: 'CPU使用率',
 *   unit: '%',
 *   source: {
 *     type: 'api',
 *     timestamp: Date.now(),
 *     url: '/api/system/metrics',
 *     verifiedBy: 'System Monitor'
 *   }
 * };
 *
 * <DataWithSource data={cpuData}>
 *   <div className="text-3xl font-bold">{cpuData.value}%</div>
 * </DataWithSource>
 */
