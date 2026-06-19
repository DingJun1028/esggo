import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * server/services/HeatmapService.ts
 * Spatial-Temporal Data Aggregation for ESG Heatmaps
 */

export interface HeatmapPoint {
    x: string; // Dimension or Category
    y: string; // Region or Page
    value: number;
}

export class HeatmapService {
    /**
     * Aggregates behavioral data for interaction heatmaps.
     */
    static async getBehavioralHeatmap(): Promise<HeatmapPoint[]> {
        try {
            const { data, error } = await supabase
                .from('behavioral_events')
                .select('event_type, page_url');

            if (error) {
                omniLogger.warn(LogCategory.DATA, 'HeatmapService: Using fallback data (DB table missing?)');
                return this.getFallbackHeatmap();
            }

            const map: Record<string, Record<string, number>> = {};
            data.forEach(row => {
                const x = row.event_type;
                const y = row.page_url || 'Global';
                if (!map[x]) map[x] = {};
                map[x][y] = (map[x][y] || 0) + 1;
            });

            const result: HeatmapPoint[] = [];
            for (const x in map) {
                for (const y in map[x]) {
                    result.push({ x, y, value: map[x][y] });
                }
            }
            return result;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'HeatmapService: Failed to aggregate behavior data', error);
            return this.getFallbackHeatmap();
        }
    }

    private static getFallbackHeatmap(): HeatmapPoint[] {
        return [
            { x: 'Click', y: 'Dashboard', value: 120 },
            { x: 'View', y: 'Dashboard', value: 450 },
            { x: 'Submit', y: 'Assessment', value: 45 },
            { x: 'Click', y: 'Assessment', value: 89 },
        ];
    }
}
