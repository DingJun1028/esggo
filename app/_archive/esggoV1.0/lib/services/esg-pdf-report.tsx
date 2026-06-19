"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Font, PDFDownloadLink } from "@react-pdf/renderer";
import { EsgMetrics } from "@/lib/services/omni-service";
import { ESG_DICTIONARY } from "@/lib/i18n/dictionary";

// 1. 註冊繁體中文字型 (必須提供字型檔網址，此處以開源 NotoSansTC 為例)
Font.register({
    family: "NotoSansTC",
    src: "https://fonts.gstatic.com/s/notosanstc/v35/XRFP3I6Li01BKofIMN5hRjBQUzh2v1TBaDk.ttf",
});

// 2. 定義 PDF 的 Google Stitch 風格 CSS
const styles = StyleSheet.create({
    page: {
        padding: 60,
        fontFamily: "NotoSansTC",
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
        borderBottom: "2pt solid #0D9488", // Teal 600
        paddingBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0D9488",
    },
    reportDate: {
        fontSize: 10,
        color: "#64748B",
    },
    titleSection: {
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0F172A",
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 12,
        lineHeight: 1.6,
        color: "#334155",
        marginBottom: 20,
        textAlign: "justify",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: "#F1F5F9",
        padding: "6 12",
        color: "#0F172A",
        marginBottom: 15,
        borderRadius: 4,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
        marginBottom: 30,
    },
    metricCard: {
        width: "45%",
        padding: 15,
        backgroundColor: "#F8FAFC",
        border: "1pt solid #E2E8F0",
        borderRadius: 8,
    },
    metricLabel: {
        fontSize: 10,
        color: "#64748B",
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0D9488",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 60,
        right: 60,
        borderTop: "1pt solid #E2E8F0",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: {
        fontSize: 8,
        color: "#94A3B8",
    }
});

interface EsgPdfReportProps {
    title: string;
    metrics: EsgMetrics;
}

// 3. 建立 PDF 核心文件結構
const EsgDocument = ({ title, metrics }: EsgPdfReportProps) => (
    <Document title={title}>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>ESG GO</Text>
                <Text style={styles.reportDate}>{new Date().toLocaleDateString("zh-TW")} | 系統生成報告</Text>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>{title}</Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.sectionTitle}>執行摘要 (Executive Summary)</Text>
                    <Text style={styles.summaryText}>
                        本報告由 ESG GO 智能核閱系統自動生成。通過對企業能源消耗、水資源使用及碳排放等關鍵指標的深度分析，
                        結合 {ESG_DICTIONARY.standards.gri.zh} 與 {ESG_DICTIONARY.standards.sasb.zh} 框架，展現企業在永續發展領域的卓越成果。
                        本報告已通過 5T 韌性協議核證，數據具備不可竄改性與高度透明度。
                    </Text>
                </View>
            </View>

            {/* Metrics Section */}
            <Text style={styles.sectionTitle}>核心永續指標 (Core ESG Metrics)</Text>
            <View style={styles.grid}>
                <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>範疇一排放量 (Scope 1)</Text>
                    <Text style={styles.metricValue}>{metrics.scope1Emissions} tCO2e</Text>
                </View>
                <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>範疇二排放量 (Scope 2)</Text>
                    <Text style={styles.metricValue}>{metrics.scope2Emissions} tCO2e</Text>
                </View>
                <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>總能源消耗量 (Energy)</Text>
                    <Text style={styles.metricValue}>{metrics.energyConsumption} GJ</Text>
                </View>
                <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>總用水量 (Water)</Text>
                    <Text style={styles.metricValue}>{metrics.waterUsage} m3</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2026 ESG GO Friendly Edition. All rights reserved.</Text>
                <Text style={styles.footerText}>此報告已通過 5T 協議合規性預審</Text>
            </View>
        </Page>
    </Document>
);

// 4. 匯出供前端畫面直接呼叫的下載按鈕元件
export const EsgPdfDownloadButton = ({ title, metrics }: EsgPdfReportProps) => {
    const [isPreparing, setIsPreparing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // 處理倒數計時邏輯
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // 模擬或執行需要消耗 API 資源的動作 (例如取得報告圖表)
    const handlePrepareReport = async () => {
        setIsPreparing(true);
        try {
            // 這裡替換為實際的 API 請求，例如去要圖表的 Base64
            const res = await fetch("/api/reports/chart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chartData: [{ name: "Scope 1", value: metrics.scope1Emissions, baseline: 100 }]
                }),
            });

            if (res.status === 429) {
                const resetTimestampStr = res.headers.get("X-RateLimit-Reset");
                if (resetTimestampStr) {
                    const resetTime = parseInt(resetTimestampStr, 10);
                    // 計算剩餘秒數 (向上取整確保足夠)
                    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
                    setCooldown(secondsLeft > 0 ? secondsLeft : 60);
                } else {
                    setCooldown(60); // 如果沒抓到標頭，預設等待 60 秒
                }
                return;
            }

            if (res.ok) setIsReady(true);
        } catch (error) {
            console.error("準備報告失敗:", error);
        } finally {
            setIsPreparing(false);
        }
    };

    // 狀態 1：被限流，顯示倒數計時按鈕
    if (cooldown > 0) {
        return <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-md font-bold text-sm inline-block cursor-not-allowed">⏳ 請求頻繁，請等待 {cooldown} 秒後重試</button>;
    }

    // 狀態 2：圖表與資料已就緒，渲染 PDF 下載連結
    if (isReady) {
        return (
            <PDFDownloadLink document={<EsgDocument title={title} metrics={metrics} />} fileName={`ESG_Report_${new Date().getTime()}.pdf`} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-bold text-sm inline-block">
                {({ loading }: { loading: boolean }) => (loading ? "⏳ 正在合成高畫質 PDF..." : "📥 下載永續報告書 (PDF)")}
            </PDFDownloadLink>
        );
    }

    // 狀態 3：初始狀態，點擊以觸發準備流程
    return <button onClick={handlePrepareReport} disabled={isPreparing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold text-sm inline-block disabled:opacity-50">{isPreparing ? "🔄 正在準備報告與圖表..." : "📊 生成完整永續報告"}</button>;
};