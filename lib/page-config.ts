import React from 'react';

export type T5Level = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export interface PageAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface PageKpi {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  verified?: boolean;
  gri?: string;
  formula?: string;
  color?: string;
}

export interface PageSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  columns: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 12; // Bento grid columns
  component: React.ReactNode;
  actions?: PageAction[];
  hidden?: boolean;
}

export interface UniversalPageConfig {
  id: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  griReference?: string;
  activeT5Tags: T5Level[];
  
  // High-level UI Slots
  primaryActions?: PageAction[];
  kpis?: PageKpi[];
  
  // Content Structure
  sections: PageSection[];
  
  // Feature Toggles
  features?: {
    useSelectionHouse?: boolean;
    useProvenance?: boolean;
    useVoiceInput?: boolean;
    useAuditLog?: boolean;
  };

  // Branding Overrides
  theme?: 'berkeley' | 'dark-navy' | 'minimal-blue';
  isOXModule?: boolean;
}

/**
 * Standard mapping for 5T Integrity Descriptions
 */
export const T5_LABELS: Record<T5Level, { label: string; desc: string; color: string }> = {
  T1: { label: 'Tangible',    desc: '數據可感知、具體化', color: '#3B7EA1' },
  T2: { label: 'Traceable',   desc: '來源可追溯、具備憑證', color: '#22C55E' },
  T3: { label: 'Trackable',   desc: '軌跡可監測、完整日誌', color: '#FDB515' },
  T4: { label: 'Transparent', desc: '算法透明、無 AI 幻覺', color: '#EF4444' },
  T5: { label: 'Trustworthy', desc: '主權封印、不可篡改', color: '#8B5CF6' },
};
