import { interval, Observable, from } from 'rxjs';
import { map, share, startWith, scan } from 'rxjs/operators';

// Data Interfaces
export interface SystemHealthData {
  cpu: number;
  memory: number;
  network: number;
  temperature: number;
  energyEfficiency: number;
}

export interface ESGScoreData {
  timestamp: string;
  environmental: number;
  social: number;
  governance: number;
  total: number;
}

export interface ProjectStatusData {
  name: string;
  value: number;
  fill: string;
}

/**
 * Service to generate simulated real-time data for the dashboard
 * "Simulating the heartbeat of the Omni-System"
 */
export class DashboardDataService {
  private static instance: DashboardDataService;

  private constructor() {}

  public static getInstance(): DashboardDataService {
    if (!DashboardDataService.instance) {
      DashboardDataService.instance = new DashboardDataService();
    }
    return DashboardDataService.instance;
  }

  // === System Health Stream (1s interval) ===
  public getSystemHealthStream(): Observable<SystemHealthData> {
    return interval(1000).pipe(
      map(() => ({
        cpu: Math.floor(Math.random() * 30) + 20, // 20-50% base load
        memory: Math.floor(Math.random() * 20) + 40, // 40-60% base
        network: Math.floor(Math.random() * 50) + 10,
        temperature: Math.floor(Math.random() * 10) + 35, // 35-45C
        energyEfficiency: 90 + Math.random() * 9, // 90-99%
      })),
      // Add some noise/spikes for realism
      map(data => {
        if (Math.random() > 0.9) data.cpu += 20; // Occasional spike
        if (Math.random() > 0.95) data.network += 40;
        return data;
      }),
      share()
    );
  }

  // === ESG Score Trend (Historical + Live) ===
  public getESGTrendData(): Observable<ESGScoreData[]> {
    // Generate static history first
    const history: ESGScoreData[] = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (11 - i));
      return {
        timestamp: month.toLocaleDateString('zh-TW', { month: 'short' }),
        environmental: 70 + i * 1.5 + Math.random() * 5,
        social: 65 + i * 1.2 + Math.random() * 5,
        governance: 75 + i * 0.8 + Math.random() * 5,
        total: 0, // calc later
      };
    }).map(d => ({ ...d, total: Math.round((d.environmental + d.social + d.governance) / 3) }));

    // Emit history immediately, then update occasionally?
    // For now, just return the static history as an Observable
    return from([history]);
  }

  // === Project Distribution (Static for now) ===
  public getProjectDistribution(): ProjectStatusData[] {
    return [
      { name: 'On Track', value: 12, fill: '#10b981' }, // emerald-500
      { name: 'At Risk', value: 3, fill: '#f59e0b' }, // amber-500
      { name: 'Critical', value: 1, fill: '#ef4444' }, // red-500
      { name: 'Completed', value: 8, fill: '#3b82f6' }, // blue-500
    ];
  }
}
