import { omniLogger, LogCategory } from './omniLogger.js';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge.js';
import { OmniNexus } from './OmniNexus.js';
import { useStrategyStore, StrategicItem } from '../store/useStrategyStore.js';
import { GeminiService, TaskComplexity } from './geminiService.js';

class StrategicIntelligenceService {
  private isRunning = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private processedNodeIds = new Set<string>();

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    omniLogger.info(LogCategory.SYSTEM, 'Strategic Intelligence Engine Started');

    // Check for insights every 10 seconds (simulated "thinking" time)
    this.processingInterval = setInterval(() => this.analyzeKnowledgeGraph(), 10000);
  }

  public stop() {
    if (this.processingInterval) clearInterval(this.processingInterval);
    this.isRunning = false;
    omniLogger.info(LogCategory.SYSTEM, 'Strategic Intelligence Engine Stopped');
  }

  private async analyzeKnowledgeGraph() {
    const graph = OmniKnowledge.getKnowledgeGraph();
    const store = useStrategyStore.getState();

    // Use for...of to support async/await
    for (const [nodeId, node] of graph.nodes.entries()) {
      // Logic: High confidence concept nodes that haven't been processed
      if (
        node.type === 'concept' &&
        node.confidence > 0.85 &&
        !this.processedNodeIds.has(node.id)
      ) {
        this.processedNodeIds.add(node.id);

        // Simulate "Logic Realism" - Deriving strategy from properties
        // In a real DB, we'd query related entities. Here we infer from label.
        const strategy = await this.deriveStrategy(node);

        if (strategy) {
          store.addItem(strategy);

          // Notify via Nexus
          OmniNexus.emit({
            id: `strat-${Date.now()}`,
            source: 'system',
            priority: 'high',
            message: `AI Proposed Strategy: ${strategy.title}`,
            timestamp: Date.now(),
          });
        }
      }
    }
  }

  /**
   * Assess task complexity
   */
  private assessComplexity(node: {
    id: string;
    label: string;
    confidence: number;
    properties?: any;
  }): TaskComplexity {
    // Rule 1: Multiple related properties = Complex
    const propertyCount = node.properties ? Object.keys(node.properties).length : 0;
    if (propertyCount > 5) {
      return TaskComplexity.COMPLEX;
    }

    // Rule 2: Specific high-difficulty keywords
    const complexKeywords = [
      'Transformation',
      'Transformation',
      'Innovation',
      'Innovation',
      'Risk',
      'Risk',
      'Strategy',
      'Strategy',
    ];
    if (complexKeywords.some(kw => node.label.includes(kw))) {
      return TaskComplexity.COMPLEX;
    }

    // Rule 3: Moderate keywords
    const moderateKeywords = ['Governance', 'Compliance', 'Analysis'];
    if (moderateKeywords.some(kw => node.label.includes(kw))) {
      return TaskComplexity.MODERATE;
    }

    // Default: Simple
    return TaskComplexity.SIMPLE;
  }

  private async deriveStrategy(node: {
    id: string;
    label: string;
    confidence: number;
    properties?: any;
  }): Promise<StrategicItem | null> {
    // Priority 1: Try using Gemini API
    try {
      // Intelligent assessment of task complexity
      const complexity = this.assessComplexity(node);

      const geminiResult = await GeminiService.generateStrategy({
        knowledgeNode: {
          id: node.id,
          label: node.label,
          confidence: node.confidence,
          properties: node.properties || {},
        },
        complexity, // Pass complexity
      });

      if (geminiResult) {
        omniLogger.info(
          LogCategory.AI,
          `✨ Gemini strategy generation successful: ${geminiResult.title}`
        );

        return {
          id: `si-gemini-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: geminiResult.title,
          content: geminiResult.content,
          source: 'Gemini AI',
          category: geminiResult.category,
          timestamp: new Date().toISOString().split('T')[0],
          isAiProposed: true,
          sourceNodeId: node.id,
          confidence: node.confidence,
        } as StrategicItem;
      }
    } catch (error) {
      omniLogger.warn(
        LogCategory.AI,
        'Gemini generation failed, falling back to heuristic methods',
        { error }
      );
    }

    // Priority 2: Heuristic backup logic (Original logic)
    return this.deriveStrategyHeuristic(node);
  }

  /**
   * Heuristic strategy generation (Backup method)
   */
  private deriveStrategyHeuristic(node: {
    id: string;
    label: string;
    confidence: number;
    language?: string;
  }): StrategicItem | null {
    // Original heuristic logic (Bilingual Enhanced)
    let titleZh = '';
    let titleEn = '';
    let contentZh = '';
    let contentEn = '';
    let category = 'General';

    if (node.label.includes('Sustainability')) {
      titleZh = `Accelerate ${node.label} Integration`;
      titleEn = `Accelerate ${node.label} Integration`;
      contentZh = `Based on high confidence in "${node.label}", prioritizing supply chain decarbonization actions is recommended.`;
      contentEn = `Based on high confidence in "${node.label}", prioritizing supply chain decarbonization actions is recommended.`;
      category = 'ESG';
    } else if (node.label.includes('Governance')) {
      titleZh = `Strengthen ${node.label} Framework`;
      titleEn = `Strengthen ${node.label} Framework`;
      contentZh = `Detected stability in "${node.label}"; suggesting a review of board composition and transparency policies.`;
      contentEn = `Detected stability in "${node.label}"; suggesting a review of board composition and transparency policies.`;
      category = 'Compliance';
    } else if (node.label.includes('Innovation')) {
      titleZh = `Seize ${node.label} Trends`;
      titleEn = `Seize ${node.label} Trends`;
      contentZh = `Market signals for "${node.label}" are peaking; consider allocating R&D budget to next-gen prototypes.`;
      contentEn = `Market signals for "${node.label}" are peaking; consider allocating R&D budget to next-gen prototypes.`;
      category = 'Growth';
    } else {
      // General backup
      if (Math.random() > 0.5) return null;
      titleZh = `Analyze ${node.label} Impact`;
      titleEn = `Analyze ${node.label} Impact`;
      contentZh = `Significant patterns detected in "${node.label}" requiring strategic review.`;
      contentEn = `Significant patterns detected in "${node.label}" requiring strategic review.`;
      category = 'Observation';
    }

    const isZh = node.language === 'zh-TW' || !node.language; // Default to zh-TW logic if unspecified, or mixed
    const title = isZh ? titleZh : titleEn; // Simple toggle for now, ideally return object with both
    // For full bilingual support in UI, we might need to store both in the item or formatted string
    // Assuming current UI handles single string, we append EN if in ZH mode for "Bilingual" effect requested by user

    const bilingualTitle = `${titleZh} (${titleEn})`;
    const bilingualContent = `${contentZh}\n\n${contentEn}`;

    omniLogger.info(
      LogCategory.AI,
      `🔧 Strategy generated using heuristic method: ${bilingualTitle}`
    );

    return {
      id: `si-heuristic-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: bilingualTitle,
      content: bilingualContent,
      source: 'Omni-Intelligence (Heuristic)',
      category,
      timestamp: new Date().toISOString().split('T')[0],
      isAiProposed: true,
      sourceNodeId: node.id,
      confidence: node.confidence,
    } as StrategicItem;
  }
}

export const StrategicIntelligence = new StrategicIntelligenceService();
