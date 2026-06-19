import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { OmniError, ErrorCode } from '../utils/omniError.js';

export interface FunnelDataPoint {
    value: number;
    name: string;
    fill: string;
}

export interface GanttTask {
    id: string;
    name: string;
    start: number;
    duration: number;
    status: 'completed' | 'in-progress' | 'planned';
    assignee: string;
}

export class VisualizerService {
    /**
     * Aggregates evidence vault data for the conversion funnel.
     * Conversion Flow: Pending -> Approved -> Anchored (Trustworthy)
     */
    static async getFunnelData(): Promise<FunnelDataPoint[]> {
        try {
            const { data: records, error } = await supabase
                .from('evidence_vault')
                .select('status, is_locked');

            if (error) throw error;

            const total = records.length;
            const pending = records.filter(r => r.status === 'pending_validation').length;
            const approved = records.filter(r => r.status === 'approved').length;
            const rejected = records.filter(r => r.status === 'rejected').length;
            const locked = records.filter(r => r.is_locked).length;

            return [
                { value: total, name: 'Total Evidence', fill: '#0df2df' },
                { value: total - rejected, name: 'Valid Entries', fill: '#0acbc0' },
                { value: approved + locked, name: 'Approved', fill: '#08aea0' },
                { value: locked, name: 'Locked (5T)', fill: '#046c62' },
            ];
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'VisualizerService: Failed to fetch funnel data', { error });
            throw new OmniError(
                'Failed to aggregate funnel data',
                500,
                ErrorCode.INTERNAL_ERROR,
                error
            );
        }
    }

    /**
     * Fetches initiative data for the Gantt chart.
     * Currently pulls from mission-like tasks or audit logs.
     */
    static async getGanttData(): Promise<GanttTask[]> {
        try {
            // Placeholder: In a real system, this would query a 'missions' or 'tasks' table.
            // For now, we return standardized tactical milestones.
            return [
                { id: 'm1', name: '5T Protocol Audit', start: 0, duration: 25, status: 'completed', assignee: 'Dr. Thoth' },
                { id: 'm2', name: 'Evidence Vault Sync', start: 25, duration: 20, status: 'completed', assignee: 'System' },
                { id: 'm3', name: 'Logic Gate Hardening', start: 45, duration: 30, status: 'in-progress', assignee: 'OmniKey' },
                { id: 'm4', name: 'Ecosystem Awakening', start: 75, duration: 25, status: 'planned', assignee: 'Genie' },
            ];
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'VisualizerService: Failed to fetch Gantt data', { error });
            return [];
        }
    }
}
