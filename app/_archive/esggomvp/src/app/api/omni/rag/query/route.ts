import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/core/rag-engine";

/**
 * 📡 RAG Query API Proxy
 * 
 * 由於 RagEngine 在 Server Side 執行（依賴 NCB API 密鑰），
 * 此路由負責接收前端請求並進行語意檢索。
 */
/**
 * @swagger
 * /omni/rag/query:
 *   post:
 *     summary: 5T 語意知識檢索
 *     description: |
 *       基於 RAG 引擎進行向量語意搜尋，返回 5T 驗證過的知識片段。
 *       所有結果均包含 `hash_lock` 誠信封印，確保知識不可篡改。
 *     tags: [RAG]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: 語意查詢文本
 *                 example: '如何計算 Scope 3 碳排放？'
 *               limit:
 *                 type: integer
 *                 default: 3
 *                 description: 返回結果數量上限
 *     responses:
 *       200:
 *         description: 成功返回語意匹配知識片段
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NexusResponse'
 *       400:
 *         description: 缺少 prompt 參數
 *       500:
 *         description: RAG 引擎內部錯誤
 */
export async function POST(req: NextRequest) {
    try {
        const { prompt, limit } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // 執行 RAG 檢索
        const results = await RagEngine.query(prompt, limit || 3);

        return NextResponse.json({
            success: true,
            data: results,
            metadata: {
                count: results.length,
                timestamp: Date.now()
            }
        });
    } catch (error: any) {
        console.error("[RAG API Error]:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
