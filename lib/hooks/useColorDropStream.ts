import { useState, useEffect, useCallback, useRef } from 'react';

// =========================================================================
// 1. 萬能元件心核 (IComponentCore) 前端對應
// =========================================================================
interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  evidence: string;
}

export interface AuditRecord {
  id: string;
  tenant_id: string;
  event_type: string;
  payload: {
    zkp_hash: string;
    nodes_involved: string[];
    metrics: Record<string, unknown>;
  };
  source_origin: string;
  timestamp: number;
  last_modified_by: string;
}

// 液態玻璃色彩與燈號對應狀態 (Tangible 可感知)
export interface VisualDropState {
  bgColor: string;      // 毛玻璃背景色
  borderColor: string;  // 邊框漸層色
  glowColor: string;    // 液態陰影與脈衝色
  label: string;        // 繁體中文語義化標籤
}

// =========================================================================
// 2. useColorDropStream React Hook 實作 (Trackable / Tangible)
// =========================================================================
export function useColorDropStream(token: string = 'taiwan-jwt-token') {
  const [events, setEvents] = useState<AuditRecord[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  // metrics state removed, now calculated with useMemo

  const eventSourceRef = useRef<EventSource | null>(null);

  const core = useMemo(() => {
    return {
      uuid: "ee4af378-b9d7-412d-91d2-d50b98fa0715",
      version: "2.6.0-stable.5T",
      timestamp: 1772421600000,
      evidence: "FRONTEND_SSE_HYDRATION_ACTIVE"
    };
  }, []);

  // 3. 實時將後端事件類型映射為液態玻璃設計語彙 (Tangible 視覺共鳴)
  const getVisualState = useCallback((eventType: string): VisualDropState => {
    switch (eventType) {
      case 'vault:seal:medical_zkp_ready':
        return {
          bgColor: 'rgba(167, 139, 250, 0.15)', // 半透明紫色 (Medical-Grade ZKP)
          borderColor: 'border-purple-400/40',
          glowColor: 'shadow-[0_0_15px_rgba(167,139,250,0.5)]',
          label: '醫學級 ZKP 驗證完成'
        };
      case 'qkp:healing:required':
        return {
          bgColor: 'rgba(245, 158, 11, 0.15)',  // 半透明琥珀色 (QKP Healing)
          borderColor: 'border-amber-400/40',
          glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
          label: 'QKP 系統自癒中'
        };
      case 'color:drop:verified':
      case 'system:flow:optimized':
        return {
          bgColor: 'rgba(129, 216, 208, 0.15)', // 半透明青色 (Liquid Glass Cyan)
          borderColor: 'border-[#81D8D0]/40',
          glowColor: 'shadow-[0_0_15px_rgba(129,216,208,0.5)]',
          label: '數據鏈降熵優化中'
        };
      default:
        return {
          bgColor: 'rgba(74, 62, 61, 0.1)',
          borderColor: 'border-white/20',
          glowColor: 'shadow-none',
          label: '系統安全監聽'
        };
    }
  }, []);

  // 4. 時光倒流鑑識重放觸發器 (Trackable Event Replay)
  const triggerForensicReplay = useCallback(async (speed: number = 2) => {
    try {
      console.log(`⏱️ [Replay Engine] 觸發時光倒流，倍速: ${speed}x`);
      const response = await fetch('/api/omni-table', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'replay', speed })
      });
      if (!response.ok) throw new Error('Replay trigger failed');
      return await response.json();
    } catch (err) {
      console.error('Replay triggering error:', err);
    }
  }, [token]);

  // 5. 建立 SSE 連線並處理實時事件流與狀態水合 (Hydration)
  useEffect(() => {
    const url = `/api/omni-table?stream=true`;
    console.log(`📡 [SSE Client] 正在與 AgentBus 建立安全實時串流連線...`);

    // 注意：因瀏覽器 EventSource 原生不支持自訂 Header，實務上可透過 cookie、URL 參數，
    // 或在 Proxy 路由中依據 Sessi 憑證進行租戶身分與 RLS 物理隔離對齊
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('connection:established', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setIsLive(true);
      console.log(`✔ [SSE Connection Established] 租戶: ${data.tenant_id}, 狀態: ${data.status}`);
    });

    eventSource.addEventListener('state:hydration', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      console.log(`💾 [State Hydration] 載入 ${data.records?.length || 0} 筆 RLS 隔離歷史紀錄`);
      if (data.records) {
        setEvents(data.records);
      }
    });

    eventSource.addEventListener('color:drop:live', (e: MessageEvent) => {
      const newRecord: AuditRecord = JSON.parse(e.data);
      console.log(`📡 [Live Color-Drop Received] 類型: ${newRecord.event_type}, 雜湊: ${newRecord.payload?.zkp_hash?.substring(0, 12)}...`);
      
      setEvents(prev => {
        // 防止重複的歷史回水
        if (prev.some(evt => evt.id === newRecord.id)) return prev;
        const updated = [...prev, newRecord];
        return updated.slice(-50); // 僅保留最新的 50 筆以防止前端內存耗竭
      });
    });

    eventSource.onerror = (err) => {
      console.warn('⚠️ SSE 串流連線暫時中斷，正在自動進行降級重試...', err);
      setIsLive(false);
    };

    return () => {
      console.log('🔌 關閉 SSE 連線，釋放系統資源。');
      eventSource.close();
    };
  }, [token]);

  // 6. 實時計算降熵指標與 ZKP 合規係數 (Transparent)
  const metrics = useMemo(() => {
    const totalCount = events.length;
    const verifiedCount = events.filter(e => 
      e.event_type === 'color:drop:verified' || 
      e.event_type === 'vault:seal:medical_zkp_ready'
    ).length;

    const zkpSuccessRate = totalCount > 0 
      ? ((verifiedCount / totalCount) * 100).toFixed(1) 
      : '100.0';

    // 依據熵減模型 ΔS 計算 (每多一個合規節點優化減 3.4%)
    const entropyReduction = totalCount > 0 
      ? -(totalCount * 3.4).toFixed(1) 
      : '0.0';

    return {
      totalCount,
      zkpSuccessRate,
      entropyReduction
    };
  }, [events]);

  const coreValue = coreRef.current; // Capture ref's value outside the return object creation

  return {
    events,
    isLive,
    metrics,
    getVisualState,
    triggerForensicReplay,
    core: coreValue
  };
}
