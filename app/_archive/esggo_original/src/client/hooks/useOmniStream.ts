import { useState, useEffect } from 'react';

export interface OmniEvent {
  id: string;
  type: 'TRACE' | 'COMPUTE' | 'SEAL' | 'MEMORY';
  payload: string;
  timestamp: string;
  integrity_hash?: string;
}

export function useOmniStream() {
  const [events, setEvents] = useState<OmniEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let isMounted = true;

    try {
      eventSource = new EventSource('/api/omnispace/sse');

      eventSource.onopen = () => {
        if (isMounted) setIsStreaming(true);
      };

      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const parsedData = JSON.parse(event.data);
          
          // Map backend event structure to OmniEvent
          const newEvent: OmniEvent = {
            id: parsedData.id || crypto.randomUUID(),
            type: parsedData.type || 'TRACE',
            payload: typeof parsedData.payload === 'string' ? parsedData.payload : JSON.stringify(parsedData.payload || parsedData),
            timestamp: parsedData.timestamp || new Date().toISOString(),
            integrity_hash: parsedData.integrity_hash
          };
          
          setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50
        } catch (error) {
          console.error('[useOmniStream] Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        if (!isMounted) return;
        console.error('[useOmniStream] SSE Error:', error);
        setIsStreaming(false);
      };
    } catch (err) {
      console.error('[useOmniStream] Failed to initialize EventSource:', err);
      if (isMounted) setIsStreaming(false);
    }

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
      setIsStreaming(false);
    };
  }, []);

  return {
    events,
    isStreaming
  };
}
