import { a2aAgentClient } from '../services/agents/A2AAgentClient';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * A2A Connection Demo
 * Demonstrates connecting to a remote agent via the A2A protocol.
 */
async function runA2ADemo() {
    omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] \n==================================================');
    omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] 🌐 A2A 代理連接演示 (Agent-to-Agent)');
    omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] ==================================================');

    try {
        // 1. 註冊本地運行的 A2A 遠端代理
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] 📡 正在註冊遠端研究代理 (本地測試 Server)...');
        a2aAgentClient.registerAgent({
            name: 'remote-lab-agent',
            description: '一個用於 A2A 協議測試的遠端代理',
            baseUrl: 'http://localhost:4000/agent',
            apiKey: 'lab-key-alpha'
        });

        // 2. 獲取代理資訊 (Agent Card)
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] 📋 正在獲取代理名片 (Agent Card)...');
        const card = await a2aAgentClient.getAgentCard('remote-lab-agent');
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] 代理資訊:', card);

        // 3. 向遠端代理發送訊息
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] \n💬 發送訊息: "請問什麼是 ESG？"');
        const response = await a2aAgentClient.chat('remote-lab-agent', '請問什麼是 ESG？');

        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] \n🤖 遠端代理回覆:');
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] --------------------------------------------------');
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] Info', { data: response });
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] --------------------------------------------------\n');

        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] ✅ A2A 連接演示成功！');
    } catch (error) {
        omniLogger.info(LogCategory.SYSTEM, '[A2ADemo] \n⚠️  提示: 如果您想看到真實的 A2A 交互，請在另一個終端執行 `npx tsx src/services/agents/A2AServer.ts`');
        omniLogger.error(LogCategory.SYSTEM, '[A2ADemo] ❌ A2A 演示異常 (可能是 Server 未啟動):', { error });
    }
}

runA2ADemo();
