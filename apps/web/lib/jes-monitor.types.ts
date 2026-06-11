export interface EnergyData {
  service: string;
  timestamp: Date;
  emission: number;
  energyConsumption?: number;
  carbonEmission?: number; // Legacy/Compat
}

export interface Conflict {
  id: string;
  source: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  service?: string;
  expectedEmission?: number;
  actualEmission?: number;
  difference?: number;
}
