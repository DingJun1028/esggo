import React from 'react';
import { OmniCell, OmniCellProps } from './OmniCell';

interface OmniESGcellProps extends Omit<OmniCellProps, 'label'> {
  type: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  impact?: number; // 0-100
}

/**
 * 🪴 奧秘 ESG 單元格 / Omni ESG Cell
 * --------------------------------------------------
 * [TC] 專為 ESG 指標設計的奧秘單元，整合主題色彩與影響力標記。
 * [EN] Specialized Omni Cell for ESG metrics, integrating thematic colors
 *      and impact markers.
 */
export const OmniESGcell: React.FC<OmniESGcellProps> = ({ type, impact, ...cellProps }) => {
  const config = {
    ENVIRONMENTAL: {
      label: 'Environmental',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/5',
      borderColor: 'group-hover:border-emerald-500/30',
    },
    SOCIAL: {
      label: 'Social',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/5',
      borderColor: 'group-hover:border-rose-500/30',
    },
    GOVERNANCE: {
      label: 'Governance',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/5',
      borderColor: 'group-hover:border-blue-500/30',
    },
  }[type];

  return (
    <OmniCell
      {...cellProps}
      label={config.label}
      className={`${config.bgColor} ${config.borderColor} ${cellProps.className || ''}`}
    />
  );
};
