import { NextResponse } from "next/server";
import { SquadAuditService } from "@/lib/services/squad-audit";

export const dynamic = "force-dynamic";

/**
 * Audit Vault API
 * Retrieves the certified audit trail and cryptographic evidence.
 */
export async function GET() {
    try {
        const auditService = SquadAuditService.getInstance();
        const logs = auditService.getLogs();

        return NextResponse.json({
            status: "success",
            logs: logs.reverse(), // Newest first
            stats: {
                totalSealed: logs.filter(l => l.action === "REPORT_SEALED").length,
                lastCertified: logs.length > 0 ? (logs[logs.length - 1]?.timestamp || null) : null
            }
        });
    } catch (error: any) {
        console.error("[Vault API] Failed to fetch audit logs:", error);
        return NextResponse.json({ error: "Failed to fetch vault data" }, { status: 500 });
    }
}
