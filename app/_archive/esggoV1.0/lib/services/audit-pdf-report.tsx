"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register NotoSansTC for Chinese support
Font.register({
    family: "NotoSansTC",
    src: "https://fonts.gstatic.com/s/notosanstc/v35/XRFP3I6Li01BKofIMN5hRjBQUzh2v1TBaDk.ttf",
});

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: "NotoSansTC",
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        borderBottom: "2pt solid #000000",
        paddingBottom: 15,
    },
    logo: {
        fontSize: 20,
        fontWeight: "black",
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 8,
        color: "#666666",
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    hero: {
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },
    metadata: {
        flexDirection: "row",
        gap: 15,
        marginBottom: 20,
    },
    metaItem: {
        fontSize: 9,
        color: "#666666",
        backgroundColor: "#F5F5F5",
        padding: "4 8",
        borderRadius: 4,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#000000",
        color: "#FFFFFF",
        padding: "6 12",
        marginBottom: 15,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
    },
    card: {
        width: "47%",
        padding: 12,
        border: "1pt solid #EEEEEE",
        borderRadius: 8,
        marginBottom: 10,
    },
    cardLabel: {
        fontSize: 8,
        color: "#999999",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    cardValue: {
        fontSize: 14,
        fontWeight: "bold",
    },
    insightList: {
        marginTop: 5,
    },
    insightItem: {
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 8,
        paddingLeft: 10,
        borderLeft: "2pt solid #EEEEEE",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: "1pt solid #EEEEEE",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerText: {
        fontSize: 7,
        color: "#CCCCCC",
    }
});

export interface AuditReportData {
    timestamp: string;
    auditId: string;
    completeness: {
        metrics: number;
        chapters: number;
    };
    gaps: string[];
    recommendations: string[];
}

export const AuditPdfReport = ({ data }: { data: AuditReportData }) => (
    <Document title={`ESG_Audit_Report_${data.auditId}`}>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.logo}>ADK SQUAD COMMAND</Text>
                    <Text style={styles.tagline}>Tactical ESG Orchestration</Text>
                </View>
                <Text style={{ fontSize: 9 }}>5T_PROTOCOL_VERIFIED</Text>
            </View>

            {/* Hero */}
            <View style={styles.hero}>
                <Text style={styles.title}>永續報告書完整性稽核報告</Text>
                <View style={styles.metadata}>
                    <Text style={styles.metaItem}>稽核編號: {data.auditId}</Text>
                    <Text style={styles.metaItem}>生成時間: {data.timestamp}</Text>
                    <Text style={styles.metaItem}>狀態: 5T 合規預審中</Text>
                </View>
            </View>

            {/* Progress Grid */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>準備度概覽 (Readiness Overview)</Text>
                <View style={styles.grid}>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>量化數據完整度 (Metrics)</Text>
                        <Text style={styles.cardValue}>{data.completeness.metrics}%</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>敘事章節完成度 (Chapters)</Text>
                        <Text style={styles.cardValue}>{data.completeness.chapters}%</Text>
                    </View>
                </View>
            </View>

            {/* Gaps Section */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>關鍵缺口分析 (Critical Gap Analysis)</Text>
                <View style={styles.insightList}>
                    {data.gaps.map((gap, i) => (
                        <Text key={i} style={styles.insightItem}>• {gap}</Text>
                    ))}
                </View>
            </View>

            {/* Recommendations Section */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>優化行動建議 (Suggested Actions)</Text>
                <View style={styles.insightList}>
                    {data.recommendations.map((rec, i) => (
                        <Text key={i} style={styles.insightItem}>[ACTION {i + 1}] {rec}</Text>
                    ))}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>CONFIDENTIAL | Generated by Omni Agentic Network</Text>
                <Text style={styles.footerText}>Hash: 0x7d21a83c...42345e89</Text>
            </View>
        </Page>
    </Document>
);
