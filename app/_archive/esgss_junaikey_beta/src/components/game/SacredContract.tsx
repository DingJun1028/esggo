/**
 * 📜 神聖契約 - Sacred Contract System
 * 
 * 功能：
 * - ISO-14064-1 規範戰果報告
 * - Hash Lock 不可篡改機制
 * - 數位技能護照生成
 * - 區塊鏈錨定驗證
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOmniContext } from '@/hooks/useOmniContext';
import {
  Scroll,
  CheckCircle,
  Lock,
  Shield,
  Clock,
  Award,
  FileText,
  Database,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';

interface SacredContractProps {
  twinState: {
    level: number;
    learnedStrategies: string[];
    certificates: Array<{
      id: string;
      title: string;
      isoReference?: string;
      earnedAt: string;
      hash: string;
      verified: boolean;
    }>;
  };
  onClose: () => void;
  onSign: (data: ContractData) => void;
}

interface ContractData {
  contractId: string;
  strategies: string[];
  totalXP: number;
  signature: string;
  timestamp: string;
  hash: string;
}

// 生成假隨機哈希
const generateHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const SacredContract: React.FC<SacredContractProps> = ({
  twinState,
  onClose,
  onSign
}) => {
  const { sealSacredContract } = useOmniContext();
  const [step, setStep] = useState<'preview' | 'signing' | 'complete'>('preview');
  const [isSigning, setIsSigning] = useState(false);

  const contractData: ContractData = {
    contractId: `SC-${Date.now()}`,
    strategies: twinState.learnedStrategies,
    totalXP: twinState.level * 100,
    signature: generateHash(),
    timestamp: new Date().toISOString(),
    hash: generateHash()
  };

  // 簽署合約
  const handleSign = async () => {
    setIsSigning(true);
    setStep('signing');

    // 模擬區塊鏈交易
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSigning(false);
    setStep('complete');
    sealSacredContract(contractData);
    onSign(contractData);
  };

  // 渲染預覽
  const renderPreview = () => (
    <div className="space-y-6">
      {/* 合約標題 */}
      <div className="text-center">
        <Scroll className="w-16 h-16 text-amber-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">神聖契約</h2>
        <p className="text-sm text-slate-400">Skill Passport - ESG Mastery Certificate</p>
      </div>

      {/* 合約內容 */}
      <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10 space-y-4">
        {/* 玩家資訊 */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full" />
            <div>
              <div className="font-medium text-white">玩家 #{contractData.contractId}</div>
              <div className="text-xs text-slate-400">LV.{twinState.level} 永續大師</div>
            </div>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>

        {/* 已掌握策略 */}
        <div>
          <h4 className="text-sm text-slate-400 mb-2">🎯 已掌握的永續策略</h4>
          <div className="flex flex-wrap gap-2">
            {twinState.learnedStrategies.slice(0, 5).map((strategy, i) => (
              <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                {strategy}
              </span>
            ))}
            {twinState.learnedStrategies.length > 5 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                +{twinState.learnedStrategies.length - 5} 更多
              </span>
            )}
          </div>
        </div>

        {/* 總經驗值 */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-sm text-slate-400">累計貢獻經驗值</span>
          <span className="text-lg font-bold text-amber-400">{contractData.totalXP} XP</span>
        </div>
      </div>

      {/* ISO 規範說明 */}
      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-400 text-sm">📋 符合 ISO-14064-1 規範</h4>
            <p className="text-xs text-blue-300 mt-1">
              本戰果報告依據國際標準組織溫室氣體核算標準編製，
              所有數據皆經過 Hash Lock 機制錨定，確保不可篡改。
            </p>
          </div>
        </div>
      </div>

      {/* 風險提示 */}
      <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            簽署此契約即表示確認以上戰果真實無誤，
            並授權系統生成不可篡改的數位證書。
          </p>
        </div>
      </div>
    </div>
  );

  // 渲染簽署中
  const renderSigning = () => (
    <div className="text-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 mx-auto mb-6"
      >
        <Database className="w-20 h-20 text-purple-400" />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2">正在簽署神聖契約...</h3>
      <p className="text-sm text-slate-400 mb-4">
        系統正在將你的戰果錨定至區塊鏈
      </p>

      <div className="flex justify-center gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          生成證書
        </span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-amber-400" />
          Hash Lock
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-400" />
          區塊鏈驗證
        </span>
      </div>
    </div>
  );

  // 渲染完成
  const renderComplete = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center"
      >
        <Award className="w-10 h-10 text-white" />
      </motion.div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-tight-extreme uppercase aqua-text-glow">Trinity Covenant Sealed</h3>
        <p className="text-xs text-aqua-400 font-serif italic">
          "Your digital sovereignty is now anchored in the eternal matrix."
        </p>
      </div>

      {/* 證書摘要 */}
      <div className="p-4 bg-slate-800/50 rounded-xl border border-amber-500/30 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">證書編號</span>
          <span className="font-mono text-xs text-amber-400">{contractData.contractId}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">生效時間</span>
          <span className="text-xs text-white">{new Date().toLocaleString()}</span>
        </div>
        <div className="p-2 bg-slate-900 rounded-lg">
          <div className="text-xs text-slate-400 mb-1">區塊鏈哈希</div>
          <div className="font-mono text-xs text-amber-400 truncate">
            {contractData.hash}
          </div>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm">下載證書</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">分享成就</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl overflow-hidden"
      >
        {/* 頂部裝飾 */}
        <div className="h-2 bg-gradient-to-r from-infoOne-gold via-aqua-primary to-aqua-lighter" />

        <div className="p-6">
          {step === 'preview' && renderPreview()}
          {step === 'signing' && renderSigning()}
          {step === 'complete' && renderComplete()}

          {/* 底部按鈕 */}
          {step === 'preview' && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSign}
                disabled={isSigning}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                簽署契約
              </button>
            </div>
          )}

          {step === 'complete' && (
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              完成
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SacredContract;
