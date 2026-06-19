import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Workspace File Discovery API
 * Lists files in the project to provide context for AI analysis.
 */
export async function GET() {
    try {
        const rootDir = process.cwd();
        const files: string[] = [];

        function scan(dir: string, depth: number = 0) {
            if (depth > 3) return;
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.name.startsWith(".") || entry.name === "node_modules") continue;

                const fullPath = path.join(dir, entry.name);
                const relPath = path.relative(rootDir, fullPath);

                if (entry.isDirectory()) {
                    files.push(`${relPath}/`);
                    scan(fullPath, depth + 1);
                } else {
                    files.push(relPath);
                }
            }
        }

        scan(rootDir);

        return NextResponse.json({ files });
    } catch (error) {
        console.error("Workspace scan failed:", error);
        return NextResponse.json({ error: "Failed to scan workspace" }, { status: 500 });
    }
}
