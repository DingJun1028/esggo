import { useState, useEffect, useCallback } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import axios from 'axios';
import { UserRank, RankProgress, Badge, Achievement } from '../../server/src/services/ReportAdvancementService';

export function useAdvancement(userId: string) {
    const [rank, setRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);
    const [allBadges, setAllBadges] = useState<Omit<Badge, 'earnedAt'>[]>([]);

    const fetchRank = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/report-tutorial/advancement/user/${userId}`);
            if (response.data.success) {
                setRank(response.data.data);
            }

            const badgesResponse = await axios.get('/api/v1/report-tutorial/advancement/badges');
            if (badgesResponse.data.success) {
                setAllBadges(badgesResponse.data.data.badges);
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[useAdvancement] Failed to fetch advancement data:', { error })
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchRank();
    }, [fetchRank]);

    const recordActivity = async (type: string, description: string, metadata?: any) => {
        try {
            const response = await axios.post(`/api/v1/report-tutorial/advancement/user/${userId}/activity`, {
                type,
                description,
                metadata
            });
            if (response.data.success) {
                setRank(response.data.data.rank);
                return response.data.data.newAchievements;
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[useAdvancement] Failed to record activity:', { error })
        }
        return [];
    };

    return {
        rank,
        loading,
        allBadges,
        recordActivity,
        refresh: fetchRank
    };
}
