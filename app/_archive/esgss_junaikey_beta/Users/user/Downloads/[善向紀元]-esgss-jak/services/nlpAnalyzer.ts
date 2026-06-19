/**
 * ESG自然語言處理分析器
 */

export interface NLPAnalysisInput {
  text: string;
  context: {
    source: 'news' | 'report' | 'social_media' | 'internal';
    language?: string;
    domain?: 'environmental' | 'social' | 'governance';
    targetLanguage?: 'zh-TW' | 'en-US';
  };
}

export interface NLPAnalysisResult {
  sentiment: {
    score: number; // -1 到 1
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  topics: Array<{
    topic: string;
    relevance: number;
    keywords: string[];
  }>;
  entities: Array<{
    type: 'company' | 'person' | 'location' | 'regulation' | 'metric';
    name: string;
    confidence: number;
    context: string;
  }>;
  risks: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    evidence: string;
  }>;
  opportunities: Array<{
    type: string;
    potential: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}

export class NLP_Analyzer {
  private sentimentLexicon: Map<string, number> = new Map();
  private entityPatterns: Map<string, RegExp> = new Map();
  private riskKeywords: Map<string, { type: string; severity: string }> = new Map();
  private opportunityKeywords: Map<string, { type: string; potential: string }> = new Map();

  constructor() {
    this.initializeLexicons();
    this.initializePatterns();
  }

  async analyze(input: NLPAnalysisInput): Promise<NLPAnalysisResult> {
    const { text, context } = input;

    // 預處理文本
    const processedText = this.preprocessText(text, context);

    // 並行分析各個方面
    const [sentiment, topics, entities, risks, opportunities] = await Promise.all([
      this.analyzeSentiment(processedText),
      this.extractTopics(processedText, context),
      this.extractEntities(processedText, context),
      this.identifyRisks(processedText, context),
      this.identifyOpportunities(processedText, context)
    ]);

    return {
      sentiment,
      topics,
      entities,
      risks,
      opportunities
    };
  }

