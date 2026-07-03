import { CelestialController } from '../src/lib/celestial/implementation';

async function runComprehensiveTest() {
  console.log("=== 啟動全面驗證 (Comprehensive Verification) ===");
  const celestial = new CelestialController();

  console.log("\n[Track 1] 驗證 Village Vote (ZKP Integrity)");
  const mockVoteData = {
    projectId: "proj_123",
    userId: "user_456",
    amount: 10,
    cost: 1000,
    power: 100,
    message: "測試村民 向「測試專案」投了 10 票 (花費 1000 PTS)",
    created_at: new Date().toISOString()
  };
  
  try {
    const purifiedVote = await celestial.executeCelestialFlow({
      payload: mockVoteData,
      origin: 'VILLAGE_VOTE'
    });
    console.log("✅ Track 1 成功！");
    console.log(" - 獲得 UUID:", purifiedVote!.uuid);
    console.log(" - 封印時間戳 (Seal Timestamp):", (purifiedVote as any).sealTimestamp);
    console.log(" - 資料是否凍結 (isFrozen):", Object.isFrozen(purifiedVote));
  } catch (e) {
    console.error("❌ Track 1 失敗", e);
  }

  console.log("\n[Track 2] 驗證 ESG Report Agent (Async Task Start)");
  const mockAgentData = {
    companyId: "esggo_corp",
    action: "START_ESG_REPORT"
  };

  try {
    const purifiedAgent = await celestial.executeCelestialFlow({
      payload: mockAgentData,
      origin: 'ESG_REPORT_AGENT'
    });
    console.log("✅ Track 2 成功！");
    console.log(" - 獲得 UUID:", purifiedAgent!.uuid);
    console.log(" - 封印時間戳 (Seal Timestamp):", (purifiedAgent as any).sealTimestamp);
    console.log(" - 資料是否凍結 (isFrozen):", Object.isFrozen(purifiedAgent));
  } catch (e) {
    console.error("❌ Track 2 失敗", e);
  }
}

runComprehensiveTest();
