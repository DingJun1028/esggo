"use client";

import { useCallback } from "react";

const SITE_KEY = "6Ldek6osAAAAAOrXT4VChbhORIC_5zUjCaEyHBrt";

// Extend the Window interface for TypeScript
declare global {
    interface Window {
        grecaptcha: {
            enterprise: {
                ready: (callback: () => void) => void;
                execute: (
                    siteKey: string,
                    options: { action: string }
                ) => Promise<string>;
            };
        };
    }
}

export type RecaptchaAction =
    | "LOGIN"
    | "SIGNUP"
    | "SUBMIT_REPORT"
    | "UPLOAD_EVIDENCE"
    | "PASSWORD_RESET"
    | "PUBLISH_REPORT";

/**
 * useRecaptcha — Google reCAPTCHA Enterprise Hook
 *
 * 使用方式：
 * const { executeRecaptcha } = useRecaptcha();
 * const token = await executeRecaptcha("LOGIN");
 * // 將 token 傳送到後端進行驗證
 */
export function useRecaptcha() {
    const executeRecaptcha = useCallback(
        (action: RecaptchaAction): Promise<string> => {
            return new Promise((resolve, reject) => {
                if (typeof window === "undefined" || !window.grecaptcha?.enterprise) {
                    // 本地開發環境：跳過 reCAPTCHA
                    console.warn("[reCAPTCHA] Not available, skipping in dev mode.");
                    resolve("dev-bypass-token");
                    return;
                }

                window.grecaptcha.enterprise.ready(async () => {
                    try {
                        const token = await window.grecaptcha.enterprise.execute(
                            SITE_KEY,
                            { action }
                        );
                        resolve(token);
                    } catch (err) {
                        console.error("[reCAPTCHA] Execute failed:", err);
                        reject(new Error("reCAPTCHA 驗證失敗，請重試。"));
                    }
                });
            });
        },
        []
    );

    return { executeRecaptcha, siteKey: SITE_KEY };
}
