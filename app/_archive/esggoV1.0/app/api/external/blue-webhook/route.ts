import { NextResponse } from "next/server";
import crypto from "crypto";

// In a real app, this would be in env variables
const BLUE_WEBHOOK_SECRET = process.env.BLUE_WEBHOOK_SECRET || "esg_go_secret_123";

/**
 * POST /api/external/blue-webhook
 * Handles incoming webhooks from Blue project management tool
 */
export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get("x-blue-signature");

        // 1. Signature Validation (HMAC SHA256)
        if (BLUE_WEBHOOK_SECRET && BLUE_WEBHOOK_SECRET !== "") {
            const hmac = crypto.createHmac("sha256", BLUE_WEBHOOK_SECRET);
            const calculatedSignature = hmac.update(bodyText).digest("hex");

            if (signature !== calculatedSignature) {
                console.warn("[Webhook] Invalid signature received");
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        }

        const payload = JSON.parse(bodyText);
        const { event, currentValue, webhook: blueWebhook } = payload;

        console.log(`[Webhook] Received Blue event: ${event}`);

        // 2. Event Routing Logic
        if (event === "TODO_UPDATED" || event === "TODO_CREATED") {
            const isDone = currentValue?.done === true;
            const title = currentValue?.title || "";
            const isAuditTask = /audit|esg|emission|稽核/i.test(title);

            if (isDone && isAuditTask) {
                console.log(`[Webhook] ESG Audit Task Completed: ${title}`);

                // 3. Persist to NCB Database
                const NCB_URL = process.env.NEXT_PUBLIC_NCB_API_URL || "https://api.nocodebackend.com/v1";
                const NCB_KEY = process.env.NEXT_PUBLIC_NCB_API_KEY || "ncb_3457befca0d16ea709c7e72b2c4f00a6d36d1063ca63dce9";
                const NCB_USERDB = process.env.NEXT_PUBLIC_NCB_USERDB_INSTANCE_ID || "54686_esg_go_userdb";

                try {
                    const response = await fetch(`${NCB_URL}/instance/${NCB_USERDB}/table/external_triggers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${NCB_KEY}`
                        },
                        body: JSON.stringify({
                            source: "BLUE",
                            external_id: currentValue?.id || "N/A",
                            event_type: event,
                            payload: bodyText,
                            processed: false,
                            owner_id: "admin" // For RLS scoped readwrite
                        })
                    });

                    if (!response.ok) {
                        const errText = await response.text();
                        console.error("[Webhook] Failed to persist to NCB:", errText);
                    } else {
                        console.log("[Webhook] Successfully persisted trigger to NCB");

                        // 4. Back-fill Acknowledgment to Blue via GraphQL
                        // Only if we have the todoId and a key
                        if (currentValue?.id) {
                            const { BlueService } = await import("@/lib/services/blue-service");
                            await BlueService.postComment(
                                currentValue.id,
                                "✅ **ESG Go 已接收任務**：此稽核項目已進入存證程序。完成後將自動上傳鏈上證據。",
                                { apiKey: NCB_KEY } // Wrap in object
                            );
                        }
                    }
                } catch (dbErr) {
                    console.error("[Webhook] DB Connection Error:", dbErr);
                }

                return NextResponse.json({
                    received: true,
                    action: "QUEST_PROGRESS_PERSISTED",
                    task: title
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[Webhook] Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
