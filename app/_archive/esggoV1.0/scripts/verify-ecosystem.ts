import { sustainabilityCodex } from "../lib/services/sustainability-codex";
import { dnaExchange } from "../lib/services/dna-exchange";
import { omniManager } from "../omni-manager";

async function verifyEcosystem() {
    console.log("=== ESG GO v4.5 Ecosystem Verification ===\n");

    // 1. ZKP & Codex Check
    console.log("[1/3] Testing SustainabilityCodex (RAG)...");
    const knowledge = await sustainabilityCodex.query("ISO-14064-1");
    console.log(`- Retrieved ${knowledge.length} knowledge fragments.`);
    console.log(`- Sample: ${knowledge[0]?.tag}`);

    // 2. DNA Exchange Check
    console.log("\n[2/3] Testing DNA Exchange Protocol...");
    const agentState = { mood: "Omniscient", level: 99, skill: "ShanXiang_Master" };
    const dnaJson = dnaExchange.exportDNA("OmniManager", agentState);
    console.log(`- Exported DNA: ${dnaJson.substring(0, 50)}...`);
    const assimilated = dnaExchange.importDNA(dnaJson);
    console.log(`- Assimilation Success: ${JSON.stringify(assimilated) === JSON.stringify(agentState)}`);

    // 3. A2A Hierarchy Check
    console.log("\n[3/3] Testing A2A Hierarchy...");
    const context: any = { state: {}, history: [] };
    const orchestration = await omniManager.orchestrate("深度合規稽核", context);
    console.log(`- Orchestration Result: ${orchestration.routedTo}`);
    console.log(`- Hierarchy Initialized: ${context.hierarchy?.superior === "OmniManager"}`);

    console.log("\n=== Ecosystem Verification Complete ===");
}

verifyEcosystem().catch(console.error);
