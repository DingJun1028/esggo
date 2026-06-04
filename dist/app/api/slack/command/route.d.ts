/**
 * ESGGO Slack Slash Command Handler
 * Route: POST /api/slack/command
 *
 * 支援的指令（與 slack-manifest.json 一致）：
 *   /esg-five-t [公司名]  — 觸發 5T 協議即時評分報告
 *   /esg-status           — 回傳 OmniAgent 閘道狀態
 *   /esg-alert [訊息]     — 手動推播警報
 *   /omni [指令]          — 傳遞至 OmniAgent 執行
 */
import { NextRequest, NextResponse } from 'next/server';
export declare const runtime = "nodejs";
export declare function POST(req: NextRequest): Promise<NextResponse>;
//# sourceMappingURL=route.d.ts.map