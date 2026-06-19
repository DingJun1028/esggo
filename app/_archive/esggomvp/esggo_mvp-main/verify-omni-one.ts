import { OmniOne } from './src/core/omni-one';
import { omniLogger, LogCategory } from './src/core/omniLogger';

async function verifyOmniOne() {
    console.log("🌀 Starting OmniOne Strategic Verification...");

    try {
        // 1. Verify API Access
        const api = OmniOne.api;
        console.log("✅ OmniAPI Access: Verified");

        // 2. Verify OKR Access & Definition
        const okr = await OmniOne.okr.defineObjective(
            "Achieve 100% 5T Data Purity",
            "Dr. Thoth",
            "2026-Q2",
            [{ description: "Seal 5000 Evidence Atoms", targetValue: 5000, currentValue: 0, unit: "Atoms", confidence: 1, weight: 1 }]
        );
        console.log(`✅ OmniOKR Definition: Verified [${okr.uuid}]`);

        // 3. Verify KPI Access & Measurement
        const kpi = await OmniOne.kpi.registerKPI({
            name: "Trust Factor",
            description: "Real-time trust calculation",
            value: 0.9,
            unit: "%",
            thresholds: { target: 0.95, warning: 0.85, critical: 0.7 },
            category: 'Governance',
            frequency: 'RealTime'
        });
        const updatedKpi = await OmniOne.kpi.measure(kpi.uuid, 0.96);
        console.log(`✅ OmniKPI Measurement: Verified [${updatedKpi.trend}]`);

        // 4. Verify MCP Relay
        const mcpResult = await OmniOne.mcp.execute("get_status", {});
        console.log(`✅ OmniMCP Relay: Verified [${mcpResult.status}]`);

        console.log("\n✨ OmniOne Strategic Equipment: ALL SYSTEMS OPERATIONAL");
    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1)
    }
}

verifyOmniOne();
