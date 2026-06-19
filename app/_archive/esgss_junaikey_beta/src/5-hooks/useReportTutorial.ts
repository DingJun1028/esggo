import { useState, useEffect, useCallback } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { reportTutorialService, TutorialStep, UserTutorialState } from '../../server/src/services/ReportTutorialService';

export function useReportTutorial(userId: string) {
    const [state, setState] = useState<UserTutorialState | null>(null);
    const [steps, setSteps] = useState<TutorialStep[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshState = useCallback(async () => {
        setLoading(true);
        try {
            const userState = await reportTutorialService.getUserTutorialState(userId);
            setState(userState);
            const allSteps = reportTutorialService.getAllTutorialSteps();
            setSteps(allSteps);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[useReportTutorial] Failed to fetch tutorial state:', { error })
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refreshState();
    }, [refreshState]);

    const startStep = async (stepId: string) => {
        try {
            await reportTutorialService.startTutorialStep(userId, stepId);
            await refreshState();
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[useReportTutorial] Failed to start step:', { error })
        }
    };

    const completeStep = async (stepId: string, score: number) => {
        try {
            const newState = await reportTutorialService.completeTutorialStep(userId, stepId, score);
            setState(newState);
            return newState;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[useReportTutorial] Failed to complete step:', { error })
            return null;
        }
    };

    return {
        state,
        steps,
        loading,
        startStep,
        completeStep,
        refreshState
    };
}
