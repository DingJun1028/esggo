import React from 'react';
import { Table, FileCode, Type } from 'lucide-react';
import { Badge } from '@/components/ui';

interface MatrixItem {
  tc: string; // Traditional Chinese (The End/UI)
  code: string; // English Code (The Beginning/Logic)
  context: string; // Context/Component
  type: 'component' | 'prop' | 'state' | 'value';
}

const MATRIX_DATA: MatrixItem[] = [
  // System Core
  { tc: '全知日誌', code: 'OmniLogger', context: 'System Name', type: 'component' },
  { tc: '影響力證書', code: 'ImpactCertificate', context: 'Asset', type: 'component' },
  { tc: '奧秘 (全知)', code: 'Omni', context: 'Core Concept', type: 'value' },

  // OmniLogger
  { tc: '總計', code: 'stats.total', context: 'OmniLogger', type: 'state' },
  { tc: '錯誤', code: 'stats.errors', context: 'OmniLogger', type: 'state' },
  { tc: '警告', code: 'stats.warnings', context: 'OmniLogger', type: 'state' },
  { tc: '資訊', code: 'stats.infos', context: 'OmniLogger', type: 'state' },

  // Impact Certificate
  { tc: '預覽模式', code: 'PREVIEW_MODE', context: 'Certificate', type: 'value' },
  { tc: '專案名稱', code: 'project.title', context: 'Certificate', type: 'prop' },
  { tc: '熵減進度', code: 'impact_goals.current_value', context: 'Certificate', type: 'prop' },
  { tc: '加密證明', code: 'evidence.raw_data_hash', context: 'Certificate', type: 'prop' },

  // Log Viewer
  { tc: '詳細資訊', code: 'log.details', context: 'LogViewer', type: 'prop' },
  { tc: '堆疊追蹤', code: 'log.stack', context: 'LogViewer', type: 'prop' },
  { tc: '層級', code: 'LogLevel', context: 'LogViewer', type: 'value' },
];

export const LocalizationMatrix: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-cyan-900/30 bg-gradient-to-r from-cyan-950/20 to-black">
          <h2 className="text-cyan-400 font-mono text-lg flex items-center gap-3 tracking-wider">
            <Table className="w-5 h-5" />
            繁中英碼終始矩陣 (TC-Code Alpha-Omega Matrix)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors px-3 py-1 hover:bg-white/10 rounded"
          >
            關閉 [ESC]
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-12 gap-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
            <div className="col-span-3 pl-2">終 (The End) / 介面</div>
            <div className="col-span-1 text-center">類型</div>
            <div className="col-span-4">始 (The Beginning) / 代碼</div>
            <div className="col-span-4">情境 (Context)</div>
          </div>

          <div className="space-y-1">
            {MATRIX_DATA.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-cyan-900/10 border border-transparent hover:border-cyan-500/20 rounded transition-colors group"
              >
                {/* TC (End) */}
                <div className="col-span-3 text-lg text-white font-serif tracking-wide pl-2 group-hover:text-cyan-300 transition-colors">
                  {item.tc}
                </div>

                {/* Type */}
                <div className="col-span-1 flex justify-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase w-full justify-center ${
                      item.type === 'component'
                        ? 'border-purple-500/50 text-purple-400'
                        : item.type === 'state'
                          ? 'border-green-500/50 text-green-400'
                          : item.type === 'prop'
                            ? 'border-yellow-500/50 text-yellow-400'
                            : 'border-blue-500/50 text-blue-400'
                    }`}
                  >
                    {item.type}
                  </Badge>
                </div>

                {/* Code (Beginning) */}
                <div className="col-span-4 font-mono text-sm text-gray-400 flex items-center gap-2 overflow-hidden">
                  <FileCode className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  <span className="truncate group-hover:text-white transition-colors">
                    {item.code}
                  </span>
                </div>

                {/* Context */}
                <div className="col-span-4 text-xs text-gray-500 font-mono border-l border-gray-800 pl-4 group-hover:border-cyan-500/30">
                  {item.context}
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Legend */}
          <div className="mt-8 pt-4 border-t border-gray-800 text-[10px] text-gray-600 flex gap-6 justify-end font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500/50 rounded-full"></span> Component
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500/50 rounded-full"></span> State
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500/50 rounded-full"></span> Prop
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500/50 rounded-full"></span> Value
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
