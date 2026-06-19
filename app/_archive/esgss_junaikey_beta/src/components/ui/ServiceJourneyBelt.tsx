import React from 'react';
import { motion } from 'framer-motion';

export interface JourneyStep {
  id: string;
  label: string;
  status: 'DONE' | 'CURRENT' | 'PENDING';
  zh_label: string;
}

interface ServiceJourneyBeltProps {
  steps: JourneyStep[];
  className?: string;
}

export const ServiceJourneyBelt: React.FC<ServiceJourneyBeltProps> = ({
  steps,
  className = '',
}) => {
  return (
    <div className={`p-8 rounded-3xl liquid-glass relative overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 w-full gap-6 sm:gap-0">
        {steps.map((step, index) => {
          const isDone = step.status === 'DONE';
          const isCurrent = step.status === 'CURRENT';
          const isPending = step.status === 'PENDING';

          return (
            <React.Fragment key={step.id}>
              {/* Node */}
              <div className="flex flex-col items-center gap-3 sm:gap-4 group">
                <div
                  className={`size-12 sm:size-14 rounded-full border-2 flex items-center justify-center transition-all duration-500
                    ${isDone ? 'bg-[#0df2ee]/20 border-[#0df2ee] text-[#0df2ee] shadow-[0_0_20px_rgba(13,242,238,0.3)]' : ''}
                    ${isCurrent ? 'bg-[#0df2ee] border-[#0df2ee] text-[#102221] shadow-[0_0_30px_rgba(13,242,238,0.5)] halo-pulse' : ''}
                    ${isPending ? 'bg-[#1c2a29] border-[#3b5452] text-[#9cbab7] opacity-50' : ''}
                  `}
                >
                  <span className="material-symbols-outlined text-sm sm:text-base font-bold">
                    {isDone ? 'check' : isCurrent ? 'edit' : 'analytics'}
                  </span>
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs sm:text-sm font-bold transition-all ${isCurrent ? 'text-[#0df2ee] scale-110' : 'text-white'}`}
                  >
                    {step.zh_label}
                  </p>
                  <p className="text-[#9cbab7] text-[8px] sm:text-[10px] uppercase font-bold tracking-widest mt-0.5">
                    {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'WAITING'}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="w-0.5 sm:flex-1 h-6 sm:h-0.5 mx-0 sm:mx-4 transition-all duration-1000">
                  <div
                    className={`w-full h-full rounded-full transition-all duration-1000
                    ${isDone ? 'bg-gradient-to-b sm:bg-gradient-to-r from-[#0df2ee] to-[#0df2ee]/50' : 'bg-[#283938]'}
                  `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
          <span className="material-symbols-outlined text-primary text-xl">info</span>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
              Status Report
            </p>
            <p className="text-sm text-[#9cbab7] leading-relaxed">
              目前正在執行{' '}
              <span className="text-white font-bold">
                {steps.find(s => s.status === 'CURRENT')?.zh_label || '系統待命'}
              </span>{' '}
              模組，所有 5T 數據已連線。
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button className="text-xs font-bold text-white/40 hover:text-white transition-colors">
            SKIP MODULE
          </button>
          <button className="px-5 py-2 rounded-lg bg-[#283938] text-white text-xs font-bold hover:bg-[#344b49] transition-all">
            VIEW LOGS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceJourneyBelt;
