// server/services/DailyBriefingService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../src/config/supabase.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import intelligenceDispatchService from './IntelligenceDispatchService.js';
import dotenv from 'dotenv';

dotenv.config();

export class DailyBriefingService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    /**
     * Generate "Sentinel Daily Observation" (哨兵每日觀察)
     * Aggregates intelligence from the last 24 hours and synthesizes a strategic summary.
     */
    async generateDailyBriefing() {
        omniLogger.info(LogCategory.SYSTEM, '[DailyBriefing] Commencing daily intelligence aggregation...');

        try {
            // 1. Fetch data from last 24 hours
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);

            const { data: items, error } = await supabase
                .from('market_intelligence_items')
                .select(`
                    *,
                    sustainability_sources (
                        name_tc,
                        name_en
                    )
                `)
                .gte('published_at', yesterday.toISOString())
                .order('impact_score', { ascending: false });

            if (error) throw error;

            if (!items || items.length === 0) {
                return {
                    status: 'success',
                    summary: '今日尚無重大 ESG 商情更新。哨兵系統持續監控中。',
                    stats: { count: 0, sentiment: {} },
                    timestamp: new Date().toISOString()
                };
            }

            // 2. Aggregate stats for AI context
            const stats = {
                count: items.length,
                avgImpact: items.reduce((acc, i) => acc + (Number(i.impact_score) || 0), 0) / items.length,
                sentiment: items.reduce((acc: Record<string, number>, i) => {
                    acc[i.sentiment] = (acc[i.sentiment] || 0) + 1;
                    return acc;
                }, {})
            };

            // 3. AI Synthesis (Sentinel Observation & Actionable Guide - Phase 5.10)
            const prompt = `
                Role: ESG Sentinel Intelligence Agent (哨兵情報員).
                Task: Generate a "Sentinel Daily Strategic Briefing" (哨兵每日戰略簡報) in Traditional Chinese.
                
                Data Context (Last 24h):
                - Total Intelligence Nodes: ${stats.count}
                - Average Ecosystem Impact: ${stats.avgImpact.toFixed(2)}
                - Sentiment Breakdown: ${JSON.stringify(stats.sentiment)}
                - Top Headlines: ${items.slice(0, 5).map(i => i.title).join('; ')}
                
                Requirements:
                1. Philosophical Intro: Start with a brief, profound thought aligned with "道法自然, 系統毅然" or "上善若水".
                2. Trend Analysis: Summarize the primary ESG trends detected in the last 24 hours.
                3. Critical Signal: Highlight the single most impactful event or risk.
                4. Actionable Guide (戰略行動建議): Provide 3 specific, actionable recommendations (Short/Medium/Long term) based on these trends.
                5. Tone: Strategic, objective, yet visionary. Use Traditional Chinese (Taiwan) correctly.
                6. Length: 300-400 words.
                7. Format: Return the response as a clear text block with "【每日觀察】" and "【戰略建議】" headers.
            `;

            const result = await this.model.generateContent(prompt);
            const fullResponse = result.response.text();

            // Split summary and action guide if possible, or keep as one for now
            // For Phase 6.0, we'll keep the response structure flexible but enriched

            const briefing = {
                status: 'success',
                summary: fullResponse, // Full enriched content
                stats,
                topItems: items.slice(0, 5),
                timestamp: new Date().toISOString()
            };

            // 4. Proactive Dispatch (Phase 6.0)
            await intelligenceDispatchService.dispatchDailySummary(briefing);

            omniLogger.info(LogCategory.SYSTEM, `[DailyBriefing] Successfully generated and dispatched strategic briefing for ${stats.count} items.`);

            return briefing;
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `[DailyBriefing] Error during generation: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get basic stats for the dashboard header
     */
    async getQuickStats() {
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const { count, error } = await supabase
            .from('market_intelligence_items')
            .select('*', { count: 'exact', head: true })
            .gte('published_at', yesterday.toISOString());

        if (error) throw error;
        return { count: count || 0 };
    }
}

export default new DailyBriefingService();
