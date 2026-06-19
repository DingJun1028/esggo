
import openClawClient from '../server/services/OpenClawGatewayClient.js';
import omniLogger, { LogCategory } from '../server/utils/omniLogger.js';

async function test() {
    try {
        console.log("🚀 Testing OpenClaw Gateway Connection...");
        await openClawClient.connect();
        console.log("✅ Connected.");

        console.log("💬 Sending Chat Request...");
        const response = await openClawClient.chat("Ping");
        console.log("📩 Response received:", JSON.stringify(response, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("❌ Test failed:", err);
        process.exit(1);
    }
}

test();
