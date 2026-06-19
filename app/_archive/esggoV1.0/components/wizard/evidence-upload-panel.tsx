"use client";

import { IndicatorLibraryPanel } from "@/components/wizard/indicator-library-panel";

export const EvidenceUploadPanel = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-stone-800">📊 數據化記輸入</h3>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                        選擇指標、填入數字，AI 自動對標 GRI/SASB 標準——儲存即完成
                    </p>
                </div>
            </div>
            {/* Atomic Indicator Library Panel */}
            <div className="h-[600px]">
                <IndicatorLibraryPanel />
            </div>
        </div>
    );
};
