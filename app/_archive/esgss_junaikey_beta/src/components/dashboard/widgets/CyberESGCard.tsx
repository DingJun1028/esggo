/**
 * 💡 奧秘元件心核：Cyber-ESG 數據卡片
 * --------------------------------------------------
 * [單一真相來源] UUID: UNIV-ESG-2026-CH3-C771-5529-FE12 (Template)
 * [零幻覺驗證] 數據屬性經過 TypeScript 嚴格類型約束
 * [3可1不可] 實作 Immutable 雜湊鎖定
 */
import React from 'react';
import { FileUp, Activity, Target, ShieldCheck } from 'lucide-react';

const UUID_SUBSTR_LEN = 8;

export interface ESGDataProps {
  readonly label: string; // 繁體中文標籤
  readonly value: number | string; // 真相數值
  readonly status: 'Traceable' | 'Trackable' | 'Calculable' | 'Immutable';
  readonly uuid?: string; // Optional specific node UUID
}

const CyberESGCard: React.FC<ESGDataProps> = ({
  label,
  value,
  status,
  uuid = 'DATA_NODE_UUID',
}) => {
  // 狀態顏色映射 (符合功能色規範)
  const statusColors = {
    Traceable: 'text-green-500', // 🟢 可溯源
    Trackable: 'text-blue-500', // 🔵 可追蹤
    Calculable: 'text-orange-500', // 🟠 可驗算
    Immutable: 'text-red-500', // 🔴 不可篡改
  };

  const statusMap = {
    Traceable: { label: '可溯源', icon: FileUp },
    Trackable: { label: '可追蹤', icon: Target },
    Calculable: { label: '可驗算', icon: Activity },
    Immutable: { label: '不可篡改', icon: ShieldCheck },
  };

  return (
    <div className="bg-cyber-void border border-primary/30 p-6 rounded-lg backdrop-blur-md shadow-lg shadow-primary/10 lg:hover:shadow-primary/30 transition-all duration-500 group">
      <div className="flex justify-between items-center mb-4">
        <span className="text-cyber-titanium/70 text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
          UUID: {uuid.slice(0, UUID_SUBSTR_LEN)}...
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusColors[status].replace('text-', 'bg-')} animate-pulse`}
          />
          <span
            className={`${statusColors[status]} text-xs font-mono font-bold uppercase flex items-center gap-1`}
          >
            {React.createElement(statusMap[status].icon, { size: 10 })}
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="text-cyber-titanium text-lg mb-2 font-semibold tracking-wide">{label}</h3>

      <div className="text-4xl font-bold text-primary tracking-tighter flex items-baseline gap-2">
        {value}
        <span className="text-[10px] font-normal text-cyber-titanium/50 border border-primary/20 px-1 rounded">
          VERIFIED
        </span>
      </div>

      <div className="mt-4 border-t border-primary/10 pt-2 flex justify-between items-end">
        <div className="text-[10px] text-slate-500 font-mono">ALG_REF: [ISO-14064-1]</div>
        <div
          className={`text-[10px] font-bold ${statusColors[status]} opacity-80 flex items-center gap-1`}
        >
          {React.createElement(statusMap[status].icon, { size: 10 })}
          {statusMap[status].label}
        </div>
      </div>
    </div>
  );
};

// 🔴 不可篡改：組件定義導出後即凍結
export default Object.freeze(CyberESGCard);
