import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type VerificationState = 'PASS' | 'LOCKED' | 'PENDING';

interface StateMachineDisplayProps {
  state: VerificationState;
  className?: string;
}

export const StateMachineDisplay: React.FC<StateMachineDisplayProps> = ({
  state,
  className = '',
}) => {
  const isPass = state === 'PASS';
  const isLocked = state === 'LOCKED';

  const NODE_ENTRY_X = -40;
  const NODE_LOCK_X = 40;
  const PATH_DURATION = 1;

  return (
    <div
      className={`liquid-glass p-8 rounded-2xl overflow-hidden relative border ${isLocked ? 'border-[#ff4d4d]/30' : 'border-white/10'} ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3
              className={`text-lg font-bold flex items-center gap-3 font-display ${isLocked ? 'text-[#ff4d4d]' : 'text-white'}`}
            >
              <div
                className={`size-2 rounded-full animate-pulse ${isLocked ? 'bg-[#ff4d4d]' : 'bg-[#00e676]'}`}
              />
              {isLocked ? '雜湊鎖定 (Hash Lock)' : '驗證過渡門 (Logic Gate)'}
            </h3>
            <p className="text-white/40 text-xs leading-relaxed">
              {isLocked
                ? '數據完整性驗證失敗。系統進入安全鎖定狀態，磁盤寫入已暫停。'
                : '正在通過 5T 協議驗證層。流量目前穩定且資源分配正常。'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isPass ? 'bg-[#00e676]/10 border-[#00e676]/30' : 'bg-white/5 border-white/5 opacity-40'}`}
            >
              <span className="text-xs font-bold font-display">VERIFIED_TOKEN_PASS</span>
              <span className="text-[10px] font-mono">0x00E676</span>
            </div>
            <div
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isLocked ? 'bg-[#ff4d4d]/20 border-[#ff4d4d]/40' : 'bg-white/5 border-white/5 opacity-40'}`}
            >
              <span className="text-xs font-bold font-display">TRUNCATED_HASH_ERROR</span>
              <span className="text-[10px] font-mono text-[#ff4d4d]">0xFF4D4D</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex justify-center items-center py-6">
          <div className="relative flex items-center gap-12">
            {/* Start Node */}
            <div className="flex flex-col items-center gap-3">
              <div
                className={`size-12 rounded-full border-2 flex items-center justify-center transition-all ${isLocked ? 'border-[#ff4d4d] bg-[#ff4d4d]/10' : 'border-[#0df2ee] bg-[#0df2ee]/10 shadow-[0_0_15px_rgba(13,242,238,0.3)]'}`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isLocked ? 'lock' : 'hub'}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">
                Entry
              </span>
            </div>

            {/* Path */}
            <div className="w-24 h-0.5 bg-white/10 relative overflow-hidden">
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${isLocked ? 'from-[#0df2ee] to-[#ff4d4d]' : 'from-[#0df2ee] to-[#00e676]'}`}
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: PATH_DURATION, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 size-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"
                animate={{ x: isLocked ? NODE_LOCK_X : NODE_ENTRY_X }}
              />
            </div>

            {/* End Node */}
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className={`size-16 rounded-full border-4 flex items-center justify-center shadow-xl transition-all ${isLocked ? 'border-[#ff4d4d] bg-[#ff4d4d]/5' : 'border-[#00e676] bg-[#00e676]/5 animate-pulse'}`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: isLocked ? '#ff4d4d' : '#00e676' }}
                  >
                    {isLocked ? 'error_outline' : 'check_circle'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-[#ff4d4d]' : 'text-[#00e676]'}`}
                >
                  {state}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateMachineDisplay;
