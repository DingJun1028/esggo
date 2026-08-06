/**
 * ESGGO 免費層整合索引
 *
 * 每個子模組僅宣告「需要的 env key / usage / 接線路徑」
 * 實際憑證請放在 .env / Vault，不要由這裡回傳真實值。
 */
export const FREE_TIER = {
  oracle: {
    envKeys: [
      "OCI_TENANCY_OCID","OCI_USER_OCID","OCI_FINGERPRINT",
      "OCI_PRIVATE_KEY_PATH","OCI_COMPARTMENT_ID","OCI_VAULT_SECRET_OCID"
    ],
    path: "infra/vps/oracle-free-tier.md",
    note: "VPS 主機 + Block Vol + Object Storage + ADB 備用"
  },
  gcp: {
    envKeys: ["GOOGLE_APPLICATION_CREDENTIALS","GOOGLE_CLOUD_PROJECT","GCP_LOCATION"],
    path: "docs/GCP-FREE-TIER-SAFETY-GUIDE.md",
    note: "Gemini + Firestore + BigQuery + Cloud Run"
  },
  firebase: {
    envKeys: [
      "FIREBASE_SERVICE_ACCOUNT_JSON",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_DATABASE_URL"
    ],
    path: "platform/config/free-tier/firebase.md",
    note: "Spark 免費層：Firestore/Auth/Hosting/Functions"
  },
  cloudflare: {
    envKeys: ["CLOUDFLARE_ACCOUNT_ID","CLOUDFLARE_API_TOKEN","CLOUDFLARE_AI_GATEWAY_URL"],
    path: "platform/config/free-tier/cloudflare.md",
    note: "AI Workers 10K req/日 + WAF + Zero Trust"
  },
  notion: {
    envKeys: ["NOTION_TOKEN","NOTION_DATABASE_ID","NOTION_VERSION"],
    path: "platform/config/free-tier/notion.md",
    note: "5T 合規資產同步，block quota 注意"
  },
  telegram: {
    envKeys: ["TELEGRAM_BOT_TOKEN","TELEGRAM_CHAT_ID"],
    path: "infra/scripts/telegram-alert.sh",
    note: "Bot API 免費，CD/系統失敗警報"
  },
  upstash: {
    envKeys: ["UPSTASH_REDIS_REST_URL","UPSTASH_REDIS_REST_TOKEN"],
    path: "platform/config/free-tier/upstash.md",
    note: "Redis 10K req/日，REST API"
  },
  groq: {
    envKeys: ["GROQ_API_KEY","GROQ_MODEL"],
    path: "platform/config/free-tier/groq.md",
    note: "30 req/min 免費推論，已配置"
  },
  openrouter: {
    envKeys: ["OPENROUTER_API_KEY","OPENROUTER_MODEL"],
    path: "platform/config/free-tier/openrouter.md",
    note: "200 req/day 免費層，已配置"
  },
  gemini: {
    envKeys: ["GEMINI_API_KEY","GOOGLE_CLOUD_PROJECT"],
    path: "platform/config/free-tier/gemini.md",
    note: "Gemini Free Tier，已配置"
  }
} as const;

export type FreeTierProvider = keyof typeof FREE_TIER;

/**
 * 取得指定供應商的 env 需求
 */
export function getFreeTier(provider: FreeTierProvider) {
  return FREE_TIER[provider];
}

/**
 * 檢查環境變數是否存在
 */
export function checkEnv(provider: FreeTierProvider): boolean {
  const keys = FREE_TIER[provider].envKeys;
  return keys.some(key => !!process.env[key]);
}
