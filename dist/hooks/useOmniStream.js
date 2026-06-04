import { useState, useEffect, useCallback } from 'react';
import { OmniEventSchema } from '@/src/shared/types';
export function useOmniStream(url = '/api/omnispace/sse') {
    const [events, setEvents] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        let eventSource = null;
        const connect = () => {
            eventSource = new EventSource(url);
            eventSource.onopen = () => {
                setIsConnected(true);
                setError(null);
            };
            eventSource.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);
                    // Zod parsing to ensure the event shape is correct (Liquid Glass Data Integrity)
                    const validEvent = OmniEventSchema.parse(parsedData);
                    setEvents((prev) => {
                        // Keep the latest 100 events to avoid memory bloat
                        const newEvents = [validEvent, ...prev];
                        return newEvents.slice(0, 100);
                    });
                }
                catch (err) {
                    console.error('Failed to parse OmniStream event:', err);
                }
            };
            eventSource.onerror = (err) => {
                console.error('OmniStream error:', err);
                setIsConnected(false);
                setError(new Error('Connection lost to OmniStream.'));
                eventSource?.close();
                // Reconnect after 3 seconds
                setTimeout(connect, 3000);
            };
        };
        connect();
        return () => {
            if (eventSource) {
                eventSource.close();
                setIsConnected(false);
            }
        };
    }, [url]);
    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);
    return {
        events,
        isConnected,
        error,
        clearEvents,
    };
}
//# sourceMappingURL=useOmniStream.js.map