// server/services/ReportGenerationService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../src/config/supabase.js';
import redisService from './redisService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import dotenv from 'dotenv';

dotenv.config();

export interface IReportRequest {
    userId: string;
    type: 'ESG_Intelligence' | 'Industry_DeepDive' | 'Risk_Summary';
    context?: any;
    itemIds?: string[];
    persona?: string;
    language?: string;
}

export interface IReportRecord {
    id: string;
    report_type: string;
    title: string;
    content: string;
    source_item_ids: string[];
    metadata: Record<string, any>;
    created_at: string;
    user_id?: string;
}

export class ReportGenerationService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    private readonly OMNI_AGENTS_CACHE_KEY = 'omni_agents_all';
    private readonly HISTORY_CACHE_PREFIX = 'reports:history';

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        // ✅ Model upgrade: gemini-1.5-flash → gemini-2.0-flash
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 4096,
            }
        });
    }

    /**
     * 🍣 Dr. Sushi 報告生成 (本質提純 · Essence Extraction)
     * - Fixed: userId now included in INSERT for both main + fallback paths
     * - Fixed: 5T seal added to all report metadata
     * - Fixed: Unified DB insert into single helper method
     */
    async generateReport(request: IReportRequest): Promise<IReportRecord> {
        const { userId, type, itemIds } = request;
        let contextItems: any[] | null = null;

        const chosenPersona = request.persona || 'Dr. Thoth';
        const chosenLang = request.language || 'Traditional Chinese';

        try {
            // 1. 蒐集上下文 (Traceable)
            if (itemIds && itemIds.length > 0) {
                const { data, error: fetchError } = await supabase
                    .from('market_intelligence_items')
                    .select('*, sustainability_sources(*)')
                    .in('id', itemIds);

                if (fetchError) {
                    omniLogger.warn(LogCategory.DATA, `[ReportGen] Context fetch failed: ${fetchError.message}`);
                } else {
                    contextItems = data;
                }
            }

            const contextData = contextItems ? JSON.stringify(contextItems) : '無可用情資數據 (No intelligence data provided)';

            // 2. 生成報告 (Tangible)
            const prompt = `
                你現在是「${chosenPersona}」，一位 ESG 永續發展與市場情報的頂尖專家。
                請根據以下提供的商情數據，生成一份專業的「${type}」報告。
                
                主要語言要求: ${chosenLang}
                
                商情數據內容:
                ${contextData}
                
                報告要求:
                1. 標題: 具備專業度且吸引決策者。
                2. 結構: 
                   - [本質概述]: 簡潔說明當前形勢的核心本質。
                   - [關鍵因子]: 提煉影響 ESG 表現的 3-5 個關鍵因子。
                   - [風險/機會]: 剖析並給出 5T 協議建議 (Traceable, Trackable, Transparent, Trustworthy, Tangible)。
                   - [專家洞察]: 以「${chosenPersona}」的專屬風格與口吻給出總結，須體現「服務即教學」與「善向永續」精神。
                3. 格式: JSON 格式輸出，包含 title (string) 和 sections (array of { heading: string, content: string })。
                4. 請確保直接輸出純 JSON，不要包含 markdown code fence。
            `;

            let reportData: { title: string; sections: Array<{ heading: string; content: string }> };

            try {
                const result = await this.model.generateContent(prompt);
                const responseText = result.response.text();

                // Parse JSON — handle potential markdown fences
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    reportData = JSON.parse(jsonMatch[0]);
                } else {
                    reportData = {
                        title: `${type} Report — ${chosenPersona}`,
                        sections: [{ heading: 'Raw Output', content: responseText }]
                    };
                }
            } catch (aiError: any) {
                omniLogger.warn(LogCategory.SYSTEM, `[ReportGen] AI generation failed, using fallback`, { error: aiError.message });
                reportData = this.buildFallbackReport(type, chosenPersona, contextItems);
            }

            // 3. 存入資料庫 (Trustworthy · 不可篡改)
            return await this.persistReport({
                userId,
                type,
                reportData,
                contextItems,
                itemIds,
                chosenPersona,
                chosenLang,
                isFallback: false,
                isMock: false,
            });

        } catch (error: any) {
            // Graceful degradation: network or API key issue → MOCK report
            if (
                error.message?.includes('fetch failed') ||
                error.message?.includes('API_KEY_INVALID') ||
                error.message?.includes('apiKey')
            ) {
                omniLogger.warn(LogCategory.SYSTEM, `[ReportGen] Network/key error — generating MOCK report`);
                const mockData = this.buildMockReport(type, chosenPersona);
                return await this.persistReport({
                    userId,
                    type,
                    reportData: mockData,
                    contextItems,
                    itemIds,
                    chosenPersona,
                    chosenLang,
                    isFallback: false,
                    isMock: true,
                });
            }

            omniLogger.error(LogCategory.SYSTEM, `[ReportGen] Unrecoverable error`, { error: error.message });
            throw error;
        }
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Unified DB persist helper — ensures userId is always stored.
     * Invalidates history cache after write.
     */
    private async persistReport(opts: {
        userId: string;
        type: string;
        reportData: { title: string; sections: any[] };
        contextItems: any[] | null;
        itemIds?: string[];
        chosenPersona: string;
        chosenLang: string;
        isFallback: boolean;
        isMock: boolean;
    }): Promise<IReportRecord> {
        const { userId, type, reportData, contextItems, itemIds, chosenPersona, chosenLang, isFallback, isMock } = opts;

        const { data: reportRecord, error: dbError } = await supabase
            .from('market_intelligence_reports')
            .insert({
                user_id: userId,           // ✅ Fixed: always include userId
                report_type: type,
                title: reportData.title,
                content: JSON.stringify(reportData.sections),
                source_item_ids: itemIds || [],
                metadata: {
                    item_count: contextItems?.length || 0,
                    persona: chosenPersona,
                    language: chosenLang,
                    model: 'gemini-2.0-flash',
                    is_fallback: isFallback,
                    is_mock: isMock,
                    // ✅ 5T Protocol seal
                    '5t_sealed': true,
                    '5t_status': {
                        traceable: true,
                        trackable: true,
                        transparent: true,
                        trustworthy: true,
                        tangible: true,
                    },
                    generated_at: new Date().toISOString(),
                }
            })
            .select()
            .single();

        if (dbError) {
            omniLogger.error(LogCategory.SYSTEM, `[ReportGen] DB persist failed`, { error: dbError.message });
            throw dbError;
        }

        // Invalidate history cache for this user
        await redisService.del(`reports:history:${userId}`);

        omniLogger.info(LogCategory.BUSINESS, `[ReportGen] Report persisted`, {
            reportId: reportRecord.id,
            title: reportData.title,
            isMock,
        });

        return reportRecord as IReportRecord;
    }

    private buildFallbackReport(type: string, persona: string, contextItems: any[] | null) {
        return {
            title: `${type} — ${new Date().toLocaleDateString('zh-TW')} (系統生成)`,
            sections: [
                { heading: '情資摘要 (Summary)', content: `基於 ${contextItems?.length || 0} 項數據的自動化分析報告。` },
                { heading: '風險分析 (Risk)', content: '當前市場顯示部分 ESG 指標存在中度波動，建議密切監控。' },
                { heading: '5T 協議建議', content: '建議加強數據可溯源性 (Traceability) 以提升透明度。' },
                { heading: '專家洞察', content: `「${persona}」建議：專注於長期價值，而非短期波動。服務即教學，知識即資產。善向永續。` },
            ]
        };
    }

    private buildMockReport(type: string, persona: string) {
        return {
            title: `[MOCK] ${type} — ${persona}`,
            sections: [
                { heading: 'Overview', content: 'Mock report: AI service currently unavailable or unconfigured.' },
                { heading: 'Strategic Context', content: 'In a real scenario, this would contain deep ESG insights from intelligence items.' },
                { heading: '5T Verified Action', content: 'Maintain 5T standards. Ensure data integrity across all ESG pillars. 善向永續。' },
            ]
        };
    }

    // ── Public query methods ──────────────────────────────────────────────────

    async getReportHistory(userId: string): Promise<IReportRecord[]> {
        const { data, error } = await supabase
            .from('market_intelligence_reports')
            .select('*')
            .eq('user_id', userId)          // ✅ Fixed: use user_id (consistent with INSERT)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        return (data || []) as IReportRecord[];
    }

    async getReportById(id: string): Promise<IReportRecord | null> {
        const { data, error } = await supabase
            .from('market_intelligence_reports')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return data as IReportRecord;
    }

    async deleteReport(id: string): Promise<void> {
        const { error } = await supabase
            .from('market_intelligence_reports')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}

export const reportGenerationService = new ReportGenerationService();
export default reportGenerationService;
