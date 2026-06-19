// server/services/IntelligenceDispatchService.ts
import { supabase } from '../src/config/supabase.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

export interface DispatchPayload {
    title: string;
    summary: string;
    type: 'DAILY_BRIEFING' | 'CRITICAL_RISK' | 'ACTION_GUIDE';
    severity: 'High' | 'Medium' | 'Low' | 'Info';
    action_guide?: string;
    metadata?: any;
}

export class IntelligenceDispatchService {
    /**
     * Dispatch an intelligence notification to the system audit trail and notify users
     */
    async dispatch(payload: DispatchPayload) {
        omniLogger.info(LogCategory.SYSTEM, `[Dispatch] Initiating dispatch for: ${payload.title}`);

        try {
            // 1. Record in global audit trail (as a notification event)
            const { error: auditError } = await supabase
                .from('audit_logs')
                .insert({
                    category: 'INTELLIGENCE_DISPATCH',
                    action: payload.type,
                    details: {
                        title: payload.title,
                        summary: payload.summary,
                        severity: payload.severity,
                        action_guide: payload.action_guide,
                        ...payload.metadata
                    },
                    status: 'Success'
                });

            if (auditError) throw auditError;

            // 2. Insert into notifications table (assuming it exists or following the pattern)
            // If esg_notifications doesn't exist, we use a generic logs table for now
            const { error: notifyError } = await supabase
                .from('esg_notifications')
                .insert({
                    title: payload.title,
                    content: payload.summary,
                    type: payload.type,
                    severity: payload.severity,
                    action_guide: payload.action_guide,
                    is_read: false,
                    created_at: new Date().toISOString()
                });

            if (notifyError) {
                // If the specific table doesn't exist yet, we fall back to logging
                omniLogger.warn(LogCategory.SYSTEM, `[Dispatch] Target 'esg_notifications' table not found or error: ${notifyError.message}. Signal stored in audit trail only.`);
            } else {
                omniLogger.info(LogCategory.SYSTEM, `[Dispatch] Proactive alert pushed: ${payload.title}`);
            }

            return { success: true };
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `[Dispatch] Error during intelligence routing: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Specifically dispatch a high-risk incident alert
     */
    async dispatchIncidentAlert(incident: any) {
        return this.dispatch({
            title: `⚠️ 緊急風險預警: ${incident.market_intelligence_items?.title || '新檢出 ESG 事件'}`,
            summary: incident.ai_rationale || '偵測到高度不合規信號，請即刻複核。',
            type: 'CRITICAL_RISK',
            severity: incident.risk_level === 'High' ? 'High' : 'Medium',
            metadata: { incident_id: incident.id, item_id: incident.item_id }
        });
    }

    /**
     * Dispatch the synthesized daily briefing
     */
    async dispatchDailySummary(briefing: any) {
        return this.dispatch({
            title: `🏛️ 哨兵每日戰略簡報 (${new Date().toLocaleDateString()})`,
            summary: briefing.summary,
            type: 'DAILY_BRIEFING',
            severity: 'Info',
            metadata: { stats: briefing.stats }
        });
    }
}

export default new IntelligenceDispatchService();
