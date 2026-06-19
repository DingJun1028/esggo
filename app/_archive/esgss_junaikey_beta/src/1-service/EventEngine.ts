export type EventCategory = 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
export type EventSeverity = 'STABLE' | 'VOLATILE' | 'CRITICAL' | 'BLACK_SWAN';

export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  startTime: number;
  duration: number; // in milliseconds
  modifiers: {
    computePower?: number;
    empathyLevel?: number;
    governanceScore?: number;
  };
  interventionRequired?: boolean;
  rewardXp: number;
}

export class EventEngine {
  private static EVENT_POOL: Partial<WorldEvent>[] = [
    {
      title: '全球碳匯共識 (Global Carbon Consensus)',
      description: '多國達成碳盤點協議，環境治理效率全域提升。',
      category: 'ENVIRONMENTAL',
      modifiers: { computePower: 5, governanceScore: 10 },
      rewardXp: 500,
    },
    {
      title: '供應鏈透明度風暴 (Transparency Storm)',
      description: '大宗商品供應鏈爆發審計危機，全域治理壓力劇增。',
      category: 'GOVERNANCE',
      modifiers: { computePower: -10, governanceScore: 20 },
      rewardXp: 800,
    },
    {
      title: 'AI 倫理倡議週 (AI Ethics Week)',
      description: '全球關注人工智慧情感健康，同理心能值全域激增。',
      category: 'SOCIAL',
      modifiers: { empathyLevel: 25 },
      rewardXp: 400,
    },
    {
      title: '極地氣旋爆發 (Polar Vortex Outbreak)',
      description: '極端氣候席捲全球，能耗激增導致運算力受限。',
      category: 'ENVIRONMENTAL',
      severity: 'CRITICAL',
      modifiers: { computePower: -20, resilience: 10 } as any,
      rewardXp: 1200,
    },
  ];

  public static generateWorldEvent(): WorldEvent {
    const randomIndex = Math.floor(Math.random() * this.EVENT_POOL.length);
    const base = this.EVENT_POOL[randomIndex] ?? this.EVENT_POOL[0]!;
    const severity: EventSeverity = Math.random() > 0.9 ? 'CRITICAL' : 'VOLATILE';

    return {
      id: `W-EVENT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      title: base.title || 'Unknown Event',
      description: base.description || 'No description available.',
      category: base.category || 'ENVIRONMENTAL',
      severity: base.severity || severity,
      startTime: Date.now(),
      duration: 1000 * 60 * 30, // 30 mins
      modifiers: base.modifiers || {},
      interventionRequired: Math.random() > 0.7,
      rewardXp: base.rewardXp || 0,
    };
  }

  public static getActiveModifiers(activeEvents: WorldEvent[]) {
    const totals = {
      computePower: 0,
      empathyLevel: 0,
      governanceScore: 0,
    };

    activeEvents.forEach(ev => {
      totals.computePower += ev.modifiers.computePower || 0;
      totals.empathyLevel += ev.modifiers.empathyLevel || 0;
      totals.governanceScore += ev.modifiers.governanceScore || 0;
    });

    return totals;
  }
}
