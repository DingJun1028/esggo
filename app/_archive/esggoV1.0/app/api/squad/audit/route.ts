import { NextResponse } from "next/server";
import { SquadAuditService } from "@/lib/services/squad-audit";

export async function GET() {
    const auditService = SquadAuditService.getInstance();
    try {
        const logs = auditService.getLogs();
        return NextResponse.json({
            success: true,
            logs
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Failed to fetch audit logs"
        }, { status: 500 });
    }
}
