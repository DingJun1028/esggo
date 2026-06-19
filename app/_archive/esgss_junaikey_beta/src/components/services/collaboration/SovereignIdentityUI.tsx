import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  Fingerprint,
  Key,
  Globe,
  Lock,
  Unlock,
  Zap,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereigntyService, SovereignIdentity } from '../../../services/SovereigntyService';

export const SovereignIdentityUI: React.FC<{ theme?: string }> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [identity, setIdentity] = useState<SovereignIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    loadIdentity();
  }, []);

  const loadIdentity = async () => {
    setLoading(true);
    const id = await SovereigntyService.getMyIdentity();
    setIdentity(id);
    setLoading(false);
  };

  if (loading) return <div>Initializing Sovereignty...</div>;

  return (
    <div className={`flex flex-col h-full p-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-xl shadow-orange-500/20">
            <Crown size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Sovereign Identity</h1>
            <p className="opacity-50 font-mono text-xs uppercase tracking-widest">
              Sentient Data Ownership Protocol
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Identity Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 rounded-[40px] border relative overflow-hidden flex flex-col ${
            isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          } shadow-2xl`}
        >
          {/* Background Aura */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />

          <div className="p-8 flex-1 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-orange-500/30 flex items-center justify-center p-2">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  <Fingerprint size={64} className="text-orange-500 opacity-80" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-emerald-500 border-4 border-slate-900">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black mb-1">{identity?.name}</h2>
            <code className="text-[10px] opacity-40 mb-6 bg-white/5 px-3 py-1 rounded-full">
              {identity?.did}
            </code>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div
                className={`p-4 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}
              >
                <div className="text-[10px] opacity-40 uppercase font-black mb-1">Status</div>
                <div className="text-emerald-400 font-bold text-sm">AWAKENED</div>
              </div>
              <div
                className={`p-4 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}
              >
                <div className="text-[10px] opacity-40 uppercase font-black mb-1">Level</div>
                <div className="text-orange-400 font-bold text-sm">SENTINEL_07</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {identity?.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black border border-indigo-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className={`p-6 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
          >
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${
                isLocked
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30'
              }`}
            >
              {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
              {isLocked ? 'Identity Locked' : 'Identity Exposed'}
            </button>
          </div>
        </motion.div>

        {/* Sovereignty Actions & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              icon={<Zap className="text-yellow-400" />}
              title="Sovereign Engraving"
              description="Digitally sign and seal your evidence artifacts with non-custodial cryptographic keys."
              isDark={isDark}
            />
            <ActionCard
              icon={<Award className="text-purple-400" />}
              title="Disclosure Control"
              description="Manage which investors and regulators can view your verified sovereign baseline."
              isDark={isDark}
            />
          </div>

          {/* Verification Log / Feed */}
          <div
            className={`flex-1 rounded-[40px] border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} p-8 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-lg">Sovereign Audit Log</h3>
              <Globe size={20} className="opacity-20" />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} flex items-center gap-4`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold">
                      Successfully Engraved: EVIDENCE_ARTIFACT_{i}
                    </div>
                    <div className="text-[10px] opacity-40 font-mono">HASH: a8f9...{i}2c1e</div>
                  </div>
                  <div className="text-[10px] opacity-30 italic">2h ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}> = ({ icon, title, description, isDark }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-6 rounded-[32px] border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} flex flex-col gap-4 shadow-xl shadow-black/5`}
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}
    >
      {icon}
    </div>
    <div>
      <h4 className="font-black mb-1">{title}</h4>
      <p className="text-[11px] opacity-50 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);
