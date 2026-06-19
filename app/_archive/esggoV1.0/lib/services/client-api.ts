// Client-side helper to call API routes
import { MaterialityIssue, INcbReport } from '../types/ncb-types';

export async function fetchMaterialityIssues(): Promise<MaterialityIssue[]> {
    const res = await fetch('/api/materiality');
    return res.json();
}

export async function saveReport(report: INcbReport) {
    const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
    });
    return res.json();
}

export async function callGenkit(flowName: string, input: any) {
    // 獲取當前用戶身份憑證
    const { auth } = await import('@/lib/firebase');
    const token = await auth.currentUser?.getIdToken();

    const res = await fetch('/api/genkit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ flowName, input }),
    });
    return res.json();
}

export async function fetchCompetitiveAnalysis() {
    return [
        {
            peer: "同業 A (產業龍頭)",
            highlight: "溫室氣體盤查覆蓋率達 100%，並導入內部位碳定價機制。",
            inspiration: "建議在環境章節強調「數位化追蹤系統」的即時監控能力。"
        },
        {
            peer: "同業 B (創新標竿)",
            highlight: "員工訓練時數增長 20%，並實施「人才永續培育計畫」。",
            inspiration: "社會章節可加入「職能發展地圖」的視覺化圖表。"
        },
        {
            peer: "同業 C (在地深耕)",
            highlight: "社區參與專案投入金額連續三年成長，展現共融價值。",
            inspiration: "可強調與供應鏈在地化的連結強度。"
        }
    ];
}
