import { create } from 'zustand';

interface ESGMetrics {
  totalCO2e: number;
  itEnergyKWh: number;
  anchoredCount: number;
  recentAnchors: Array<{
    id: string;
    type: string;
    hash: string;
    timestamp: string;
  }>;
}

interface ESGState extends ESGMetrics {
  updateMetrics: (update: Partial<ESGMetrics>) => void;
  addAnchor: (anchor: { id: string; type: string; hash: string }) => void;
}

export const useESGStore = create<ESGState>(set => ({
  totalCO2e: 1250.4, // Mock initial data
  itEnergyKWh: 450.2,
  anchoredCount: 12,
  recentAnchors: [],
  updateMetrics: update => set(state => ({ ...state, ...update })),
  addAnchor: anchor =>
    set(state => ({
      anchoredCount: state.anchoredCount + 1,
      recentAnchors: [
        { ...anchor, timestamp: new Date().toISOString() },
        ...state.recentAnchors,
      ].slice(0, 5),
    })),
}));
