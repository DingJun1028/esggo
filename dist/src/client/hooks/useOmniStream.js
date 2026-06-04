import { useState, useEffect } from 'react';
export function useOmniStream() {
    const [events, setEvents] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    useEffect(() => {
        let eventSource = null;
        let isMounted = true;
        try {
            eventSource = new EventSource('/api/omnispace/sse');
            eventSource.onopen = () => {
                if (isMounted)
                    setIsStreaming(true);
            };
            eventSource.onmessage = (event) => {
                if (!isMounted)
                    return;
                try {
                    const parsedData = JSON.parse(event.data);
                    // Map backend event structure to OmniEvent
                    const newEvent = {
                        id: parsedData.id || crypto.randomUUID(),
                        type: parsedData.type || 'TRACE',
                        payload: typeof parsedData.payload === 'string' ? parsedData.payload : JSON.stringify(parsedData.payload || parsedData),
                        timestamp: parsedData.timestamp || new Date().toISOString(),
                        integrity_hash: parsedData.integrity_hash
                    };
                    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50
                }
                catch (error) {
                    console.error('[useOmniStream] Error parsing SSE data:', error);
                }
            };
            eventSource.onerror = (error) => {
                if (!isMounted)
                    return;
                console.error('[useOmniStream] SSE Error:', error);
                // 如果是斷開連接，將狀態設為 false
                setIsStreaming(false);
            };
        }
        catch (err) {
            console.error('[useOmniStream] Failed to initialize EventSource:', err);
            // 移除這裡的同步 setState，因為 catch 區塊在初始化時執行
            // setIsStreaming(false); 初始值已經是 false，不需要在這裡再次設定
        }
        return () => {
            isMounted = false;
            if (eventSource) {
                eventSource.close();
            }
            // Effect 清理函數中設定狀態也是異步渲染週期的一部分
        };
    }, []);
    return {
        events,
        isStreaming
    };
}
//# sourceMappingURL=useOmniStream.js.map