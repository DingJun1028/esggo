// Value service for business value maximization and ROI tracking
export interface ValueMetric {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'strategic' | 'reputational';
  description: string;
  unit: string;
  baseline: number;
  target: number;
  current: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  roi: number; // Return on Investment percentage
  timeframe: string; // 'monthly', 'quarterly', 'yearly'
  lastUpdated: Date;
}

export interface ValueProposition {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  benefits: string[];
  metrics: string[]; // Value metric IDs
  competitiveAdvantage: string;
  implementationCost: number;
  expectedRevenue: number;
  paybackPeriod: number; // months
  riskLevel: 'low' | 'medium' | 'high';
  status: 'proposed' | 'approved' | 'implemented' | 'measured';
}

export interface Investment {
  id: string;
  title: string;
  description: string;
  category: 'technology' | 'process' | 'training' | 'marketing' | 'infrastructure';
  cost: number;
  expectedBenefits: string[];
  roi: number;
  paybackPeriod: number;
  riskAssessment: string;
  stakeholders: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: { name: string; date: Date; completed: boolean }[];
  };
  actualBenefits?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

export class ValueService {
  private metrics: Map<string, ValueMetric> = new Map();
  private propositions: Map<string, ValueProposition> = new Map();
  private investments: Map<string, Investment> = new Map();

  // Value metrics management
  addValueMetric(metric: Omit<ValueMetric, 'id' | 'lastUpdated'>): string {
    const id = crypto.randomUUID();
    const fullMetric: ValueMetric = {
      ...metric,
      id,
      lastUpdated: new Date(),
    };
    this.metrics.set(id, fullMetric);
    return id;
  }

  updateValueMetric(id: string, updates: Partial<ValueMetric>): boolean {
    const metric = this.metrics.get(id);
    if (!metric) return false;

    this.metrics.set(id, {
      ...metric,
      ...updates,
      lastUpdated: new Date(),
    });
    return true;
  }

  getValueMetric(id: string): ValueMetric | undefined {
    return this.metrics.get(id);
  }

