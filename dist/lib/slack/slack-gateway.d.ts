/**
 * ESGGO 善向永續 | Slack OmniAgent Gateway
 * ─────────────────────────────────────────────────────
 * Slack Socket Mode 整合閘道 (Hermes-compatible)
 *
 * 採用 Slack Web API (REST) 模式呼叫，適用於 Next.js API Routes
 * 無需安裝 @slack/bolt (避免 Node.js 伺服器依賴衝突)
 *
 * 功能：
 *   1. 推播 5T 報告通知 (push5TReport)
 *   2. 推播 OmniAgent 任務完成摘要 (pushAgentSummary)
 *   3. 推播警報 / 合規異常 (pushAlert)
 *   4. 驗證 Slack 簽名 (verifySlackSignature)
 *   5. 解析 Slash Command 請求 (parseSlashCommand)
 */
export interface SlackPostMessagePayload {
    channel: string;
    text?: string;
    blocks?: SlackBlock[];
    thread_ts?: string;
}
export interface SlackBlock {
    type: string;
    [key: string]: unknown;
}
export interface SlackSlashCommand {
    command: string;
    text: string;
    user_id: string;
    channel_id: string;
    response_url: string;
}
export interface Slack5TReportPayload {
    channel?: string;
    companyName: string;
    reportDate: string;
    t1Truth: number;
    t2Transparent: number;
    t3Tangible: number;
    t4Trustworthy: number;
    t5Trackable: number;
    overallScore: number;
    reportUrl?: string;
    triggeredBy?: string;
}
export interface SlackAlertPayload {
    channel?: string;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    sourceModule?: string;
    referenceId?: string;
}
/**
 * 將 5T 評分報告以 Block Kit 格式推播至 Slack 頻道
 */
export declare function push5TReport(payload: Slack5TReportPayload): Promise<void>;
export interface SlackAgentSummaryPayload {
    channel?: string;
    taskId: string;
    taskTitle: string;
    status: 'completed' | 'failed' | 'partial';
    duration: string;
    agentName?: string;
    resultSummary: string;
    artifacts?: string[];
}
/**
 * 推播代理蜂群任務執行摘要
 */
export declare function pushAgentSummary(payload: SlackAgentSummaryPayload): Promise<void>;
/**
 * 推播系統警報至 Slack 頻道
 */
export declare function pushAlert(payload: SlackAlertPayload): Promise<void>;
/**
 * 驗證 Slack 傳入的請求簽名，防止偽造請求
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
export declare function verifySlackSignature(body: string, timestamp: string, signature: string): boolean;
/**
 * 解析 Slack Slash Command 的 URL-encoded body
 */
export declare function parseSlashCommand(rawBody: string): SlackSlashCommand;
/**
 * 驗證使用者是否在允許名單中
 */
export declare function isSlackUserAllowed(userId: string): boolean;
//# sourceMappingURL=slack-gateway.d.ts.map