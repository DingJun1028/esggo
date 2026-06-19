import { ESGMetric } from '../types/esg-schema';

// ESG卡牌類型定義
export interface ESGCard {
  id: string;
  type: 'event' | 'problem' | 'solution' | 'resource' | 'unit' | 'artifact' | 'enchantment' | 'legendary';
  title: string;
  description: string;
  esgCategory: 'E' | 'S' | 'G';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  cost?: number;
  status?: 'active' | 'resolved' | 'pending';
  effects?: string[];
  aiInsight?: string;
  relatedMetrics?: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

// ESG卡牌服務
export class ESGCardService {
  private cards: Map<string, ESGCard> = new Map();

  // 從ESG指標生成事件卡牌
  generateEventCardsFromMetrics(metrics: ESGMetric[]): ESGCard[] {
    const eventCards: ESGCard[] = [];

    metrics.forEach(metric => {
      // 檢查是否觸發事件條件
      if (this.shouldGenerateEventCard(metric)) {
        const eventCard = this.createEventCard(metric);
        eventCards.push(eventCard);
        this.cards.set(eventCard.id, eventCard);
      }

      // 檢查是否需要生成問題狀況卡
      if (this.shouldGenerateProblemCard(metric)) {
        const problemCard = this.createProblemCard(metric);
        eventCards.push(problemCard);
        this.cards.set(problemCard.id, problemCard);
      }
    });

    return eventCards;
  }

  // 從問題狀況卡生成解決方案卡牌
  generateSolutionCard(problemCard: ESGCard): ESGCard {
    const solutionCard = this.createSolutionCard(problemCard);
    this.cards.set(solutionCard.id, solutionCard);
    return solutionCard;
  }

  // 激活卡牌效果
  activateCard(cardId: string): void {
    const card = this.cards.get(cardId);
    if (!card) return;

    // 根據卡牌類型執行相應邏輯
    switch (card.type) {
      case 'event':
        this.handleEventCardActivation(card);
        break;
      case 'problem':
        this.handleProblemCardActivation(card);
        break;
      case 'solution':
        this.handleSolutionCardActivation(card);
        break;
      case 'resource':
        this.handleResourceCardActivation(card);
        break;
      case 'unit':
        this.handleUnitCardActivation(card);
        break;
      case 'artifact':
        this.handleArtifactCardActivation(card);
        break;
      case 'enchantment':
        this.handleEnchantmentCardActivation(card);
        break;
      case 'legendary':
        this.handleLegendaryCardActivation(card);
        break;
    }
  }

  // 解析卡牌
  resolveCard(cardId: string): void {
    const card = this.cards.get(cardId);
    if (!card) return;

    card.status = 'resolved';
    card.resolvedAt = new Date();

    // 觸發解析後的邏輯
    this.handleCardResolution(card);
  }

  // 獲取所有活躍卡牌
  getActiveCards(): ESGCard[] {
    return Array.from(this.cards.values()).filter(card => card.status === 'active');
  }

  // 根據ESG類型獲取卡牌
  getCardsByESGCategory(category: 'E' | 'S' | 'G'): ESGCard[] {
    return Array.from(this.cards.values()).filter(card => card.esgCategory === category);
  }

  // 獲取待處理的問題卡牌
  getPendingProblemCards(): ESGCard[] {
    return Array.from(this.cards.values()).filter(
      card => card.type === 'problem' && card.status === 'active'
    );
  }

  // 私有方法：判斷是否需要生成事件卡
  private shouldGenerateEventCard(metric: ESGMetric): boolean {
    // 基於指標值的變化幅度判斷
    const threshold = metric.risk_threshold || 0;
    return Math.abs(metric.value - (metric.trend || 0)) > threshold * 0.1;
  }

  // 私有方法：判斷是否需要生成問題卡
  private shouldGenerateProblemCard(metric: ESGMetric): boolean {
    const threshold = metric.risk_threshold || 0;
    return metric.value > threshold && metric.confidence !== 'HIGH_PRECISION';
  }

  // 私有方法：創建事件卡
  private createEventCard(metric: ESGMetric): ESGCard {
    const severity = this.calculateSeverity(metric);
    const aiInsight = this.generateAIInsight(metric, 'event');

    return {
      id: `event-${metric.label}-${Date.now()}`,
      type: 'event',
      title: `${metric.label}指標波動事件`,
      description: `${metric.category}類指標${metric.label}發生顯著波動，當前值為${metric.value}${metric.unit}`,
      esgCategory: metric.category as 'E' | 'S' | 'G',
      severity,
      status: 'active',
      effects: [
        '觸發AI洞察分析',
        '可能引發相關問題狀況',
        '影響ESG總分計算'
      ],
      aiInsight,
      relatedMetrics: [metric.label],
      createdAt: new Date()
    };
  }

