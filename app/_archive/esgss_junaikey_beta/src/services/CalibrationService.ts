import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { supabase } from '@/lib/supabase.js';

export interface AgentTraits {
    transparency: number;
    efficiency: number;
    altruism: number;
    logic: number;
    creativity: number;
}

export interface AgentConfig {
    id: string;
    user_id: string;
    traits: AgentTraits;
    updated_at: string;
}

export class CalibrationService {
    private static instance: CalibrationService;

    private constructor() { }

    static getInstance(): CalibrationService {
        if (!CalibrationService.instance) {
            CalibrationService.instance = new CalibrationService();
        }
        return CalibrationService.instance;
    }

    async getConfiguration(userId: string): Promise<AgentConfig | null> {
        if (!supabase) {
            omniLogger.warn(LogCategory.SYSTEM, 'CalibrationService', 'Supabase client not initialized');
            return null;
        }

        const { data, error } = await supabase
            .from('agent_configurations')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            omniLogger.error(LogCategory.SYSTEM, 'CalibrationService', `Error fetching config: ${error.message}`);
            return null;
        }

        return data as AgentConfig;
    }

    async saveConfiguration(userId: string, traits: AgentTraits): Promise<boolean> {
        if (!supabase) {
            omniLogger.warn(LogCategory.SYSTEM, 'CalibrationService', 'Supabase client not initialized');
            return false;
        }

        const { error } = await supabase
            .from('agent_configurations')
            .upsert({ user_id: userId, traits }, { onConflict: 'user_id' });

        if (error) {
            omniLogger.error(LogCategory.SYSTEM, 'CalibrationService', `Error saving config: ${error.message}`);
            return false;
        }

        omniLogger.info(LogCategory.SYSTEM, 'CalibrationService', `Agent traits calibrated for user ${userId}`);
        return true;
    }
}