  private preprocessText(text: string, context: any): string {
    // 基本文本清理
    let processed = text
      .trim()
      .replace(/\s+/g, ' ') // 多空格轉單空格
      .replace(/[^\w\s\u4e00-\u9fff.,!?;:"""'()-]/g, ''); // 移除特殊字符，保留中文

    // 根據來源類型調整處理
    if (context.source === 'social_media') {
      processed = processed.replace(/#[^\s]+/g, ''); // 移除hashtags
      processed = processed.replace(/@[^\s]+/g, ''); // 移除mentions
    }

    if (context.source === 'news') {
      processed = processed.replace(/\([^)]*\)/g, ''); // 移除括號內容
      processed = processed.replace(/來源：[^\s]+/g, ''); // 移除來源標記
    }

    return processed;
  }

  private async analyzeSentiment(text: string): Promise<NLPAnalysisResult['sentiment']> {
    // 簡化的情感分析實現
    const words = this.tokenize(text);
    let score = 0;
    let wordCount = 0;

    for (const word of words) {
      const sentiment = this.sentimentLexicon.get(word.toLowerCase());
      if (sentiment !== undefined) {
        score += sentiment;
        wordCount++;
      }
    }

    // 正規化分數到 -1 到 1
    const normalizedScore = wordCount > 0 ? Math.max(-1, Math.min(1, score / wordCount)) : 0;

    // 確定標籤
    let label: 'positive' | 'neutral' | 'negative';
    if (normalizedScore > 0.1) {
      label = 'positive';
    } else if (normalizedScore < -0.1) {
      label = 'negative';
    } else {
      label = 'neutral';
    }

    // 計算信心度
    const confidence = Math.min(1, wordCount / 10); // 基於有情感詞的單詞數量

    return {
      score: normalizedScore,
      label,
      confidence
    };
  }

  private async extractTopics(text: string, context: any): Promise<NLPAnalysisResult['topics']> {
    const topics: NLPAnalysisResult['topics'] = [];

    // ESG相關主題識別
    const esgTopics = [
      {
        keywords: ['碳排放', '溫室氣體', '減碳', '碳中和', '淨零'],
        topic: '碳排放與氣候變遷',
        category: 'environmental'
      },
      {
        keywords: ['能源', '再生能源', '太陽能', '風能', '節能'],
        topic: '能源管理',
        category: 'environmental'
      },
      {
        keywords: ['員工', '勞工', '薪資', '福利', '多元'],
        topic: '員工權益與多元性',
        category: 'social'
      },
      {
        keywords: ['供應鏈', '供應商', '採購', '原物料'],
        topic: '供應鏈管理',
        category: 'social'
      },
      {
        keywords: ['董事會', '治理', '透明', '道德', '貪腐'],
        topic: '公司治理',
        category: 'governance'
      }
    ];

    for (const topicDef of esgTopics) {
      const relevance = this.calculateTopicRelevance(text, topicDef.keywords);
      if (relevance > 0.1) { // 最低相關度門檻
        topics.push({
          topic: topicDef.topic,
          relevance,
          keywords: topicDef.keywords.filter(kw => text.includes(kw))
        });
      }
    }

    // 按相關度排序
    return topics.sort((a, b) => b.relevance - a.relevance);
  }

  private async extractEntities(text: string, context: any): Promise<NLPAnalysisResult['entities']> {
    const entities: NLPAnalysisResult['entities'] = [];

    // 公司名稱識別
    const companyMatches = this.findPatternMatches(text, 'company');
    for (const match of companyMatches) {
      entities.push({
        type: 'company',
        name: match.text,
        confidence: match.confidence,
        context: this.getEntityContext(text, match.start, match.end)
      });
    }

    // 地點識別
    const locationMatches = this.findPatternMatches(text, 'location');
    for (const match of locationMatches) {
      entities.push({
        type: 'location',
        name: match.text,
        confidence: match.confidence,
        context: this.getEntityContext(text, match.start, match.end)
      });
    }

    // 法規識別
    const regulationMatches = this.findPatternMatches(text, 'regulation');
    for (const match of regulationMatches) {
      entities.push({
        type: 'regulation',
        name: match.text,
        confidence: match.confidence,
        context: this.getEntityContext(text, match.start, match.end)
      });
    }

    // 指標識別
    const metricMatches = this.findPatternMatches(text, 'metric');
    for (const match of metricMatches) {
      entities.push({
        type: 'metric',
        name: match.text,
        confidence: match.confidence,
        context: this.getEntityContext(text, match.start, match.end)
      });
    }

    return entities;
  }

  private async identifyRisks(text: string, context: any): Promise<NLPAnalysisResult['risks']> {
    const risks: NLPAnalysisResult['risks'] = [];

    for (const [keyword, riskInfo] of this.riskKeywords.entries()) {
      if (text.includes(keyword)) {
        const severity = riskInfo.severity as 'low' | 'medium' | 'high';
        const risk = {
          type: riskInfo.type,
          severity,
          description: this.generateRiskDescription(keyword, riskInfo.type, context),
          evidence: this.findEvidence(text, keyword)
        };
        risks.push(risk);
      }
    }

    // 去重並按嚴重度排序
    const uniqueRisks = this.deduplicateRisks(risks);
    return uniqueRisks.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  private async identifyOpportunities(text: string, context: any): Promise<NLPAnalysisResult['opportunities']> {
    const opportunities: NLPAnalysisResult['opportunities'] = [];

    for (const [keyword, oppInfo] of this.opportunityKeywords.entries()) {
      if (text.includes(keyword)) {
        const potential = oppInfo.potential as 'low' | 'medium' | 'high';
        const opportunity = {
          type: oppInfo.type,
          potential,
          description: this.generateOpportunityDescription(keyword, oppInfo.type, context),
          recommendation: this.generateRecommendation(keyword, oppInfo.type)
        };
        opportunities.push(opportunity);
      }
    }

    // 去重並按潛力排序
    const uniqueOpportunities = this.deduplicateOpportunities(opportunities);
    return uniqueOpportunities.sort((a, b) => {
      const potentialOrder = { high: 3, medium: 2, low: 1 };
      return potentialOrder[b.potential] - potentialOrder[a.potential];
    });
  }

  private initializeLexicons(): void {
    // 中文情感詞典
    const positiveWords = [
      '優秀', '卓越', '創新', '進步', '改善', '提升', '成長', '成功',
      '領先', '最佳', '優異', '傑出', '突破', '成就', '貢獻', '正面'
    ];

    const negativeWords = [
      '問題', '危機', '風險', '違規', '處罰', '罰款', '爭議', '醜聞',
      '違法', '缺失', '不足', '失敗', '下降', '減少', '惡化', '負面'
    ];

    positiveWords.forEach(word => this.sentimentLexicon.set(word, 0.8));
    negativeWords.forEach(word => this.sentimentLexicon.set(word, -0.8));

    // 風險關鍵字
    this.riskKeywords.set('罰款', { type: '合規風險', severity: 'high' });
    this.riskKeywords.set('違規', { type: '合規風險', severity: 'high' });
    this.riskKeywords.set('訴訟', { type: '法律風險', severity: 'high' });
    this.riskKeywords.set('污染', { type: '環境風險', severity: 'medium' });
    this.riskKeywords.set('排放超標', { type: '環境風險', severity: 'high' });
    this.riskKeywords.set('供應鏈斷裂', { type: '供應鏈風險', severity: 'medium' });
    this.riskKeywords.set('員工流失', { type: '人力風險', severity: 'medium' });

    // 機會關鍵字
    this.opportunityKeywords.set('再生能源', { type: '環境機會', potential: 'high' });
    this.opportunityKeywords.set('節能', { type: '成本節省機會', potential: 'high' });
    this.opportunityKeywords.set('創新', { type: '技術創新機會', potential: 'medium' });
    this.opportunityKeywords.set('綠色產品', { type: '產品開發機會', potential: 'high' });
    this.opportunityKeywords.set('人才發展', { type: '人力資源機會', potential: 'medium' });
  }

  private initializePatterns(): void {
    // 實體識別模式
    this.entityPatterns.set('company', /(?:公司|集團|企業|廠商)/g);
    this.entityPatterns.set('location', /(?:台灣|中國|美國|日本|歐盟|亞洲)/g);
    this.entityPatterns.set('regulation', /(?:法|規|標準|指引|條例)/g);
    this.entityPatterns.set('metric', /(?:指標|數據|數值|比率|百分比)/g);
  }

  private tokenize(text: string): string[] {
    // 簡化的中文分詞（實際實現應使用專業分詞工具）
    return text.split(/\s+/).filter(word => word.length > 0);
  }

  private calculateTopicRelevance(text: string, keywords: string[]): number {
    const matches = keywords.filter(kw => text.includes(kw)).length;
    return matches / keywords.length;
  }

  private findPatternMatches(text: string, patternType: string): Array<{ text: string; start: number; end: number; confidence: number }> {
    const pattern = this.entityPatterns.get(patternType);
    if (!pattern) return [];

    const matches: Array<{ text: string; start: number; end: number; confidence: number }> = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // 提取更多上下文作為實體名稱
      const entityText = this.extractEntityText(text, start, end);

      matches.push({
        text: entityText,
        start,
        end,
        confidence: 0.8 // 簡化的信心度
      });
    }

    return matches;
  }

  private extractEntityText(text: string, start: number, end: number): string {
    // 向左向右擴展以獲取完整實體名稱
    let left = start;
    let right = end;

    // 向左查找名稱開始
    while (left > 0 && !/\s/.test(text[left - 1])) {
      left--;
    }

    // 向右查找名稱結束
    while (right < text.length && !/\s/.test(text[right])) {
      right++;
    }

    return text.substring(left, right).trim();
  }

  private getEntityContext(text: string, start: number, end: number): string {
    const contextStart = Math.max(0, start - 20);
    const contextEnd = Math.min(text.length, end + 20);
    return text.substring(contextStart, contextEnd);
  }

  private generateRiskDescription(keyword: string, type: string, context: any): string {
    const descriptions = {
      '合規風險': `${context.source || '內容'}中提到${keyword}，可能涉及法規遵循問題`,
      '環境風險': `${keyword}事件可能造成環境影響和聲譽損害`,
      '供應鏈風險': `${keyword}可能導致供應鏈不穩定和成本增加`,
      '人力風險': `${keyword}可能影響員工士氣和工作效率`
    };

    return descriptions[type] || `${type}: 發現${keyword}相關風險`;
  }

  private findEvidence(text: string, keyword: string): string {
    const index = text.indexOf(keyword);
    if (index === -1) return '';

    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + keyword.length + 30);

    return text.substring(start, end);
  }

  private deduplicateRisks(risks: NLPAnalysisResult['risks']): NLPAnalysisResult['risks'] {
    const seen = new Set<string>();
    return risks.filter(risk => {
      const key = `${risk.type}-${risk.severity}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private deduplicateOpportunities(opportunities: NLPAnalysisResult['opportunities']): NLPAnalysisResult['opportunities'] {
    const seen = new Set<string>();
    return opportunities.filter(opp => {
      const key = `${opp.type}-${opp.potential}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private generateOpportunityDescription(keyword: string, type: string, context: any): string {
    const descriptions = {
      '環境機會': `${keyword}相關發展可能帶來環境效益和成本節省`,
      '成本節省機會': `通過${keyword}可以降低營運成本並提升效率`,
      '技術創新機會': `${keyword}代表技術創新方向，可能創造新商機`,
      '產品開發機會': `${keyword}趨勢可能開啟新的產品和服務機會`,
      '人力資源機會': `${keyword}投資可能提升員工滿意度和組織效能`
    };

    return descriptions[type] || `${type}: 發現${keyword}相關機會`;
  }

  private generateRecommendation(keyword: string, type: string): string {
    const recommendations = {
      '環境機會': '建議投入相關技術研發和基礎設施建設',
      '成本節省機會': '建議進行可行性評估並制定實施計畫',
      '技術創新機會': '建議成立專案小組進行技術評估',
      '產品開發機會': '建議進行市場研究和產品規劃',
      '人力資源機會': '建議制定具體的人才發展和福利改善方案'
    };

    return recommendations[type] || `建議進一步評估${keyword}相關機會`;
  }

  async isHealthy(): Promise<boolean> {
    try {
      const testText = '公司碳排放量大幅減少，員工滿意度提升。';
      await this.analyze({
        text: testText,
        context: { source: 'report', targetLanguage: 'zh-TW' }
      });
      return true;
    } catch (error) {
      console.error('NLP分析器健康檢查失敗:', error);
      return false;
    }
  }
}