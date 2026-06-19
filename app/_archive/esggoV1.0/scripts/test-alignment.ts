import { alignmentEngine } from "../lib/core/alignment-engine";
import { EsgMetrics } from "../lib/services/omni-service";

async function test() {
    const mockMetrics: EsgMetrics = {
        scope1Emissions: 100,
        scope2Emissions: 200,
        energyConsumption: 500,
        waterUsage: 1000,
        scope3Emissions: 50,
        hazardousWaste: 10,
        nonHazardousWaste: 100,
        femaleManagementPct: 35,
        trainingHoursPerEmployee: 20,
        totalEmissions: 350
    };

    console.log("Starting Alignment Analysis...");
    const results = await alignmentEngine.analyze(mockMetrics);

    results.forEach((res: any) => {
        console.log(`[${res.requirementId}] ${res.status} (Confidence: ${res.confidenceScore})`);
        console.log(` > Analysis: ${res.gapAnalysis}`);
    });
}

test().catch(console.error);
