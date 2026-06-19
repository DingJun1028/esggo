import { NextResponse } from "next/server";
import { AgenticTwinService } from "@/core/agentic-twin-service";

export const runtime = 'edge';

export async function GET() {
    try {
        // 1. Business logic
        const twins = AgenticTwinService.listTwins();

        return NextResponse.json({
            success: true,
            data: twins
        });
    } catch (error: any) {
        console.error("🔴 Agentic Twin List API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
