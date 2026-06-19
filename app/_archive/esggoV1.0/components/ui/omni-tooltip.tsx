import React from "react";
import { Activity } from "lucide-react";

export interface OmniTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    variant?: "default" | "cream" | "minimal";
}

export const OmniTooltip = ({ active, payload, label, variant = "default" }: OmniTooltipProps) => {
    if (active && payload && payload.length) {
        let containerClass = "bg-white/95 backdrop-blur-md border border-stone-200 p-4 rounded-2xl shadow-xl";
        let headerClass = "text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 border-b border-stone-100 pb-2 flex items-center gap-2";
        let iconClass = "w-3 h-3 text-primary-teal-start";

        switch (variant) {
            case "cream":
                containerClass = "bg-[#FAF9F6]/95 backdrop-blur-md border border-[#E8E4DC] p-4 rounded-2xl shadow-lg";
                headerClass = "text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-3 border-b border-[#E8E4DC] pb-2 flex items-center gap-2";
                iconClass = "w-3 h-3 text-amber-600";
                break;
            case "minimal":
                containerClass = "bg-white/95 backdrop-blur-sm border border-black/5 p-4 rounded-xl shadow-sm";
                headerClass = "text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 border-b border-black/5 pb-2 flex items-center gap-2";
                iconClass = "w-3 h-3 text-stone-400";
                break;
        }

        return (
            <div className={containerClass}>
                <div className={headerClass}>
                    <Activity className={iconClass} />
                    [ {label} ] DATA_POINT
                </div>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-8 py-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm shadow-sm" style={{ backgroundColor: entry.color }} />
                            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-widest">
                                {entry.name === 'emissions' ? '實測數值' : '基準線'}
                            </span>
                        </div>
                        <span className="text-sm font-black tracking-tighter" style={{ color: entry.color }}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};