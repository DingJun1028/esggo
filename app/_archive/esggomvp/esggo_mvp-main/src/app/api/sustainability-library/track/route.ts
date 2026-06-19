/**
 * 🌿 Sustainability Library — Track Route
 * POST /api/sustainability-library/track
 * Body: { id: string, event: 'view' | 'download' }
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id, event } = await req.json();

        if (!id || !["view", "download"].includes(event)) {
            return NextResponse.json({ success: false, error: "Invalid tracking event" }, { status: 400 });
        }

        const instance = process.env.NCB_INSTANCE;
        const dataApiUrl = process.env.NCB_DATA_API_URL;

        if (instance && dataApiUrl) {
            // 找到資源的數字 id
            const listUrl = `${dataApiUrl}/list/sustainability_resources?Instance=${instance}&filter=resource_id:${id}&limit=1`;
            const listRes = await fetch(listUrl, {
                headers: { "Content-Type": "application/json", "X-Database-Instance": instance },
                cache: "no-store",
            });

            if (listRes.ok) {
                const listJson = await listRes.json();
                const row = listJson.data?.[0];
                if (row) {
                    const field = event === "view" ? "view_count" : "download_count";
                    const newCount = (row[field] || 0) + 1;
                    // 更新計數器
                    await fetch(`${dataApiUrl}/update/sustainability_resources/${row.id}?Instance=${instance}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "X-Database-Instance": instance },
                        body: JSON.stringify({ [field]: newCount }),
                    });
                }
            }
        }

        return NextResponse.json({ success: true, resourceId: id, eventType: event });
    } catch {
        // 追蹤失敗不影響主流程
        return NextResponse.json({ success: false });
    }
}
