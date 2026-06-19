import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SquadAuditService } from "@/lib/services/squad-audit";

const DATA_PATH = path.join(process.cwd(), "lib/data/squad.json");

async function getSquadData() {
    try {
        const data = await fs.readFile(DATA_PATH, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        return { members: [] };
    }
}

async function saveSquadData(data: any) {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
    const data = await getSquadData();
    return NextResponse.json({ success: true, members: data.members });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { members } = body;

        if (!Array.isArray(members)) {
            return NextResponse.json({ success: false, error: "Invalid members data" }, { status: 400 });
        }

        const oldData = await getSquadData();
        const auditService = SquadAuditService.getInstance();

        await saveSquadData({ members });

        // Log the change
        const added = members.filter((m: any) => !oldData.members.find((om: any) => om.id === m.id));
        const removed = oldData.members.filter((om: any) => !members.find((m: any) => m.id === om.id));

        if (added.length > 0) {
            await auditService.logEvent("SQUAD_RECRUIT", "Admin_Portal", { count: added.length, ids: added.map((m: any) => m.id) });
        }
        if (removed.length > 0) {
            await auditService.logEvent("SQUAD_DISMISS", "Admin_Portal", { count: removed.length, ids: removed.map((m: any) => m.id) });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to save squad" }, { status: 500 });
    }
}
