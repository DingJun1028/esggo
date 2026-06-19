"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ==========================================
// 全端雙向 TypeScript：定義共用資料型別
// 實務上這個 Interface 會放在統一的 types 資料夾中，供前後端共用
// ==========================================
export interface EsgMetricData {
    id: string;
    title: string;          // 顯示標題 (如：溫室氣體總排放量)
    value: number;          // 核心數值
    unit: string;           // 單位 (如：tCO2e)
    trend: "up" | "down" | "stable"; // 趨勢
    percentageChange: number; // 變動百分比
}

interface EsgMetricCardProps {
    metric: EsgMetricData;
}

// ==========================================
// Google Stitch UIUX & 英標繁博
// ==========================================
export const EsgMetricCard = ({ metric }: EsgMetricCardProps) => {
    const isFavorable = metric.trend === "down"; // 假設下降對 ESG 通常是好的 (如碳排、耗水)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white border border-stitch-border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Title - 英標繁博：變數名為 title，顯示為繁體中文 */}
            <h3 className="text-xs font-black uppercase tracking-widest text-stitch-text-muted mb-2">
                {metric.title}
            </h3>

            {/* Main Value */}
            <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-3xl font-black tracking-tight text-stitch-text">
                    {metric.value.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-stitch-text-muted">
                    {metric.unit}
                </span>
            </div>

            {/* Trend Indicator - Google Stitch 色彩系統 */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${isFavorable
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : metric.trend === "up"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-stitch-bg text-stitch-text-muted border border-stitch-border"
                }`}>
                {metric.trend === "up" ? <TrendingUp className="w-3 h-3" /> : metric.trend === "down" ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{Math.abs(metric.percentageChange)}% 較上期</span>
            </div>
        </motion.div>
    );
};