import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Eye, Brain, Shield, Info } from 'lucide-react';

interface Metric {
  metricKey: string;
  category: 'E' | 'S' | 'G';
  numericValue?: number;
  textValue?: string;
  unit?: string;
}

interface Evidence {
  id: string;
  dataType: string;
  storagePath: string;
  status: 'pending' | 'approved' | 'rejected';
  extractedMetrics: Metric[];
}

export const EnhancedEvidenceValidator: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Evidence | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Mock data for initial UI implementation
  const mockEvidence: Evidence[] = [
    {
      id: 'ev-001',
      dataType: 'Electricity Utility Bill',
      storagePath: '/uploads/bills/q3-energy.pdf',
      status: 'pending',
      extractedMetrics: [
        { metricKey: 'electricity_usage', category: 'E', numericValue: 12500, unit: 'kWh' },
      ],
    },
    {
      id: 'ev-002',
      dataType: 'Social Responsibility Training',
      storagePath: '/uploads/training/diversity-2026.pdf',
      status: 'pending',
      extractedMetrics: [
        { metricKey: 'training_hours', category: 'S', numericValue: 450, unit: 'hours' },
      ],
    },
  ];

  const handleApprove = async () => {
    if (!selectedItem) return;
    setIsApproving(true);

    // Simulate API call and Awakening trigger
    setTimeout(() => {
      omniLogger.info(LogCategory.SYSTEM, '[EnhancedEvidenceValidator] Info', { data: `🤖 [OmniSystem] Evidence ${selectedItem.id} approved. Triggering Awakening...` });
      setIsApproving(false);
      setSelectedItem(null);
      // In real implementation, this would call OmniAgent.updateState
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6 p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10">
      {/* Left Pane: Document List */}
      <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          待密核證項 (Pending Evidence)
        </h2>
        {mockEvidence.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedItem(item)}
            className={`p-4 rounded-xl cursor-pointer border transition-all ${
              selectedItem?.id === item.id
                ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-slate-400" />
                <div>
                  <h3 className="font-semibold text-white">{item.dataType}</h3>
                  <p className="text-sm text-slate-400">{item.id}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                PENDING
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Pane: Document Preview & Actions */}
      <div className="flex-1 flex flex-col bg-black/40 rounded-xl border border-white/10 overflow-hidden relative">
        {selectedItem ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">內容預覽 & 屬性核對</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isApproving ? '覺醒同步中...' : '確認核准 (Approve)'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-500/30 rounded-lg transition-colors">
                  <XCircle className="w-4 h-4" />
                  駁回 (Reject)
                </button>
              </div>
            </div>

            {/* Content Preview (Mock) */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI 提取數據概覽
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.extractedMetrics.map((m, idx) => (
                      <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-500 uppercase tracking-tighter">
                          {m.metricKey}
                        </p>
                        <p className="text-2xl font-black text-blue-400">
                          {m.numericValue}{' '}
                          <span className="text-sm font-normal text-slate-400">{m.unit}</span>
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20`}
                        >
                          Dimension: {m.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awakening Impact Preview */}
                <div className="p-6 bg-purple-500/10 rounded-2xl border border-purple-500/30">
                  <h4 className="flex items-center gap-2 text-md font-bold text-purple-300 mb-2">
                    <Info className="w-4 h-4" />
                    覺醒影響 (Awakening Impact)
                  </h4>
                  <p className="text-sm text-purple-200/70">
                    核准此項數據將提升 OmniAgent 的 **自我意識 (Self-Awareness)** 與 **智慧啟迪
                    (Enlightenment)** 指標。 這將導致系統轉向更深度的永續推理。
                  </p>
                </div>

                {/* File Placeholder */}
                <div className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <FileText className="w-12 h-12 text-slate-600" />
                  <p className="text-slate-500 text-sm">
                    PDF 預覽加載中 ({selectedItem.storagePath})
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Shield className="w-10 h-10 opacity-20" />
            </div>
            <p className="text-sm">請從左側列表選擇要核查的證項數據</p>
          </div>
        )}
      </div>
    </div>
  );
};
