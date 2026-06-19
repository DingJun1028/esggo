import { omniLogger, LogCategory } from './omniLogger';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge';
import { OmniNexus } from './OmniNexus';
import { useStrategyStore, StrategicItem } from '../store/useStrategyStore';
import { GeminiService, TaskComplexity } from './geminiService';

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

    // 改用 for...of 以支援 async/await
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
            message: `AI 提案策略: ${strategy.title}`,
            timestamp: Date.now(),
          });
        }
      }
    }
  }

  /**
   * 評估任務複雜度
   */
  private assessComplexity(node: {
    id: string;
    label: string;
    confidence: number;
    properties?: any;
  }): TaskComplexity {
    // 規則 1：多個相關屬性 = 複雜
    const propertyCount = node.properties ? Object.keys(node.properties).length : 0;
    if (propertyCount > 5) {
      return TaskComplexity.COMPLEX;
    }

    // 規則 2：特定高難度關鍵字
    const complexKeywords = [
      '轉型',
      'Transformation',
      '創新',
      'Innovation',
      '風險',
      'Risk',
      '策略',
      'Strategy',
    ];
    if (complexKeywords.some(kw => node.label.includes(kw))) {
      return TaskComplexity.COMPLEX;
    }

    // 規則 3：中等關鍵字
    const moderateKeywords = ['治理', 'Governance', '合規', 'Compliance', '分析', 'Analysis'];
    if (moderateKeywords.some(kw => node.label.includes(kw))) {
      return TaskComplexity.MODERATE;
    }

    // 預設簡單
    return TaskComplexity.SIMPLE;
  }

  private async deriveStrategy(node: {
    id: string;
    label: string;
    confidence: number;
    properties?: any;
  }): Promise<StrategicItem | null> {
    // 第一優先：嘗試使用 Gemini API
    try {
      // 智能評估任務複雜度
      const complexity = this.assessComplexity(node);

      const geminiResult = await GeminiService.generateStrategy({
        knowledgeNode: {
          id: node.id,
          label: node.label,
          confidence: node.confidence,
          properties: node.properties || {},
        },
        complexity, // 傳遞複雜度
      });

      if (geminiResult) {
        omniLogger.info(LogCategory.AI, `✨ Gemini 生成策略成功: ${geminiResult.title}`);

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
      omniLogger.warn(LogCategory.AI, 'Gemini 生成失敗，回退到啟發式方法', { error });
    }

    // 第二優先：啟發式備援邏輯（原有邏輯）
    return this.deriveStrategyHeuristic(node);
  }

  /**
   * 啟發式策略生成（備援方法）
   */
  private deriveStrategyHeuristic(node: {
    id: string;
    label: string;
    confidence: number;
    language?: string;
  }): StrategicItem | null {
    // 原有的啟發式邏輯 (Bilingual Enhanced)
    let titleZh = '';
    let titleEn = '';
    let contentZh = '';
    let contentEn = '';
    let category = 'General';

    if (node.label.includes('Sustainability') || node.label.includes('永續')) {
      titleZh = `加速${node.label}整合`;
      titleEn = `Accelerate ${node.label} Integration`;
      contentZh = `基於對「${node.label}」的高度信心，建議優先推動供應鏈脫碳行動。`;
      contentEn = `Based on high confidence in "${node.label}", prioritizing supply chain decarbonization actions is recommended.`;
      category = 'ESG';
    } else if (node.label.includes('Governance') || node.label.includes('治理')) {
      titleZh = `強化${node.label}框架`;
      titleEn = `Strengthen ${node.label} Framework`;
      contentZh = `偵測到「${node.label}」的穩定性，建議利用此契機審查董事會組成和透明度政策。`;
      contentEn = `Detected stability in "${node.label}"; suggesting a review of board composition and transparency policies.`;
      category = 'Compliance';
    } else if (node.label.includes('Innovation') || node.label.includes('創新')) {
      titleZh = `把握${node.label}趨勢`;
      titleEn = `Seize ${node.label} Trends`;
      contentZh = `市場對「${node.label}」的信號正在達到高峰，建議分配研發預算至下一代原型。`;
      contentEn = `Market signals for "${node.label}" are peaking; consider allocating R&D budget to next-gen prototypes.`;
      category = 'Growth';
    } else {
      // 奧秘備援 (Omni Fallback)
      if (Math.random() > 0.5) return null;
      titleZh = `分析${node.label}影響`;
      titleEn = `Analyze ${node.label} Impact`;
      contentZh = `在「${node.label}」中偵測到顯著模式，需要策略審查。`;
      contentEn = `Significant patterns detected in "${node.label}" requiring strategic review.`;
      category = 'Observation';
    }

    const isZh = node.language === 'zh-TW' || !node.language; // Default to zh-TW logic if unspecified, or mixed
    const title = isZh ? titleZh : titleEn; // Simple toggle for now, ideally return object with both
    // For full bilingual support in UI, we might need to store both in the item or formatted string
    // Assuming current UI handles single string, we append EN if in ZH mode for "Bilingual" effect requested by user

    const bilingualTitle = `${titleZh} (${titleEn})`;
    const bilingualContent = `${contentZh}\n\n${contentEn}`;

    omniLogger.info(LogCategory.AI, `🔧 使用啟發式方法生成策略: ${bilingualTitle}`);

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
