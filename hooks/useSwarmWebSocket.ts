import { useEffect, useRef } from 'react';
import { useSwarmStore } from '@/store/useSwarmStore';

export function useSwarmWebSocket(url: string = 'ws://161.118.248.180:8642') {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setConnectionStatus, addEvent } = useSwarmStore();

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;
      
      setConnectionStatus('connecting');
      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (!isMounted) return;
        setConnectionStatus('connected');
        console.log('[Swarm] Connected to OmniGateway');
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          addEvent({
            type: data.type || 'UNKNOWN',
            source: data.source || 'OmniGateway',
            payload: data.payload || data,
            timestamp: data.timestamp || Date.now()
          });
        } catch (err) {
          console.error('[Swarm] Failed to parse message', err);
        }
      };

      ws.onerror = (error) => {
        if (!isMounted) return;
        console.error('[Swarm] WebSocket error', error);
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setConnectionStatus('disconnected');
        console.log('[Swarm] Disconnected. Reconnecting in 5s...');
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, setConnectionStatus, addEvent]);

  return wsRef;
}
