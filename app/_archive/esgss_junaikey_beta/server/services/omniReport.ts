// server/services/omniReport.ts
// Omni Report Generation Service (Phase 9)
// Generates comprehensive ESG reports using Gemini AI and Typst

import { GoogleGenerativeAI } from '@google/generative-ai';
import { TypstService } from './TypstService.js';
import { supabase } from '../src/config/supabase.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import config from '../src/config/index.js';
import dotenv from 'dotenv';

dotenv.config();

interface ReportOptions {
  scope?: string;
  period?: string;
  focus?: string;
}

interface ReportData {
  title: string;
  period: string;
  generatedAt: string;
  metrics: {
    item_count: number;
    avg_impact: number;
    sentiment_breakdown: Record<string, number>;
    top_confidence: number;
  };
  summary?: string;
  items: Array<{
    title: string;
    summary: string;
    sentiment: string;
    impact: number;
    source: string;
    url: string;
    crystal_hash: string;
  }>;
}

class OmniReportService {
  private genAI: GoogleGenerativeAI;
  private typstService: TypstService;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.typstService = new TypstService(); // Use internal instance
  }

  /**
   * Generate an Omni ESG Report based on market intelligence
   */
  async generateReport(format = 'json', options: { topic?: string, company?: string, limit?: number } = {}) {
    const { topic = 'ESG', company, limit = 10 } = options;
    omniLogger.info(LogCategory.SYSTEM, `[OmniReport] Generating ${format} report for ${company || topic}...`);

    try {
      // 1. Aggregation from Market Intelligence
      let queryBuilder = supabase
        .from('market_intelligence_items')
        .select(`
          *,
          sustainability_sources (
            name_en,
            name_tc,
            category_name
          )
        `)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (company) {
        queryBuilder = queryBuilder.ilike('title', `%${company}%`);
      } else {
        queryBuilder = queryBuilder.ilike('title', `%${topic}%`);
      }

      const { data: items, error } = await queryBuilder;
      if (error) throw error;
      if (!items || items.length === 0) {
        throw new Error('No market intelligence data found for the given criteria.');
      }

      // 2. Prepare Data for Synthesis & Rendering
      const reportData: ReportData = {
        title: company ? `${company} ESG Intelligence Report` : `${topic} Sector Observation`,
        period: `${new Date().toLocaleDateString('zh-TW')} - Sentinel Scan`,
        generatedAt: new Date().toISOString(),
        metrics: {
          item_count: items.length,
          avg_impact: items.reduce((acc: number, curr: any) => acc + (curr.impact_score || 0), 0) / items.length,
          sentiment_breakdown: items.reduce((acc: Record<string, number>, curr: any) => {
            acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
            return acc;
          }, {}),
          top_confidence: Math.max(...items.map((i: any) => i.confidence || 0))
        },
        items: items.map((i: any) => ({
          title: i.title,
          summary: i.summary || i.snippet,
          sentiment: i.sentiment || 'Neutral',
          impact: i.impact_score || 0.5,
          source: i.sustainability_sources?.name_tc || i.sustainability_sources?.name_en || 'Unknown',
          url: i.url,
          crystal_hash: i.crystal_hash || 'UNSEALED'
        }))
      };

      // 3. Synthesis (Gemini AI)
      const synthesisResult = await this.synthesizeExecutiveSummary(reportData, topic);
      reportData.summary = synthesisResult;

      // 4. Formatting
      if (format === 'pdf') {
        const pdfBuffer = await this.typstService.renderReport(reportData);
        return {
          contentType: 'application/pdf',
          buffer: pdfBuffer,
          filename: `report_${(company || topic).replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
        };
      }

      return reportData;
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[OmniReport] Generation failed: ${error.message}`);
      throw new Error(`Report generation failed: ${error.message}`);
    }
  }

  /**
   * Generate a Benchmark ESG Report comparing multiple companies
   */
  async generateBenchmarkReport(companies: string[], options: { topic?: string, limit?: number } = {}) {
    const { topic = 'ESG', limit = 5 } = options;
    omniLogger.info(LogCategory.SYSTEM, `[OmniReport] Generating benchmark report for ${companies.join(' vs ')}...`);

    try {
      const benchmarkData: any = {
        title: `ESG Benchmarking Analysis: ${companies.join(' vs ')}`,
        generatedAt: new Date().toISOString(),
        companies: []
      };

      for (const company of companies) {
        const { data: items, error } = await supabase
          .from('market_intelligence_items')
          .select('*, sustainability_sources(*)')
          .ilike('title', `%${company}%`)
          .order('published_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        benchmarkData.companies.push({
          name: company,
          metrics: {
            item_count: items?.length || 0,
            avg_impact: items && items.length > 0 ? items.reduce((acc, curr) => acc + (curr.impact_score || 0), 0) / items.length : 0,
            sentiment_avg: items && items.length > 0 ? items.reduce((acc, curr) => {
              const weights: Record<string, number> = { 'Positive': 1, 'Neutral': 0, 'Negative': -1 };
              return acc + (weights[curr.sentiment] || 0);
            }, 0) / items.length : 0
          },
          top_items: items?.map(i => ({
            title: i.title,
            summary: i.summary || i.snippet,
            impact: i.impact_score
          }))
        });
      }

      benchmarkData.comparisonSummary = await this.synthesizeBenchmarkSummary(benchmarkData);

      const pdfBuffer = await this.typstService.renderReport({
        ...benchmarkData,
        isBenchmark: true
      });

      return {
        contentType: 'application/pdf',
        buffer: pdfBuffer,
        filename: `benchmark_${companies.join('_')}_${new Date().getTime()}.pdf`,
      };
    } catch (error: any) {
      omniLogger.error(LogCategory.SYSTEM, `[OmniReport] Benchmark failed: ${error.message}`);
      throw error;
    }
  }

  async synthesizeBenchmarkSummary(data: any) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `
        As an ESG Strategist, compare these companies based on their intelligence metrics:
        ${JSON.stringify(data.companies.map((c: any) => ({ name: c.name, metrics: c.metrics })))}
        
        Provide a concise (200 words) side-by-side comparison in Traditional Chinese. 
        Focus on who is leading in impact and sentiment.
        Format: Direct comparison, use "對標分析" as title.
      `;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return "無法生成 AI 對標摘要。請手動參考數據指標進行評估。";
    }
  }

  async synthesizeExecutiveSummary(data: ReportData, focus: string) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      });

      const prompt = `
        You are an expert ESG Analyst.
        Generate a professional executive summary for an ESG report based on the following data:
        ${JSON.stringify(data.metrics)}
        
        Focus Area: ${focus}
        Period: ${data.period}
        
        Requirements:
        1. Tone: Professional, authoritative, yet inspiring.
        2. high-light key achievements.
        3. Length: Approx 150 words.
        4. Return ONLY the summary text.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.warn('[OmniReport] AI synthesis failed, using fallback.', error);
      return `Detailed analysis of ESG performance for ${data.period}. Key metrics indicate positive trends in carbon reduction and governance compliance.`;
    }
  }
}

export default new OmniReportService();
