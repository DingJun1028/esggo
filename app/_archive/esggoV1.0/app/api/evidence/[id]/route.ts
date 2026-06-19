/**
 * GET /api/evidence/[id]?role=Board|Auditor|User
 *
 * Role-aware, server-side masking of sensitive evidence data.
 * Implements the 5T Protocol: only authenticated context can lift masks.
 *
 * Access tiers:
 *   Board   → Full value (unmasked)
 *   Auditor → Range-masked (e.g., "1,000–10,000")
 *   User    → Pseudonymised / fully masked
 */

import { NextRequest, NextResponse } from "next/server";

type ViewRole = "Board" | "Auditor" | "User";

const ALLOWED_ROLES: ViewRole[] = ["Board", "Auditor", "User"];

// Mock evidence store – replace with Supabase or Firestore lookup in production
const MOCK_EVIDENCE: Record<string, { rawValue: number; unit: string; label: string }> = {
    default: { rawValue: 1245.8, unit: "tCO2e", label: "Scope 1 + 2 Emissions" },
};

function maskValue(rawValue: number, unit: string, role: ViewRole): string {
    switch (role) {
        case "Board":
            return `${rawValue.toLocaleString()} ${unit} [FULL ACCESS]`;
        case "Auditor": {
            const lo = Math.floor(rawValue / 1000) * 1000;
            const hi = lo + 1000;
            return `${lo.toLocaleString()}–${hi.toLocaleString()} ${unit} (Range Masked)`;
        }
        case "User":
        default:
            return `***_MASKED_*** (Pseudo Identifier Only)`;
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const role = (req.nextUrl.searchParams.get("role") ?? "User") as ViewRole;

    // Validate role parameter
    if (!ALLOWED_ROLES.includes(role)) {
        return NextResponse.json(
            { error: "Bad Request: 無效的角色參數" },
            { status: 400 }
        );
    }

    // In production: look up from Supabase/Firestore by id + verify auth token
    const raw = MOCK_EVIDENCE[id] ?? MOCK_EVIDENCE["default"];
    const record = raw ?? { rawValue: 0, unit: "tCO2e", label: "Unknown Record" };

    const maskedValue = maskValue(record.rawValue, record.unit, role);

    return NextResponse.json({
        id,
        label: record.label,
        maskedValue,
        role,
        timestamp: new Date().toISOString(),
        protocol: "5T-v1.0",
    });
}
