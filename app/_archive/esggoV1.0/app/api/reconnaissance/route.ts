import { NextResponse } from "next/server";
import { generateDecisionReadyInsight } from "@/lib/services/ai-insight";

// 模擬從 Prisma 資料庫與 ESGSonar 爬蟲引擎取得的原始資料
// 實際上這會是 `await prisma.regulation.findMany(...)` 或 `await prisma.crawlHistory.findMany(...)`
const MOCK_DB_RECORDS = [
  {
    id: "reg-1",
    source_url: "https://www.fsc.gov.tw/ch/home.jsp?id=96&parentpath=0,2&mcustomize=news_view.jsp&dataserno=202401150001",
    raw_text: "金管會發布「上市櫃公司永續發展行動方案（2023年）」，要求實收資本額達20億元之上市櫃公司，自2025年起編製永續報告書，並揭露溫室氣體盤查資訊。未依規定辦理者，將處以新台幣24萬元以上480萬元以下罰鍰。",
    category: "S1", // 預設分類
    hash: "a8f5f167f44f4964e6c998dee827110c", // 模擬 Hash Lock
    diff: "@@ -1,3 +1,4 @@\n-要求實收資本額達50億元之上市櫃公司\n+要求實收資本額達20億元之上市櫃公司\n+未依規定辦理者，將處以新台幣24萬元以上480萬元以下罰鍰。"
  },
  {
    id: "reg-2",
    source_url: "https://www.ifrs.org/projects/work-plan/climate-related-disclosures/",
    raw_text: "ISSB (International Sustainability Standards Board) has issued IFRS S2 Climate-related Disclosures. Entities are required to disclose Scope 3 greenhouse gas emissions, including upstream and downstream supply chain emissions, starting from annual reporting periods beginning on or after 1 January 2024. The data quality must be assured by an independent third party.",
    category: "S2",
    hash: "b9c8a234e12d3456f78a90bcd123456e",
    diff: "@@ -5,2 +5,3 @@\n-Entities are encouraged to disclose Scope 3\n+Entities are required to disclose Scope 3\n+The data quality must be assured by an independent third party."
  }
];

export async function GET() {
  try {
    // 1. 從資料庫撈取最新的爬蟲紀錄 (模擬)
    const records = MOCK_DB_RECORDS;

    // 2. 透過 AI Insight Pipeline 處理每一筆資料
    // 注意：為了避免在預覽環境中過度消耗 API 額度，這裡我們只處理第一筆，其餘使用預設值
    const intelNodes = await Promise.all(
      records.map(async (record, index) => {
        let aiInsight;
        
        // 模擬：只對第一筆資料呼叫真實的 Gemini API，其餘使用快取/預設值
        if (index === 0 && process.env.GEMINI_API_KEY) {
          aiInsight = await generateDecisionReadyInsight(record.raw_text, record.source_url);
        } else {
          aiInsight = {
            title: index === 0 ? "金管會擴大永續報告書強制編製範圍" : "ISSB IFRS S2 強制揭露範疇三溫室氣體排放",
            category: record.category as any,
            impact_level: index === 0 ? 4 : 5,
            decision_ready_insight: index === 0 
              ? "金管會下修永續報告書門檻至20億元，並新增罰則。建議財務部與法務部立即盤點子公司資本額，並於本季啟動溫室氣體盤查專案，避免最高480萬罰鍰。"
              : "ISSB 正式要求範疇三碳排揭露且需第三方確信。建議採購部立即啟動一階供應商碳排數據收集計畫，並編列明年確信預算。",
            target_entities: index === 0 ? ["財務部", "法務部", "永續委員會"] : ["採購部", "供應鏈管理", "永續委員會"]
          };
        }

        // 3. 封裝成 5T 協議格式 (IIntelNode5T)
        return {
          uuid: `INTEL-${record.id}-${Date.now()}`,
          version: "2.0.0",
          timestamp: Date.now(),
          category: aiInsight.category,
          impact_level: aiInsight.impact_level,
          protocol_5T: {
            tangible: true,
            traceable: record.source_url,
            trackable: ["CRAWLER_FETCHED", "DIFF_ENGINE_PROCESSED", "AI_INSIGHT_GENERATED"],
            transparent: "Diff_Engine_v1.0 [Unified_Diff]",
            trustworthy: record.hash, // 來自 Hash Lock 機制
          },
          payload: {
            title: aiInsight.title,
            decision_ready_insight: aiInsight.decision_ready_insight,
            target_entities: aiInsight.target_entities,
          },
          // 附加 Diff 資訊供前端渲染
          evidence: {
            unified_diff: record.diff,
            raw_text: record.raw_text
          }
        };
      })
    );

    return NextResponse.json({ success: true, data: intelNodes });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reconnaissance data" }, { status: 500 });
  }
}
