import React from 'react';
import { OmniGlow } from './OmniGlow';

/**
 * 🧧 奧秘邊界容器 / Omni Boundary Container
 * --------------------------------------------------
 * [TC] 奧秘系列的基石容器，具備「液態玻璃」質感與 5T 協議狀態標記。
 * [EN] The cornerstone container of the Omni Series, featuring "Liquid Glass"
 *      aesthetics and 5T Protocol status indicators.
 */
export const OmniBoundary: React.FC<{
  children: React.ReactNode;
  title?: string;
  status?: 'LOCKED' | 'SYNCING' | 'RESONATING' | 'READY';
  className?: string;
}> = ({ children, title, status = 'LOCKED', className }) => {
  return (
    <OmniGlow intensity={status === 'RESONATING' ? 'high' : 'normal'}>
      <div className={`glass-panel-premium p-4 ${className}`}>
        {/* Header Hook */}
        {(title || status) && (
          <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
            {title && (
              <h4 className="text-xs font-black tracking-widest text-[#0df2ee] uppercase">
                {title}
              </h4>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 opacity-60">{status}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  status === 'LOCKED'
                    ? 'bg-red-500 animate-pulse'
                    : status === 'SYNCING'
                      ? 'bg-amber-400 animate-spin'
                      : status === 'READY'
                        ? 'bg-green-500'
                        : 'bg-[#0df2ee] shadow-[0_0_8px_#0df2ee]'
                }`}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10">{children}</div>

        {/* V6 Architecture Watermark */}
        <div className="absolute bottom-1 right-2 pointer-events-none opacity-5">
          <span className="text-[8px] font-black italic tracking-tighter">OMNI-V6-HW</span>
        </div>
      </div>
    </OmniGlow>
  );
};
