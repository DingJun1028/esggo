import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { ESGAiAssistant } from '../ESGAiAssistant';

interface OmniAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'zh-TW' | 'en-US';
  ultimateState?: any; // [NEW] Ultimate State
}

export const OmniAssistantModal: React.FC<OmniAssistantModalProps> = ({
  isOpen,
  onClose,
  language = 'zh-TW',
  ultimateState,
}) => {
  const isUltimateActive = !!ultimateState?.success;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop with Neural Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content - Premium Glass Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.95, opacity: 0, y: 30, filter: 'blur(10px)' }}
            className={`
                relative w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden
                glass-panel-premium border-[var(--color-border)] shadow-2xl
                ${isUltimateActive ? 'shadow-[0_0_50px_rgba(0,255,255,0.3)] border-aqua-500/30' : 'shadow-[0_0_50px_rgba(168,85,247,0.2)]'}
            `}
          >
            {/* 顶层光效 */}
            <div
              className={`gradient-border-top ${isUltimateActive ? 'from-aqua-400 via-white to-aqua-400' : 'from-purple-500 via-pink-500 to-indigo-500'}`}
            />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-20">
              <div className="flex items-center gap-4">
                <div
                  className={`
                    p-3 rounded-xl transition-all duration-500 relative overflow-hidden group
                    ${isUltimateActive ? 'bg-aqua-500 shadow-lg shadow-aqua-500/40' : 'bg-white/5 border border-white/10 hover:border-purple-500/50'}
                `}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isUltimateActive ? (
                    <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" />
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    {isUltimateActive ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua-300 via-white to-aqua-300 animate-text-shimmer">
                        {language === 'zh-TW' ? '奧秘千面 · 代理合一' : 'OMNI THOUSAND-FACES'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        OMNI <span className="text-purple-400 font-light">INTELLIGENCE</span>
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isUltimateActive ? 'bg-aqua-400 animate-pulse' : 'bg-emerald-500'}`}
                    />
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                      {isUltimateActive
                        ? language === 'zh-TW'
                          ? '系統共識 · 全知模式'
                          : 'CONSENSUS_REACHED · ALL-KNOWING'
                        : language === 'zh-TW'
                          ? '奧秘晶體 · 智慧中樞'
                          : 'NEURAL_HUB · ONLINE'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Status Indicator */}
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-3 bg-emerald-500 rounded-full animate-music-bar-1" />
                    <div className="w-0.5 h-3 bg-emerald-500 rounded-full animate-music-bar-2" />
                    <div className="w-0.5 h-3 bg-emerald-500 rounded-full animate-music-bar-3" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Listening</span>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group border border-transparent hover:border-white/10"
                >
                  <X className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-1">
              <ESGAiAssistant language={language} isUltimateActive={isUltimateActive} />
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none -z-10 bg-grid-white/[0.02]" />
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000 ${isUltimateActive ? 'bg-aqua-500' : 'bg-purple-900'}`}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
