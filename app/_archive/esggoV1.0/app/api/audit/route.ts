import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

// 強制使用 Node.js Runtime (ChartJSNodeCanvas 依賴原生套件)
export const runtime = "nodejs";

// 1. 定義 ESG 稽核結果的 Zod Schema
const EsgAuditResultSchema = z.object({
    isLogical: z.boolean().describe("邏輯是否連貫"),
    dataConcerns: z.array(z.string()).describe("數據疑慮清單，若無則為空陣列"),
    suggestions: z.array(z.string()).describe("具體的優化建議清單"),
});

// 2. 初始化 Upstash Redis 與 Rate Limiter (加入環境變數檢查以避免建置時錯誤)
const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

const ratelimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
    })
    : null;

// 初始化 Gemini SDK (使用後端環境變數)
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(request: Request) {
    try {
        // 1. Rate Limit 檢查 (僅在環境變數配置正確時執行)
        if (ratelimit) {
            const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
            const { success, limit, reset, remaining } = await ratelimit.limit(ip);

            if (!success) {
                return NextResponse.json(
                    { error: "伺服器忙碌中，請稍後再試。" },
                    {
                        status: 429,
                        headers: {
                            "X-RateLimit-Limit": limit.toString(),
                            "X-RateLimit-Remaining": remaining.toString(),
                            "X-RateLimit-Reset": reset.toString(),
                        },
                    }
                );
            }
        }

        // 2. 解析請求數據
        const body = await request.json();
        const { reportContent, chartData, width = 800, height = 400 } = body;

        let auditResult = null;
        let base64Image = null;

        // 3. 執行 AI 稽核 (若提供報告內容)
        if (reportContent) {
            const prompt = `
        你是一位專業的 ESG 稽核員。請依據以下報告內容進行核查，並回傳格式嚴格符合 JSON 的結果。
        內容：
        ${reportContent}
        
        回傳格式：
        {
          "isLogical": boolean,
          "dataConcerns": string[],
          "suggestions": string[]
        }
      `;

            const aiResponse = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            isLogical: { type: "BOOLEAN" },
                            dataConcerns: { type: "ARRAY", items: { type: "STRING" } },
                            suggestions: { type: "ARRAY", items: { type: "STRING" } },
                        },
                        required: ["isLogical", "dataConcerns", "suggestions"],
                    },
                },
            });

            const text = aiResponse.text || "{}";
            const rawJson = JSON.parse(text);
            auditResult = EsgAuditResultSchema.parse(rawJson);
        }

        // 4. 執行圖表生成 (Vercel 相容性優化：暫時停用伺服器端繪圖以避免原生套件錯誤)
        // 圖表顯示將改由前端 Client-side 處理
        if (chartData && Array.isArray(chartData)) {
            base64Image = null; // 伺服器端不再產生圖表 Base64
        }

        return NextResponse.json({
            success: true,
            auditResult,
            base64Image,
        });
    } catch (error: any) {
        console.error("ESG Audit API 執行失敗:", error);
        return NextResponse.json(
            { error: "伺服器處理要求時發生錯誤", details: error.message },
            { status: 500 }
        );
    }
}
