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
    // In a real implementation, this would connect to a Server-Sent Events (SSE) endpoint.
    // For now, we simulate an incoming stream of events.
    setIsStreaming(true);

    const interval = setInterval(() => {
      const types: OmniEvent['type'][] = ['TRACE', 'COMPUTE', 'SEAL', 'MEMORY'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newEvent: OmniEvent = {
        id: crypto.randomUUID(),
        type: randomType,
        payload: `[OmniCore] Processing standard payload for ${randomType} protocol...`,
        timestamp: new Date().toISOString(),
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50
    }, 3000);

    return () => {
      clearInterval(interval);
      setIsStreaming(false);
    };
  }, []);

  return {
    events,
    isStreaming
  };
}
