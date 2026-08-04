import React from 'react';

export interface OmniBaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** 卡片視覺風格，支援預設與玻璃擬態 (Liquid Glass) */
  variant?: 'default' | 'liquid-glass' | 'ghost';
  /** 5T 協定狀態徽章 */
  statusIndicator?: 'trustworthy' | 'unverified' | 'warning' | 'error';
  /** 5T 密碼學綁定 Hash Lock 顯示 (Traceable/Trustworthy) */
  hashLock?: string;
}

/**
 * OmniBaseCard (萬能基礎卡片)
 * 根據 ESGGO 憲章與設計 10 大原則建構的通用 UI 元件。
 * 遵循 8px 間距基準，並內建深淺色過渡動效及 5T 協定徽章。
 */
export const OmniBaseCard: React.FC<OmniBaseCardProps> = ({
  children,
  className = '',
  variant = 'default',
  statusIndicator,
  hashLock,
  ...props
}) => {
  // 基礎樣式：8px (p-6 = 24px) 圓角與平滑過渡
  let baseClasses = 'rounded-2xl transition-all duration-300 p-6 flex flex-col relative overflow-hidden ';
  
  // 主題與視覺風格
  if (variant === 'liquid-glass') {
    // 液態玻璃動效 (Liquid Glass)
    baseClasses += 'bg-secondary/70 backdrop-blur-xl border border-borderColor/50 shadow-lg hover:shadow-xl hover:border-accentTeal/50 ';
  } else if (variant === 'ghost') {
    // 幽靈模式 (去背景)
    baseClasses += 'bg-transparent border border-dashed border-borderColor hover:border-accentTeal ';
  } else {
    // 預設卡片 (Solid)
    baseClasses += 'bg-secondary border border-borderColor shadow-sm hover:shadow-md ';
  }

  // 狀態顏色對映
  const getStatusColor = () => {
    switch(statusIndicator) {
      case 'trustworthy': return 'text-accentTeal';
      case 'warning': return 'text-accentGold';
      case 'error': return 'text-red-500';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {/* 5T Trust Lock Indicator - 確保資料的可感知性 (Tangible) 與可信度 (Trustworthy) */}
      {(statusIndicator || hashLock) && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono bg-primary/80 backdrop-blur-sm px-2 py-1 rounded-md border border-borderColor">
          {statusIndicator && (
            <span className={getStatusColor()} title={`Status: ${statusIndicator}`}>
              {statusIndicator === 'trustworthy' ? '🔒' : '⚠️'}
            </span>
          )}
          {hashLock && (
            <span className="text-textSecondary truncate max-w-[80px]" title={`Hash Lock: ${hashLock}`}>
              {hashLock.substring(0, 8)}...
            </span>
          )}
        </div>
      )}
      
      {/* 內部內容統一使用 8px 為基準的間距 (gap-4 = 16px) */}
      <div className="flex flex-col gap-4 w-full h-full text-textPrimary">
        {children}
      </div>
    </div>
  );
};
