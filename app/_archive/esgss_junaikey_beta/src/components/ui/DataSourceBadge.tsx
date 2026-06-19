/**
 * 數據來源標籤組件
 * --------------------------------------------------
 * [功能] 顯示數據來源、類型、可信度
 * [原則] 真善美 - 透明呈現數據出處
 */

import React from 'react';
import {
  ShieldCheck,
  Activity,
  Calculator,
  AlertCircle,
  Database,
  ExternalLink,
} from 'lucide-react';
import { DataSource, ConfidenceLevel } from '@/types/DataSource';

interface DataSourceBadgeProps {
  source: DataSource;
  confidenceLevel?: ConfidenceLevel;
  showDetails?: boolean;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  source,
  confidenceLevel = 'demo',
  showDetails = false,
}) => {
  const getBadgeStyle = () => {
    switch (source.sourceType) {
      case 'certified':
        return 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400';
      case 'realtime':
        return 'bg-blue-900/20 border-blue-500/30 text-blue-400';
      case 'calculated':
        return 'bg-purple-900/20 border-purple-500/30 text-purple-400';
      case 'demo':
        return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400';
      case 'user_input':
        return 'bg-slate-900/20 border-slate-500/30 text-slate-400';
      default:
        return 'bg-gray-900/20 border-gray-500/30 text-gray-400';
    }
  };

  const getIcon = () => {
    switch (source.sourceType) {
      case 'certified':
        return <ShieldCheck size={12} />;
      case 'realtime':
        return <Activity size={12} />;
      case 'calculated':
        return <Calculator size={12} />;
      case 'demo':
        return <AlertCircle size={12} />;
      case 'user_input':
        return <Database size={12} />;
      default:
        return <AlertCircle size={12} />;
    }
  };

  const getLabel = () => {
    switch (source.sourceType) {
      case 'certified':
        return source.certifyingBody || '已認證';
      case 'realtime':
        return '實時數據';
      case 'calculated':
        return '系統計算';
      case 'demo':
        return '示範數據';
      case 'user_input':
        return '用戶輸入';
      default:
        return '未知來源';
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${getBadgeStyle()}`}
      >
        {getIcon()}
        <span className="font-medium">{getLabel()}</span>
        {source.certificationNumber && (
          <span className="font-mono text-[10px]">#{source.certificationNumber}</span>
        )}
        {source.certificateUrl && (
          <a
            href={source.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            title="查看證書"
          >
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      {showDetails && source.disclaimer && (
        <div className="text-[10px] text-slate-500 max-w-xs">{source.disclaimer}</div>
      )}

      {showDetails && source.calculationMethod && (
        <div className="text-[10px] text-slate-500 max-w-xs">
          計算方法: {source.calculationMethod}
        </div>
      )}
    </div>
  );
};

/**
 * 數據可信度指示器
 */
export const ConfidenceLevelIndicator: React.FC<{ level: ConfidenceLevel }> = ({ level }) => {
  const getStyle = () => {
    switch (level) {
      case 'verified':
        return 'bg-emerald-500';
      case 'estimated':
        return 'bg-blue-500';
      case 'demo':
        return 'bg-yellow-500';
      case 'unverified':
        return 'bg-red-500';
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'verified':
        return '已驗證';
      case 'estimated':
        return '估算值';
      case 'demo':
        return '示範';
      case 'unverified':
        return '未驗證';
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 text-xs">
      <div className={`w-2 h-2 rounded-full ${getStyle()}`} />
      <span className="text-slate-400">{getLabel()}</span>
    </div>
  );
};
