'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useServices } from '../contexts/ServiceContext';
/**
 * Custom Hook for real-time (WebSocket) Swarm Agent synchronization.
 */
export function useSwarmSync(injectedService) {
    const { swarmSyncService } = useServices();
    const [tasks, setTasks] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const lastSyncRef = useRef(new Date().toISOString());
    const service = useMemo(() => injectedService || swarmSyncService, [injectedService, swarmSyncService]);
    useEffect(() => {
        setLoading(true);
        service.connect({
            onTasksUpdated: (newTasks) => {
                setTasks(newTasks);
                lastSyncRef.current = new Date().toISOString();
                setError(null);
                setLoading(false);
            },
            onAgentsUpdated: (newAgents) => setAgents(newAgents),
            onError: (errMsg) => {
                setError(errMsg);
                setLoading(false);
            },
            onStatusChange: (status) => setIsConnected(status),
        });
        return () => service.disconnect();
    }, [service]);
    const refresh = useCallback(() => {
        setLoading(true);
        service.forceSync();
    }, [service]);
    return { tasks, agents, loading, error, isConnected, lastSync: lastSyncRef.current, refresh };
}
//# sourceMappingURL=useSwarmSync.js.map