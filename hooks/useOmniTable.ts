import { useState, useEffect } from 'react';

export interface OmniTableRecord {
  id: string;
  tenant_id: string;
  event_type: string;
  payload: {
    zkp_hash?: string;
    nodes_involved?: string[];
    metrics?: any;
  };
  source_origin: string;
  last_modified_by: string;
  timestamp: number;
}

export function useOmniTable(token: string = 'valid-jwt-token') {
  const [records, setRecords] = useState<OmniTableRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');

  useEffect(() => {
    const eventSource: EventSource | null = null;
    let isMounted = true;

    const connectSSE = () => {
      setConnectionStatus('CONNECTING');
      setLoading(true);
      
      // We pass the token in URL since EventSource doesn't support headers directly in browser without polyfills.
      // But the current API requires Bearer token.
      // Let's fallback to standard polling if SSE with headers is tricky, or use a custom fetch stream.
      // Since fetch allows headers, we will manually parse the SSE stream via fetch.
      
      const abortController = new AbortController();

      const fetchStream = async () => {
        try {
          const response = await fetch('/api/omni-table?stream=true', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            signal: abortController.signal
          });

          if (!response.ok) {
            throw new Error(`Connection failed: ${response.statusText}`);
          }

          if (isMounted) setConnectionStatus('CONNECTED');
          if (isMounted) setLoading(false);

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          if (reader) {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              
              // Keep the last partial line in the buffer
              buffer = lines.pop() || '';

              let currentEventName = '';
              for (const line of lines) {
                if (line.startsWith('event: ')) {
                  currentEventName = line.substring(7).trim();
                } else if (line.startsWith('data: ')) {
                  const dataStr = line.substring(6).trim();
                  if (dataStr) {
                    try {
                      const data = JSON.parse(dataStr);
                      handleSseEvent(currentEventName, data);
                    } catch (e) {
                      console.warn('Failed to parse SSE data', e);
                    }
                  }
                }
              }
            }
          }
        } catch (err: any) {
          if (err.name !== 'AbortError' && isMounted) {
            setError(err);
            setConnectionStatus('DISCONNECTED');
            setLoading(false);
          }
        }
      };

      const handleSseEvent = (eventName: string, data: any) => {
        if (!isMounted) return;
        
        switch (eventName) {
          case 'state:hydration':
            setRecords(data.records || []);
            break;
          case 'color:drop:live':
          case 'color:drop:verified':
          case 'system:flow:optimized':
            // Prepend new live event to records
            setRecords(prev => [data, ...prev]);
            break;
          default:
            // Generic fallback for any other new records
            if (data && data.id && data.event_type) {
                setRecords(prev => {
                    if (prev.find(r => r.id === data.id)) return prev;
                    return [data, ...prev];
                });
            }
            break;
        }
      };

      fetchStream();

      return () => {
        abortController.abort();
      };
    };

    const cleanup = connectSSE();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [token]);

  return { records, loading, error, connectionStatus };
}
