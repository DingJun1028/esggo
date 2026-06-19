import { useState, useEffect } from 'react';
import { WidgetConfig } from '../types';

export const useRealTimeUpdates = (widgets: WidgetConfig[]) => {
    const [isConnected, setIsConnected] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    useEffect(() => {
        // Mock connection
        setIsConnected(true);
        const interval = setInterval(() => {
            setLastUpdate(Date.now());
        }, 5000);
        return () => clearInterval(interval);
    }, [widgets]);

    return { isConnected, lastUpdate };
};