  getAllValueMetrics(): ValueMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetricsByCategory(category: string): ValueMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.category === category);
  }

  calculateROI(metric: ValueMetric): number {
    if (metric.baseline === 0) return 0;
    return ((metric.current - metric.baseline) / metric.baseline) * 100;
  }

  // Value propositions
  createValueProposition(proposition: Omit<ValueProposition, 'id'>): string {
    const id = crypto.randomUUID();
    this.propositions.set(id, { ...proposition, id });
    return id;
  }

  getValueProposition(id: string): ValueProposition | undefined {
    return this.propositions.get(id);
  }

  getHighImpactPropositions(): ValueProposition[] {
    return Array.from(this.propositions.values())
      .filter(p => p.status === 'implemented' || p.status === 'measured')
      .sort((a, b) => b.expectedRevenue - a.expectedRevenue);
  }

  calculatePropositionROI(proposition: ValueProposition): number {
    if (proposition.implementationCost === 0) return 0;
    return (
      ((proposition.expectedRevenue - proposition.implementationCost) /
        proposition.implementationCost) *
      100
    );
  }

  // Investment tracking
  createInvestment(investment: Omit<Investment, 'id'>): string {
    const id = crypto.randomUUID();
    this.investments.set(id, { ...investment, id });
    return id;
  }

  updateInvestment(id: string, updates: Partial<Investment>): boolean {
    const investment = this.investments.get(id);
    if (!investment) return false;

    this.investments.set(id, {
      ...investment,
      ...updates,
    });
    return true;
  }

  getInvestment(id: string): Investment | undefined {
    return this.investments.get(id);
  }

  getInvestmentsByStatus(status: string): Investment[] {
    return Array.from(this.investments.values()).filter(i => i.status === status);
  }

  calculateInvestmentROI(investment: Investment): number {
    if (investment.cost === 0) return 0;
    const actualBenefits = investment.actualBenefits || 0;
    return ((actualBenefits - investment.cost) / investment.cost) * 100;
  }

  // Portfolio analysis
  getValuePortfolioSummary(): {
    totalValueCreated: number;
    totalInvestment: number;
    averageROI: number;
    topPerformingMetrics: ValueMetric[];
    riskDistribution: { [risk: string]: number };
    categoryBreakdown: { [category: string]: number };
  } {
    const metrics = Array.from(this.metrics.values());
    const investments = Array.from(this.investments.values());

    const totalValueCreated = metrics.reduce((sum, m) => sum + m.current, 0);
    const totalInvestment = investments.reduce((sum, i) => sum + i.cost, 0);
    const averageROI =
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + this.calculateROI(m), 0) / metrics.length
        : 0;

    const topPerformingMetrics = metrics
      .sort((a, b) => this.calculateROI(b) - this.calculateROI(a))
      .slice(0, 5);

    const riskDistribution = investments.reduce(
      (dist, i) => {
        dist[i.riskAssessment] = (dist[i.riskAssessment] || 0) + 1;
        return dist;
      },
      {} as { [risk: string]: number }
    );

    const categoryBreakdown = investments.reduce(
      (breakdown, i) => {
        breakdown[i.category] = (breakdown[i.category] || 0) + i.cost;
        return breakdown;
      },
      {} as { [category: string]: number }
    );

    return {
      totalValueCreated,
      totalInvestment,
      averageROI,
      topPerformingMetrics,
      riskDistribution,
      categoryBreakdown,
    };
  }

  // Forecasting and planning
  forecastValueGrowth(
    metricId: string,
    periods: number
  ): { period: number; projectedValue: number; confidence: number }[] {
    const metric = this.metrics.get(metricId);
    if (!metric) return [];

    const growthRate =
      metric.trend === 'increasing' ? 0.05 : metric.trend === 'decreasing' ? -0.02 : 0;
    const forecast = [];

    for (let i = 1; i <= periods; i++) {
      const projectedValue = metric.current * Math.pow(1 + growthRate, i);
      const confidence = Math.max(0.5, 1 - i * 0.1); // Confidence decreases over time
      forecast.push({ period: i, projectedValue, confidence });
    }

    return forecast;
  }

  // Benchmarking
  getIndustryBenchmarks(category: string): {
    averageROI: number;
    topQuartile: number;
    median: number;
    industry: string;
  }[] {
    // Simulated industry benchmarks
    const benchmarks = {
      financial: [
        { averageROI: 25, topQuartile: 40, median: 22, industry: 'Financial Services' },
        { averageROI: 30, topQuartile: 50, median: 28, industry: 'Technology' },
      ],
      operational: [
        { averageROI: 20, topQuartile: 35, median: 18, industry: 'Manufacturing' },
        { averageROI: 15, topQuartile: 30, median: 12, industry: 'Healthcare' },
      ],
      strategic: [{ averageROI: 35, topQuartile: 60, median: 32, industry: 'Consulting' }],
      reputational: [{ averageROI: 18, topQuartile: 28, median: 15, industry: 'Consumer Goods' }],
    };

    return benchmarks[category as keyof typeof benchmarks] || [];
  }

  // Recommendations
  getValueOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const portfolio = this.getValuePortfolioSummary();

    if (portfolio.averageROI < 20) {
      recommendations.push('Consider reallocating resources to higher-ROI initiatives');
    }

    const highRisk = portfolio.riskDistribution['high'] || 0;
    const lowRisk = portfolio.riskDistribution['low'] || 0;

    if (highRisk > lowRisk * 2) {
      recommendations.push(
        'Portfolio risk is skewed towards high-risk investments - diversify risk levels'
      );
    }

    const lowPerformingMetrics = Array.from(this.metrics.values()).filter(
      m => this.calculateROI(m) < 0
    );

    if (lowPerformingMetrics.length > 0) {
      recommendations.push(
        `Review ${lowPerformingMetrics.length} underperforming value metrics for optimization or termination`
      );
    }

    return recommendations;
  }
}

export const valueService = new ValueService();
