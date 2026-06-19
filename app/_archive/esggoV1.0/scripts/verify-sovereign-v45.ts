import { OmniManagerAgent } from "../omni-manager";
import { mcpClient } from "../lib/services/mcp-client";
import { alignmentEngine } from "../lib/core/alignment-engine";
import { doomsdayClock } from "../lib/services/doomsday-clock";
import { engineeringOptimizer } from "../lib/core/engineering-optimizer";
import { assetService } from "../lib/services/asset-service";
import { EsgMetrics } from "../lib/services/omni-service";

async function verify() {
    console.log("=== ESG GO v4.5 Sovereign Verification ===\n");

    // 1. Verify Durable Execution
    console.log("[1/3] Testing Durable Execution...");
    const manager = new OmniManagerAgent();
    // Since localStorage is not available in node, we expect it to fail gracefully
    // But we can verify the method existence and logic flow
    const taskId = manager.addTask("Verify sustainable forest metrics", "JMJ");
    console.log(`- Created Durable Task: ${taskId}`);

    const tasks = manager.getActiveTasks();
    if (tasks.has(taskId)) {
        console.log("- Task successfully added to internal Map.");
    }

    // 2. Verify McpClient
    console.log("\n[2/3] Testing MCP Client...");
    await mcpClient.connect("smart-grid-01", "http://smartgrid.local/mcp");
    const gridData = await mcpClient.readResource("smart-grid-01", "mcp://grid/consumption");
    console.log(`- MCP Resource Read: ${gridData.value} ${gridData.unit}`);
    const toolResult = await mcpClient.callTool("smart-grid-01", "adjust_load", { target: 40 });
    console.log(`- MCP Tool Call: ${toolResult.status}`);

    // 3. Verify Alignment Engine (Resonance & Penalty)
    console.log("\n[3/3] Testing Alignment Engine (Sovereign Logic)...");
    const testMetrics: EsgMetrics = {
        scope1Emissions: 100, // Matching JMJ/KJL domain
        energyConsumption: 500,
    };

    const results = await alignmentEngine.analyze(testMetrics);

    // Check for GRI-305-1 (should have resonance boost)
    const gri305 = results.find(r => r.requirementId === "GRI-305-1");
    console.log(`- GRI-305-1 (KJL Linked) Score: ${gri305?.confidenceScore}`);

    // Check for a gap/hallucination scenario
    const unknownReq = results.find(r => r.requirementId === "UNKNOWN");
    if (results.some(r => r.gapAnalysis?.includes("Penalty"))) {
        console.log("- Hallucination Penalty logic successfully triggered in gaps.");
    }

    // 4. Verify RPG Gamification
    console.log("\n[4/4] Testing RPG Gamification Layer...");
    doomsdayClock.recordCoordinationFailure(10); // Multi-polar failure
    const clockStatus = doomsdayClock.getStatus();
    console.log(`- Doomsday Clock Status: ${clockStatus.secondsToMidnight}s (Critical: ${clockStatus.isCritical})`);

    const quests = await manager.generateQuests(testMetrics);
    console.log(`- Generated ${quests.length} Dynamic Quests in Adventure Hall.`);
    if (quests.length > 0 && quests[0]) {
        console.log(`- Quest 0 Urgency: ${quests[0].urgency}`);
    }

    // 5. Verify Whitepaper Alignment (SNA/SATD/Presets)
    console.log("\n[5/5] Aligning with Whitepaper (Advanced Logic)...");
    const debt = await engineeringOptimizer.scanTechnicalDebt();
    const entropy = engineeringOptimizer.analyzeEntropy();
    console.log(`- Technical Debt (SATD): ${debt} markers found.`);
    console.log(`- Code Entropy (SNA): ${entropy.toFixed(2)} KB units.`);

    const alchemyResult = await assetService.processAlchemy("VILLAGE_OWNER_01");
    console.log(`- Alchemy Success: ${alchemyResult.success}`);
    console.log(`- Coins Minted: ${alchemyResult.coinsMinted} | New Balance: ${alchemyResult.newBalance}`);
    console.log(`- Asset Lock ID: ${alchemyResult.assetId}`);

    console.log("\n=== Final Sovereign Verification Complete ===");
}

verify().catch(console.error);