  // 私有方法：創建問題卡
  private createProblemCard(metric: ESGMetric): ESGCard {
    const severity = this.calculateSeverity(metric);
    const aiInsight = this.generateAIInsight(metric, 'problem');

    return {
      id: `problem-${metric.label}-${Date.now()}`,
      type: 'problem',
      title: `${metric.label}指標異常問題`,
      description: `${metric.category}類指標${metric.label}超出風險閾值，需立即關注和處理`,
      esgCategory: metric.category as 'E' | 'S' | 'G',
      severity,
      cost: severity === 'high' ? 3 : severity === 'critical' ? 5 : 1,
      status: 'active',
      effects: [
        '降低ESG評分',
        '觸發解決方案建議',
        '影響企業聲譽'
      ],
      aiInsight,
      relatedMetrics: [metric.label],
      createdAt: new Date()
    };
  }

  // 私有方法：創建解決方案卡
  private createSolutionCard(problemCard: ESGCard): ESGCard {
    const aiInsight = this.generateSolutionInsight(problemCard);

    return {
      id: `solution-${problemCard.id.split('-').slice(1).join('-')}`,
      type: 'solution',
      title: `${problemCard.title}的解決方案`,
      description: `針對${problemCard.title}的專門解決策略和行動方案`,
      esgCategory: problemCard.esgCategory,
      severity: 'low',
      cost: problemCard.cost ? problemCard.cost + 1 : 2,
      status: 'pending',
      effects: [
        '恢復ESG指標正常值',
        '提升企業永續表現',
        '賺取善意幣獎勵'
      ],
      aiInsight,
      relatedMetrics: problemCard.relatedMetrics,
      createdAt: new Date()
    };
  }

  // 私有方法：計算嚴重程度
  private calculateSeverity(metric: ESGMetric): 'low' | 'medium' | 'high' | 'critical' {
    const threshold = metric.risk_threshold || 0;
    const deviation = Math.abs(metric.value - threshold) / threshold;

    if (deviation > 0.5) return 'critical';
    if (deviation > 0.3) return 'high';
    if (deviation > 0.1) return 'medium';
    return 'low';
  }

  // 私有方法：生成AI洞察
  private generateAIInsight(metric: ESGMetric, cardType: 'event' | 'problem'): string {
    if (cardType === 'event') {
      return `ESG指標${metric.label}發生波動，建議監控相關趨勢並評估潛在影響。`;
    } else {
      return `指標${metric.label}異常可能由多種因素造成，建議進行根本原因分析並制定改善計劃。`;
    }
  }

  // 私有方法：生成解決方案洞察
  private generateSolutionInsight(problemCard: ESGCard): string {
    return `針對${problemCard.title}，建議實施具體的改善措施，包括流程優化、資源分配調整和監控機制建立。`;
  }

  // 私有方法：處理不同類型卡牌的激活
  private handleEventCardActivation(card: ESGCard): void {
    // 事件卡激活後，觸發AI分析和通知
    console.log(`事件卡 ${card.title} 已激活，觸發AI分析流程`);
  }

  private handleProblemCardActivation(card: ESGCard): void {
    // 問題卡激活後，生成解決方案建議
    console.log(`問題卡 ${card.title} 已激活，生成解決方案`);
  }

  private handleSolutionCardActivation(card: ESGCard): void {
    // 解決方案卡激活後，執行改善計劃
    console.log(`解決方案卡 ${card.title} 已激活，開始執行`);
  }

  private handleResourceCardActivation(card: ESGCard): void {
    // 資源卡激活後，提供額外資源
    console.log(`資源卡 ${card.title} 已激活，資源已分配`);
  }

  private handleUnitCardActivation(card: ESGCard): void {
    // 單位卡激活後，部署代理或團隊
    console.log(`單位卡 ${card.title} 已激活，單位已部署`);
  }

  private handleArtifactCardActivation(card: ESGCard): void {
    // 人工製品卡激活後，提供特殊工具或權限
    console.log(`人工製品卡 ${card.title} 已激活，工具已啟用`);
  }

  private handleEnchantmentCardActivation(card: ESGCard): void {
    // 結界卡激活後，應用持續效果
    console.log(`結界卡 ${card.title} 已激活，持續效果已應用`);
  }

  private handleLegendaryCardActivation(card: ESGCard): void {
    // 傳說卡激活後，觸發重大系統變革
    console.log(`傳說卡 ${card.title} 已激活，系統進化已觸發`);
  }

  // 私有方法：處理卡牌解析
  private handleCardResolution(card: ESGCard): void {
    // 卡牌解析後的清理和記錄
    console.log(`卡牌 ${card.title} 已解決，記錄至永恆實錄`);

    // 如果是問題卡解析，觸發善意幣獎勵
    if (card.type === 'problem') {
      this.awardGoodwillCoins(card);
    }
  }

  // 私有方法：獎勵善意幣
  private awardGoodwillCoins(card: ESGCard): void {
    const reward = card.cost ? card.cost * 10 : 50;
    console.log(`因解決問題獲得 ${reward} 善意幣`);
  }
}

// 導出單例實例
export const esgCardService = new ESGCardService();