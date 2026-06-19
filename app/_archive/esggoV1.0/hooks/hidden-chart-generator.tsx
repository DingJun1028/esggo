"use client";

import React, { useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import html2canvas from "html2canvas";

interface HiddenChartGeneratorProps {
    data: any[];
    onGenerated: (base64Image: string) => void;
}

export const HiddenChartGenerator = ({ data, onGenerated }: HiddenChartGeneratorProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    // 當圖表繪製/動畫完成時直接由 Recharts 觸發此函數
    const handleAnimationEnd = async () => {
        if (chartRef.current) {
            try {
                const canvas = await html2canvas(chartRef.current, {
                    scale: 2,
                    backgroundColor: "#ffffff",
                });
                const base64Image = canvas.toDataURL("image/png");
                onGenerated(base64Image);
            } catch (error) {
                console.error("背景圖表生成失敗:", error);
            }
        }
    };

    return (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
            <div ref={chartRef} style={{ width: "800px", height: "400px", backgroundColor: "#fbfbfb", padding: "40px", borderRadius: "24px" }}>
                <div style={{ fontSize: "12px", fontWeight: "900", color: "#111827", marginBottom: "20px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Neural_Trend_Analysis // Forensic_Data_Pool
                </div>
                <BarChart width={720} height={300} data={data}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0D9488" stopOpacity={1} />
                            <stop offset="100%" stopColor="#0F766E" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                        onAnimationEnd={handleAnimationEnd}
                    />
                </BarChart>
            </div>
        </div>
    );
};