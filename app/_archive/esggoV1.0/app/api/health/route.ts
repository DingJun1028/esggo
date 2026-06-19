import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, limit, query, getDocs } from "firebase/firestore";

export const dynamic = "force-dynamic";


/**
 * API Health Check / 系統健康檢查
 * 符合 ESG GO 維運標準，提供系統即時狀態。
 */
export async function GET() {
    const startTime = Date.now();

    const healthStatus: any = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        services: {
            server: "online",
            firestore: "unknown",
            recaptcha: "configured", // Static check for now
        },
        uptime: process.uptime(),
        latency: {}
    };

    try {
        // Test Firestore connectivity
        const firestoreStart = Date.now();
        const testQuery = query(collection(db, "system_metadata"), limit(1));
        await getDocs(testQuery);
        healthStatus.services.firestore = "online";
        healthStatus.latency.firestore = `${Date.now() - firestoreStart}ms`;
    } catch (error: any) {
        console.error("[Health Check] Firestore Error:", error);
        healthStatus.status = "degraded";
        healthStatus.services.firestore = "offline";
        healthStatus.error = error.message;
    }

    const totalDuration = Date.now() - startTime;
    healthStatus.latency.total = `${totalDuration}ms`;

    return NextResponse.json(healthStatus, {
        status: healthStatus.status === "healthy" ? 200 : 503,
        headers: {
            "Cache-Control": "no-store, max-age=0",
        },
    });
}
