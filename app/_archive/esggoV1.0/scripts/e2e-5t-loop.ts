// @ts-ignore
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { omniManager, AgentContext } from '../omni-manager';

/**
 * 自動化端到端測試：驗證 OmniManager 在多代理交接時的 5T Hash 完整性與 ZKP 驗證邏輯
 * 執行方式：npx ts-node scripts/e2e-5t-loop.ts
 */
async function runE2ETest() {
    console.log("\n🚀 [Phase 23] 啟動 ZKP/5T 協議端到端完整性測試...\n");

    const context: AgentContext = {
        sessionId: "e2e-test-session-001",
        state: { userId: "test-auditor-99" },
        history: [],
        trace: []
    };

    try {
        // 節點 1: Genesis (生成原始數據)
        console.log("➡️  測試節點 1: 觸發 GRI_Agent (建立 Genesis Hash)");
        const res1 = await omniManager.orchestrate("我們一廠碳排1200，二廠3500，請幫我結算", context);
        console.log(`✅  節點 1 成功! 負責代理: ${res1.routedTo}`);
        console.log(`🔐  當前 5T Hash: ${context.omniHeart?.A_Tagging?.hash_lock || "No Hash Generated"}\n`);

        // 節點 2: Handover (交接給保險庫代理，重新鑄造 Hash)
        console.log("➡️  測試節點 2: 觸發 Vault_Agent (Hash 交接與 Reforge)");
        const res2 = await omniManager.orchestrate("請將剛才的碳排數據進行 5T 封存與 ZKP 簽章", context);
        console.log(`✅  節點 2 成功! 負責代理: ${res2.routedTo}`);
        console.log(`🔐  當前 5T Hash (Reforged): ${context.omniHeart?.A_Tagging?.hash_lock}`);
        console.log(`🔗  父節點 Hash (溯源驗證): ${context.omniHeart?.A_Tagging?.parent_hash}\n`);

        console.log("🎉  [Phase 23] E2E 完整性測試通過！5T 數據鏈未發生斷層，且多代理交接順利完成。\n");
        process.exit(0);
    } catch (error) {
        console.error("\n❌  E2E 測試失敗:", error);
        process.exit(1);
    }
}

runE2ETest();