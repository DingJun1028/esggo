import { Worker } from "@notionhq/workers";
import { j } from "@notionhq/workers/schema-builder";

const worker = new Worker();
export default worker;

// OmniCore v5.1 AI Agent Tools for Notion
worker.tool("getOmniCoreMetrics", {
	title: "Get OmniCore ESG Metrics",
	description: "查詢目前的 ESG 總體趨勢與碳排數據。",
	schema: j.object({
		metricType: j.string().nullable().describe("指標類型，例如 'carbon', 'governance'。若未提供則回傳總覧。"),
	}),
	execute: async ({ metricType }) => {
		try {
			const baseUrl = process.env.ESGGO_API_URL || "http://localhost:3000";
			// 在真實環境中，這裡會呼叫 OmniNexus 的 `/api/nexus`
			const response = await fetch(`${baseUrl}/api/nexus`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					tool: "analyze_trend",
					arguments: { prompt: metricType ? `分析 ${metricType} 指標` : "提供最新 ESG 總覽" }
				})
			});
			
			if (!response.ok) {
				// 若本地無伺服器，提供模擬回傳以供展示
				return `[模擬資料] 目前的 ESG 指標表現良好。${metricType ? `關於 ${metricType}：穩定成長中。` : "碳排減少 15%，治理評分 A+"}`;
			}
			
			const data = await response.json();
			return JSON.stringify(data);
		} catch (e) {
			return `[連線失敗或模擬資料] 無法連線至 OmniCore 伺服器，目前的 ESG 指標表現良好。${metricType ? `關於 ${metricType}：穩定成長中。` : "碳排減少 15%，治理評分 A+"}`;
		}
	},
});

worker.tool("getVillageVotingStatus", {
	title: "Get Village Voting Status",
	description: "查詢目前進行中的 Village 提案與二次方投票結果。",
	schema: j.object({
		projectId: j.string().nullable().describe("Village 專案的唯一 ID。若未提供則回傳所有熱門專案狀態。"),
	}),
	execute: async ({ projectId }) => {
		try {
			const baseUrl = process.env.ESGGO_API_URL || "http://localhost:3000";
			// 在真實環境中，這裡會串接 `/api/village/vote`
			const response = await fetch(`${baseUrl}/api/village/vote?projectId=${projectId || ''}`);
			
			if (!response.ok) {
				return `[模擬資料] Village 專案 ${projectId || '目前熱門提案'} 的投票狀態：已獲得 150 點二次方積分，社群參與度高。`;
			}
			
			const data = await response.json();
			return JSON.stringify(data);
		} catch (e) {
			return `[模擬資料] Village 專案 ${projectId || '目前熱門提案'} 的投票狀態：已獲得 150 點二次方積分，社群參與度高。`;
		}
	},
});
