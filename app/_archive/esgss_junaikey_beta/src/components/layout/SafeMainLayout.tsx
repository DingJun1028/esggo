import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DebugDashboard } from '@/components/dashboard/DebugDashboard';

export const SafeMainLayout: React.FC = () => {
    return (
        <div className="p-10 text-white bg-slate-900 h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl text-cyan-400 mb-4 font-black">您已成功登入 (Authenticated)</h1>
            <div className="bg-yellow-900/30 border border-yellow-500/50 p-6 rounded-xl max-w-lg text-center shadow-2xl">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-yellow-200 mb-2">
                    核心儀表板維護中 (Maintenance Mode)
                </h2>
                <p className="text-slate-300">
                    主儀表板核心 (BentoBox) 目前正在進行系統重校與量子維護中。
                    我們已自動為您開啟「安全模式」以確保數據存取無虞。
                </p>
            </div>
            <DebugDashboard />
            <button
                className="mt-8 px-8 py-3 bg-red-600/20 border border-red-500 text-red-100 font-bold rounded-xl hover:bg-red-600 transition-all active:scale-95 shadow-lg"
                onClick={() => window.location.reload()}
            >
                重新載入系統核心 (Reload System)
            </button>
        </div>
    );
};
