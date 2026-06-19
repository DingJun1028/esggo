import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, Filter, Hash, CheckCircle, Clock, ShieldCheck, Globe, Zap } from 'lucide-react';
import sovereignVaultService, { VaultRecord } from '../../services/SovereignVaultService';
import swarmConsensusService from '../../services/SwarmConsensusService';
import { realTimeDataSync } from '../../1-service/realTimeDataSync';

/**
 * 🛰️ 主權數據帳本瀏覽器 (Sovereign Ledger View)
 * --------------------------------------------------
 * [協議] 🔴 Phase 28: 自我進化與全域主權
 * 
 * 核心職責：
 * 1. 視覺化展示主權數據保險箱 (Sovereign Vault) 中的所有數據包。
 * 2. 追蹤內容定址標識 (CID) 與群體共鳴等級。
 * 3. 仿區塊鏈開發者模式，提供數據透明度。
 */

export const SovereignLedgerView: React.FC = () => {
  const [packets, setPackets] = useState<VaultRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    refreshLedger();

    const unsubscribe = realTimeDataSync.subscribe('sovereign_anchors', () => {
      refreshLedger();
    });

    return () => unsubscribe();
  }, []);

  const refreshLedger = async () => {
    setLoading(true);
    try {
      const start = performance.now();
      const list = await sovereignVaultService.getLedger();
      const end = performance.now();

      setPackets([...list].sort((a, b) => b.timestamp - a.timestamp));
      // 判定為快取：如果回應速度低於 10ms (對 local 來說合理)
      setIsCached(end - start < 10);
    } catch (error) {
      console.error('Failed to refresh ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackets = packets.filter(p => {
    const matchesSearch = p.cid?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-[2rem] border border-white/10 overflow-hidden backdrop-blur-xl">
      {/* Header Area */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <Database size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Sovereign <span className="text-indigo-400">Vault Ledger</span></h4>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter">Content-Addressed (CID) Persistence Index</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isCached && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-400 animate-pulse">
              <Zap size={10} />
              <span>CACHED MODE</span>
            </div>
          )}
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400" />
            <input
              type="text"
              placeholder="SEARCH CID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-black/40 border border-white/5 rounded-full text-[10px] font-mono text-cyan-100 focus:outline-none focus:border-cyan-500/50 transition-all w-48"
            />
          </div>
          <div className="flex gap-1 text-[9px] font-black uppercase text-slate-500">
            <Globe size={12} className={`text-emerald-500 ${loading ? 'animate-spin' : 'animate-pulse'}`} />
            <span>Swarm Synced</span>
          </div>
        </div>
      </div>

      {/* Ledger Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredPackets.map((packet) => (
              <motion.div
                key={packet.cid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-900/30 rounded-lg text-indigo-300">
                      <Hash size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-indigo-200 tracking-tight">{packet.cid || 'NO-CID'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black border border-emerald-500/20 uppercase">
                          {packet.anchoring?.status || 'local'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(packet.timestamp).toLocaleTimeString()}</span>
                        <span className="flex items-center gap-1"><ShieldCheck size={10} /> PROOF: SHA-256</span>
                        <span className="text-indigo-400">TYPE: {packet.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                      Resonance Rank
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-1 rounded-full ${i < (packet.anchoring?.status === 'anchored' ? 4 : packet.anchoring?.status === 'consensus_reached' ? 5 : 2) ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-slate-800'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Details Preview (Visual only) */}
                <div className="absolute right-4 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <span className="text-[8px] text-slate-500 font-mono">DID: {packet.did.substring(0, 15)}...</span>
                  <CheckCircle size={10} className="text-indigo-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPackets.length === 0 && (
            <div className="p-12 text-center text-slate-700 flex flex-col items-center gap-3">
              <Filter size={32} className="opacity-10" />
              <p className="text-xs uppercase tracking-widest font-bold">Empty Ledger or No Match</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between text-[10px] text-slate-500 font-bold px-6">
        <div>TOTAL PACKETS: <span className="text-indigo-400">{packets.length}</span></div>
        <div className="flex items-center gap-4">
          <span>CONSENSUS NODES: 5</span>
          <span className="text-emerald-500">SYSTEM STABLE</span>
        </div>
      </div>
    </div>
  );
};
