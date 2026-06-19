import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';

/**
 * @swagger
 * /docs/swagger.json:
 *   get:
 *     summary: 取得 OpenAPI 規格文件
 *     description: 返回 InfoOne OmniNexus API 的完整 Swagger/OpenAPI 3.0 規格。
 *     tags: [Nexus]
 *     security: []
 *     responses:
 *       200:
 *         description: OpenAPI 規格 JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
    return NextResponse.json(swaggerSpec, {
        headers: {
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
