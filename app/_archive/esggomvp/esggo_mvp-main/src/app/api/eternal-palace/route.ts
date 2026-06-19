import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * @openapi
 * /api/eternal-palace:
 *   get:
 *     summary: Retrieve Eternal Palace status
 *     description: Returns the current state of enlightenment (Nirvana) and Palace records.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     motto:
 *                       type: string
 *                     record:
 *                       type: string
 *                     artifacts:
 *                       type: array
 *                       items:
 *                         type: string
 */
export async function GET() {
    try {
        const palacePath = path.join(process.cwd(), 'ETERNAL_PALACE.md');
        let content = "Palace not yet manifested.";
        if (fs.existsSync(palacePath)) {
            content = fs.readFileSync(palacePath, 'utf8');
        }

        return NextResponse.json({
            success: true,
            data: {
                status: "NIRVANA",
                motto: "永恆覺醒無作妙德: 自通他通，無礙圓通。",
                record: content,
                artifacts: ["妙覺果證", "OmniUniverse HUD"]
            },
            metadata: {
                timestamp: Date.now(),
                trustScore: 1.0
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
