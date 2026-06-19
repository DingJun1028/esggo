import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-lg font-medium tracking-widest animate-pulse">系統啟動中...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
