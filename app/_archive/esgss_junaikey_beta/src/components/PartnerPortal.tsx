import React, { useState } from 'react';
import { Language } from '@/types';
import { motion } from 'framer-motion';
import {
  Network,
  Handshake,
  Shield,
  FileText,
  Search,
  UserPlus,
  Sliders,
  Globe,
} from 'lucide-react';

export const PartnerPortal: React.FC<{ language?: Language }> = ({ language = 'zh-TW' }) => {
  const isZh = language === 'zh-TW';
  const [activeTab, setActiveTab] = useState<'suppliers' | 'invitations'>('suppliers');

  return (
    <div className="h-full p-6 lg:p-10 space-y-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
            {isZh ? '聯盟同盟陣線' : 'Alliance Front'}
          </h1>
          <p className="text-blue-400/60 font-mono mt-2 tracking-wider uppercase text-[10px]">
            {isZh
              ? 'SUPPLY CHAIN SYNERGY // 全域生態協作空間'
              : 'SUPPLY CHAIN SYNERGY // GLOBAL ECOSYSTEM NUCLEUS'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder={isZh ? '搜尋合作夥伴...' : 'Search partners...'}
              className="pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> {isZh ? '邀請夥伴' : 'Invite Partner'}
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">142</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Active Partners</div>
          </div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">96%</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Compliance Rate</div>
          </div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">28</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Pending Audits</div>
          </div>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Global</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Scope 3 Impact</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden min-h-[500px]">
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-8 py-4 text-xs font-bold tracking-widest relative transition-colors ${activeTab === 'suppliers' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {isZh ? '供應鏈網絡' : 'SUPPLIER NETWORK'}
            {activeTab === 'suppliers' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-8 py-4 text-xs font-bold tracking-widest relative transition-colors ${activeTab === 'invitations' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {isZh ? '待處理邀請' : 'PENDING INVITATIONS'}
            {activeTab === 'invitations' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'suppliers' ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white border border-white/10">
                      S{i}
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-blue-300 transition-colors">
                        Supplier Alpha {i} Corp.
                      </h4>
                      <p className="text-xs text-slate-500">
                        Tier 1 • Manufacturing • Connected since 2024
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase">Risk Score</div>
                      <div className="text-emerald-400 font-mono font-bold">LOW</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase">Data Sync</div>
                      <div className="text-white font-mono font-bold">LIVE</div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <Sliders className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Handshake className="w-16 h-16 mb-4 opacity-50" />
              <p>No pending invitations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
