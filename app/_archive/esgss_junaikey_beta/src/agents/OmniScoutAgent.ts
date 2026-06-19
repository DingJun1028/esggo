import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * 🕵️ 奧秘代理：自動化採集協議 (OmniScout Agent)
 * --------------------------------------------------
 * 核心職能：自動採集 (Auto-Mining)
 * 歸屬角色：善向永續 · 營運長 (COO)
 * 邏輯：模擬 24/7 自動挖掘 ESG 知識點 (KP)
 */

export interface KnowledgePoint {
  id: string;
  domain: 'Environment' | 'Social' | 'Governance';
  title: string;
  value: number; // 1-10
  timestamp: number;
  source: string;
}

export class OmniScoutAgent {
  private isRunning: boolean = false;
  private miningRateMs: number = 3000; // Mining speed
  private accumulatedKP: number = 0;

  constructor(private onKpMined: (kp: KnowledgePoint) => void) {}

  public startMining() {
    if (this.isRunning) return;
    this.isRunning = true;
    omniLogger.info(LogCategory.SYSTEM, '[OmniScoutAgent] 🚀 OmniScout Agent: Auto-Mining Protocol Activated.');

    this.mineLoop();
  }

  public stopMining() {
    this.isRunning = false;
    omniLogger.info(LogCategory.SYSTEM, '[OmniScoutAgent] 🛑 OmniScout Agent: Protocol Paused.');
  }

  private mineLoop() {
    if (!this.isRunning) return;

    setTimeout(() => {
      if (!this.isRunning) return;

      const domains = ['Environment', 'Social', 'Governance'] as const;
      const domain = domains[Math.floor(Math.random() * domains.length)] as
        | 'Environment'
        | 'Social'
        | 'Governance';

      const newKp: KnowledgePoint = {
        id: crypto.randomUUID(),
        domain,
        title: `Auto-Mined ${domain} Intel #${Math.floor(Math.random() * 1000)}`,
        value: Math.floor(Math.random() * 5) + 1,
        timestamp: Date.now(),
        source: 'Deep Web Scraper (COO-Auth)',
      };

      this.accumulatedKP += newKp.value;
      this.onKpMined(newKp);

      // Re-trigger loop
      this.mineLoop();
    }, this.miningRateMs);
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      totalMined: this.accumulatedKP,
    };
  }
}
