import { knowledgeSanctuaryService } from './KnowledgeSanctuaryService.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { v4 as uuidv4 } from 'uuid';

export interface InsightNudge {
  id: string;
  message: string;
  suggestedTask?: any;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  context: string;
}

class ActiveInsightEngine {
  /**
   * Generates proactive nudges by comparing current state (simulated)
   * with top-tier benchmarks from the Knowledge Sanctuary.
   */
  public async generateNudges(): Promise<InsightNudge[]> {
    omniLogger.info(LogCategory.AI, 'Generating proactive insight nudges...');

    const benchmarks = await knowledgeSanctuaryService.getTop10Deconstructions();
    const nudges: InsightNudge[] = [];

    // Logic 1: Carbon Neutrality Nudge
    const apple = benchmarks.find(b => b.company === 'Apple Inc.');
    if (apple) {
      nudges.push({
        id: uuidv4(),
        message: `主祭者，偵測到 ${apple.company} 在「${apple.notableMetric.label}」的揭露邏輯領先業界。`,
        context: apple.contextAnalysis,
        suggestedTask: await knowledgeSanctuaryService.convertToTask(apple.id),
        priority: 'HIGH',
      });
    }

    // Logic 2: Governance/Water Nudge
    const tsmc = benchmarks.find(b => b.company === 'TSMC (台積電)');
    if (tsmc) {
      nudges.push({
        id: uuidv4(),
        message: `偵測到 ${tsmc.company} 具備高維度的治理透明度報告手法。`,
        context: tsmc.visualizationTechnique,
        suggestedTask: await knowledgeSanctuaryService.convertToTask(tsmc.id),
        priority: 'MEDIUM',
      });
    }

    return nudges;
  }
}

export const activeInsightEngine = new ActiveInsightEngine();
