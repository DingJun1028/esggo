/**
 * ⛓️ ESG-19 決策透明度 - 區塊鏈日誌整合組件
 * Decision Transparency - Blockchain Log Integration Component
 * 
 * 整合現有資源:
 * - BlockchainService (區塊鏈服務)
 * - EvidenceBlockchainService (證據區塊鏈)
 * - TruthGoodBeauty5TProtocol (5T 協議)
 * - VerificationService (驗證服務)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link, 
  FileCheck, 
  Clock, 
  Shield, 
  Hash,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

import { blockchainService } from '@/services/blockchain';
import { evidenceBlockchainService } from '@/services/EvidenceBlockchainService';
import { verificationService } from '@/services/VerificationService';
import { useTheme } from '@/hooks/useTheme';

// 區塊鏈記錄類型
interface BlockchainRecord {
  id: string;
  txId: string;
  timestamp: number;
  type: 'evidence' | 'verification' | 'certification' | 'mint';
  status: 'pending' | 'confirmed' | 'failed';
  data: {
    title: string;
    description: string;
    hash?: string;
    blockTimestamp?: string;
    signerAddress?: string;
  };
  confirmations: number;
}

// 交易詳情
interface TransactionDetails {
  txHash: string;
  blockNumber: number;
  blockTimestamp: string;
  gasUsed: number;
  status: 'success' | 'failed';
}

interface BlockchainTransparencyProps {
  showAllRecords?: boolean;
  maxRecords?: number;
  onVerify?: (txId: string) => void;
}

export const BlockchainTransparency: React.FC<BlockchainTransparencyProps> = ({
  showAllRecords = false,
  maxRecords = 10,
  onVerify
}) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'verify' | 'stats'>('records');

  // 載入區塊鏈記錄
  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      // 模擬區塊鏈記錄 (實際應從 blockchainService 獲取)
      const mockRecords: BlockchainRecord[] = [
        {
          id: 'evt-001',
          txId: '0x7a8b9c...3f4d2e1',
          timestamp: Date.now() - 1000 * 60 * 30,
          type: 'evidence',
          status: 'confirmed',
          data: {
            title: 'ESG Report Anchored',
            description: '2024 Q4 Sustainability Report hash anchored to blockchain',
            hash: '0xabc123...def456',
            blockTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            signerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f7b7d2'
          },
          confirmations: 145
        },
        {
          id: 'evt-002',
          txId: '0x5d4e3f...2a1b0c9',
          timestamp: Date.now() - 1000 * 60 * 60 * 2,
          type: 'certification',
          status: 'confirmed',
          data: {
            title: 'Carbon Footprint Certified',
            description: 'Annual carbon inventory verification certified on-chain',
            hash: '0xdef456...ghi789',
            blockTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            signerAddress: '0x8f4d35Cc6634C0532925a3b844Bc9e7595f7b7d2'
          },
          confirmations: 312
        },
        {
          id: 'evt-003',
          txId: '0x3c2b1a...9z8y7x6w',
          timestamp: Date.now() - 1000 * 60 * 60 * 24,
          type: 'mint',
          status: 'confirmed',
          data: {
            title: 'Impact NFT Minted',
            description: 'Sustainability achievement NFT minted for stakeholder rewards',
            hash: '0xghi789...jkl012',
            blockTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            signerAddress: '0x9e5d35Cc6634C0532925a3b844Bc9e7595f7b7d2'
          },
          confirmations: 1247
        },
        {
          id: 'evt-004',
          txId: '0x1a2b3c...4d5e6f7g',
          timestamp: Date.now() - 1000 * 60 * 60 * 48,
          type: 'verification',
          status: 'confirmed',
          data: {
            title: 'TCFD Compliance Verified',
            description: 'Climate risk disclosure compliance verified',
            hash: '0xjkl012...mno345',
            blockTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            signerAddress: '0x0f6d35Cc6634C0532925a3b844Bc9e7595f7b7d2'
          },
          confirmations: 2891
        },
      ];

      setRecords(showAllRecords ? mockRecords : mockRecords.slice(0, maxRecords));

    } catch (error) {
      console.error('Failed to load blockchain records:', error);
    } finally {
      setLoading(false);
    }
  }, [showAllRecords, maxRecords]);

  // 獲取交易詳情
  const fetchTxDetails = async (txId: string) => {
    setTxDetails({
      txHash: txId,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      blockTimestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      status: 'success'
    });
  };

  // 驗證記錄
  const verifyRecord = async (record: BlockchainRecord) => {
    setVerifying(record.id);
    try {
      // 模擬驗證過程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 實際應調用 verificationService
      const proof = await verificationService.verify(record.txId);
      
      if (onVerify) {
        onVerify(record.txId);
      }
      
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifying(null);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // 格式化時間
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // 獲取類型圖標和顏色
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'evidence': return { icon: FileCheck, color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'certification': return { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
      case 'mint': return { icon: Link, color: 'text-purple-400', bg: 'bg-purple-500/20' };
      case 'verification': return { icon: CheckCircle, color: 'text-amber-400', bg: 'bg-amber-500/20' };
      default: return { icon: Hash, color: 'text-slate-400', bg: 'bg-slate-500/20' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        <span className="ml-3 text-slate-400">{t('system.loading')} Blockchain...</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${
      isDark ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-200'
    } overflow-hidden`}>
      {/* 標題 */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Link className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Blockchain Transparency Log</h3>
              <p className="text-xs text-slate-400">ESG-19 Decision Audit Trail</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={loadRecords}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 標籤導航 */}
      <div className="flex border-b border-slate-200 dark:border-white/10">
        {[
          { id: 'records', label: 'Transaction Records', icon: FileCheck },
          { id: 'verify', label: 'Verify', icon: Shield },
          { id: 'stats', label: 'Statistics', icon: Hash },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              activeTab === tab.id 
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 內容區域 */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {records.map((record, idx) => {
                const typeConfig = getTypeConfig(record.type);
                const TypeIcon = typeConfig.icon;

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] ${
                      isDark ? 'bg-slate-900/50 hover:bg-slate-800/50' : 'bg-slate-50 hover:bg-slate-100'
                    } ${selectedRecord?.id === record.id ? 'ring-2 ring-emerald-500/50' : ''}`}
                    onClick={() => {
                      setSelectedRecord(record);
                      fetchTxDetails(record.txId);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
                          <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{record.data.title}</span>
                            <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                              record.status === 'confirmed' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {record.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{record.data.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(record.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {record.confirmations} confirmations
                            </span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                  </motion.div>
                );
              })}

              {records.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No blockchain records found</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* 驗證輸入 */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Verify Transaction
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter TX Hash or UUID..."
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      isDark 
                        ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                    Verify
                  </button>
                </div>
              </div>

              {/* 快速驗證列表 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-400">Quick Verify</h4>
                {records.slice(0, 3).map(record => (
                  <div key={record.id} className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? 'bg-slate-800/50' : 'bg-slate-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400 font-mono">
                        {record.txId.slice(0, 10)}...{record.txId.slice(-8)}
                      </span>
                    </div>
                    <button
                      onClick={() => verifyRecord(record)}
                      disabled={verifying === record.id}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        verifying === record.id
                          ? 'bg-slate-600 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      }`}
                    >
                      {verifying === record.id ? (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* 統計卡片 */}
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Total Transactions</span>
                  <Hash className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{records.length}</div>
              </div>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Confirmations</span>
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {records.reduce((sum, r) => sum + r.confirmations, 0).toLocaleString()}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Evidence Anchored</span>
                  <FileCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {records.filter(r => r.type === 'evidence').length}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Certifications</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {records.filter(r => r.type === 'certification').length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 交易詳情彈窗 */}
      {selectedRecord && txDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-md rounded-xl p-6 ${
              isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Transaction Details</h4>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">TX Hash</span>
                <span className="text-white font-mono text-xs">{selectedRecord.txId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Block</span>
                <span className="text-white">{txDetails.blockNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-white">{txDetails.blockTimestamp}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400">{txDetails.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Confirmations</span>
                <span className="text-white">{selectedRecord.confirmations}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => verifyRecord(selectedRecord)}
                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Verify On-Chain
              </button>
              <button className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                View on Explorer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlockchainTransparency;
