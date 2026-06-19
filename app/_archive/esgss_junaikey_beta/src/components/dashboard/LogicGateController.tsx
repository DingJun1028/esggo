import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, CheckCircle2, XCircle, ShieldCheck, Box, RotateCw } from 'lucide-react';

interface GateCheck {
  id: string;
  label: string;
  subLabel: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  type: 'CAN' | 'CANNOT';
}

export const LogicGateController: React.FC = () => {
  const [checks, setChecks] = useState<GateCheck[]>([
    {
      id: 'tangible',
      label: '可感知 (Tangible)',
      subLabel: '指標具體化: Impact_Metric_v1',
      status: 'PENDING',
      type: 'CAN',
    },
    {
      id: 'traceable',
      label: '可溯源 (Traceable)',
      subLabel: '原始來源: source_origin',
      status: 'PENDING',
      type: 'CAN',
    },
    {
      id: 'trackable',
      label: '可追蹤 (Trackable)',
      subLabel: '生命週期 Hook: Pathway',
      status: 'PENDING',
      type: 'CAN',
    },
    {
      id: 'transparent',
      label: '可透明驗算 (Transparent)',
      subLabel: '公開公式: [ISO-14064-1]',
      status: 'PENDING',
      type: 'CAN',
    },
    {
      id: 'trustworthy',
      label: '不可篡改 (Trustworthy)',
      subLabel: '雜湊鎖定: Hash Locked',
      status: 'PENDING',
      type: 'CANNOT',
    },
  ]);
  const [isLocked, setIsLocked] = useState(false);

  const runValidation = async () => {
    setIsLocked(false);
    setChecks(prev => prev.map(c => ({ ...c, status: 'PENDING' })));

    for (let i = 0; i < checks.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setChecks(prev => {
        const next = [...prev];
        const item = next[i];
        if (item) {
          item.status = 'SUCCESS';
        }
        return next;
      });
    }

    await new Promise(r => setTimeout(r, 600));
    setIsLocked(true);
  };

  useEffect(() => {
    runValidation();
  }, []);

  return (
    <div className="p-6 bg-[#0a1111]/60 border border-[#09abb3]/20 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      {/* Decorative background pulse */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#09abb3]/5 rounded-full blur-3xl group-hover:bg-[#09abb3]/10 transition-all duration-1000" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${isLocked ? 'bg-[#09abb3]/20 text-[#09abb3]' : 'bg-blue-500/20 text-blue-400'} border border-current opacity-80`}
          >
            <ShieldCheck size={18} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#09abb3]">
              5T Logic Gate Controller
            </h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              State Machine Verification
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ rotate: 180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={runValidation}
          className="p-2 hover:bg-[#09abb3]/10 rounded-xl text-slate-400 hover:text-[#09abb3] transition-all border border-transparent hover:border-[#09abb3]/20"
        >
          <RotateCw size={16} />
        </motion.button>
      </div>

      <div className="space-y-3 relative z-10">
        {checks.map((check, idx) => (
          <motion.div
            key={check.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group/item"
          >
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border transition-all duration-500 ${check.status === 'SUCCESS'
                ? 'border-[#09abb3]/30 shadow-[inset_0_0_20px_rgba(9,171,179,0.05)]'
                : 'border-white/5'
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`text-[10px] font-mono font-black w-6 text-center ${check.status === 'SUCCESS' ? 'text-[#09abb3]' : 'text-slate-600'
                    }`}
                >
                  {idx + 1}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold transition-colors ${check.status === 'SUCCESS' ? 'text-white' : 'text-slate-500'
                      }`}
                  >
                    {check.label}
                  </span>
                  <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none mt-1">
                    {check.subLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[8px] px-2 py-0.5 rounded-md uppercase font-black tracking-tighter border transition-all ${check.type === 'CAN'
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                    }`}
                >
                  {check.type}
                </span>
                <AnimatePresence mode="wait">
                  {check.status === 'SUCCESS' ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      <CheckCircle2 size={16} className="text-[#09abb3] drop-shadow-[0_0_8px_#09abb3]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-4 h-4 border-2 border-[#09abb3]/20 border-t-[#09abb3] rounded-full animate-spin"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            className="p-4 bg-[#09abb3]/10 border border-[#09abb3]/30 rounded-2xl flex items-center justify-between shadow-[0_0_30px_rgba(9,171,179,0.1)] relative z-10"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#09abb3] rounded-lg text-black shadow-lg shadow-[#09abb3]/20">
                <Lock size={12} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#09abb3]">
                  Trustworthy Locked
                </span>
                <span className="text-[8px] text-[#09abb3]/60 font-mono">HASH: 0x5D...3F9A</span>
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[9px] text-[#09abb3] font-black tracking-tighter px-2 py-0.5 border border-[#09abb3]/30 rounded uppercase"
            >
              Aligned
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
