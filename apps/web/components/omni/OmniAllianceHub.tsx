'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Network, Link as LinkIcon, ShieldCheck, Activity } from 'lucide-react';

interface AllianceNode {
  id: string;
  name: string;
  type: 'core' | 'supplier' | 'auditor' | 'regulator';
  trustScore: number;
  status: 'active' | 'syncing' | 'offline';
}

const MOCK_NODES: AllianceNode[] = [
  { id: 'node_1', name: 'Global Supply Chain Alpha', type: 'supplier', trustScore: 98.5, status: 'active' },
  { id: 'node_2', name: 'SGS Auditing Network', type: 'auditor', trustScore: 99.9, status: 'syncing' },
  { id: 'node_3', name: 'EU CBAM Registry', type: 'regulator', trustScore: 100, status: 'active' },
  { id: 'node_4', name: 'EcoLogistics Partners', type: 'supplier', trustScore: 92.0, status: 'active' },
];

export default function OmniAllianceHub() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 bg-[#020617] rounded-3xl border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Globe size={24} className="text-blue-400" />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-widest">
              Alliance Hub
            </h2>
          </div>
          <p className="text-slate-400 text-sm tracking-wide">
            ESG Ecosystem & Supply Chain Trust Network
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
            <Network size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-slate-300">Total Nodes: 1,402</span>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">Network Trusted</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Col: Nodes List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Users size={16} className="text-blue-400" /> Connected Partners
          </h3>
          <div className="space-y-3">
            {MOCK_NODES.map((node) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeNode === node.id 
                    ? 'bg-blue-500/10 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-200">{node.name}</span>
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${node.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-1 bg-white/5 rounded-md text-slate-400 capitalize">{node.type}</span>
                  <span className="text-blue-400 font-mono">TS: {node.trustScore}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Col: Network Visualization & Data */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 bg-black/40 rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
            {/* Visual placeholder for graph topology */}
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none rounded-3xl" />
            <Activity size={48} className="text-blue-500/30 mb-4 animate-pulse" />
            <p className="text-slate-400 font-mono text-sm tracking-widest">
              [ OMNI_TOPOLOGY_RENDERER_ACTIVE ]
            </p>
            <p className="text-xs text-slate-500 mt-2">Select a node to view causal relationships</p>
          </div>
          
          <div className="h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/40">
                <LinkIcon size={20} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-bold">ZKP Cross-Verification</h4>
                <p className="text-xs text-slate-400">Real-time supply chain emission syncing</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-colors">
              Establish Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
