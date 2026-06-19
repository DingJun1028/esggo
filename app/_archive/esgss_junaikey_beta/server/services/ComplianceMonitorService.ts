// server/services/ComplianceMonitorService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../src/config/supabase.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import intelligenceDispatchService from './IntelligenceDispatchService.js';
import systemHealthService from '../src/services/SystemHealthService.js';
import dotenv from 'dotenv';

dotenv.config();

export class ComplianceMonitorService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    /**
     * Scan for new critical risks and synchronize with esg_incidents table.
     * Targeted items: Negative sentiment + High Impact (> 0.7).
     */
    async scanForRisks() {
        omniLogger.info(LogCategory.SYSTEM, '[ComplianceMonitor] Commencing automated ESG risk scan...');

        // Phase 7: Log heartbeat on every scan start
        await systemHealthService.logHeartbeat();

        try {
            // 1. Identify potential risk items - Joining with sustainability_sources to get authority
            const { data: potentialRisks, error } = await supabase
                .from('market_intelligence_items')
                .select(`
                    *,
                    sustainability_sources (authority)
                `)
                .eq('sentiment', 'Negative')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            if (!potentialRisks || potentialRisks.length === 0) {
                return { count: 0, message: 'Scan complete. No new critical ESG signals detected.' };
            }

            let newIncidentsCount = 0;

            for (const item of potentialRisks) {
                // Apply Data Normalization (Phase 5.10)
                const authority = (item.sustainability_sources as any)?.authority || 3;
                const normalizedScore = this.normalizeImpactScore(item.impact_score, authority);

                // Threshold after normalization: 0.7
                if (normalizedScore <= 0.7) continue;

                // Check if this item is already recorded as an incident
                const { data: existing, error: checkError } = await supabase
                    .from('esg_incidents')
                    .select('id')
                    .eq('item_id', item.id)
                    .maybeSingle();

                if (checkError) {
                    omniLogger.warn(LogCategory.SYSTEM, `[ComplianceMonitor] Error checking item ${item.id}: ${checkError.message}`);
                    continue;
                }

                if (!existing) {
                    // 2. Perform AI Deep Dive for Risk Rationale (判定理由)
                    const rationale = await this.assessRiskRationale(item);

                    // 3. Record Incident
                    const { error: insertError } = await supabase
                        .from('esg_incidents')
                        .insert({
                            item_id: item.id,
                            risk_level: normalizedScore > 0.85 ? 'High' : 'Medium',
                            status: 'Unresolved',
                            ai_rationale: rationale,
                            severity_score: normalizedScore // Store normalized score
                        });

                    if (insertError) {
                        omniLogger.error(LogCategory.SYSTEM, `[ComplianceMonitor] Failed to record incident for ${item.id}: ${insertError.message}`);
                    } else {
                        newIncidentsCount++;
                        omniLogger.warn(LogCategory.SYSTEM, `[ComplianceMonitor] CRITICAL: New ESG incident recorded: ${item.title} (Normalized Score: ${normalizedScore.toFixed(2)})`);

                        // 4. Proactive Dispatch (Phase 6.0)
                        await intelligenceDispatchService.dispatchIncidentAlert({
                            id: item.id, // Using item.id as placeholder since it's the source
                            item_id: item.id,
                            risk_level: normalizedScore > 0.85 ? 'High' : 'Medium',
                            ai_rationale: rationale,
                            market_intelligence_items: item
                        });
                    }
                }
            }

            return {
                count: newIncidentsCount,
                message: newIncidentsCount > 0
                    ? `警告：偵測到 ${newIncidentsCount} 項新 ESG 風險事件並已寫入證據庫。`
                    : '掃描完成，目前無新增高風險信號。'
            };
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `[ComplianceMonitor] Scan runtime error: ${error.message}`);
            throw error;
        }
    }

    /**
     * 📊 數據歸一化 (Phase 5.10)
     * 根據來源權威性修正影響力分數。
     * 權威 1: 0.8x | 權威 3: 1.0x | 權威 5: 1.2x
     */
    private normalizeImpactScore(rawScore: number, authority: number): number {
        const adjustment = 1 + (authority - 3) * 0.1;
        const normalized = rawScore * adjustment;
        return Math.min(Math.max(normalized, 0), 1); // Clamp between 0 and 1
    }

    /**
     * Use Gemini to generate a professional rationale for the risk classification
     */
    private async assessRiskRationale(item: any): Promise<string> {
        try {
            const prompt = `
                作為 ESG 合規審查官，請分析下列高影響力負面商情，並說明其為何被判定為合規/聲譽風險事件。
                
                標題: ${item.title}
                摘要: ${item.summary}
                原始影響力評分: ${item.impact_score}
                
                要求:
                1. 理由需具備專業度、冷靜且精確。
                2. 使用繁體中文撰寫。
                3. 長度約 50-100 字。
                4. 僅回傳判定理由文字。
            `;
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            return "AI 判定模組暫時無法產出細節。根據影響力評分與情感極性，判定為合規風險，建議即刻複核原文。";
        }
    }

    /**
     * Get unresolved incidents for UI alerts
     */
    async getUnresolvedIncidents() {
        const { data, error } = await supabase
            .from('esg_incidents')
            .select(`
                *,
                market_intelligence_items (*)
            `)
            .eq('status', 'Unresolved')
            .order('severity_score', { ascending: false });

        if (error) throw error;
        return data || [];
    }
}

export default new ComplianceMonitorService();
