import React from 'react';
import { OmniBoundary } from './OmniBoundary';
import { OmniIndicator } from './OmniIndicator';
import { OmniLabel } from './OmniLabel';

interface OmniComponentProps {
  title: string;
  resonance?: number;
  healing?: number;
  status?: 'LOCKED' | 'SYNCING' | 'RESONATING';
  children: React.ReactNode;
  className?: string;
}

/**
 * 💎 奧秘元件 / Omni Component
 * --------------------------------------------------
 * [TC] 奧秘系列的旗艦組件，整合了邊界密封、狀態指示與雙語標籤。
 * [EN] The flagship component of the Omni Series, integrating boundary sealing,
 *      status indication, and bi-directional labeling.
 */
export const OmniComponent: React.FC<OmniComponentProps> = ({
  title,
  resonance = 0.5,
  healing = 1.0,
  status = 'LOCKED',
  children,
  className,
}) => {
  return (
    <OmniBoundary title={title} status={status} className={`min-w-[280px] ${className}`}>
      <div className="flex flex-col gap-4">
        {/* Top Status Bar */}
        <div className="flex gap-2 flex-wrap">
          <OmniIndicator type="RESONANCE" level={resonance} />
          {healing < 1.0 && <OmniIndicator type="HEALING" level={healing} />}
        </div>

        {/* Content Area */}
        <div className="py-2">{children}</div>

        {/* Semantic Labeling */}
        <div className="flex justify-between items-center opacity-70">
          <OmniLabel term={title} size="xs" className="text-[#0df2ee]" />
          <div className="text-[8px] font-mono text-slate-600">
            {new Date().toISOString().split('T')[0]} // V6_ACTIVE
          </div>
        </div>
      </div>
    </OmniBoundary>
  );
};
