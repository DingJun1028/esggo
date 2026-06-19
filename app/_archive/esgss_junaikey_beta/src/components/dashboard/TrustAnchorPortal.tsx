import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Fingerprint, Lock, ShieldCheck, Database, RefreshCw } from 'lucide-react';

interface AnchorItem {
  txId: string;
  hash: string;
  status: 'ANCHORED' | 'VERIFIED';
  time: string;
}

export const TrustAnchorPortal: React.FC = () => {
  const [anchors, setAnchors] = useState<AnchorItem[]>([
    { txId: 'TX-8F2B9C0A', hash: 'e3b0c442...', status: 'VERIFIED', time: '5m ago' },
    { txId: 'TX-4D1E7G8H', hash: 'a5d9f1e2...', status: 'ANCHORED', time: '12m ago' },
    { txId: 'TX-2J3K4L5M', hash: 'c8b7a6d5...', status: 'VERIFIED', time: '1h ago' },
  ]);
  const [isSealing, setIsSealing] = useState(false);

  const sealNewData = () => {
    setIsSealing(true);
    setTimeout(() => {
      const newAnchor: AnchorItem = {
        txId: `TX-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
        hash: Math.random().toString(16).slice(2, 10) + '...',
        status: 'ANCHORED',
        time: 'Just now',
      };
      setAnchors([newAnchor, ...anchors.slice(0, 4)]);
      setIsSealing(false);
    }, 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
            <Fingerprint size={16} />
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-200">
            Trust Anchor Portal (信任門戶)
          </h4>
        </div>
        <button
          onClick={sealNewData}
          disabled={isSealing}
          className="p-1.5 hover:bg-white/5 rounded-lg text-blue-400 disabled:opacity-50 transition-all"
        >
          <RefreshCw size={14} className={isSealing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col">
        {/* Status HUD */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <div className="text-[8px] text-slate-500 uppercase font-black mb-1">
              Ledger Integrity
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[11px] font-bold text-white tracking-tight">PROTECTED</span>
            </div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <div className="text-[8px] text-slate-500 uppercase font-black mb-1">Total Anchors</div>
            <div className="flex items-center gap-2">
              <Database size={14} className="text-blue-400" />
              <span className="text-[11px] font-bold text-white tracking-tight">1,284 UNITS</span>
            </div>
          </div>
        </div>

        {/* Sealing Animation Overlay */}
        <div className="relative flex-1 bg-black/40 rounded-xl border border-white/5 p-4 overflow-y-auto scrollbar-hide">
          <AnimatePresence>
            {isSealing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center flex-col gap-3"
              >
                <Lock size={32} className="text-blue-400 animate-bounce" />
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Sealing 5T Legacy...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <div className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">
              Live Anchoring Stream
            </div>
            {anchors.map(anchor => (
              <motion.div
                key={anchor.txId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded ${
                      anchor.status === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {anchor.status === 'VERIFIED' ? <ShieldCheck size={12} /> : <Lock size={12} />}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-200">{anchor.txId}</div>
                    <div className="text-[8px] text-slate-500 font-mono italic">{anchor.hash}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      anchor.status === 'VERIFIED'
                        ? 'text-emerald-400 bg-emerald-500/5'
                        : 'text-blue-400 bg-blue-500/5'
                    }`}
                  >
                    {anchor.status}
                  </div>
                  <div className="text-[8px] text-slate-600 font-bold mt-1">{anchor.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-500/10 border-t border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={12} className="text-blue-400" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest italic">
            Immutable Legacy Protocol Active
          </span>
        </div>
        <div className="text-[9px] font-mono text-blue-500/50">SHA-256 v2.1</div>
      </div>
    </div>
  );
};
