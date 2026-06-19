/**
 * 賽博風格 Loading 組件
 * 統一的加載狀態展示
 */
import React from 'react';

interface CyberLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const CyberLoading: React.FC<CyberLoadingProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* 外圈靜態 */}
        <div className="absolute inset-0 border-4 border-[#00FFFF]/20 rounded-full"></div>
        {/* 旋轉環 */}
        <div className="absolute inset-0 border-4 border-t-[#00FFFF] border-r-[#00FFFF]/50 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        {/* 內圈脈動 */}
        <div className="absolute inset-2 bg-[#00FFFF]/10 rounded-full animate-pulse"></div>
        {/* 中心點 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#00FFFF] rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
        </div>
      </div>

      {message && <p className="text-[#00FFFF] text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export const CyberEmpty: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-20 h-20 mb-6 rounded-full bg-[#00FFFF]/20 border-2 border-[#00FFFF]/30 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-[#00FFFF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-[#00FFFF] text-lg font-medium mb-2">No Data Available</p>
      <p className="text-[#00FFFF]/80 text-sm max-w-md">{message}</p>
    </div>
  );
};
