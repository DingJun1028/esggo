import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, NCB_CONFIG } from "@/lib/ncb-utils";
import { OmniCache } from "@/lib/redis-cache";

/**
 * @openapi
 * /api/reports:
 *   post:
 *     summary: Create a new sustainability report
 *     description: Initializes a new ESG report draft in the NCB backend.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               companyName:
 *                 type: string
 *               reportingYear:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Report created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest) {
    const user = await getSessionUser(req.headers.get("cookie") || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Save report metadata to NCB
        const searchParams = new URLSearchParams();
        searchParams.set("Instance", NCB_CONFIG.instance);
        const url = `${NCB_CONFIG.dataApiUrl}/create/sustainability_reports?${searchParams.toString()}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.instance,
                "Cookie": req.headers.get("cookie") || "",
            },
            body: JSON.stringify({
                title: body.title,
                company_name: body.companyName,
                reporting_year: body.reportingYear,
                status: "draft",
                report_data: JSON.stringify(body.data || {}),
                user_id: user.id
            })
        });

        const data = await res.json();

        // Invalidate cache for this user
        const cacheKey = OmniCache.generateKey("reports", user.id);
        await OmniCache.delete(cacheKey);

        return NextResponse.json({
            success: true,
            message: "Report creation initiated",
            report: data.record
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * @openapi
 * /api/reports:
 *   get:
 *     summary: List all sustainability reports
 *     description: Retrieves a list of all ESG reports owned by the current user.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
    const user = await getSessionUser(req.headers.get("cookie") || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = OmniCache.generateKey("reports", user.id);

    return OmniCache.wrap(cacheKey, async () => {
        const searchParams = new URLSearchParams();
        searchParams.set("Instance", NCB_CONFIG.instance);
        const url = `${NCB_CONFIG.dataApiUrl}/list/sustainability_reports?${searchParams.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.instance,
                "Cookie": req.headers.get("cookie") || "",
            }
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    });
}
