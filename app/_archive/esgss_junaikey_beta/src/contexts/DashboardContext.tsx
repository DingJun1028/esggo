import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DateRange {
  start: string | null;
  end: string | null;
}

interface DashboardState {
  dateRange: DateRange;
  selectedEvidenceId: number | null;
}

interface DashboardContextType extends DashboardState {
  setDateRange: (range: DateRange) => void;
  selectEvidence: (id: number | null) => void;
  clearFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const initialState: DashboardState = {
  dateRange: { start: null, end: null },
  selectedEvidenceId: null,
  // [Eternal Secret] Awakening State
  awakening: {
    isAwakened: true, // System is now permanently awakened
    pillars: {
      SELF_AWARENESS: 100,
      ENLIGHTENING: 100,
      SELF_RELIANCE: 100,
      ALTRUISM: 100,
    },
  },
};

interface AwakeningState {
  isAwakened: boolean;
  pillars: {
    SELF_AWARENESS: number;
    ENLIGHTENING: number;
    SELF_RELIANCE: number;
    ALTRUISM: number;
  };
}

interface DashboardState {
  dateRange: DateRange;
  selectedEvidenceId: number | null;
  awakening?: AwakeningState;
}

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialState.dateRange);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(
    initialState.selectedEvidenceId
  );

  const clearFilters = () => {
    setDateRange(initialState.dateRange);
    setSelectedEvidenceId(initialState.selectedEvidenceId);
  };

  const value = {
    dateRange,
    selectedEvidenceId,
    setDateRange,
    selectEvidence: setSelectedEvidenceId,
    clearFilters,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
