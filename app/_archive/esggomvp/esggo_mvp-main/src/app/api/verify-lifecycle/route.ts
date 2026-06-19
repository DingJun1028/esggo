import { NextResponse } from 'next/server';
import { OmniOneMCPServer } from '@/core/omnione-mcp-server';
import { CelestialLifecycleManager } from '@/core/lifecycle-manager';

export async function GET() {
    console.log("🚀 Starting 5T Lifecycle Verification API...");

    const results: string[] = [];
    results.push("🚀 Starting 5T Lifecycle Verification...");

    try {
        // 1. Genesis Forge
        const uuid = await OmniOneMCPServer.forge("Genesis_Commander", {
            type: "ESG_STRATEGY",
            content: "Initial ESG Plan 2026"
        });
        results.push(`✅ Artifact Forged: ${uuid}`);

        const initial = OmniOneMCPServer.getArtifact(uuid);
        results.push(`Initial Version: ${initial._core.version}`);
        results.push(`Hash Lock: ${initial.hash_lock}`);

        // 2. Evolution (Update)
        results.push("\n🔮 Evolving Artifact...");
        await OmniOneMCPServer.evolve(
            uuid,
            { content: "Optimized ESG Plan 2026 (v2)" },
            "Strategy_Agent_Alpha",
            "[ISO-14064-2:2026]"
        );

        const evolved = OmniOneMCPServer.getArtifact(uuid);
        results.push(`Evolved Version: ${evolved._core.version}`);
        results.push(`New Hash Lock: ${evolved.hash_lock}`);
        results.push(`Evidence Chain Length: ${evolved._core.evidence.length}`);

        // 3. Immutability Check
        try {
            results.push("\n🛡️ Testing Immutability...");
            (evolved as any).content = "HACKED";
            results.push("❌ Immutability Failed: Object was modified!");
        } catch (e) {
            results.push("✅ Immutability Confirmed: Cannot modify frozen object.");
        }

        // 4. Verification Proof
        if (initial.hash_lock !== evolved.hash_lock) {
            results.push("✅ 5T Protocol Integrity Confirmed: Hash changed after state evolution.");
        } else {
            results.push("❌ 5T Protocol Integrity Failed: Hash did not change!");
        }

        return NextResponse.json({ success: true, log: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
