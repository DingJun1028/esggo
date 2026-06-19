import { NextRequest, NextResponse } from "next/server";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const PROJECT_ID = "esg-sunshine";
const RECAPTCHA_SITE_KEY = "6Ldek6osAAAAAOrXT4VChbhORIC_5zUjCaEyHBrt";

// 快取 client 實例（建議做法）
let _client: RecaptchaEnterpriseServiceClient | null = null;
function getClient() {
    if (!_client) {
        _client = new RecaptchaEnterpriseServiceClient();
    }
    return _client;
}

/**
 * POST /api/recaptcha/verify
 *
 * Body: { token: string, action: string }
 *
 * 使用 @google-cloud/recaptcha-enterprise 官方 SDK 建立評估作業，
 * 分析 UI 動作的風險分數（0.0 ~ 1.0，越高越安全）。
 */
export async function POST(req: NextRequest) {
    try {
        const { token, action: recaptchaAction } = await req.json();

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Missing reCAPTCHA token" },
                { status: 400 }
            );
        }

        // 本地開發 bypass token
        if (token === "dev-bypass-token") {
            return NextResponse.json({ success: true, score: 1.0, action: recaptchaAction });
        }

        const client = getClient();
        const projectPath = client.projectPath(PROJECT_ID);

        // 建立評估要求
        const request = {
            assessment: {
                event: {
                    token,
                    siteKey: RECAPTCHA_SITE_KEY,
                },
            },
            parent: projectPath,
        };

        const [response] = await client.createAssessment(request);

        // 確認權杖是否有效
        if (!response.tokenProperties?.valid) {
            const reason = response.tokenProperties?.invalidReason ?? "UNKNOWN";
            console.warn(`[reCAPTCHA] Token invalid. Reason: ${reason}`);
            return NextResponse.json(
                { success: false, error: `Token invalid: ${reason}`, score: 0 },
                { status: 400 }
            );
        }

        // 確認動作是否符合預期
        if (response.tokenProperties.action !== recaptchaAction) {
            console.warn(
                `[reCAPTCHA] Action mismatch: expected "${recaptchaAction}", got "${response.tokenProperties.action}"`
            );
            return NextResponse.json(
                { success: false, error: "Action mismatch", score: 0 },
                { status: 400 }
            );
        }

        const score: number = response.riskAnalysis?.score ?? 0;
        const reasons = response.riskAnalysis?.reasons ?? [];

        // 記錄評分與風險原因
        console.log(`[reCAPTCHA] Action: ${recaptchaAction} | Score: ${score}`);
        reasons.forEach((r) => console.log(`[reCAPTCHA] Reason: ${r}`));

        // 評分閾值：< 0.5 視為可疑
        const success = score >= 0.5;

        return NextResponse.json({ success, score, action: recaptchaAction, reasons });
    } catch (error) {
        console.error("[reCAPTCHA] Assessment error:", error);
        return NextResponse.json(
            { success: false, error: "Assessment failed" },
            { status: 500 }
        );
    }
}
