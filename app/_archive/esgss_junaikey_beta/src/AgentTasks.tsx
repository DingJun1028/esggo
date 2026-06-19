import React, { useMemo } from 'react';
import { Card } from '@/components/ui';

// 模擬從 API 或常量匯入的區域數據
const EARTHBONE_ZONES = ['亞太區', '歐洲區', '美洲區'];

export const AgentTasks: React.FC = () => {
  // 安全檢查：確保索引 0 存在，避免系統崩潰
  const primaryZone = useMemo(() => {
    return EARTHBONE_ZONES && EARTHBONE_ZONES.length > 0 ? EARTHBONE_ZONES[0] : '預設區域';
  }, []);

  return (
    <Card className="p-4 border-l-4 border-indigo-500 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-500 uppercase">當前監控區域</h4>
      <p className="text-2xl font-bold">{primaryZone}</p>
      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
        <span>●</span> 系統狀態：自演化邏輯運行中
      </div>
    </Card>
  );
};
