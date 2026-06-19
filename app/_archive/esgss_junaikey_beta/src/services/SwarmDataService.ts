import { useState, useEffect, useCallback } from 'react';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

// Define the shape of our Swarm Data
export interface SwarmData {
    resonanceScore: number;
    activeNodes: number;
    status: 'HARMONIC_OSCILLATION' | 'DRIFT_DETECTED' | 'RECALIBRATING' | 'CRITICAL_FAILURE';
    consensusLogs: ConsensusLog[];
}

export interface ConsensusLog {
    time: string;
    type: 'SUCCESS' | 'WARN' | 'INFO' | 'ERROR';
    msg: string;
}

const MOCK_LOGS: ConsensusLog[] = [
    { time: '10:00:03', type: 'SUCCESS', msg: 'Swarm Consensus Reached. Output validated.' },
    { time: '10:00:02', type: 'WARN', msg: 'Auditor detected minor drift (0.1%). Correcting...' },
    { time: '10:00:01', type: 'INFO', msg: 'Coordinator Agent initiated handshake with Search Agent...' },
];

/**
 * useSwarmData Hook
 * Connects to the ADK Sentience Stream to provide real-time updates.
 * currently simulates a stream for V2 until backend SSE is fully ready.
 */
export const useSwarmData = () => {
    const [data, setData] = useState<SwarmData>({
        resonanceScore: 98.2,
        activeNodes: 3,
        status: 'HARMONIC_OSCILLATION',
        consensusLogs: MOCK_LOGS
    });

    const [isRecalibrating, setIsRecalibrating] = useState(false);

    // Real-time Swarm Integration (SSR/EventSource)
    useEffect(() => {
        // V3: Connect to real backend stream
        const eventSource = new EventSource('http://localhost:4000/api/adk/swarm/stream');

        eventSource.onopen = () => {
            omniLogger.info(LogCategory.SYSTEM, '[SwarmDataService] ✅ Connected to Swarm Sentience Stream');
        };

        eventSource.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);

                if (parsed.type === 'INIT' || parsed.type === 'UPDATE') {
                    setData(prev => ({
                        ...prev,
                        ...parsed.data
                    }));
                } else if (parsed.type === 'LOG') {
                    setData(prev => ({
                        ...prev,
                        consensusLogs: [parsed.data, ...prev.consensusLogs].slice(0, 50)
                    }));
                }
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, '[SwarmDataService] ❌ Error parsing swarm event:', { error: err });
            }
        };

        eventSource.onerror = (err) => {
            omniLogger.error(LogCategory.SYSTEM, '[SwarmDataService] ⚠️ Swarm Stream Connection Error:', { error: err });
            // Optional: Implement reconnection logic or fallback to mock
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const forceRecalibration = useCallback(async () => {
        setIsRecalibrating(true);
        setData(prev => ({ ...prev, status: 'RECALIBRATING' }));

        try {
            await fetch('http://localhost:4000/api/adk/swarm/recalibrate', { method: 'POST' });
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[SwarmDataService] Failed to trigger recalibration:', { error })
            setData(prev => ({
                ...prev,
                status: 'DRIFT_DETECTED',
                consensusLogs: [{ time: new Date().toLocaleTimeString(), type: 'ERROR', msg: 'Recalibration Request Failed' }, ...prev.consensusLogs]
            }));
        } finally {
            setIsRecalibrating(false);
        }
    }, []);

    return {
        data,
        actions: {
            forceRecalibration
        }
    };
};
