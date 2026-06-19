/**
 * SustainabilityReportCenterView
 * 企業級永續報告工作區入口。直接導向 EnterpriseReportHub。
 */

"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const EnterpriseReportHub = dynamic(() => import("./enterprise-report-hub"), {
    loading: () => <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-stone-300" /></div>,
    ssr: false
});

export function SustainabilityReportCenterView() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <EnterpriseReportHub />
        </div>
    );
}

export default SustainabilityReportCenterView;
