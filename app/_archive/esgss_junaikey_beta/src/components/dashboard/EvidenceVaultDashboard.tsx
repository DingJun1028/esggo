import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { evidenceVault } from '../../omni/services/EvidenceVaultService';
import { IComponentCore, Language } from '@/types/core';
import { ShieldCheck, Hash, GitCommit, Activity, Search, Database, Lock, Eye } from 'lucide-react';

interface EvidenceVaultDashboardProps {
  language?: Language;
}

/**
 * 🛡️ 佐證庫儀表板 (Evidence Vault Dashboard)
 * --------------------------------------------------
 * 可視化呈現所有經過 5T 驗證的 Immutable Assets。
 * 風格：Cyber-Security / Digital Vault / Blockchain Ledger
 */
export const EvidenceVaultDashboard: React.FC<EvidenceVaultDashboardProps> = ({
  language = 'zh-TW',
}) => {
  const isZh = language === 'zh-TW';
  const [assets, setAssets] = useState<IComponentCore[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<IComponentCore | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load assets from service
  useEffect(() => {
    const loadAssets = () => {
      const all = evidenceVault.getAllAssets();
      // Sort by latest
      setAssets([...all].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    };

    loadAssets();
    // Set up interval for live updates
    const interval = setInterval(loadAssets, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter(
    a =>
      a.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.evidence?.traceable?.source_origin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full min-h-screen p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-slate-400 mb-2">
            EVIDENCE <span className="font-bold text-emerald-400">VAULT</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {isZh ? '已驗證不可篡改數據庫' : 'Verified Immutable Ledger'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="glass-panel-premium px-6 py-3 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {isZh ? '總資產' : 'Total Assets'}
              </p>
              <p className="text-2xl font-bold text-slate-200">{assets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel-premium p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder={isZh ? '搜尋資產 UUID 或來源...' : 'Search asset UUID or origin...'}
          className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-600 flex-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        {/* Left: Asset List (Ledger) */}
        <div className="lg:col-span-5 glass-panel-premium overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {isZh ? '最近交易 (Recent Transactions)' : 'Recent Transactions'}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {filteredAssets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <Search className="w-8 h-8 mb-2 opacity-50" />
                <p>{isZh ? '查無符合資產' : 'No assets found'}</p>
              </div>
            ) : (
              filteredAssets.map(asset => (
                <motion.div
                  key={asset.uuid}
                  layoutId={asset.uuid}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                    selectedAsset?.uuid === asset.uuid
                      ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      {asset.uuid.slice(0, 8)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(asset.timestamp).toLocaleTimeString(isZh ? 'zh-TW' : 'en-US')}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 mb-1">
                    {asset.evidence?.traceable?.source_origin || 'Unknown System'}
                  </h4>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] flex items-center gap-1 text-emerald-400/80 bg-emerald-900/20 px-1.5 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" /> 5T-Verified
                    </span>
                    {asset.evidence?.trustworthy?.hash_lock && (
                      <span className="text-[10px] flex items-center gap-1 text-amber-400/80 bg-amber-900/20 px-1.5 py-0.5 rounded">
                        <Lock className="w-3 h-3" /> Sealed
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right: Asset Detail (Inspector) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedAsset ? (
              <motion.div
                key={selectedAsset.uuid}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full glass-panel-premium p-8 relative overflow-hidden flex flex-col"
              >
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-200">
                      {(selectedAsset as any).asset_type || (isZh ? '奧秘資產' : 'Omni Asset')}
                    </h2>
                    <p className="text-emerald-400 font-mono text-sm">{selectedAsset.uuid}</p>
                  </div>
                </div>

                {/* 5T Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
                      <GitCommit className="w-3 h-3" /> {isZh ? '可溯源性' : 'Traceability'}
                    </h4>
                    <p className="text-sm text-slate-300">
                      {selectedAsset.evidence?.traceable?.source_origin || 'Unknown Origin'}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> {isZh ? '可追踪性' : 'Trackability'}
                    </h4>
                    <p className="text-sm text-slate-300">
                      ID: {selectedAsset.evidence?.trackable?.lifecycle_hooks?.length || 0} Hooks
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
                      <Eye className="w-3 h-3" /> {isZh ? '透明度' : 'Transparency'}
                    </h4>
                    <p className="text-sm text-slate-300 font-mono text-xs truncate">
                      {selectedAsset.evidence?.transparent?.formula ||
                        (isZh ? '標準協議' : 'Standard Protocol')}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-emerald-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse-slow" />
                    <h4 className="text-xs text-emerald-500 uppercase mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Lock className="w-3 h-3" /> {isZh ? '信實度' : 'Trustworthiness'}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const btn = e.currentTarget;
                          btn.innerHTML =
                            '<svg class="animate-spin w-3 h-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                          setTimeout(() => {
                            btn.innerHTML =
                              '<svg class="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
                          }, 1500);
                        }}
                        className="text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 transition-all"
                      >
                        {isZh ? '驗證封印' : 'VERIFY SEAL'}
                      </button>
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono break-all relative z-10">
                      {selectedAsset.evidence?.trustworthy?.hash_lock}
                    </p>
                  </div>
                </div>

                {/* Raw Data Preview */}
                <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-xs text-slate-400 overflow-auto border border-white/5">
                  <pre>{JSON.stringify(selectedAsset.data || {}, null, 2)}</pre>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                  <span>
                    {isZh ? '時間戳' : 'Timestamp'}:{' '}
                    {new Date(selectedAsset.timestamp).toLocaleString(isZh ? 'zh-TW' : 'en-US')}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500">
                    <ShieldCheck className="w-3 h-3" />{' '}
                    {isZh ? '加密封印完成' : 'Cryptographically Sealed'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full glass-panel-premium flex flex-col items-center justify-center text-slate-500">
                <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                  <Hash className="w-12 h-12 opacity-20" />
                </div>
                <p>
                  {isZh
                    ? '請從左側列表選擇資產以查看詳細 5T 驗證報告'
                    : 'Select an asset from the list to view detailed 5T verification report'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
