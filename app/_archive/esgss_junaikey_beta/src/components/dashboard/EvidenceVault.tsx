import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Link, Database, Search, ChevronDown, CheckCircle } from 'lucide-react';
import { useOmniMemory } from '../../omni/infrastructure/memory/OmniMemory';
import { IEvidence } from '../../omni/core/GoodwardCore';

export const EvidenceVault: React.FC = () => {
  const { palace } = useOmniMemory();
  const evidenceList = palace.theVault.evidenceChain || [];
  const [selectedHash, setSelectedHash] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-black/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Evidence Vault</h3>
            <span className="text-[10px] text-green-500/70 font-mono">
              5T Trusted Verification Chain
            </span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-gray-500">
          Chain Height: {evidenceList.length}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* List Column */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-2 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-2 top-1.5 w-3 h-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search hash or intent..."
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-7 py-1 text-xs text-gray-300 focus:border-green-500/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {evidenceList.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-600 italic">
                No evidence recorded yet.
              </div>
            )}
            {evidenceList.map((ev, idx) => (
              <motion.div
                key={ev.timestamp + idx}
                layoutId={`ev-${ev.timestamp}`}
                onClick={() => setSelectedHash(ev.hash)}
                className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors relative
                    ${selectedHash === ev.hash ? 'bg-green-900/10 border-l-2 border-l-green-500' : 'border-l-2 border-l-transparent'}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono text-green-400 opacity-70">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                  <Link className="w-3 h-3 text-gray-600" />
                </div>
                <div className="text-xs text-gray-200 font-bold truncate">
                  {ev.logicGate.tangible.replace('Analysis: ', '')}
                </div>
                <div className="text-[9px] font-mono text-gray-500 truncate mt-1">{ev.hash}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detail Column */}
        <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedHash ? (
              (() => {
                const activeEv = evidenceList.find(e => e.hash === selectedHash);
                if (!activeEv) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                        <Database className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Verification Block</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-green-900/40 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-mono">
                            VERIFIED
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {new Date(activeEv.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 5T Logic Gate Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(activeEv.logicGate).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col group hover:border-green-500/30 transition-colors"
                        >
                          <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 group-hover:text-green-500 transition-colors">
                            {key}
                          </span>
                          <span className="text-sm font-mono text-gray-200 break-all">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                        Cryptographic Proof
                      </h4>
                      <div className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-[10px] text-gray-400 break-all">
                        {activeEv.hash}
                      </div>
                    </div>
                  </motion.div>
                );
              })()
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <ShieldCheck className="w-16 h-16 stroke-[1] mb-4" />
                <p className="text-sm">Select a block to inspect 5T verification data</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
